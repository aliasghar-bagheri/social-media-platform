import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import Dialog from "@/components/shared/Dialog";
import { useState } from "react";
import Heading from "@/components/shared/Heading";
import EditPasswordForm from "@/forms/profile/EditPasswordForm";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { toast } = useToast();

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleForgotPassword = () => {
    toast({
      title: "Change Password",
      description: "The password change link was sent to ali********@gmail.com.",
    });
    setShowDialog(false);
  };

  const handleChangePassword = () => {
    console.log("change");
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
              <EditPasswordForm
                handleForgotPassword={handleForgotPassword}
                handleEditPassword={handleChangePassword}
              />
            </div>
          </Dialog>,
          document.body,
        )}
    </>
  );
};

export default ChangePassword;
