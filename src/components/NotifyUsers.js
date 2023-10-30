import { useState,useEffect } from "react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Cookies from 'js-cookie';
import '../App.css';
import {getToken} from './User/UserList';


const NotifyUsers = () => {
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
  const [notifyall,setNotifyall] = useState(false);

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
      console.log('usersfrom notify users:',registrations);
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
  console.log("title and description from notify users:",title,description)

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

  const handleNotify = async () => {

    // fetch(`http://183.83.219.144:81/LMS/Notification/PushNotificationToUser/${title}/${description}/${registrationId}`, {
    //   method: "POST",
    //   headers: new Headers({
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     console.log("response from savenotification:", responseData);
    //   })
    //   .catch((error) => console.log(error));

      const NotifyUsers = await Promise.all(
        selectedItems.map(async(user) => {
          const response = await fetch(`http://183.83.219.144:81/LMS/Notification/PushNotificationToUser/${title}/${description}/${user.registrationId}`,
          {
          method:'GET',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
          }
          )
          return await response.json();
        })
      );
      console.log("complete api response from notify users:",NotifyUsers);
  }

  return (
    <div style={{display:'flex',flexDirection:'row',width:'100%'}}>
      <div style={{width:'40%'}}>
            <table className="table table-striped">
          <thead style={{ justifyContent: "center" }}>
            <tr>
              {heading.map((head, headID) => (
                <th key={headID}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!registrations.message &&
              registrations?.map((user) => (
                <tr>
              <td>
                <input
                type="checkbox"
                checked={selectedItems.includes(user)}
                onChange={() => handleCheckboxChange(user)}
              /> 
              </td>
                  <td className="user">{user.registerMobileNumber}</td>
                  <td className="user"> {user.registerName}</td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      <div className="notification-container">
      <div className="notification-form">
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
      </div>
      </div>
    </div>
  );
};

export default NotifyUsers;
