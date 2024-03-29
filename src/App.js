import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import config from "./config/config";
import Login from "./components/signin";
import Dashboard from "./components/dashboard";
import Category from "./components/categories/category";
import SubCategory from "./components/categories/subCategory";
import InnerSubCategory from "./components/categories/innerSubCategory";
import ProductType from "./components/categories/productType";
import ProductList from "./components/product/ProductList";
import AddProduct from "./components/product/AddProduct";
import EditProduct from "./components/product/EditProduct";
import TermsOfPromotion from "./CMS/termsOfPromotion";
import Accessibility from "./CMS/Accessibility";
import Users from "./components/users/users";
import Size from "./components/size/Size";
import Brand from './components/brand/Brand'
import Region from "./components/region/Region";
import CombinationList from "./components/ItemCombination/CombinationList";
import AddCombination from "./components/ItemCombination/AddCombination";
import Changepassword from "./components/AdminProfile/changepassword"
import EditCombination from "./components/ItemCombination/EditCombination";
import Promocode from "./components/Promocode/Promocode";
import AddPromocode from "./components/Promocode/AddPromocode";
import EditPromocode from "./components/Promocode/EditPromocode";
import Order from "./components/Order/Order";
import DeliveryAndTax from "./components/DeliveryAndTax/DeliveryAndTax";
import CancelAndReturn from "./components/cancelAndReturn/CancelAndReturn";
import Togglesidebar from "./directives/togglesidebar";
import Supplier from './components/Supplier/Supplier'
import CMS from './components/CMS/CMS'
import CMSContentList from "./components/CMS/CMSContentList";
import ContactUs from "./components/CMS/ContactUs";
import Feedback from "./components/feedback/Feedback";
import AddCMSContent from './components/CMS/AddCMSContent'
import EditCMSContent from "./components/CMS/EditCMSContent";
import Vendors from "./components/users/vendors";
import BannerImage from "./components/bannerImage/bannerImage";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`${config.baseurl}`} element={<Login />} />
          <Route path={`${config.baseurl}dashboard`} element={<Dashboard />} />
          <Route path={`${config.baseurl}Category`} element={<Category />} />
          <Route path={`${config.baseurl}Subcategory`} element={<SubCategory />}/>
          <Route path={`${config.baseurl}InnerSubcategory`} element={<InnerSubCategory />}/>
          <Route path={`${config.baseurl}productType`} element={<ProductType />}/>
          <Route path={`${config.baseurl}productList`} element={<ProductList />}/>
          <Route path={`${config.baseurl}addProduct`} element={<AddProduct />}/>
          <Route path={`${config.baseurl}editProduct/:id`} element={<EditProduct />}/>
          <Route path={`${config.baseurl}TermsOfPromotion`} element={<TermsOfPromotion />}/>
          <Route path={`${config.baseurl}Accessibility`} element={<Accessibility />} />
          <Route path={`${config.baseurl}Users`} element={<Users />} />
          <Route path={`${config.baseurl}Vendors`} element={<Vendors />} />
          <Route path={`${config.baseurl}bannerImage`} element={<BannerImage />} />
          <Route path={`${config.baseurl}size`} element={<Size />} />
          <Route path={`${config.baseurl}brand`} element={<Brand />} />
          <Route path={`${config.baseurl}regions`} element={<Region />} />
          <Route path={`${config.baseurl}combinationlist`} element={<CombinationList />} />
          <Route path={`${config.baseurl}addcombination`} element={<AddCombination />} />
          <Route path={`${config.baseurl}changepassword`} element={<Changepassword />} />
          <Route path={`${config.baseurl}editcombination/:id`} element={<EditCombination />} />
          <Route path={`${config.baseurl}promocode`} element={<Promocode />} />
          <Route path={`${config.baseurl}addpromocode`} element={<AddPromocode />} />
          <Route path={`${config.baseurl}editpromocode/:id`} element={<EditPromocode />} />
          <Route path={`${config.baseurl}order`} element={<Order />} />
          <Route path={`${config.baseurl}deliveryandtax`} element={<DeliveryAndTax />} />
          <Route path={`${config.baseurl}cancelandreturnorder`} element={<CancelAndReturn />} />
          <Route path={`${config.baseurl}togglesidebar`} element={<Togglesidebar />} />
          <Route path={`${config.baseurl}supplier`} element={<Supplier />} />
          <Route path={`${config.baseurl}cms`} element={<CMS />} />
          <Route path={`${config.baseurl}cmscontentlist/:id`} element={<CMSContentList />} />
          <Route path={`${config.baseurl}contactus`} element={<ContactUs />} />
          <Route path={`${config.baseurl}feedback`} element={<Feedback />} />
          <Route path={`${config.baseurl}addcmscontent/:id`} element={<AddCMSContent />} />
          <Route path={`${config.baseurl}editcmscontent/:id`} element={<EditCMSContent />} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
