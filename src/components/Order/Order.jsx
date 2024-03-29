import React, { useEffect, useState } from "react";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import config from "../../config/config";
import Swal from "sweetalert2";
import {
  getOrderListAction,
  updateOrderStatusAction,
  updateOrderStatusWithCommentAction,
  getOrderDetailsByIdAction,
  updateCancelReasonAction,
  cancelThisOrderAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Row } from "react-bootstrap";
import Togglesidebar from "../../directives/togglesidebar";

const Order = () => {
  const [listing, setListing] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalSecond, setModalSecond] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState('');
  const [open, setOpen] = useState(false);


  const [formData, setFormData] = useState({
    id: "",
    deliveryPartnerByAdmin: "",
    tracking_Url_IdByAdmin: "",
    expDeliveryDateByAdmin: "",
    cancelAndReturn_reson: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [orderData, setOrderData] = useState("");
  const [listingByOrder, setListingByOrder] = useState([])

  let currDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchOrderList();
    orderDetailId()
  }, []);

  const fetchOrderList = async () => {
    try {
      const res = await getOrderListAction();
      if (res.success) {
        setListing(res.orderList);
      }
    } catch (error) {
      console.error("An error occurred while getting the listing:", error);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((old) => {
      return { ...old, [name]: value };
    });
  };

  const clearValidationError = (fieldName) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  const updateStatusComment = async (e) => {
    e.preventDefault();
    const errors = {};
    if (formData.deliveryPartnerByAdmin === "" || formData.deliveryPartnerByAdmin === undefined || formData.deliveryPartnerByAdmin === null) {
      errors.deliveryPartnerByAdmin = "Delivery partner is required";
    }
    if (formData.tracking_Url_IdByAdmin === "" || formData.tracking_Url_IdByAdmin === null || formData.tracking_Url_IdByAdmin === undefined) {
      errors.tracking_Url_IdByAdmin = "Tracking Url/Id is required";
    }
    if (formData.expDeliveryDateByAdmin === "" || formData.expDeliveryDateByAdmin === null || formData.expDeliveryDateByAdmin === undefined) {
      errors.expDeliveryDateByAdmin = "Expected delivery date is required";
    }

    let data = {
      id: orderData.id,
      deliveryPartner: formData.deliveryPartnerByAdmin,
      tracking_Url_Id: formData.tracking_Url_IdByAdmin,
      expDeliveryDate: formData.expDeliveryDateByAdmin,
      status: formData.status
    }


    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      try {
        const response = await updateOrderStatusWithCommentAction(data);
        if (response.success) {
          // toast.success("Success", {
          //   position: toast.POSITION.TOP_CENTER,
          // });
          handleStatusUpdate(formData.id);
          handleShow(formData, 3, formData.orderId)
          orderDetailId(formData.orderId)
          handleClose();
        } else {
          toast.error(response.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        console.error("An error occurred while adding the category:", error);
      }
    }
  };

  const handleStatusUpdate = async (id, status, orderId) => {

    let res = await updateOrderStatusAction({
      id: id,
      status: status ? status : statusUpdateData,
    });
    if (res.success) {
      console.log('resss', res.success)
      toast.success("Success", {
        position: toast.POSITION.TOP_CENTER,
      });
      orderDetailId(orderId)
      fetchOrderList();
    } else {
      toast.error("Failed!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

  };

  const updateCancelResaon = async (e) => {
    e.preventDefault();
    const errors = {};
    console.log(formData)
    if (formData.cancelAndReturn_reson === "" || formData.cancelAndReturn_reson == undefined) {
      errors.cancelAndReturn_reson = "Cancel reason is required";
    }
    let data = {
      orderItemId: orderData.id,
      orderId: orderData.orderId,
      cancelAndReturn_reson: formData.cancelAndReturn_reson,
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      try {

        const response = await cancelThisOrderAction(data);
        if (response.success) {
          toast.success("Success", {
            position: toast.POSITION.TOP_CENTER,
          });
          handleClose2();

          orderDetailId(formData.orderId)
        } else {
          toast.error(response.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        console.error("An error occurred while updating cancel reason:", error);
      }
    }
  };


  const orderDetailId = async (item) => {
    try {
      const res = await getOrderDetailsByIdAction({ orderId: item.id ? item.id : item });
      console.log(res.data);
      if (res.success) {
        setListingByOrder(res.data[0].orderItems);
        handleShow1();
        console.log(res)
      } else {
        console.error("Failed to fetch order details:", res.msg);
      }
    } catch (error) {
      console.error("An error occurred while getting the order details:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // const filteredData = listing.filter((item) =>
  //   Object.values(item).some((value) =>
  //     String(value).toLowerCase().includes(searchText.toLowerCase())
  //   )
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
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Order Number",
      selector: (row) => row.orderNumber,
      sortable: true,
    },
    {
      name: "Promo Code",
      selector: (row) =>
        row.promocode ? row.promocode + " " + "(" + row.promoCodeDiscount + ")" : "-",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `${row.totalAmount} ${row.currency}`,
      sortable: true,
    },
    // {
    //   name: "Delivery Charges",
    //   selector: (row) => row.deliveryAmount,
    //   sortable: true,
    // },
    // {
    //   name: "VAT (%)",
    //   selector: (row) => row.tax_per ,
    //   sortable: true,
    // },
    // {
    //   name: "Delivery Charges and VAT (%)",
    //   cell: (row) => (
    //     <div>
    //       <div>
    //       <strong>Delivery :</strong> {`${row.deliveryAmount} ${row.currency}`}
    //       </div>
    //       <div>
    //       <strong>VAT :</strong> {`${row.tax_per} %`}
    //       </div>
    //     </div>
    //   ),
    // },
    {
      name: "Order Placed On",
      selector: (row) => `${moment(row?.dateTime).format("DD-MM-YYYY")}`,
      sortable: true,
    },
    {
      name: "Order List",
      cell: (item) => {
        return (
          <>
            <div class="btn-group mb-2">
              <>
                <a class="btn btn-dark btn-sm" onClick={() => orderDetailId(item)} data-toggle="modal" data-target="#myModal" style={{ borderRadius: '10px' }} href="javascript:void(0)" ><i className='fa fa-eye' ></i> </a>
              </>
            </div>
          </>
        );
      },
    },

  ];

  
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = (item, statusUpdate) => {
    console.log('formData', item);
    setFormData(item);
    setOrderData(item);
    setStatusUpdateData(statusUpdate)
    setShow(true);
  }

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    setShow1(true);
  }

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
    setFormData({ cancelAndReturn_reson: "" });
  }
  const handleShow2 = (item, statusUpdate) => {
    setOrderData(item);
    setFormData(item);
    setStatusUpdateData(statusUpdate)
    setShow2(true);
  }


  return (
    <>
      <div className="page">
        <div id="websidebar" className="">
          <Sidebar />
        </div>

        <div id="mobilesidebar" className="">
          {/* <Togglesidebar /> */}
          <Togglesidebar />
        </div>
        <Header />
        <ToastContainer />
        <div className="content">
          <div className="main-content">
            <div className="block justify-between page-header md:flex"></div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="box-title">Order List</h5>
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


      {/* Order update modal */}
      <Modal show={show} onHide={handleClose} size='lg' closeOnOverlayClick={false} closeOnEsc={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update order details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="form-group">
            <label className="p-1" htmlFor="deliveryPartner">Delivery Partner</label>
            <input
              type="text"
              name="deliveryPartnerByAdmin"
              value={formData.deliveryPartnerByAdmin}
              onChange={(e) => {
                inputHandler(e);
                clearValidationError("deliveryPartnerByAdmin");
              }}
              className="form-control"
              placeholder="Delivery Partner"
            />
            {validationErrors.deliveryPartnerByAdmin && (
              <span className="text-danger">
                {validationErrors.deliveryPartnerByAdmin}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="p-1" htmlFor="tracking_Url_Id">Tracking Url/Id</label>
            <input
              type="text"
              name="tracking_Url_IdByAdmin"
              value={formData.tracking_Url_IdByAdmin}
              onChange={(e) => {
                inputHandler(e);
                clearValidationError("tracking_Url_IdByAdmin");
              }}
              className="form-control"
              placeholder="Tracking Url/Id"
            />
            {validationErrors.tracking_Url_IdByAdmin && (
              <span className="text-danger">
                {validationErrors.tracking_Url_IdByAdmin}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="p-1" htmlFor="expDeliveryDate">
              Expected Delivery Date
            </label>
            <input
              type="date"
              name="expDeliveryDateByAdmin" //expDeliveryDateByAdmin
              value={formData.expDeliveryDateByAdmin ? moment(formData.expDeliveryDateByAdmin).format("YYYY-MM-DD") : ""}
              onChange={(e) => {
                inputHandler(e);
                clearValidationError("expDeliveryDateByAdmin");
              }}
              className="form-control"
              min={currDate}
            />
            {validationErrors.expDeliveryDateByAdmin && (
              <span className="text-danger">
                {validationErrors.expDeliveryDateByAdmin}
              </span>
            )}
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit"
            onClick={updateStatusComment}
            variant="primary">
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Detail modal */}
      <Modal show={show1} onHide={handleClose1} size="lg">
        <Modal.Header closeButton>

          <Modal.Title>Order Details (#{listingByOrder[0]?.orderNumber})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {listingByOrder?.map((item) => {
              return (
                <>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="block_address">
                        {console.log(item)}
                        <img key={item.id} src={config.imageUrl + item.images[0].name} style={{
                          height: '214px',
                          width: '160px',
                          borderRadius: '10px'
                        }} alt="Image" class="img-fluid imagesize" />
                        <div></div>

                      </div>
                    </div>

                    <div className="col-md-5">
                      <b>Name : </b> <span>{item.itemName}</span><br />
                      <b>Price : </b><span>{item.price} {item.currency}</span><br />
                      {item.size !== null ? 
                      <><b>Size : </b><span>{item.size}</span><br /></>
                        : ''
                      }
                      <b>Quantity : </b><span>{item.quantity}</span><br />
                      <b>Order Number : </b><span>{item.orderNumber}</span><br />
                      <b>Status : </b>
                      <span style={{
                        color:
                          item.status == 0 ? 'green' :
                            item.status == 1 ? 'Teal' :
                              item.status == 2 ? 'blue' :
                                item.status == 3 ? 'orange' :
                                  item.status === 4 ? 'purple' :
                                    item.status == 5 ? 'red' :
                                      item.status == 6 ? 'brown' : 'black'
                      }}>
                        {item.status == 0 ? 'Order Placed' :
                          item.status == 1 ? 'Processing' :
                            item.status == 2 ? 'Shipped' :
                              item.status == 3 ? 'Out For Delivery' :
                                item.status == 4 ? 'Delivered' :
                                  item.status == 5 ? 'Cancelled' :
                                    item.status == 6 ? 'Return' : 'Unknown Status'}
                      </span>
                      <br />
                      {item.cancelAndReturn_reson !== null ?
                      <><b>Reason : </b><span>{item.cancelAndReturn_reson}</span><br /></>
                      : '' }
                    </div>
                    {item.status !== 4 && item.status !== 5  && item.status !== 6 ? (
                      <div className="col-md-3">
                        <div class="dropdown">
                          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Action
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                              <a class="dropdown-item mb-1" href="javascript:;" onClick={() => handleStatusUpdate(item.id, 1, item.orderId)}><i class="fa fa-spinner" aria-hidden="true"></i> &nbsp;Processing</a>
                            </li>
                            <li>
                              <a class="dropdown-item mb-1" href="javascript:;" onClick={() => handleShow(item, 2, item.orderId)}><i class="fa fa-truck" aria-hidden="true"></i> &nbsp; Shipped</a>
                            </li>
                            <li><a class="dropdown-item" onClick={() => handleShow(item, 3, item.orderId)}><i class="fa fa-car" aria-hidden="true"></i> &nbsp; Out For Delivery</a></li>
                            <li>
                              <a class="dropdown-item mb-1" href="javascript:;" onClick={() => handleStatusUpdate(item.id, 4, item.orderId)}><i class="fa fa-shopping-basket" aria-hidden="true"></i> &nbsp; Delivered</a>
                            </li>
                            <li>
                              <a class="dropdown-item" onClick={() => handleShow2(item, 5)}><i class="fa fa-times" aria-hidden="true"></i> &nbsp; Cancel</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <hr className="mt-3" />
                </>

              )
            })}

            <div className="row">
              <div className="col-md-12 mt-2">
                <b>Delivery Address :
                </b><br /><span>{listingByOrder[0]?.deliveryAddress}</span><br />
              </div>
            </div>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
        </Modal.Footer>
      </Modal >

      {/* Cancel modal */}
      <Modal show={show2} onHide={handleClose2} size="md" closeOnOverlayClick={false} closeOnEsc={false}>
        <Modal.Header closeButton>
          <Modal.Title>Order Cancel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <div className="form-group">
              <label>Cancellation reason</label>
              <textarea
                type="text"
                name="cancelAndReturn_reson"
                value={formData.cancelAndReturn_reson}
                onChange={(e) => {
                  inputHandler(e);
                  clearValidationError("cancelAndReturn_reson");
                }}
                className="form-control"
                id="cancelAndReturn_reson"
                style={{ marginTop: "10px", marginBottom: "10px" }}
                placeholder="Type cancellation reason"
              />
              {validationErrors.cancelAndReturn_reson && (
                <span className="text-danger">
                  {validationErrors.cancelAndReturn_reson}
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={updateCancelResaon}>
            Update
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
};

export default Order;