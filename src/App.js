import React,{createContext,useContext,useState} from "react";
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
import PendingActionsIcon from '@mui/icons-material/PendingActions';


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
import AddUser, { AddUserProvider } from "./components/User/AddUser";
import CouponHistory from "./components/CouponHistory";
import Notifications from "./components/Notifications";
import ManualEntry from "./components/ManualEntry";
import PendingTransactions from './components/PendingTransactions';
import PageNotFound from "./components/PageNotFound";
import Cookies from 'js-cookie';
import {useNavigate } from "react-router-dom";


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
  const [companyId, setCompanyId] = useState('');
  const [token, setToken] = useState('');

  // const toggleEdit = () => {
  //   setEditmode(!editmode);
  // };

  return (
    <AppContext.Provider
      value={{ companyId, setCompanyId, token, setToken }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};



const App = () => {
  const location = useLocation();
  // const { collapseSidebar } = useProSidebar();
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  // console.log('token from login:',token)
  // console.log("location pathname, token",location.pathname,token);


  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {location.pathname != "/" && token &&(
        <Sidebar className="position-fixed">
          <Menu>
            <MenuItem
              onClick={() => {
                // collapseSidebar();
              }}
              className="menu1"
              icon={<MenuRoundedIcon />}
            >
              <h3>ADMIN</h3>
            </MenuItem>
            <MenuItem
              component={<Link to="dashboard" className="link" />}
              icon={<GridViewRoundedIcon />}
            >
              Dashboard
            </MenuItem>

            <SubMenu label="Coupons" icon={<WalletRoundedIcon />}>
            <MenuItem
              component={<Link to="couponhistory" className="link" />}
              icon={<HistoryIcon />}
            >
              CouponHistory
            </MenuItem>
              
            <MenuItem
              component={<Link to="manualentry" className="link" />}
              icon={<KeyboardIcon />}
            >
              {" "}
              Manual Entry{" "}
            </MenuItem>
            </SubMenu>
            <SubMenu label="Transactions" icon={<MonetizationOnRoundedIcon />}>
            <MenuItem
              component={<Link to="transactions" className="link" />}
              icon={<PendingActionsIcon />}
            >
             List of Transactions
            </MenuItem>
            <MenuItem
              component={<Link to="pendingtransactions" className="link" />}
              icon={<PendingActionsIcon />}
            >
              Pending Transactions
            </MenuItem>
              
            </SubMenu>


            <SubMenu label="User" icon={<PersonIcon />}>
              <MenuItem
                component={<Link to="userlist" className="link" />}
                icon={<PeopleAltIcon />}
              >
                {" "}
                User List{" "}
              </MenuItem>
              <MenuItem
                component={<Link to="adduser" className="link" />}
                icon={<PersonAddAltIcon />}
              >
                {" "}
                Add User{" "}
              </MenuItem>
              {/* <MenuItem icon={<ManageAccountsIcon />}> Edit User </MenuItem> */}
            </SubMenu>


            <MenuItem
              component={<Link to="notifications" className="link" />}
              icon={<NotificationsNoneIcon />}
            >
              {" "}
              Notifications{" "}
            </MenuItem>
            <MenuItem
                onClick={() => {
                  sessionStorage.removeItem('token');
                  console.log('token after logout:',token)
                  navigate("/");
                }}
            icon={<LogoutRoundedIcon />}> Logout </MenuItem>
          </Menu>
        </Sidebar>
      )}
      {/* routes */}
      <section className={location.pathname == "/"? "login-container" : "section"}>
        <AppProvider>
        <AddUserProvider>
        <Routes>
        {!token ? (
          <Route path="/" element={<Login />} />
        ) : ( 
          <>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="couponhistory" element={<CouponHistory />} />
          <Route path="manualentry" element={<ManualEntry />} />
          <Route path="pendingtransactions" element={<PendingTransactions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<PageNotFound />} />
          </>
          )}  
        </Routes>
        </AddUserProvider>
        </AppProvider>
      </section>
    </div>
  );
};
export default App;
