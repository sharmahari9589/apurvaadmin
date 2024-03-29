import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { addVendorAction, getUsersListAction, getVendorsListAction, updateVendorAction, userStatusUpdateAction, vendorDeleteAction, vendorStatusUpdateAction } from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer,toast } from "react-toastify";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";
import { Modal } from "react-responsive-modal";
import "react-toastify/dist/ReactToastify.css";


const Vendors = () => {
  const [listing, setListing] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(
    { fullName:"",gstNo:'',loginType:'vendor',companyName:"",phoneNo:"",address:'', email: ""   });
const [openSecond,setopnSecond] = useState(false);
const [openDelete,setOpenDelete] = useState(false);
const [selected,setSelected] = useState();
  useEffect(() => {
    getListingDetails();
  }, []);



  const onOpenModal = () => {
    setOpen(true)
  }


const onCloseModal = () =>{
  setOpen(false)
  setopnSecond(false)
  setOpenDelete(false)
}


const onOpenModalSecond = (vendorData) => {
  setFormData(vendorData)
  setopnSecond(true);
  setSelected(vendorData.id);

}

const handleVandorForm = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const addVendor = async(e) =>{
let res = await addVendorAction(formData);
if (res.success) {
  onCloseModal()
  getListingDetails()
  toast.success("Success", {
      position: toast.POSITION.TOP_CENTER,
  });}
  else {
    toast.error(res.msg, {
      position: toast.POSITION.TOP_CENTER,
  });}
}

const updateVendor = async () =>{
  let res = await updateVendorAction(formData,selected);
  if (res.success) {
    onCloseModal()
    getListingDetails()
    toast.success("Success", {
        position: toast.POSITION.TOP_CENTER,
    });}
    else {
      toast.error(res.msg, {
        position: toast.POSITION.TOP_CENTER,
    });}
}


const handleDeleteVendor = (i) =>{
setSelected(i.id);
setOpenDelete(true);
}

const deleteVendor = async() =>{
let res = await vendorDeleteAction(selected);
if (res.data.success) {
  onCloseModal()
  getListingDetails()
  toast.success("Success", {
      position: toast.POSITION.TOP_CENTER,
  });}
  else {
    toast.error(res.msg, {
      position: toast.POSITION.TOP_CENTER,
  });}
}

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
        let res = await vendorStatusUpdateAction({
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
      const res = await getVendorsListAction();
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
      name: "Phone No.",
      selector: (row) => row.phoneNo,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.shopName,
      sortable: true,
    },
   
    {
      name: "Action",
      cell: (row) => {
        return (
          <>
           <button  className="btn btn-primary" onClick={() => onOpenModalSecond(row)}>
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>&nbsp;
                        <button  className="btn btn-danger" onClick={()=> handleDeleteVendor(row)} >
        <i class='fas fa-trash-alt'></i>
              </button>&nbsp;
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
                    <h5 className="box-title">Vendors List</h5>
                    <span><button onClick={onOpenModal} type="button" className="ti-btn ti-btn-primary" style={{ float: 'right', marginTop: '-35px' }}>
                                                Add
                                            </button></span>
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
      {/* modal for add */}
<Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}   >
<div className="form-group mb-3"  >
<label className="mb-2" htmlFor="categoryId"><h4 style={{marginRight:300}}>Add Vendor</h4>
                    </label>
                    <hr />
                        <label className="mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            defaultValue={formData.fullName}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="First Name"
                            placeholder="Full Name"
                        />

                    </div>
                   
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            required
                            defaultValue={formData.email}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="Enail"
                            placeholder="Email address"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Phone No.
                        </label>
                        <input
                            type="text"
                            name="phoneNo"
                            required
                            defaultValue={formData.phoneNo}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                          id="phoneNo"
                            placeholder="Mobile No"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            required
                            defaultValue={formData.companyName}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="CompanuName"
                            placeholder="Company Name"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            GST No.
                        </label>
                        <input
                            type="text"
                            name="gstNo"
                            required
                            defaultValue={formData.gstNo}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="gstNo"
                            placeholder="GST No"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            required
                            defaultValue={formData.address}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="address"
                            placeholder="Address"
                        />

                    </div>
                    <button onClick={addVendor} type="submit" className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal>
{/* modal for add */}


  {/* modal for edit */}
  <Modal open={openSecond} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}   >
<div className="form-group mb-3"  >
<label className="mb-2" htmlFor="categoryId"><h4 style={{marginRight:300}}>Update Vendor</h4>
                    </label>
                    <hr />
                        <label className="mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            defaultValue={formData.fullName}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="First Name"
                            placeholder="First Name"
                        />

                    </div>
                  
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            required
                            defaultValue={formData.email}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="Enail"
                            placeholder="Email address"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Phone No.
                        </label>
                        <input
                            type="text"
                            name="phoneNo"
                            required
                            defaultValue={formData.phoneNo}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                          id="phoneNo"
                            placeholder="Mobile No"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            required
                            defaultValue={formData.companyName}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="CompanuName"
                            placeholder="Company Name"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            GST No.
                        </label>
                        <input
                            type="text"
                            name="gstNo"
                            required
                            defaultValue={formData.gstNo}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="gstNo"
                            placeholder="GST No"
                        />

                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" >
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            required
                            defaultValue={formData.address}
                            onChange={(e) => {
                                handleVandorForm(e);
                            }}

                            className="form-control"
                            id="address"
                            placeholder="Address"
                        />

                    </div>
                    <button onClick={updateVendor} type="submit" className="btn btn-primary modal-footer">
                        Update
                    </button>
                </Modal>
{/* modal for edit */}


 {/* modal for delete */}
 <Modal open={openDelete} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}   >
<div className="form-group mb-3"  >
<label className="mb-2" htmlFor="categoryId"><h4 style={{marginRight:300}}>Delete Vendor</h4>
                    </label>
                    <hr />
                       Are you sure want to delete this vendor?
                    </div>
                    <button onClick={deleteVendor} type="submit" className="btn btn-danger modal-footer">
                        Confirm
                    </button>
                </Modal>
{/* modal for delete */}
    </>
  );
};

export default Vendors;
