import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import { getContactUsDetailByIdAction, getContactUsListAction } from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ContactUs = () => {
    const [listing, setListing] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [ContactUsData, setContectUsData] = useState({});

    useEffect(() => {
        getListingDetails();

    }, []);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }

    const getListingDetails = async () => {
        try {
            const res = await getContactUsListAction();
            console.log(res)
            if (res.success) {
                console.log(res.data)
                setListing(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };
    const fatchContactUsDetailById = async (id) => {
        try {
            const data = {
                id: id
            }
            const res = await getContactUsDetailByIdAction(data);
            console.log(res)
            if (res.success) {
                console.log(res.data)
                setContectUsData(res.data[0]);
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };
    const handleShow2 = (id) => {
        fatchContactUsDetailById(id)
        setShow(true)
    };

    // const filteredData = listing.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    const filteredData = listing.filter((item,index) =>{
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
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <button onClick={() => handleShow2(row.id)} style={{ borderRadius: '10px' }}  class="btn btn-dark btn-sm">
                            <i className='fa fa-eye'  aria-hidden="true"></i>
                        </button>
                        &nbsp;
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
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Help And Support List</h5>
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
                                            <DataTable className="contact_table"
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
                <Modal show={show} onHide={handleClose} size='lg' closeOnOverlayClick={false} closeOnEsc={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Help And Support Detail</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="form-group">
                           <h5> <label htmlFor="exampleFormControlTextarea1">Subject :</label></h5>
                            <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={ContactUsData?.subject}
                            />
                        </div>
                        <div className="form-group">
                            <br />
                            <h5><label htmlFor="exampleFormControlTextarea1">Message : </label></h5>
                            <textarea
                                className="form-control"
                                readOnly
                                id="exampleFormControlTextarea1"
                                rows="3"
                                value={ContactUsData?.message}
                            // onChange={handleTextareaChange}
                            ></textarea>
                        </div>
                    </Modal.Body>


                    <Modal.Footer>

                        <Button type="submit"
                            onClick={handleClose}
                            variant="primary">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default ContactUs;
