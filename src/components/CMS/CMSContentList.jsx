import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { getCMSContentByIdAction, insertCMSContentAction, updateCMSContentAction } from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";
import config from '../../config/config'
import { useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import JoditEditor from "jodit-react";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from "react-toastify";

const CMSContentList = () => {
    const { id } = useParams();
    const [contentId, setContentId] = useState([]);
    const [listing, setListing] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [show2, setShow2] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose2 = () => {
        setShow2(false);
        clearValidationErrors();
    }
    const handleClose1 = () => {
        setShow1(false);
        clearValidationErrors();
    }
    const [editorState, setEditorState] = useState('');
    const [CMSdata, setCmsData] = useState({ CMSdata: "" });
    const [title, setTitle] = useState('')
    const [validationErrors, setValidationErrors] = useState({});
    var pathArray = window.location.pathname.split("/");
    var page = pathArray[3]

    useEffect(() => {
        getListingDetails();
    }, []);

    const getListingDetails = async () => {
        try {
            const res = await getCMSContentByIdAction();
            if (res.success) {
                let data = res.data
                setListing(data.filter(
                    (item) => item.pageId == id
                ));
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };



    const handleShow2 = (id) => {
        setShow2(true);
        const selectedItem = listing.find(item => item.id === id);

        setTitle(selectedItem.title || '');

        // Use the content from the selectedItem directly
        setEditorState(selectedItem.description || '');
        setContentId(id)
    }

    const handleShow1 = () => {
        setShow1(true);
        setEditorState(''); // Clear the editor state for a new entry
    }

    const handleCMSChange = (newContent) => {
        setEditorState(newContent);
        setCmsData({ CMSdata: newContent });
    };

    const clearValidationErrors = () => {
        setValidationErrors({});
    };

    const handleSave = async () => {
        try {
            const data = {
                description: editorState,
                pageId: page,
                title: title
            };

            const errors = {};

            if (data.description === "") {
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
                    setShow1(false)
                    getListingDetails();
                } else {
                    toast.error("Failed to insert pages content");
                }
            }
        } catch (error) {
            console.error("An error occurred while saving the accessibility data:", error);
        }
    }

    const handleUpdate = async () => {
        try {
            const data = {
                description: editorState,
                pageId: page,
                title: title,
                id: contentId
            };

            const errors = {};

            if (data.description === "") {
                errors.description = "Description is required";
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
            } else {
                // Clear validation errors
                clearValidationErrors();

                const res = await updateCMSContentAction(data);
                if (res.success) {
                    toast.success("Success", {
                        position: toast.POSITION.TOP_CENTER,
                    });

                    setShow2(false)
                    getListingDetails();
                } else {
                    toast.error("Failed to update accessibility data");
                }
            }
        } catch (error) {
            console.error("An error occurred while saving the accessibility data:", error);
        }
    }

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const filteredData = listing.filter((item, index) => {
        item.index = index;
        item = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
        return item;
    }
    );

    const columns = [
        {
            name: "Sr. No",
            selector: (row) => `${row.index + 1}`,
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) =>
                row.title ? row.title + " " : "----",
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        {/* <button onClick={() => handleShow2(row.id)} className="btn btn-primary">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        &nbsp; */}

                        <a href={`${config.baseurl}editcmscontent/` + row?.id}>
                            <button className="btn btn-primary">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </button></a>

                    </>
                );
            },
        },
    ];

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
                <Modal show={show2} size="xl" onHide={handleClose2}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Page Content
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="content">
                            <div className="main-content" style={{ width: '1000px', marginLeft: '-200px' }}>
                                <div>
                                    <h3 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                value={title}
                                                placeholder="Enter title name "
                                                onChange={(e) => { setTitle(e.target.value) }}
                                            />

                                        </div>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-12 gap-12">
                                    <div className="col-span-12">
                                        <div className="box"  >
                                            <div className="box-header">
                                                <h5 className="box-title">Description</h5>
                                            </div>
                                            <div className="box-body" >
                                                <JoditEditor
                                                    value={editorState}
                                                    onChange={handleCMSChange}
                                                    editorClassName="CMSdata"
                                                />
                                                {validationErrors.description && <span className="text-danger">{validationErrors.description}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="block justify-between page-header md:flex">
                                    <button className="fas fa-edit btn btn-primary" onClick={handleUpdate} > Save </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm" variant="secondary" onClick={handleClose2}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={show1} size="xl" onHide={handleClose1}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add Page Content
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="content">
                            <div className="main-content" style={{ width: '1000px', marginLeft: '-200px' }}>
                                <div>
                                    <h7 className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium">
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Enter title name "
                                                onChange={(e) => { setTitle(e.target.value) }}
                                            />

                                        </div>
                                    </h7>
                                </div>
                                <div className="grid grid-cols-12 gap-12">
                                    <div className="col-span-12">
                                        <div className="box"  >
                                            <div className="box-header">
                                                <h5 className="box-title">Description</h5>
                                            </div>
                                            <div className="box-body" >
                                                <JoditEditor
                                                    onChange={handleCMSChange}
                                                    editorClassName="CMSdata"
                                                />
                                                {validationErrors.description && <span className="text-danger">{validationErrors.description}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="block justify-between page-header md:flex">
                                    <button className="fas fa-edit btn btn-primary" onClick={handleSave} > Save </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-sm" variant="secondary" onClick={handleClose1}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Pages Content</h5>
                                        <a
                                            href={`${config.baseurl}addcmscontent/`+ page}
                                            className="ti-btn ti-btn-primary"
                                            style={{ float: 'right', marginTop: '-35px' }}
                                        >
                                            Add
                                        </a>
                                    </div>

                                    <div className="box-body">
                                        <input
                                            type="text"
                                            value={searchText}
                                            onChange={handleSearch}
                                            placeholder="Search..."
                                            className="px-2 py-1 border rounded mb-4"
                                        />
                                        <div className="overflow-hidden table-bordered">
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                pagination
                                                paginationTotalRows={filteredData.length}

                                            />
                                        </div>
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

export default CMSContentList;
