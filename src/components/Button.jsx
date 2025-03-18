import styled from "styled-components";

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.primary || "#3b82f6"};
  color: ${({ theme }) => theme.buttonText || "white"};
  font-weight: bold;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 220px;
  display: inline-block;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover || "#1d4ed8"};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${({ theme }) => theme.primaryActive || "#1e40af"};
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.focusColor || "#60a5fa"};
  }

  /* ✅ Mobile Responsive */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    max-width: 180px;
  }
`;

const Button = ({ children, onClick, type = "button" }) => {
  return (
    <StyledButton onClick={onClick} type={type}>
      {children}
    </StyledButton>
  );
};

export default Button;
