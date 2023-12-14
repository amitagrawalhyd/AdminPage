import React, { useState, useEffect, useRef } from "react";
import { Constants } from "../constants/credentials";
import "../App.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePDF } from "react-to-pdf";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useAddUser } from "./User/AddUser";
import Loader from "react-js-loader";
import saveAs from "file-saver";

const ExcelJS = require("exceljs");



const CouponHistory = () => {
const CompanyId = sessionStorage.getItem('CompanyId');
const Api = Constants.api;
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
  const {setEditmode} = useAddUser();
  setEditmode(false);
  const [loading, setLoading] = useState(false);

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
    console.log('getCouponHistory is called');
    setLoading(true);

    // if (!getDataCalled) {
    // getDataCalled = true;
    const token = sessionStorage.getItem('token');

    if (token) {
      const resp = await fetch(
        `${Api}/Coupon/GetCouponTransactions/${CompanyId}?mobileNumber=${mobileNumber}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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
      setLoading(false);
    }
    // }
  };

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Coupon History");
    sheet.columns = [
      {
        header: "Coupon Id",
        key: "couponId",
        width: 20,
      },
      {
        header: "Coupon Value",
        key: "couponValue",
        width: 15,
      },
      {
        header: "Mobile Number",
        key: "mobileNumber",
        width: 20,
      },
      {
        header: "Name",
        key: "name",
        width: 20,
      },
      {
        header: "Date-Time",
        key: "date",
        width: 20,
      },
    ];
    const promise = Promise.all(
      couponData?.map(async (coupon) => {
        // const rowNumber = index + 1;
        sheet.addRow({
          couponId: coupon.couponIdentity,
          couponValue: coupon.faceValue,
          mobileNumber: coupon.registerMobileNumber,
          name: coupon.registerName,
          date: formatDate(coupon.changeDate.split("T")[0]) +", "+coupon.changeDate.split("T")[1].split('.')[0],
        });
      })
    );
    promise.then(() => {
      console.log("pormise:", promise);
    });

    const faceValueColumn = sheet.getColumn("couponValue");
    faceValueColumn.alignment = { horizontal: "center" };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Coupon History.xlsx");
    });
  };

  return (
    <>
      {loading ? (
        <div style={{display:"flex",alignItems:'center',justifyContent:'center',height:'85vh'}}>
        <Loader bgColor={"#16210d"} type="spinner-cub"/>
        </div>
      ) : (
        <div>
      <h4 className="header mb-2 font-weight-bold">Coupon History</h4>
      <div>
        <div className="d-flex align-items-center form_transaction ">
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
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setStartDate(date)}
          />
          <label className="mb-0 mr-2 ml-2">End Date:</label>
          <DatePicker
            className="form-control"
            selected={endDate}
            dateFormat="dd/MM/yyyy"
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
                  {!couponData.message && couponData
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
              <button className="btn btn-secondary mb-2" onClick={exportExcelFile}>
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
          <div className="d-flex align-items-center justify-content-center" style={{height:'69vh'}}>
          <p>No records found</p>
          </div>
        )}
      </div>
      </div>
      )}
    </>
  );
};

export default CouponHistory;
