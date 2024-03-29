import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import toast, { Toaster } from "react-hot-toast";
import { baseurl } from "../../config/config";
import {
  getCategoryAction,
  getSubCategoryAction,
  getInnerCategoryAction,
  getProductTypeListAction,
  getBrandListAction,
  addProductAction,
  getProductSizeListAction,
  getProductByIdAndColorProductIdAction
} from "../../Action/user.action";
import Togglesidebar from "../../directives/togglesidebar";


const AddProduct = () => {
  const [form, setForm] = useState({
    productName: "",
    description: "",
    vendorPrice: "",
    customerPrice: "",
    marginPrice: '',
    discount: '',
    // color: '',
    colorProductId: '',
    categoryId: "",
    // subCategoryId: "",
    // innerCategoryId: "",
    // productTypeId: "",
    brandId: "",
    specification: "",
    highlights: "",
    warnings: "",
    userManual: "",
    isSizeAvailable: "",
    productQuantity: "",
  });

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [innerCategory, setInnerCategory] = useState([]);
  const [productType, setProductType] = useState([]);
  const [product, setProduct] = useState([])
  const [brand, setBrand] = useState([]);
  const [sizes, setSize] = useState([]);
  const [categorySizes, setcategorySizes] = useState([]);
  const [defaultQty, setdefaultQty] = useState(false);
  const [qtyBasedOnSize, setqtyBasedOnSize] = useState(false);
  const [isSizeAvailable, setIsSizeAvailable] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    productName: "",
    price: "",
    image1: "",
    categoryId: "",
    subCategoryId: "",
    brandId: "",
  });

  const [image1, setImage1] = useState([]);
  const [image2, setImage2] = useState([]);
  const [image3, setImage3] = useState([]);
  const [image4, setImage4] = useState([]);
  const [image5, setImage5] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const handleQuantityType = (type) => {
    if (type === "0") {
      setIsSizeAvailable("0");
      setdefaultQty(true);
      setqtyBasedOnSize(false);
    } else if (type === "1") {
      setIsSizeAvailable("1");
      setdefaultQty(false);
      setqtyBasedOnSize(true);
    }
    validationErrors.isSizeAvailableErr = ''
  };

  const inputHandler = async (e) => {
    const { name, value } = e.target;
    setForm((old) => {
      return { ...old, [name]: value };
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? `` : "",
    }));
  };

  useEffect(() => {
    fetchCategoryList();
    fetchSubCategoryList();
    fetchInnerCategoryList();
    fetchProductTypeList();
    fetchBrandsList();
    fetchProductSizeList();
    // fetchProductList()
  }, []);

  useEffect(() => {
    setcategorySizes(sizes.filter((o) =>  o.categoryId == form.categoryId));

   
  }, [form.categoryId, ]);

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("addProductFormData"));
    if (savedFormData) {
      setForm(savedFormData.form);

    }
  }, []);

  // Save form data to local storage whenever form state changes
  useEffect(() => {
    const formDataToSave = {
      form,
    };
    localStorage.setItem("addProductFormData", JSON.stringify(formDataToSave));
  }, [form]);

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

  const fetchSubCategoryList = async () => {
    try {
      const res = await getSubCategoryAction();
      if (res.success) {
        setSubCategory(res.data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const fetchInnerCategoryList = async () => {
    try {
      const res = await getInnerCategoryAction();
      if (res.success) {
        setInnerCategory(res.data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const fetchProductTypeList = async () => {
    try {
      const res = await getProductTypeListAction();
      if (res.success) {
        setProductType(res.data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const fetchBrandsList = async () => {
    try {
      const res = await getBrandListAction();
      if (res.success) {
        setBrand(res.data.filter(
          (item) => item.status == 1
        ));
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  const fetchProductSizeList = async () => {
    try {
      const res = await getProductSizeListAction();
      if (res.success) {
        setSize(res.data);
      }
    } catch (error) {
      console.error("An error occurred while getting Category:", error);
    }
  };

  // const fetchProductList = async () => {
  //   try {
  //     const res = await getProductByIdAndColorProductIdAction();
  //     if (res.success) {
  //       let data = res.data;
  //       setProduct(data);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while getting Category:", error);
  //   }
  // };

  const [imgDimentionErr, setimgDimentionErr] = useState('');
  const handleImageChange = (e, i) => {
    const selectedImages = e.target.files;
    if (selectedImages.length > 0) {
      const image = selectedImages[0];
      validateImageDimensions(image, selectedImages, i);
    }
  };

  const validateImageDimensions = (image, selectedImages, i) => {
    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      if (img.width !== 480 || img.height !== 640) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [`image${i}`]: "Width should be 480 and height should be 640 pixels.",
        }));
        setimgDimentionErr('Width should be 480 and height should be 640 pixels.');
        return;
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [`image${i}`]: "", // Clear dimension error if dimensions are correct
        }));
        setimgDimentionErr('');
      }

      // If all checks pass, set the image state
      switch (i) {
        case 1:
          setImage1(selectedImages);
          previewImage(selectedImages[0], "image1");
          break;
        case 2:
          setImage2(selectedImages);
          previewImage(selectedImages[0], "image2");
          break;
        case 3:
          setImage3(selectedImages);
          previewImage(selectedImages[0], "image3");
          break;
        case 4:
          setImage4(selectedImages);
          previewImage(selectedImages[0], "image4");
          break;
        case 5:
          setImage5(selectedImages);
          previewImage(selectedImages[0], "image5");
          break;
        default:
          break;
      }
    };
  };




  const previewImage = (file, key) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => ({
          ...prevPreviews,
          [key]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
    //   setValidationErrors((prevErrors) => ({
    //     ...prevErrors,
    //     [selectedImages]: image1.trim() === "" ? `${selectedImages} is required` : "",
    // }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("addProductFormData");
    setisSubmitting(true);
    if (!validateForm()) {
      setisSubmitting(false);
      return;
    }
    let qtySizeObj = []
    if (isSizeAvailable == 1) {
      const categorySizesId = categorySizes.map(({ id }) => id);
      let totalQty = 0;
      categorySizesId.map((id) => {
        let obj = {
          sizeId: id,
          quantity: document.getElementById("qtyInput_" + id).value,
          onSizePrice: document.getElementById("amtInput_" + id).value
        }
        qtySizeObj.push(obj);
        if (obj.quantity !== '') {
          totalQty += parseInt(obj.quantity);
        }
      })
      form.quantity = totalQty;
    }
    let data = {
      ...form,
      image1: image1[0],
      image2: image2[0] ? image2[0] : [],
      image3: image3[0] ? image3[0] : [],
      image4: image4[0] ? image4[0] : [],
      image5: image5[0] ? image5[0] : [],
      isSizeAvailable: isSizeAvailable,
      qtySizeObj: JSON.stringify(qtySizeObj),
    };

    const res = await addProductAction(data);
    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${baseurl}productList`;
      }, 1200);
    } else {
      toast.error(res.msg);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      productName: "",
      price: "",
      image1: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
    };

    if (form.productName === "") {
      errors.productName = "Product name is required";
      isValid = false;
    }

    if (form.customerPrice === "") {
      errors.price = "customerPrice is required";
      isValid = false;
    }
    if (form.vendorPrice === "") {
      errors.price = "vendorPrice is required";
      isValid = false;
    }


    if (image1.length === 0) {
      if (imgDimentionErr != "") {
        errors.image1 = imgDimentionErr;
      }
      else {
        errors.image1 = "Image is required";
      }
      isValid = false;
    }

    if (form.categoryId === "") {
      errors.categoryId = "Category is required";
      isValid = false;
    }

    if (form.subCategoryId === "") {
      errors.subCategoryId = "Sub category is required";
      isValid = false;
    }

    if (form.brandId === "") {
      errors.brandId = "Brand name is required";
      isValid = false;
    }
    if (isSizeAvailable == "") {
      errors.isSizeAvailableErr = "Quantity type is required";
      isValid = false;
    }

    setValidationErrors(errors);
    if (!isValid) {
      window.scrollTo(0, 0)
    }
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
                    <h5 className="box-title">Add Product</h5>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Product Name
                          </label>
                          <input
                            type="text"
                            className="my-auto ti-form-input"
                            name="productName"
                            placeholder="Product Name"
                            value={form.productName}
                            onChange={inputHandler}
                          />
                          <span className="text-red-500 text-sm">
                            {validationErrors.productName}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Description
                          </label>
                          <textarea
                            className="my-auto ti-form-input"
                            placeholder="Description"
                            name="description"
                            value={form.description}
                            onChange={inputHandler}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                           Customer Price 
                          </label>
                          <input
                            type="number"
                            className="my-auto ti-form-input"
                            placeholder="Price"
                            name="customerPrice"
                            value={form.customerPrice}
                            min={0}
                            onChange={inputHandler}
                          />
                          <span className="text-red-500 text-sm">
                            {validationErrors.customerPrice}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Vendor Price
                          </label>
                          <input
                            type="number"
                            className="my-auto ti-form-input"
                            placeholder="Price"
                            name="vendorPrice"
                            value={form.vendorPrice}
                            min={0}
                            onChange={inputHandler}
                          />
                          <span className="text-red-500 text-sm">
                            {validationErrors.vendorPrice}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Margin Price
                          </label>
                          <input
                            type="number"
                            className="my-auto ti-form-input"
                            placeholder="Margin Price"
                            name="marginPrice"
                            value={form.marginPrice}
                            onChange={inputHandler}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            className="my-auto ti-form-input"
                            placeholder="Discount"
                            name="discount"
                            value={form.discount}
                            onChange={inputHandler}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Category Name
                          </label>
                          <select
                            className="my-auto ti-form-select"
                            name="categoryId"
                            onChange={inputHandler}
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

                        {/* {form.categoryId !== "" ? (
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">
                              Sub Category Name
                            </label>
                            <select
                              className="my-auto ti-form-select"
                              name="subCategoryId"
                              onChange={inputHandler}
                            >
                              <option value="">Select Sub Category</option>
                              {subCategory
                                .filter(
                                  (item) => item.categoryId == form.categoryId
                                )
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.subCategoryName}
                                  </option>
                                ))}
                            </select>
                            <span className="text-red-500 text-sm">
                              {validationErrors.subCategoryId}
                            </span>
                          </div>
                        ) : (
                          ""
                        )} */}

                        {/* {form.subCategoryId !== "" ? (
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">
                              Inner Category Name
                            </label>
                            <select
                              className="my-auto ti-form-select"
                              name="innerCategoryId"
                              onChange={inputHandler}
                            >
                              <option value="">Select Inner Category</option>
                              {innerCategory
                                .filter(
                                  (item) =>
                                    item.subCategoryId == form.subCategoryId
                                )
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.innerCategoryName}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ) : (
                          ""
                        )} */}

                        {/* {form.innerCategoryId !== "" ? (
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">
                              Product Type Name
                            </label>
                            <select
                              className="my-auto ti-form-select"
                              name="productTypeId"
                              onChange={inputHandler}
                            >
                              <option value="">Select Product Type Name</option>

                              {productType
                                .filter(
                                  (item) =>
                                    item.innerCategoryId == form.innerCategoryId
                                )
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.productTypeName}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ) : (
                          ""
                        )} */}

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Brand Name</label>
                          <select
                            className="my-auto ti-form-select"
                            name="brandId"
                            onChange={inputHandler}
                          >
                            <option value="">Select Brand Name</option>
                            {brand.filter(
                                  (item) => item.categoryId == form.categoryId
                                ).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.brandName}
                              </option>
                            ))}
                          </select>
                          <span className="text-red-500 text-sm">
                            {validationErrors.brandId}
                          </span>
                        </div>

                        {/* <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Color
                          </label>
                          <input
                            type="text"
                            className="my-auto ti-form-input"
                            placeholder="Color"
                            name="color"
                            value={form.color}
                            onChange={inputHandler}
                          />
                        </div> */}

                        {/* <div className="space-y-2">
                          <label className="ti-form-label mb-0">
                            Color of Product
                          </label>
                        
                        </div> */}

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Image1* (480*640 pixels)</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="image"
                            className="my-auto ti-form-input"
                            onChange={(e) => handleImageChange(e, 1)}
                          />

                          {imagePreviews.image1 && (
                            <>
                              <img
                                src={imagePreviews.image1}
                                alt="Image Preview"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  marginTop: "10px",
                                }}
                              />
                            </>
                          )}
                          <span className="text-red-500 text-sm">
                            {validationErrors.image1}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Image 2 (480*640 pixels)</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="image"
                            className="my-auto ti-form-input"
                            onChange={(e) => handleImageChange(e, 2)}
                          />
                          {imagePreviews.image2 && (
                            <>
                              <img
                                src={imagePreviews.image2}
                                alt="Image Preview"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  marginTop: "10px",
                                }}
                              />
                            </>
                          )}
                          <span className="text-red-500 text-sm">
                            {validationErrors.image2}
                          </span>
                        </div>


                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Image 3 (480*640 pixels)</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="image"
                            className="my-auto ti-form-input"
                            onChange={(e) => handleImageChange(e, 3)}
                          />
                          {imagePreviews.image3 && (
                            <>
                              <img
                                src={imagePreviews.image3}
                                alt="Image Preview"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  marginTop: "10px",
                                }}
                              />
                            </>
                          )}
                          <span className="text-red-500 text-sm">
                            {validationErrors.image3}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Image 4 (480*640 pixels)</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="image"
                            className="my-auto ti-form-input"
                            onChange={(e) => handleImageChange(e, 4)}
                          />
                          {imagePreviews.image4 && (
                            <img
                              src={imagePreviews.image4}
                              alt="Image Preview"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginTop: "10px",
                              }}
                            />
                          )}
                          <span className="text-red-500 text-sm">
                            {validationErrors.image4}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Image 5 (480*640 pixels)</label>
                          <input
                            accept="image/x-png,image/gif,image/jpeg,image/webp"
                            type="file"
                            name="image"
                            className="my-auto ti-form-input"
                            onChange={(e) => handleImageChange(e, 5)}
                          />
                          {imagePreviews.image5 && (
                            <img
                              src={imagePreviews.image5}
                              alt="Image Preview"
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginTop: "10px",
                              }}
                            />
                          )}
                          <span className="text-red-500 text-sm">
                            {validationErrors.image5}
                          </span>
                        </div>





                        {/* Sizes section start */}
                        <div className="space-y-1">
                          <label className="ti-form-label mb-2">
                            Quantity Type
                          </label>
                          <select
                            className="my-auto ti-form-select"
                            name="isSizeAvailable"
                            onChange={(e) => handleQuantityType(e.target.value)}
                            value={isSizeAvailable}
                          >
                            <option value="" disabled>
                              Select Quantity Type
                            </option>
                            <option value="0">Only available in single size</option>
                            <option value="1">Quantity based on sizes</option>
                          </select>
                          <span className="text-red-500 text-sm">
                            {validationErrors.isSizeAvailableErr}
                          </span>
                        </div>
                        {defaultQty ? (
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">Quantity</label>
                            <input
                              type="number"
                              className="my-auto ti-form-input"
                              name="productQuantity"
                              placeholder="Product Quantity"
                              value={form.productQuantity}
                              onChange={inputHandler}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        {qtyBasedOnSize ? (
                          <div className="space-y-2">
                            <label className="ti-form-label mb-0">
                              Add quantity based on size
                            </label>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Size Name</th>
                                    <th>Quantity</th>
                                    <th>Additional Price</th>
                                  </tr>
                                </thead>
                                  {console.log(categorySizes)}
                                <tbody>
                                  {form.categoryId != "" ?
                                    categorySizes.map((item) =>
                                      <tr>
                                        <td>
                                          <input
                                            type="text"
                                            className="my-auto ti-form-input"
                                            placeholder="Size Name"
                                            readOnly
                                            value={item.sizeName}

                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            className="my-auto ti-form-input"
                                            placeholder="0"
                                            id={`qtyInput_${item.id}`}
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            className="my-auto ti-form-input"
                                            placeholder="0"
                                            id={`amtInput_${item.id}`}
                                          />
                                        </td>
                                      </tr>
                                    )
                                    :
                                    <tr>
                                      <td colSpan={3}><center>Please select <b>category</b> or <b>sub-category</b> first.</center></td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {/* Sizes section end */}

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">
                            Specifications
                          </label>
                          <textarea
                            className="my-auto ti-form-input"
                            placeholder="specifications"
                            name="specification"
                            value={form.specification}
                            onChange={inputHandler}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Highlights</label>
                          <textarea
                            className="my-auto ti-form-input"
                            placeholder="Highlights"
                            name="highlights"
                            value={form.highlights}
                            onChange={inputHandler}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2">Warnings</label>
                          <textarea
                            className="my-auto ti-form-input"
                            placeholder="Warnings"
                            name="warnings"
                            value={form.warnings}
                            onChange={inputHandler}
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="ti-form-label mb-2"> User Manual</label>
                          <textarea
                            className="my-auto ti-form-input"
                            placeholder="User Manual"
                            name="userManual"
                            value={form.userManual}
                            onChange={inputHandler}
                          ></textarea>
                        </div>

                      </div>
                      {isSubmitting ?
                        <button type="button" disabled className="ti-btn ti-btn-primary">
                          Please Wait ...
                        </button>
                        :
                        <button type="submit" className="ti-btn ti-btn-primary mt-3">
                          Submit
                        </button>
                      }
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

export default AddProduct;

