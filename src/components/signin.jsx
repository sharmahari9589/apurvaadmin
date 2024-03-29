import React, { useEffect, useState } from "react";
import config from "../config/config";
import { Formik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { LoginAction } from "../Action/user.action";
import { SigninSchema } from "../validations/signin";
import { Form } from "react-bootstrap";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LogoImage from '../logo-search-grid-1x-removebg-preview.png';


const Login = () => {
  const loginDetails = !Cookies.get("loginSuccessFarfetchAdmin")
    ? []
    : JSON.parse(Cookies.get("loginSuccessFarfetchAdmin"));

  useEffect(() => {
    if (loginDetails?.user) {
      window.location.href = `${config.baseurl}dashboard`;
    }
  }, [loginDetails]);

  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const SubmitForm = async (formData) => {
    setisLoading(true);
    let res = await LoginAction(formData);
    if (res.success) {
      toast.success(res.msg);
      setisLoading(false);
      Cookies.set("loginSuccessFarfetchAdmin", JSON.stringify(res.data));
      setTimeout(() => {
        window.location.href = `${config.baseurl}dashboard`;
      }, 1000);
    } else {
      setisLoading(false);
      toast.error(res.msg);
    }
  };

  return (
    <main id="content" className="w-full max-w-md mx-auto p-6">
      <Toaster />

      <a href="javascript:void(0);" className="header-logo">
        <h1
          className="text-center"
          style={{ fontSize: "20px", marginTop: "10px" }}
        >
          {/* <img src={LogoImage} alt="Apporva Electric" style={{ marginLeft: "50px" }} /> */}
          <p className="font-bold text-gray-800" style={{ marginLeft: "0px", fontSize:"40px",color:"black" ,marginTop:"6 0px"}}>Apurva Electrical</p>
          
        </h1>
      </a>
      <div className="mt-7 bg-white rounded-sm shadow-sm dark:bg-bgdark">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in to Admin Panel
            </h1>
          </div>
          <div className="mt-5">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={SigninSchema}
              onSubmit={(values) => {
                SubmitForm(values);
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
              }) => (
                <>
                  {/* Form */}
                  <Form onSubmit={handleSubmit}>
                    <div className="grid gap-y-4">
                      {/* Form Group */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm mb-2 dark:text-white"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="email"
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                          />
                        </div>
                        <span className="text-danger">
                          {errors.email && touched.email ? (
                            <div>{errors.email}</div>
                          ) : null}
                        </span>
                      </div>
                      {/* End Form Group */}
                      {/* Form Group */}
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                            Password
                          </label>

                        </div>
                        <div className="relative pass_field">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                          />
                          <span
                            onClick={togglePasswordVisibility}
                            className="cursor-pointer text-primary dark:text-white"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye className="eyecolor"/>}
                          </span>
                        </div>
                        <span className="text-danger">
                          {errors.password && touched.password ? <div>{errors.password}</div> : null}
                        </span>
                      </div>
                      {/* End Form Group */}
                      {isLoading ? (
                        <button
                          type="submit"
                          disabled
                          className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-sm border border-transparent font-semibold bg-primary text-white hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 transition-all text-sm dark:focus:ring-offset-white/10"
                        >
                          <span className="icon"> </span> Processing... &nbsp;{" "}
                          <i
                            className="fa fa-spinner fa-spin"
                            style={{ fontSize: "24px" }}
                          ></i>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-sm border border-transparent font-semibold bg-primary text-white hover:bg-primary focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 transition-all text-sm dark:focus:ring-offset-white/10"
                        >
                          Sign in
                        </button>
                      )}
                    </div>
                  </Form>
                </>
              )}
            </Formik>
            {/* End Form */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
