import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getCurrentDate } from "./currentDate";
import { useAsyncError } from "react-router-dom";
import { usePDF } from 'react-to-pdf';

const Transactions = () => {
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const [mobileNumber, setMobileNumber] = useState("");
  const currentDate = getCurrentDate();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [transactions, setTransactions] = useState();
  let heading = ["Amount", "Name", "Mobile Number", "UPI ID", "Status", "Date"];

  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

  const getTransactions = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetTransactions/${companyId}?mobileNumber=${mobileNumber}&startDate=${startDate}&endDate=${endDate}`, //
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    // console.log('response: ', resp.json());
    //setData(resp.json());
    //console.log('data length: ', data.length);
    const respJson = await resp.json();
    setTransactions(respJson);
    // setLoading(false);
    // console.log('cookie from transactions:',token)
    console.log('transactions:',transactions);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  // transactions.sort((a,b) => b.transactionDate.localeCompare(a.transactionDate));

  // transactions.forEach(transaction => {
  //   console.log(transaction.transactionDate.split('T')[0].split('-'));
  // });

  // let sortedTransactions = transactions.sort((a, b) => new Date(...a.transactionDate.split('T')[0].split('-')) - new Date(...b.transactionDate.split('T')[0].split('-')));
  // const reversed = sortedTransactions.reverse();

  // console.log('sorted transactions:',sortedTransactions);

  return (
    <div>
      <h4 className="header mb-2">Transactions requested</h4>
        <div className="d-flex align-items-center justify-content-between form_transaction">
          <input
            className="form-control ml-0"
            style={{ margin: 10 }}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Search Mobile Number"
          />
          <label className="mb-0">Start Date:</label>
          <input
            className="form-control"
            style={{ margin: 10 }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="mb-0">End Date:</label>
          <input
            className="form-control"
            style={{ margin: 10 }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div class="dropdown">
            <div className="cust_dropdown">
              <button
                type="button"
                class="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown"
              >
                filter
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#">
                  Pending
                </a>
                <a class="dropdown-item" href="#">
                  Completed
                </a>
                <a class="dropdown-item" href="#">
                  Rejected
                </a>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary"
            style={{ margin: 10 }}
            onClick={getTransactions}
          >
            Submit
          </button>
        </div>
        {transactions?.length != 0 &&
              <div>
              <button onClick={() => toPDF()}>Download PDF</button>
              <div ref={targetRef}>
                 {/* Content to be generated to PDF */}
                 <table className="table  table-striped">
        <thead style={{ justifyContent: "center" }}>
          {transactions?.length != 0 ? (
            <tr>
              {heading.map((head, headID) => (
                <th key={headID}>{head}</th>
              ))}
            </tr>
          ) : (
            "No transactions requested/made today"
          )}
        </thead>
        {transactions&&
        <tbody>
          {transactions?.sort(
              (a, b) =>
                new Date(...a.transactionDate.split("T")[0].split("-")) -
                new Date(...b.transactionDate.split("T")[0].split("-"))
            )
            .reverse()
            ?.map((transaction) => (
              <tr>
                <td className="transaction">
                  ₹{transaction.transactionAmount}
                </td>
                <td className="transaction"> {transaction.registerName}</td>
                <td className="transaction">
                  {transaction.registerMobileNumber}
                </td>
                {/* <td className="transaction">{transaction.city}</td> */}
                <td className="transaction">{transaction.upiAddress}</td>
                <td className="transaction">
                  {transaction.isPaid && transaction.isActive && "Completed"}
                  {!transaction.isPaid && transaction.isActive && "Pending"}
                  {!transaction.isPaid && !transaction.isActive && "Rejected"}
                </td>
                <td className="transaction">
                  {transaction.transactionDate.split("T")[0]}
                </td>
              </tr>
            ))}
            
        </tbody>
            }
      </table>
              </div>
           </div>
        }

    </div>
  );
};

export default Transactions;
