import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import {
    updateDeliveryAndTaxAction,
    insertDeliverAndTaxAction,
    getRegionListAction,
    getDeliverAndTaxListAction,
    updateDeliverAndTaxStatusAction
} from "../../Action/user.action";
import Swal from 'sweetalert2';
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Togglesidebar from "../../directives/togglesidebar";

const DeliveryAndTax = () => {
    const [sublisting, setDeliveryAndTax] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [formData, setFormData] = useState({ regionId: "", deliveryCharges: "", tax: "" });
    const [regionId, setRegionId] = useState("");
    const [region, setRegion] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchRegionList();
        fetchDeliveryAndTaxList();
    }, []);

    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        setFormData({ ...formData, regionId: regionId });
        setRegionId(regionId);
    };


    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

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
                let res = await updateDeliverAndTaxStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchDeliveryAndTaxList();
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

    const addDeliveryAndTax = async (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.regionId === "") {
            errors.regionId = "Region is required";
        }
        if (formData.deliveryCharges === "") {
            errors.deliveryCharges = "Delivery charges is required";
        }
        if (formData.tax === "") {
            errors.tax = "Tax is required";
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setValidationErrors({});
            try {
                const response = await insertDeliverAndTaxAction(formData);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    fetchDeliveryAndTaxList();
                } else {
                    toast.error(response.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            } catch (error) {
                console.error("An error occurred while adding the category:", error);
            }
        }
    }

    const updateDeliveryAndTax = async (e) => {
        e.preventDefault();
        try {
            const errors = {};
            const data = {
                regionId: regionId,
                id: selectedSubcategory.id,
                deliveryCharges: formData.deliveryCharges,
                tax: formData.tax,
            };
            if (formData.regionId === "") {
                errors.regionId = "Region is required";
            }
            if (formData.deliveryCharges === "") {
                errors.deliveryCharges = "Delivery charges is required";
            }
            if (formData.tax === "") {
                errors.tax = "Vat is required";
            }
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                setValidationErrors({});
                console.log(data)
                const response = await updateDeliveryAndTaxAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();
                    fetchDeliveryAndTaxList();
                } else {
                    console.error("Failed to update Inner category");
                }
            }
        } catch (error) {
            console.error("An error occurred while updating the category:", error);
        }
    };
    // fatch Category -------------------------
    const fetchRegionList = async () => {
        try {
            const res = await getRegionListAction();
            if (res.success) {
                setRegion(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting region:", error);
        }
    };

    // fatch Inner-Sub Category------------------
    const fetchDeliveryAndTaxList = async () => {
        try {
            const res = await getDeliverAndTaxListAction();
            if (res.success) {
                setDeliveryAndTax(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting inner delivery and tax:", error);
        }
    };

    const onOpenModalSecond = (item) => {
        setRegionId(item.regionId);
        setSelectedSubcategory(item);
        setFormData({
            regionId: item.regionId,
            deliveryCharges: item.deliveryCharges,
            tax: item.tax,
        });
        setModalSecond(true);
    };

    const onOpenModal = () => {
        setRegionId("");
        setFormData({
            regionId: "",
            deliveryCharges: "",
            tax: ""
        });
        setOpen(true);
    };

    const onCloseModalSecond = () => {
        setModalSecond(false);
    };

    const onCloseModal = () => {
        setOpen(false);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // const filteredData = sublisting.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    const filteredData = sublisting.filter((item,index) =>{
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
            name: "Region",
            selector: (row) => row.regionName,
            sortable: true,
        },
        {
            name: "Delivery Charges",
            selector: (row) => row.deliveryCharges,
            sortable: true,
        },
        {
            name: "VAT (%)",
            selector: (row) => row.tax,
            sortable: true,
        },
        // {
        //     name: "Edit",
        //     cell: (row) => (
        //         <i
        //             className="fas fa-edit btn btn-primary"
        //             onClick={() => onOpenModalSecond(row)}
        //             style={{ cursor: "pointer" }}
        //         />
        //     ),
        // },
        // {
        //     name: "Delete",
        //     cell: (row) => (
        //         <i
        //             className="fas fa-trash btn btn-danger"
        //             // onClick={() => onOpenModalSecond(row)}
        //             style={{ cursor: "pointer" }}
        //         />
        //     ),
        // },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <button onClick={() => onOpenModalSecond(row)} className="btn btn-primary">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>&nbsp;
                        {row.status == 0 ?
                            <button onClick={() => StatusUpdate(row)} className="btn btn-danger">
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
                            <div>
                            </div>

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Delivery Charges & VAT</h5>
                                        <button type="button" onClick={onOpenModal} className="ti-btn ti-btn-primary" style={{ float: 'right', marginTop: '-35px' }}>
                                            Add
                                        </button>
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
                                                paginationTotalRows={filteredData.length}
                                                pagination
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor="categoryId"><h4>Add Delivery & VAT</h4>
                    </label>
                    <hr />
                  
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="regionId">
                            Region
                        </label>
                        <select
                            name="regionId"
                            value={formData.regionId}
                            onChange={(e) => {
                                handleRegionChange(e);
                                clearValidationError("regionId");
                            }}
                            className="form-control"
                            id="regionId"
                        >
                            <option value="">Select a Region</option>
                            {region.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.regionName}
                                </option>
                            ))}
                        </select>
                        {validationErrors.regionId && <span className="text-danger">{validationErrors.regionId}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="deliveryCharges">
                            Delivery Charges
                        </label>
                        <input
                            type="number"
                            name="deliveryCharges"
                            value={formData.deliveryCharges}
                            onChange={(e) => {
                                handleInput(e);
                                clearValidationError("deliveryCharges");
                            }}

                            className="form-control"
                            id="deliveryCharges"
                            placeholder="Delivery Charges"
                        />
                        {validationErrors.deliveryCharges && <span className="text-danger">{validationErrors.deliveryCharges}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="tax">
                            VAT (%)
                        </label>
                        <input
                            type="number"
                            name="tax"
                            value={formData.tax}
                            onChange={(e) => {
                                handleInput(e);
                                clearValidationError("tax");
                            }}
                            className="form-control"
                            id="tax"
                            placeholder="VAT"
                        />
                        {validationErrors.tax && <span className="text-danger">{validationErrors.tax}</span>}
                    </div>

                    <button type="submit" onClick={addDeliveryAndTax} className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal>

                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor="categoryId"><h4>Edit Delivery & VAT</h4>
                    </label>
                    <hr />
                    
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="regionId">
                            Region
                        </label>
                        <select
                            name="regionId"
                            value={formData.regionId}
                            onChange={(e) => {
                                handleRegionChange(e);
                                clearValidationError("regionId");
                            }}
                            className="form-control"
                            id="regionId"
                        >
                            <option value="">Select a Region</option>
                            {region.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.regionName}
                                </option>
                            ))}
                        </select>
                        {validationErrors.regionId && <span className="text-danger">{validationErrors.regionId}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="deliveryCharges">
                            Delivery Charges
                        </label>
                        <input
                            type="text"
                            name="deliveryCharges"
                            value={formData.deliveryCharges}
                            onChange={(e) => {
                                handleInput(e);
                                clearValidationError("deliveryCharges");
                            }}
                            className="form-control"
                            id="deliveryCharges"
                            placeholder="Delivery Charges"
                        />
                        {validationErrors.deliveryCharges && <span className="text-danger">{validationErrors.deliveryCharges}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="tax">
                            VAT (%)
                        </label>
                        <input
                            type="text"
                            name="tax"
                            value={formData.tax}
                            onChange={(e) => {
                                handleInput(e);
                                clearValidationError("tax");
                            }}
                            className="form-control"
                            id="tax"
                            placeholder="VAT"
                        />
                        {validationErrors.tax && <span className="text-danger">{validationErrors.tax}</span>}
                    </div>
                    <br />
                    <button type="submit" onClick={updateDeliveryAndTax} className="btn btn-primary modal-footer">
                        Update
                    </button>
                </Modal>
                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default DeliveryAndTax;
