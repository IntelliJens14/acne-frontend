import { Loader2, RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Button from "./Button";
import styled from "styled-components";

// Styled Components
const ResultContainer = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3b82f6;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #dc2626;
`;

const Image = styled.img`
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
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
`;

const ConfidenceText = styled.p`
  margin-top: 0.5rem;
  color: #374151;
`;

const WarningContainer = styled.div`
  margin-top: 1rem;
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const severityLevels = [
  { level: 0, label: "Extremely Mild", color: "#10b981", bg: "#d1fae5" },
  { level: 1, label: "Mild", color: "#f59e0b", bg: "#fef3c7" },
  { level: 2, label: "Moderate", color: "#f97316", bg: "#ffedd5" },
  { level: 3, label: "Severe", color: "#ef4444", bg: "#fee2e2" },
];

const ResultDisplay = ({ image, result, isLoading, error, onReset }) => {
  if (isLoading) {
    return (
      <ResultContainer>
        <Title>Analysis Result</Title>
        <LoadingContainer>
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="mt-2">Analyzing image...</p>
        </LoadingContainer>
      </ResultContainer>
    );
  }

  if (error) {
    return (
      <ResultContainer>
        <Title>Analysis Result</Title>
        <ErrorContainer>
          <XCircle className="w-10 h-10 mb-2" />
          <p>{error}</p>
        </ErrorContainer>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <Title>Analysis Result</Title>

      {result && (
        <>
          <Image src={image} alt="Uploaded" />

          <SeverityLabel
            bg={severityLevels[result.severityLevel]?.bg}
            color={severityLevels[result.severityLevel]?.color}
          >
            Acne Severity: {severityLevels[result.severityLevel]?.label}
          </SeverityLabel>

          <ConfidenceText>
            Confidence: <span className="font-semibold">{(result.confidence * 100).toFixed(2)}%</span>
          </ConfidenceText>

          {result.severityLevel >= 2 && (
            <WarningContainer>
              <AlertTriangle className="w-5 h-5 mr-2" />
              Consider consulting a dermatologist.
            </WarningContainer>
          )}
        </>
      )}

      <Button onClick={onReset} className="mt-6 flex items-center bg-gray-700 hover:bg-gray-900">
        <RefreshCw className="w-5 h-5 mr-2" />
        Try Again
      </Button>
    </ResultContainer>
  );
};

export default ResultDisplay;
