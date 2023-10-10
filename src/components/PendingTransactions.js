import React, { useState, useEffect } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";

const PendingTransactons = () => {
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const [PendingTransactons, setPendingTransactions] = useState([]);
  let heading = ["Select","Amount", "Name", "Mobile Number","Status", "UPI ID", "Date"];
  const [allchecked, setAllChecked] = React.useState([]);
  const mobileNumber = Cookies.get('mobileNumber');
const [selectAll,setSelectAll] = useState(false);

function handleSelectAll(e){
  setSelectAll(e.target.checked);

}

  function handleChange(e) {
    if(selectAll){
      setAllChecked([...allchecked,selectAll]);
    }
    else if(!selectAll){
      setAllChecked([...allchecked,selectAll]);
    }
     if (e.target.checked) {
        setAllChecked([...allchecked, e.target.value]);
     } else {
        setAllChecked(allchecked.filter((item) => item !== e.target.value));
     }
  }
  // console.log("checked values",allchecked);
  // console.log("select all value:",selectAll)

  const handleComplete= async () => {
    const completeTransations = await Promise.all(
      allchecked.map(async (transactionId) => {
        const response = await fetch(`http://183.83.219.144:81/LMS/Coupon/CompleteTransaction/${companyId}/${mobileNumber}/${transactionId}`,
        {
        method:'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        }
        )
        return await response.json();
      })
    );
    console.log("complete api response:",completeTransations);
  }

  const getPendingTransactions = async () => {
    //for total transactions list
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetPendingTransactions/${companyId}/${mobileNumber}`,
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
  // console.log("all pending transactions:", PendingTransactons);
  useEffect(() => {
    getPendingTransactions();
  }, [getPendingTransactions]);

  return (
    <>
      <h4 className="header mb-2">PendingTransactons</h4>
      <input value="selectAll" type="checkbox" onChange={handleSelectAll} /> 
      <button className="btn btn-primary" onClick={handleComplete}>Complete</button> 
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
                  <td> <input value={transaction.id} type = "checkbox" onChange = {handleChange} /> </td>
                  <td className="coupon">{transaction.transactionAmount}</td>
                  <td className="coupon">{transaction.registerName}</td>
                  <td className="coupon">{transaction.registerMobileNumber}</td>
                  <td className="coupon"> {transaction.upiAddress}</td>
                  <td className="transaction">
                        {transaction.isPaid &&
                          transaction.isActive &&
                          "Completed"}
                        {!transaction.isPaid &&
                          transaction.isActive &&
                          "Pending"}
                        {!transaction.isPaid &&
                          !transaction.isActive &&
                          "Rejected"}
                      </td>
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
