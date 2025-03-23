import styled from "styled-components";

// ✅ Styled Button Component
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ bgColor }) => bgColor || "#2563eb"}; /* Default: Blue */
  color: white;
  border: none;
  padding: ${({ size }) => (size === "small" ? "8px 12px" : size === "large" ? "14px 18px" : "12px 16px")};
  border-radius: 8px;
  font-size: ${({ size }) => (size === "small" ? "14px" : size === "large" ? "18px" : "16px")};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};

  &:hover {
    background-color: ${({ hoverBgColor }) => hoverBgColor || "#1d4ed8"};
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

// ✅ Button Component
const Button = ({ children, onClick, bgColor, hoverBgColor, size, fullWidth, disabled }) => {
  return (
    <StyledButton
      onClick={onClick}
      bgColor={bgColor}
      hoverBgColor={hoverBgColor}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
