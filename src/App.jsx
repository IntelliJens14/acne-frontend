import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, Upload, RefreshCw, RotateCw } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

// Styled Components
const Container = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin: auto;
  padding: 10px;
`;

const Header = styled.div`
  background-color: #3366CC;
  color: white;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Section = styled.div`
  background-color: white;
  padding: 20px;
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
  padding: 12px 0;
  border-radius: 8px;
  font-size: 16px;
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
  padding: 30px;
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

// Severity Bar Styles
const SeverityContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  text-align: center;
`;

const SeverityLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SeverityBar = styled.div`
  width: 80%;
  height: 15px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin: auto;
`;

const SeverityFill = styled.div`
  height: 100%;
  width: ${({ level }) => level * 25}%;
  background: ${({ level }) => {
    switch (level) {
      case 0: return '#28a745'; // Green - Extremely Mild
      case 1: return '#17a2b8'; // Blue - Mild
      case 2: return '#fd7e14'; // Orange - Moderate
      case 3: return '#dc3545'; // Red - Severe
      default: return '#ccc';
    }
  }};
  transition: width 0.5s ease-in-out;
`;

function App() {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [model, setModel] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Toggle Front/Rear Camera
  const videoRef = useRef(null);

  // ✅ Load Model Correctly from Public Folder
  useEffect(() => {
    async function loadModel() {
      try {
        if (!tf.ENV.get("WEBGL_VERSION")) throw new Error("WebGL not supported");
        console.log("📢 Loading model...");
        const modelPath = process.env.PUBLIC_URL + "/model/model.json";
        const loadedModel = await tf.loadGraphModel(modelPath);
        setModel(loadedModel);
        console.log("✅ Model loaded successfully.");
      } catch (error) {
        console.error("❌ Failed to load model:", error);
      }
    }
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
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
      canvas.width = 224;
      canvas.height = 224;
      ctx.drawImage(videoRef.current, 0, 0, 224, 224);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setCameraActive(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
    startCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!model) return alert("Model not loaded yet!");

    const imgElement = document.createElement('img');
    imgElement.src = capturedImage || uploadedImage;
    await imgElement.decode();

    const tensor = tf.browser.fromPixels(imgElement)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat();
      
    const prediction = model.predict(tensor);
    const level = prediction.argMax(1).dataSync()[0]; // Assuming model outputs severity levels

    setSeverityLevel(level);
  };

  return (
    <Container>
      <Header>
        <Title>Acne Severity Detector</Title>
        <Button onClick={toggleCamera}><RotateCw size={20} /> Switch Camera</Button>
      </Header>

      <Section>
        {cameraActive ? (
          <>
            <Video ref={videoRef} autoPlay playsInline />
            <Button onClick={captureImage}><Camera size={24} /> Capture</Button>
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
          <Button onClick={analyzeImage}>Analyze</Button>

          {severityLevel !== null && (
            <SeverityContainer>
              <SeverityLabel>
                {["Level 0: Extremely Mild", "Level 1: Mild", "Level 2: Moderate", "Level 3: Severe"][severityLevel]}
              </SeverityLabel>
              <SeverityBar>
                <SeverityFill level={severityLevel} />
              </SeverityBar>
            </SeverityContainer>
          )}
        </Section>
      )}
    </Container>
  );
}

export default App;
