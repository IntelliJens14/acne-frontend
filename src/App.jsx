import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

// Import components
import Header from "./components/Header";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultDisplay from "./components/ResultDisplay";

// Import global styles
import "./index.css";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<ImageUpload onUpload={setUploadedImage} />} />
            <Route path="/camera" element={<CameraCapture />} />
            <Route path="/results" element={<ResultDisplay image={uploadedImage} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
