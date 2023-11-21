import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "./User/AddUser";
import DatePicker from "react-datepicker";
import Loader from "react-js-loader";

const PendingTransactons = () => {
  const CompanyId = sessionStorage.getItem("CompanyId");
  const token = sessionStorage.getItem("token");
  const [pendingtransactions, setPendingTransactions] = useState([]);
  let heading = [
    "Select",
    "Amount",
    "Name",
    "Mobile Number",
    "UPI ID",
    "Status",
    "Date",
  ];
  const [allchecked, setAllChecked] = React.useState([]);
  const mobileNumber = sessionStorage.getItem("mobileNumber");
  // const [selectAll,setSelectAll] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [usernumbers, setUserNumbers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { setEditmode } = useAddUser();
  setEditmode(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingtransactions.map((item) => item));
    }
    setSelectAll(!selectAll);
  };
  console.log("selected items:", selectedItems);

  const handleCheckboxChange = (transaction) => {
    if (selectedItems.includes(transaction)) {
      setSelectedItems(selectedItems.filter((item) => item !== transaction));
    } else {
      setSelectedItems([...selectedItems, transaction]);
    }
  };

  function formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0], // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
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

  const handleComplete = async () => {
    setLoading(true);
    const completeTransations = await Promise.all(
      selectedItems.map(async (transaction) => {
        const response = await fetch(
          `http://183.83.219.144:81/LMS/Coupon/CreatePayout/${CompanyId}/${
            transaction.id
          }/${transaction.upiAddress}/${transaction.payoutFundAccountId}/${
            transaction.transactionAmount * 100
          }`,
          {
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
        return await response.json();
      })
    );
    // navigate("/pendingtransactions");
    // window.location.reload();
    getPendingTransactions();
    setLoading(false);
    setSelectedItems([]);
    console.log("complete api response:", completeTransations);
  };

  const getPendingTransactions = async () => {
    setLoading(true);
    //for total transactions list
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetPendingTransactions/${CompanyId}/${mobileNumber}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const respJson = await resp.json();
    setPendingTransactions(respJson);
    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect is running");
    console.log("State:", {
      pendingtransactions,
      selectAll,
      startDate,
      endDate,
    });
    getPendingTransactions();
    // getUserDetails();
  }, []);
  console.log("checked values", allchecked);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "85vh",
          }}
        >
          <Loader bgColor={"#16210d"} type="spinner-cub" />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <h4 className="header mb-4 font-weight-bold">Pending Transactions</h4>
          {/* <input value="selectAll" type="checkbox" onChange={handleSelectAll} />  */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label style={{ display: "flex", flexDirection: "row", margin: 0 }}>
              <input
                style={{ marginLeft: 5, marginRight: 5 }}
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              Select All
            </label>
            <button
              style={{
                color: "white",
                padding: 5,
                borderRadius: 5,
                backgroundColor: selectedItems.length === 0 ? "grey" : "blue",
                border: 0,
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
              }}
              disabled={selectedItems.length === 0}
              onClick={handleComplete}
            >
              Complete
            </button>
            <label className="mb-0">Start Date:</label>

            <DatePicker
              className="form-control"
              selected={startDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setStartDate(date)}
            />
            <label className="mb-0">End Date:</label>
            <DatePicker
              className="form-control"
              selected={endDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setEndDate(date)}
            />
            <button
              type="button"
              className="btn btn-primary"
              // style={{ margin: 10 }}
              onClick={getPendingTransactions}
            >
              Submit
            </button>
          </div>
          <div>
            <table className="table  table-striped">
              <thead style={{ padding: 20 }}>
                {pendingtransactions?.length !== 0 ? (
                  <tr>
                    {heading.map((head, headID) => (
                      <th key={headID}>{head}</th>
                    ))}
                  </tr>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "69vh" }}
                  >
                    <p>No records found</p>
                  </div>
                )}
              </thead>
              <tbody>
                {!pendingtransactions.message &&
                  pendingtransactions
                    ?.sort(
                      (a, b) =>
                        new Date(
                          ...a.transactionDate.split("T")[0].split("-")
                        ) -
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
                          />{" "}
                        </td>
                        <td className="coupon">
                          {transaction.transactionAmount}
                        </td>
                        <td className="coupon">{transaction.registerName}</td>
                        <td className="coupon">
                          {transaction.registerMobileNumber}
                        </td>
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
                          {formatDate(
                            transaction.transactionDate.split("T")[0]
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingTransactons;
