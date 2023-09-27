import './Login.css'
import React, { useState } from "react";
import { Constants } from "../../constants/credentials";
import {useNavigate } from "react-router-dom";

export default function Login() {
  // const companyId = Constants.companyId;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function generateOtp() {
  }

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    navigate("/home");
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
          <label>Username: </label>
          {/* <br /> */}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label>Password: </label>
          {/* <br /> */}
          <input value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
    </>
  );
}
