import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
const ManualEntry = () => {
  const [couponCode, setCouponCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const companyId = Constants.companyId;
  const token = Constants.token;
  function handleSubmit() {
    fetch(
      `http://183.83.219.144:81/LMS/Coupon/ConsumeManualCoupon/${companyId}/${couponCode}/${mobileNumber}`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData === true) {
          alert("Coupon Code posted successfully");
        } else if (responseData === false) {
          alert("Coupon Code Used already!");
        } else {
          alert("Invalid Coupon Code:(");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <h1 className="header">Manual Entry</h1>
      <p>Enter the coupon code manually</p>
      <form onSubmit={handleSubmit}>
        <label>Mobile Number:</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <br />
        <label>Coupon Code:</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ManualEntry;
