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
import Togglesidebar from "../../directives/togglesidebar";
import { getProductTypeListAction, insertProductTypeAction, updateProductTypeAction, updateProductTypeStatusAction, getCategoryAction, getSubCategoryAction, getInnerCategoryListAction } from "../../Action/user.action";


const ProductType = () => {
    const [sublisting, setSubListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [formData, setFormData] = useState({ categoryId: "", subCategoryId: '', innerCategoryId: '', productTypeName: "" });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedInnerCategory, setSelectedInnerCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [subCategory, setSubCategory] = useState([])
    const [innerCategory, setInnerCategory] = useState([])
    const [productType, setProductType] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchText, setSearchText] = useState('');



    useEffect(() => {
        fetchCategories();
        fetchSubCategory();
        fetchProductTypeList()
        fetchInnerCategory()
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData({ ...formData, categoryId: selectedCategoryId });
        setSelectedCategory(selectedCategoryId);
    };

    const handleSubCategoryChange = (e) => {
        const selectedSubCategoryId = e.target.value;
        setFormData({ ...formData, subCategoryId: selectedSubCategoryId });
        setSelectedSubCategory(selectedSubCategoryId);
    };

    const handleInnerCategoryChange = (e) => {
        const selectedInnerCategoryId = e.target.value;
        setFormData({ ...formData, innerCategoryId: selectedInnerCategoryId });
        setSelectedInnerCategory(selectedInnerCategoryId);
    };

    const handleProductTypeNameChange = (e) => setFormData({ ...formData, productTypeName: e.target.value });

    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    // add Product Type -----
    const addProductType = async (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.categoryId === "") {
            errors.categoryId = "Category is required";
        }
        if (formData.subCategoryId === "") {
            errors.subCategoryId = "Sub category is required";
        }
        if (formData.innerCategoryId === "") {
            errors.innerCategoryId = "Inner category is required";
        }
        if (formData.productTypeName === "") {
            errors.productTypeName = "Product type name is required";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                const response = await insertProductTypeAction(formData);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    fetchProductTypeList();
                } else {
                    toast.error(response.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            } catch (error) {
                console.error("An error occurred while adding the Product Type:", error);
            }
        }
    };


    const onOpenModalSecond = (subcategory) => {
        setSelectedCategory(subcategory.categoryId);
        setSelectedSubCategory(subcategory.subCategoryId);
        setSelectedInnerCategory(subcategory.innerCategoryId)
        setFormData({
            id: subcategory.id,
            categoryId: subcategory.categoryId,
            subCategoryId: subcategory.subCategoryId,
            innerCategoryId: subcategory.innerCategoryId,
            productTypeName: subcategory.productTypeName,
        });
        setModalSecond(true);
    };
    // Edit Product Type Name -------
    const updateProductTypeName = async (e) => {
        e.preventDefault();
        try {
            const errors = {};
            console.log('c', formData.categoryId)
            console.log('s', formData.subCategoryId)
            console.log('i', formData.innerCategoryId)
            let data = {
                id: formData.id,
                categoryId: formData.categoryId,
                subCategoryId: formData.subCategoryId,
                innerCategoryId: formData.innerCategoryId,
                productTypeName: formData.productTypeName,
            }
            if (data.categoryId == "") {
                errors.categoryId = "Category name is required";
            }
            if (data.subCategoryId == "") {
                errors.subCategoryId = "sub category name is required";
            }
            if (data.innerCategoryId == "") {
                errors.innerCategoryId = "Inner category name is required";
            }
            if (data.productTypeName === "") {
                errors.productTypeName = "Product type name is required";
            }
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                setValidationErrors({});

                const response = await updateProductTypeAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();

                    fetchProductTypeList();

                } else {
                    console.error("Failed to update category");
                }
            }
        } catch (error) {
            console.error("An error occurred while updating the category:", error);
        }
    };

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
                let res = await updateProductTypeStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchProductTypeList();
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

    // fatch category for dropdown---
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

    // fatch Sub category for dropdown---
    const fetchSubCategory = async () => {
        try {
            const res = await getSubCategoryAction();
            if (res.success) {
                setSubCategory(res.data.filter(
                    (item) => item.status == 1
                ));
            }
        } catch (error) {
            console.error("An error occurred while getting sub categories:", error);
        }
    };

    // fatch Inner category for dropdown---
    const fetchInnerCategory = async () => {
        try {
            const res = await getInnerCategoryListAction();
            if (res.success) {
                setInnerCategory(res.data.filter(
                    (item) => item.status == 1
                ));
            }
        } catch (error) {
            console.error("An error occurred while getting Inner categories:", error);
        }
    };
    // fatch Product Type Name-----
    const fetchProductTypeList = async () => {
        try {
            const res = await getProductTypeListAction();
            if (res.success) {
                setProductType(res.data);
                setSubListing(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting product type names:", error);
        }
    };

    const onOpenModal = () => {
        setOpen(true);
    }
    const onCloseModalSecond = () => {
        setSelectedSubCategory(null);
        setFormData({ categoryId: "", subCategoryId: '', innerCategoryId: '', productTypeName: "" });
        setModalSecond(false);
    };

    const onCloseModal = () => {
        setFormData({ categoryId: "", subCategoryId: '', innerCategoryId: '', productTypeName: "" });
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
            name: "Inner Category",
            selector: (row) => row.innerCategoryName,
            sortable: true,
        },
        {
            name: "Product Type",
            selector: (row) => row.productTypeName,
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
                                        <h5 className="box-title">Product Type List</h5>
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
                <label className="mb-2" htmlFor="categoryId"><h4>Add Product Type</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            Category
                        </label>
                        <select name="categoryId"
                            value={formData.categoryId}
                            // onChange={handleCategoryChange} 
                            onChange={(e) => {
                                handleCategoryChange(e);
                                clearValidationError("categoryId");
                            }}
                            className="form-control"
                            id="categoryId">
                            <option value="">Select category</option>
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
                            <select name="subCategoryId" value={formData.subCategoryId}
                                // onChange={handleSubCategoryChange} 
                                onChange={(e) => {
                                    handleSubCategoryChange(e);
                                    clearValidationError("subCategoryId");
                                }}
                                className="form-control"
                                id="subCategoryId">
                                <option value="">Select Sub Category</option>
                                {subCategory.filter(item => item.categoryId == formData.categoryId)
                                    .map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.subCategoryName}
                                        </option>
                                    ))}
                            </select>
                            {validationErrors.subCategoryId && <span className="text-danger">{validationErrors.subCategoryId}</span>}
                        </div>
                        : ''
                    }

                    {formData.subCategoryId !== '' ?
                        < div className="form-group mb-3">
                            <label className="mb-2" htmlFor="innerCategoryId">
                                Inner Category
                            </label>
                            <select name="innerCategoryId"
                                value={formData.innerCategoryId}
                                onChange={(e) => {
                                    handleInnerCategoryChange(e);
                                    clearValidationError("innerCategoryId");
                                }}
                                className="form-control"
                                id="innerCategoryId">
                                <option value="">Select Inner Category</option>
                                {innerCategory.filter(item => item.subCategoryId == formData.subCategoryId)
                                    .map((innerCategory) => (
                                        <option key={innerCategory.id} value={innerCategory.id}>
                                            {innerCategory.innerCategoryName}
                                        </option>
                                    ))}
                            </select>
                            {validationErrors.innerCategoryId && <span className="text-danger">{validationErrors.innerCategoryId}</span>}
                        </div>
                        : ''
                    }

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="productTypeName">
                            Product Type Name
                        </label>
                        <input
                            type="text"
                            name="productTypeName"
                            value={formData.productTypeName}
                            onChange={(e) => {
                                handleProductTypeNameChange(e);
                                clearValidationError("productTypeName");
                                <ol className="flex items-center whitespace-nowrap min-w-0">
                                    <li
                                        className="text-sm text-gray-500 hover:text-primary dark:text-white/70"
                                        aria-current="page"
                                    >
                                        <button
                                            type="button"
                                            onClick={onOpenModal}
                                            className="ti-btn ti-btn-primary"
                                        >
                                            Add Category
                                        </button>
                                    </li>
                                </ol>
                            }}
                            className="form-control"
                            id="productTypeName"
                            placeholder="Product Type Name"
                        />
                        {validationErrors.productTypeName && <span className="text-danger">{validationErrors.productTypeName}</span>}
                    </div>
                    <button type="submit" onClick={addProductType} className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal >
                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                <label className="mb-2" htmlFor="categoryId"><h4>Edit Product Type</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            Category
                        </label>
                        <select name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => {
                                handleCategoryChange(e);
                                clearValidationError("categoryId");
                            }}
                            className="form-control"
                            id="categoryId">
                            <option value="">Select category</option>
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
                        <select name="subCategoryId" value={formData.subCategoryId}
                            onChange={(e) => {
                                handleSubCategoryChange(e);
                                clearValidationError("subCategoryId");
                            }}
                            className="form-control"
                            id="subCategoryId">
                            <option value="">Select Sub Category</option>
                            {subCategory.filter(item => item.categoryId == formData.categoryId)
                                .map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.subCategoryName}
                                    </option>
                                ))}
                        </select>
                        {validationErrors.subCategoryId && <span className="text-danger">{validationErrors.subCategoryId}</span>}
                    </div>

                    < div className="form-group mb-3">
                        <label className="mb-2" htmlFor="innerCategoryId">
                            Inner Category
                        </label>
                        <select name="innerCategoryId"
                            value={formData.innerCategoryId}
                            onChange={(e) => {
                                handleInnerCategoryChange(e);
                                clearValidationError("innerCategoryId");
                            }}
                            className="form-control"
                            id="innerCategoryId">
                            <option value="">Select Inner Category</option>
                            {innerCategory.filter(item => item.subCategoryId == formData.subCategoryId)
                                .map((innerCategory) => (
                                    <option key={innerCategory.id} value={innerCategory.id}>
                                        {innerCategory.innerCategoryName}
                                    </option>
                                ))}
                        </select>
                        {validationErrors.innerCategoryId && <span className="text-danger">{validationErrors.innerCategoryId}</span>}
                    </div>


                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="productTypeName">
                            Product Type Name
                        </label>

                        <input
                            type="text"
                            name="productTypeName"
                            value={formData.productTypeName}
                            onChange={(e) => {
                                handleProductTypeNameChange(e);
                                clearValidationError("productTypeName");
                            }}
                            className="form-control"
                            id="productTypeName"
                            placeholder="Sub-Category Name"
                        />
                        {validationErrors.productTypeName && <span className="text-danger">{validationErrors.productTypeName}</span>}
                    </div>
                    <br />
                    <button type="submit" onClick={updateProductTypeName} className="btn btn-primary modal-footer">
                        Update
                    </button>
                </Modal>
                <ToastContainer />
                <Footer />
            </div >
        </>
    );
};

export default ProductType;
