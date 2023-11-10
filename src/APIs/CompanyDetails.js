// CompanyDetails.js
import React, { useEffect, useState } from "react";
import { getToken } from "../components/User/UserList";

var isEmpty = require("lodash.isempty");

const CompanyDetails = ({ companyId }) => {
  const [companydetails, setCompanyDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompanyDetails = async () => {
      try {
        const token = getToken();

        // Check if a valid token is present
        if (!token) {
          setError("Token is missing");
          return;
        }

        const resp = await fetch(
          `http://183.83.219.144:81/LMS/Company/Companies/${companyId}`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
            }),
          }
        );

        if (!resp.ok) {
          setError(`Failed to fetch company details: ${resp.status}`);
        //   console.log('resp.status',resp.status);
        getCompanyDetails();
          return;
        }

        const respJson = await resp.json();
        setCompanyDetails(respJson);
      } catch (error) {
        setError(`Error fetching company details: ${error.message}`);
      }
    };

    getCompanyDetails();
  }, [companyId]);

  console.log("company details:", companydetails);

  let companylogo =
    !isEmpty(companydetails) &&
    !companydetails.message &&
    companydetails?.map((company) => company.companyLogo)[companyId - 1];
  sessionStorage.setItem("companylogo", companylogo);
  console.log("company logo: ", companylogo);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <img className="logo" src={`data:image/jpg;base64,${companylogo}`} />
    </div>
  );
};

export default CompanyDetails;
