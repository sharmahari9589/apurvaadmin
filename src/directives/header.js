import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/config";



const loginData = (!Cookies.get('loginSuccessFarfetchAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessFarfetchAdmin'));

const Header = () => {
  const navigate = useNavigate();

  const logout = async () => {
    Cookies.remove("loginSuccessFarfetchAdmin");
    window.location.href = config.baseurl
  };

  const redirectPage = async (pageName) => {
    navigate(`${config.baseurl}${pageName}`);
  };


  useEffect(()=>{
    if(loginData.length === 0){
      navigate(`${config.baseurl}`);
    }
},[])

  return (
    <header className="header custom-sticky !top-0 !w-full">
      <nav className="main-header" aria-label="Global">
        <div className="header-content">
          <div className="header-left">
            {/* Navigation Toggle */}
            <div className="">
              <button type="button" className="sidebar-toggle !w-100 !h-100">
                <span className="sr-only">Toggle Navigation</span>
                <i className="ri-arrow-right-circle-line header-icon" />
              </button>
            </div>
            {/* End Navigation Toggle */}
          </div>
          <div className="responsive-logo">
            <a
              className="responsive-logo-dark"
              href="/"
              aria-label="Brand"
            >
              <img
                src="./assets/img/brand-logos/desktop-logo.png"
                alt="logo"
                className="mx-auto"
              />
            </a>
            <a
              className="responsive-logo-light"
              href="index.html"
              aria-label="Brand"
            >
              <img
                src="./assets/img/brand-logos/desktop-dark.png"
                alt="logo"
                className="mx-auto"
              />
            </a>
          </div>
          <div className="header-right">
            <div className="responsive-headernav">
              <div className="header-nav-right">
                <div
                  className="header-country hs-dropdown ti-dropdown hidden sm:block"
                  data-hs-dropdown-placement="bottom-right"
                ></div>

                <div className="header-theme-mode hidden sm:block">
                  <a
                    aria-label="anchor"
                    className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-gray-100 hover:bg-gray-200 text-gray-500 align-middle focus:outline-none focus:ring-0 focus:ring-gray-400 focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-white/70 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                    href="javascript:;"
                    data-hs-theme-click-value="light"
                  >
                    <i className="ri-sun-line header-icon" />
                  </a>
                </div>

                <div
                  style={{ marginBottom: "8px" }}
                  className="header-profile hs-dropdown ti-dropdown"
                  data-hs-dropdown-placement="bottom-right"
                >
                  <button
                    id="dropdown-profile"
                    type="button"
                    className="hs-dropdown-toggle ti-dropdown-toggle gap-2 p-0 flex-shrink-0 h-8 w-8 rounded-full shadow-none focus:ring-gray-400 text-xs dark:focus:ring-white/10"
                  >
                    <img
                      className="inline-block rounded-full ring-2 ring-white dark:ring-white/10"
                      src="./assets/img/userThumb.png"
                      alt="Image Description"
                    />
                  </button>
                  <div
                    className="hs-dropdown-menu ti-dropdown-menu border-0 w-[20rem]"
                    aria-labelledby="dropdown-profile"
                  >
                    <div className="ti-dropdown-header !bg-primary flex">
                      <div className="ltr:mr-3 rtl:ml-3">
                        <img
                          className="avatar shadow-none rounded-full !ring-transparent"
                          src="./assets/img/userThumb.png"
                          alt="profile-img"
                        />
                      </div>
                      <div>
                        <p
                          className="ti-dropdown-header-title !text-white"
                          style={{ margin: "4px" }}
                        >
                         Apurva Electrical Admin
                        </p>
                        <p
                          className="ti-dropdown-header-content !text-white/50"
                          style={{ margin: "4px" }}
                        >
                          Control Panel
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ti-dropdown-divider">
                      <a className="ti-dropdown-item" 
                        //  href ="changepassword" 
                         onClick={() => redirectPage("changepassword")}
                         
                         >
                        <i className="ti ti-wallet text-lg" />
                        Change Password
                      </a>
                      <a
                        href="javascript:void(0);"
                        onClick={logout}
                        className="ti-dropdown-item"
                      >
                        <i className="ti ti-logout  text-lg" />
                        Log Out
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
