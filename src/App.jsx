import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Header from "./components/Header";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultDisplay from "./components/ResultDisplay";
import { analyzeImage } from "./utils/api"; // ✅ Import optimized API function

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Message = styled.p`
  color: ${({ error }) => (error ? "red" : "blue")};
  font-weight: bold;
`;

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handles image capture & upload
  const handleAnalyzeImage = async (image) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeImage(image);
      setResult(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />
        <CameraCapture onCapture={handleAnalyzeImage} />
        <ImageUpload onUpload={handleAnalyzeImage} />

        {isLoading && <Message>⏳ Analyzing image... Please wait.</Message>}
        {error && <Message error>{error}</Message>}
        {result && <ResultDisplay result={result} />}
      </Container>
    </>
  );
}

export default App;
