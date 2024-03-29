import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import config from "../../config/config";
import Swal from "sweetalert2";
import Moment from "moment";
import {
	getCancelAndReturnListAction,
	getCancelAndReturnListIdAction,
	updateCancelAndReturnStatusAction,
	updateOrderStatusToRejectAction
} from "../../Action/user.action";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Togglesidebar from "../../directives/togglesidebar";
import { Col, Row, Table } from "react-bootstrap";
import copy from "copy-to-clipboard"

const CancelAndReturn = () => {
	const [listing, setListing] = useState([]);
	const [cancelAndReturnbyid, setcancelAndReturnbyid] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [selectedReason, setSelectedReason] = useState(null);
	const [actionItemId, setActionItemId] = useState('');
	const [refundAmount, setRefundAmount] = useState('')
	const [deductionDetails, setDeductionDetails] = useState('')
	const [refundWarning, setRefundWarning] = useState('');
	useEffect(() => {
		fetchOrderList();
		fetchOrderListbyId();
	}, []);

	const fetchOrderList = async () => {
		try {
			const res = await getCancelAndReturnListAction();
			if (res.success) {
				setListing(res.orderList);
			}
		} catch (error) {
			console.error("An error occurred while getting the listing:", error);
		}
	};
	const fetchOrderListbyId = async (id) => {
		try {
			const data = {
				id: id,
			};
			const res = await getCancelAndReturnListIdAction(data);
		if (res.success) {
				setSelectedOrder(res.orderList[0]);
			}
		} catch (error) {
			console.error("An error occurred while getting the listing by Id:", error);
		}
	};

	const handleStatusUpdate = async (id) => {
		setActionItemId(id);
		Swal.fire({
			title: 'Are you sure?',
			text: `You want to Reject the Refund Request!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: `Yes, Reject it!`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				let res = await updateOrderStatusToRejectAction({
					id: id,
				});
				if (res.success) {
					toast.success(res.msg);
					fetchOrderListbyId()
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				} else {
					console.error("Refund process failed:", res.msg);
				}
			}
			else {
				setActionItemId('');
			}
		});
	};

	const handleRefund = async (status) => {
		try {
			if (refundAmount == "") {
				toast.error("Please enter the refund amount");
				return;
			}

			if (parseFloat(refundAmount) > parseFloat(item.price)) {
				setRefundWarning("Refund amount cannot be greater than the original amount");
				return;
			} else {
				setRefundWarning(""); // Clear the warning if refundAmount is valid
			}

			const res = await updateCancelAndReturnStatusAction({
				id: item.orderItemId,
				refundedAmount: refundAmount,
				deductionDetail: deductionDetails,
				orderId: item.orderId,
				status: status,
			});;
			if (res.success) {
				toast.success(res.msg);
				handleClose3(false)
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			} else {
				console.error("Refund process failed:", res.msg);
			}
		} catch (error) {
			console.error("Error during refund process:", error);
		}
	};

	const copyToClipboard = (order) => {
		copy(order);
		navigator.clipboard.writeText(order)
			.then(() => {
				toast.success("Copy To Clipbord")
			})
			.catch((err) => {
				console.error('Error copying text to clipboard', err);
			});
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

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
			name: "Sno.",
			selector: (row) => `${row.index + 1}`,
			sortable: true,
			width: "80px"
		},
		{
			name: "User",
			selector: (row) => row.fullName,
			sortable: true,
			width: "100px"
		},
		{
			name: "Product",
			sortable: true,
			cell: (item) => {
				return (
					<>
						{/* <img style={{ width: '50px', height: '50px', borderRadius: '50%' }} src={config.imageUrl + item.image[0].name} alt="image" /> &nbsp; */}
						{item.productName}
					</>
				);
			},
		},
		// {
		// 	name: "Price & Quantity",
		// 	selector: (row) => row.price + ' ' + row.currency + ' * ' + row.quantity + ' qty',
		// 	sortable: true,
		// },
		{
			name: "User action",
			selector: (row) => {
				return (
					<>
						{(row.type == 1 || row.type == 2 ) ? (
							<div style={{ color: row.type == 1 ? "red" : "green" }}>
								{row.type == 1 ? "Cancelled" : "Returned"}
							</div>
						) : ''}
						{/* <button className="btn-link" onClick={() => handleShow(row.cancelAndReturn_reson !== null ? row.cancelAndReturn_reson : row.cancelReason, row.type)}>
							View Reason
						</button> */}
					</>
				);
			},
			sortable: true,
		},
		{
			name: "View details",
			selector: (row) => {
				return (
					<>
						<button class="btn btn-dark btn-sm" data-toggle="modal" onClick={() => handleShow2(row, item.reason)} data-target="#myModal" style={{ borderRadius: '10px' }} href="javascript:void(0)" ><i className='fa fa-eye'  aria-hidden="true"></i></button>
					</>
				);
			},
			sortable: true,
		}

	];



	const [show, setShow] = useState(false);
	const [show2, setShow2] = useState(false);
	const [show3, setShow3] = useState(false);

	const handleClose = () => setShow(false);
	const handleClose2 = () => setShow2(false);
	const handleClose3 = () => setShow3(false);
	const handleShow = (reason, newuserAction) => {
		setSelectedReason(reason);
		setUserAction(newuserAction == 5 ? 'Cancellation' : 'Return')
		setShow(true);
	}
	const [item, setSelectedOrder] = useState({})

	const handleShow2 = (order, reason) => {
		fetchOrderListbyId(order.id)
		setSelectedReason(reason);
		setShow2(true);
	}
	const handleShow3 = (id, price, orderItemId, refund_status, massage) => {
		setShow3(true);
		// handleRefund(id, price, orderItemId, refund_status, massage)
		// handleStatusUpdate(item.id, price, item.orderItemId, 1, 'Refund Approve')
		// fetchOrderListbyId(order.id)
		setShow2(true);
	}
	const [userAction, setUserAction] = useState();
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

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{userAction} Reason</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p>{selectedReason}</p>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
				{/* veiw details action -------------------- */}
				<Modal show={show2} size="lg" onHide={handleClose2}>
					<Modal.Header closeButton>
						<Modal.Title> {item?.refund_status == 0 ?
							<>
								<div style={{ display: "flex" }}>
									View Details
								</div>
							</>
							:
							item?.refund_status == 1 ?
								<>
									<span style={{ color: 'green' }} class="dropdown-item"><span style={{ color: 'black' }}>View Details</span> (Approved)</span>
								</>
								:
								<>
									<span style={{ color: 'red' }} class="dropdown-item"><span style={{ color: 'black' }}>View Details</span> (Rejected)</span>
								</>
						}
						</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Table striped bordered hover>
							<tbody className="col-lg-6 ">
								<tr>
									<td colSpan="4">
										<h6>User Details:</h6>
									</td>
								</tr>
								<tr>
									<td>Name:</td>
									<td>{item.fullName}</td>
								</tr>
								<tr>
									<td>Email:</td>
									<td>{item.email}</td>
								</tr>
								<tr>
									<td colSpan="4">
										<h6>Order Details:</h6>
									</td>
								</tr>
								<tr>
									<td>Product Name:</td>
									<td>{item.productName}</td>
								</tr>
								<tr>
									<td>Product Image:</td>
									<td>
										<a href={config.imageUrl + item.image?.[0].name} target="_blank" rel="noopener noreferrer">
											<img style={{ width: '50px', height: '50px' }} src={config.imageUrl + item.image?.[0].name} alt="image" />
										</a>
									</td>
								</tr>
								<tr>
									<td>Product price:</td>
									<td> {item.currency}{item.price}</td>
								</tr>
								<tr>
									<td>Order Date:</td>
									<td>{item.orderPlacedOn == null ? " " : moment(item.orderPlacedOn).format("DD/MM/YYYY")}</td>
								</tr>
								<tr>
									<td colSpan="4">
										<h6>{item.type == 1 ? "Order Cancellation" : "Order Return"} Details:</h6>
									</td>
								</tr>
								<tr>
									<td>{item.type == 1 ? "Cancellation" : "Return"} Reason:</td>
									<td>{item.cancelAndReturn_reson}</td>
								</tr>

								<tr>
									<td> {item.type == 1 ? "Cancellation" : "Return"} Date:</td>
									<td>{item.cancelAndReturnDate == null ? " " : moment(item.cancelAndReturnDate).format("DD/MM/YYYY")}</td>
								</tr>
								<tr>
									<td>Quantity:</td>
									<td>{item.quantity} </td>
								</tr>
								<tr>
									<td>Refund Status:</td>
									<td style={{
										color:
											item.refund_status === 0 ? "orange" :
												item.refund_status === 1 ? "green" :
													item.refund_status === 2 ? "red" : ""
									}}>
										{item.refund_status === 0 ? "Pending" :
											item.refund_status === 1 ? "Approved" :
												item.refund_status === 2 ? "Rejected" : ""}
										( {item.updateTime == null ? " " : moment(item.updateTime).format("DD/MM/YYYY")})
									</td>
								</tr>

								<tr>
									<td>Type:</td>
									<td style={{ color: item.type === 1 ? "red" : "green" }}>
										{item.type === 1 ? "Cancelled" : "Returned"}
									</td>
								</tr>

								{item.type == 2 && (
									<>
										<tr>
											<td>Delivery Details:</td>
											<td>{item.deliveryPartner}</td>
										</tr>
										{item.tracking_Url_Id != null && (
											<>
												<tr>
													<td>Tracking URL ID:</td>
													<td style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(item.tracking_Url_Id)}>{item.tracking_Url_Id} <a style={{ fontSize: '12px', cursor: 'pointer' }}> Click to copy</a></td>
												</tr>
											</>
										)}
										<tr>
											<td>Exp Delivery Date:</td>
											<td>{item.expDeliveryDate == null ? " " : moment(item.expDeliveryDate).format("DD/MM/YYYY")}</td>
										</tr>
									</>
								)}




							</tbody>
						</Table>
					</Modal.Body>
					<Modal.Footer>
						<>
							{item?.refund_status == 0 ?
								<>
									<div style={{ display: "flex" }}>
										{actionItemId != item.id ?
											<>
												<button className="btn btn-primary btn-success btn-sm" onClick={() => handleShow3(item.id, item.price, item.orderItemId, 1, 'Refund Reject')}> Approve</button> &nbsp;
												<a className="btn btn-primary btn-danger btn-sm" onClick={() => handleStatusUpdate(item.orderItemId)}> Reject</a>
											</>
											:
											<button className="btn btn-defaul" disabled> Processing...</button>
										}
									</div>
								</>
								:
								<>
								</>
							}
						</>
						<Button className="btn-sm" variant="secondary" onClick={handleClose2}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
				{/* modal for final action for refund amount  */}
				<Modal show={show3} onHide={handleClose3}>
					<Modal.Header closeButton>
						<Modal.Title>{userAction} Refund Amount  - ${item.price}</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Row>
							<Col md={12}>
								<label>Refund Amount</label>
								<input
									type="number"
									className="form-control"
									onChange={(e) => {
										setRefundAmount(e.target.value);
										setRefundWarning(""); // Clear the warning when the user types
									}}
									placeholder="Enter amount"
								/>
								<span className="text-danger">{refundWarning}</span>
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<label>Deduction detail</label>
								<textarea
									className="form-control"
									onChange={(e) => {
										setDeductionDetails(e.target.value);
									}}
									placeholder="Please enter deduction detail"
								></textarea>
							</Col>
						</Row>
					</Modal.Body>

					<Modal.Footer>
						<>
							{item?.refund_status == 0 ?
								<>
									<div style={{ display: "flex" }}>
										{actionItemId != item.id ?
											<>
												<button className="btn btn-primary btn-success btn-sm" onClick={() => handleRefund(1)}> Approve</button> &nbsp;
												{/* <a className="btn btn-primary btn-danger btn-sm" onClick={() => handleRefund(2)}> Reject</a> */}
											</>
											:
											<button className="btn btn-defaul" disabled> Processing...</button>
										}
									</div>
								</>
								: item?.refund_status == 1 ?
									<span style={{ color: 'green' }} class="dropdown-item">Refund Request Approved</span>
									:
									<span style={{ color: 'red' }} class="dropdown-item">Refund Request Rejected</span>
							}
						</>
						<Button variant="secondary" onClick={handleClose3}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
				<div className="content">
					{/* Start::main-content */}
					<div className="main-content">
						<div className="block justify-between page-header md">
						</div>

						<div className="grid grid-cols-12 gap-6">
							<div className="col-span-12">
								<div className="box">
									<div className="box-header">
										<h5 className="box-title">Cancel And Return Orders</h5>
									</div>

									<div className="box-body">
										<input
											type="text"
											value={searchText}
											onChange={handleSearch}
											placeholder="Search..."
											className="px-2 py-1 border rounded mb-4"
										/>
										<div className="maintable">
											<div className="table-responsive table-bordered">
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
				</div>
				<ToastContainer />
				<Footer />
			</div >
		</>
	);
};

export default CancelAndReturn;






