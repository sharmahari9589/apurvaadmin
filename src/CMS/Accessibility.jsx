import React, { useEffect, useState } from "react";
import Sidebar from "../directives/sidebar";
import Header from "../directives/header";
import Footer from "../directives/footer";
import { getaccessibilityAction, updateAccessibilityAction } from "../Action/user.action";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './accessibility.css';
import Togglesidebar from "../directives/togglesidebar";

const Accessibility = () => {
    const [accessibilityData, setAccessibilityData] = useState({ accessibility: "" });
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [accessibilityId, setAccessibilityId] = useState("");

    useEffect(() => {
        getAccessibilityData();
    }, []);

    const handleAccessibilityChange = (newEditorState) => {
        setEditorState(newEditorState);
        const contentState = newEditorState.getCurrentContent();
        const contentHtml = convertToRaw(contentState);
        setAccessibilityData({ accessibility: contentHtml });
    };
    // get Accessibility Data----------------------
    const getAccessibilityData = async () => {
        try {
            const res = await getaccessibilityAction();
            if (res.success) {
                setAccessibilityData({ accessibility: res.data.accessibility });
                setAccessibilityId(res.data.id);
                const contentState = ContentState.createFromBlockArray(convertFromHTML(res.data.accessibility));
                setEditorState(EditorState.createWithContent(contentState));
            } else {
                console.error("API Request Failed:", res.msg);
            }
        } catch (error) {
            console.error("An error occurred while getting the accessibility data:", error);
        }
    };
    // Edit Accessibility Data---------------------
    const handleSave = async () => {
        try {
            const contentState = editorState.getCurrentContent();
            const updatedAccessibility = contentState.getPlainText();
            const data = {
                accessibility: updatedAccessibility,
                id: accessibilityId,
            };
            const res = await updateAccessibilityAction(data);
            if (res.success) {
                getAccessibilityData();
                toast.success("Accessibility data updated successfully");
            } else {
                toast.error("Failed to update accessibility data");
            }
        } catch (error) {
            console.error("An error occurred while saving the accessibility data:", error);
        }
    }
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
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">
                            <div>
                                <h3 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                                    Accessibility Main
                                </h3>
                            </div>
                            <button className="fas fa-edit btn btn-primary" onClick={handleSave}> Save </button>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Accessibility</h5>
                                    </div>
                                    <div className="box-body">
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={handleAccessibilityChange}
                                            editorClassName="accessibility"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default Accessibility;
