import React, { useState, useEffect, createContext, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Constants } from "../../constants/credentials";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { getToken } from "./UserList";
import { useNavigate } from "react-router-dom";

// const editContext = createContext();

// export const EditProvider = ({ children }) => {
//   const [editmode, setEditmode] = useState(false);
//   return (
//     <editContext.Provider value={{ editmode, toggleEdit }}>
//       {children}
//     </editContext.Provider>
//   );
// };

// export const useEditmode = () => {
//   return useContext(editContext);
// };

const AddUserContext = createContext();

export const AddUserProvider = ({ children }) => {
  const [editmode, setEditmode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    dropdown: 6,
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
  // const toggleEdit = () => {
  //   setEditmode(!editmode);
  // };

  return (
    <AddUserContext.Provider
      value={{ initialValues, setInitialValues, editmode, setEditmode }}
    >
      {children}
    </AddUserContext.Provider>
  );
};

export const useAddUser = () => {
  return useContext(AddUserContext);
};

export default function AddUser() {
  const CompanyId = sessionStorage.getItem('CompanyId');
  const storedMobileNumber = sessionStorage.getItem("mobileNumber");
  const [registrationTypes, setRegistrationTypes] = useState([]); // types of registrations (distributor,dealer,mechanic)
  const [adminDetails, setAdminDetails] = useState([]); // admin details
  // const defaultOption = options[0]; //dropdown menu default option
  const { initialValues, editmode,setEditmode } = useAddUser();
  const navigate = useNavigate();
  const parentRegistrationId = sessionStorage.getItem('parentRegistrationId')
  var adminRegistrationId = 0;

  // useEffect(() => {
  //   getAdminDetails();
  // }, []);

  useEffect(() => {
    getRegistrationTypes();
  }, []);

  // const getAdminDetails = async () => {
  //   const resp = await fetch(
  //     `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${CompanyId}?mobileNumber=${storedMobileNumber}`,
  //     {
  //       method: "GET",
  //       headers: new Headers({
  //         Authorization: `Bearer ${getToken()}`,
  //       }),
  //     }
  //   );
  //   const data = await resp.json();
  //   setAdminDetails(data);
  //   console.log("res", data);
  // };
  // adminRegistrationId = adminDetails && adminDetails.registrationId;

  // console.log("admin details:", adminDetails);
  // console.log("admin id: ", adminRegistrationId);

  const getRegistrationTypes = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrationTypes/${CompanyId}/${storedMobileNumber}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${getToken()}`,
        }),
      }
    ).catch((error) => console.log(error));

    const data = await resp.json();
    setRegistrationTypes(data);
  };
  // const arr = !registrationTypes.message && registrationTypes.slice(1);

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
    enableReinitialize: true,
    validate,
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
      console.log("values before submitting:",values);
      console.log('admin id onsubmit:',adminRegistrationId,"user type:",values.dropdown);
      setEditmode(false);
      fetch(`http://183.83.219.144:81/LMS/Registration/SaveRegistration`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${getToken()}`,
          // 'Accept': 'application/json, text/plain, */*',
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          registrationId: 0,
          companyId: CompanyId, //required
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
          parentRegistrationId: parentRegistrationId, //required
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
          if (responseData) {
            alert("submitted successfully");
            // window.location.reload();
            navigate("/userlist");
          }
          console.log("response from saveRegistration:", responseData);
        })
        .catch((error) => console.log(error));
    },
  });

  return (
    <div className="user-form-container">
      <div className="user-form">
        <form onSubmit={formik.handleSubmit}>
          {/* <Dropdown
          className="user_dropdown"
          options={registrationTypes}
          // onChange={handleSelectType}
          value="-----"
          // placeholder="Select an option"
        /> */}
        <div style={{display:'flex',flexDirection:'row',margin:10}}>
        <div style={{flexDirection:"column",margin:10}}>
          <label>Select type of user:</label>
          {/* {editmode ? ( */}
            {/* <input value={formik.values.dropdown} disabled /> */}
          {/* ) : ( */}
            <select
              value={formik.values.dropdown}
              name="dropdown"
              onChange={formik.handleChange}
              disabled={editmode}
            >
              {!registrationTypes.message &&
                registrationTypes?.slice(1)?.map((type) => {
                  return (
                    <option
                      key={type.registrationTypeExtId}
                      value={type.registrationTypeExtId}
                    >
                      {type.registrationTypeName}
                    </option>
                  );
                })}
            </select>
          {/* )} */}
          <br />
          <label> Mobile Number: </label>
          {/* <br /> */}
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="mobileNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={editmode}
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
            </div>
          <div style={{flexDirection:"column",margin:10}}>

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
          <button
            className="btn btn-primary"
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 20,
              border: 0,
            }}
            type="submit"
          >
            Submit
          </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
