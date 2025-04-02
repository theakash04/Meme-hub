import React, { useContext, useEffect, useState } from "react";
import CanvasContext from "../context/canvaContext";

function FileUploader() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const canvaRef = useContext(CanvasContext);

  // useEffect(() => {
  //   if (imgSrc) {
  //     const img = new Image();
  //     img.src = imgSrc;
  //     img.onload = () => {
  //       const ctx = canvaRef.current?.getContext("2d");
  //       if (ctx) {
  //         ctx.drawImage(
  //           img,
  //           0,
  //           0,
  //           canvaRef.current.width,
  //           canvaRef.current.height
  //         );
  //       }
  //     };
  //   }
  // }, [imgSrc, canvaRef]);

  function FileHandler(file: File) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // add a notify here
      alert("Please upload a valid image file");
    }
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      FileHandler(e.dataTransfer.files[0]);
    }
  }
  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function fileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      FileHandler(e.target.files[0]);
    }
  }

  return (
    <div id="file-uploader">
      {!imgSrc ? (
        <div id="drop-zone" onDrop={dropHandler} onDragOver={dragOverHandler}>
          Drop Your Image
          <br />
          <span>-- or --</span>
          <div>Click to Upload</div>
          <input type="file" accept="image/png" onChange={fileChangeHandler} />
        </div>
      ) : (
        <div id="preview">
          <img src={imgSrc} alt="Preview" width={200}/>
          <button
            onClick={() => {
              setImgSrc(null);
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
