import styled from "styled-components";

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #1d4ed8;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const Button = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;
