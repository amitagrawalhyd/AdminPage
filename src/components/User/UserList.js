import React, { useState, useEffect } from "react";
import { Constants } from "../../constants/credentials";
import Cookies from "js-cookie";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useFormik } from "formik";

export default function UserList() {
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const storedMobileNumber = Cookies.get("mobileNumber");
  const [registrations, setRegistrations] = useState([]); // users
  const [registrationTypes, setRegistrationTypes] = useState([]); // types of registrations (distributor,dealer,mechanic)
  const [adminDetails, setAdminDetails] = useState([]); // admin details
  let heading = ["Mobile Number", "Name", "City", "User type","Actions"];
  const options = ["All", "Company", "Distributer", "Dealer", "Mechanic"]; //for dropdown
  const [selected, setSelected] = useState(options[0]); //default value of dropdown
  const defaultOption = options[0]; //dropdown menu default option
  const [initialValues, setInitialValues] = useState({
    dropdown: "----",
    mobileNumber: "",
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    upiAddress: "",
    aadhaarNumber: "",
    panNumber: "",
  });
  const [editMode,setEditMode] = useState(false);

  var adminRegistrationId = 0;

  const getUsers = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${companyId}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const data = await resp.json();
    setRegistrations(data);
  };
  console.log("registrations:", registrations);
  const getAdminDetails = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${companyId}?mobileNumber=${storedMobileNumber}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const data = await resp.json();
    setAdminDetails(data[0]);
  };
  adminRegistrationId = adminDetails && adminDetails.registrationId;

  // console.log("admin: ", adminRegistrationId);

  const getRegistrationTypes = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrationTypes/${companyId}/${storedMobileNumber}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const data = await resp.json();
    setRegistrationTypes(data);
  };

  // console.log('registration types:',registrationTypes);
  // const userTypes = [];
  // registrationTypes.forEach((type) => {
  //   if (type.registrationTypeName != "Company")
  //     console.log("sentence", type.registrationTypeName);
  // });

  useEffect(() => {
    getAdminDetails();
    getUsers();
    getRegistrationTypes();
  }, []); //token added for runtime error handling

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

  function handleEdit(user) {
    // console.log("user to be edited", user);
    setEditMode(true);
    setInitialValues({
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
    })
    console.log("initialValues",initialValues)
    // formik.handleSubmit(user);
  }

  function handleDeleteOrRestore(user) {
  user.isActive = user.isActive ?  false : true;
    // console.log('user status before:',user.isActive);
    user.isActive ? alert("user ",user.registerName," restored") : alert("user ",user.registerName," deleted")
    
    fetch(`http://183.83.219.144:81/LMS/Registration/SaveRegistration`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("response from delete user:", responseData);
      })
      .catch((error) => console.log(error));
  }

  function filterUsers(user) {
    if (user.registrationType == "Company" && selected == "Company") {
      return user;
    } else if (
      user.registrationType == "Distributer" &&
      selected == "Distributer"
    ) {
      return user;
    } else if (user.registrationType == "Dealer" && selected == "Dealer") {
      return user;
    } else if (user.registrationType == "Mechanic" && selected == "Mechanic") {
      return user;
    } else if (selected == "All") {
      return user;
    }
  }

  const filteredUsers = registrations?.filter(filterUsers);

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required";
    }
    // else if (values.lastName.length > 20) {
    //   errors.lastName = 'Must be 20 characters or less';
    // }

    if (!values.pincode) {
      errors.pincode = "Pincode is required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize : true,
    validate,
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
      alert('submitted successfully')
      // console.log(registrationTypeExtId);
      // console.log('admin id onsubmit:',adminRegistrationId,"user type:",registrationTypeExtId);

      fetch(`http://183.83.219.144:81/LMS/Registration/SaveRegistration`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          registrationId: 0,
          companyId: companyId, //required
          registrationTypeId: 0,
          registrationTypeExtId: values.dropdown, //required
          registrationType: "",
          registerMobileNumber: values.mobileNumber, //required
          registerImeiNumber: "",
          pin: "",
          registerName: values.name, //`${values.name}`//required
          registerAddress1: values.address1, //required
          registerAddress2: values.address2, //required
          city: values.city, //required
          state: values.state, //required
          pinCode: values.pincode, //required
          parentRegistrationId: adminRegistrationId, //required
          walletValue: 0,
          expiredWalletValue: 0,
          paidValue: 0,
          upiAddress: "", //input field
          adhaarNumber: "", //input field
          panNumber: "", //input field
          isActive: true, //required
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("response from saveRegistration:", responseData);
        })
        .catch((error) => console.log(error));
    },
  });

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <div style={{ width: "70%" }}>
        <h4 className="header mb-2">User List</h4>
        <Dropdown
          className="user_dropdown"
          options={options}
          onChange={handleSelect}
          value={defaultOption}
          placeholder="Select an option"
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
            {filteredUsers?.map((user) => (
              <tr>
                <td className="user">{user.registerMobileNumber}</td>
                <td className="user"> {user.registerName}</td>
                <td className="user">{user.city}</td>
                <td className="user">{user.registrationType}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(user)}>Edit</button>
                  <button type="submit" className={ user.isActive ? "btn btn-danger ml-2" : "btn btn-success ml-2"} onClick={() => handleDeleteOrRestore(user)}>{user.isActive ? "Delete" : "Restore" }</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ width: "30%" }}>
        <form onSubmit={formik.handleSubmit}>
          {/* <Dropdown
          className="user_dropdown"
          options={registrationTypes}
          // onChange={handleSelectType}
          value="-----"
          // placeholder="Select an option"
        /> */}
          <label>Select type of user:</label>
          <select
            value={formik.values.dropdown}
            name="dropdown"
            onChange={formik.handleChange}
            disabled={editMode}
          >
            {registrationTypes?.map((type) => {
              return (
                <>
                {type.registrationTypeName != "Company" &&
                <option
                  key={type.registrationTypeExtId}
                  value={type.registrationTypeExtId}
                >
                    {type.registrationTypeName}
                </option>

              }
                </>
              );
            })}
          </select>

          <br />
          <label> Mobile Number: </label>
          {/* <br /> */}
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="mobileNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={editMode}
            value={formik.values.mobileNumber}
          />
          {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
            <p style={{ color: "red" }}>{formik.errors.mobileNumber}</p>
          ) : null}
          <br />
          <label>Name: </label>
          <input
            id="name"
            name="name"
            type="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <p style={{ color: "red" }}>{formik.errors.name}</p>
          ) : null}
          <br />
          <label>Address1: </label>
          <input
            id="address1"
            name="address1"
            type="address1"
            onChange={formik.handleChange}
            value={formik.values.address1}
          />
          <br />
          <label>Address2: </label>
          <input
            id="address2"
            name="address2"
            type="address2"
            onChange={formik.handleChange}
            value={formik.values.address2}
          />
          <br />
          <label>City: </label>
          <input
            id="city"
            name="city"
            type="city"
            onChange={formik.handleChange}
            value={formik.values.city}
          />
          <br />
          <label>State: </label>
          <input
            id="state"
            name="state"
            type="state"
            onChange={formik.handleChange}
            value={formik.values.state}
          />
          <br />
          <label>Pincode: </label>
          <input
            id="pincode"
            name="pincode"
            type="pincode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pincode}
          />
          {formik.touched.pincode && formik.errors.pincode ? (
            <p style={{ color: "red" }}>{formik.errors.pincode}</p>
          ) : null}
          <br />
          <label>UPI Address: </label>
          <input
            id="upiAddress"
            name="upiAddress"
            type="upiAddress"
            onChange={formik.handleChange}
            value={formik.values.upiAddress}
          />

          <br />

          <label>Aadhaar Number: </label>

          <input
            id="aadhaarNumber"
            name="aadhaarNumber"
            type="aadhaarNumber"
            onChange={formik.handleChange}
            value={formik.values.aadhaarNumber}
          />
          <br />
          <label>Pan Number: </label>

          <input
            id="panNumber"
            name="panNumber"
            type="panNumber"
            onChange={formik.handleChange}
            value={formik.values.panNumber}
          />
          <br />
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
