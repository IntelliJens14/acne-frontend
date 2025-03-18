import { Loader2, RefreshCw, XCircle, AlertTriangle } from "lucide-react";
import Button from "./Button";
import styled from "styled-components";

// Styled Components
const ResultContainer = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.color || "#374151"};
`;

const Image = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const SeverityLabel = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
  margin-bottom: 0.5rem;
`;

const ConfidenceText = styled.p`
  margin-top: 0.5rem;
  color: #374151;
  font-size: 0.95rem;
`;

const WarningContainer = styled.div`
  margin-top: 1rem;
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

// Severity Levels Mapping
const severityLevels = {
  0: { label: "Extremely Mild", color: "#10b981", bg: "#d1fae5" },
  1: { label: "Mild", color: "#f59e0b", bg: "#fef3c7" },
  2: { label: "Moderate", color: "#f97316", bg: "#ffedd5" },
  3: { label: "Severe", color: "#ef4444", bg: "#fee2e2" },
};

const ResultDisplay = ({ image, result, isLoading, error, onReset }) => {
  if (isLoading) {
    return (
      <ResultContainer>
        <Title>Analyzing Image...</Title>
        <MessageContainer color="#3b82f6">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p>Processing your image with AI...</p>
        </MessageContainer>
      </ResultContainer>
    );
  }

  if (error || !result) {
    return (
      <ResultContainer>
        <Title>Analysis Failed</Title>
        <MessageContainer color="#dc2626">
          <XCircle size={40} />
          <p>{error || "Could not detect acne severity. Try another image."}</p>
        </MessageContainer>
        <Button onClick={onReset} className="mt-4">
          <RefreshCw size={18} /> Try Again
        </Button>
      </ResultContainer>
    );
  }

  const severityInfo = severityLevels[result.severityLevel] || severityLevels[0];

  return (
    <ResultContainer>
      <Title>AI Detection Results</Title>
      {image && <Image src={image} alt="Uploaded" />}

      <SeverityLabel bg={severityInfo.bg} color={severityInfo.color}>
        Acne Severity: {severityInfo.label}
      </SeverityLabel>

      <ConfidenceText>
        Confidence: <strong>{(result.confidence * 100).toFixed(2)}%</strong>
      </ConfidenceText>

      {result.severityLevel >= 2 && (
        <WarningContainer>
          <AlertTriangle size={18} style={{ marginRight: "6px" }} />
          Consider consulting a dermatologist.
        </WarningContainer>
      )}

      <Button onClick={onReset} className="mt-4">
        <RefreshCw size={18} /> Try Again
      </Button>
    </ResultContainer>
  );
};

export default ResultDisplay;
