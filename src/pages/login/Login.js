import './Login.css'
import React, { useState } from "react";
import { Constants } from "../../constants/credentials";
import {useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function Login() {
  // const companyId = Constants.companyId;
  const [mobileNumber, setMobileNumber] = useState("");
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();

  // function generateOtp() {
  // }

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // navigate("/dashboard");
    fetch(
      `http://183.83.219.144:81/LMS/Otp/ValidatePasscode/${mobileNumber}/${passcode}`,
      {
        method: 'POST',
      },
    )
      .then(response => response.json())
      .then(responseData => {
        console.log("login validation:",responseData.validationResult);
        if (responseData.validationResult) {
          Cookies.set("token",responseData.token);
          Cookies.set("mobileNumber",mobileNumber);
          navigate("/dashboard");
        }
        else if(!responseData.validationResult){
          alert('Invalid credentials :(');
        }
      })
      .catch(error => console.log(error));
  }

  return (
    <>
    <div className="container">
      <div class="split-one">
        <div class="left-heading">
          Coupon App <br />
          <div class="left heading">Admin</div>
        </div>
        {/* <div class="left-heading">Admin</div> */}
      </div>

      <div class="split-two">
        <form method="post" onSubmit={handleSubmit}>
          <label>Mobile Number: </label>
          {/* <br /> */}
          <input
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <br />
          <label>Passcode: </label>
          {/* <br /> */}
          <input value={passcode} onChange={(e) => setPasscode(e.target.value) } />
          <br />
          <button type="submit"  disabled={passcode?.length < 6}>LOGIN</button>
        </form>
      </div>
    </div>
    </>
  );
}
