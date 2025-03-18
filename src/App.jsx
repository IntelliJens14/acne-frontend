import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

// Import components
import Header from "./components/Header";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultDisplay from "./components/ResultDisplay";

// Import global styles
import "./index.css";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [model, setModel] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load the AI model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        setModel(loadedModel);
      } catch (err) {
        console.error("Error loading model:", err);
        setError("Failed to load AI model. Please refresh the page.");
      }
    };
    loadModel();
  }, []);

  // Function to process image with the AI model
  const analyzeImage = async (image) => {
    if (!model) {
      setError("AI model is not loaded yet. Please wait.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const img = new Image();
      img.src = image;
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();
        
        const predictions = model.predict(tensor);
        const resultData = await predictions.data();
        const severityLevel = resultData.indexOf(Math.max(...resultData));

        setResult({
          severityLevel,
          confidence: Math.max(...resultData),
        });

        setIsLoading(false);
      };
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze image. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<ImageUpload onUpload={setUploadedImage} />} />
            <Route path="/camera" element={<CameraCapture />} />
            <Route 
              path="/results" 
              element={
                <ResultDisplay 
                  image={uploadedImage} 
                  result={result} 
                  isLoading={isLoading} 
                  error={error} 
                  onReset={() => {
                    setUploadedImage(null);
                    setResult(null);
                    setError(null);
                  }} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
