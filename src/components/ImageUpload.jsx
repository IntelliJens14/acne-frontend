import { useState } from "react";
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import styled from "styled-components";
import Button from "./Button";

// ✅ Styled Components
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

  /* ✅ Mobile Responsive */
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const ErrorContainer = styled.div`
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  object-fit: cover;
  max-height: 300px;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const UploadText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
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
      setError("❌ Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("⚠️ File size must be under 5MB.");
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
      <Title>📸 Upload an Image</Title>

      {error && (
        <ErrorContainer>
          <AlertCircle size={18} style={{ marginRight: "6px" }} />
          {error}
        </ErrorContainer>
      )}

      {selectedFile ? (
        <div>
          <ImagePreview src={selectedFile} alt="Uploaded preview" />
          <Button onClick={removeImage}>
            <Trash2 size={18} style={{ marginRight: "6px" }} />
            Remove Image
          </Button>
        </div>
      ) : (
        <>
          <UploadLabel>
            <ImageIcon size={48} style={{ color: "#9ca3af", marginBottom: "8px" }} />
            <UploadText>Drag & Drop or Click to Upload</UploadText>
            <HiddenInput type="file" accept="image/*" onChange={handleFileChange} />
          </UploadLabel>
          <Button>
            <Upload size={18} style={{ marginRight: "6px" }} />
            Choose File
          </Button>
        </>
      )}
    </UploadContainer>
  );
};

export default ImageUpload;
