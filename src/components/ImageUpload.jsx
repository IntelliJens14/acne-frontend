import { useState } from "react";
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import Button from "./Button";
import styled from "styled-components";

// Styled Components
const UploadContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  border: 2px dashed #d1d5db;
  transition: border-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ErrorContainer = styled.div`
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadText = styled.p`
  color: #6b7280;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateAndSetFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result);
      onUpload(reader.result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <UploadContainer onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <Title>Upload an Image</Title>

      {error && (
        <ErrorContainer>
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </ErrorContainer>
      )}

      {selectedFile ? (
        <div>
          <ImagePreview src={selectedFile} alt="Uploaded" />
          <Button onClick={removeImage} bgColor="#374151" hoverBgColor="#1f2937">
            <Trash2 className="w-5 h-5 mr-2" />
            Remove Image
          </Button>
        </div>
      ) : (
        <>
          <UploadLabel>
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <UploadText>Drag & Drop or Click to Upload</UploadText>
            <HiddenInput type="file" accept="image/*" onChange={handleFileChange} />
          </UploadLabel>
          <Button bgColor="#3b82f6" hoverBgColor="#2563eb" className="mt-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Choose File
          </Button>
        </>
      )}
    </UploadContainer>
  );
};

export default ImageUpload;