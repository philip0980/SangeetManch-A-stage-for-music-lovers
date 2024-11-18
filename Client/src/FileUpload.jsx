import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "audio/mpeg") {
      setFile(selectedFile);
      setFilename(selectedFile.name);
      setErrorMessage(null); // Clear previous error
    } else {
      setErrorMessage("Please select an MP3 file.");
      setFile(null);
      setFilename("Choose File");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please upload a valid MP3 file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data } = res;
      setUploadedFile(data);
      setErrorMessage(null); // Clear error message after successful upload
    } catch (err) {
      console.log(err);
      setErrorMessage("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
            accept="audio/mpeg" // Accept only MP3 files
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>

      {errorMessage && (
        <div className="alert alert-danger mt-4">{errorMessage}</div>
      )}

      {uploadedFile ? (
        <div className="mt-5">
          <h3 className="text-center">File uploaded successfully</h3>
          <audio controls>
            <source
              src={`http://localhost:8000/audio/${uploadedFile._id}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
