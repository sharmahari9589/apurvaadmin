import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../directives/sidebar";
import Header from "../../directives/header";
import Footer from "../../directives/footer";
import DataTable from "react-data-table-component";
import { MultiSelect } from "react-multi-select-component";
import { FaSquareCaretRight } from "react-icons/fa6";
import {
    updateProductSizeAction,
    addProductSizeAction,
    updateSizeStatusAction,
    getCategoryAction,
    getProductSizeListAction,
    getSubCategoryAction,
    innerCategoryStatusUpdateAction,
    getRegionListAction,
    addBannerImagesAction,
    getImageAction,
    imageStatusUpdateAction,
    imageDeleteAction
} from "../../Action/user.action";
import Swal from 'sweetalert2';
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Togglesidebar from "../../directives/togglesidebar";
import config from "../../config/config";
import { FaArrowRight, FaJsSquare, FaTrash, FaTrashAlt } from "react-icons/fa";

const BannerImage = () => {
   const [open,setOpen] = useState(false);
   const [image,setImage] = useState([]);

    const onOpenModal = () => {
       setOpen(true);
    };

   

    const onCloseModal = () => {
        setOpen(false);
    };

    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
      const files = e.target.files;
      
      if (files.length > 5) {
        alert('Please select up to 5 images only.');
        // Clear the file input
        e.target.value = null;
        return;
      }
      let newImages = [];
      for (let i = 0; i < files.length; i++) {
        if (i < 5) {
          newImages.push(files[i]);
        }
      }
      setImages([...images, ...newImages]);
    };

    const handleSubmit = async (e) =>{
     e.preventDefault();
  let res = await addBannerImagesAction(images);
  onCloseModal()
   getImage()
  toast.success(res.msg, {
    position: toast.POSITION.TOP_CENTER
  });
    }

  
    const handleDeleteImage = async (data) => {
      if(data.status==1){
        Swal.fire({
          title: 'You cannot delete this image! This image is activated for banner iamge.',
          
        })
      }
      else{

        Swal.fire({
            title: 'Are you sure?',
            text: `You want to Delete this image!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes`
          }).then(async (result) => {
            if (result.isConfirmed) {
    
            //   let res = await imageStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
      let res = await imageDeleteAction(data);
      toast.success(res.msg, {
        position: toast.POSITION.TOP_CENTER
      });
      getImage()
            if (res.success) {
              
                getImage()
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
        
      
    };

   const getImage = async () =>{
    let res = await getImageAction();
     setImage(res.data)
   }

    useEffect(()=>{
getImage()
    },[])
 
const trueStatusUpdate = async (data) =>{
    Swal.fire({
        title: 'Are you sure?',
        text: `You want to ${data.status === 0 ? 'Activate' : 'Deactivate'}  it for banner iamge!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`
      }).then(async (result) => {
        if (result.isConfirmed) {

          let res = await imageStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
          if (res.success) {
            Swal.fire(
              `${data.status === 0 ? 'Activated' : 'Deactivated'}`,
  
              res.msg,
              'success'
            )
            getImage()
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


    const StatusUpdate = async (data) => {
         getImage();
        let filterData = image.filter((p)=>p.status==1)
if(filterData.length>=5){
    Swal.fire({
        title: 'You cannot aplly more than 5 image to banner image if you want to change please remove other image first',
       
      })
}
else{

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to ${data.status === 0 ? 'Activate' : 'Deactivate'}  it for banner iamge!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Yes, ${data.status === 0 ? 'Activate' : 'Deactivate'} it!`
        }).then(async (result) => {
          if (result.isConfirmed) {

            let res = await imageStatusUpdateAction({ id: data.id, status: data.status === 0 ? '1 ' : '0' });
            if (res.success) {
              Swal.fire(
                `${data.status === 0 ? 'Activated' : 'Deactivated'}`,
    
                res.msg,
                'success'
              )
              getImage()
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
                <div className="content">
                    <div className="main-content">
                        <div className="block justify-between page-header md:flex">

                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h5 className="box-title">Banner Images List</h5>
                                        <button type="button" onClick={onOpenModal} className="ti-btn ti-btn-primary" style={{ float: 'right', marginTop: '-35px' }}>
                                            Add Images
                                        </button>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
  {image.map((i, idx) => (
    <div key={idx} style={{ position: "relative", width: "25%", height: '200px', boxSizing: "border-box", padding: "8px", margin: "0 2% 20px", border: "2px solid black", borderRadius: "10px" }}>
      <img
        src={config.imageUrl + i.image}
        alt={`Image ${idx}`}
        style={{ width: "100%", height: "calc(100% - 45px)", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
      />
      <div style={{ position: "absolute", bottom: 6, left: 45, border:'1px solid black', borderRadius:'5px'  }}>
        <button  className="btn btn-danger" onClick={()=> handleDeleteImage(i)} >
        <i class='fas fa-trash-alt'></i>
              </button>
      </div>
      <div style={{ position: "absolute", bottom: 6, right: 45, border:'1px solid black', borderRadius:'5px' }}>
      {i.status == 0 ?
              <button onClick={() => StatusUpdate(i)}  className="btn btn-danger">
                <i class="fa fa-times" aria-hidden="true"></i>
              </button> :
              i.status == 1 ?
                <button onClick={() => trueStatusUpdate(i)}   className="btn btn-success">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </button> :
                ''
            }
      </div>
    </div>
  ))}
</div>



                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={open} onClose={onCloseModal} center closeOnOverlayClick={false} closeOnEsc={false}>
               <form onSubmit={handleSubmit}>
                <label className="mb-2" htmlFor="categoryId"><h4>Add Iamges</h4>
                    </label>
                    <hr />
                    <div className="form-group mb-3">
                        <label className="mb-2" htmlFor="categoryId">
                            You can upload 5 images at a time.
                        </label><br></br>
                        <input
        type="file"
        accept="image/*"
        multiple
        required
        onChange={handleImageChange}
      />
      
        
      
    </div>

                    <button type="submit" className="btn btn-primary modal-footer">
                        Upload Images
                    </button>
                    </form>
                </Modal>
              
                <ToastContainer />
                <Footer />
            </div>
        </>
    );
};

export default BannerImage;
