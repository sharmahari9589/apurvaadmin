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
import { getProductListAction, productPopularUpdateAction, productStatusUpdateAction } from "../../Action/user.action";
import { redirect } from "react-router-dom";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";



const ProductList = () => {
    const [productList, setProductList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({ categoryId: "", subCategoryId: '', innerCategoryId: '', productTypeName: "" });



    useEffect(() => {
        fetchProductsList()
    }, []);


    const StatusUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${data.status === 0 ? 'Activate' : 'Deactivate'} this products!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await productStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchProductsList();
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


    const PopularityUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${data.popular === 0 ? 'Activate' : 'Deactivate'} to apply for popular products!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${data.popular === 0 ? 'Activate' : 'Deactivate'} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await productPopularUpdateAction({ id: data.id, popular: data.popular === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.popular === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchProductsList();
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
    const fetchProductsList = async () => {
        try {
            const res = await getProductListAction();
            if (res.success) {
                setProductList(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting product type names:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // const filteredData = productList.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    const filteredData = productList.filter((item, index) => {
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
            name: "Product Name",
            selector: (row) => row.productName,
            sortable: true,
        },
        {
            name: "Product Image",
            text: "productImage",
            cell: (item) => {
                return (
                    <>{
                    }
                        <a href={config.imageUrl + item?.images[0].name} target="_blank" rel="noopener noreferrer">
                            <img style={{ width: '70px', height: '70px', borderRadius: '50%' }} className="my-2" src={config.imageUrl + item?.images[0].name} alt="image" />
                        </a>
                    </>
                );
            },
        },
        {
            name: "Category Name",
            selector: (row) => row.categoryName,
            sortable: true,
        },
        {
            name: "Vendor Price",
            selector: (row) => row.vendorPrice,
            sortable: true,
        }, {
            name: "Customer Price",
            selector: (row) => row.customerPrice,
            sortable: true,
        },
        {
            name: "Popular Product",
            selector: (row) => {
                return (
                    <>
                    {console.log(row)}

                      {row.popular == 0 ?
                            <button onClick={() => PopularityUpdate(row)} className="btn btn-danger redclosebtn">
                               <i class="fa fa-toggle-off" aria-hidden="true"></i>
                            </button> :
                            row.popular == 1 ?
                                <button onClick={() => PopularityUpdate(row)} className="btn btn-success">
                                 <i class="fa fa-toggle-on" aria-hidden="true"></i>
                                </button> :
                                ''
                        }
                    </>
                )

            }

        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <a href={`${config.baseurl}editProduct/` + row?.id}>
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
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Product List</h5>
                                        <a href={`${config.baseurl}addProduct`}>
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

export default ProductList;
