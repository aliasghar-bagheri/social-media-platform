import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createPortal } from "react-dom";
import Dialog from "../shared/Dialog";
import Heading from "../shared/Heading";

const DeletePost = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleDeletePost = () => {
    setIsDeleting(true);
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        size="icon"
        className="bg-dark-3 hover:bg-dark-4">
        <img src="/assets/icons/delete.svg" alt="delete" />
      </Button>
      {showDialog &&
        createPortal(
          <Dialog onClose={handleCloseDialog}>
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="w-full max-w-2xl space-y-6 rounded-xl bg-dark-3 p-5">
              <Heading variant="h3-bold">Delete Post</Heading>
              <p className="base-regular text-light-2">
                By approving this post, it will be permanently deleted and cannot be
                recovered. are you sure ?
              </p>
              <div className="flex w-full items-center justify-end gap-3">
                <Button className="shadcn-btn_ghost" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="disabled:opacity-60"
                  disabled={isDeleting}
                  onClick={handleDeletePost}>
                  Delete
                </Button>
              </div>
            </div>
          </Dialog>,
          document.body,
        )}
    </>
  );
};

export default DeletePost;
