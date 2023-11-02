import React, { useState, useEffect, useRef } from "react";
import { Constants } from "../constants/credentials";
import "../App.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePDF } from "react-to-pdf";
import { useDownloadExcel } from "react-export-table-to-excel";

const CouponHistory = () => {
  const CompanyId = sessionStorage.getItem('CompanyId');
  const token = Constants.token;
  const [couponData, setCouponData] = useState([]);
  let heading = [
    "Coupon Id",
    "Coupon Value",
    "Mobile Number",
    "Name",
    "Date-Time",
  ];

  const [mobileNumber, setMobileNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { toPDF, targetRef } = usePDF({ filename: "coupon-history.pdf" }); //for pdf
  const tableRef = useRef(null); // for excel

  function formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];
  
    return day+'-'+month+'-'+year;
  }

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

  useEffect(() => {
    getCouponHistory();
  }, []);

  const getCouponHistory = async () => {
    // console.log('loading data:', storedMobileNumber, storedToken);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetCouponTransactions/${CompanyId}?mobileNumber=${mobileNumber}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    //setData(resp.json());
    //console.log('data length: ', data.length);
    const respJson = await resp.json();
    console.log("response: ", respJson);
    setCouponData(respJson);
    // setLoading(false);
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Coupon History",
    sheet: "Coupons",
  });

  return (
    <>
      <h4 className="header mb-2">Coupon History</h4>
      <div>
        <div className="d-flex align-items-center form_transaction">
          <input
            className="form-control ml-0"
            style={{ margin: 10 }}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Search Mobile Number"
          />
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
            type="button"
            className="btn btn-primary"
            style={{ margin: 10 }}
            onClick={getCouponHistory}
          >
            Submit
          </button>
        </div>

        {couponData.length != 0 ? (
          <div>
            <div ref={targetRef}>
              <table className="table  table-striped" ref={tableRef}>
                <thead style={{ padding: 20, backgroundcolor: "red" }}>
                  <tr>
                    {heading.map((head, headID) => (
                      <th key={headID}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {couponData
                    ?.sort((a, b) => b.changeDate.localeCompare(a.changeDate))
                    ?.map((coupon) => (
                      <tr>
                        <td className="coupon">{coupon.couponIdentity}</td>
                        <td className="coupon">{coupon.faceValue}</td>
                        <td className="coupon">
                          {coupon.registerMobileNumber}
                        </td>
                        <td className="coupon"> {coupon.registerName}</td>
                        <td className="coupon">
                          {formatDate(coupon.changeDate.replace("T", " ").split(" ")[0])}
                          {' '}
                          {coupon.changeDate.split("T")[1].split('.')[0]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div>
              <button className="btn btn-secondary mb-2" onClick={onDownload}>
                {" "}
                Export to Excel{" "}
              </button>
              <button
                className="btn btn-secondary mb-2 mx-2"
                onClick={() => toPDF()}
              >
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          "No records found"
        )}
      </div>
    </>
  );
};

export default CouponHistory;
