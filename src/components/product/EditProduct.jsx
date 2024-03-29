import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import toast, { Toaster } from "react-hot-toast";
import config from "../../config/config";
import { baseurl } from "../../config/config";
import { useParams } from "react-router-dom";
import {
  getCategoryAction,
  getSubCategoryAction,
  getInnerCategoryAction,
  getProductTypeListAction,
  getBrandListAction,
  updateProductAction,
  getProductSizeListAction,
  getProductListAction,
  getProductByIdAndColorProductIdAction
} from "../../Action/user.action";

const EditProduct = () => {
  let params = useParams();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    customerPrice: "",
    vendorPrice: "",
    marginPrice: '',
    discount: '',
    // color: '',
    // colorProductId: '',
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
    productId: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
  });
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [innerCategory, setInnerCategory] = useState([]);
  const [productType, setProductType] = useState([]);
  const [product, setProduct] = useState([])
  const [brand, setBrand] = useState([]);
  const [sizes, setSize] = useState([]);
  const [categorySizes, setcategorySizes] = useState([]);
  const [oldImages, setoldImages] = useState([]);
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
  };

  const inputHandler = async (e) => {
    const { name, value } = e.target;
    setForm((old) => {
      return { ...old, [name]: value };
    });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? `${name} is required` : "",
    }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((old) => {
      return { ...old, [name]: value };
    });
  };

  useEffect(() => {
    fetchCategoryList();
    // fetchSubCategoryList();
    // fetchInnerCategoryList();
    fetchProductTypeList();
    fetchBrandsList();
    fetchProductSizeList();
    fetchProductsList();
    // fetchProductByIdAndColorProductIdAction()
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

  // const fetchSubCategoryList = async () => {
  //   try {
  //     const res = await getSubCategoryAction();
  //     if (res.success) {
  //       setSubCategory(res.data.filter(
  //         (item) => item.status == 1
  //       ));
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while getting Sub Category:", error);
  //   }
  // };

  // const fetchInnerCategoryList = async () => {
  //   try {
  //     const res = await getInnerCategoryAction();
  //     if (res.success) {
  //       setInnerCategory(res.data.filter(
  //         (item) => item.status == 1
  //       ));
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while getting Inner Category:", error);
  //   }
  // };

  const fetchProductTypeList = async () => {
    try {
      const res = await getProductTypeListAction();
      if (res.success) {
        setProductType(res.data);
      }
    } catch (error) {
      console.error("An error occurred while getting Product Type:", error);
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
      console.error("An error occurred while getting Brand:", error);
    }
  };

  const fetchProductSizeList = async () => {
    try {
      const res = await getProductSizeListAction();
      if (res.success) {
        setSize(res.data);
      }
    } catch (error) {
      console.error("An error occurred while getting Sizes:", error);
    }
  };

  // const fetchProductByIdAndColorProductIdAction = async () => {
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

  useEffect(() => {
  let p =  sizes.filter((o) => o.categoryId == form.categoryId);
    setcategorySizes(p);
  }, []);
  const fetchProductsList = async () => {
    try {
      const products = await getProductListAction();
      const matchProduct = products.data?.find((item) => item.id == params.id);
      console.log("matchProduct", matchProduct.images);
      if (matchProduct) {
        setForm({
          ...matchProduct,
        });


        setoldImages({
          image1: matchProduct.images[0],
          image2: matchProduct.images[1],
          image3: matchProduct.images[2],
          image4: matchProduct.images[3],
          image5: matchProduct.images[4],
        });
        setIsSizeAvailable(matchProduct.isSizeAvailable);
        if (matchProduct.isSizeAvailable == 0) {
          setIsSizeAvailable("0");
          setdefaultQty(true);
          setqtyBasedOnSize(false);
        } else if (matchProduct.isSizeAvailable == 1) {
          setIsSizeAvailable("1");
          setdefaultQty(false);
          setqtyBasedOnSize(true);
        }
        setcategorySizes(matchProduct.sizes || [])
      }
    } catch (error) {
      console.error("Error fetching Product detail:", error);
    }
  };

  console.log('oldImages.image1', oldImages.image1)


  const [image1, setImage1] = useState([]);
  const [image2, setImage2] = useState([]);
  const [image3, setImage3] = useState([]);
  const [image4, setImage4] = useState([]);
  const [image5, setImage5] = useState([]);

  const [imgDimentionErr,setimgDimentionErr] = useState('');
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
          [`image${i}`]: "Height should be 640 and width should be 480 pixels.",
        }));
        setimgDimentionErr('Height should be 640 and width should be 480 pixels.');
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

  const previewImage = (file, imageKey) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => ({
          ...prevPreviews,
          [imageKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        totalQty += parseInt(obj.quantity);
      })
      form.quantity = totalQty;
    }
    let data = {
      ...form,
      productId: params.id,
      image1: image1[0],
      image2: image2[0] ? image2[0] : [],
      image3: image3[0] ? image3[0] : [],
      image4: image4[0] ? image4[0] : [],
      image5: image5[0] ? image5[0] : [],
      isSizeAvailable: isSizeAvailable,
      qtySizeObj: JSON.stringify(qtySizeObj),
    };
    console.log(data.quantity)
    console.log('data', data)

    const res = await updateProductAction(data);
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
      customerPrice: "",
      vendorPrice: "",
      image1: "",
      // categoryId: "",
      // subCategoryId: "",
      brandId: "",
    };

    if (form.productName === "") {
      errors.productName = "Product name is required";
      isValid = false;
    }

    if (form.vendorPrice === "") {
      errors.price = "vendor price is required";
      isValid = false;
    }

    
    if (form.customerPrice === "") {
      errors.price = "customer price is required";
      isValid = false;
    }
    if (form.image1 === "" && !imgDimentionErr) {
      if(imgDimentionErr != ""){
        errors.image1 = imgDimentionErr;
      }
      else{
        errors.image1 = "Image is required";
      }
      isValid = false;
    }

    if (form.categoryId === "") {
      errors.categoryId = "Category is required";
      isValid = false;
    }

    // if (form.subCategoryId === "") {
    //   errors.subCategoryId = "Sub category is required";
    //   isValid = false;
    // }

    if (form.brandId === "" || form.brandId == 0) {
      errors.brandId = "Brand name is required";
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
        <Sidebar />
        <Header />
        <Toaster />
        <div className="content">
          <div className="grid grid-cols-12 gap-6 p-4">
            <div className="col-span-12">
              <div className="box fields">
                <div className="box-header">
                  <h5 className="box-title">Edit Product</h5>
                </div>
                <div className="box-body">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          name="productName"
                          placeholder="Product Name"
                          value={form.productName}
                          onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm">
                          {validationErrors.productName}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Description
                        </label>

                        <textarea
                          className="my-auto ti-form-input"
                          placeholder="Description"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                         Customer Price 
                        </label>
                        <input
                          type="number"
                          className="my-auto ti-form-input"
                          placeholder="Customer price"
                          name="customerPrice"
                          value={form.customerPrice}
                          onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm">
                          {validationErrors.customerPrice}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                         Vendor Price 
                        </label>
                        <input
                          type="number"
                          className="my-auto ti-form-input"
                          placeholder="Customer price"
                          name="vendorPrice"
                          value={form.vendorPrice}
                          onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm">
                          {validationErrors.vendorPrice}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Margin Price 
                        </label>
                        <input
                          type="number"
                          className="my-auto ti-form-input"
                          placeholder="Margin Price"
                          name="marginPrice"
                          value={form.marginPrice}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          className="my-auto ti-form-input"
                          placeholder="Discount"
                          name="discount"
                          value={form.discount}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Category Name
                        </label>
                        <select
                          className="my-auto ti-form-select"
                          name="categoryId"
                          value={form.categoryId}
                          onChange={handleChange}
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

                      {/* <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Sub Category Name
                        </label>
                        <select
                          className="my-auto ti-form-select"
                          name="subCategoryId"
                          value={form.subCategoryId}
                          onChange={handleChange}
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
                      </div> */}

                      {/* <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Inner Category Name
                        </label>
                        <select
                          className="my-auto ti-form-select"
                          name="innerCategoryId"
                          value={form.innerCategoryId}
                          onChange={handleChange}
                        >
                          <option value="">Select Inner Category</option>
                          {innerCategory
                            .filter(
                              (item) => item.subCategoryId == form.subCategoryId
                            )
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.innerCategoryName}
                              </option>
                            ))}
                        </select>
                      </div> */}

                      {/* <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Product Type Name
                        </label>
                        <select
                          className="my-auto ti-form-select"
                          name="productTypeId"
                          value={form.productTypeId}
                          onChange={handleChange}
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
                      </div> */}

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">Brand Name</label>
                        <select
                          className="my-auto ti-form-select"
                          name="brandId"
                          value={form.brandId}
                          onChange={handleChange}
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

                      {/* <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          className="my-auto ti-form-input"
                          placeholder="Color"
                          name="color"
                          value={form.color}
                          onChange={handleChange}
                        />
                      </div> */}

                      {/* <div className="space-y-2">
                            <label className="ti-form-label mb-0">
                              Color of Product
                            </label>
                            <select
                              className="my-auto ti-form-select"
                              name="colorProductId"
                              value={form.colorProductId}
                              onChange={inputHandler}
                            >
                              <option value="">Select color of product</option>
                              {product
                                .filter(
                                  (item) =>
                                    item.subCategoryId == form.subCategoryId
                                )
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.productName}
                                  </option>
                                ))}
                            </select>
                          </div> */}

                      <div className="space-y-2 mb-3">

                        <label className="ti-form-label mb-2">Image1* (640x480 pixels)</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="image1"
                          className="my-auto ti-form-input"
                          onChange={(e) => handleImageChange(e, 1)}
                        />
                        {imagePreviews.image1 && (
                          <img
                            src={imagePreviews.image1}
                            alt="Image Preview"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        {!imagePreviews.image1 && oldImages.image1 && (
                          <img
                            src={`${config.imageUrl + oldImages.image1.name}`}
                            alt="image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        <span className="text-red-500 text-sm">
                          {validationErrors.image1}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">

                        <label className="ti-form-label mb-2">Image 2 (640x480 pixels)</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="image2"
                          className="my-auto ti-form-input"
                          onChange={(e) => handleImageChange(e, 2)}
                        />
                        {imagePreviews.image2 && (
                          <img
                            src={imagePreviews.image2}
                            alt="Image Preview"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        {!imagePreviews.image2 && oldImages.image2 && (
                          <img
                            src={`${config.imageUrl + oldImages.image2.name}`}
                            alt="image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}

                      </div>

                      <div className="space-y-2 mb-3">

                        <label className="ti-form-label mb-2">Image 3 (640x480 pixels)</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="image3"
                          className="my-auto ti-form-input"
                          onChange={(e) => handleImageChange(e, 3)}
                        />
                        {imagePreviews.image3 && (
                          <img
                            src={imagePreviews.image3}
                            alt="Image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        {!imagePreviews.image3 && oldImages.image3 && (
                          <img
                            src={`${config.imageUrl + oldImages.image3.name}`}
                            alt="image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}

                      </div>

                      <div className="space-y-2 mb-3">

                        <label className="ti-form-label mb-2">Image 4 (640x480 pixels)</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="image4"
                          className="my-auto ti-form-input"
                          onChange={(e) => handleImageChange(e, 4)}
                        />
                        {imagePreviews.image4 && (
                          <img
                            src={imagePreviews.image4}
                            alt="Image Preview"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        {!imagePreviews.image4 && oldImages.image4 && (
                          <img
                            src={`${config.imageUrl + oldImages.image4.name}`}
                            alt="image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}

                      </div>

                      <div className="space-y-2 mb-3">

                        <label className="ti-form-label mb-2">Image 5 (640x480 pixels)</label>
                        <input
                          accept="image/x-png,image/gif,image/jpeg,image/webp"
                          type="file"
                          name="image5"
                          className="my-auto ti-form-input"
                          onChange={(e) => handleImageChange(e, 5)}
                        />
                        {imagePreviews.image5 && (
                          <img
                            src={imagePreviews.image5}
                            alt="Image Preview"
                            style={{ maxWidth: "200px" }}
                          />
                        )}
                        {!imagePreviews.image5 && oldImages.image5 && (
                          <img
                            src={`${config.imageUrl + oldImages.image5.name}`}
                            alt="image"
                            style={{ maxWidth: "200px" }}
                          />
                        )}

                      </div>

                      

                      {/* Sizes section start */}
                      <div className="space-y-1 mb-3">
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
                          <option value="0" selected={isSizeAvailable == 0 ? true : false}>Only available in single size</option>
                          <option value="1" selected={isSizeAvailable == 1 ? true : false}>Quantity based on sizes</option>
                        </select>
                      </div>
                      {defaultQty ? (
                        <div className="space-y-2 mb-3">
                          <label className="ti-form-label mb-2">Quantity</label>
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
                        <div className="space-y-2 mb-3">
                          <label className="ti-form-label mb-2">
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
                              <tbody>
                              
                                {form.categoryId != "" ?
                                  categorySizes?.map((item) =>
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
                                          defaultValue={item.quantity}
                                          id={`qtyInput_${item.id}`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="my-auto ti-form-input"
                                          placeholder="0"
                                          defaultValue={item.onSizePrice}
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

                     

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">
                        Specifications
                        </label>
                        <textarea
                          className="my-auto ti-form-input"
                          placeholder="specifications"
                          name="specification"
                          value={form.specification}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">Highlights</label>
                        <textarea
                          className="my-auto ti-form-input"
                          placeholder="Highlights"
                          name="highlights"
                          value={form.highlights}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2">Warnings</label>
                        <textarea
                          className="my-auto ti-form-input"
                          placeholder="Warnings"
                          name="warnings"
                          value={form.warnings}
                          onChange={handleChange}
                        ></textarea>
                      </div>


                      <div className="space-y-2 mb-3">
                        <label className="ti-form-label mb-2"> User Manual</label>
                        <textarea
                          className="my-auto ti-form-input"
                          placeholder="user manual"
                          name="userManual"
                          value={form.userManual}
                          onChange={handleChange}
                        ></textarea>
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

export default EditProduct;
