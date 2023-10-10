import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { Constants } from "../constants/credentials";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { getCurrentDate } from "../components/currentDate";
import Loader from "react-js-loader";
import { useSearchParams,useLocation } from "react-router-dom";

var isEmpty = require("lodash.isempty");

const Dashboard = () => {
  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const mobileNumber = Cookies.get("mobileNumber");
  const [dashboardDetails, setDashboardDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // const {state} = useLocation();
  // const { mobileNumber, token } = state; // Read values passed on state


  // console.log("state params:",mobileNumber,token);

  // const [selected, setSelected] = React.useState();

  // console.log('mobile number from dashboard:', mobileNumber)
  // Cookies.set("token",);
  // console.log('picked date is:',date.toLocaleDateString("fr-CA"));
  // setStartDate(date.toLocaleDateString("fr-CA"));

  const handleSubmit = () => {
    console.log("current date", currentDate);
    // e.preventDefault();
    // console.log('start date from handler:',startDate);
  };
  useEffect(() => {
    getDetails();
  }, [mobileNumber, token]);

  const getDetails = async () => {
    setLoading(true);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/CouponSummary/${companyId}/${mobileNumber} `, //?startDate=${startDate}&endDate=${endDate}
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const respJson = await resp.json();
    setDashboardDetails(respJson);
    console.log("dashboard details:", dashboardDetails.scannedCoupons);
    setLoading(false);
  };

  // console.log('dashboard details:',dashboardDetails);
  // Object.keys(dashboardDetails).forEach(function(key, index) {
    // dashboardDetails.[key]
    // console.log("dash",dashboardDetails?.[key]);
  // });

  return (
    <>
      {loading ? (
        <Loader type="spinner-circle" />
      ) : (
        <div >
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
            <input
              value={endDate}
              className="form-control"
              onChange={(e) => setEndDate(e.target.value)}
            />
            {/* <br /> */}
            <button
              onClick={getDetails}
              class="btn btn-primary"
              style={{ margin: 10 }}
            >
              Submit
            </button>
          </div>

            <div className="dashboard-container" >

              {/* {dashboardDetails?.scannedCoupon} */}
              <div >

                  <div className="d-flex justify-content-around">
                    <div className="scanned-container">
                    {dashboardDetails.scannedCoupons && (
                      <>
                    <h6 style={{ color: "black", marginBottom: 10, borderBottom: '1px solid black' }}>
                Scanned Coupons
              </h6>

                    <table >
                      {dashboardDetails.scannedCoupons.length !== 0 && (
                        <>
                          <th scope="col">Coupon Value</th>
                          <th>Number of Scanned Coupons</th>
                        </>
                      )}
                      <tbody>
                        <tr>
                          <td>
                            {dashboardDetails?.scannedCoupons[0]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.scannedCoupons[0]?.scannedCount}
                          </td>
                          <td>
                            {
                              dashboardDetails?.expiredCoupons[0]
                                ?.expiredCoupons
                            }
                          </td>
                          <td>
                            {dashboardDetails.transaction[0]?.transactionAmount}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {dashboardDetails?.scannedCoupons[1]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.scannedCoupons[1]?.scannedCount}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {dashboardDetails?.scannedCoupons[2]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.scannedCoupons[2]?.scannedCount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </>
                                    )}
                                    </div>
                    <div className="expired-container">
                    <h6 style={{ color: "black", marginBottom: 10, borderBottom: '1px solid black' }}>
                Expired Coupons
              </h6>
                    {dashboardDetails.expiredCoupons && (
                      <table>
{/* {dashboardDetails.expiredCoupons.length !== 0 && ( */}
                        <>
                          <th >Coupon Value</th>
                          <th>Number of coupons</th>
                        </>
                      {/* )} */}
                      <tbody>
                        <tr>
                          <td>
                            {dashboardDetails?.expiredCoupons[0]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.expiredCoupons[0]?.expiredCount}
                          </td>
                          <td>
                            {
                              dashboardDetails?.expiredCoupons[0]
                                ?.expiredCoupons
                            }
                          </td>
                          <td>
                            {dashboardDetails.transaction[0]?.transactionAmount}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {dashboardDetails?.expiredCoupons[1]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.expiredCoupons[1]?.expiredCount}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {dashboardDetails?.expiredCoupons[2]?.faceValue}
                          </td>
                          <td>
                            {dashboardDetails?.expiredCoupons[2]?.expiredCount}
                          </td>
                        </tr>
                      </tbody>
                      </table>
                    )}
                    </div>
                    <div>
                      {dashboardDetails.transaction &&
                      <table>
                        {/* {dashboardDetails.expiredCoupons.length !== 0 && ( */}
                        <>
                          <th>Transferred Amount</th>
                        </>
                      {/* )} */}
                        <tbody>
                        <tr>
                          <td>
                            {dashboardDetails?.transaction?.transactionAmount}
                          </td>
                          </tr>
                        </tbody>
                      </table>
}
                    </div>
                    {/* <p>facevalue   :{dashboardDetails?.scannedCoupons[0]?.faceValue} </p> */}
                    {/* <p>coupon count:{dashboardDetails?.scannedCoupons[0]?.scannedCount}</p>  */}
                  </div>
              </div>
            </div>
            <div>
              
            </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
