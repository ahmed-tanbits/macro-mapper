"use client";
import React, { useState, useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Banner from "../Banner";
import Link from "next/link";
import { useToast } from "@/app/hooks/useToast";
import { supabase } from "@/supabaseClient";
import Spinner from "@/app/components/Spinner";

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const passwordResetAllowed = sessionStorage.getItem("passwordResetAllowed");
      if (!passwordResetAllowed) {
        // ❌ If there's no flag in sessionStorage, redirect away
        router.replace("/");
        return;
      }

      // ✅ Allow access only if flag is set, then remove it after load
      sessionStorage.removeItem("passwordResetAllowed");
      setIsAuthorized(true);
    };

    checkAccess();
  }, [router]);

  if (!isAuthorized) {
    return null; // Prevents rendering if unauthorized
  }
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw new Error(error.message);

      toast({
        title: "Success!",
        description: "Password reset successful! Redirecting...",
        variant: "success",
      });
      await supabase.auth.signOut();
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
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
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (

          <Form className="mt-4 flex flex-col gap-3 sm:gap-5">
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label htmlFor="password" className="text-[#2E3139] text-xs font-normal">
                New Password
              </label>
              <div className="relative border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                <span>
                  <Image src="/lock-outline.png" alt="Password Lock Icon" height={16} width={16} />
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
                <div className="text-red-500 text-sm ml-2 mt-1">{errors.password}</div>
              ) : null}
            </fieldset>

            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label htmlFor="confirmPassword" className="text-[#2E3139] text-xs font-normal">
                Confirm New Password
              </label>
              <div className="relative border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                <span>
                  <Image src="/lock-outline.png" alt="Password Lock Icon" height={16} width={16} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
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
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword ? (
                <div className="text-red-500 text-sm ml-2 mt-1">{errors.confirmPassword}</div>
              ) : null}
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 disabled:bg-green-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ?
                <Spinner />
                : "Save New Password"
              }
            </button>
          </Form>
          )}
          </Formik>
          <div className="flex items-center justify-center gap-2 pt-6">
            <p className=" text-center text-sm text-[#425583] font-normal">
              Remember old password?{" "}
            </p>
            <Link
              href="/auth/login"
              onClick={async (e) => {
                e.preventDefault(); // Prevent default navigation
                await supabase.auth.signOut(); // Log out the user
                router.push("/auth/login"); // Redirect to login page
              }}
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

export default ResetPassword;
