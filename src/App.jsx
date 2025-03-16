import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Header from "./components/Header";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultDisplay from "./components/ResultDisplay";

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

  const analyzeImage = async (image) => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Convert data URL to file
      const blob = await fetch(image).then((res) => res.blob());
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      // ✅ Create FormData and send image to backend
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("https://acne-ai-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("❌ Failed to analyze image.");

      const result = await response.json();
      setResult(result);
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
        <CameraCapture onCapture={analyzeImage} />
        <ImageUpload onUpload={analyzeImage} />
        
        {isLoading && <Message>⏳ Analyzing image... Please wait.</Message>}
        {error && <Message error>{error}</Message>}
        {result && <ResultDisplay result={result} />}
      </Container>
    </>
  );
}

export default App;
