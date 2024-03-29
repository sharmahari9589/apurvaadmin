import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import {
  getBrandListAction,
  insertBrandNameAction,
  updateBrandNameAction,
  updateBrandStatusAction,
  getCategoryAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Togglesidebar from "../../directives/togglesidebar";

const Brand = () => {
  const [listing, setListing] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalSecond, setModalSecond] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ brandName: "", categoryId: '' });
  const [formData, setFormData] = useState({ brandName: "", categoryId: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    fetchBrandList();
    fetchCategories()
  }, []);

  const handlebrandNameChange = (e) => {
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      brandName: e.target.value
    }));
  };
  

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

  const clearValidationError = (fieldName) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setFormData((prevData) => ({ ...prevData, categoryId: selectedCategoryId }));
    setSelectedCategory((prevCategory) => ({ ...prevCategory, categoryId: selectedCategoryId }));
  };
  

  // Add category ----------------------------------------
  const addCategory = async (e) => {
    e.preventDefault();
    const errors = {};

    if (formData.brandName === "") {
      errors.brandName = "Brand name is required";
    }
    if (formData.categoryId === "") {
      errors.categoryId = "Category name is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      try {
        const response = await insertBrandNameAction(formData);
        if (response.success) {
          toast.success('Success', {
            position: toast.POSITION.TOP_CENTER
          });
          onCloseModal();
          fetchBrandList();
        } else {
          toast.error(response.msg, {
            position: toast.POSITION.TOP_CENTER
          });;
        }
      } catch (error) {
        console.error("An error occurred while adding the category:", error);
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
        let res = await updateBrandStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
        if (res.success) {
          Swal.fire(
            `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

            res.msg,
            'success'
          )
          fetchBrandList();
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
    if (selectedCategory.brandName === "") {
      errors.brandName = "Brand name is required";
    }
    if (selectedCategory.categoryId === "") {
      errors.categoryId = "Category name is required";
    }
    console.log('seeee' ,selectedCategory)
    console.log(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      try {
        const response = await updateBrandNameAction(selectedCategory, formData);
        if (response.success) {
          toast.success("Success", {
            position: toast.POSITION.TOP_CENTER,
          });
          onCloseModalSecond();
          fetchBrandList();
        } else {
          console.error("Failed to update category");
        }
      } catch (error) {
        console.error("An error occurred while updating the category:", error);
      }
    }
  }

  // Get listing -------------------------------
  const fetchBrandList = async () => {
    try {
      const res = await getBrandListAction();
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

  // const filteredData = listing.filter((item) =>
  //   Object.values(item).some((value) =>
  //     String(value).toLowerCase().includes(searchText.toLowerCase())
  //   )
  // );

  const filteredData = listing.filter((item,index) =>{
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
      name: "Brand Name",
      selector: (row) => row.brandName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.categoryName,
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

  // Modal code  ---------------------------------------
  const onOpenModalSecond = (category) => {
    setSelectedCategory(category);
    setModalSecond(true);
  };

  const onCloseModalSecond = () => setModalSecond(false);

  const onOpenModal = () => setOpen(true);

  const onCloseModal = () => {
    setFormData({ brandName: "" });
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
                    <h5 className="box-title">Brand List</h5>
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
                    <input
                      type="text"
                      value={searchText}
                      onChange={handleSearch}
                      placeholder="Search..."
                      className="px-2 py-1 border rounded mb-4"
                    />
                    <div className="overflow-hidden table-bordered">
                      {/* Search input */}

                      <DataTable columns={columns}
                        data={filteredData}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10]}
                        paginationTotalRows={filteredData.length} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Start::main-content */}
        </div>
        {/* First modal: Add category -------------- */}
        <Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}>
          <label className="mb-2" htmlFor="categoryId"><h4>Add Brand Name</h4>
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

          <div className="form-group">
            <label className="" htmlFor="brandName">
              Brand Name
            </label>
            <br />

            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value }, clearValidationError("brandName"))}

              className="form-control"
              id="brandName"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="Brand Name"
            />
            {validationErrors.brandName && <span className="text-danger">{validationErrors.brandName}</span>}
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
          <label className="mb-2" htmlFor="categoryId"><h4>Edit Brand Name</h4>
          </label>
          <hr />

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="categoryId">
              Category
            </label>
            <br />
            <select
              name="categoryId"
              value={selectedCategory.categoryId}
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

          <div className="form-group">
            <label className="" htmlFor="brandName">
              Brand Name
            </label>
            <br />
            <br />
            <input
              type="text"
              name="brandName"
              value={selectedCategory.brandName}
              onChange={(e) => {
                handlebrandNameChange(e);
                clearValidationError("brandName");
              }}
              className="form-control"
              id="brandName"
              placeholder="Brand Name"
            />
            {validationErrors.brandName && <span className="text-danger">{validationErrors.brandName}</span>}
          </div>
          <br />
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

export default Brand;
