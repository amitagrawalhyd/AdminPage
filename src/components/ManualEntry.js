import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";
const ManualEntry = () => {
  const [couponCode, setCouponCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
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
      <h4 className="header mb-2">Manual Entry</h4>
      <p className="mb-2">Enter the coupon code manually</p>
      <form onSubmit={handleSubmit} className="form_transaction ">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label className="mb-0">Mobile Number:</label>
          <input
            className="form-control mx-2 mb-2"
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label className="mb-0">Coupon Id:</label>
          <input
            className="form-control mx-2 "
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>

        <br />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManualEntry;
