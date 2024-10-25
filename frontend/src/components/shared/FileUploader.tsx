import { memo, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

type FileUploaderProps = {
  image_url?: string;
  onChange: (imageFileAddress: string) => void;
};

const FileUploader = memo(({ image_url, onChange }: FileUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(image_url || "");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileAddresse = URL.createObjectURL(acceptedFiles[0]);

    onChange(fileAddresse);

    setImageUrl(fileAddresse);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".svg", ".png", ".jpg", ".jpeg"] },
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone-container transition-colors duration-150 ${isDragActive && "bg-dark-4"}`}>
      <input {...getInputProps()} />
      {imageUrl ? (
        <div className="h-full w-full">
          <img src={imageUrl} alt="photo" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img src="/assets/icons/file-upload.svg" alt="upload" />
          <p className="body-bold">Drag photos here</p>
          <span className="small-regular text-light-4">SVG, PNG, JPG, JPEG</span>
          <Button className="shadcn-btn_ghost">Select from computer</Button>
        </div>
      )}
    </div>
  );
});

export default FileUploader;
