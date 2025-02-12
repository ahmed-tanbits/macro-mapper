"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";


// Define TypeScript interface for form values
interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Validation Schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    terms: Yup.bool().oneOf([true], "You must agree to the terms"),
  });

  // Initial values
  const initialValues: SignupFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  };

  // Handle form submission
  const handleSignup = async (values: SignupFormValues) => {
    setMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  console.log("message =>", message)

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-3">
            Get Started Now
          </h2>
          <p className="text-[#425583] text-sm font-normal">Let’s create your account</p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
             {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form
              className="mt-4 flex flex-col gap-3 sm:gap-5"
            >
              <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
                <label htmlFor="fullName" className="text-[#2E3139] text-xs font-normal">
                  Full Name
                </label>
                <div className="border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                  <span>
                    <Image
                      src="/person-outline.png"
                      alt="Profile Icon"
                      height={16}
                      width={16}
                    />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName}
                  />
                </div>
                {touched.fullName && errors.fullName ? (
                  <div className="text-red-500 text-sm">
                    {errors.fullName}
                  </div>
                ) : null}
              </fieldset>

              <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
                <label htmlFor="email" className="text-[#2E3139] text-xs font-normal">
                  Email
                </label>
                <div className="border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                  <span>
                    <Image
                      src="/Vector.png"
                      alt="Email Icon"
                      height={16}
                      width={16}
                    />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                {touched.email && errors.email ? (
                  <div className="text-red-500 text-sm">
                    {errors.email}
                  </div>
                ) : null}
              </fieldset>

              <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
                <label htmlFor="password" className="text-[#2E3139] text-xs font-normal">
                  Password
                </label>
                <div className="relative border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                  <span>
                    <Image
                      src="/lock-outline.png"
                      alt="Password Lock Icon"
                      height={16}
                      width={16}
                    />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Set your password"
                    className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.password && errors.password ? (
                  <div className="text-red-500 text-sm">
                    {errors.password}
                  </div>
                ) : null}
              </fieldset>

              <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
                <label
                  htmlFor="confirmPassword"
                  className="text-[#2E3139] text-xs font-normal"
                >
                  Confirm Password
                </label>
                <div className="relative border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                  <span>
                    <Image
                      src="/lock-outline.png"
                      alt="Password Lock Icon"
                      height={16}
                      width={16}
                    />
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {touched.confirmPassword &&
                  errors.confirmPassword ? (
                  <div className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </div>
                ) : null}
              </fieldset>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.terms}
                />
                <label htmlFor="terms" className="text-sm text-[#2E3139] font-normal">
                  I agree to{" "}
                  <Link href="#" className="text-[#08C600] underline text-sm font-medium">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {touched.terms && errors.terms ? (
                <div className="text-red-500 text-sm">{errors.terms}</div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 transition"
              >
                Sign up
              </button>
            </Form>
             )}
          </Formik>
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-4 text-gray-500 text-sm font-normal">or</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p className=" text-center text-sm text-[#425583] font-normal">
              Already have an account?{" "}
            </p>
            <Link
              href="/auth/login"
              className="text-[#08C600] font-medium underline text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <Banner
        label="The Ultimate Diet Tool"
        para="Search thousands of products by calories, macronutrients, allergies and location. Finding foods that meet your diet has never been easier."
      />
    </section>
  );
};

export default Signup;
