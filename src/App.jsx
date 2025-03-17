import React, { useState, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Header from "./components/Header";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultDisplay from "./components/ResultDisplay";
import { analyzeImage } from "./utils/api"; // ✅ Optimized API function

// ✅ Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Message = styled.p`
  color: ${({ error }) => (error ? "#DC2626" : "#2563EB")};
  font-weight: bold;
  margin-top: 1rem;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #1e40af;
  }

  &:disabled {
    background-color: #a3bffa;
    cursor: not-allowed;
  }
`;

// ✅ Theme Object for Styled Components
const theme = {
  bodyBg: "#f7fafc",
  textColor: "#1a202c",
};

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Optimized function using useCallback to prevent unnecessary re-renders
  const handleAnalyzeImage = useCallback(async (image) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeImage(image);
      setResult(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("❌ Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header />
        <CameraCapture onCapture={handleAnalyzeImage} />
        <ImageUpload onUpload={handleAnalyzeImage} />

        {/* ✅ Improved Error/Loading Messages */}
        {isLoading && <Message aria-live="polite">⏳ Analyzing image... Please wait.</Message>}
        {error && <Message error aria-live="assertive">{error}</Message>}
        {result && <ResultDisplay result={result} />}

        {/* ✅ Reset Button for User Convenience */}
        {(error || result) && (
          <Button onClick={() => {
            setResult(null);
            setError(null);
          }}>
            🔄 Reset
          </Button>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
