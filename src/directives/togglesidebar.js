// import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// const Togglesidebar = () => {
//     const [show, setShow] = useState(false);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     return (
//         <>

//             <Button variant="primary" onClick={handleShow}>
//                 Launch
//             </Button>

//             <Offcanvas show={show} onHide={handleClose}>
//                 <Offcanvas.Header closeButton>
//                     <Offcanvas.Title>Offcanvas</Offcanvas.Title>
//                 </Offcanvas.Header>
//                 <Offcanvas.Body>
//                     Some text as placeholder. In real life you can have the elements you
//                     have chosen. Like, text, images, lists, etc.
//                 </Offcanvas.Body>
//             </Offcanvas>
//         </>
//     )
// }

// export default Togglesidebar;


import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from "react-router-dom";
import { HiMiniBars3 } from "react-icons/hi2";
// import './sidebar.css'
import config from "../config/config";
import { Accordion } from "react-bootstrap";
import Cookies from "js-cookie";

import { FaUsers } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { TbCategoryPlus } from "react-icons/tb";
import { TbCategory2 } from "react-icons/tb";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { GiCombinationLock } from "react-icons/gi";
import { LuRefreshCwOff } from "react-icons/lu";
import { SlSizeFullscreen } from "react-icons/sl";
import { IoQrCodeOutline } from "react-icons/io5";
import { TbBrandTether } from "react-icons/tb";
import { SlGlobeAlt } from "react-icons/sl";
import { TiContacts } from "react-icons/ti";
import { BsLightningCharge } from "react-icons/bs";


const loginData = (!Cookies.get('loginSuccessFarfetchAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessFarfetchAdmin'));


