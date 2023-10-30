import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { Constants } from "../constants/credentials";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { getCurrentDate } from "../components/currentDate";
import Loader from "react-js-loader";
import { useSearchParams, useLocation } from "react-router-dom";
import { useAppContext } from "../App";
import { useAddUser } from "./User/AddUser";
import { getToken } from "./User/UserList";

var isEmpty = require("lodash.isempty");

const Dashboard = () => {
  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const CompanyId = sessionStorage.getItem("CompanyId");
  const token = sessionStorage.getItem("token");
  // const { token } = useAppContext();

  const mobileNumber = sessionStorage.getItem("mobileNumber");
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  // const {setCompanyLogo} = useAddUser();

  function formatStartDate(separator = "-") {
    let date = startDate.getDate();
    let month = startDate.getMonth() + 1;
    let year = startDate.getFullYear();
    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
  }
  const formattedStartDate = startDate && formatStartDate();
  function formatEndDate(separator = "-") {
    let date = endDate.getDate();
    let month = endDate.getMonth() + 1;
    let year = endDate.getFullYear();
    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
  }
  const formattedEndDate = endDate && formatEndDate();

  // const {state} = useLocation();
  // const { mobileNumber, token } = state; // Read values passed on state

  // console.log("state params:",mobileNumber,token);

  // const [selected, setSelected] = React.useState();

  // console.log('mobile number from dashboard:', mobileNumber)
  // Cookies.set("token",);
  // console.log('picked date is:',date.toLocaleDateString("fr-CA"));
  // setStartDate(date.toLocaleDateString("fr-CA"));

  const decodedToken = atob(token);
  console.log("decoded token", JSON.parse(atob(token)).RegistrationId);

  const handleSubmit = () => {
    console.log("current date", currentDate);
    // e.preventDefault();
    // console.log('start date from handler:',startDate);
  };

  const getDashboardDetails = async () => {
    setLoading(true);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/CouponSummary/${CompanyId}/${mobileNumber}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${getToken()}`,
        }),
      }
    );
    const respJson = await resp.json();
    setDashboardDetails(respJson);
    setLoading(false);
  };
  console.log("dashboard details:", dashboardDetails);
  // console.log('dashboardDetails.scannedCoupons?.length: ',dashboardDetails.scannedCoupons?.length)
  console.log(
    "dashboard condition:",
    typeof dashboardDetails.scannedCoupons !== "undefined" &&
      dashboardDetails.scannedCoupons.length > 0
  );
  // Object.keys(dashboardDetails).forEach(function(key, index) {
  // dashboardDetails.[key]
  // console.log("dash",dashboardDetails?.[key]);
  // });
  const [companydetails, setCompanyDetails] = useState({});
  useEffect(() => {
    getCompanyDetails();
    getDashboardDetails();
  }, []);

  const getCompanyDetails = async () => {
    // console.log('loading data:', storedMobileNumber, storedToken);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Company/Companies/${CompanyId}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    //setData(resp.json());
    const respJson = await resp.json();
    // console.log("response from company details: ", respJson);
    setCompanyDetails(respJson);
    // setLoading(false);
  };
  console.log("company details:", companydetails);
  let companylogo =
    !isEmpty(companydetails) &&
    !companydetails.message &&
    companydetails?.map((company) => company.companyLogo)[CompanyId - 1];
  sessionStorage.setItem("companylogo", companylogo);
  // console.log('company logo: ' ,companylogo);

  return (
    <>
      {loading ? (
        <Loader color="#16219d" type="spinner-circle" />
      ) : (
        <div>
          <div className="d-flex align-items-center justify-content-evenly form_transaction">
            <label className="mb-0 mr-2">Start Date:</label>
            <DatePicker
              className="form-control"
              selected={startDate}
              dateFormat="yyyy/MM/dd"
              onChange={(date) => setStartDate(date)}
            />
            <label className="mb-0 mr-2 ml-2">End Date:</label>
            <DatePicker
              className="form-control"
              selected={endDate}
              dateFormat="yyyy/MM/dd"
              onChange={(date) => setEndDate(date)}
            />
            <button
              onClick={getDashboardDetails}
              class="btn btn-primary"
              style={{ margin: 10 }}
            >
              Submit
            </button>
          </div>

          <div className="dashboard-container">
            {/* {dashboardDetails?.scannedCoupon} */}
            <div>
              <div className="d-flex justify-content-around">
                {!isEmpty(dashboardDetails) &&
                  typeof dashboardDetails.scannedCoupons !==
                  "undefined" &&
                  dashboardDetails.scannedCoupons.length > 0 && (
                    <div className="scanned-container">
                      <>
                        <div
                          style={{
                            borderBottom: "1px solid black",
                            paddingBottom: "30px",
                            display: "flex",
                            justifyContent: "center",
                            // alignItems: "center",
                          }}
                        >
                          <h6>Scanned Coupons</h6>
                        </div>

                        <table>
                          <>
                            <th scope="col-md-4">Coupon Value</th>
                            <th>Number of Scanned Coupons</th>
                          </>
                          <tbody>
                            <tr>
                              <td>
                                {typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                  dashboardDetails?.scannedCoupons[0]
                                    ?.faceValue}
                              </td>
                              <td>
                                {typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                  dashboardDetails?.scannedCoupons[0]
                                    ?.scannedCount}
                              </td>
                              <td>
                                {typeof dashboardDetails.expiredCoupons !==
                                  "undefined" &&
                                  dashboardDetails.expiredCoupons.length > 0 &&
                                  dashboardDetails?.expiredCoupons[0]
                                    ?.expiredCoupons
                                }
                              </td>
                              <td>
                                {
                                  dashboardDetails?.transaction
                                    ?.transactionAmount
                                }
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                dashboardDetails?.scannedCoupons[1]?.faceValue}
                              </td>
                              <td>
                                {typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                  dashboardDetails?.scannedCoupons[1]
                                    ?.scannedCount
                                }
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                dashboardDetails?.scannedCoupons[2]?.faceValue}
                              </td>
                              <td>
                                {
                                  typeof dashboardDetails.scannedCoupons !==
                                  "undefined" &&
                                  dashboardDetails.scannedCoupons.length > 0 &&
                                  dashboardDetails?.scannedCoupons[2]
                                    ?.scannedCount
                                }
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                  )}
                {!isEmpty(dashboardDetails) &&
                  typeof dashboardDetails.expiredCoupons !==
                  "undefined" &&
                  dashboardDetails.expiredCoupons.length > 0&& (
                    <div className="expired-container">
                      <h6
                        style={{
                          color: "black",
                          marginBottom: 10,
                          borderBottom: "1px solid black",
                        }}
                      >
                        Expired Coupons
                      </h6>
                      <table>
                        {/* {dashboardDetails.expiredCoupons.length !== 0 && ( */}
                        <>
                          <th>Coupon Value</th>
                          <th>Number of coupons</th>
                        </>
                        {/* )} */}
                        <tbody>
                          <tr>
                            <td>
                              {dashboardDetails?.expiredCoupons[0]?.faceValue}
                            </td>
                            <td>
                              {
                                dashboardDetails?.expiredCoupons[0]
                                  ?.expiredCount
                              }
                            </td>
                            <td>
                              {
                                dashboardDetails?.expiredCoupons[0]
                                  ?.expiredCoupons
                              }
                            </td>
                            <td>
                              {
                                dashboardDetails.transaction[0]
                                  ?.transactionAmount
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {dashboardDetails?.expiredCoupons[1]?.faceValue}
                            </td>
                            <td>
                              {
                                dashboardDetails?.expiredCoupons[1]
                                  ?.expiredCount
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {dashboardDetails?.expiredCoupons[2]?.faceValue}
                            </td>
                            <td>
                              {
                                dashboardDetails?.expiredCoupons[2]
                                  ?.expiredCount
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                <div>
                  {!isEmpty(dashboardDetails) &&
                    dashboardDetails?.transaction?.transactionAmount !== 0 && (
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
                    )}
                </div>
                {/* <p>facevalue   :{dashboardDetails?.scannedCoupons[0]?.faceValue} </p> */}
                {/* <p>coupon count:{dashboardDetails?.scannedCoupons[0]?.scannedCount}</p>  */}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
