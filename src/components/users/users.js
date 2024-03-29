import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { getUsersListAction, userStatusUpdateAction } from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";


const Users = () => {
  const [listing, setListing] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getListingDetails();
  }, []);

  const StatusUpdate = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${data.status === 0 ? "Activate" : "Deactivate"} it!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${data.status === 0 ? "Activate" : "Deactivate"} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await userStatusUpdateAction({
          id: data.id,
          status: data.status === 0 ? "1 " : "0",
        });
        if (res.success) {
          Swal.fire(
            `${data.status === 0 ? "Activated" : "Deactivated"}`,
            res.msg,
            "success"
          );
          getListingDetails();
        } else {
          Swal.fire("Failed!", res.msg, "error");
        }
      }
    });
  };

  const getListingDetails = async () => {
    try {
      const res = await getUsersListAction();
      if (res.success) {
        setListing(res.data);
      }
    } catch (error) {
      console.error("An error occurred while getting the listing:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = listing.filter((item,index) =>{
  item.index = index;
    item = Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
    return item;
  }
  );

  const columns = [
    {
      name: "Sr. No",
      selector: (row) => `${row.index + 1}`,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Date of joined",
      selector: (row) => {
        return moment(row.dateTime).format("YYYY-MM-DD HH:mm:SS");
      },
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.loginType,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          <>
            {row.status === 1 ? (
              <div style={{ color: "green" }}> Active</div>
            ) : (
              <div style={{ color: "red" }}> Inactive</div>
            )}
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <>
            {row.status === 0 ? (
              <button
                onClick={() => StatusUpdate(row)}
                className="btn btn-danger redclosebtn"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            ) : row.status === 1 ? (
              <button
                onClick={() => StatusUpdate(row)}
                className="btn btn-success"
              >
                <i className="fa fa-check" aria-hidden="true"></i>
              </button>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="page">
      <div id="websidebar" className="">
          <Sidebar />
        </div>

        <div id="mobilesidebar" className="">
          {/* <Togglesidebar /> */}
          <Togglesidebar/>
        </div>

        <Header />
        <div className="content">
          <div className="main-content">
            <div className="block justify-between page-header md:flex">

            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Users List</h5>
                  </div>
                  <div className="box-body">
                    
                    {/* Search input */}
                    <input
                      type="text"
                      value={searchText}
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="px-2 py-1 border rounded mb-4 searchtype"
                    />
                    <div className="overflow-hidden table-bordered">
                      <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination

                        paginationTotalRows={filteredData.length}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <Footer />
      </div>
    </>
  );
};

export default Users;
