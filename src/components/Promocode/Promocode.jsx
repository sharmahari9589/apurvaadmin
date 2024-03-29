import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import config from '../../config/config'
import { deletePromoCodeAction, getPromoCodeAction, updatePromoCodeStatusAction } from "../../Action/user.action";
import { redirect } from "react-router-dom";
import Togglesidebar from "../../directives/togglesidebar";
import moment from "moment";


const Promocode = () => {
    const [promocode, setPromocode] = useState([]);
    const [formData, setFormData] = useState({});
    const [searchText, setSearchText] = useState('');



    useEffect(() => {
        fetchPromoCodeList()
    }, []);


    const StatusUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await updatePromoCodeStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchPromoCodeList();
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })
    }

    // fatch Product Type Name-----
    const fetchPromoCodeList = async () => {
        try {
            const res = await getPromoCodeAction();
            if (res.success) {
                console.log(res);
                setPromocode(res.promoCode);
            }
        } catch (error) {
            console.error("An error occurred while getting Promo Codes:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // const filteredData = promocode.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );




    const handleDeleteImage = async (data) => {
          Swal.fire({
              title: 'Are you sure?',
              text: `You want to Delete this promocode!`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: `Yes`
            }).then(async (result) => {
              if (result.isConfirmed) {
      
              //   let res = await imageStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
        let res = await deletePromoCodeAction(data);
        toast.success(res.msg, {
          position: toast.POSITION.TOP_CENTER
        });
       fetchPromoCodeList()
              if (res.success) {
                
                  fetchPromoCodeList()
                } else {
                  Swal.fire(
                    'Failed!',
                    res.msg,
                    'error'
                  )
                }
              }
            })
          
        
      };
  







    const filteredData = promocode.filter((item,index) =>{
        item.index = index;
          item = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
          return item;
        }
        );

    const columns = [
        {
            name: "S.No",
            selector: (row) => `${row.index + 1}`,
            sortable: true,
        },
        {
            name: "Promo Code",
            selector: (row) => row.promoCode,
            sortable: true,
        },
        {
            name: "Discount (%)",
            selector: (row) => row.discount,
            sortable: true,
        },
        {
            name: "Valid From",
            selector: (row) => `${moment(row?.validFrom).format("DD-MM-YYYY")}`,
            sortable: true,
        },
        {
            name: "Valid To",
            selector: (row) => `${moment(row?.validTo).format("DD-MM-YYYY")}`,
            sortable: true,
        },
        {
            name: "For",
            selector: (row) => row.applyFor,
            sortable: true,
        },
        {
            name: "User Name",
            selector: (row) => row?.fullName || '- - - - ',
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                            <button className="btn btn-danger" onClick={()=> handleDeleteImage(row)}>
                            <i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                       
                    </>
                )
            }
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
                    <Togglesidebar />
                </div>
                <Header />
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box fields">
                                    <div className="box-header">
                                        <h5 className="box-title">Promo Code List</h5>
                                        <a href={`${config.baseurl}addPromocode`}>
                                            <span><button type="button" className="ti-btn ti-btn-primary" style={{ float: 'right', marginTop: '-35px' }}>
                                                Add
                                            </button></span>
                                        </a>
                                    </div>
                                    <div className="box-body">
                                        {/* Search input */}
                                        <input
                                            type="text"
                                            value={searchText}
                                            onChange={handleSearch}
                                            placeholder="Search..."
                                            className="px-2 py-1 border rounded mb-4"
                                        />
                                        <div className="overflow-hidden table-bordered ">
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
            </div >
        </>
    );
};

export default Promocode;
