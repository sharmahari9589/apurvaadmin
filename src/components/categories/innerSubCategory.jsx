import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import {
    UpdateInnerCategoryAction,
    addInnerCategoryAction,
    getCategoryAction,
    getInnerCategoryAction,
    getSubCategoryAction,
    innerCategoryStatusUpdateAction
} from "../../Action/user.action";
import Swal from 'sweetalert2';
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Togglesidebar from "../../directives/togglesidebar";

const InnerSubCategory = () => {
    const [sublisting, setSubListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [formData, setFormData] = useState({ categoryId: "", subCategoryId: "", innerCategoryName: "" });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
        fetchInnerSubcategories();
    }, []);
    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData({ ...formData, categoryId: selectedCategoryId, subCategoryId: "" });
        setSelectedCategory(selectedCategoryId);
    };


    const handleSubcategoryChange = (e) => {
        const selectedSubCategoryId = e.target.value;
        setFormData({ ...formData, subCategoryId: selectedSubCategoryId });
    };

    const handleInnerSubcategoryNameChange = (e) => setFormData({ ...formData, innerCategoryName: e.target.value });

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
                let res = await innerCategoryStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchInnerSubcategories();
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

    // Add Inner Category-------------
    const addInnerSubCategory = async (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.innerCategoryName === "") {
            errors.innerCategoryName = "Inner category name is required";
        }
        if (formData.categoryId === "") {
            errors.categoryId = "Category is required";
        }
        if (formData.subCategoryId === "") {
            errors.subCategoryId = "Sub category is required";
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                const response = await addInnerCategoryAction(formData);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    fetchInnerSubcategories();
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
    // Update InnerCategory -------------

    const updateInnerCategory = async (e) => {
        e.preventDefault();
        try {
            const errors = {};
            const data = {
                categoryId: selectedCategory,
                id: selectedSubcategory.id,
                subCategoryId: formData.subCategoryId,
                innerCategoryName: formData.innerCategoryName,
            };
            if (data.categoryId === "") {
                errors.categoryId = "Category name is required";
            }
            if (data.subCategoryId === "") {
                errors.subCategoryId = "Sub category name is required";
            }
            if (data.innerCategoryName === "") {
                errors.innerCategoryName = "Inner category name is required";
            }
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                setValidationErrors({});

                const response = await UpdateInnerCategoryAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();
                    fetchInnerSubcategories();
                } else {
                    console.error("Failed to update Inner category");
                }
            }
        } catch (error) {
            console.error("An error occurred while updating the category:", error);
        }
    };
    // fatch Category -------------------------
    const fetchCategories = async () => {
        try {
            const res = await getCategoryAction();
            if (res.success) {
                setCategories(res.data.filter(
                    (item) => item.status == 1
                ));
            }
        } catch (error) {
            console.error("An error occurred while getting categories:", error);
        }
    };

    // fatch Sub-Category-----------------------
    const fetchSubcategories = async () => {
        try {
            const res = await getSubCategoryAction();
            if (res.success) {
                setSubcategories(res.data.filter(
                    (item) => item.status == 1
                ));
            }
        } catch (error) {
            console.error("An error occurred while getting subcategories:", error);
        }
    };

    // fatch Inner-Sub Category------------------
    const fetchInnerSubcategories = async () => {
        try {
            const res = await getInnerCategoryAction();
            console.log(res);
            if (res.success) {
                setSubListing(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting inner subcategories:", error);
        }
    };

    const onOpenModalSecond = (innerCategory) => {
        setSelectedCategory(innerCategory.categoryId);
        setSelectedSubcategory(innerCategory);
        setFormData({
            categoryId: innerCategory.categoryId,
            subCategoryId: innerCategory.subCategoryId,
            innerCategoryName: innerCategory.innerCategoryName,
        });
        setModalSecond(true);
    };

    const onOpenModal = () => {
        setSelectedCategory("");
        setFormData({
            categoryId: "",
            subCategoryId: "",
            innerCategoryName: ""
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
            name: "Category",
            selector: (row) => row.categoryName,
            sortable: true,
        },
        {
            name: "Sub Category",
            selector: (row) => row.subCategoryName,
            sortable: true,
        },
        {
            name: "Inner Sub Category",
            selector: (row) => row.innerCategoryName,
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
                            <div>
                            </div>

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Inner Sub Categories List</h5>
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

                <div className="ddadadadad">

                    <Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}>

                        <label className="mb-2" htmlFor="categoryId"><h4>Add Inner Category</h4>
                        </label>
                        <hr />
                        <div className="form-group mb-3">
                            <label className="mb-2" htmlFor="categoryId">
                                Category
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={(e) => {
                                    handleCategoryChange(e);
                                    clearValidationError("categoryId");
                                }}
                                className="form-control"
                                id="categoryId"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.categoryId && <span className="text-danger">{validationErrors.categoryId}</span>}

                        </div>

                        {formData.categoryId !== '' ?
                            <div className="form-group mb-3">
                                <label className="mb-2" htmlFor="subCategoryId">
                                    Sub Category
                                </label>
                                <select
                                    name="subCategoryId"
                                    value={formData.subCategoryId}
                                    onChange={(e) => {
                                        handleSubcategoryChange(e);
                                        clearValidationError("subCategoryId");
                                    }} className="form-control"
                                    id="subCategoryId"
                                >
                                    <option value="">Select Sub category</option>
                                    {subcategories.filter(item => item.categoryId == formData.categoryId)
                                        .map((subCategory) => (
                                            <option key={subCategory.id} value={subCategory.id}>
                                                {subCategory.subCategoryName}
                                            </option>
                                        ))}
                                </select>
                                {validationErrors.subCategoryId && <span className="text-danger">{validationErrors.subCategoryId}</span>}
                            </div> :
                            ''
                        }

                        <div className="form-group mb-3">
                            <label className="mb-2" htmlFor="innerCategoryName">
                                Inner Sub Category
                            </label>
                            <input
                                type="text"
                                name="innerCategoryName"
                                value={formData.innerCategoryName}
                                onChange={(e) => {
                                    handleInnerSubcategoryNameChange(e);
                                    clearValidationError("innerCategoryName");
                                }}

                                className="form-control"
                                id="InnerSubcategoryName"
                                placeholder="Inner Sub category"
                            />
                            {validationErrors.innerCategoryName && <span className="text-danger">{validationErrors.innerCategoryName}</span>}

                        </div>
                        <button type="submit" onClick={addInnerSubCategory} className="btn btn-primary modal-footer">
                            Add
                        </button>

                    </Modal>
                </div>

                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                    <label className="mb-2" htmlFor="categoryId"><h4>Edit Inner Category</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            Category
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => {
                                handleCategoryChange(e);
                                clearValidationError("categoryId");
                            }}
                            className="form-control"
                            id="categoryId"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        {validationErrors.categoryId && <span className="text-danger">{validationErrors.categoryId}</span>}

                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="subCategoryId">
                            Sub Category
                        </label>
                        <select
                            name="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={(e) => {
                                handleSubcategoryChange(e);
                                clearValidationError("subCategoryId");
                            }} className="form-control"
                            id="subCategoryId"
                        >
                            <option value="">Select Sub category</option>
                            {subcategories.filter(item => item.categoryId == formData.categoryId)
                                .map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.subCategoryName}
                                    </option>
                                ))}
                        </select>
                        {validationErrors.subCategoryId && <span className="text-danger">{validationErrors.subCategoryId}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="innerCategoryName">
                            Inner Sub Category
                        </label>

                        <input
                            type="text"
                            name="innerCategoryName"
                            value={formData.innerCategoryName}
                            onChange={(e) => {
                                handleInnerSubcategoryNameChange(e);
                                clearValidationError("innerCategoryName");
                            }}
                            className="form-control"
                            id="innerCategoryName"
                            placeholder="Inner Sub Category"
                        />
                        {validationErrors.innerCategoryName && <span className="text-danger">{validationErrors.innerCategoryName}</span>}
                    </div>
                    <br />
                    <button type="submit" onClick={updateInnerCategory} className="btn btn-primary modal-footer">
                        Update
                    </button>
                </Modal>
                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default InnerSubCategory;
