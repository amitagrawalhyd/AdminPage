import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";
import { useAddUser } from "./User/AddUser";
import Loader from 'react-js-loader';

const ManualEntry = () => {
  const [couponCode, setCouponCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const CompanyId = sessionStorage.getItem('CompanyId');
  const token = sessionStorage.getItem('token');
  const {setEditmode} = useAddUser();
  const [loading, setLoading] = useState(false);
  setEditmode(false);
  function handleSubmit(event) {
    setLoading(true);
    event.preventDefault();
    fetch(
      `http://183.83.219.144:81/LMS/Coupon/ConsumeManualCoupon/${CompanyId}/${couponCode}/${mobileNumber}`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        console.log("manual entry coupon response:", responseData);
        if (responseData === true) {
          alert("Coupon Code posted successfully");
        } else if (responseData === false) {
          alert("Coupon code already used or invalid");
        } else {
          alert("Invalid Coupon Code:(");
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="manual-entry-container">
      <div className="manual-entry-form">
        <h4 className="header mb-2 text-center font-weight-bold">Manual Entry</h4>
        {/* <p className="mb-2">Enter the coupon code manually</p> */}
        <form onSubmit={handleSubmit} className="form_transaction ">
          <div >
            <label className="mb-0">Mobile Number</label>
            <input
              className="form-control mx-2 mb-2"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
          <div >
            <label className="mb-0">Coupon Id</label>
            <input
              className="form-control mx-2 "
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>

          <br />
          <button
            className="btn btn-primary"
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              bottom: 0,
              right:0,
              margin: 10,
              border: 0,
            }}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntry;
