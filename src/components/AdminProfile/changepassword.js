import React, { useState } from 'react';
import Header from '../../directives/header';
import Footer from '../../directives/footer';
import Sidebar from '../../directives/sidebar';
import { adminChangePasswordAction } from '../../Action/user.action';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import config from '../../config/config';
import { useFormik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Togglesidebar from "../../directives/togglesidebar";


const loginData = Cookies.get('loginSuccessFarfetchAdmin')
  ? JSON.parse(Cookies.get('loginSuccessFarfetchAdmin'))
  : [];


const Changepassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },


    validate: (values) => {
      const errors = {};

      if (!values.currentPassword) {
        errors.currentPassword = 'Old Password is required';
      }
      if (!values.newPassword) {
        errors.newPassword = 'New Password is required';
      }
      if (values.currentPassword == values.newPassword) {
        errors.newPassword = 'New Password must be different from the Old Password.';
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
      }
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'Confirm Password does not match';
      }

      return errors;
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const toggleShowPassword = (field) => {
    switch (field) {
      case 'currentPassword':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (values) => {
    values.email = loginData.adminEmail;
    console.log('valuesvaluesvalues', values)

    try {
      let res = await adminChangePasswordAction(values);

      if (res.success) {
        toast.success(res.msg);
        formik.resetForm();
        formik.setSubmitting(false);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      toast.error('An error occurred while changing the password.');
    }
  };


  return (
    <>
      <div className="wrapper">
        <div id="websidebar" className="">
          <Sidebar />
        </div>

        <div id="mobilesidebar" className="">
          {/* <Togglesidebar /> */}
          <Togglesidebar />
        </div>
        <Header />
        <Toaster />
        {/* <Sidebar /> */}
        <div className="content-wrapper">
          <div className="container-full">
            <div className="content-header">

            </div>
            <section className="content">
              <div className="main-content">
                <div className="block justify-between page-header md:flex">

                </div>
                <div className="row">
                  <div className="col-lg-12 col-12">
                    <div className="box">
                      <div className="box-header with-border">
                        <h4 className="box-title">Change password</h4>
                        {/* <a href={`${config.baseurl}dashboard`}>
                        <span><button style={{ float: 'right' }} type="button" class="waves-effect waves-light btn btn-primary btn-sm" aria-expanded="false">Back</button></span>
                      </a> */}
                      </div>
                      <div className="row mt-20 mb-50">
                        <div className="col-md-3"></div>
                        <div className="col-md-6 px-4">
                          <form onSubmit={formik.handleSubmit}>
                            <div className="form-group row mb-1">
                              <label className="col-form-label col-md-12">
                                Old Password
                              </label>
                              <div className="col-md-12">
                                <div className='fieldbox'>
                                  <input
                                    className="form-control"
                                    // type="password"
                                    name="currentPassword"
                                    value={formik.values.currentPassword}
                                    placeholder="Enter current password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    onChange={formik.handleChange}

                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm"
                                    onClick={() => toggleShowPassword('currentPassword')}
                                  >
                                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                              </div>
                              <span className="validationErr text-danger">
                                {formik.errors.currentPassword}
                              </span>
                            </div>
                            <div className="form-group row mb-1">
                              <label className="col-form-label col-md-12">
                                New Password{' '}
                              </label>
                              <div className="col-md-12">
                                <div className='fieldbox'>
                                  <input
                                    className="form-control"
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formik.values.newPassword}
                                    placeholder="Enter new password"
                                    onChange={formik.handleChange}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm"
                                    onClick={() => toggleShowPassword('newPassword')}
                                  >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                              </div>
                              <span className="validationErr text-danger">
                                {formik.errors.newPassword}
                              </span>
                            </div>
                            <div className="form-group row mb-4">
                              <label className="col-form-label col-md-12">
                                Confirm Password
                              </label>
                              <div className="col-md-12">
                                <div className='fieldbox'>
                                  <input
                                    className="form-control"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    placeholder="Enter confirm password"
                                    onChange={formik.handleChange}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm"
                                    onClick={() => toggleShowPassword('confirmPassword')}
                                  >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                              </div>
                              <span className="validationErr text-danger">
                                {formik.errors.confirmPassword}
                              </span>
                            </div>
                            <div className="text-center mb-3">
                              <button
                                type="submit"
                                className="btn btn-primary"
                              // disabled={formik.isSubmitting} 
                              >
                                Change Password
                              </button>

                            </div>
                          </form>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* /.content */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Changepassword;


