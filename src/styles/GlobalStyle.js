// GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* ✅ Global Reset & Font */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ✅ Light & Dark Mode Support */
  body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.bodyBg || "#f7fafc"};
    color: ${({ theme }) => theme.textColor || "#1a202c"};
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  }

  /* ✅ Responsive Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ✅ Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  /* ✅ Links */
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.linkColor || "inherit"};
    transition: color 0.2s;
  }

  a:hover {
    color: ${({ theme }) => theme.linkHoverColor || "#2563eb"};
  }

  /* ✅ Buttons */
  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font: inherit;
    transition: all 0.2s;
  }

  button:focus {
    outline: 2px solid ${({ theme }) => theme.focusColor || "#2563eb"};
  }

  /* ✅ Accessibility & Mobile-Friendly Enhancements */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
