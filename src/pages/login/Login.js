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

  // function generateOtp() {
  // }

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
      .then((responseData) => {
        console.log("login validation:", responseData.validationResult);
        if (responseData.validationResult) {
          // Cookies.set("token", responseData.token); 
          setToken(responseData.token);
          // Cookies.set("mobileNumber", mobileNumber);
          sessionStorage.setItem("token", responseData.token);//set to session storage
          sessionStorage.setItem("mobileNumber", mobileNumber);
          sessionStorage.setItem("CompanyId",JSON.parse(atob(responseData.token)).CompanyId)
          sessionStorage.setItem("parentRegistrationId",JSON.parse(atob(responseData.token)).RegistrationId)

          // navigate("/dashboard");  JSON.parse(decodedToken).CompanyId
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
      <div className="container">
        <div class="split-one">
          <div class="left-heading">
            Coupon App <br />
            <div class="left heading">Admin</div>
          </div>
          {/* <div class="left-heading">Admin</div> */}
        </div>

        <div class="split-two">
          <div className="login-form">
            <form method="post" onSubmit={handleSubmit}>
              <h3 className="text-center font-weight-bold">Login</h3>
              <label>Mobile Number: </label>
              {/* <br /> */}
              <input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <br />
              <label>Passcode: </label>
              {/* <br /> */}
              <input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <br />
              <button
                type="submit"
                style={{
                  backgroundColor:
                    passcode.length < 6 === true ? "grey" : "#16219d",
                  color: "white",
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  margin: 5,
                  border: 0,
                }}
                // backgroundColor={ passcode?.length < 6 ? 'grey': '#16219d'}
                disabled={passcode?.length < 6}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}
