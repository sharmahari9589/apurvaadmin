
import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import {
  getCategoryAction,
  addCategoryAction,
  UpdateCategoryAction,
  categoryStatusUpdateAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Togglesidebar from "../../directives/togglesidebar";
import config from "../../config/config";


const Category = () => {
  const [listing, setListing] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalSecond, setModalSecond] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ categoryName: "" });
  const [formData, setFormData] = useState({ categoryName: "" , backgroundImage:'' });
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreviewForAdd, setImagePreviewForAdd] = useState(null)
  const [image1, setImage1] = useState("");
  const [oldImagePreview, setOldImagePreviw] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    getListingDetails();
  }, []);

  const handleCategoryNameChange = (e) => {
    setSelectedCategory({ ...selectedCategory, categoryName: e.target.value });
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

    if (formData.categoryName === "") {
      errors.categoryName = "Category name is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      try {
        let data = {
          ...formData,
          backgroundImage: image1[0],
      }
        const res = await addCategoryAction(data);
        if (res.success) {
          toast.success(res.msg, {
            position: toast.POSITION.TOP_CENTER
          });
          onCloseModal();
          getListingDetails();
        } else {
          toast.error(res.msg, {
            position: toast.POSITION.TOP_CENTER
          });;
        }
      } catch (error) {
        console.error("An error occurred while adding the category:", error);
      }
    }
  }

  const handleImage = (e) => {
    setImage1(e.target.files);
    const previewURL = URL.createObjectURL(e.target.files[0]);
    setImagePreviewForAdd(previewURL);
    setOldImagePreviw(null)
  }


const handleImageChange = (e) => {
  setImage1(e.target.files);
  const previewURL = URL.createObjectURL(e.target.files[0]);
  setImagePreview(previewURL);
  setOldImagePreviw(null)
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
        let res = await categoryStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
        if (res.success) {
          Swal.fire(
            `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

            res.msg,
            'success'
          )
          getListingDetails();
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

  // Update category  ---------------------------------
  const updateCategory = async (e) => {
    e.preventDefault();
    const errors = {};
    if (selectedCategory.categoryName === "") {
      errors.categoryName = "Category Name is required";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      try {
       
          let data = {
          id:selectedCategory.id,
          categoryName:selectedCategory.categoryName,
          // backgroundImage:selectedCategory.backgroundImage
           
        }
        if (image1.length > 0) {
            data.backgroundImage = image1[0]
        } else {
            data.oldBackgroundImage = oldImagePreview;
        }
        const res = await UpdateCategoryAction(data);
        setImage1('')
        if (res.success) {
          toast.success(res.msg, {
            position: toast.POSITION.TOP_CENTER
          });
          onCloseModalSecond();
          getListingDetails();
        } else {
          toast.error(res.msg, {
            position: toast.POSITION.TOP_CENTER
          });;
        }
      } catch (error) {
        console.error("An error occurred while updating the category:", error);
      }
    }
  }

  // Get listing -------------------------------
  const getListingDetails = async () => {
    try {
      const res = await getCategoryAction();
      if (res.success) {
        setListing(res.data);
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
      name: "Category",
      selector: (row) => row.categoryName,
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

  // Modal code  ---------------------------------------
  const onOpenModalSecond = (category) => {
    setSelectedCategory(category);
    setOldImagePreviw(category.backgroundImage)
     setImagePreview(null)
    setModalSecond(true);
  };

  const onCloseModalSecond = () => setModalSecond(false);

  const onOpenModal = () => setOpen(true);

  const onCloseModal = () => {
    setFormData({ categoryName: "" });
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
                    <h5 className="box-title">Categories List</h5>
                    <button
                      type="button"
                      onClick={onOpenModal}
                      className="ti-btn ti-btn-primary"
                      style={{ float: 'right', marginTop: '-35px' }}
                    >
                      Add
                    </button>
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
        {/* First modal: Add category -------------- */}
        <Modal open={open} onClose={onCloseModal} center>
          <br />
          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="categoryName">
              Category
            </label>
            <br />

            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value }, clearValidationError("categoryName"))}

              className="form-control"
              id="categoryName"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="Category"
            />
            {validationErrors.categoryName && <span className="text-danger">{validationErrors.categoryName}</span>}
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
          {/* <br/> */}
          <button
            type="submit"
            onClick={addCategory}
            className="btn btn-primary modal-footer"
          >
            Add
          </button>
        </Modal>
        {/* Edit modal code --------- */}
        <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
          <br />
          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="categoryName">
              Category
            </label>
            <br />

            <input
              type="text"
              name="categoryName"
              value={selectedCategory.categoryName}
              onChange={(e) => {
                handleCategoryNameChange(e);
                clearValidationError("categoryName");
              }}
              className="form-control"
              id="categoryName"
              placeholder="Category Name"
            />
            {validationErrors.categoryName && <span className="text-danger">{validationErrors.categoryName}</span>}
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

          {/* <br /> */}
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

export default Category;
