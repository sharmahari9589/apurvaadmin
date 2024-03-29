import {
  PutRequest,
  deleteRequest,
  getRequest,
  postRequest,
  postRequestFormData,
  putRequestFormData
} from "../helper";

export const LoginAction = (data) => {
  return postRequest("adminLogin", data).then((res) => {
    return res.data;
  });
};

//-------------------------------|| DASHBOARD ||---------------------------------

export const getDashboardStatisticsAction = (data) => {
  return getRequest("getDashboardStatistics", data).then((res) => {
    return res?.data;
  });
};

// bannerImages section ------------------------------------------


// bannerImages section ------------------------------------------
export const addBannerImagesAction = (data) => {
  return postRequestFormData("uploadBannerImages", data).then((res) => {
    return res.data;
  });
};

export const getImageAction = (data) => {
  return getRequest("getBannerImages", data).then((res) => {
    return res.data;
  });
};


export const imageStatusUpdateAction = (data) => {
  return PutRequest("updateBannerStatus", data).then((res) => {
    return res.data;
  });
};

export const imageDeleteAction = (data) => {
  return PutRequest("deleteBannerImage", data).then((res) => {
    return res.data;
  });
};
// Category Section-----------------------------------------------------------

export const getCategoryAction = (data) => {
  return getRequest("getCategoryList", data).then((res) => {
    return res.data;
  });
};

export const addCategoryAction = (data) => {
  return postRequestFormData("addCategory", data).then((res) => {
    return res.data;
  });
};
export const UpdateCategoryAction = (data) => {
  return putRequestFormData("updateCategory", data).then((res) => {
    return res.data;
  });
};

export const categoryStatusUpdateAction = (data) => {
  return PutRequest("categoryStatusUpdate", data).then((res) => {
    return res.data;
  });
};

export const subCategoryStatusUpdateAction = (data) => {
  return PutRequest("subCategoryStatusUpdate", data).then((res) => {
    return res.data;
  });
};

// Sub-Category Section---------------------------------------------------------
export const getSubCategoryAction = (data) => {
  return getRequest("getSubCategoryList", data).then((res) => {
    return res.data;
  });
};

export const addSubCategoryAction = (data) => {
  return postRequestFormData("addSubCategory", data).then((res) => {
    return res.data;
  });
};

export const UpdateSubCategoryAction = (data) => {
  return putRequestFormData("updateSubCategory", data).then((res) => {
    return res.data;
  });
};

// Sub-Inner-Category Section---------------------------------------------------
export const getInnerCategoryAction = (data) => {
  return getRequest("getInnerCategoryList", data).then((res) => {
    return res.data;
  });
};

export const addInnerCategoryAction = (data) => {
  return postRequest("insertInnerCategory", data).then((res) => {
    return res.data;
  });
};

export const UpdateInnerCategoryAction = (data) => {
  return PutRequest("updateInnerCategory", data).then((res) => {
    return res.data;
  });
};

// Delivery charges and taxes Section---------------------------------------------------

export const getDeliverAndTaxListAction = (data) => {
  return getRequest("getDeliverAndTaxList", data).then((res) => {
    return res.data;
  });
};

export const insertDeliverAndTaxAction = (data) => {
  return postRequest("insertDeliverAndTax", data).then((res) => {
    return res.data;
  });
};

export const updateDeliveryAndTaxAction = (data) => {
  return PutRequest("updateDeliveryAndTax", data).then((res) => {
    return res.data;
  });
};


export const updateDeliverAndTaxStatusAction = (data) => {
  return PutRequest("updateDeliverAndTaxStatus", data).then((res) => {
    return res.data;
  });
};

// Product Type-Category Section--------------------------------------------------------

export const insertProductTypeAction = (data) => {
  return postRequest("insertProductType", data).then((res) => {
    return res.data;
  });
};

export const getProductTypeListAction = (data) => {
  return getRequest("getProductTypeList", data).then((res) => {
    return res.data;
  });
};

export const getInnerCategoryListAction = (data) => {
  return getRequest("getInnerCategoryList", data).then((res) => {
    return res.data;
  });
};

export const updateProductTypeAction = (data) => {
  return PutRequest("updateProductType", data).then((res) => {
    return res.data;
  });
};

export const updateProductTypeStatusAction = (data) => {
  return PutRequest("updateProductTypeStatus", data).then((res) => {
    return res.data;
  });
};


export const productStatusUpdateAction = (data) => {
  return PutRequest("productStatusUpdate", data).then((res) => {
    return res.data;
  });
};

export const productPopularUpdateAction = (data) => {
  return PutRequest("productPopularityUpdate", data).then((res) => {
    return res.data;
  });
};


// Sub-Inner-Category Section---------------------------------------------------

export const innerCategoryStatusUpdateAction = (data) => {
  return PutRequest("innerCategoryStatusUpdate", data).then((res) => {
    return res.data;
  });
};

//----------------------------------|| PRODUCTS ||------------------------------------------

export const getProductListAction = (data) => {
  return getRequest("getProductList", data).then((res) => {
    return res.data;
  });
};


