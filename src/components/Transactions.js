import React, { useState, useEffect, useRef } from "react";
import { usePDF } from "react-to-pdf";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import saveAs from "file-saver";
import { useAddUser } from "./User/AddUser";
import Loader from "react-js-loader";
import { Constants } from "../constants/credentials";

const ExcelJS = require("exceljs");

const Transactions = () => {
  const CompanyId = sessionStorage.getItem("CompanyId");
const Api = Constants.api;

  const token = sessionStorage.getItem("token");
  const [mobileNumber, setMobileNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setEditmode } = useAddUser();
  setEditmode(false);

  let heading = [
    "Select",
    "Amount",
    "Mobile Number",
    "Name",
    "Payout Status",
    "Transaction ID",
    "Status",
    "Date",
  ];
  const options = ["All", "Completed", "Pending", "Rejected"]; //for dropdown
  const defaultOption = options[0];
  const [selected, setSelected] = useState(options[0]); //default value of dropdown
  const { toPDF, targetRef } = usePDF({ filename: "transactions.pdf" }); //for pdf
  const tableRef = useRef(null); // for excel
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (transaction) => {
    if (selectedItems.includes(transaction)) {
      setSelectedItems(selectedItems.filter((item) => item !== transaction));
    } else {
      setSelectedItems([...selectedItems, transaction]);
    }
  };
  console.log("selected items:", selectedItems);
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

  const getTransactions = async () => {
    setLoading(true);
    const resp = await fetch(
      `${Api}/Coupon/GetTransactions/${CompanyId}?mobileNumber=${mobileNumber}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const respJson = await resp.json();
    setTransactions(respJson);
    setLoading(false);
  };


  useEffect(() => {
    getTransactions();
  }, []);


  function handleSelect(e) {
    setSelected(e.value);
  }

  const handleRequeue = async () => {
    setLoading(true);
    const completeTransations = await Promise.all(
      selectedItems.map(async (transaction) => {
        const response = await fetch(
          `${Api}/Coupon/RequeueTransaction/${CompanyId}/${
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
    console.log("complete api response:", completeTransations);
    getTransactions();
    setSelectedItems([]);
    setLoading(false);
  };

  const filteredTransactions =
    !transactions.message && transactions?.filter(filterTransactions);

    function filterTransactions(transaction) {
      if (
    (transaction.isPaid && transaction.isActive && selected === "Completed") ||
    (!transaction.isPaid && transaction.isActive && selected === "Pending") ||
    (!transaction.isPaid && !transaction.isActive && selected === "Rejected") ||
    selected === "All"
  ) {
    return transaction;
  }
  
    }

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    sheet.columns = [
      {
        header: "Amount",
        key: "amount",
        width: 20,
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
        header: "Payout Status",
        key: "payoutStatus",
        width: 15,
      },
      {
        header: "Transaction Id",
        key: "transactionId",
        width: 25,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
      {
        header: "Date",
        key: "date",
        width: 15,
      },
    ];
    console.log("registrations before export:", filterTransactions);
    const promise = Promise.all(
      filteredTransactions?.map(async (transaction) => {
        // const rowNumber = index + 1;
        sheet.addRow({
          amount: transaction.transactionAmount,
          name: transaction.registerName,
          mobileNumber: transaction.registerMobileNumber,
          payoutStatus: transaction.payoutStatus,
          transactionId: transaction.payoutTransactionId,
          status:
            (transaction.isPaid && transaction.isActive && "Completed") ||
            (!transaction.isPaid && transaction.isActive && "Pending") ||
            (!transaction.isPaid && !transaction.isActive && "Rejected"),
          date: formatDate(transaction.transactionDate.split("T")[0]),
        });
      })
    );
    promise.then(() => {
      console.log("pormise:", promise);
    }).catch((error) => console.log('error in promise:', error));

    const amountColumn = sheet.getColumn("amount");
    amountColumn.alignment = { horizontal: "center" };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "transactions.xlsx");
    }).catch((error) => console.log('error while converting to xlsx:',error));
  };

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
        <div>
          <h4 className="header mb-4 font-weight-bold">List of Transactions</h4>
          <button
            onClick={handleRequeue}
            style={{
              color: "white",
              padding: 5,
              borderRadius: 5,
              marginTop:'5px',
              backgroundColor: selectedItems.length === 0 ? "grey" : "blue",
              border: 0,
              cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
            }}
            disabled={selectedItems.length === 0}
          >
            Requeue
          </button>
          <div className="d-flex align-items-center justify-content-between form_transaction">
            <input
              className="form-control ml-0"
              style={{ margin: 10 }}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Search Mobile Number"
            />

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
            <Dropdown
              options={options}
              onChange={handleSelect}
              value={defaultOption}
              placeholder="Select an option"
              className="transaction_dropdown"
            />

            <button
              type="button"
              className="btn btn-primary"
              style={{ margin: 10 }}
              onClick={getTransactions}
            >
              Submit
            </button>
          </div>

          <div>
            <div ref={targetRef}>

              <table className="table  table-striped" ref={tableRef}>
                <thead style={{ justifyContent: "center" }}>
                  {filteredTransactions?.length !== 0 ? (
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
                {filterTransactions.length !== 0 && (
                  <tbody>
                    {!transactions.message &&
                      filteredTransactions
                        ?.sort(
                          (a, b) =>
                            new Date(
                              ...a.transactionDate.split("T")[0].split("-")
                            ) -
                            new Date(
                              ...b.transactionDate.split("T")[0].split("-")
                            )
                        )
                        .reverse()
                        ?.map((transaction) => (
                          <tr key={transaction.id}>
                          {
                              // (!transaction.isActive && !transaction.isPaid) ||
                              transaction.payoutStatus === "rejected" ||
                              transaction.payoutStatus === "reversed" ||
                              transaction.payoutStatus === "failed" ? (
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(
                                      transaction
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(transaction)
                                    }
                                  />
                                </td>
                              ) : (
                                <td> </td>
                              )
                            }
                            <td className="transaction">
                              ₹{transaction.transactionAmount}
                            </td>
                            <td className="transaction">
                              {transaction.registerMobileNumber}
                            </td>
                            <td className="transaction">
                              {" "}
                              {transaction.registerName}
                            </td>
                            <td>{transaction.payoutStatus}</td>
                            <td>{transaction.payoutTransactionId}</td>
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
                            <td className="transaction">
                              {formatDate(
                                transaction.transactionDate.split("T")[0]
                              )}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                )}
              </table>
            </div>
            {filteredTransactions?.length !== 0 && (
              <div>
                <button
                  className="btn btn-secondary mb-2"
                  onClick={exportExcelFile}
                >
                  Export to Excel{" "}
                </button>
                <button
                  className="btn btn-secondary mb-2 mx-2"
                  onClick={() => toPDF()}
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
