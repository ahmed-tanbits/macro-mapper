"use client";
import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

function withAuthRedirect<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo: string = "/"
): ComponentType<P> {
  return function WrappedWithRedirect(props: P) {
    const { user } = useAuth();
    const router = useRouter();

    // ⏩ Instant redirect before rendering anything
    if (user) {
      router.replace(redirectTo);
      return null; // Prevents login page from flashing
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthRedirect;
