import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Apply global box-sizing */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Ensure full height layout */
  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme?.bodyBg || "#f7fafc"}; /* ✅ Safe fallback */
    color: ${({ theme }) => theme?.textColor || "#1a202c"}; /* ✅ Safe fallback */
    scroll-behavior: smooth;
    overflow-x: hidden; /* ✅ Prevents horizontal scroll */
  }

  /* Ensure images scale properly */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  /* Paragraphs */
  p {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme?.linkHover || "#3182ce"}; /* ✅ Safe fallback */
    }
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 10px 16px;
    font-size: 16px;
    border-radius: 6px;
    transition: background 0.2s ease-in-out;
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme?.focusOutline || "#3182ce"}; /* ✅ Accessibility */
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

export default GlobalStyle;
