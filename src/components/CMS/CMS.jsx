import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import {
    getCMSPagesAction,
    insertCMSPagesAction,
    updateCMSPagesAction,
    updatePagesStatusAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import config from '../../config/config'

const CMS = () => {
    const [listing, setListing] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ name: "", heading: "" });
    const [formData, setFormData] = useState({ name: "", heading: "" });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchPagesList();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target
        setSelectedCategory((old) => {
            return { ...old, [name]: value }
        })
    };


    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    // Add category ----------------------------------------
    const addCategory = async (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.name === "") {
            errors.name = "Page Name is required";
        }
        if (formData.heading === "") {
            errors.heading = "Heading is required";
        }


        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                const response = await insertCMSPagesAction(formData);
                if (response.success) {
                    toast.success('Success !', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    onCloseModal();
                    fetchPagesList();
                } else {
                    console.error("Failed to add category");
                }
            } catch (error) {
                console.error("An error occurred while adding the category:", error);
            }
        }
    }


    // Update category  ---------------------------------
    const updateCategory = async (e) => {
        e.preventDefault();
        const errors = {};
        if (selectedCategory.name === "") {
            errors.name = "name is required";
        }
        if (selectedCategory.heading === "") {
            errors.heading = "Heading is required";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                const response = await updateCMSPagesAction(selectedCategory, formData.id);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();
                    fetchPagesList();
                } else {
                    console.error("Failed to update Region");
                }
            } catch (error) {
                console.error("An error occurred while updating the Region:", error);
            }
        }
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
                let res = await updatePagesStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchPagesList();
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

    // Get listing -------------------------------
    const fetchPagesList = async () => {
        try {
            const res = await getCMSPagesAction();
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

    const filteredData = listing.filter((item, index) => {
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
            name: "Page Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Heading",
            selector: (row) => row.heading,
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
                        <a href={`${config.baseurl}cmscontentlist/` + row?.id}>
                            <button className="btn btn-dark">
                                <i className='fa fa-eye' ></i>
                            </button></a>&nbsp;
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
                        &nbsp;

                    </>
                )
            }
        },
    ];

    // Modal code  ---------------------------------------
    const onOpenModalSecond = (category) => {
        setSelectedCategory(category);
        setModalSecond(true);
    };

    const onCloseModalSecond = () => setModalSecond(false);

    const onOpenModal = () => setOpen(true);

    const onCloseModal = () => setOpen(false);

    return (
        <>
            <div className="page">
                <Sidebar />
                <Header />
                <div className="content">
                    {/* Start::main-content */}
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">
                            <div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Pages List</h5>
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
                                            className="px-2 py-1 border rounded mb-4 searchtype"
                                        />
                                        <div className="overflow-hidden table-bordered">
                                            <DataTable columns={columns} data={filteredData} pagination paginationTotalRows={filteredData.length} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Start::main-content */}
                </div>
                {/* First modal: Add category -------------- */}
                <Modal open={open} onClose={onCloseModal} center>
                    <div className="form-group">
                        <label className="mb-2" htmlFor="categoryId"><h4>Add New Pages</h4>
                        </label>
                        <hr />
                        <label className="" htmlFor="name">
                            Page Name
                        </label>
                        <br />
                        <textarea
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value }, clearValidationError("name"))}

                            className="form-control"
                            id="name"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="Name"
                        />
                        {validationErrors.name && <span className="text-danger">{validationErrors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label className="" htmlFor="heading">
                            Heading
                        </label>
                        <br />

                        <textarea
                            type="text"
                            name="heading"
                            value={formData.heading}
                            onChange={(e) => setFormData({ ...formData, heading: e.target.value }, clearValidationError("heading"))}

                            className="form-control"
                            id="heading"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="Heading"
                        />
                        {validationErrors.heading && <span className="text-danger">{validationErrors.heading}</span>}
                    </div>

                    <button
                        type="submit"
                        onClick={addCategory}
                        className="btn btn-primary modal-footer"
                    >
                        Add
                    </button>
                </Modal>
                {/* Edit modal code --------- */}
                <Modal open={modalSecond} onClose={onCloseModalSecond} center>
                    <label className="mb-2" htmlFor="regionName"><h4>Edit Region</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="name">
                            Page Name
                        </label>
                        <br />
                        <textarea
                            type="text"
                            name="name"
                            value={selectedCategory.name}
                            onChange={(e) => {
                                handleChange(e);
                                clearValidationError("name");
                            }}
                            className="form-control"
                            id="name"
                            placeholder="Name"
                        />
                        {validationErrors.name && <span className="text-danger">{validationErrors.name}</span>}
                    </div>
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="heading">
                            Heading
                        </label>
                        <textarea
                            type="text"
                            name="heading"
                            value={selectedCategory.heading}
                            onChange={(e) => {
                                handleChange(e);
                                clearValidationError("heading");
                            }}
                            className="form-control"
                            id="heading"
                            placeholder="Heading"
                        />
                        {validationErrors.heading && <span className="text-danger">{validationErrors.heading}</span>}
                    </div>
                    <button
                        type="submit"
                        onClick={updateCategory}
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

export default CMS;
