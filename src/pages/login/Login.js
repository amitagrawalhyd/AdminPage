import "./Login.css";
import React, { useState } from "react";
import { Constants } from "../../constants/credentials";
import { useNavigate, createSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppContext } from "../../App";




export default function Login() {
  // const companyId = Constants.companyId;
  const [mobileNumber, setMobileNumber] = useState("");
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAppContext();
  const [companydetails, setCompanyDetails] = useState({});
  var isEmpty = require("lodash.isempty");

  const getCompanyLogo = async (companyId, token) => {
    if (token) {
      try {
        const resp = await fetch(
          `http://183.83.219.144:81/LMS/Company/Companies/${companyId}`,
          {
            method: 'GET',
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          },
        );
        const data = await resp.json();
        setCompanyDetails(data);
  
        console.log("company details:", data);
  
        let companylogo =
          !isEmpty(data) && !data.message
            ? data.map((company) => company.companyLogo)[0]
            : undefined;
  
        sessionStorage.setItem("companylogo", companylogo);
        console.log("company logo: ", companylogo);
        return companylogo;
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    }
  };
  

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // navigate("/dashboard");
    fetch(
      `http://183.83.219.144:81/LMS/Otp/ValidatePasscode/${mobileNumber}/${passcode}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("login validation:", responseData.validationResult);
        if (responseData.validationResult) {
          // Cookies.set("token", responseData.token); 
          setToken(responseData.token);
          // Cookies.set("mobileNumber", mobileNumber);
          sessionStorage.setItem("token", responseData.token);//set to session storage
          sessionStorage.setItem("mobileNumber", mobileNumber);
          sessionStorage.setItem("CompanyId",JSON.parse(atob(responseData.token)).CompanyId)
          sessionStorage.setItem("parentRegistrationId",JSON.parse(atob(responseData.token)).RegistrationId)
          // const logo = getCompanyLogo(JSON.parse(atob(responseData.token)).CompanyId);
          // console.log('logo fetched after login:',logo);
          const logo = await getCompanyLogo(
            JSON.parse(atob(responseData.token)).CompanyId,
            responseData.token
          );
          sessionStorage.setItem('logo', logo);          // navigate("/dashboard");  JSON.parse(decodedToken).CompanyId

          navigate("/dashboard", {
            state: { mobileNumber: mobileNumber, token: responseData.token },
          });

          // navigate({
          //   pathname: '/dashboard',
          //   search: createSearchParams({ mobileNumber: mobileNumber}),
          // });
        } else if (!responseData.validationResult) {
          alert("Invalid credentials :(");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
      <div className="w-100">
        <div className="split-one">
          <div className="left-heading">
            Coupon App <br />
            <div className="left heading">Admin</div>
          </div>
          {/* <div className="left-heading">Admin</div> */}
        </div>

        <div className="split-two">
        <form method="post" onSubmit={handleSubmit} className="w-75 m-auto p-5 login_form">
          <h4 className="mb-3 font-weight-bold text-center">Login</h4>
    <div class="form-group">
    <label>Mobile Number: </label>
      <input type="text" class="form-control"  placeholder="Enter Mobile NUmber"    value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)} />
    </div>
    <div class="form-group">
    <label>Passcode: </label>
      <input type="text" class="form-control"  placeholder="Enter passcode" name="passcode"  value={passcode}
                onChange={(e) => setPasscode(e.target.value)} />
    </div>
  
    <button 
     type="submit"
     style={{
       backgroundColor:
        ( passcode.length < 6) === true ? "grey" : "#16219d",
      
     }}
     disabled={passcode?.length < 6}
     class="btn btn-primary align-self-flex-end">Login</button>
  </form>
          {/* <div className="login-form">
            <form method="post" onSubmit={handleSubmit}>
              <h3 className="text-center font-weight-bold">Login</h3>
              <label>Mobile Number: </label>
              <input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <br />
              <label>Passcode: </label>
              <input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <br />
              <button
                type="submit"
                style={{
                  backgroundColor:
                   ( passcode.length < 6) === true ? "grey" : "#16219d",
                  color: "white",
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  margin: 5,
                  border: 0,
                }}
                disabled={passcode?.length < 6}
              >
                LOGIN
              </button>
            </form>
          </div> */}
        </div>
      </div>
  );
}
