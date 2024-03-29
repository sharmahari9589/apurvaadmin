import React, { useEffect, useState } from "react";
import Sidebar from "../directives/sidebar";
import Header from "../directives/header";
import Footer from "../directives/footer";
import { getDashboardStatisticsAction } from '../Action/user.action'
import Togglesidebar from "../directives/togglesidebar";
import { IoIosCart } from "react-icons/io";
import { FaTruck, FaUsers } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import { TbBrandTether } from "react-icons/tb";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuRefreshCwOff } from "react-icons/lu";
import { TbTruckReturn } from "react-icons/tb";
import { AiFillShop } from "react-icons/ai";




const Dashboard = () => {
  const [statistics, setStatistics] = useState('');

  useEffect(() => {
    getDashboardStatistics();
  }, []);

  const getDashboardStatistics = async () => {
    let res = await getDashboardStatisticsAction();
    if (res?.success) {
      setStatistics(res.data)
    }
  }

  const getIconByTagName = (tagName) => {
    switch (tagName) {
      case "Total Orders":
        return (
          <span className="rounded-sm p-4 bg-primary/10">
            {/* SVG for Total Orders */}
          </span>
        );
      case "Today Placed Orders":
        return (
          <span className="rounded-sm p-4 bg-primary/10">
            {/* SVG for Today Placed Orders */}
          </span>
        );
      // Add more cases for other tag names
      default:
        return null;
    }
  };

  return (
    <>
      <div className="page">
        <div id="websidebar" className="">
          <Sidebar />
        </div>

        <div id="mobilesidebar" className="">
          <Togglesidebar />
        </div>

        <Header />
        <div className="content">
          {/* Start::main-content */}
          <div className="main-content">
            {/* Page Header */}
            <div className="block justify-between page-header md:flex">
              <div>
                <h3 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                  {" "}
                  Dashboard
                </h3>
              </div>
            </div>
            {/* Page Header Close */}
            {/* Start::row-1 */}
            <div className=" gap-x-5 box_content">
              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-primary/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg1"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                          </svg> */}
                          <IoIosCart className="total_icons" />
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Total Orders</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.totalOrders}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-primary/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg1"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                          </svg> */}
                          <AiFillShop className="total_icons"/>
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Today Placed Orders</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.todayPlaceOrder}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-danger/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg3"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg> */}
                          <FaUsers className="total_icons" />
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Total Users</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.totalUser}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-danger/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg3"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg> */}
                          <FaUserShield className="total_icons" />
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Total Active Users</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.totalActiveUser}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-danger/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg3"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg> */}
                          <FaTruck className="total_icons" />
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Total Vendors</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.totalVendors}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex items-center justify-center ecommerce-icon px-0 me-lg-3 me-md-3">
                        <span className="rounded-sm p-2 bg-success/10">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-white svg6"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                          </svg> */}
                          <MdProductionQuantityLimits className="total_icons" />
                        </span>
                      </div>
                      <div className="ms-3">
                        <div className="mb-2">Total Products</div>
                        <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                          <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                            <h5 className="mb-0">{statistics[0]?.totalProducts}</h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center justify-center ecommerce-icon px-0">
                          <span className="rounded-sm p-2 bg-danger/10">
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-white svg3"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg> */}
                            <TbBrandTether className="total_icons" />
                          </span>
                        </div>
                        <div className="">
                          <div className="mb-2">Total Brands</div>
                          <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                            <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                              <h5>{statistics[0]?.totalBrands}</h5>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center justify-center ecommerce-icon px-0">
                          <span className="rounded-sm p-2 bg-danger/10">
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-white svg3"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg> */}
                            <IoQrCodeOutline className="total_icons" />
                          </span>
                        </div>
                        <div className="">
                          <div className="mb-2">Total Promo Code</div>
                          <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                            <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                              <h5>{statistics[0]?.totalPromocodes}</h5>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center justify-center ecommerce-icon px-0">
                          <span className="rounded-sm p-2 bg-danger/10">
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-white svg3"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg> */}
                            <LuRefreshCwOff className="total_icons" />
                          </span>
                        </div>
                        <div className="">
                          <div className="mb-2">Total Cancel Orders</div>
                          <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                            <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                              <h5>{statistics[0]?.totalCancelOrders}</h5>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="totalbox">
                <div className="box">
                  <div className="box-body">
                    <div className="total_inr">
                      <div className="flex space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center justify-center ecommerce-icon px-0">
                          <span className="rounded-sm p-2 bg-danger/10">
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-white svg3"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg> */}
                            <TbTruckReturn className="total_icons" />
                          </span>
                        </div>
                        <div className="">
                          <div className="mb-2">Total Return Orders</div>
                          <div className="text-gray-500 dark:text-white/70 mb-1 text-xs">
                            <span className="text-gray-800 font-semibold text-xl leading-none align-bottom dark:text-white">
                              <h5>{statistics[0]?.totalReturnOrders}</h5>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
