import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import Dialog from "@/components/shared/Dialog";
import { useState } from "react";
import Heading from "@/components/shared/Heading";
import EditPasswordForm from "@/forms/profile/EditPasswordForm";

const ChangePassword = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Button onClick={() => setShowDialog(true)} className="shadcn-btn_white">
        Change Password
      </Button>
      {showDialog &&
        createPortal(
          <Dialog onClose={handleCloseDialog}>
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="w-full max-w-2xl space-y-6 rounded-xl bg-dark-2 p-10">
              <Heading variant="h3-bold">Update Password</Heading>
              <EditPasswordForm />
            </div>
          </Dialog>,
          document.body,
        )}
    </>
  );
};

export default ChangePassword;
