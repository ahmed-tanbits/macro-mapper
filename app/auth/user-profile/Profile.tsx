"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { useFormik } from "formik";
import * as Yup from "yup";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";


const Profile: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      currentPassword: Yup.string().required("Current Password is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      if (!token) {
        alert("You are not authenticated!");
        return;
      }
  
      try {
        const res = await fetch("/api/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ Use latest token
          },
          body: JSON.stringify(values),
        });
  
        const data = await res.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert("Profile updated successfully");
          router.push("/");
        }
      } catch (error) {
        alert("Something went wrong");
      }
    },
    
  });


  const handleSubscriptionToggle = () => {
    setIsSubscribed((prev) => !prev);
  };

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-3">
            My Profile
          </h2>
          <p className="text-[#425583] text-sm font-normal">
            Edit your profile and billing here.
          </p>

          <form
            onSubmit={formik.handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:gap-5"
          >
            <h4 className="text-sm font-bold">Edit Details</h4>
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label
                htmlFor="fullName"
                className="text-[#2E3139] text-xs font-normal"
              >
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.fullName}
                </div>
              ) : null}
            </fieldset>

            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label
                htmlFor="email"
                className="text-[#2E3139] text-xs font-normal"
              >
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 transition"
            >
              Update Details
            </button>
            <h4 className="text-sm font-bold">Change Password</h4>
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label
                htmlFor="currentPassword"
                className="text-[#2E3139] text-xs font-normal"
              >
                Current Password
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
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Current Password"
                  className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.currentPassword &&
                formik.errors.currentPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.currentPassword}
                </div>
              ) : null}
            </fieldset>
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
                  placeholder="Your new password"
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
                Confirm your new password
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
                  placeholder="Confirm your new password"
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
              Update Password
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-4 text-[#425583] text-sm font-normal">
              {isSubscribed ? "Your Subscription" : "Try Premium"}
            </p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <button
            type="submit"
            onClick={handleSubscriptionToggle}
            className={`w-full py-3 rounded-full font-medium text-sm transition ${isSubscribed
                ? "bg-[#940000] text-white"
                : "bg-[#FFD200] text-[#FFFFFF]"
              }`}
          >
            {isSubscribed ? "Cancel Subscription" : "Upgrade to Premium"}
          </button>
        </div>
      </div>

      <Banner />
    </section>
  );
};

export default Profile;
