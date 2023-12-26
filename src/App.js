import React, { createContext, useContext, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import HistoryIcon from "@mui/icons-material/History";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  // useProSidebar,
} from "react-pro-sidebar";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import UserList from "./components/User/UserList";
import AddUser, {
  AddUserProvider,
  useAddUser,
} from "./components/User/AddUser";
import CouponHistory from "./components/CouponHistory";
import CouponReport from './components/CouponReport';
import Notifications from "./components/Notifications";
import ManualEntry from "./components/ManualEntry";
import PendingTransactions from "./components/PendingTransactions";
import PageNotFound from "./components/PageNotFound";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import NotifyUsers from "./components/NotifyUsers";
import DOMPurify from 'dompurify';

// const Home = () => {
//   return (
//     <>
//       <h1 className="header"> WELCOME </h1>
//       <h3>Bank of the free</h3>
//       <p>Lorem ipsum dolor sit amet...</p>
//     </>
//   );
// };
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companyId, setCompanyId] = useState("");
  const [token, setToken] = useState("");
  //  const [companylogo,setCompanyLogo] = useState('');
  // const toggleEdit = () => {
  //   setEditmode(!editmode);
  // };

  return (
    <AppContext.Provider value={{ companyId, setCompanyId, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

const App = () => {
  const location = useLocation();
  const companyId = sessionStorage.getItem("CompanyId");
  // const { collapseSidebar } = useProSidebar();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const companylogo =
    location.pathname !== "/" && sessionStorage.getItem("logo");
  console.log("logo from appjs:", companylogo);
  const sanitizedCompanyLogo = DOMPurify.sanitize(companylogo);


  return (
    <div
      style={{
        display: "flex",
        // height: "100vh",
      }}
    >
      {location.pathname !== "/" && token && (
        <Sidebar className="position-fixed">
          <Menu>
            {/* <MenuItem
              onClick={() => {
                // collapseSidebar();
              }}
              className="menu1"
            > */}
            <img
              className="logo"
              src={`data:image/jpg;base64,${sanitizedCompanyLogo}`}
            />
            {/* <img className="logo" src={'https://plus.unsplash.com/premium_photo-1669324357471-e33e71e3f3d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} /> */}
            {/* </MenuItem> */}
            <MenuItem
              component={<Link to="dashboard" className={`link ${location.pathname === "/dashboard" ? "selected" : ""}`} />}
              icon={<GridViewRoundedIcon />}
            >
              Dashboard
            </MenuItem>

            <SubMenu label="Coupons" icon={<WalletRoundedIcon />}>
              <MenuItem
                component={<Link to="couponhistory" className={`link ${location.pathname === "/couponhistory" ? "selected" : ""}`} />}
                icon={<HistoryIcon />}
              >
                CouponHistory
              </MenuItem>

              <MenuItem
                component={<Link to="couponreport" className={`link ${location.pathname === "/couponreport" ? "selected" : ""}`} />}
                icon={<KeyboardIcon />}
              >
                {" "}
                Coupon Report{" "}
              </MenuItem>

              <MenuItem
                component={<Link to="manualentry" className={`link ${location.pathname === "/manualentry" ? "selected" : ""}`} />}
                icon={<KeyboardIcon />}
              >
                {" "}
                Manual Entry{" "}
              </MenuItem>
            </SubMenu>
            <SubMenu label="Transactions" icon={<MonetizationOnRoundedIcon />}>
              <MenuItem
                component={<Link to="transactions" className={`link ${location.pathname === "/transactions" ? "selected" : ""}`} />}
                icon={<MenuRoundedIcon />}
              >
                List of Transactions
              </MenuItem>
              <MenuItem
                component={<Link to="pendingtransactions" className={`link ${location.pathname === "/pendingtransactions" ? "selected" : ""}`} />}
                icon={<PendingActionsIcon />}
              >
                Pending Transactions
              </MenuItem>
            </SubMenu>

            <SubMenu label="User" icon={<PersonIcon />}>
              <MenuItem
                component={<Link to="userlist" className={`link ${location.pathname === "/userlist" ? "selected" : ""}`} />}
                icon={<PeopleAltIcon />}
              >
                {" "}
                User List{" "}
              </MenuItem>
              <MenuItem
                component={<Link to="adduser" className={`link ${location.pathname === "/adduser" ? "selected" : ""}`} />}
                icon={<PersonAddAltIcon />}
              >
                {" "}
                Add User{" "}
              </MenuItem>
              {/* <MenuItem icon={<ManageAccountsIcon />}> Edit User </MenuItem> */}
            </SubMenu>

            <MenuItem
              component={<Link to="notifications" className={`link ${location.pathname === "/notifications" ? "selected" : ""}`} />}
              icon={<NotificationsNoneIcon />}
            >
              {" "}
              Notifications{" "}
            </MenuItem>
            <MenuItem
              onClick={() => {
                sessionStorage.removeItem("token");
                console.log("token after logout:", token);
                navigate("/");
              }}
              icon={<LogoutRoundedIcon />}
            >
              {" "}
              Logout{" "}
            </MenuItem>
          </Menu>
        </Sidebar>
      )}

      <AppProvider>
        <AddUserProvider>
          <Routes>
            <Route
              path="/"
              element={!token ? <Login /> : <Navigate to="/dashboard" />}
            />

            {token && (
              <Route
                path="/*"
                element={
                  <div>
                    <Sidebar className="position-fixed">
                      {/* ... (your sidebar content) */}
                    </Sidebar>

                    {/* routes */}
                    <section
                      className={
                        // location.pathname === "/"
                        //   ? "login-container":
                        "section"
                      }
                    >
                      <Routes>
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="userlist" element={<UserList />} />
                        <Route path="adduser" element={<AddUser />} />
                        <Route
                          path="couponhistory"
                          element={<CouponHistory />}
                        />
                        <Route path="couponreport" element={<CouponReport />} />
                        <Route path="manualentry" element={<ManualEntry />} />
                        <Route
                          path="pendingtransactions"
                          element={<PendingTransactions />}
                        />
                        <Route
                          path="notifications"
                          element={<Notifications />}
                        />
                        <Route path="notifyusers" element={<NotifyUsers />} />
                        <Route path="*" element={<PageNotFound />} />
                      </Routes>
                    </section>
                  </div>
                }
              />
            )}
          </Routes>
        </AddUserProvider>
      </AppProvider>
    </div>
  );
};
export default App;
