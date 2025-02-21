"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/AuthContext";
import withAuthRedirect from "@/app/hoc/withAuthRedirect";
import { useToast } from "@/app/hooks/useToast";

// Define TypeScript interface for form values
interface LoginFormValues {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize Next.js router
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const { toast } = useToast();


  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (values: LoginFormValues) => {
    setMessage(null);
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive", // Red error toast
        });
        return;
      }
      setSession(data.session); // ✅ Store session in context
       toast({
         title: "Success!",
         description: "Logged in successfully",
         variant: "success", // Green success toast
       });
      router.push("/"); // ✅ Navigate to home after login
    } catch (error) {
      toast({
        title: "Error!",
        description: "Something went wrong",
        variant: "destructive", // Red error toast
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
            Welcome Back
          </h2>
          <p className="text-[#425583] text-sm font-normal">
            Sign in to your account
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ values, handleBlur, handleChange, errors, touched }) => (
              <Form
                className="mt-4 flex flex-col gap-3 sm:gap-5"
              >
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
                      className="border-0 shadow-none outline-none w-full  text-sm font-normal text-[#899CC9]"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                  </div>
                  {touched.email && errors.email ? (
                    <div className="text-red-500 text-sm ml-2 mt-1">
                      {errors.email}
                    </div>
                  ) : null}
                </fieldset>

                <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
                  <label
                    htmlFor="password"
                    className="text-[#2E3139] text-xs font-normal"
                  >
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
                      className="border-0 shadow-none outline-none w-full  text-sm font-normal text-[#899CC9]"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-500"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-sm ml-2 mt-1">
                      {errors.password}
                    </div>
                  ) : null}
                </fieldset>
                <div className="flex items-center gap-2 justify-between">
                  <div className=" flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500 bg-primary-600 cursor-pointer"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    // checked={values?.terms}
                    />
                    <label
                      htmlFor=""
                      className="text-sm text-[#2E3139] font-normal"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-[#08C600] underline text-sm font-medium"
                  >
                    Forgot Password
                  </Link>
                </div>
                {/* {touched?.terms && errors?.terms ? (
                  <div className="text-red-500 text-sm">{errors?.terms}</div>
                ) : null} */}
                <button
                  type="submit"
                  className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 disabled:bg-green-600 transition"
                >
                  {loading ?
                    <Spinner />
                    : "Sign in"
                  }
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
              Don’t have an account?{" "}
            </p>
            <Link
              href="/auth/signup"
              className="text-[#08C600] font-medium underline text-sm"
            >
              Sign up
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

export default withAuthRedirect(LogIn);
