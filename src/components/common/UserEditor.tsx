/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface UserEditorProps {
  content: string;
  setContent: (content: string) => void;
  setImages: (images: File[]) => void;
}

const UseEditor: React.FC<UserEditorProps> = ({
  content,
  setContent,
  setImages,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const uploadAdapter = (loader: any) => ({
    upload: () =>
      loader.file.then((file: File) => {
        setSelectedImages((prev) => [...prev, file]);

        return new Promise((resolve) => {
          const url = URL.createObjectURL(file);
          resolve({ default: url });
        });
      }),
  });

  function CustomUploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
      uploadAdapter(loader);
  }
  useEffect(() => {
    setImages(selectedImages);
  }, [selectedImages, setImages]);

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={content}
      onChange={(_, editor) => {
        setContent(editor.getData());
      }}
      onReady={(editor: any) => {
        editor.editing.view.change((writer: any) => {
          writer.setStyle(
            "min-height",
            "300px",
            editor.editing.view.document.getRoot()
          );
        });
      }}
      config={{
        extraPlugins: [CustomUploadPlugin],
      }}
    />
  );
};

export default UseEditor;
