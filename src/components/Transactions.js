import React, { useState, useEffect, useRef } from "react";
import { Constants } from "../constants/credentials";
import Cookies from "js-cookie";
import { usePDF } from "react-to-pdf";
import { useDownloadExcel } from "react-export-table-to-excel";
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Autocomplete from 'react-autocomplete';


const Transactions = () => {
  const companyId = Constants.companyId;
  const token = Cookies.get("token");
  const [mobileNumber, setMobileNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [allTransactions,setAllTransactions] = useState([]);

  let heading = ["Amount", "Name", "Mobile Number", "UPI ID", "Status", "Date"];
  const options = ["All", "Completed", "Pending", "Rejected"]; //for dropdown
  const  defaultOption = options[0];

  const [selected, setSelected] = useState(options[0]); //default value of dropdown
  const { toPDF, targetRef } = usePDF({ filename: "transactions.pdf" }); //for pdf
  const tableRef = useRef(null); // for excel
  var value = ''; // testing purpose

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
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetTransactions/${companyId}?mobileNumber=${mobileNumber}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`, 
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
  };
  // console.log("transactions:", transactions);

  const getAllTransactions = async () => { //for total transactions list
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
    setAllTransactions(respJson);
    // setLoading(false);
  };
  console.log('all transactions:',allTransactions);

  useEffect(() => {
    getTransactions();
    getAllTransactions();
  }, []);

  // transactions.sort((a,b) => b.transactionDate.localeCompare(a.transactionDate));
  // transactions.forEach(transaction => {
  //   console.log(transaction.transactionDate.split('T')[0].split('-'));
  // });
  // let sortedTransactions = transactions.sort((a, b) => new Date(...a.transactionDate.split('T')[0].split('-')) - new Date(...b.transactionDate.split('T')[0].split('-')));
  // const reversed = sortedTransactions.reverse();
  // console.log('sorted transactions:',sortedTransactions);

  const allMobileNumbers = allTransactions?.map((transaction) => transaction.registerMobileNumber); // list of all mobile numbers*(contains duplicates)
  const uniqNumbers = [...new Set(allMobileNumbers)];

  console.log("mobilenumber list:", uniqNumbers); // list of unique mobile numbers
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "List of Transactions",
    sheet: "Transactions",
  });

  function handleSelect(e) {
    // on select dropdown
    setSelected(e.value);
    // getTransactions();
  }
  console.log("selected before filter:", selected);

  const filteredTransactions = transactions?.filter(filterTransactions);
  function filterTransactions(transaction) {
    if (transaction.isPaid && transaction.isActive && selected == "Completed") {
      return transaction;
    } else if (
      !transaction.isPaid &&
      transaction.isActive &&
      selected == "Pending"
    ) {
      return transaction;
    } else if (
      !transaction.isPaid &&
      !transaction.isActive &&
      selected == "Rejected"
    ) {
      return transaction;
    }
    else if (selected == "All"){
      return transaction;
    }
  }

  console.log('here;', filteredTransactions);
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
        {/* <Autocomplete
          getItemValue={(item) => item.label}
          items={uniqNumbers}
          renderItem={(item, isHighlighted) => (
<div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item}
            </div>
          )}
          value={value}
          onChange={(e) => (value = e.target.value)}
          onSelect={(val) => (value = val)}
        /> */}
        <label className="mb-0">Start Date:</label>
        {/* <input
          className="form-control"
          style={{ margin: 10 }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /> */}
        <DatePicker
          className="form-control"
          selected={startDate}
          dateFormat="yyyy/MM/dd"
          onChange={(date) => setStartDate(date)}
        />
        <label className="mb-0">End Date:</label>
        <DatePicker
          className="form-control"
          selected={endDate}
          dateFormat="yyyy/MM/dd"
          onChange={(date) => setEndDate(date)}
        />
        <Dropdown
          options={options}
          onChange={handleSelect}
          value={defaultOption}
          placeholder="Select an option"
        />

        {/* <DropdownButton
          alignRight
          title="Sort by"
          id="dropdown-menu-align-right "
          // className="btn btn-secondary"
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="rejected">Rejected </Dropdown.Item>
        </DropdownButton> */}

        {/*         
        <div class="dropdown">
          <div className="cust_dropdown">
            <button
              type="button"
              class="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
            >
              filter
            </button>
            <div  class="dropdown-menu dropdown-menu-right">
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
        </div> */}

        <button
          type="button"
          class="btn btn-primary"
          style={{ margin: 10 }}
          onClick={getTransactions}
        >
          Submit
        </button>
      </div>

      <div>
        <div ref={targetRef}>
          {/* Content to be generated to PDF */}

          <table className="table  table-striped" ref={tableRef}>
            <thead style={{ justifyContent: "center" }}>
              {filteredTransactions?.length !== 0 ? (
                <tr>
                  {heading.map((head, headID) => (
                    <th key={headID}>{head}</th>
                  ))}
                </tr>
              ) : (
                "No records found"
              )}
            </thead>
            {filterTransactions.length != 0 && (
              <tbody>
                {filteredTransactions
                  ?.sort(
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
                      <td className="transaction">
                        {" "}
                        {transaction.registerName}
                      </td>
                      <td className="transaction">
                        {transaction.registerMobileNumber}
                      </td>
                      {/* <td className="transaction">{transaction.city}</td> */}
                      <td className="transaction">{transaction.upiAddress}</td>
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
                        {transaction.transactionDate.split("T")[0]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
        {filteredTransactions?.length != 0 && (
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
        )}
      </div>
    </div>
  );
};

export default Transactions;
