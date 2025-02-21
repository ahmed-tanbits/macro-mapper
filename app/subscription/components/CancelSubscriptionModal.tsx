"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";

interface CancelSubscriptionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleCancelSubscription: () => Promise<void>;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  open,
  setOpen,
  handleCancelSubscription,
}) => {
  const [loading, setLoading] = useState(false);
  const handleCancel = async () => {
    setLoading(true);
    await handleCancelSubscription();
    setLoading(false);
    setOpen(false); // Close modal after successful cancellation
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-md p-6 rounded-lg shadow-lg flex flex-col items-center sm:w-full">
        <XCircle className="h-12 w-12 text-red-500" />
        <DialogTitle className="text-lg font-semibold text-gray-900">
          Cancel Subscription
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 text-center">
          Are you sure you want to cancel your subscription? You will lose
          access to premium features.
        </DialogDescription>

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => setOpen(false)}
          >
            No, Keep
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-600"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ?
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Cancelling...
              </>
              : "Yes, Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
