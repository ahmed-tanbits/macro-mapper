"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const NewPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
    },
  });

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-3">
            Set New Password
          </h2>
          <p className="text-[#425583] text-sm font-normal">
            Enter your new password to complete the reset process
          </p>

          <form
            onSubmit={formik.handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:gap-5"
          >
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label
                htmlFor="password"
                className="text-[#2E3139] text-xs font-normal"
              >
                New Password
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </fieldset>

            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label
                htmlFor="confirmPassword"
                className="text-[#2E3139] text-xs font-normal"
              >
                Confirm New Password
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
                  placeholder="Confirm new password"
                  className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
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
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 transition"
            >
              Save New Password
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6">
            <p className="text-center text-sm text-[#425583] font-normal">
              Remember old password?{" "}
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
        // label="The Ultimate Diet Tool"
        // para="Search thousands of products by calories, macronutrients, allergies and location. Finding foods that meet your diet has never been easier."
      />
    </section>
  );
};

export default NewPassword;
