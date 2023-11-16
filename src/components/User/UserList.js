import React, { useState, useEffect, createContext,useContext } from "react";
import { Constants } from "../../constants/credentials";
import Cookies from "js-cookie";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { create } from "@mui/material/styles/createTransitions";
// import { getUsers } from "../../APIs/getUsers";
import { useInitialValues, useAddUser} from './AddUser';
import { useNavigate, } from "react-router-dom";
import { CSVLink } from "react-csv";
import saveAs from 'file-saver';
const ExcelJS = require("exceljs");


export const getToken = () => {
  const token = sessionStorage.getItem("token");
  return token;
};


export default function UserList() {
  const CompanyId = sessionStorage.getItem('CompanyId');
  const storedMobileNumber = sessionStorage.getItem("mobileNumber");
  const [registrations, setRegistrations] = useState([]); // users
  let heading = ["Mobile Number", "Name", "City", "User type", "Actions"];
  const options = ["All", "Company", "Distributer", "Dealer", "Mechanic"]; //for dropdown
  const defaultOption = options[0]; //dropdown menu default option
  const [selected, setSelected] = useState(options[0]); //default value of dropdown
  const { setInitialValues, setEditmode, setEditValues} = useAddUser();
  const navigate = useNavigate();
  setEditmode(false);

  // if(editmode){
  //   navigate('/userlist')
  // }

  // const [editMode, setEditMode] = useState(false);
  // const [token, setToken] = useState("");
  // const token = sessionStorage.getItem('token');
  // setToken(Cookies.get(token))


  // useEffect(() => {
  //   // console.log('useEffect triggered with token:', token);
  //   // setToken(sessionStorage.getItem('token'))
  //   getRegistrationTypes()
  //   getAdminDetails()
  //   getUsers()
  // }, []);// add token as dependency

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${CompanyId}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${getToken()}`,
          }),
        }
      );
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      const data = await response.json();
      // if(data.message){getUsers()}
      setRegistrations(data);
    } catch (error) {
      console.error("Error from get users api:", error);
      // alert("hello");
    }
  };
  // console.log("registrations:", registrations);

  // console.log('shifted:',arr);
  // const userTypes = [];
  // registrationTypes.forEach((type) => {
  //   if (type.registrationTypeName != "Company")
  //     console.log("sentence", type.registrationTypeName);
  // });

  //   Object.keys(registrationTypes[]).forEach(function() {
  //     console.log("testing success",registrationTypes[0].registrationTypeName);
  //  })
  function handleSelect(e) {
    // on select dropdown
    setSelected(e.value);
    // getTransactions();
  }

  // function handleChange(e) {
  //   // registrationTypeExtId = e.target.value;
  //   // console.log(registrationTypeExtId);
  // }

  // console.log('selected from user list:',selected)

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
    } else if (user.registrationType === "Mechanic" && selected === "Mechanic") {
      return user;
    } else if (selected === "All") {
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
        ? alert(JSON.stringify(user.registerName)+ " Account restored")
        : alert(JSON.stringify(user.registerName)+ " Account deleted");
    
      fetch(`http://183.83.219.144:81/LMS/Registration/SaveRegistration`, {
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
      // sheet.properties.defaultRowHeight = 80;
  
      // sheet.getRow(1).border = {
      //   top: { style: "thick", color: { argb: "FFFF0000" } },
      //   left: { style: "thick", color: { argb: "000000FF" } },
      //   bottom: { style: "thick", color: { argb: "F08080" } },
      //   right: { style: "thick", color: { argb: "FF00FF00" } },
      // };
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
        }
      ];
      console.log('registrations before export:',registrations);
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
      promise.then(() =>{console.log('pormise:',promise)
    })

    
    // registrations.forEach((user) => {
    //   sheet.addRow(user);
    // });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'userlist.xlsx');
    });
    }
    

  return (
    <div style={{ width: "100%",}}>
      <div style={{ width: "70%" }}>
        <h4 className="header mb-2">User List</h4>
        <Dropdown
          className="user_dropdown"
          options={options}
          onChange={handleSelect}
          value={defaultOption}
          // placeholder="Select an option"
        />
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
                    {user.registrationType !== "Company" && 
                    <>
                    <button
                      // className={user.isActive? "btn btn-secondary": "btn btn-light" } 
                       style={{
                       color:'white',
                       padding: 5,
                       borderRadius: 5,
                       backgroundColor:
                       user.isActive === true ? "blue" : "grey",
                       border:0,
                       width:'30%',
                       cursor : user.isActive === true ?"pointer":"not-allowed"
                      }}
                      // borderColor={user.isActive? 'aqua' : 'pink'}
                      
                      disabled={!user.isActive}  
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="submit"
                      style={{
                       color:'white',
                       padding: 5,
                       borderRadius: 5,
                       backgroundColor:
                       user.isActive === true ? "red" : "green",
                       border:0,
                       width:'55%',
                       marginLeft:8,
                      }}

                      onClick={() => handleDeleteOrRestore(user)}
                    >
                      {user.isActive ? "Delete" : "Restore"}
                    </button>
                    </>
                  }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-secondary float-end mt-2 mb-2"
        onClick={exportExcelFile}
      >
        Export to Excel
      </button>
    </div>
  );
}
