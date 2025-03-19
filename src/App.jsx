import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, Upload, XCircle } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  background-color: #3366CC;
  color: white;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 10px;
`;

const Section = styled.div`
  background-color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px dashed #e0e0e0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #3366CC;
  color: white;
  border: none;
  padding: 15px 0;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: 80%;
  margin-top: 15px;
  transition: background-color 0.2s;
  &:hover { background-color: #2855b8; }
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  width: 80%;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover { border-color: #3366CC; }
`;

const Video = styled.video`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ImagePreview = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ModelInfo = styled.div`
  background-color: #333;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
`;

function App() {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);
  
  useEffect(() => {
    async function loadModel() {
      try {
        if (!tf.ENV.get("WEBGL_VERSION")) throw new Error("WebGL not supported");
        console.log("Loading model...");
        const loadedModel = await tf.loadLayersModel('/model.json'); // 🔹 Ensure it's correctly fetched
        setModel(loadedModel);
        console.log("Model loaded successfully.");
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    }
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Acne Severity Detector</Title>
        <ModelInfo>Model Loaded: {model ? "Yes" : "No"}</ModelInfo>
      </Header>

      <Section>
        {cameraActive ? (
          <>
            <Video ref={videoRef} autoPlay playsInline />
            <Button onClick={captureImage}>Capture</Button>
          </>
        ) : (
          <Button onClick={startCamera}><Camera size={24} /> Start Camera</Button>
        )}
      </Section>

      <Section>
        <UploadArea onClick={() => document.getElementById('fileInput').click()}>
          <Upload size={48} color="#888" />
          <p>Click to Upload</p>
        </UploadArea>
        <input id='fileInput' type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />
      </Section>

      {(capturedImage || uploadedImage) && (
        <Section>
          <ImagePreview src={capturedImage || uploadedImage} alt="Uploaded" />
        </Section>
      )}
    </Container>
  );
}

export default App;
