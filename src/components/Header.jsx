import React from "react";
import styled from "styled-components";

// Styled Components
const HeaderContainer = styled.header`
  background-color: #2563eb;
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>Acne Severity Detector</Title>
        <Subtitle>Upload or capture an image to analyze acne severity</Subtitle>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;