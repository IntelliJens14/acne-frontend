import styled from "styled-components";
import PropTypes from "prop-types";

// 🎨 Styled Button Component
const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ bgColor }) => bgColor || "#3b82f6"};
  color: white;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#1d4ed8"};
  }

  &:active {
    background-color: ${({ activeColor }) => activeColor || "#1e40af"};
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = ({ children, onClick, bgColor, hoverColor, activeColor, fullWidth, disabled }) => {
  return (
    <StyledButton
      onClick={onClick}
      bgColor={bgColor}
      hoverColor={hoverColor}
      activeColor={activeColor}
      fullWidth={fullWidth}
      disabled={disabled}
      aria-label="Button"
    >
      {children}
    </StyledButton>
  );
};

// ✅ Define PropTypes for better type safety
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  bgColor: PropTypes.string,
  hoverColor: PropTypes.string,
  activeColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};

// ✅ Default Props (Optional)
Button.defaultProps = {
  onClick: () => {},
  bgColor: "#3b82f6",
  hoverColor: "#1d4ed8",
  activeColor: "#1e40af",
  fullWidth: false,
  disabled: false,
};

export default Button;
