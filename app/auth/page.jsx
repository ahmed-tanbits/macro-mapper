// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "@/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function Authentication() {
//   const router = useRouter();
//   const [message, setMessage] = useState("Processing authentication...");

//   useEffect(() => {
//     const processAuth = async () => {
//       if (typeof window === "undefined") return;

//       const hash = window.location.hash.slice(1); // Remove the "#"
//       const urlParams = new URLSearchParams(hash);
//       const paramsObj = Object.fromEntries(urlParams.entries());

//       console.log("Hash Params =>", paramsObj);

//       if (paramsObj?.type === "signup") {
//         router.push("/auth/login");
//       } else if (paramsObj?.type === "recovery") {
//         router.push("/auth/new-password");
//       } else if (paramsObj?.type === "magiclink") {
//         const access_token = paramsObj?.access_token;
//         const refresh_token = paramsObj?.refresh_token;

//         if (access_token && refresh_token) {
//           await supabase.auth.setSession({ access_token, refresh_token });
//           setMessage("Authentication successful! Redirecting...");
//           setTimeout(() => router.push("/dashboard"), 2000);
//         } else {
//           setMessage("Invalid or expired link.");
//         }
//       } else {
//         setMessage("Invalid authentication request.");
//       }
//     };

//     processAuth(); // Ensure the function is called inside useEffect
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-xl font-bold">{message}</h1>
//     </div>

//   );
// }



"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function Authentication() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing authentication...");
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash.slice(1); // Remove the "#"
      const urlParams = new URLSearchParams(hash);
      const paramsObj = Object.fromEntries(urlParams.entries());

      console.log("Hash Params =>", paramsObj);

      if (paramsObj?.type === "signup") {
        setMessage("Email verified successfully! You can now log in.");
        setShowLoginButton(true);
      } else if (paramsObj?.type === "recovery") {
        router.push("/auth/new-password");
      } else if (paramsObj?.type === "magiclink") {
        const access_token = paramsObj?.access_token;
        const refresh_token = paramsObj?.refresh_token;

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setMessage("Invalid or expired link.");
          } else {
            setSession(data.session);
            setMessage("Authentication successful! Click below to proceed.");
            setShowLoginButton(true);
          }
        } else {
          setMessage("Invalid or expired link.");
        }
      } else {
        setMessage("Invalid authentication request.");
      }
    };

    processAuth();
  }, [router]);

  // Handle Login Button Click
  const handleLogin = async () => {
    if (session) {
      router.push("/home"); // Redirect user to home if session exists
    } else {
      router.push("/auth/login"); // Redirect to login if session is not set
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold text-center">{message}</h1>

      {showLoginButton && (
        <button
          onClick={handleLogin}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      )}
    </div>
  );
}