const Togglesidebar = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    const [lastSegmentData, setlastSegmentData] = useState("");
    const [cmsData, setcmsData] = useState(0);

    const redirectPage = async (pageName) => {
        navigate(`${config.baseurl}${pageName}`);
    };

    useEffect(() => {
        var parts = window.location.href.split("/");
        var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
        setlastSegmentData(lastSegment);
    }, []);

    const cmsAction = (id) => {
        if (id === 0) {
            setcmsData(1);
        } else {
            setcmsData(0);
        }
    };

    return (
        <>

            <Button variant="primary" onClick={handleShow} className="togglebtn_box">
                <HiMiniBars3 className="togglebar" />
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="ps-0">
                    <div>
                        <aside
                            className="app-sidebar"
                            id="sidebar"
                        // style={{ background: "#1e293b" }}
                        >
                            {/* Start::main-sidebar-header */}
                            <div className="main-sidebar-header">
                                <a href className="header-logo" style={{ color: '#fff', textDecoration: 'none' }}>
                                    <img
                                        src={`./assets/img/logo_black.svg`}
                                        alt="logo"
                                        style={{ marginLeft: "9px", marginTop: "0px" }}
                                        className="main-logo desktop-dark"
                                    />
                                    {/* <h3>For You Admin</h3> */}
                                </a>
                            </div>
                            {/* End::main-sidebar-header */}
                            {/* Start::main-sidebar */}
                            <div className="main-sidebar " id="sidebar-scroll">
                                {/* Start::nav */}
                                <nav className="main-menu-container nav nav-pills flex-column sub-open">
                                    <div className="slide-left" id="slide-left">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#7b8191"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                                        </svg>
                                    </div>
                                    <ul className="main-menu">
                                        {/* Start::slide__category */}
                                        <li className="slide__category">
                                            <span className="category-name">Main</span>
                                        </li>
                                        {/* End::slide__category */}
                                        {/* Start::slide */}
                                        <li className="slide  has-sub">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "dashboard"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("dashboard")}
                                            >
                                                <i className="ri-home-8-line side-menu__icon" />
                                                <span className="side-menu__label">Dashboard</span>
                                            </a>
                                        </li>
                                        {/* End::slide */}
                                        {/* Start::slide */}

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "users"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("users")}
                                            >
                                                {/* <i className="ri-user-line side-menu__icon" /> */}
                                                <FaUsers />
                                                <span className="side-menu__label">Users</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "category"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("category")}
                                            >
                                                {/* <i className="ri-apps-2-line side-menu__icon" /> */}
                                                <TbCategoryFilled />
                                                <span className="side-menu__label">Categories</span>
                                            </a>
                                        </li>
                                        {/* End::slide */}
                                        {/* Start::slide__category */}
                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "Subcategory"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("Subcategory")}
                                            >
                                                {/* <i className="ri-apps-2-line side-menu__icon" /> */}
                                                <TbCategoryPlus />
                                                <span className="side-menu__label">Sub Categories</span>
                                            </a>
                                        </li>
                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "InnerSubcategory"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("InnerSubcategory")}
                                            >
                                                <i class="ri-node-tree"></i>
                                                <span className="side-menu__label">Inner Sub Categories</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "productType"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("productType")}
                                            >
                                                <TbCategory2 />
                                                <span className="side-menu__label">Product Type</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "productList"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }

                                                onClick={() => redirectPage("productList")}
                                            >
                                                <MdOutlineProductionQuantityLimits />
                                                <span className="side-menu__label">Products</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "combinationlist"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("combinationlist")}
                                            >
                                                <GiCombinationLock />
                                                <span className="side-menu__label">Product Combination</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "order"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("order")}
                                            >
                                                <i class="ri-archive-fill"></i>
                                                <span className="side-menu__label">Orders</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "cancelandreturnorder"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("cancelandreturnorder")}
                                            >
                                                <LuRefreshCwOff />
                                                <span className="side-menu__label">Cancel & Return Order</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "size"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("size")}
                                            >
                                                <SlSizeFullscreen />
                                                <span className="side-menu__label">Size</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "promocode"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("promocode")}
                                            >
                                                <IoQrCodeOutline />
                                                <span className="side-menu__label">Promo Code</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "brand"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("brand")}
                                            >
                                                <TbBrandTether />
                                                <span className="side-menu__label">Brand</span>
                                            </a>
                                        </li>

                                        <li className="slide">
                                            <a
                                                href
                                                className={
                                                    lastSegmentData === "deliveryandtax"
                                                        ? "side-menu__item active"
                                                        : "side-menu__item"
                                                }
                                                onClick={() => redirectPage("deliveryandtax")}
                                            >
                                               <BsLightningCharge />
                                                <span className="side-menu__label">Delivery Charges & Vat</span>
                                            </a>
                                        </li>
                                        {/* 
            <li className="slide">
              <a
                href
                className="side-menu__item"
                onClick={() => redirectPage("regions")}
              >
                <i className="ri-apps-2-line side-menu__icon" />
                <span className="side-menu__label">Region</span>
              </a>
            </li> */}

                                        {/* <li className="slide has-sub">
              {" "}
              <a href="javascript:void(0);"  onClick={(e) => cmsAction(cmsData)} className="side-menu__item">
                {" "}
                <i className="ri-inbox-line side-menu__icon" />{" "}
                <span
                  className="side-menu__label"
                 
                >
                  CMS
                </span>{" "}
                <i className="ri ri-arrow-right-s-line side-menu__angle" style={{marginLeft:"121px"}} />{" "}
              </a>{" "}
              <ul
                className="slide-menu child1"
                style={{
                  position: "relative",
                  left: 0,
                  top: 0,
                  margin: 0,
                  transform: "translate(128px, 281px)",
                  boxSizing: "border-box",
                  display: cmsData === 0 ? "none" : "block",
                }}
                data-popper-placement="bottom"
              >
                <li className="slide">
                  <a
                    href="javascript:void(0);"
                    onClick={() => redirectPage("TermsOfPromotion")}
                    className={
                      lastSegmentData === "TermsOfPromotion"
                        ? "side-menu__item active"
                        : "side-menu__item"
                    }
                  >
                    Terms Of Promotion
                  </a>
                </li>{" "}
                <li className="slide">
                  <a
                    href="javascript:void(0)"
                    onClick={() => redirectPage("Accessibility")}
                    className={
                      lastSegmentData === "Accessibility"
                        ? "side-menu__item active"
                        : "side-menu__item"
                    }
                  >
                    Accessibility
                  </a>
                </li>{" "}
              </ul>{" "}
            </li> */}
                                    </ul>
                                </nav>
                                {/* End::nav */}
                            </div>
                            {/* End::main-sidebar */}
                        </aside>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>



        </>

    );
};
export default Togglesidebar;
