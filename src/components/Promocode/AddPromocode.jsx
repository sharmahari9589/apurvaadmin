import React, { useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import config from '../../config/config';
import toast, { Toaster } from "react-hot-toast";
import { baseurl } from "../../config/config";
import { getUsersListByNemAction, insertPromoCodeAction } from '../../Action/user.action';
import Togglesidebar from "../../directives/togglesidebar";
import { trim } from "jquery";

const AddPromocode = () => {

    const [formData, setFormData] = useState({
        promoCode: "",
        discount: "",
        validFrom: "",
        validTo: "",
        applyFor: "all",
        userId : null
    });
    const [list, setList] = useState([]);
    const [name,setName] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        promoCode: "",
        discount: "",
        validFrom: "",
        validTo: "",
    });

    const givenDateString = '9999-12-31';
    const maxDate = new Date(givenDateString).toISOString().split('T')[0];
    let currDate = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSearch = async (e) => {
        const inputValue = e.target.value.trim(); // Trim leading and trailing whitespace
        if (inputValue === '') {
            setList([]); 
            return;
        }
        let res = await getUsersListByNemAction(trim(e.target.value)
        );
        setList(res.data)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const res = await insertPromoCodeAction(formData);
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.href = `${baseurl}promocode`;
            }, 1200);
        } else {
            toast.error(res.msg);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {
            promoCode: "",
            discount: "",
            validFrom: "",
            validTo: "",
        };

        if (formData.promoCode.trim() === "") {
            errors.promoCode = "Promo code is required";
            isValid = false;
        }

        if (formData.discount.trim() === "") {
            errors.discount = "Discount is required";
            isValid = false;
        }

        if (formData.validFrom.trim() === "") {
            errors.validFrom = "Please select offer start date";
            isValid = false;
        }

        if (formData.validTo.trim() === "") {
            errors.validTo = "Please select offer end date";
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };



    // Function to handle clicking on an item
    const handleClick = (itemId,fullName) => {
       formData.userId = itemId; 
        setName(fullName)
        setList([])
        document.getElementById('nameinput').value=fullName;
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
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box-header">
                                    <h5 className="box-title">Add Promo Code</h5>
                                </div>
                                <div className="box-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-600 mb-2">
                                                Promo Code
                                            </label>
                                            <input
                                                type="text"
                                                id="promoCode"
                                                name="promoCode"
                                                placeholder="Promo Code"
                                                value={formData.promoCode}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                            <span className="text-red-500 text-sm">{validationErrors.promoCode}</span>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="discount" className="block text-sm font-medium text-gray-600 mb-2">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                id="discount"
                                                name="discount"
                                                placeholder="Discount (%)"
                                                value={formData.discount}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-md w-full"
                                            />
                                            <span className="text-red-500 text-sm">{validationErrors.discount}</span>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="validFrom" className="block text-sm font-medium text-gray-600 mb-2">
                                                Valid From
                                            </label>
                                            <input
                                                type="date"
                                                id="validFrom"
                                                name="validFrom"
                                                value={formData.validFrom}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded-md w-full"
                                                min={currDate}
                                                max={maxDate}

                                            />
                                            <span className="text-red-500 text-sm">{validationErrors.validFrom}</span>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="validTo" className="block text-sm font-medium text-gray-600 mb-2">
                                                Valid To
                                            </label>
                                            <input
                                                type="date"
                                                id="validTo"
                                                name="validTo"
                                                value={formData.validTo}
                                                onChange={handleChange}
                                                min={formData.validFrom}
                                                max={maxDate}
                                                className="mt-1 p-2 border rounded-md w-full"

                                            />
                                            <span className="text-red-500 text-sm">{validationErrors.validTo}</span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Apply For
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="applyFor"
                                                    value="all"
                                                    onChange={handleChange}
                                                    className="mr-3"
                                                    defaultChecked={true}
                                                />
                                                <label className="mr-3">All</label>
                                                <input
                                                    type="radio"
                                                    name="applyFor"
                                                    value="one"
                                                    onChange={handleChange}
                                                    className="mr-3"

                                                />
                                                <label>One</label>
                                            </div>
                                        </div>

                                        {formData.applyFor === 'one' && (
                                            <div className="mb-3">
                                                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-600 mb-2">
                                                    Customer Name
                                                </label>
                                                <input
                                                id="nameinput"
                                                    type="text"
                                                    name="customer"
                                                    placeholder="Search Customer"
                                                    autoComplete="off"
                                                    onChange={(e) => handleSearch(e)}
                                                    className="mt-1 p-2 border rounded-md w-full"
                                                />
                                                <div style={{ position: 'relative' }}>
                                                    {list?.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}
                                                            onClick={() => handleClick(item.id,item.fullName)} // Call handleClick function with item id as argument
                                                        >
                                                            {/* Assuming fullName is a property of each item in list */}
                                                            <p style={{ margin: '0' }}>{item.fullName}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        )}


                                        <div className="mt-3">
                                            <button type="submit" className="ti-btn ti-btn-primary">
                                                Add Promo Code
                                            </button>
                                        </div>
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

export default AddPromocode;
