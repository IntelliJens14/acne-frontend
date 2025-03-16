import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Camera, Upload, AlertCircle, Loader2, Circle, XCircle } from "lucide-react";

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CameraPreview = styled.div`
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
`;

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: #3b82f6;
  }
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem;

  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoadingMessage = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AcneSeverityDetector = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // Add state for result
  const videoRef = useRef(null);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setError(null);
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // Capture Image
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      analyzeImage(imageDataUrl);
    }
  };

  // Analyze Image (Send to Backend)
  const analyzeImage = async (image) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert image to a file (if it's a data URL)
      const blob = await fetch(image).then((res) => res.blob());
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("image", file);

      // Send the image to the backend
      const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image.");
      }

      const result = await response.json();
      setResult(result); // Set the result from the backend
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Invalid file type. Please upload an image file (JPEG, PNG, etc.).");
    }
  };

  return (
    <Container>
      <Title>Acne Severity Detector</Title>
      <Subtitle>Upload or capture an image to analyze acne severity</Subtitle>

      {/* Camera Section */}
      <Section>
        <SectionTitle>Use Camera</SectionTitle>
        <CameraPreview>
          {cameraActive ? (
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <p>Camera preview will appear here</p>
          )}
        </CameraPreview>
        {cameraActive ? (
          <div>
            <Button onClick={captureImage}>
              <Circle size={20} /> Capture Image
            </Button>
            <Button onClick={stopCamera}>
              <XCircle size={20} /> Stop Camera
            </Button>
          </div>
        ) : (
          <Button onClick={startCamera}>
            <Camera size={20} /> Start Camera
          </Button>
        )}
      </Section>

      {/* Upload Section */}
      <Section>
        <SectionTitle>Upload an Image</SectionTitle>
        <UploadArea>
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            <Upload size={40} color="#666" />
            <p>Drag & Drop or Click to Upload</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
        </UploadArea>
      </Section>

      {/* Error Message */}
      {error && (
        <ErrorMessage>
          <AlertCircle size={20} /> {error}
        </ErrorMessage>
      )}

      {/* Loading Message */}
      {isLoading && (
        <LoadingMessage>
          <Loader2 size={20} className="animate-spin" /> Analyzing image... Please wait.
        </LoadingMessage>
      )}

      {/* Display Result */}
      {result && (
        <Section>
          <SectionTitle>Analysis Result</SectionTitle>
          <p>Severity Level: {result.severityLevel}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          <p>{result.message}</p>
        </Section>
      )}
    </Container>
  );
};

export default AcneSeverityDetector;