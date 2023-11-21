import { useState, useEffect } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Cookies from "js-cookie";
import "../App.css";
import { getToken } from "./User/UserList";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "./User/AddUser";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Loader from "react-js-loader";

const Notifications = () => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const token = sessionStorage.getItem("token");
  const mobileNumber = sessionStorage.getItem("mobileNumber");
  const [file, setFile] = useState("");
  var startDate = new Date();
  var endDate = new Date();
  const [img, setImg] = useState("");
  const reader = new FileReader();
  const CompanyId = sessionStorage.getItem("CompanyId");
  const [registrationtypes, setRegistrationTypes] = useState([]); 
  let heading = ["Select", "Mobile Number", "Name"];
  const [selectedItems, setSelectedItems] = useState([]);
  const [selected, setSelected] = useState(""); // Define 'selected' here
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setEditmode } = useAddUser();
  setEditmode(false);

  useEffect(() => {
    getRegistrationTypes();
  }, []);

  async function getRegistrationTypes() {
    setLoading(true);
    const resp = await fetch(
      `http://183.83.219.144:81/LMS/Registration/GetRegistrationTypes/${CompanyId}/${mobileNumber}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    ).catch((error) => {
      console.log("error fetching registration types:", error);
    });
    const data = await resp.json();
    console.log("registration types:", data);
    setRegistrationTypes(data);
    setLoading(false);
  }

  file && reader.readAsDataURL(file);
  reader.onload = () => {
    // console.log('called: ', reader)
    setImg(reader.result);
  };
  // console.log('base64 image:',img.split(",").pop());
  // console.log("title and description:", title, description);
  console.log("selected dropdown value:", selected);

  function handleNotify() {
    setLoading(true);
    let requestBody = {
      companyId: 2,
      title: title,
      description: description,
      imageURL: img.split(",").pop(),
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      isActive: true,
    };

    if (selected !== "All" && selected !== "") {
      requestBody.registrationType = selected;
    }

    fetch(`http://183.83.219.144:81/LMS/Notification/SaveNotification`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          alert("sent notification");
          setTitle("");
          setDescription("");
          setFile("");
        } else {
          alert("failed to send notification");
          setTitle("");
          setDescription("");
          setFile("");
        }
        console.log("response from savenotification:", responseData);
        setLoading(false);
      })
      .catch((error) => console.log(error));
    // navigate('/notifications');
    // document.getElementById("notification-form").reset();
  }

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
            <select
              name="dropdown"
              onChange={(event) => {
                setSelected(event.target.value);
              }}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
              }}
            >
              {!registrationtypes.message && (
                <>
                  <option value="All">All</option>
                  {registrationtypes?.slice(1)?.map((type) => (
                    <option
                      key={type.registrationTypeId}
                      value={type.registrationTypeId}
                    >
                      {type.registrationTypeName}
                    </option>
                  ))}
                </>
              )}
            </select>
            <img
              style={{ width: file ? "50%": "25%", height:file ? "50%" : '25%', margin: "10px 0px" }}
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://as2.ftcdn.net/v2/jpg/03/56/66/85/1000_F_356668511_RjvZ4P3UjEa85gal199KXdvHQGDCEn0V.jpg"
              }
              alt="preview image"
            />

            <label
              style={{
                position: "absolute",
                bottom: 0,
                margin: 10,
                cursor: "pointer",
              }}
            >
              <AttachFileIcon /> Upload Image
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
            <button
              onClick={handleNotify}
              style={{
                color: "white",
                padding: 5,
                borderRadius: 5,
                backgroundColor: (!title || !description) ? "grey" : "blue",
                border: 0,
                cursor: (!title || !description) ? "not-allowed" : "pointer",
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
          <p style={{ marginTop: 10 }}>
            Click{" "}
            <a
              href="/notifyusers"
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              here
            </a>{" "}
            to notify selected users
          </p>
        </div>
      )}
    </>
  );
};

export default Notifications;
