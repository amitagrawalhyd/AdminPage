import React, { useState, useEffect, createContext, useContext, cloneElement } from "react";
import { Constants } from "../../constants/credentials";
import Cookies from "js-cookie";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { create } from "@mui/material/styles/createTransitions";
// import { getUsers } from "../../APIs/getUsers";
import { useInitialValues, useAddUser } from "./AddUser";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import saveAs from "file-saver";
import Loader from "react-js-loader";

const ExcelJS = require("exceljs");

export const getToken = () => {
  const token = sessionStorage.getItem("token");
  return token;
};

export default function UserList() {
  const [registrations, setRegistrations] = useState([]); // users
  let heading = ["Mobile Number", "Name", "City", "User type", "Actions"];
  const options = ["All", "Company", "Distributer", "Dealer", "Mechanic"]; //for dropdown
  const defaultOption = options[0]; //dropdown menu default option
  const [selected, setSelected] = useState(""); // Define 'selected' here
  const { setEditmode, setEditValues } = useAddUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationtypes, setRegistrationTypes] = useState([]); 
  const Api = Constants.api;


  setEditmode(false);



  useEffect(() => {
    let getDataCalled = false;

    const getTransactionDetails = async () => {
      setLoading(true);
      if (!getDataCalled) {
        getDataCalled = true;
        const CompanyId = sessionStorage.getItem("CompanyId");
        const mobileNumber = sessionStorage.getItem('mobileNumber');

        if (mobileNumber) {
          const resp = await fetch(
            `${Api}/Registration/GetRegistrations/${CompanyId}`,
            {
              method: 'GET',
              headers: new Headers({
                Authorization: `Bearer ${getToken()}`,
              }),
            },
          );
          const responseData = await resp.json();
          setRegistrations(responseData);

          const respose = await fetch(
            `${Api}/Registration/GetRegistrationTypes/${CompanyId}/${mobileNumber}`,
            {
              method: 'GET',
              headers: new Headers({
                Authorization: `Bearer ${getToken()}`,
              }),
            },
          );
          const respJson = await respose.json();
    setRegistrationTypes(respJson);

          setLoading(false);
        }
      }
    };
    getTransactionDetails();
  }, []);





  function filterUsers(user) {
    if (user.registrationType === "Company" && selected === "Company") {
      return user;
    } else if (
      user.registrationType === "Distributer" &&
      selected === "Distributer"
    ) {
      return user;
    } else if (user.registrationType === "Dealer" && selected === "Dealer") {
      return user;
    } else if (
      user.registrationType === "Mechanic" &&
      selected === "Mechanic"
    ) {
      return user;
    } else if (selected === "" || selected === 'All') {
      return user;
    }
  }

  const filteredUsers =
    !registrations.message && registrations?.filter(filterUsers);

  //edit user
  function handleEdit(user) {
    console.log("user to be edited", user);
    setEditmode(true);
    setEditValues({
      dropdown: user.registrationTypeExtId,
      mobileNumber: user.registerMobileNumber,
      name: user.registerName,
      address1: user.registerAddress1,
      address2: user.registerAddress2,
      city: user.city,
      state: user.state,
      pincode: user.pinCode,
      upiAddress: user.upiAddress,
      aadhaarNumber: user.adhaarNumber,
      panNumber: user.panNumber,
    });
    // console.log("initialValues",initialValues)
    // formik.handleSubmit(user);
    // toggleEdit();
    navigate("/adduser");
  }

  //delete or restore user
  function handleDeleteOrRestore(user) {
    user.isActive = !user.isActive; //toggle user status
    // console.log('user status before:',user.isActive);
    user.isActive
      ? alert(JSON.stringify(user.registerName) + " Account restored")
      : alert(JSON.stringify(user.registerName) + " Account deleted");

    fetch(`${Api}/Registration/SaveRegistration`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("response from delete user:", responseData);
      })
      .catch((error) => console.log(error));
    navigate("/userlist");
  }

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    sheet.columns = [
      {
        header: "Mobile Number",
        key: "mobileNumber",
        width: 20,
      },
      {
        header: "Name",
        key: "name",
        width: 20,
      },
      {
        header: "City",
        key: "city",
        width: 20,
      },
      {
        header: "User Type",
        key: "userType",
        width: 15,
      },
    ];
    console.log("registrations before export:", registrations);

    const promise = Promise.all(
      filteredUsers?.map(async (user) => {
        // const rowNumber = index + 1;
        sheet.addRow({
          mobileNumber: user.registerMobileNumber,
          name: user.registerName,
          city: user.city,
          userType: user.registrationType,
        });
        // return(registrations);
      })
    );
    promise.then(() => {
      console.log("promise:", promise);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "userlist.xlsx");
    });
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "85vh",
          }}
        >
          <Loader bgColor={"#16210d"} type="spinner-cub" />
        </div>
      ) : (
        <div style={{ width: "100%", }}>
          <div style={{alignItems:"center",flexDirection:'column',}}>
            <h4 className="header mb-4 font-weight-bold">User List</h4>
            <select
            className="form-control user_list_drop_down"
              name="dropdown"
              onChange={(event) => {
                setSelected(event.target.value);
              }}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
              }}
            >
              {!registrationtypes.message && (
                <>
                  <option value="All">All</option>
                  {registrationtypes?.map((type) => (
                    <option
                      key={type.registrationTypeName}
                      value={type.registrationTypeName}
                    >
                      {type.registrationTypeName}
                    </option>
                  ))}
                </>
              )}
            </select>

            <table className="table table-striped">
              <thead style={{ justifyContent: "center" }}>
                <tr>
                  {heading.map((head, headID) => (
                    <th key={headID}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!registrations.message &&
                  filteredUsers?.map((user) => (
                    <tr>
                      <td className="user">{user.registerMobileNumber}</td>
                      <td className="user"> {user.registerName}</td>
                      <td className="user">{user.city}</td>
                      <td className="user">{user.registrationType}</td>
                      <td>
                        {user.registrationType !== "Company" && (
                          <>
                            <button
                              // className={user.isActive? "btn btn-secondary": "btn btn-light" }
                              style={{
                                color: "white",
                                padding: 5,
                                borderRadius: 5,
                                backgroundColor:
                                  user.isActive === true ? "blue" : "grey",
                                border: 0,
                                width: "30%",
                                cursor:
                                  user.isActive === true
                                    ? "pointer"
                                    : "not-allowed",
                              }}

                              disabled={!user.isActive}
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              type="submit"
                              style={{
                                color: "white",
                                padding: 5,
                                borderRadius: 5,
                                backgroundColor:
                                  user.isActive === true ? "red" : "green",
                                border: 0,
                                width: "55%",
                                marginLeft: 8,
                              }}
                              onClick={() => handleDeleteOrRestore(user)}
                            >
                              {user.isActive ? "Delete" : "Restore"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length !== 0 && (
            <button
              className="btn btn-secondary float-end mt-2 mb-2"
              onClick={exportExcelFile}
            >
              Export to Excel
            </button>
          )}
        </div>
      )}
    </>
  );
}
