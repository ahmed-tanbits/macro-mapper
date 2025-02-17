"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Spinner from "@/app/components/Spinner";
import withAuthRedirect from "@/app/hoc/withAuthRedirect";
import { useToast } from "@/app/hooks/useToast";

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
          email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });
        const data = await res.json();
        if (data.message) {
          toast({
            title: "Success!",
            description: data.message,
            variant: "success", // Normal success toast
          });
          setMessage(data.message);
          // setError("");
        } else if (data.error) {
          toast({
            title: "Error!",
            description: data.error,
            variant: "destructive", // Red error toast
          });
          setError(data.error);
          // setMessage("");
        }
      } catch (err) {
        setError("Something went wrong");
        setMessage("");
      } finally {
        setLoading(false)
      }
    },
  });

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-3">
            Forgot Password?
          </h2>
          <p className="text-[#425583] text-sm font-normal">
            Enter your email to reset your password
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:gap-5"
          >
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm ml-2 mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
              <div className="ml-2 mt-1">
                {message && <div className="text-green-500 text-sm">{message}</div>}
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 disabled:bg-green-600 transition"
              disabled={loading}
            >
              {loading ?
                <Spinner />
                : "Submit"
              }
            </button>
          </form>
        </div>
      </div>

      <Banner
        label="The Ultimate Diet Tool"
        para="Search thousands of products by calories, macronutrients, allergies and location. Finding foods that meet your diet has never been easier."
      />
    </section>
  );
};

export default withAuthRedirect(ForgotPassword);