export const getProductListByNameAction = (data) => {
  return postRequest("getProductListByName", data).then((res) => {
    return res.data;
  });
};


export const getBrandListAction = (data) => {
  return getRequest("getBrandList", data).then((res) => {
    return res.data;
  });
};

export const addProductAction = (data) => {
   return postRequestFormData('addProduct', data).then(res => { return res.data })
}

export const updateProductAction = (data) => {
  return putRequestFormData('updateProduct', data).then(res => { return res.data })
}

export const getProductByIdAndColorProductIdAction = (data) => {
  return getRequest("getProductByIdAndColorProductId", data).then((res) => {
    return res.data;
  });
};

// CMS modal ---------------------------------------------

// terms of promotions---------------
export const getTermsOfPromotionAction = (data) => {
  return getRequest("getTermsOfPromotion", data).then((res) => {
    return res.data;
  });
};
export const InsertTermsofPromotionAction = (data) => {
  return postRequest("insertTermsOfPromotionData", data).then((res) => {
    return res.data;
  });
};
export const UpdateTermsofPromotionAction = (data) => {
  return PutRequest("updateTermsOfPromotion", data).then((res) => {
    return res.data;
  });
};
export const DeleteProductAction = (data) => {
  return deleteRequest("deleteTermsOfPromotion", data).then((res) => {
    return res.data;
  });
};
// accessibility section---------------
export const getaccessibilityAction = (data) => {
  return getRequest("getAccessibility", data).then((res) => {
    return res.data;
  });
};
export const updateAccessibilityAction = (data) => {
  return PutRequest("updateAccessibility", data).then((res) => {
    return res.data;
  });
};

export const getUsersListAction = (data) => {
  return getRequest("getUserList", data).then((res) => {
    return res.data;
  });
};


export const getUsersListByNemAction = (data) => {

  return postRequest("getUserByName", {data}).then((res) => {
    return res.data;
  });
};

export const getVendorsListAction = (data) => {
  return getRequest("getVendorList", data).then((res) => {
    return res.data;
  });
};

export const vendorStatusUpdateAction = (data) => {
  return PutRequest(`vendorStatusUpdate`,data).then((res) => {
    return res.data;
  });
};

export const vendorDeleteAction = async(data) => {
  let res = getRequest(`/deleteVendor/${data}`);
  return res;
 
};


export const addVendorAction = (data) => {
  return postRequest(`addVendor`,data).then((res) => {
    return res.data;
  });
};

export const updateVendorAction = (data) => {
  return PutRequest(`updateVendor`,data).then((res) => {
    return res.data;
  });
};


export const userStatusUpdateAction = (data) => {
  return PutRequest(`userStatusUpdate`,data).then((res) => {
    return res.data;
  });
};

//--------------------|| SIZE ||------------------------

export const getProductSizeListAction = (data) => {
  return getRequest("getProductSizeList", data).then((res) => {
    return res.data;
  });
};

export const addProductSizeAction = (data) => {
  return postRequest("addProductSize", data).then((res) => {
    return res.data;
  }); 
};

export const updateSizeStatusAction = (data) => {
  return PutRequest("updateSizeStatus", data).then((res) => {
    return res.data;
  });
};


export const getRegionListAction = (data) => {
  return getRequest("getRegionList", data).then((res) => {
    return res.data;
  });
};

export const updateProductSizeAction = (data) => {
  return PutRequest(`updateProductSize`,data).then((res) => {
    return res.data;
  });
};

//--------------------|| BRANDS ||------------------------


export const insertBrandNameAction = (data) => {
  return postRequest("insertBrandName", data).then((res) => {
    return res.data;
  });
};

export const updateBrandNameAction = (data) => {
  return PutRequest("updateBrandName", data).then((res) => {
    return res.data;
  });
};

export const updateBrandStatusAction = (data) => {
  return PutRequest("updateBrandStatus", data).then((res) => {
    return res.data;
  });
};


//--------------------|| REGIONS ||------------------------

export const insertRegionNameAction = (data) => {
  return postRequestFormData("insertRegionName", data).then((res) => {
    return res.data;
  });
};

export const updateRegionNameAction = (data) => {
  return putRequestFormData("updateRegionName", data).then((res) => {
    return res.data;
  });
};

export const updateRegionStatusAction = (data) => {
  return PutRequest("updateRegionStatus", data).then((res) => {
    return res.data;
  });
};


//----------------------------------|| PRODUCT COMBINATION ||------------------------------------------

export const getCombinationListAction = (data) => {
  return getRequest("getCombinationList", data).then((res) => {
    return res.data;
  });
};

export const getCombinationListByIdAction = (data) => {
  return getRequest("getCombinationListById", data).then((res) => {
    return res.data;
  });
};

export const insertItemCombinationAction = (data) => {
   return postRequestFormData('insertItemCombination', data).then(res => { return res.data })
}

export const updateItemCombinationAction = (data) => {
  return putRequestFormData("updateItemCombination", data).then((res) => {
    return res.data;
  });
};

