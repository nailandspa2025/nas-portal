/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadApi } from "../../apis/upload/upload";
export const uploadImage = async (
  content: string,
  images: File[]
): Promise<string> => {
  if (images.length === 0) return content;

  const uploadedImageUrls: Record<string, string> = {};
  const tempUrlRegex =
    /blob:(https?:\/\/[a-zA-Z0-9.-]+(:\d+)?\/[a-zA-Z0-9-]+)/g;
  const tempUrls = content.match(tempUrlRegex) || [];

  if (tempUrls.length !== images.length) {
    console.warn(
      "⚠️ Warning: Mismatch between detected blob URLs and uploaded images."
    );
  }
  await Promise.all(
    images.map(async (file, index) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response: any = await UploadApi.create(formData);
        console.log("Upload response:", response);

        if (response?.succeeded && response?.data?.url) {
          uploadedImageUrls[tempUrls[index]] = response.data.url;
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    })
  );
  let updatedContent = content;
  Object.entries(uploadedImageUrls).forEach(([tempUrl, realUrl]) => {
    updatedContent = updatedContent.replace(
      new RegExp(tempUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
      realUrl
    );
  });
  return updatedContent;
};
