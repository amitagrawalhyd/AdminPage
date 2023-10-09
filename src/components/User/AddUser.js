import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Constants } from "../../constants/credentials";
import Cookies from "js-cookie";

class AddUser extends React.Component {
  // constructor(props) {
  //     super(props);
  //     this.handleSubmit = this.handleSubmit.bind(this);
  //   }
  handleSubmit(values) {
    const token = Cookies.get('token');
    console.log("token from add user:",token);
    // console.log(JSON.stringify(values, null, 2));
    console.log(values.name)
    fetch(
      `http://183.83.219.144:81/LMS/Registration/SaveRegistration`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        body: JSON.stringify({
            // "registrationId": 0,
            // "companyId": 2,
            // "registrationTypeId": 0,
            // "registrationTypeExtId": 8,
            // "registrationType": "Mechanic",
            // "registerMobileNumber": "6451329780",
            // "registerImeiNumber": "",
            // "pin": "",
            // "registerName": "Bill",
            // "registerAddress1": "malakpet",
            // "registerAddress2": "koti",
            // "city": "Hyderabad",
            // "state": "Telangana",
            // "pinCode": "500016",
            // "parentRegistrationId": 8,
            // "walletValue": 0,
            // "expiredWalletValue": 0,
            // "paidValue": 0,
            // "upiAddress": "",
            // "adhaarNumber": "",
            // "panNumber": "",
            // "isActive": true


          // "companyId":Constants.companyId,
          // "registrationTypeExtId":8,
          // "registerMobileNumber":values.mobileNumber,
          // "registerName": values.name,
          // "registerAddress1":values.address1,
          // "registerAddress2":values.address2,
          // "city":values.city,
          // "state":values.state,
          // "pinCode":values.pinCode,
          // "parentRegistrationId":8,
          // isActive:true
        }),
      },
    )
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
      })
      .catch(error => console.log(error));
  }
  validationSchema() {
    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
      mobileNumber: Yup.string().required("Mobile Number is required"),
      // .min(6, 'Username must be at least 6 characters')
      // .max(20, 'Username must not exceed 20 characters'),
      address1: Yup.string().required("Address1 is required"),
      // .email('Email is invalid'),
      city: Yup.string().required("City is required"),
      // .min(6, 'Password must be at least 6 characters')
      // .max(40, 'Password must not exceed 40 characters'),
      state: Yup.string().required("State is required"),
      pincode: Yup.string().required("Pincode is required"),
      // .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
      //   acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
    });
  }
  render() {
    const initialValues = {
      name: "",
      mobileNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
    };

    return (
      <div class="container align-items-center">
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.handleSubmit}
        >
          {({ errors, touched, resetForm }) => (
            <Form>
              <div className="w-50">
                <label>Name*</label>
                <Field
                  name="name"
                  type="text"
                  className={
                    "form-control" +
                    (errors.name && touched.name ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="w-50">
                <label htmlFor="mobileNumber">Mobile Number*</label>
                <Field
                  name="mobileNumber"
                  type="text"
                  className={
                    "form-control" +
                    (errors.mobileNumber && touched.mobileNumber
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="w-50">
                <label htmlFor="address1">Address 1*</label>
                <Field
                  name="address1"
                  type="address1"
                  className={
                    "form-control" +
                    (errors.address1 && touched.address1 ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="address1"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="w-50">
                <label htmlFor="address1">Address 2</label>
                <Field
                  name="address2"
                  type="address2"
                  className={
                    "form-control" +
                    (errors.address2 && touched.address2 ? " is-invalid" : "")
                  }
                />
              </div>

              <div className="w-50">
                <label htmlFor="city">City*</label>
                <Field
                  name="city"
                  type="city"
                  className={
                    "form-control" +
                    (errors.city && touched.city ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="w-50">
                <label htmlFor="state">State*</label>
                <Field
                  name="state"
                  // type="password"
                  className={
                    "form-control" +
                    (errors.state && touched.state ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="w-50">
                <label htmlFor="pincode">Pincode*</label>
                <Field
                  name="pincode"
                  // type="password"
                  className={
                    "form-control" +
                    (errors.pincode && touched.pincode ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="pincode"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="w-50">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-warning float-right"
                >
                  Clear
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default AddUser;
