import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import toast, { Toaster } from "react-hot-toast"; // Ensure you have this import
import { baseurl } from "../../config/config";
import { getPromoCodeAction, updatePromoCodeAction } from "../../Action/user.action";

const EditPromocode = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        promoCode: "",
        discount: "",
        validFrom: "",
        validTo: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        promoCode: "",
        discount: "",
        validFrom: "",
        validTo: "",
    });

    const givenDateString = '9999-12-31';
     const maxDate = new Date(givenDateString).toISOString().split('T')[0];


   const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchPromoCode = async () => {
            try {
                const res = await getPromoCodeAction();
                const matchData = res.promoCode?.find(item => item.id == id);
                console.log('matchData', matchData);
                if (matchData) {
                    setFormData({
                        promoCode: matchData.promoCode,
                        discount: matchData.discount,
                        validFrom: formatDateForInput(matchData.validFrom),
                        validTo: formatDateForInput(matchData.validTo),
                    });
                }
            } catch (error) {
                console.error("An error occurred while fetching Promo Code:", error);
            }
        };

        fetchPromoCode();
    }, [id]);

    const formatDateForInput = (dateString) => {
        const dateObject = new Date(dateString);
        
        const timezoneOffset = dateObject.getTimezoneOffset();
        dateObject.setMinutes(dateObject.getMinutes() - timezoneOffset);
    
        const formattedDate = dateObject.toISOString().split('T')[0]; 
        return formattedDate;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = "";
        switch (name) {
            case "promoCode":
                errorMessage = value.trim() === "" ? "Promo code is required" : "";
                break;
            case "discount":
                errorMessage = value === "" ? "Discount is required" : "";
                break;
            case "validFrom":
                errorMessage = value === "" ? "Please select offer start date" : "";
                break;
            case "validTo":
                errorMessage = value === "" ? "Please select offer end date" : "";
                break;
            default:
                break;
        }

        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {
            promoCode: "",
            discount: "",
            validFrom: "",
            validTo: "",
        };

        errors.promoCode = formData.promoCode.trim() === "" ? "Promo Code is required" : "";

        errors.discount = formData.discount === "" ? "Discount is required" : "";

        errors.validFrom = formData.validFrom === "" ? "Valid From date is required" : "";

        errors.validTo = formData.validTo === "" ? "Valid To date is required" : "";

        setValidationErrors(errors);

        isValid = Object.values(errors).every((error) => error === "");
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        let data = {
            ...formData,
            id: id
        }

        try {
            const res = await updatePromoCodeAction(data);
            if (res.success) {
                console.log(res)
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.href = `${baseurl}promocode`;
                }, 1200);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("An error occurred while updating Promo Code:", error);
        }
    };

    return (
        <>
            <div className="page">
                <Sidebar />
                <Header />
                <Toaster />
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">
                            <div>
                                <h3 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                                    Edit Promo Code
                                </h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <form onSubmit={handleSubmit}>
                                    {/* Promo Code */}
                                    <div className="mb-4">
                                        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-600">
                                            Promo Code
                                        </label>
                                        <input
                                            type="text"
                                            id="promoCode"
                                            name="promoCode"
                                            value={formData.promoCode}
                                            onChange={handleChange}
                                            className="mt-1 p-2 border rounded-md w-full"
                                            required

                                        />
                                        <span className="text-red-500 text-sm">{validationErrors.promoCode}</span>
                                    </div>

                                    {/* Discount */}
                                    <div className="mb-4">
                                        <label htmlFor="discount" className="block text-sm font-medium text-gray-600">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            id="discount"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            className="mt-1 p-2 border rounded-md w-full"
                                            required
                                        />
                                        <span className="text-red-500 text-sm">{validationErrors.discount}</span>
                                    </div>

                                    {/* Valid From */}
                                    <div className="mb-4">
                                        <label htmlFor="validFrom" className="block text-sm font-medium text-gray-600">
                                            Valid From
                                        </label>
                                        <input
                                            type="date"
                                            id="validFrom"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleChange}
                                            className="mt-1 p-2 border rounded-md w-full"
                                            required
                                            min={currentDate}
                                            max={maxDate}
                                        />
                                        <span className="text-red-500 text-sm">{validationErrors.validFrom}</span>
                                    </div>

                                    {/* Valid To */}
                                    <div className="mb-4">
                                        <label htmlFor="validTo" className="block text-sm font-medium text-gray-600">
                                            Valid To
                                        </label>
                                        <input
                                            type="date"
                                            id="validTo"
                                            name="validTo"
                                            value={formData.validTo}
                                            onChange={handleChange}
                                            className="mt-1 p-2 border rounded-md w-full"
                                            required
                                            min={formData.validFrom}
                                            max={maxDate}
                                        />
                                        <span className="text-red-500 text-sm">{validationErrors.validTo}</span>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-4">
                                        <button type="submit" className="ti-btn ti-btn-primary">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default EditPromocode;
