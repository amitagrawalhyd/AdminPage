import { useState, useEffect } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Cookies from "js-cookie";
import "../App.css";
import { getToken } from "./User/UserList";
import * as Yup from "yup";
import Loader from "react-js-loader";
import { Constants } from "../constants/credentials";

const NotifyUsers = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = sessionStorage.getItem("token");
  const [file, setFile] = useState("");
  var startDate = new Date();
  var endDate = new Date();
  const [img, setImg] = useState("");
  const reader = new FileReader();
  const CompanyId = sessionStorage.getItem("CompanyId");
const Api = Constants.api;
  const [registrations, setRegistrations] = useState([]); // users
  let heading = ["Select", "Mobile Number", "Name"];
  const [selectedItems, setSelectedItems] = useState([]); // for checkbox
  const [loading, setLoading] = useState(false);

  var responseArray = [];

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
    setLoading(true);
    try {
      const response = await fetch(
        `${Api}/Registration/GetRegistrations/${CompanyId}`,
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
      setLoading(false);
    } catch (error) {
      console.error("Error from get users api:", error);
      // alert("hello");
    }
  };

  file && reader.readAsDataURL(file);
  reader.onload = () => {
    console.log('called: ', reader)
    setImg(reader.result);
  };

  // console.log('base64 image:',img.split(",").pop());
  // console.log("title and description from notify users:",title,description)

  const handleNotify = async () => {
    setLoading(true);
    responseArray = await Promise.all(
      selectedItems.map(async (user) => {
        const response = await fetch(
          `${Api}/Notification/SaveNotification`,
          {
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              companyId: CompanyId,
              title: title,
              description: description,
              imageURL: img?.split(",").pop(),
              startDateTime: startDate.toISOString(),
              endDateTime: endDate.toISOString(),
              isActive: true,
              mobileNumber: user.registerMobileNumber,
            }),
          }
        );
        console.log("response from notify users:", response);
        return await response.json();
      })
    );
    setLoading(false);
    console.log("responseArray:", responseArray);
    // Check if any element in responseArray is false
    const notificationFailed = responseArray.some((response) => !response);
    console.log("notification status:", notificationFailed);

    if (notificationFailed) {
      alert("Failed to send some notifications.");
      setTitle("");
    } else {
      alert("Notifications sent successfully.");
    }
    // document.getElementById("notification-form").reset();
    // window.location.reload()
    setTitle("");
    setDescription("");
    setFile("");
    setImg("");
    setSelectedItems([]);
  };

console.log('img:',img,'file:',file);

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
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div style={{ width: "40%" }}>
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
                          className="custom-checkbox"
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
              <h4 className="font-weight-bold">Send Notifications</h4>
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
                style={{
                  width: file ? "25%" : "15%",
                  height: file ? "25%" : "15%",
                  margin: "10px 0px",
                }}
                src={
                  file
                    ? URL.createObjectURL(file)
                    :require('./../assets/Preview2008.webp')
                }
                alt="preview image"
              />

              <label
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 20,
                }}
              >
                {/* <AttachFileIcon /> Upload Image */}
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".png, .jpg, .jpeg, .gif"
                  // style={{ display: "none" }}
                />
              </label>

              <button
                onClick={() => handleNotify()}
                style={{
                  color: "white",
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: !title || !description ? "grey" : "blue",
                  border: 0,
                  cursor: !title || !description ? "not-allowed" : "pointer",
                  bottom: 15,
                  border: 0,
                  right: 15,
                  position: "absolute",
                }}
                disabled={!title || !description}
                type="button"
              >
                Notify
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NotifyUsers;
