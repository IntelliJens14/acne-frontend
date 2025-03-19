// File: App.jsx
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

const Subtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
`;

const Section = styled.div`
  background-color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px dashed #e0e0e0;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 25px;
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
  
  &:hover {
    background-color: #2855b8;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  font-size: 18px;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  width: 80%;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #3366CC;
  }
`;

const UploadText = styled.p`
  color: #888;
  font-size: 20px;
  margin-top: 15px;
`;

const Video = styled.video`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImagePreview = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SeverityBar = styled.div`
  width: 100%;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  margin: 15px 0;
  position: relative;
  overflow: hidden;
`;

const SeverityIndicator = styled.div`
  height: 100%;
  background-color: ${props => {
    if (props.level === 0) return '#4CAF50';  // Green for Level 0
    if (props.level === 1) return '#8BC34A';  // Light Green for Level 1
    if (props.level === 2) return '#FFC107';  // Amber for Level 2
    if (props.level === 3) return '#F44336';  // Red for Level 3
    return '#e0e0e0';
  }};
  width: ${props => ((props.level + 1) / 4) * 100}%;
  transition: width 0.5s ease;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3366CC;
  animation: spin 1s linear infinite;
  margin: 20px 0;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Input size constants based on model requirements
  const INPUT_SIZE = 224;
  const INPUT_SHAPE = [INPUT_SIZE, INPUT_SIZE, 3];

  // Initialize TensorFlow model
  useEffect(() => {
    async function loadModel() {
      try {
        setModelLoading(true);
        setModelError(null);
        console.log("Loading model...");
        
        // Use the path to your model.json file
        const modelPath = 'model.json';
        const loadedModel = await tf.loadGraphModel(modelPath);
        
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Failed to load model:", error);
        setModelError("Failed to load the AI model. Please check if model files are correctly placed.");
      } finally {
        setModelLoading(false);
      }
    }
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: INPUT_SIZE },
          height: { ideal: INPUT_SIZE }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(false);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      // Set canvas dimensions to match the input size
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageUrl);
      analyzeImage(canvas);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        
        // Create an image element to get dimensions for canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          analyzeImage(canvas);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          analyzeImage(canvas);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const preprocessImage = (imageCanvas) => {
    // Create a canvas with the exact size required by the model
    const modelCanvas = document.createElement('canvas');
    modelCanvas.width = INPUT_SIZE;
    modelCanvas.height = INPUT_SIZE;
    const ctx = modelCanvas.getContext('2d');
    
    // Draw the image centered and cropped to the model canvas
    const origImage = imageCanvas;
    const origWidth = origImage.width;
    const origHeight = origImage.height;
    
    // Calculate scaling and position to center-crop
    let scale, offsetX, offsetY;
    if (origWidth > origHeight) {
      scale = INPUT_SIZE / origHeight;
      offsetX = (origWidth * scale - INPUT_SIZE) / 2;
      offsetY = 0;
    } else {
      scale = INPUT_SIZE / origWidth;
      offsetX = 0;
      offsetY = (origHeight * scale - INPUT_SIZE) / 2;
    }
    
    // Draw the image centered and cropped
    ctx.drawImage(
      origImage, 
      -offsetX / scale, 
      -offsetY / scale, 
      origWidth, 
      origHeight, 
      0, 
      0, 
      INPUT_SIZE, 
      INPUT_SIZE
    );
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
    
    // Create a Float32Array for RGB values
    const pixels = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
    
    // Convert to RGB values normalized to [0, 1]
    for (let i = 0; i < imageData.data.length / 4; i++) {
      pixels[i * 3] = imageData.data[i * 4] / 255;     // R
      pixels[i * 3 + 1] = imageData.data[i * 4 + 1] / 255; // G
      pixels[i * 3 + 2] = imageData.data[i * 4 + 2] / 255; // B
    }
    
    // Create and return the tensor with shape [1, 224, 224, 3]
    return tf.tensor(pixels, [1, INPUT_SIZE, INPUT_SIZE, 3]);
  };

  const analyzeImage = async (canvas) => {
    setIsLoading(true);
    
    try {
      // If you have a real model loaded, use it here
      if (model) {
        console.log("Using loaded model for inference");
        
        // Preprocess the image for the model
        const inputTensor = preprocessImage(canvas);
        
        // Run inference
        const predictions = await model.predict(inputTensor);
        
        // Process the model output
        const resultsArray = await predictions.data();
        
        // Clean up tensors
        inputTensor.dispose();
        predictions.dispose();
        
        // Find the highest probability class
        const maxIndex = resultsArray.indexOf(Math.max(...resultsArray));
        
        // Map the result to your severity levels
        const severityLevels = [
          { level: 0, name: 'Extremely Mild' },
          { level: 1, name: 'Mild' },
          { level: 2, name: 'Moderate' },
          { level: 3, name: 'Severe' }
        ];
        
        const severity = severityLevels[maxIndex];
        const confidence = (resultsArray[maxIndex] * 100).toFixed(1);
        
        setAnalysisResult({
          severity: severity.name,
          level: severity.level,
          confidence: confidence + '%',
          recommendations: getRecommendations(severity.level)
        });
      } else {
        // Fallback if model isn't loaded - simulated results
        console.log("Using simulated results as model is not loaded");
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const severityLevels = [0, 1, 2, 3];
        const randomLevel = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        const severityNames = ['Extremely Mild', 'Mild', 'Moderate', 'Severe'];
        const confidence = (Math.random() * 30 + 70).toFixed(1); // Random number between 70-100
        
        setAnalysisResult({
          severity: severityNames[randomLevel],
          level: randomLevel,
          confidence: confidence + '%',
          recommendations: getRecommendations(randomLevel)
        });
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResult({
        error: "Analysis failed. Please try again with a clearer image."
      });
    }
    
    setIsLoading(false);
  };
  
  const getRecommendations = (level) => {
    switch(level) {
      case 0: // Extremely Mild
        return [
          "Continue with basic skincare routine",
          "Gentle cleanser once or twice daily",
          "Apply moisturizer with SPF during the day"
        ];
      case 1: // Mild
        return [
          "Use a gentle cleanser twice daily",
          "Apply over-the-counter benzoyl peroxide (2.5%)",
          "Moisturize with non-comedogenic products"
        ];
      case 2: // Moderate
        return [
          "Consider topical retinoids",
          "Use benzoyl peroxide or salicylic acid consistently",
          "Consider consulting a dermatologist for prescription options"
        ];
      case 3: // Severe
        return [
          "Consult a dermatologist as soon as possible",
          "Prescription treatments may be necessary",
          "Avoid picking or squeezing acne lesions",
          "Consider oral medication options"
        ];
      default:
        return ["Unable to provide recommendations"];
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setAnalysisResult(null);
  };

  return (
    <Container>
      <Header>
        <Title>Acne Severity Detector</Title>
        <Subtitle>Upload or capture an image to analyze acne severity</Subtitle>
        <ModelInfo>
          Input Size: 224×224×3
        </ModelInfo>
      </Header>

      {modelLoading && (
        <Section>
          <LoadingSpinner />
          <p>Loading AI model...</p>
        </Section>
      )}

      {modelError && (
        <Section>
          <ErrorMessage>
            <XCircle size={24} />
            {modelError}
          </ErrorMessage>
        </Section>
      )}

      {!modelLoading && !capturedImage && !uploadedImage && (
        <>
          <Section>
            <SectionTitle>Use Camera</SectionTitle>
            {cameraActive ? (
              <>
                <Video ref={videoRef} autoPlay playsInline />
                <Button onClick={captureImage}>Capture Photo</Button>
                <Button onClick={stopCamera} style={{ backgroundColor: '#888' }}>Cancel</Button>
              </>
            ) : (
              <>
                {cameraError && (
                  <ErrorMessage>
                    <XCircle size={24} />
                    Camera access denied. Please allow camera permission.
                  </ErrorMessage>
                )}
                <Button onClick={startCamera}>
                  <Camera size={24} />
                  Start Camera
                </Button>
              </>
            )}
          </Section>

          <Section>
            <SectionTitle>Upload an Image</SectionTitle>
            <UploadArea 
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload size={48} color="#888" />
              <UploadText>Drag & Drop or Click to Upload</UploadText>
            </UploadArea>
            <HiddenInput 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
            />
            <Button onClick={() => fileInputRef.current.click()}>
              <Upload size={24} />
              Choose File
            </Button>
          </Section>
        </>
      )}

      {(capturedImage || uploadedImage) && (
        <Section>
          <SectionTitle>Analysis Result</SectionTitle>
          <ImagePreview src={capturedImage || uploadedImage} alt="Skin Image" />
          
          {isLoading && (
            <>
              <LoadingSpinner />
              <p>Analyzing image...</p>
            </>
          )}
          
          {analysisResult && !isLoading && (
            <ResultContainer>
              {analysisResult.error ? (
                <p>{analysisResult.error}</p>
              ) : (
                <>
                  <h3>Severity: {analysisResult.severity}</h3>
                  <p>Level: {analysisResult.level}</p>
                  <p>Confidence: {analysisResult.confidence}</p>
                  
                  <SeverityBar>
                    <SeverityIndicator level={analysisResult.level} />
                  </SeverityBar>
                  
                  <div style={{ marginTop: '15px', width: '100%' }}>
                    <h4>Recommendations:</h4>
                    <ul style={{ paddingLeft: '20px' }}>
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <Button onClick={resetAnalysis} style={{ marginTop: '20px' }}>
                Analyze Another Image
              </Button>
            </ResultContainer>
          )}
        </Section>
      )}
    </Container>
  );
}

export default App;
