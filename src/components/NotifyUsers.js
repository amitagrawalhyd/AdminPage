import { useState,useEffect } from "react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Cookies from 'js-cookie';
import '../App.css';
import {getToken} from './User/UserList';
import * as Yup from "yup";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";


const NotifyUsers = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const token = sessionStorage.getItem('token');
  const [file, setFile] = useState("");
  var startDate = new Date();
  var endDate = new Date();
  const [img,setImg] = useState('');
  const reader = new FileReader();
  const CompanyId = sessionStorage.getItem('CompanyId');
  const [registrations, setRegistrations] = useState([]); // users
  let heading = ["Select","Mobile Number", "Name"];
  const [selectedItems, setSelectedItems] = useState([]);// for checkbox
  const options = ["All", "Company", "Distributer", "Dealer", "Mechanic"]; //for dropdown
  const defaultOption = options[0]; //dropdown menu default option
  const [selected, setSelected] = useState(options[0]); //default value of dropdown
var responseArray = [];

function handleSelect(e) {
  // on select dropdown
  setSelected(e.value);
  // getTransactions();
}

function filterUsers(user) {
  if (user.registrationType === "Company" && selected === "Company") {
    return user;
  } else if (
    user.registrationType === "Distributer" &&
    selected === "Distributer"
  ) {
    return user;
  } else if (user.registrationType === "Dealer" && selected === "Dealer") {
    return user;
  } else if (user.registrationType === "Mechanic" && selected === "Mechanic") {
    return user;
  } else if (selected === "All") {
    return user;
  }
}

const filteredUsers =
  !registrations.message && registrations?.filter(filterUsers);

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
      // console.log('users from notify users:',data);
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
  // console.log("title and description from notify users:",title,description)

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
           responseArray = await Promise.all(
            selectedItems.map(async (user) => {
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
            console.log('responseArray:', responseArray);
        // Check if any element in responseArray is false
  const notificationFailed = responseArray.some((response) => !response);
  console.log('notification status:',notificationFailed)

  if (notificationFailed) {
    alert('Failed to send some notifications.');
    setTitle("");
  } else {
    alert('Notifications sent successfully.');
};
            // document.getElementById("notification-form").reset();
            // window.location.reload()
            setTitle("");
            setDescription("");
            setFile("");
            setSelectedItems([])
  }

  return (
    <div style={{display:'flex',flexDirection:'row',width:'100%'}}>
      <div style={{width:'40%'}}>
      <Dropdown
          className="user_dropdown"
          options={options}
          onChange={handleSelect}
          value={defaultOption}
          // placeholder="Select an option"
        />
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
              filteredUsers?.map((user) => (
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
          disabled={!title || !description || selectedItems.length===0}
          type="button"
        >
          Notify
        </button>
      </form>
      </div>
    </div>
  );
};

export default NotifyUsers;
