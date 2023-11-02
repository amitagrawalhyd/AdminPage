import { useState,useEffect } from "react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Cookies from 'js-cookie';
import '../App.css';
import {getToken} from './User/UserList';
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const token = sessionStorage.getItem('token');
  const [file, setFile] = useState("");
  var startDate = new Date();
  var endDate = new Date();
  const [img,setImg] = useState('');
  const reader = new FileReader();
  const CompanyId = sessionStorage.getItem('CompanyId');
  const [registrations, setRegistrations] = useState([]); // users
  let heading = ["Select","Mobile Number", "Name"];
  const [selectedItems, setSelectedItems] = useState([]);
const navigate = useNavigate();
  const handleCheckboxChange = (user) => {
    if (selectedItems.includes(user)) {
      setSelectedItems(selectedItems.filter((item) => item !== user));
    } else {
      setSelectedItems([...selectedItems, user]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `http://183.83.219.144:81/LMS/Registration/GetRegistrations/${CompanyId}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${getToken()}`,
          }),
        }
      );
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      const data = await response.json();
      // if(data.message){getUsers()}
      setRegistrations(data);
      console.log('users from notification screen:',registrations);
    } catch (error) {
      console.error("Error from get users api:", error);
      // alert("hello");
    }
  };

    file && reader.readAsDataURL(file)
    reader.onload = () => {
      // console.log('called: ', reader)
      setImg(reader.result)
    }

  // console.log('base64 image:',img.split(",").pop());
  console.log("title and description:",title,description)

  // const handleComplete= async () => {
  //   const completeTransations = await Promise.all(
  //     selectedItems.map(async (transaction) => {
  //       const response = await fetch(`http://183.83.219.144:81/LMS/Coupon/CreatePayout/${CompanyId}/${transaction.id}/${transaction.upiAddress}/${transaction.payoutFundAccountId}/${transaction.transactionAmount*100}`,
  //       {
  //       method:'POST',
  //       headers: new Headers({
  //         Authorization: `Bearer ${token}`,
  //       }),
  //       }
  //       )
  //       return await response.json();
  //     })
  //   );
  //   console.log("complete api response:",completeTransations);
  // }

  function handleNotify() {
    fetch(`http://183.83.219.144:81/LMS/Notification/SaveNotification`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        companyId:2,
        title: title,
        description: description,
        imageURL: img.split(",").pop(),
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        isActive: true,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData){
          alert('sent notification')
        }
        else {
          alert('failed to send notification')
        }
        console.log("response from savenotification:", responseData);
      })
      .catch((error) => console.log(error));
      // navigate('/notifications');
      document.getElementById("notification-form").reset();
  }

  return (
      <div className="notification-container">
      <form className="notification-form">
      <h4>Send Notifications</h4>
        <input
          className="notification-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          className="notification-description"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <img
        style={{width:'50%',height:'30%'}}
          src={file && URL.createObjectURL(file)}
          // : "https://default-image.jpg"
          alt=""
        />
        <label style={{position:'absolute',bottom:0,margin:20,cursor:"pointer"}}>
        <AttachFileIcon/> Upload Image
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
           accept= 'image/*'
           style={{display:'none'}}
        />
        </label>
        <button
          onClick={handleNotify}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            bottom: 0,
            margin: 20,
            border: 0,
          }}
          className="btn btn-primary"
          disabled={!title || !description}
        >
          Notify
        </button>
      </form>
      <p style={{marginTop:10}}>Click <a href="/notifyusers" style={{textDecoration:'underline',cursor:'pointer'}}>here</a> to notify selected users</p>
      </div>
  );
};

export default Notifications;
