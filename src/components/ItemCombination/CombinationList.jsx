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
import { getCombinationListAction, combninationStatusUpdateAction, } from "../../Action/user.action";
import { redirect } from "react-router-dom";
import Togglesidebar from "../../directives/togglesidebar";


const CombinationList = () => {
    const [combination, setCombination] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({ categoryId: "", subCategoryId: '', innerCategoryId: '', productTypeName: "" });



    useEffect(() => {
        fetchCombinationList()
    }, []);


    const StatusUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${data.status === 0 ? 'Active' : 'Deactivate'} it!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${data.status === 0 ? 'Active' : 'Deactivate'} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await combninationStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchCombinationList();
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
    const fetchCombinationList = async () => {
        try {
            const res = await getCombinationListAction();
            if (res.success) {
                setCombination(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting product type names:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // const filteredData = combination.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    const filteredData = combination.filter((item,index) =>{
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
            name: "Combination Name",
            selector: (row) => row.combinationName,
            sortable: true,
        },
        {
            name: "Category Name",
            selector: (row) => row.categoryName,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <a href={`${config.baseurl}editcombination/` + row?.id}>
                            <button className="btn btn-primary">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </button></a>
                        &nbsp;
                        {row.status == 0 ?
                            <button onClick={() => StatusUpdate(row)} className="btn btn-danger redclosebtn">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </button> :
                            row.status == 1 ?
                                <button onClick={() => StatusUpdate(row)} className="btn btn-success">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </button> :
                                ''
                        }
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
                                <div className="box fields ">
                                    <div className="box-header">
                                        <h5 className="box-title">Combination List</h5>
                                        <a href={`${config.baseurl}addCombination`}>
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
            </div >
        </>
    );
};

export default CombinationList;
