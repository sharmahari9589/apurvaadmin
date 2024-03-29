import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
import {
  getRegionListAction,
  insertRegionNameAction,
  updateRegionNameAction,
  updateRegionStatusAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import config from "../../config/config";


const Region = () => {
  const [listing, setListing] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [modalSecond, setModalSecond] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ regionName: "", currency: "", symbol: '', countryCode: '' });
  const [formData, setFormData] = useState({ regionName: "", currency: "", symbol: '', countryCode: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreviewForAdd, setImagePreviewForAdd] = useState(null)
  const [image1, setImage1] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [oldImagePreview, setOldImagePreviw] = useState(null)

  useEffect(() => {
    fetchBrandList();
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

  console.log('oldImagePreview', oldImagePreview)

  // Add category ----------------------------------------
  const addCategory = async (e) => {
    e.preventDefault();
    const errors = {};

    if (formData.regionName === "") {
      errors.regionName = "Region Name is required";
    }
    if (formData.currency === "") {
      errors.currency = "Currency is required";
    }
    if (formData.symbol === "") {
      errors.regionName = "Symbole is required";
    }
    if (formData.countryCode === "") {
      errors.currency = "Country code is required";
    }
    if (image1 === "") {
      errors.image1 = "Image is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      try {
        console.log(image1[0])
        let data = {
          ...formData,
          flag: image1[0],
        }
        console.log(data)

        const response = await insertRegionNameAction(data);
        if (response.success) {
          toast.success('Success !', {
            position: toast.POSITION.TOP_CENTER
          });
          onCloseModal();
          fetchBrandList();
        } else {
          console.error("Failed to add category");
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
        let res = await updateRegionStatusAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
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

    if (selectedCategory.regionName === "") {
      errors.regionName = "Region Name is required";
    }
    if (selectedCategory.currency === "") {
      errors.currency = "Currency is required";
    }
    if (selectedCategory.symbol === "") {
      errors.symbol = "Symbol is required"; // Corrected field name
    }
    if (selectedCategory.countryCode === "") {
      errors.countryCode = "Country code is required"; // Corrected field name
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      // Clear validation errors
      setValidationErrors({});
      console.log(formData)
      try {
        let data = {
          ...selectedCategory,
          id: selectedCategory.id, // Add the region ID to the data object
        };
        if (image1.length > 0) {
          data.flag = image1[0];
        } else {
          data.oldflag = selectedCategory.flag;
        }

        console.log(data)

        const response = await updateRegionNameAction(data);
        if (response.success) {
          toast.success("Success", {
            position: toast.POSITION.TOP_CENTER,
          });
          onCloseModalSecond();
          fetchBrandList();
        } else {
          console.error("Failed to update Region");
        }
      } catch (error) {
        console.error("An error occurred while updating the Region:", error);
      }
    }
  };

  // Get listing -------------------------------
  const fetchBrandList = async () => {
    try {
      const res = await getRegionListAction();
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
      name: "Region Name",
      selector: (row) => row.regionName,
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
      sortable: true,
    },
    {
      name: "Symbol",
      selector: (row) => row.symbol,
      sortable: true,
    },
    {
      name: "Country Code",
      selector: (row) => row.countryCode,
      sortable: true,
    },
    {
      name: "Flag ",
      text: "flag",
      cell: (item) => {
        return (
          <>
            <a href={config.flgImageUrl + item.flag} target="_blank" rel="noopener noreferrer">
              <img style={{ width: '160px', height: '80px', borderColor: 'black' }} className="py-2" src={config.flgImageUrl + item.flag} alt="image" />
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
    setModalSecond(true);

    setOldImagePreviw(category.flag);
  };


  const onCloseModalSecond = () => {
    setModalSecond(false);
    setOldImagePreviw(null);
  };

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
                    <h5 className="box-title">Region List</h5>
                    <button type="button" onClick={onOpenModal} className="ti-btn ti-btn-primary" style={{ float: 'right', marginTop: '-35px' }}>
                      Add
                    </button>
                  </div>
                  <div className="box-body">
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
            <label className="mb-2" htmlFor="categoryId"><h4>Add Region</h4>
            </label>
            <hr />
            <label className="" htmlFor="regionName">
              Region
            </label>
            <br />
            <input
              type="text"
              name="regionName"
              value={formData.regionName}
              onChange={(e) => setFormData({ ...formData, regionName: e.target.value }, clearValidationError("regionName"))}

              className="form-control"
              id="regionName"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="Region"
            />
            {validationErrors.regionName && <span className="text-danger">{validationErrors.regionName}</span>}
          </div>

          <div className="form-group">
            <label className="" htmlFor="currency">
              Currency
            </label>
            <br />

            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value }, clearValidationError("currency"))}

              className="form-control"
              id="currency"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="Currency"
            />
            {validationErrors.currency && <span className="text-danger">{validationErrors.currency}</span>}
          </div>

          <div className="form-group">
            <label className="" htmlFor="symbol">
              Symbol
            </label>
            <br />
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value }, clearValidationError("symbol"))}

              className="form-control"
              id="symbol"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="symbol"
            />
            {validationErrors.symbol && <span className="text-danger">{validationErrors.symbol}</span>}
          </div>

          <div className="form-group">
            <label className="" htmlFor="countryCode">
              Country Code
            </label>
            <br />
            <input
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value }, clearValidationError("countryCode"))}

              className="form-control"
              id="countryCode"
              style={{ marginTop: "10px", marginBottom: "10px" }}
              placeholder="Country Code"
            />
            {validationErrors.countryCode && <span className="text-danger">{validationErrors.countryCode}</span>}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="flag">
              Flag Image
            </label>
            <input
              accept="image/x-png,image/gif,image/jpeg"
              type="file"
              name="flag"
              // value={formData.flag}
              onChange={(e) => {
                handleImage(e);
                clearValidationError("flag");
              }}
              className="form-control"
            />
            {validationErrors.flag && <span className="text-danger">{validationErrors.flag}</span>}
            {imagePreviewForAdd && (
              <img
                src={imagePreviewForAdd}
                alt="Selected Image Preview"
                style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '150px' }}
              />
            )}
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
            <label className="mb-2" htmlFor="regionName">
              Region
            </label>
            <br />
            <input
              type="text"
              name="regionName"
              value={selectedCategory.regionName}
              onChange={(e) => {
                handleChange(e);
                clearValidationError("regionName");
              }}
              className="form-control"
              id="regionName"
              placeholder="Region Name"
            />
            {validationErrors.regionName && <span className="text-danger">{validationErrors.regionName}</span>}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="currency">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              value={selectedCategory.currency}
              onChange={(e) => {
                handleChange(e);
                clearValidationError("currency");
              }}
              className="form-control"
              id="currency"
              placeholder="Currency"
            />
            {validationErrors.currency && <span className="text-danger">{validationErrors.currency}</span>}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="symbol">
              Symbol
            </label>
            <input
              type="text"
              name="symbol"
              value={selectedCategory.symbol}
              onChange={(e) => {
                handleChange(e);
                clearValidationError("symbol");
              }}
              className="form-control"
              id="symbol"
              placeholder="symbol"
            />
            {validationErrors.symbol && <span className="text-danger">{validationErrors.symbol}</span>}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="countryCode">
              Country Code
            </label>
            <input
              type="text"
              name="countryCode"
              value={selectedCategory.countryCode}
              onChange={(e) => {
                handleChange(e);
                clearValidationError("countryCode");
              }}
              className="form-control"
              id="countryCode"
              placeholder="countryCode"
            />
            {validationErrors.countryCode && <span className="text-danger">{validationErrors.countryCode}</span>}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2" htmlFor="flag">
              Flag Image
            </label>
            <input
              accept="image/x-png,image/gif,image/jpeg"
              type="file"
              name="flag"
              onChange={(e) => {
                handleImageChange(e);
                clearValidationError("flag");
              }}
              className="form-control"
            />
            {validationErrors.flag && (
              <span className="text-danger">{validationErrors.flag}</span>
            )}
            {oldImagePreview && (
              <img
                src={`${config.flgImageUrl + oldImagePreview}`}
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

export default Region;
