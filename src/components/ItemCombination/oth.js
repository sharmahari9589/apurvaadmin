// import React, { useState, useEffect } from "react";
// import "react-responsive-modal/styles.css";
// import "react-toastify/dist/ReactToastify.css";
// import Sidebar from "../../directives/sidebar";
// import Header from "../../directives/header";
// import config from "../../config/config";
// import Footer from "../../directives/footer";
// import toast, { Toaster } from "react-hot-toast";
// import { baseurl } from "../../config/config";
// import {
//   getCategoryAction,
//   insertItemCombinationAction,
//   getProductListAction,
// } from "../../Action/user.action";
// import Select from "react-select";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Toast } from "react-bootstrap";

// const validationSchema = Yup.object().shape({
//   categoryId: Yup.string().required("Category is required"),
//   productId: Yup.array()
//     .min(4, "Select at least four products")
//     .max(5, 'Maximum 5 products can be selected')
//     .required("Products are required"),
//   combinationImage: Yup.mixed().required("Image is required"),
// });

// const AddCombination = () => {
//   const [category, setCategory] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [selectedProductPreviews, setSelectedProductPreviews] = useState([]);
//   const [imagePreview, setImagePreview] = useState(null);

//   const formik = useFormik({
//     initialValues: {
//       categoryId: "",
//       combinationImage: "",
//       productId: [],
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {

//       values.combinationImage = values.combinationImage;
//       console.log(values.combinationImage)

//       const res = await insertItemCombinationAction(values);
//       if (res.success) {
//         toast.success(res.msg);
//         setTimeout(() => {
//           window.location.href = `${baseurl}combinationlist`;
//         }, 1200);
//       } else {
//         toast.error(res.msg);
//       }
//     },
//   });

//   const fetchCategoryList = async () => {
//     try {
//       const res = await getCategoryAction();
//       if (res.success) {
//         setCategory(res.data);
//       }
//     } catch (error) {
//       console.error("An error occurred while getting Category:", error);
//     }
//   };

//   const fetchProductList = async () => {
//     try {
//       const res = await getProductListAction();
//       if (res.success) {
//         let data = res.data;
//         setProduct(data);
//       }
//     } catch (error) {
//       console.error("An error occurred while getting Category:", error);
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedImages = e.target.files;

//     formik.handleChange(e);

//     if (selectedImages.length > 0) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(selectedImages[0]);
//     } else {
//       setImagePreview(null);
//     }
//   };



//   const handleProductChange = (selectedOptions) => {
//     formik.setFieldValue("productId", selectedOptions.map((option) => option.value));

//     const previews = selectedOptions.map((option) => {
//       const selectedProduct = product.find((p) => p.id === option.value);
//       return {
//         id: option.value,
//         image: selectedProduct.images[0].name,
//         name: selectedProduct.productName,
//       };
//     });
//     setSelectedProductPreviews(previews);
//   };


//   useEffect(() => {
//     fetchCategoryList();
//     fetchProductList();
//   }, []);

//   return (
//     <>
//       <div className="page">
//         <Sidebar />
//         <Header />
//         <Toaster />
//         <div className="content">
//           <div className="grid grid-cols-12 gap-x-6">
//             <div className="col-span-12">
//               <div className="box">
//                 <div className="box-header">
//                   <h5 className="box-title">Add Combination</h5>
//                 </div>
//                 <div className="box-body">
//                   <form onSubmit={formik.handleSubmit}>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <label className="ti-form-label mb-0">
//                           Category Name
//                         </label>
//                         <select
//                           className={`my-auto ti-form-select ${formik.touched.categoryId && formik.errors.categoryId
//                               ? "border-red-500"
//                               : ""
//                             }`}
//                           name="categoryId"
//                           onChange={formik.handleChange}
//                           onBlur={formik.handleBlur}
//                           value={formik.values.categoryId}
//                         >
//                           <option value="">Select Category</option>
//                           {category.map((item) => (
//                             <option key={item.id} value={item.id}>
//                               {item.categoryName}
//                             </option>
//                           ))}
//                         </select>
//                         {formik.touched.categoryId && formik.errors.categoryId && (
//                           <span className="text-red-500">{formik.errors.categoryId}</span>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <label className="ti-form-label mb-0">
//                           Products
//                         </label>
//                         <Select
//                           isMulti
//                           name="productId"
//                           options={product
//                             .filter((item) => item.categoryId == formik.values.categoryId)
//                             .map((item) => ({
//                               value: item.id,
//                               label: item.productName,
//                               image: item.images
//                             }))}
//                           onChange={handleProductChange}
//                         // value={formik.values.productId.map((id) => ({ value: id, label: "" }))}
//                         />
//                         {formik.touched.productId && formik.errors.productId && (
//                           <span className="text-red-500">{formik.errors.productId}</span>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <label className="ti-form-label mb-0">Selected Product Previews</label>
//                         <div className="row">
//                           {selectedProductPreviews.map((product) => (
//                             <div key={product.id} className="col-md-2">
//                               <center>
//                                 <div>
//                                   <img
//                                     src={`${config.imageUrl}${product.image}`}
//                                     alt={product.name}
//                                     style={{ width: '130px', height: '130px', borderRadius: '50px' }}
//                                   />
//                                 </div>
//                               </center>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         {imagePreview && (
//                           <div className="space-y-2">
//                             <label className="ti-form-label mb-0">Image Preview</label>
//                             <img
//                               src={imagePreview}
//                               alt="Image Preview"
//                               className="preview-image"
//                               style={{ width: "20%", height: "auto" }}
//                             />
//                           </div>
//                         )}
//                         <label className="ti-form-label mb-0">Images</label>
//                         <input
//                           accept="image/x-png,image/gif,image/jpeg,image/webp"
//                           type="file"
//                           name="combinationImage"
//                           className={`my-auto ti-form-input ${formik.touched.combinationImage && formik.errors.combinationImage
//                               ? "border-red-500"
//                               : ""
//                             }`}
//                           onChange={handleImageChange}
//                         />
//                         {formik.touched.combinationImage && formik.errors.combinationImage && (
//                           <span className="text-red-500">{formik.errors.combinationImage}</span>
//                         )}
//                       </div>
//                     </div>
//                     <button type="submit" className="ti-btn ti-btn-primary">
//                       Submit
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default AddCombination;