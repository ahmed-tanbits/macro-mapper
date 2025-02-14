import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo: string = "/auth/login"
): ComponentType<P> {
  return function WrappedWithAuth(props: P) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace(redirectTo); // 🔄 Redirects unauthenticated users
      }
    }, [user, router]);

    // ⏩ If user is not logged in, prevent component from rendering
    if (!user) return null;

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
