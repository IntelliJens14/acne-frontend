import React, { useState, useCallback, lazy, Suspense } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import { analyzeImage } from "./utils/api"; // ✅ Optimized API call

// ✅ Lazy-loaded components for performance
const Header = lazy(() => import("./components/Header"));
const CameraCapture = lazy(() => import("./components/CameraCapture"));
const ImageUpload = lazy(() => import("./components/ImageUpload"));
const ResultDisplay = lazy(() => import("./components/ResultDisplay"));

// ✅ Styled Components
const Container = styled.main`
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
  transition: opacity 0.3s ease-in-out;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ disabled }) => (disabled ? "#a3bffa" : "#2563eb")};
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease, transform 0.2s ease;
  outline: none;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#a3bffa" : "#1e40af")};
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.05)")};
  }

  &:focus {
    outline: 2px solid #1e40af;
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

  // ✅ Updated Backend URL
  const BACKEND_URL = "https://acne-ai-backend-2nmn.onrender.com";

  // ✅ Optimized function using useCallback to prevent unnecessary re-renders
  const handleAnalyzeImage = useCallback(async (image) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeImage(image, BACKEND_URL); // ✅ Pass backend URL dynamically
      setResult(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("❌ Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Reset Handler
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Suspense fallback={<Message>⏳ Loading components...</Message>}>
          <Header />
          <CameraCapture onCapture={handleAnalyzeImage} />
          <ImageUpload onUpload={handleAnalyzeImage} />
        </Suspense>

        {/* ✅ Improved Error/Loading Messages */}
        {isLoading && <Message aria-live="polite">⏳ Analyzing image... Please wait.</Message>}
        {error && <Message error aria-live="assertive">{error}</Message>}
        {result && (
          <ResultDisplay result={result} />
        )}

        {/* ✅ Reset Button for User Convenience */}
        {(error || result) && (
          <Button onClick={handleReset} aria-label="Reset Analysis">
            🔄 Reset
          </Button>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
