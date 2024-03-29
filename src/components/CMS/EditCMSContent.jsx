import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";
import { getCMSContentByIdAction, updateCMSContentAction } from "../../Action/user.action";
import { ToastContainer, toast } from "react-toastify";

const EditCMSContent = () => {
    const { id } = useParams();
    const [listing, setListing] = useState([]);
    const [editorState, setEditorState] = useState('');
    const [title, setTitle] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        getListingDetails();
    }, []);

    const getListingDetails = async () => {
        try {
            console.log(id)
            const res = await getCMSContentByIdAction();
            console.log(res)
            if (res.success) {
                let data = res.data;
                const selectedItem = data.find((item) => item.id == id);
                setTitle(selectedItem.title || '');
                setEditorState(selectedItem.description || '');
                setListing(data.filter((item) => item.id == id));
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const data = {
                description: editorState,
                id: id,
                title: title,
            };

            const errors = {};

            if (data.description === "") {
                errors.description = "Description is required";
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                clearValidationErrors();

                const res = await updateCMSContentAction(data);
                if (res.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });

                    getListingDetails();
                } else {
                    toast.error("Failed to update accessibility data");
                }
            }
        } catch (error) {
            console.error("An error occurred while saving the accessibility data:", error);
        }
    };

    const handleCMSChange = (newContent) => {
        setEditorState(newContent);
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
                                    <h5 className="box-title">Edit CMS Content</h5>
                                </div>
                                <div className="box-body">
                                    <form>
                                        <div className="space-y-4">

                                            <div className="space-y-2">
                                                <label className="ti-form-label mb-2">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className="my-auto ti-form-input"
                                                    name="title"
                                                    placeholder="Enter title name"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="ti-form-label mb-2">
                                                    Description
                                                </label>
                                                <JoditEditor
                                                    value={editorState}
                                                    onChange={handleCMSChange}
                                                    editorClassName="CMSdata"
                                                />
                                                {validationErrors.description && <span className="text-red-500 text-sm">{validationErrors.description}</span>}
                                            </div>

                                        </div>
                                        <button type="button" className="ti-btn ti-btn-primary" onClick={handleUpdate}>
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

export default EditCMSContent;
