import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import { deleleteFeedbackListAction, getFeedbackListAction, getProductListByNameAction, getUsersListByNemAction, insertFeedbackListAction, updateFeedbacContentAction, updateFeedbackListAction } from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";
import Swal from "sweetalert2";
import config from "../../config/config";
import { Modal } from "react-responsive-modal";
const Feedback = () => {
    const [listing, setListing] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [modalSecond, setModalSecond] = useState(false);
    const [onOpenModal, setOpenModal] = useState(false);
  const [user,setUser] = useState([]);
  const [img,setImg] = useState();
    const [content, setContent] = useState({
        feedback: '',

        rating: 0,
        feedbackImage:''
    });
    const [result, setResult] = useState([]);
    const [formData, setFormData] = useState(
        {
            feedback: "",
            rating: 0
        }
    )
    useEffect(() => {
        getListingDetails();
    }, []);


    const getListingDetails = async () => {
        try {
            const res = await getFeedbackListAction();
            console.log(res)
            if (res.success) {
                console.log(res.data)
                setListing(res.data);
            }
        } catch (error) {
            console.error("An error occurred while getting the listing:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // const filteredData = listing.filter((item) =>
    //     Object.values(item).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    const filteredData = listing.filter((item, index) => {
        item.index = index;
        item = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
        return item;
    }
    );


    const StatusUpdate = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await updateFeedbackListAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });;
                if (res.success) {
                    Swal.fire(
                        `${data.status === 0 ? 'Activated' : 'Deactivated'}`,

                        res.msg,
                        'success'
                    )
                    getListingDetails();
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })
    }


    const onOpenModalSecond = (data) => {
        setContent(data);
        setModalSecond(true)
    }


    const onCloseModalSecond = () => {
        setModalSecond(false)
        setOpenModal(false);
    }


    const updateFeed = async () => {
        let res = await updateFeedbacContentAction(content);
        if (res.success) {
            toast.success("Content updated succesfully");
            setModalSecond(false)
            getListingDetails()
        }
    }


    const handleDeleteImage = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to Delete this promocode!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes`
        }).then(async (result) => {
            if (result.isConfirmed) {

                //   let res = await imageStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
                let res = await deleleteFeedbackListAction(data);
                toast.success(res.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
                getListingDetails()
                if (res.success) {

                    getListingDetails()
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })


    };

    const handleProductSearch = async (e) => {

        const inputValue = e.target.value.trim(); // Trim leading and trailing whitespace
        if (inputValue === '') {
            setResult([]);
            return;
        }
        let res = await getProductListByNameAction({ data: e.target.value })
        setResult(res.data)
    }


    const handleContentChange = (e) => {
        setContent({ ...content, feedback: e.target.value });
    };

    const handleContentsChange = (e) => {
        setContent({ ...content, rating: e.target.value });
    };

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleClick = (id, name) => {
        setContent({ ...content, productId: id });
        setResult([])
        document.getElementById('productName').value = name;
    }

    const handleImage = (e) => {
    const previewURL = URL.createObjectURL(e.target.files[0]);
    setImg(previewURL)
    setContent({ ...content, feedbackImage:e.target.files[0] });

      }

const handleUserSerach = async(e) =>{
    const inputValue = e.target.value.trim(); // Trim leading and trailing whitespace
    if (inputValue === '') {
        setUser([]);
        return;
    }
let res = await getUsersListByNemAction(e.target.value);
setUser(res.data)
}

const handleUserClick = (id, name) => {
    setContent({ ...content, userId: id });
    setUser([])
    document.getElementById('userName').value = name;
}


const createFeed = async() =>{
    let res = await insertFeedbackListAction(content);
    if(res.success){
        toast.success("Content Added succesfully");
        setOpenModal(false)
        getListingDetails()
        setImg()
    }
}

    const columns = [
        {
            name: "Sr. No",
            selector: (row) => `${row.index + 1}`,
            sortable: true,
        },

        {
            name: "Product Name",
            selector: (row) => row.productName,
            sortable: true,
        },
        {
            name: "Rating",
            selector: (row) => row.rating,
            sortable: true,
        },
        {
            name: "Feedback",
            selector: (row) => row.feedback,
            sortable: true,
        },
        {
            name: "Product Image",
            text: "Product Image",
            cell: (item) => {
                return (
                    <>
                        <a href={config.imageUrl + item.feedbackImage} target="_blank" rel="noopener noreferrer">
                            <img style={{ width: '160px', height: '80px', borderColor: 'black' }} src={config.imageUrl + item.feedbackImage} alt="image" className="py-2" />
                        </a>
                    </>
                );
            },
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <>
                        <button onClick={() => onOpenModalSecond(row)} className="btn btn-primary">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>&nbsp;
                        {row.status == 0 ?
                            <button onClick={() => StatusUpdate(row)} className="btn btn-danger">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </button> :
                            row.status == 1 ?
                                <button onClick={() => StatusUpdate(row)} className="btn btn-success">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </button> :
                                ''
                        }
                        &nbsp;
                        <button className="btn btn-danger" onClick={() => handleDeleteImage(row)}>
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>

                    </>
                )
            }
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
                                        <button
                                            type="button"
                                            onClick={handleOpenModal}
                                            className="ti-btn ti-btn-primary"
                                            style={{ float: 'right' }}
                                        >
                                            Add
                                        </button>
                                        <h5 className="box-title">Feedback List</h5>
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


                {/* Edit modal code --------- */}
                <Modal open={modalSecond} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                    <br />

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            Feedback
                        </label>
                        <br />

                        <input
                            type="text"
                            name="feedback"
                            defaultValue={content.feedback}
                            onChange={(e) => {
                                handleContentChange(e);
                            }}

                            className="form-control"
                            id="categoryName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="feedback"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            Rating
                        </label>
                        <br />

                        <input
                            type="number"
                            name="rating"
                            defaultValue={content.rating}
                            onChange={(e) => {
                                handleContentsChange(e);
                            }}

                            className="form-control"
                            //   id="categoryName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="rating"
                            required
                        />
                    </div>

                    {/* <br /> */}
                    <button
                        type="submit"
                        onClick={updateFeed}
                        className="btn btn-primary modal-footer"
                    >
                        Update
                    </button>
                </Modal>


                {/* // modal for add it
 */}

                <Modal open={onOpenModal} onClose={onCloseModalSecond} center closeOnOverlayClick={false} closeOnEsc={false}>
                    <br />

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            Product Name
                        </label>
                        <br />

                        <input
                            type="text"
                            name="productId"
                            onChange={(e) => {
                                handleProductSearch(e)
                            }}

                            className="form-control"
                            id="productName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="Search product Name"
                            required
                        />


                        <div style={{ position: 'relative' }}>
                            {result?.map((item) => (
                                <div
                                    key={item.id}
                                    style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer',display:"flex" }}
                                    onClick={() => handleClick(item.id, item.productName)} // Call handleClick function with item id as argument
                                >
                                    {/* Assuming fullName is a property of each item in list */}
                                    <img src={config.imageUrl+item.productImage} style={{width:"20px",height:'20px',paddingRight:10}}/>                                    
                                    <p style={{ margin: '0' }}>{item.productName}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            User Name
                        </label>
                        <br />

                        <input
                            type="text"
                            name="userId"
                            onChange={(e) => {
                                handleUserSerach(e)
                            }}

                            className="form-control"
                            id="userName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="Search User Name"
                            required
                        />


                        <div style={{ position: 'relative' }}>
                            {user?.map((item) => (
                                <div
                                    key={item.id}
                                    style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}
                                    onClick={() => handleUserClick(item.id, item.fullName)} // Call handleClick function with item id as argument
                                >
                                    {/* Assuming fullName is a property of each item in list */}
                                    <p style={{ margin: '0' }}>{item.fullName}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            Feedback
                        </label>
                        <br />

                        <input
                            type="text"
                            name="feedback"
                            defaultValue={content.feedback}
                            onChange={(e) => {
                                handleContentChange(e);
                            }}

                            className="form-control"
                            id="categoryName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="feedback"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryName">
                            Rating
                        </label>
                        <br />

                        <input
                            type="number"
                            name="rating"
                            defaultValue={content.rating}
                            onChange={(e) => {
                                handleContentsChange(e);
                            }}

                            className="form-control"
                            //   id="categoryName"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            placeholder="rating"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="backgroundImage">
                            Feedback Image
                        </label>
                        <input
                            accept="image/x-png,image/gif,image/jpeg"
                            type="file"
                            name="feedbackImage"
                            // value={formData.backgroundImage}
                            onChange={(e) => {
                                handleImage(e);
                               
                            }}
                            className="form-control"
                        />
                        {content.feedbackImage && (
                            <img
                                src={img}
                                alt="Selected Image Preview"
                                style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '150px' }}
                            />
                        )}
                    </div>
                    {/* <br /> */}
                    <button
                        
                        onClick={createFeed}
                        className="btn btn-primary modal-footer"
                    >
                        Add
                    </button>
                </Modal>
                {/* // modal for add it */}

                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default Feedback;
