import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import { MultiSelect } from "react-multi-select-component";
import {
    updateProductSizeAction,
    addProductSizeAction,
    updateSizeStatusAction,
    getCategoryAction,
    getProductSizeListAction,
    getSubCategoryAction,
    innerCategoryStatusUpdateAction,
    getRegionListAction
} from "../../Action/user.action";
import Swal from 'sweetalert2';
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Togglesidebar from "../../directives/togglesidebar";

const Size = () => {
    const [sublisting, setSubListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [formData, setFormData] = useState({ categoryId: "", subCategoryId: "", regionId: [], id: "" });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [region, setRegion] = useState([])
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
        fetchProductSizes();
        fetchRegionList();
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

    const handleRegionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, regionId: selectedOptions });
    };

    const handleProductSizeChange = (e) => setFormData({ ...formData, sizeName: e.target.value });

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
                let res = await updateSizeStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,
                        res.msg,
                        'success'
                    )
                    fetchProductSizes();
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

        if (formData.sizeName === "") {
            errors.sizeName = "Size name is required";
        }
        if (formData.categoryId === "") {
            errors.categoryId = "Category is required";
        }
        // if (formData.subCategoryId === "") {
        //     errors.subCategoryId = "Sub category is required";
        // }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                const response = await addProductSizeAction(formData);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    fetchProductSizes();
                } else {
                    console.error("Failed to add Inner Subcategory");
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
                id: formData.id,
                sizeName: formData.sizeName,
            };
            if (data.sizeName === "") {
                errors.sizeName = "Size name is required";
            }
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                setValidationErrors({});

                const response = await updateProductSizeAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();
                    fetchProductSizes();
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
                setCategories(res.data);
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
                setSubcategories(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting subcategories:", error);
        }
    };
    // Fetch Product Size------------------
    const fetchProductSizes = async () => {
        try {
            const res = await getProductSizeListAction();
            if (res.success) {
                setSubListing(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting inner subcategories:", error);
        }
    };

    // Fetch Brands Lsit--------------------
    const fetchRegionList = async () => {
        try {
            const res = await getRegionListAction();
            if (res.success) {
                setRegion(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting inner subcategories:", error);
        }
    };

    const onOpenModalSecond = (sizes) => {
        setSelectedCategory(sizes.categoryId);
        setSelectedSubcategory(sizes);
        setFormData({
            categoryId: sizes.categoryId,
            subCategoryId: sizes.subCategoryId,
            sizeName: sizes.sizeName,
            id: sizes.id
        });
        setModalSecond(true);
    };

    const onOpenModal = () => {
        setSelectedCategory("");
        setFormData({
            categoryId: "",
            subCategoryId: "",
            sizeName: ""
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
            name: "Size",
            selector: (row) => row.sizeName,
            sortable: true,
        },
        {
            name: "Category Name",
            selector: (row) => row.categoryName,
            sortable: true,
        },
        // {
        //     name: "Sub-Category Name",
        //     selector: (row) => row.subCategoryName,
        //     sortable: true,
        // },
        // {
        //     name: "Region Name",
        //     selector: (row) => row.regionName,
        //     sortable: true,
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

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Product Size List</h5>
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

                <Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor="categoryId"><h4>Add Size Name</h4>
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

                    {/* {formData.categoryId !== '' ?
                        <div className="form-group mb-3">
                            <label className="mb-2" htmlFor="subCategoryId">
                                Sub-Category
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
                                <option value="">Select a Sub-category</option>
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
                    } */}

                    {/* <div className="form-group">
                        <label className="modal-header" htmlFor="regionName">
                            Region Name
                        </label>
                        <select
                            name="regionName"
                            value={formData.regionName}
                            onChange={handleRegionChange}
                            className="form-control"
                            id="regionName"
                            multiple 
                        
                        >
                            {region.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.regionName}
                                </option>
                            ))}
                        </select>
                        {validationErrors.regionId && (
                            <span className="text-danger">{validationErrors.regionId}</span>
                        )}
                    </div> */}

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="sizeName">
                            Size Name
                        </label>
                        <input
                            type="text"
                            name="sizeName"
                            value={formData.sizeName}
                            onChange={(e) => {
                                handleProductSizeChange(e);
                                clearValidationError("sizeName");
                            }}

                            className="form-control"
                            id="InnerSubcategoryName"
                            placeholder="Size Name"
                        />
                        {validationErrors.sizeName && <span className="text-danger">{validationErrors.sizeName}</span>}

                    </div>
                    <button type="submit" onClick={addInnerSubCategory} className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal>
                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor="categoryId"><h4>Edit Size Name</h4>
                    </label>
                    <hr />
                   
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="sizeName">
                            Size Name
                        </label>


                        <input
                            type="text"
                            name="sizeName"
                            value={formData.sizeName}
                            onChange={(e) => {
                                handleProductSizeChange(e);
                                clearValidationError("sizeName");
                            }}
                            className="form-control"
                            id="sizeName"
                            placeholder="Size"
                        />
                        {validationErrors.sizeName && <span className="text-danger">{validationErrors.sizeName}</span>}
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

export default Size;
