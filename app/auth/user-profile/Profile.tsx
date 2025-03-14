"use client";
import React, { useState } from "react";
import Banner from "../Banner";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/supabaseClient";
import Spinner from "@/app/components/Spinner";
import { useToast } from "@/app/hooks/useToast";
import CancelSubscriptionModal from "@/app/subscription/components/CancelSubscriptionModal";

interface PasswordValues {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface ProfileValues {
  fullName: string;
  email: string;
}

const Profile: React.FC = () => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { session, user, setUser,fetchSessionAndSubscription } = useAuth(); // ✅ Get latest token
  const { toast } = useToast();

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleProfileSubmit = async (
    values: ProfileValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ): Promise<void> => {
    if (!session) {
      toast({
        title: "Error!",
        description: `You are not authenticated!`,
        variant: "destructive", // Red error toast
      });
      return;
    }

    try {
      // 🔄 Refresh session before updating user
      const { data, error: refreshError } =
        await supabase.auth.refreshSession();
      if (refreshError) {
        toast({
          title: "Error!",
          description: `Session refresh failed: ${refreshError.message}`,
          variant: "destructive", // Red error toast
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        email: values.email,
        data: { fullName: values.fullName },
      });

      if (error) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive", // Red error toast
        });
      } else {
        toast({
          title: "Success!",
          description: "Profile updated successfully",
          variant: "success", // Normal success toast
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  const handlePasswordSubmit = async (
    values: PasswordValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ): Promise<void> => {
    if (!session) {
      toast({
        title: "Error!",
        description: `You are not authenticated!`,
        variant: "destructive", // Red error toast
      });
      return;
    }

    try {
      // 🔄 Refresh session before updating user
      const { data, error: refreshError } =
        await supabase.auth.refreshSession();
      if (refreshError) {
        toast({
          title: "Error!",
          description: `Session refresh failed: ${refreshError.message}`,
          variant: "destructive", // Red error toast
        });
        return;
      }
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive", // Red error toast
        });
      } else {
        toast({
          title: "Success!",
          description: "Password updated successfully",
          variant: "success", // Red error toast
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Something went wrong",
        variant: "destructive", // Red error toast
      });
    }
    setSubmitting(false);
  };

  const handleCancelSubscription = async () => {
    if (!user) {
      toast({
        title: "Error!",
        description: "You need to be logged in!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }), // Pass user's ID
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Subscription canceled successfully!",
          variant: "success",
        });
        // 🔹 Update local state (if needed)
        fetchSessionAndSubscription();
        // setUser((prevUser: any) => ({
        //   ...prevUser,
        //   subscription: { ...prevUser.subscription, status: "canceled" },
        //   hasSubscription: false, // Update flag
        // }));
      } else {
        toast({
          title: "Error!",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Cancel Subscription Error:", error);
      toast({
        title: "Error!",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelSubscriptionModal = (state: boolean) => {
    setOpen(state);
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

          <div className="mt-4 flex flex-col gap-3 sm:gap-5">
            <Formik<{ fullName: string; email: string }>
              initialValues={{
                fullName: user?.user_metadata?.fullName || "",
                email: user?.email || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleProfileSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form className="mt-4 flex flex-col gap-3 sm:gap-5">
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.fullName}
                      />
                    </div>
                    {touched.fullName && errors.fullName ? (
                      <div className="text-red-500 text-sm ml-2 mt-1">
                        {errors.fullName}
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

                  <button
                    type="submit"
                    className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 disabled:bg-green-600 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : "Update Details"}
                  </button>
                </Form>
              )}
            </Formik>

            <Formik
              initialValues={{
                currentPassword: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                currentPassword: Yup.string().required(
                  "Current Password is required"
                ),
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("New Password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("password")], "Passwords must match")
                  .required("Confirm Password is required"),
              })}
              onSubmit={handlePasswordSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form className="mt-4 flex flex-col gap-3 sm:gap-5">
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
                        type={
                          showPassword.currentPassword ? "text" : "password"
                        }
                        placeholder="Current Password"
                        className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.currentPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            currentPassword: !showPassword.currentPassword,
                          })
                        }
                        className="absolute right-4 text-gray-500"
                      >
                        {showPassword.currentPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    {touched.currentPassword && errors.currentPassword ? (
                      <div className="text-red-500 text-sm ml-2 mt-1">
                        {errors.currentPassword}
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
                        type={showPassword.newPassword ? "text" : "password"}
                        placeholder="Your new password"
                        className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            newPassword: !showPassword.newPassword,
                          })
                        }
                        className="absolute right-4 text-gray-500"
                      >
                        {showPassword.newPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    {touched.password && errors.password ? (
                      <div className="text-red-500 text-sm ml-2 mt-1">
                        {errors.password}
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
                        type={
                          showPassword.confirmNewPassword ? "text" : "password"
                        }
                        placeholder="Confirm your new password"
                        className="border-0 shadow-none outline-none w-full text-sm font-normal text-[#899CC9]"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirmNewPassword:
                              !showPassword.confirmNewPassword,
                          })
                        }
                        className="absolute right-4 text-gray-500 ml-2 mt-1"
                      >
                        {showPassword.confirmNewPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <div className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </div>
                    ) : null}
                  </fieldset>

                  <button
                    type="submit"
                    className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 disabled:bg-green-600 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : "Update Password"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-4 text-[#425583] text-sm font-normal">
              {user?.hasSubscription ? "Your Subscription" : "Try Premium"}
            </p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <button
            type="submit"
            onClick={() => {
              if (user?.hasCanceledSubscription) {
                router.push("/auth/upgrade-to-premium");
              } else {
                handleOpenCancelSubscriptionModal(true);
              }
            }}
            className={`w-full py-3 rounded-full font-medium text-sm transition ${user?.hasCanceledSubscription
              ? "bg-[#FFD200] text-[#FFFFFF]"
              : "bg-[#940000] text-white"
              }`}
          >
            {loading ? (
              <Spinner />
            ) : user?.hasCanceledSubscription ? (
              "Upgrade to Premium"
            ) : (
              "Cancel Subscription"
            )}
          </button>
        </div>
      </div>
      <CancelSubscriptionModal
        open={open}
        setOpen={handleOpenCancelSubscriptionModal}
        handleCancelSubscription={handleCancelSubscription}
      />
      <Banner />
    </section>
  );
};

export default Profile;
