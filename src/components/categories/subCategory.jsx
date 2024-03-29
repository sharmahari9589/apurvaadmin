import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import config from "../../config/config";
import Swal from 'sweetalert2';
import Togglesidebar from "../../directives/togglesidebar";
import { getSubCategoryAction, addSubCategoryAction, UpdateSubCategoryAction, getCategoryAction, subCategoryStatusUpdateAction } from "../../Action/user.action";

const SubCategory = () => {
    const [sublisting, setSubListing] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: "",
        subCategoryName: "",
        backgroundImage: "",
    });
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState();
    const [subcategories, setSubcategories] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [image1, setImage1] = useState("");
    const [searchText, setSearchText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviewForAdd, setImagePreviewForAdd] = useState(null)
    const [oldImagePreview, setOldImagePreviw] = useState(null)



    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData({ ...formData, categoryId: selectedCategoryId });
        setSelectedCategory(selectedCategoryId);
    };

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

    const fetchSubcategories = async () => {
        try {
            const res = await getSubCategoryAction();
            if (res.success) {
                let data = res.data
                setSubcategories(data);
                setSubListing(data);
            }
        } catch (error) {
            setSubcategories([]);
            console.error("An error occurred while getting subcategories:", error);
        }
    };
    

    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    const handleSubcategoryNameChange = (e) => setFormData({ ...formData, subCategoryName: e.target.value });

    const handleImage = (e) => {
        setImage1(e.target.files);
        const previewURL = URL.createObjectURL(e.target.files[0]);
        setImagePreviewForAdd(previewURL);
    };

    const handleImageChange = (e) => {
        setImage1(e.target.files);
        const previewURL = URL.createObjectURL(e.target.files[0]);
        setImagePreview(previewURL);
        setOldImagePreviw('')
    };

    // add Sub category-----
    const addSubCategory = async (e) => {
        e.preventDefault();
        const errors = {};


        if (formData.categoryId === "") {
            errors.categoryId = "Category is required";
        }
        if (formData.subCategoryName === "") {
            errors.subCategoryName = "Sub category is required";
        }



        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setValidationErrors({});
            try {
                let data = {
                    ...formData,
                    backgroundImage: image1[0],
                }

                const response = await addSubCategoryAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    fetchSubcategories();
                } else {
                    toast.error(response.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            } catch (error) {
                console.error("An error occurred while adding the category:", error);
            }
        }
    };

    const onOpenModalSecond = (subcategory) => {
        setSelectedCategory(subcategory.categoryId);
        setSelectedSubcategory(subcategory);
        setOldImagePreviw(subcategory.backgroundImage)
        setFormData({
            categoryId: subcategory.categoryId,
            subCategoryName: subcategory.subCategoryName,
        });
        setModalSecond(true);
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
                let res = await subCategoryStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    fetchSubcategories();
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

    // Edit Sub category -------
    const updateCategory = async (e) => {
        e.preventDefault();
        const errors = {};
        if (formData.categoryId === "") {
            errors.categoryId = "category name is required";
        }
        if (formData.subCategoryName === "") {
            errors.subCategoryName = "Sub category name is required";
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            // Clear validation errors
            setValidationErrors({});
            try {
                let data = {
                    id: selectedSubcategory.id,
                    categoryId: formData.categoryId,
                    subCategoryName: formData.subCategoryName,
                }
                if (image1.length > 0) {
                    data.backgroundImage = image1[0]
                } else {
                    data.oldBackgroundImage = formData.backgroundImage;
                }
                const response = await UpdateSubCategoryAction(data);
                if (response.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();

                    fetchSubcategories();
                } else {
                    console.error("Failed to update category");
                }
            } catch (error) {
                console.error("An error occurred while updating the category:", error);
            }
        }
    };

    const onOpenModal = () => setOpen(true);
    const onCloseModalSecond = () => {
        setSelectedSubcategory(null);
        setFormData({ categoryId: "", subCategoryName: "" });
        setImagePreview('')

        setModalSecond(false);
    };

    const onCloseModal = () => {
        setFormData({ categoryId: "", subCategoryName: "", });
        setImagePreviewForAdd('')
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
            name: "Background Image",
            text: "backgroundImage",
            cell: (item) => {
                return (
                    <>
                        <a href={config.imageUrl + item.backgroundImage} target="_blank" rel="noopener noreferrer">
                            <img style={{ width: '160px', height: '80px', borderColor: 'black' }} src={config.imageUrl + item.backgroundImage} alt="image" className="py-2" />
                        </a>
                    </>
                );
            },
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
                                <i class="fa fa-times " aria-hidden="true"></i>
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
                                        <h5 className="box-title">Sub Categories List</h5>
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

                    <label className="mb-2" htmlFor="categoryId"><h4>Add Sub Category</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            Category
                        </label>
                        <br />
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            // onChange={handleCategoryChange} 
                            onChange={(e) => {
                                handleCategoryChange(e);
                                clearValidationError("categoryId");
                            }}
                            className="form-control" id="categoryId">
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
                        <label className="mb-2" htmlFor="subcategoryName">
                            Sub Category
                        </label>
                        <input
                            type="text"
                            name="subCategoryName"
                            value={formData.subCategoryName}
                            onChange={(e) => {
                                handleSubcategoryNameChange(e);
                                clearValidationError("subCategoryName");
                            }}
                            className="form-control"
                            id="subcategoryName"
                            placeholder="Sub category"
                        />
                        {validationErrors.subCategoryName && <span className="text-danger">{validationErrors.subCategoryName}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="backgroundImage">
                            Background Image
                        </label>
                        <input
                            accept="image/x-png,image/gif,image/jpeg"
                            type="file"
                            name="backgroundImage"
                            // value={formData.backgroundImage}
                            onChange={(e) => {
                                handleImage(e);
                                clearValidationError("backgroundImage");
                            }}
                            className="form-control"
                        />
                        {validationErrors.backgroundImage && <span className="text-danger">{validationErrors.backgroundImage}</span>}
                        {imagePreviewForAdd && (
                            <img
                                src={imagePreviewForAdd}
                                alt="Selected Image Preview"
                                style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '150px' }}
                            />
                        )}
                    </div>

                    <br />
                    <button type="submit" onClick={addSubCategory} className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal>
                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                    <label className="mb-2" htmlFor="categoryId"><h4>Edit Sub Category</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            Category
                        </label>
                        <br />
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => {
                                handleCategoryChange(e);
                                clearValidationError("categoryId");
                            }}
                            className="form-control" id="categoryId">
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
                        <label className="mb-2" htmlFor="subcategoryName">
                            Sub Category
                        </label>
                        <input
                            type="text"
                            name="subCategoryName"
                            value={formData.subCategoryName}
                            onChange={(e) => {
                                handleSubcategoryNameChange(e);
                                clearValidationError("subCategoryName");
                            }}
                            className="form-control"
                            id="subCategoryName"
                            placeholder="Sub category"
                        />
                        {validationErrors.subCategoryName && <span className="text-danger">{validationErrors.subCategoryName}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="backgroundImage">
                            Background Image
                        </label>
                        <input
                            accept="image/x-png,image/gif,image/jpeg"
                            type="file"
                            name="backgroundImage"
                            onChange={(e) => {
                                handleImageChange(e);
                                clearValidationError("backgroundImage");
                            }}
                            className="form-control"
                        />
                        {validationErrors.backgroundImage && (
                            <span className="text-danger">{validationErrors.backgroundImage}</span>
                        )}
                        {oldImagePreview && (
                            <img
                                src={`${config.imageUrl + oldImagePreview}`}
                                alt="Image Preview"
                                style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '150px' }}
                            />
                        )}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Selected Image Preview"
                                style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '150px' }}
                            />
                        )}
                    </div>


                    <br />
                    <button type="submit" onClick={updateCategory} className="btn btn-primary modal-footer">
                        Update
                    </button>
                </Modal>
                <ToastContainer />
                <Footer />
            </div >
        </>
    );
};

export default SubCategory;

