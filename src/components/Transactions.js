import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
const Transactions = () => {
  const companyId=Constants.companyId;
  const token=Constants.token;
  const [transactions,setTransactions] =useState();
  let heading = ["Amount","Name", "Mobile Number","UPI ID","Status","Date" ];

  const getTransactions = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetTransactions/${companyId}`,
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
    console.log(transactions)
  };

  useEffect(()=>{
    getTransactions();
  },[])

  return (
    <div >
      <h4 className="header">Transactions requested</h4>
      <table  className="table  table-striped" >
        <thead style={{justifyContent:'center'}}>
          <tr>
            {heading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {transactions?.map((transaction) => (
            <tr>
              <td className="transaction">₹{transaction.transactionAmount}</td>
              <td className="transaction"> {transaction.registerName}</td>
              <td className="transaction">{transaction.registerMobileNumber}</td>
              {/* <td className="transaction">{transaction.city}</td> */}
              <td className="transaction">{transaction.upiAddress}</td>
              <td className="transaction">{transaction.isPaid && transaction.isActive && 'Completed'}
              {!transaction.isPaid && transaction.isActive && 'Pending'}
              {!transaction.isPaid && !transaction.isActive && 'Rejected'}
              </td>
              <td className="transaction">{transaction.transactionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
