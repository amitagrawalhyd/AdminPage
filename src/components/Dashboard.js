import "../App.css";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Constants } from "../constants/credentials";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import {getCurrentDate} from '../components/currentDate';
import Loader from 'react-js-loader';
var isEmpty = require('lodash.isempty');


const Dashboard = () => {
  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const companyId = Constants.companyId;
  const token=Cookies.get("token");
  const mobileNumber=Cookies.get("mobileNumber");
  const [dashboardDetails,setDashboardDetails] = useState([]);
  const [loading, setLoading] =useState(false);

  // const [selected, setSelected] = React.useState();

  // console.log('mobile number from dashboard:', mobileNumber)
  // Cookies.set("token",);
    // console.log('picked date is:',date.toLocaleDateString("fr-CA"));
    // setStartDate(date.toLocaleDateString("fr-CA"));

  const handleSubmit = () => {
    console.log('current date',currentDate);
    // e.preventDefault();
    // console.log('start date from handler:',startDate);
  }
  useEffect(()=>{
    getDetails();
      },[mobileNumber,token,]);

  const getDetails = async () => {
    setLoading(true);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/CouponSummary/${companyId}/${mobileNumber}?startDate=${startDate}&endDate=${endDate} `, //?startDate=2023-8-1&endDate=2023-10-5
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }, 
    );
    const respJson = await resp.json();
    setDashboardDetails(respJson);
    console.log("data",dashboardDetails);
    setLoading(false)
  };

  // console.log('dashboard details:',dashboardDetails);
  // Object.keys(dashboardDetails).forEach(function(key, index) {
  //   console.log("dash",dashboardDetails);
 // });
  

  return (
    <>
    { loading ? 
    <Loader type="spinner-circle" />
    :
    <div>
      <div className="d-flex align-items-center justify-content-evenly form_transaction">
          <label className="mb-0">Start Date: </label>
          {/* <br /> */}
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control ml-0"
          />
          {/* <br /> */}
          <label className="mb-0">End Date: </label>
          {/* <br /> */}
          <input value={endDate} 
           className="form-control"
          onChange={(e) => setEndDate(e.target.value) } />
          {/* <br /> */}
          <button onClick={getDetails} 
          class="btn btn-primary"
          style={{margin:10}}>Submit</button>
          </div>
        <div>
        <div>
        <h6 style={{color:'black',marginBottom:20}}>Scanned Coupons</h6>
          {/* {dashboardDetails?.scannedCoupon} */}
          <div className="d-flex justify-content-arround align-items-center">
            {dashboardDetails.scannedCoupons &&
            <div>
              <table className="table">
                {dashboardDetails.scannedCoupons.length!==0 &&
                <>
                <th scope="col">Coupon Value</th>
                <th>Number of Scanned Coupons</th>
                <th>Expired Coupons</th>
                <th>Transferred Amount</th>
                </>
}
                <tbody>
                  <tr>
                    <td>{dashboardDetails?.scannedCoupons[0]?.faceValue}</td>
                    <td>{dashboardDetails?.scannedCoupons[0]?.scannedCount}</td>
                    <td>{dashboardDetails?.expiredCoupons.length}</td>
                    <td>{dashboardDetails.transaction?.transactionAmount}</td>
                  </tr>
                  <tr>
                  <td>{dashboardDetails?.scannedCoupons[1]?.faceValue}</td>
                  <td>{dashboardDetails?.scannedCoupons[1]?.scannedCount}</td>
                  </tr>
                  <tr>
                  <td>{dashboardDetails?.scannedCoupons[2]?.faceValue}</td>
                  <td>{dashboardDetails?.scannedCoupons[2]?.scannedCount}</td>
                  </tr>
                </tbody>
              </table>
            {/* <p>facevalue   :{dashboardDetails?.scannedCoupons[0]?.faceValue} </p> */}
            {/* <p>coupon count:{dashboardDetails?.scannedCoupons[0]?.scannedCount}</p>  */}
             </div>
            }
          </div>
        </div>
        </div>
    </div>
}
    </>
  );
};

export default Dashboard;

