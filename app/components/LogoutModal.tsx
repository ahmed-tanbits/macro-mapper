import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function LogoutModal({ open, setOpen }: LogoutModalProps) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-md p-6 rounded-lg shadow-lg flex flex-col items-center sm:w-full">
        <LogOut className="text-red-500 w-10 h-10" />
        <DialogTitle className="text-lg font-semibold">Logout</DialogTitle>
        <p className="text-sm text-gray-500 text-center">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-end gap-3 mt-4 w-full">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-600 flex items-center gap-2"
            onClick={handleLogOut}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
