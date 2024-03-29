import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import config from "../../config/config";
import toast, { Toaster } from "react-hot-toast";
import { baseurl } from "../../config/config";
import { useParams } from "react-router-dom";
import {
  getCategoryAction,
  updateItemCombinationAction,
  getProductListAction,
  getCombinationListByIdAction
} from "../../Action/user.action";
import Select from "react-select";

const EditCombination = () => {
  let params = useParams();
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [prd_error, setprd_error] = useState('');
  const [selectedCombinationProducts, setselectedCombinationProducts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImages] = useState([]);
  const [image_preview, setimage_preview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    categoryId: '',
    combinationName: '',
    productId: '',
    combinationImage: ''
  });
  const [values, setValues] = useState({
    categoryId: "",
    combinationName: '',
    combinationImage: "",
    productId: [],
    products: []
  });

  useEffect(() => {
    fetchCategoryList();
    fetchProductList();
    fetchCombinationList();
  }, []);

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
      console.log(res);
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

  const fetchCombinationList = async () => {
    try {
      const matchProduct = await getCombinationListByIdAction({ id: params.id });
      let data = matchProduct.data
      if (data) {
        setValues({
          ...data,
          categoryId: data.categoryId,
          combinationName: data.combinationName,
          combinationImage: data.combinationImage,
          oldCombinationImage: data.combinationImage,
          productId: data.productId,
          products: data.products,
          id: params.id,
        });
        console.log('daya', data);
        setselectedCombinationProducts(data.products);
        if (data.combinationImage) {
          setImagePreview(data.combinationImage);
        }
      }
    } catch (error) {
      console.error("Error in fetching Combination detail:", error);
    }
  };


  const inputHandler = async (e) => {
    const { name, value } = e.target;
    setValues((old) => {
      return { ...old, [name]: value };
    });
  }

  const handleImageChange = async (e) => {
    e.preventDefault()
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    console.log('image_as_files', image_as_files)
    setimage_preview(image_as_base64);
    setImages(image_as_files)
    setImagePreview('')
  }

  const handleProductChange = (selectedOptions) => {
    setprd_error('');
    if (selectedOptions.length < 4) {
      setprd_error('Min 4 products required');
    }
    else if (selectedOptions.length > 5) {
      setprd_error('Max 5 products are allowed')
      return;
    }
    setselectedCombinationProducts(selectedOptions);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (image) {
      values.combinationImage = image;
    }
    if (values.oldCombinationImage && image.length === 0) {
      values.combinationImage = ''
    }
    const valuesArray = selectedCombinationProducts.map(obj => obj.value);
    values.productId = valuesArray

    if (values.productId.length === 0) {
      setprd_error('Combination products are required');
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    console.log(values)
    const res = await updateItemCombinationAction(values);

    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${baseurl}combinationlist`;
      }, 1000);
    } else {
      toast.error(res.msg);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      categoryId: '',
      combinationName: '',
      productId: '',
      combinationImage: ''
    };

    if (!values.categoryId) {
      errors.categoryId = "Category is required";
      isValid = false;
    }
    if (!values.combinationName) {
      errors.combinationName = "Combination name is required";
      isValid = false;
    }
    if (!values.productId) {
      errors.productId = "Combination products is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  return (
    <>
      <div className="page">
        <Sidebar />
        <Header />
        <Toaster />
        <div className="content">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12">
              <div className="box fields">
                <div className="box-header">
                  <h5 className="box-title">Edit Combination</h5>
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
                          value={values.combinationName}
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
                          className={`my-auto ti-form-select ${values.categoryId === "" ? "border-red-500" : ""
                            }`}
                          name="categoryId"
                          onChange={(e) => {
                            setValues({ ...values, categoryId: e.target.value })
                            setselectedCombinationProducts([])
                          }}
                          value={values.categoryId}
                        >
                          <option value="">Select Category</option>
                          {category.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.categoryName}
                            </option>
                          ))}
                        </select>
                        <span className="text-red-500 text-sm">
                          {validationErrors.categoryId}
                        </span>
                      </div>


                      <div className="space-y-2">
                        <label className="ti-form-label mb-0">Products</label>
                        <Select
                          isMulti
                          name="productId"
                          value={selectedCombinationProducts}
                          options={product
                            .filter((item) => item.categoryId == values.categoryId)
                            .map((item) => ({
                              value: item.id,
                              label: item.productName,
                              image: item.images
                            }))}
                          onChange={handleProductChange}
                        />
                        <span className="text-red-500">{prd_error}</span>
                        <span className="text-red-500 text-sm">
                          {validationErrors.productId}
                        </span>
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
                                      style={{
                                        height: '214px',
                                        width: '160px',
                                        borderRadius: '0px'
                                      }}
                                    />
                                  </div>
                                )}
                              </center>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">Combination Image</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="combinationImage"
                          className={`my-auto ti-form-input`}
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <img
                            src={`${config.imageUrl + imagePreview}`}
                            alt="Image Preview"
                            // style={{ maxWidth: "200px" }}
                            style={{
                              height: '214px',
                              width: '160px',
                              borderRadius: '0px'
                            }}
                          />
                        )}
                        {image_preview && (
                          <img
                            src={image_preview}
                            alt=""
                            // style={{ maxWidth: "200px" }}
                            style={{
                              height: '214px',
                              width: '160px',
                              borderRadius: '0px'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <button type="submit" className="ti-btn ti-btn-primary">
                      Submit
                    </button>
                  </form>
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

export default EditCombination;

