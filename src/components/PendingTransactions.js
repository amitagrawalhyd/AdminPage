import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";

const PendingTransactons = () => {
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const [PendingTransactons, setPendingTransactions] = useState([]);
  let heading = ["Amount", "Name", "Mobile Number", "UPI ID", "Date"];

  const getPendingTransactions = async () => {
    //for total transactions list
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
    setPendingTransactions(respJson);
    // setLoading(false);
  };
  console.log("all transactions:", PendingTransactons);
  useEffect(() => {
    getPendingTransactions();
  }, []);

  return (
    <>
      <h4 className="header mb-2">PendingTransactons</h4>
      <div>
        <table className="table  table-striped" >
          <thead style={{ padding: 20 }}>
            <tr>
              {heading.map((head, headID) => (
                <th key={headID}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PendingTransactons
              ?.sort(
                (a, b) =>
                  new Date(...a.transactionDate.split("T")[0].split("-")) -
                  new Date(...b.transactionDate.split("T")[0].split("-"))
              )
              ?.map((transaction) => (
                <tr>
                  <td className="coupon">{transaction.transactionAmount}</td>
                  <td className="coupon">{transaction.registerName}</td>
                  <td className="coupon">{transaction.registerMobileNumber}</td>
                  <td className="coupon"> {transaction.upiAddress}</td>
                  <td className="coupon">
                  {transaction.transactionDate.split("T")[0]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PendingTransactons;
