import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";
import { insertCMSContentAction } from "../../Action/user.action";
import { ToastContainer, toast } from "react-toastify";
import { baseurl } from "../../config/config";


const AddCMSContent = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [CMSdata, setCmsData] = useState({ CMSdata: "" });
    const [validationErrors, setValidationErrors] = useState({});
    var pathArray = window.location.pathname.split("/");
    var page = pathArray[3];

    const handleSave = async () => {
        try {
            const data = {
                description: CMSdata.CMSdata, // Use CMSdata.CMSdata
                pageId: page,
                title: title,
            };

            const errors = {};

            if (!data.description || data.description.trim() === "") {
                errors.description = "Description is required";
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                clearValidationErrors();

                const res = await insertCMSContentAction(data);
                if (res.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    clearValidationErrors();
                    setTimeout(() => {
                        window.location.href = `${baseurl}cmscontentlist/`+ page;
                      }, 1200);

                    // Clear validation errors after successful insert
                    
                } else {
                    toast.error("Failed to save CMS content");
                }
            }
        } catch (error) {
            console.error("An error occurred while saving the CMS content:", error);
        }
    };

    const handleCMSChange = (newContent) => {
        setCmsData({ CMSdata: newContent });
        clearValidationErrors(); // Clear validation errors when content changes
    };

    const clearValidationErrors = () => {
        setValidationErrors({});
    };

    return (
        <>
            <div className="page">
                <Sidebar />
                <Header />
                <div className="content">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="col-span-12">
                            <div className="box fields">
                                <div className="box-header">
                                    <h5 className="box-title">Add CMS Content</h5>
                                </div>
                                <div className="box-body">
                                    <form>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                                    id="exampleFormControlInput1"
                                                    placeholder="Enter title name "
                                                    onChange={(e) => { setTitle(e.target.value) }}
                                                />
                                                {validationErrors.title && <div className="invalid-feedback">{validationErrors.title}</div>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="ti-form-label mb-2">
                                                    Description
                                                </label>
                                                <JoditEditor
                                                     value={CMSdata.CMSdata} 
                                                     onChange={handleCMSChange}
                                                />
                                                {validationErrors.description && <span className="text-red-500 text-sm">{validationErrors.description}</span>}
                                            </div>
                                        </div>
                                        <button type="button" className="ti-btn ti-btn-primary" onClick={handleSave}>
                                            Save
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <ToastContainer />
        </>
    );
};

export default AddCMSContent;
