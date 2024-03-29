import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import config from "../../config/config";
import Footer from "../../directives/footer";
import toast, { Toaster } from "react-hot-toast";
import { baseurl } from "../../config/config";
import {
  getCategoryAction,
  insertItemCombinationAction,
  getProductListAction,
} from "../../Action/user.action";
import Select from "react-select";
import Togglesidebar from "../../directives/togglesidebar";

const AddCombination = () => {
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [combinationName, setCombinationName] = useState('')
  const [productId, setProductId] = useState([]);
  const [combinationImage, setCombinationImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    categoryId: '',
    combinationName: '',
    productId: '',
    combinationImage: ''
  });


  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryAction();
      if (res.success) {
        setCategory(res.data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const fetchProductList = async () => {
    try {
      const res = await getProductListAction();
      if (res.success) {
        let data = res.data;
        setProduct(data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const inputHandler = async (e) => {
    const { name, value } = e.target;
    setCombinationName((old) => {
      return { ...old, [name]: value };
    });
  }

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;

    if (selectedImages.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImages[0]);
      setCombinationImage(selectedImages[0]);
    } else {
      setImagePreview(null);
      setCombinationImage(null);
    }

  };

  const [prd_error, setprd_error] = useState('');
  const [selectedCombinationProducts, setselectedCombinationProducts] = useState([]);

  const handleProductChange = (selectedOptions) => {
    setprd_error('');
    if (selectedOptions.length < 4) {
      setprd_error('Min 4 products required');
    }
    else if (selectedOptions.length > 5) {
      setprd_error('Max 5 products are allowed')
      return;
    }
    setProductId(selectedOptions.map((option) => option.value));
    setselectedCombinationProducts(selectedOptions);
  };


  // const handleProductChange = (selectedOptions) => {
  //   setProductId(selectedOptions.map((option) => option.value));

  //   const previews = selectedOptions.map((option) => {
  //     const selectedProduct = product.find((p) => p.id === option.value);
  //     return {
  //       id: option.value,
  //       image: selectedProduct.images[0].name,
  //       name: selectedProduct.productName,
  //     };
  //   });
  //   console.log('productIdproductId',productId);
  //   setSelectedProductPreviews(previews);
  // };

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setCategoryId(newCategoryId);
    //  setProductId([]);
    // setSelectedProductPreviews([]);
    setselectedCombinationProducts([])

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    let values = {
      categoryId,
      combinationName,
      combinationImage,
      productId,
    };

    values.combinationName = combinationName.combinationName
    console.log(combinationName.combinationName)
    console.log(values)

    const res = await insertItemCombinationAction(values);
    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${baseurl}combinationlist`;
      }, 1200);
    } else {
      toast.error(res.msg);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchProductList();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      categoryId: '',
      combinationName: '',
      productId: '',
      combinationImage: ''
    };

    if (!categoryId) {
      errors.categoryId = "Category is required";
      isValid = false;
    }
    if(!combinationName){
      errors.combinationName = "Combination name is required";
      isValid = false;
    }

    if (selectedCombinationProducts.length < 4 || selectedCombinationProducts.length > 5) {
      setprd_error("Min 4 and max 5 products are allowed")
      isValid = false;
    }
    if (!combinationImage) {
      errors.combinationImage = "Image is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };
  return (
    <>
      <div className="page">
        <div id="websidebar" className="">
          <Sidebar />
        </div>

        <div id="mobilesidebar" className="">
          <Togglesidebar />
        </div>
        <Header />
        <Toaster />
        <div className="content">
          <div className="main-content">
            <div className="block justify-between page-header md:flex">

            </div>
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Add Combination</h5>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">

                      <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Combination Name
                          </label>
                          <input
                            type="text"
                            className="my-auto ti-form-input"
                            name="combinationName"
                            placeholder="Combination Name"
                            onChange={inputHandler}
                          />
                          <span className="text-red-500 text-sm">
                            {validationErrors.combinationName}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Category Name
                          </label>
                          <select
                            className={`my-auto ti-form-select ${categoryId ? "" : (isSubmitting ? "border-red-500" : "")
                              }`}
                            name="categoryId"
                            onChange={handleCategoryChange}
                            value={categoryId}
                          >
                            <option value="">Select Category</option>
                            {category.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.categoryName}
                              </option>
                            ))}
                          </select>
                          {!categoryId ? (
                            <span className="text-red-500 text-sm">
                              {validationErrors.categoryId}
                            </span>
                          ) : ''}
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Products
                          </label>
                          <Select
                            isMulti
                            name="productId"
                            value={selectedCombinationProducts}
                            options={product
                              .filter((item) => item.categoryId == categoryId)
                              .map((item) => ({
                                value: item.id,
                                label: item.productName,
                                image: item.images
                              }))}
                            onChange={handleProductChange}
                          />
                          <span className="text-red-500">{prd_error}</span>

                        </div>

                        <div className="space-y-2">
                          <div className="row">
                            {selectedCombinationProducts.map((product) => (
                              <div key={product.id} className="col-md-2">
                                <center>
                                  {selectedCombinationProducts.length > 0 && (
                                    <div>
                                      <img
                                        src={`${config.imageUrl}${product.image[0].name}`}
                                        style={{ width: '130px', height: '130px', borderRadius: '50px' }}
                                      />
                                    </div>
                                  )}
                                </center>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Images</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="combinationImage"
                            className={`my-auto ti-form-input`}
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <div className="space-y-2">
                              <label className="ti-form-label mb-0">
                                Image Preview
                              </label>
                              <img
                                src={imagePreview}
                                alt="Image Preview"
                                className="preview-image"
                                style={{ width: "20%", height: "auto" }}
                              />
                            </div>
                          )}
                          {!combinationImage ? (
                            <span className="text-red-500 text-sm">
                              {validationErrors.combinationImage}
                            </span>
                          ) : ''}
                        </div>
                      </div>
                      <button type="submit" className="ti-btn ti-btn-primary mt-3">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddCombination;
