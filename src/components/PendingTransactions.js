import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "./User/AddUser";


const PendingTransactons = () => {
  const CompanyId = sessionStorage.getItem('CompanyId');
  const token = sessionStorage.getItem('token');
  const [PendingTransactons, setPendingTransactions] = useState([]);
  let heading = ["Select","Amount", "Name", "Mobile Number", "UPI ID","Status", "Date"];
  const [allchecked, setAllChecked] = React.useState([]);
  const mobileNumber = sessionStorage.getItem('mobileNumber');
// const [selectAll,setSelectAll] = useState(false);
const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userDetalis,setUserDetails] = useState([]);
  const [usernumbers,setUserNumbers] = useState([]);
  const navigate = useNavigate();
  const {setEditmode} = useAddUser();
  setEditmode(false);


  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(PendingTransactons.map((item) => item));
    }
    setSelectAll(!selectAll);
  };
  console.log('selected items:',selectedItems);

  const handleCheckboxChange = (transaction) => {
    if (selectedItems.includes(transaction)) {
      setSelectedItems(selectedItems.filter((item) => item !== transaction));
    } else {
      setSelectedItems([...selectedItems, transaction]);
    }
  };

// function handleSelectAll(e){
//   setSelectAll(e.target.checked);

// }

//   function handleChange(e) {
//     if(selectAll){
//       setAllChecked([...allchecked,selectAll]);
//     }
//     else if(!selectAll){
//       setAllChecked([...allchecked,selectAll]);
//     }
//      if (e.target.checked) {
//         setAllChecked([...allchecked, e.target.value]);
//      } else {
//         setAllChecked(allchecked.filter((item) => item !== e.target.value));
//      }
//   }
  // console.log("checked values",allchecked);
  // console.log("select all value:",selectAll)

  const handleComplete= async () => {
    const completeTransations = await Promise.all(
      selectedItems.map(async (transaction) => {
        const response = await fetch(`http://183.83.219.144:81/LMS/Coupon/CreatePayout/${CompanyId}/${transaction.id}/${transaction.upiAddress}/${transaction.payoutFundAccountId}/${transaction.transactionAmount*100}`,
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
    // navigate("/pendingtransactions");
    // window.location.reload();
    console.log("complete api response:",completeTransations);
  }

  const getPendingTransactions = async () => {
    //for total transactions list
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetPendingTransactions/${CompanyId}/${mobileNumber}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const respJson = await resp.json();
    setPendingTransactions(respJson);
    // setLoading(false);
  };
  // console.log("all pending transactions:", PendingTransactons);

  // const getUserDetails = async () => { //for user list
  //   const resp = await fetch(
  //     `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${CompanyId}`,
  //     {
  //       method: "GET",
  //       headers: new Headers({
  //         Authorization: `Bearer ${token}`,
  //       }),
  //     }
  //   );
  //   // console.log('response: ', resp.json());
  //   //setData(resp.json());
  //   //console.log('data length: ', data.length);
  //   const respJson = await resp.json();
  //   setUserDetails(respJson);
  //   // setLoading(false);
  // };
  console.log("user datails.",userDetalis)
  useEffect(() => {
    getPendingTransactions();
    // getUserDetails();
  }, []);
  console.log("checked values",allchecked);


  return (
    <div style={{position:'relative'}}>
      <h4 className="header mb-2">PendingTransactons</h4>
      {/* <input value="selectAll" type="checkbox" onChange={handleSelectAll} />  */}
      <div style={{display:'flex',flexDirection:'row',marginBottom:10}}>
      <label style={{display:'flex',flexDirection:'row'}}>
        <input style={{marginLeft:5,marginRight:5}}type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
        Select All
      </label>
      <button className="btn btn-primary" 
      style={{position:'absolute',right:0, marginRight:5}}
      onClick={handleComplete}>Complete</button> 
      </div>
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
            {!PendingTransactons.message && PendingTransactons
              ?.sort(
                (a, b) =>
                  new Date(...a.transactionDate.split("T")[0].split("-")) -
                  new Date(...b.transactionDate.split("T")[0].split("-"))
              )
              ?.map((transaction) => (
                <tr>
                  {/* <td> <input value={transaction.id} type = "checkbox" onChange = {handleChange} /> </td> */}
                  <td>
                  <input
                type="checkbox"
                checked={selectedItems.includes(transaction)}
                onChange={() => handleCheckboxChange(transaction)}
              /> </td>
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
    </div>
  );
};

export default PendingTransactons;
