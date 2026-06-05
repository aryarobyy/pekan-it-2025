import { useState } from "react";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result as string); 
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImgUrl(null);
      setFile(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl, file };
};

export default usePreviewImg;
