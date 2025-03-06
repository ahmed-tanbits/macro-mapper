"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";

export default function CancelPage() {
    const router = useRouter();
    const [redirectCountdown, setRedirectCountdown] = useState(3);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setLoading(false); // Hide spinner when countdown reaches 1
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const timeout = setTimeout(() => router.push("/"), 3000);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
            <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
                {loading && <Spinner />} {/* Show spinner only if loading is true */}
                <h1 className="text-xl font-semibold text-gray-800">
                    ❌ Subscription canceled. Redirecting to home...
                </h1>
                <p className="text-gray-600 mt-2">
                    Redirecting in {redirectCountdown}...
                </p>
            </div>
        </div>
    );
}
