import "./SideNavBar.css";
import React, { useContext, useState } from "react";
import { Store } from "../../states/store";
import { Link, useNavigate } from "react-router-dom";
import { HiUsers } from "react-icons/hi";
import { RiDashboard2Fill } from "react-icons/ri";
import { FaShieldAlt, FaSignOutAlt, FaTasks } from "react-icons/fa";
import { MdContactPhone, MdOutlineInsights, MdOutlineSwapHoriz } from "react-icons/md";
import { TbArrowsExchange } from "react-icons/tb";
import { BsListCheck, BsPersonLinesFill } from 'react-icons/bs';
import { SiLevelsdotfyi } from 'react-icons/si';
import { GrTransaction } from 'react-icons/gr';

const adminList = [
  { icon: <RiDashboard2Fill className="icon-md" />, text: "Active Sales Tasks", url: "/admin/active-sale-tasks" },
  { icon: <MdOutlineInsights className="icon-md" />, text: "Sale Insights", url: "/admin/sale-insights" },
  { icon: <FaShieldAlt className="icon-md" />, text: "Leads", url: "/admin/leads" },
  // { icon: <BsPersonLinesFill className="icon-md" />, text: "Sale Persons", url: "/admin/sale-person" },
  { icon: <TbArrowsExchange className="icon-md big" />, text: "Transaction", url: "/admin/transactions" },
  // { icon: <MdContactPhone className="icon-md" />, text: "Enquiry", url: "/admin/enquiry" },
  // { icon: <SiLevelsdotfyi className="icon-md" />, text: "Level", url: "/admin/levels" },
  // { icon: <BsListCheck className="icon-md" />, text: "Plan", url: "/admin/plans" },
];

// const spList = [
//   { icon: <RiDashboard2Fill className="icon-md" />, text: "Dashboard", url: "/sale-person/dashboard" },
//   { icon: <FaTasks className="icon-md" />, text: "Tasks", url: "/sale-person/tasks" },
// ];

const active_text = {
  Leads: "leads",
  "Sale Insights": "sale-insights",
  // "Active Sale Tasks": "warranty",
  // "Sale Persons": "sale-person",
  // Tasks: "task",
  Transaction: "transaction",
  // Enquiry: "enquiry",
  // Level: "level",
  // Plan: "plan",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState('Dashboard');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    // console.log("text", active_text[text]);
    // console.log(pathname.includes(active_text[text]));
    if (text === 'Active Sales Tasks') {
      return pathname.includes("warranty") || pathname.includes("active-sale-tasks");
    }
    return pathname.includes(active_text[text]);
  };

  const cls = `nav-item has-treeview ${isExpanded ? "menu-item" : "menu-item menu-item-NX"}`;

  console.log({ userInfo })
  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            <img src="/logo/Logo.png" alt="" width={"50px"} height="auto" />
            <span className="brand-text ms-2 font-weight-light">
              Super Car Warranty
            </span>
          </div>

          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to={`${userInfo.role}/view-profile`} className="d-block">
                  {userInfo.profile_img && (
                    <img
                      src={userInfo.profile_img}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  <span className="info-text">
                    Welcome{" "}
                    {userInfo
                      ? `${userInfo.firstname} ${userInfo.lastname}`
                      : "Back"}
                  </span>
                </Link>
              </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {userInfo.role === 'admin' && adminList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`${cls} ${activeLinkHandler(text) && "active-item"
                      }`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                {/* {userInfo.role === 'sale-person' && spList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`${cls} ${activeLinkHandler(text) && "active-item"
                      }`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))} */}

                <li className={cls}>
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
