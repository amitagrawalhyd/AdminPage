import { useState } from "react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Cookies from 'js-cookie';
import '../App.css';

const Notifications = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const token = sessionStorage.getItem('token');
  const [file, setFile] = useState("");
  var startDate = new Date();
  var endDate = new Date();
  const [img,setImg] = useState('');
  const reader = new FileReader();

    file && reader.readAsDataURL(file)

    reader.onload = () => {
      // console.log('called: ', reader)
      setImg(reader.result)
    }

  // console.log('base64 image:',img.split(",").pop());
  console.log("title and description:",title,description)

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
        console.log("response from delete user:", responseData);
      })
      .catch((error) => console.log(error));
  }
  
  

  return (
    <>
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
        >
          Notify
        </button>
      </div>
      </div>
    </>
  );
};

export default Notifications;
