
import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import {
    getSupplierListAction,
    updateSupplierDetailAction,
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Togglesidebar from "../../directives/togglesidebar";


const Supplier = () => {
    const [listing, setListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [supplier, setSupplier] = useState({ IIN: "", BIN: "", BIC: "", address: "" });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        getListingDetails();
    }, []);

    const handleSupplierChange = (e) => {
        const { name, value } = e.target;
        setSupplier((old) => {
            return { ...old, [name]: value };
        });
    };

    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };


    // Update Supplier  ---------------------------------
    const updateSupplier = async (e) => {
        e.preventDefault();
        const errors = {};
        console.log(supplier)

        if (supplier.IIN === "") {
            errors.IIN = "IIN is required";
        }
        if (supplier.BIN === "") {
            errors.BIN = "BIN is required";
        }
        if (supplier.BIC === "") {
            errors.BIC = "BIC is required";
        }
        if (supplier.address === "") {
            errors.address = "Address is required";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setValidationErrors({});
            try {
                const res = await updateSupplierDetailAction(supplier);
                if (res.success) {
                    toast.success(res.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    onCloseModalSecond();
                    getListingDetails();
                } else {
                    toast.error(res.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            } catch (error) {
                console.error("An error occurred while updating the category:", error);
            }
        }
    }


    // Get listing -------------------------------
    const getListingDetails = async () => {
        try {
            const res = await getSupplierListAction();
            console.log(res)
            if (res.success) {
                setListing(res.supplierList);
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };

    const columns = [
        {
            name: "Sr. No",
            selector: (row, index) => `${index + 1}`,
            sortable: true,
        },
        {
            name: "IIN",
            selector: (row) => row.IIN,
            sortable: true,
        },
        {
            name: "BIN",
            selector: (row) => row.BIN,
            sortable: true,
        },
        {
            name: "BIC",
            selector: (row) => row.BIC,
            sortable: true,
        },
        {
            name: "address",
            selector: (row) => row.address,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <button onClick={() => onOpenModalSecond(row)} className="btn btn-primary">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>&nbsp;
                    </>
                )
            }
        },
    ];

    // Modal code  ---------------------------------------
    const onOpenModalSecond = (category) => {
        setSupplier(category);
        setModalSecond(true);
    };

    const onCloseModalSecond = () => setModalSecond(false);

    const onOpenModal = () => setOpen(true);

    const onCloseModal = () => {
        setOpen(false);
    };

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
                    {/* Start::main-content */}
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">

                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Supplier List</h5>

                                    </div>

                                    <div className="box-body">
                                        <div className="overflow-hidden table-bordered">
                                            <DataTable columns={columns} data={listing} pagination />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Start::main-content */}
                </div>

                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor=""><h4>Edit Supplier</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="IIN">
                            IIN
                        </label>
                        <br />
                        <input
                            type="text"
                            name="IIN"
                            value={supplier.IIN}
                            onChange={(e) => {
                                handleSupplierChange(e);
                                clearValidationError("IIN");
                            }}
                            className="form-control"
                            id="IIN"
                            placeholder="IIN"
                        />
                        {validationErrors.IIN && <span className="text-danger">{validationErrors.IIN}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="BIN">
                            BIN
                        </label>
                        <br />
                        <input
                            type="text"
                            name="BIN"
                            value={supplier.BIN}
                            onChange={(e) => {
                                handleSupplierChange(e);
                                clearValidationError("BIN");
                            }}
                            className="form-control"
                            id="BIN"
                            placeholder="BIN"
                        />
                        {validationErrors.BIN && <span className="text-danger">{validationErrors.BIN}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="BIC">
                            BIC
                        </label>
                        <br />
                        <input
                            type="text"
                            name="BIC"
                            value={supplier.BIC}
                            onChange={(e) => {
                                handleSupplierChange(e);
                                clearValidationError("BIC");
                            }}
                            className="form-control"
                            id="BIC"
                            placeholder="BIC"
                        />
                        {validationErrors.BIC && <span className="text-danger">{validationErrors.BIC}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="address">
                            Address
                        </label>
                        <br />
                        <textarea
                            type="text"
                            name="address"
                            value={supplier.address}
                            onChange={(e) => {
                                handleSupplierChange(e);
                                clearValidationError("address");
                            }}
                            className="form-control"
                            id="address"
                            placeholder="address"
                        />
                        {validationErrors.address && <span className="text-danger">{validationErrors.address}</span>}
                    </div>
                    {/* <br /> */}
                    <button
                        type="submit"
                        onClick={updateSupplier}
                        className="btn btn-primary modal-footer"
                    >
                        Update
                    </button>
                </Modal>
                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default Supplier;
