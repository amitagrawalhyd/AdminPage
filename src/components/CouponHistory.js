import React,{useState, useEffect} from "react";
import { Constants } from "../constants/credentials";
import "../App.css";
const CouponHistory = () => {
const companyId = Constants.companyId;
const token = Constants.token;
const [data,setData] = useState();
let heading = ["Coupon Code","Coupon Id","Name", "Mobile Number","Date-Time"];


  useEffect(() => {
    getCouponHistory();
  },[])

  const getCouponHistory = async () => {
    // console.log('loading data:', storedMobileNumber, storedToken);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Coupon/GetCouponTransactions/${companyId}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      },
    );
    //setData(resp.json());
    //console.log('data length: ', data.length);
    const respJson = await resp.json();
    console.log('response: ', respJson);
    setData(respJson);
    // setLoading(false);
  };

    return (
      <>
        <h4 className="header">Coupon History</h4>

        <div >
      {/* <h1 className="header">User List</h1> */}

      <table className="table  table-striped">
        <thead style={{padding: 20, backgroundcolor: 'red'}}>
          <tr>
            {heading.map((head, headID) => (
              <th key={headID}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {data?.map((coupon) => (
            <tr>
              <td className="coupon">{coupon.couponCode}</td>
              <td className="coupon">{coupon.couponId}</td>
              <td className="coupon"> {coupon.registerName}</td>
              <td className="coupon">{coupon.registerMobileNumber}</td>
              <td className="coupon">{coupon.changeDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </>
    );
  };

  export default CouponHistory;