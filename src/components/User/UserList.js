import React, { useState, useEffect } from "react";
import { Constants } from "../../constants/credentials";
export default function UserList() {
  const companyId = Constants.companyId;
  const token = Constants.token;
  const [registrations, setRegistrations] = useState([]);
  let heading = ["Name", "Mobile Number","City","UPI ID","Wallet value" ];
  const getData = async () => {
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${companyId}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
    const data = await resp.json();
    setRegistrations(data);
  };
  console.log("registrations:", registrations);
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1 className="header">User List</h1>

      <table className="table table-striped ">
        <thead style={{justifyContent:'center'}}>
          <tr>
            {heading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {registrations.map((user) => (
            <tr>
              <td className="user"> {user.registerName}</td>
              <td className="user">{user.registerMobileNumber}</td>
              <td className="user">{user.city}</td>
              <td className="user">{user.upiAddress}</td>
              <td className="user">{user.walletValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