export const combninationStatusUpdateAction = (data) => {
  return PutRequest("combninationStatusUpdate", data).then((res) => {
    return res.data;
  });
};


//----------------------------------|| ADMIN PROFILE ||------------------------------------------

export const adminChangePasswordAction = (data) => {
  return PutRequest("adminChangePassword", data).then((res) => {
    return res.data;
  });
};

//----------------------------------|| PROMOCODE ||------------------------------------------


export const getPromoCodeAction = (data) => {
  return getRequest("getPromoCode", data).then((res) => {
    return res.data;
  });
};

export const insertPromoCodeAction = (data) => {
  return postRequest("insertPromoCode", data).then((res) => {
    return res.data;
  });
};


export const deletePromoCodeAction = (data) => {
  return postRequest("deletePromocode", data).then((res) => {
    return res.data;
  });
};

export const updatePromoCodeAction = (data) => {
  return PutRequest("updatePromoCode", data).then((res) => {
    return res.data;
  });
};

export const updatePromoCodeStatusAction = (data) => {
  return PutRequest("updatePromoCodeStatus", data).then((res) => {
    return res.data;
  });
};

//----------------------------------|| ORDER ||------------------------------------------

export const getOrderListAction = (data) => {
  return getRequest("getOrderList", data).then((res) => {
    return res.data;
  });
};


export const updateOrderStatusAction = (data) => {
  return PutRequest(`updateOrderStatus`,data).then((res) => {
    return res.data;
  });
};

export const updateOrderStatusWithCommentAction = (data) => {
  return postRequest(`updateOrderStatusWithComment`,data).then((res) => {
    return res.data;
  });
};

export const updateCancelReasonAction  = (data) => {
  return PutRequest(`updateCancelReason`,data).then((res) => {
    return res.data;
  });
};

export const cancelThisOrderAction  = (data) => {
  return postRequest(`cancelThisOrder`,data).then((res) => {
    return res.data;
  });
};

export const getOrderDetailsByIdAction = (data) => {
  return getRequest("getOrderDetailsById", data).then((res) => {
    return res.data;
  });
};

export const getCancelAndReturnListAction = (data) => {
  return getRequest("getCancelAndReturnList", data).then((res) => {
    return res.data;
  });
};

export const updateCancelAndReturnStatusAction = (data) => {
  return PutRequest(`updateCancelAndReturnStatus`,data).then((res) => {
    return res.data;
  });
};

export const updateOrderStatusToRejectAction = (data) => {
  return PutRequest(`updateOrderStatusToReject`,data).then((res) => {
    return res.data;
  });
};
// get Cancel And Return List by Id Action
export const getCancelAndReturnListIdAction=(data)=>{
  return getRequest("getCancelAndReturnDetailById",data).then((res)=>{
    return res.data;
  });
};


export const getSupplierListAction=(data)=>{
  return getRequest("getSupplierList",data).then((res)=>{
    return res.data;
  });
};

export const updateSupplierDetailAction = (data) => {
  return PutRequest(`updateSupplierDetail`,data).then((res) => {
    return res.data;
  });
};


export const getCMSPagesAction=(data)=>{
  return getRequest("getCMSPages",data).then((res)=>{
    return res.data;
  });
};

export const insertCMSPagesAction=(data)=>{
  return postRequest("insertCMSPages",data).then((res)=>{
    return res.data;
  });
};

export const updateCMSPagesAction=(data)=>{
  return PutRequest("updateCMSPages",data).then((res)=>{
    return res.data;
  });
};

export const updatePagesStatusAction=(data)=>{
  return PutRequest("updatePagesStatus",data).then((res)=>{
    return res.data;
  });
};


export const getCMSContentByIdAction=(data)=>{
  return getRequest("getCMSContentById",data).then((res)=>{
    return res.data;
  });
};
// insert cms content 
export const insertCMSContentAction=(data)=>{
  return postRequest("insertCMSContent",data).then((res)=>{
    return res.data;
  })
}

export const updateCMSContentAction=(data)=>{
  return PutRequest("updateCMSContent",data).then((res)=>{
    return res.data;
  });
};

export const getContactUsListAction=(data)=>{
  return getRequest("getContactUsList",data).then((res)=>{
    return res.data;
  });
};

export const getFeedbackListAction=(data)=>{
  return getRequest("getFeedbackList",data).then((res)=>{
    return res.data;
  });
};

export const insertFeedbackListAction=(data)=>{
  return postRequestFormData("insertFeedback",data).then((res)=>{
    return res.data;
  });
};




export const updateFeedbackListAction=(data)=>{
  return postRequest("/updateFeedStatus",data).then((res)=>{
    return res.data;
  });
};


export const updateFeedbacContentAction=(data)=>{
  return postRequest("/updateFeedback",data).then((res)=>{
    return res.data;
  });
};



export const deleleteFeedbackListAction=(data)=>{
  return postRequest("/deleteFeedStatus",data).then((res)=>{
    return res.data;
  });
};




export const getContactUsDetailByIdAction=(data)=>{
  return getRequest("getContactUsDetailById",data).then((res)=>{
    return res.data;
  });
};