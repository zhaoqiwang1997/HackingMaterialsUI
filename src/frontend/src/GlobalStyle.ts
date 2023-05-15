import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body * {
    box-sizing: border-box;
    text-align: left;
  }

  body {
    color: #49525C;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-primary);
  }
    
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  :root {
    --background: #fff;
    --background-sunken: #eee;
    --background-elevated: #F7F8F9;

    --ui: white;

    --text-primary: #000;
    --text-secondary: #3E4349;
    
    --accent: #558ed5;
    --shadow: rgba(0, 0, 0, 0.24) 0px 0px 8px;
  }
`;

export default GlobalStyle;
