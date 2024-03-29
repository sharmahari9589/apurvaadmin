import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import './sidebar.css'
import config from "../config/config";
import { Accordion } from "react-bootstrap";
import Cookies from "js-cookie";
import { FaImage, FaUsers } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
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





const loginData = (!Cookies.get('loginSuccessFarfetchAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessFarfetchAdmin'));


const Sidebar = () => {
  const navigate = useNavigate();

  const [lastSegmentData, setlastSegmentData] = useState("");
  const [cmsData, setcmsData] = useState(0);

  const redirectPage = async (pageName) => {
    navigate(`${config.baseurl}${pageName}`);
  };

  useEffect(() => {
    var parts = window.location.href.split("/");
    // console.log(parts)
    // var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    setlastSegmentData(parts[4]);
    // alert(parts[4])
  }, []);

  const cmsAction = (id) => {
    if (id === 0) {
      setcmsData(1);
    } else {
      setcmsData(0);
    }
  };

  return (
    <aside
      className="app-sidebar"
      id="sidebar"
      // style={{ background: "#1e293b" }}
    >
      {/* Start::main-sidebar-header */}
      <div 
      className="main-sidebar-header"
      >
        <a href className="header-logo" style={{ color: '#fff', textDecoration: 'none' }}>
          <p
            // src={LogoImg}
            // alt="logo"

            style={{ marginLeft: "2px", marginTop: "0px",fontSize:"25px", textAlign:"center",fontWeight:"500px",fontFamily:'dispaly'}}
            className="main-logo desktop-dark">Apurva Electrical  </p>
          {/* /> */}
          {/* <h3>For You Admin</h3> */}
        </a>
      </div>
      {/* End::main-sidebar-header */}
      {/* Start::main-sidebar */}
      <div className="main-sidebar" id="sidebar-scroll">
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
                  lastSegmentData === "vendors"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("vendors")}
              >
                {/* <i className="ri-user-line side-menu__icon" /> */}
                <FaTruck />
                <span className="side-menu__label">Vendors</span>
              </a>
            </li>

            <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "bannerImage"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("bannerImage")}
              >
                {/* <i className="ri-user-line side-menu__icon" /> */}
                <FaImage />
                <span className="side-menu__label">Banner Images</span>
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
                {/* <i class="ri-git-merge-line"></i> */}
                <TbCategoryFilled />
                <span className="side-menu__label">Categories</span>
              </a>
            </li>
      
            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "Subcategory"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("Subcategory")}
              >
                <TbCategoryPlus />
                <span className="side-menu__label">Sub Categories</span>
              </a>
            </li> */}
            {/* <li className="slide">
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
            </li> */}

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "productType"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("productType")}
              >
                <i class="ri-node-tree"></i>
                <TbCategory2 />
                <span className="side-menu__label">Product Types</span>
              </a>
            </li> */}

            <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "productList" || lastSegmentData === 'addProduct' || lastSegmentData === 'editProduct'
                    ? "side-menu__item active"
                    : "side-menu__item"
                }

                onClick={() => redirectPage("productList")}
              >
                {/* <i class="ri-store-3-fill"></i> */}
                <MdOutlineProductionQuantityLimits />
                <span className="side-menu__label">Products</span>
              </a>
            </li>

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "combinationlist" || lastSegmentData === 'addCombination' || lastSegmentData === 'editcombination'
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("combinationlist")}
              >
                <i className="ri-apps-2-line side-menu__icon" />
                <GiCombinationLock />

                <span className="side-menu__label">Product Combinations</span>
              </a>
            </li> */}

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
                {/* <i class="ri-text-wrap"></i> */}
                <LuRefreshCwOff />
                <span className="side-menu__label">Cancel & Return Orders</span>
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
                <i class="ri-bar-chart-horizontal-line"></i>
                <SlSizeFullscreen />
                <span className="side-menu__label">Sizes</span>
              </a>
            </li>

            <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "promocode" || lastSegmentData === 'addPromocode' || lastSegmentData === 'editPromocode'
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("promocode")}
              >
                {/* <i class="ri-gift-fill"></i> */}
                <IoQrCodeOutline />
                <span className="side-menu__label">Promo Codes</span>
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
                {/* <i class="ri-bookmark-3-line"></i> */}
                <TbBrandTether />
                <span className="side-menu__label">Brands</span>
              </a>
            </li>

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "supplier"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("supplier")}
              >
                <i class="ri-truck-line"></i>
                <span className="side-menu__label">Suppliers</span>
              </a>
            </li> */}

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "deliveryandtax"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("deliveryandtax")}
              >
                <i class="ri-truck-line"></i>
                <span className="side-menu__label">Delivery Charges & VAT</span>
              </a>
            </li> */}


            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "regions"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("regions")}
              >
                <i class="ri-currency-line"></i>
                <SlGlobeAlt />
                <span className="side-menu__label">Regions</span>
              </a>
            </li> */}

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "CMS"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("CMS")}
              >
               <i class="ri-mail-settings-fill"></i>
                <span className="side-menu__label">CMS</span>
              </a>
            </li> */}

            {/* <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "contactus"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("contactus")}
              >
              <i class="ri-questionnaire-fill"></i>
                <span className="side-menu__label">Help And Support</span>
              </a>
            </li> */}

            <li className="slide">
              <a
                href
                className={
                  lastSegmentData === "feedback"
                    ? "side-menu__item active"
                    : "side-menu__item"
                }
                onClick={() => redirectPage("feedback")}
              >
                <i class="ri-feedback-fill"></i>
               
                <span className="side-menu__label">User's Feedback</span>
              </a>
            </li>

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
  );
};
export default Sidebar;
