import React, { useEffect, useState } from "react";
import Sidebar from "../directives/sidebar";
import Header from "../directives/header";
import Footer from "../directives/footer";
import DataTable from "react-data-table-component";
import {
    DeleteProductAction,
    InsertTermsofPromotionAction,
    UpdateTermsofPromotionAction,
    getTermsOfPromotionAction,
} from "../Action/user.action";
import "react-responsive-modal/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
// import Togglesidebar from "../../directives/togglesidebar";
import Togglesidebar from "../directives/togglesidebar";

const TermsOfPromotion = () => {
    const [Termslisting, setTermslisting] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalSecond, setModalSecond] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({ question: "", answer: "", });
    const [editingItem, setEditingItem] = useState(null);
    const [editedData, setEditedData] = useState({ question: "", answer: "" });
    const [deletingItem, setDeletingItem] = useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    useEffect(() => {
        getTermsOfPromotionList()
    }, []);

    const onDeleteClick = (itemId) => {
        const itemToDelete = Termslisting.find((item) => item.id === itemId);
        setDeletingItem(itemToDelete);
        setConfirmDeleteModal(true);
    };


    // clear Validation ----------------------
    const clearValidationError = (fieldName) => {
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    // Add terms of promotion-----------------
    const addTerms = async (e) => {
        e.preventDefault();
        const errors = {};
        if (formData.question === "") {
            errors.question = "question feild is empty";
        }
        if (formData.answer === "") {
            errors.answer = "answer feild is empty";
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setValidationErrors({});
            try {
                const response = await InsertTermsofPromotionAction(formData);
                if (response.success) {
                    toast.success("Sub Q&A added.....!", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModal();
                    getTermsOfPromotionList();
                    setFormData({ question: "", answer: "" });
                } else {
                    console.error("Failed to add Subcategory");
                }
            } catch (error) {
                console.error("An error occurred while adding the category:", error);
            }
        }
    };
    // edit terms OF Promotions---------------
    const editTerms = async (e) => {
        e.preventDefault();
        try {
            const errors = {};
            const dataObj = {
                id: editingItem.id,
                answer: editedData.answer,
                question: editedData.question,
            };
            if (dataObj.question === "") {
                errors.question = "question is not empty";
            }
            if (dataObj.answer === "") {
                errors.answer = "answer feild is not empty";
            }
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                setValidationErrors({});
                const response = await UpdateTermsofPromotionAction(dataObj);
                if (response.success) {
                    toast.success("Q&A edited successfully", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    onCloseModalSecond();
                    getTermsOfPromotionList();
                } else {
                    console.error("Failed to edit Q&A");
                }
            }
        } catch (error) {
            console.error("An error occurred while editing the Q&A:", error);
        }
    };
    //  delete question and answer----------------
    const deleteItem = async (itemId) => {
        try {
            console.log(itemId);
            const dataObj = {
                id: itemId,
            };
            const response = await DeleteProductAction(dataObj);
            if (response.success) {
                toast.success("Item deleted successfully", {
                    position: toast.POSITION.TOP_CENTER,
                });
                setTermslisting(Termslisting.filter((item) => item.id !== itemId));
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("An error occurred while deleting the item:", error);
        }
    };

    // Get listing -------------------------------
    const getTermsOfPromotionList = async () => {
        try {
            const res = await getTermsOfPromotionAction();
            if (res.success) {
                setTermslisting(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };

    const columns = [
        {
            name: "Sr. No",
            selector: (row, index) => `${index + 1}`,
            sortable: true,
        },
        {
            name: "Questions",
            selector: (row) => row.question,
            sortable: true,
        },
        {
            name: "answer",
            selector: (row) => row.answer,
            sortable: true,
        },
        {
            name: "Edit Category",
            cell: (row) => (
                <button onClick={() => onOpenModalSecond(row)} className="btn btn-primary">
                    Edit
                </button>
            ),
        },
        {
            name: "Delete Category",
            cell: (row) => (
                <button onClick={() => onDeleteClick(row.id)} className="btn btn-danger">
                    Delete
                </button>
            ),
        }

    ];

    // Modal code  ---------------------------------------

    const onOpenModalSecond = (row) => {
        setEditingItem(row);
        setEditedData({ question: row.question, answer: row.answer });
        setModalSecond(true);
    };
    const onCloseModalSecond = () => setModalSecond(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const onCloseConfirmDeleteModal = () => {
        setDeletingItem(null);
        setConfirmDeleteModal(false);
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
                <div className="content">
                    {/* Start::main-content */}
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">
                            <div>
                                <h3 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                                    Terms-Of-Promotion
                                </h3>
                            </div>
                            <ol className="flex items-center whitespace-nowrap min-w-0">
                                <li
                                    className="text-sm text-gray-500 hover:text-primary dark:text-white/70"
                                    aria-current="page"
                                >
                                    <button
                                        type="button"
                                        onClick={onOpenModal}
                                        className="ti-btn ti-btn-primary"
                                    >
                                        Add Terms-Of-Promotion
                                    </button>
                                </li>
                            </ol>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Q&A List</h5>
                                    </div>
                                    <div className="box-body">
                                        <div className="overflow-hidden table-bordered">
                                            <DataTable columns={columns} data={Termslisting} pagination />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Start::main-content */}
                </div>
                {/* First modal:  -------------- */}
                <Modal open={open} onClose={onCloseModal} center>
                    <div className="form-group">
                        <label className="modal-header" htmlFor="categoryName">
                            Add Question-
                        </label>
                        <hr></hr>
                        <input
                            type="text"
                            name="Question"
                            className="form-control"
                            id="Question"
                            placeholder="Question"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value }, clearValidationError("question"))}
                        />
                        {validationErrors.question && <span className="text-danger">{validationErrors.question}</span>}

                        <label className="modal-header" htmlFor="answer">
                            Add answer-
                        </label>
                        <input
                            type="text"
                            name="answer"
                            className="form-control"
                            id="answer"
                            placeholder="answer"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value }, clearValidationError("answer"))}
                        />
                        {validationErrors.answer && <span className="text-danger">{validationErrors.answer}</span>}
                    </div>
                    <br></br>
                    <button type="submit" onClick={addTerms} className="btn btn-primary modal-footer">
                        Add
                    </button>
                </Modal>
                {/* Edit modal code --------- */}
                <Modal open={modalSecond} onClose={onCloseModalSecond} center>
                    <div className="form-group">
                        <label className="modal-header" htmlFor="question">
                            Edit Question
                        </label>
                        <input
                            type="text"
                            name="question"
                            className="form-control"
                            id="question"
                            placeholder="Question"
                            value={editedData.question}
                            onChange={(e) => setEditedData({ ...editedData, question: e.target.value }, clearValidationError("question"))}
                        />
                        {validationErrors.question && <span className="text-danger">{validationErrors.question}</span>}

                        <label className="modal-header" htmlFor="answer">
                            Edit Answer
                        </label>
                        <input
                            type="text"
                            name="answer"
                            className="form-control"
                            id="answer"
                            placeholder="Answer"
                            value={editedData.answer}
                            onChange={(e) => setEditedData({ ...editedData, answer: e.target.value }, clearValidationError("answer"))}
                        />
                        {validationErrors.answer && <span className="text-danger">{validationErrors.answer}</span>}
                    </div>
                    <br />
                    <button type="submit" onClick={editTerms} className="btn btn-primary modal-footer">
                        Save
                    </button>
                </Modal>
                {/* delete modal code ------- */}
                <Modal open={confirmDeleteModal} onClose={onCloseConfirmDeleteModal} center>
                    <div className="form-group">
                        <p>Are you sure you want to delete this item?</p>
                    </div>
                    <br />
                    <button
                        type="button"
                        onClick={() => {
                            deleteItem(deletingItem.id);
                            onCloseConfirmDeleteModal();
                        }}
                        className="btn btn-danger modal-footer"
                    >
                        Delete
                    </button>
                </Modal>

                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default TermsOfPromotion;
