import React, { useEffect } from "react";
import PropTypes from "prop-types";

/* Theme */
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { primaryBackground, textPrimary, primaryDefault } from "./theme";
import { font } from "./font";
import { highlightJS } from "./highlightJS";
/* import:: Font handlers */
// ERROR: OpenDyslexic type is still in beta and don't format well for styling
// import { OpenDyslexic } from "./fonts/OpenDyslexic";
import { OpenSans } from "./fonts/OpenSans";
import { RobotoCondensed } from "./fonts/RobotoCondensed";
import { FiraCode } from "./fonts/FiraCode";

/* create Theme context */
const ThemeToggleContext = React.createContext();

const defaultTheme = { mode: "light" };
const defaultFont = { type: "normal" };

export const useTheme = () => React.useContext(ThemeToggleContext);

function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
}
function getInitialFont() {
  const savedFont = localStorage.getItem("font");
  return savedFont ? JSON.parse(savedFont) : defaultFont;
}
export const KIKThemeProvider = ({ children }) => {
  const [themeState, _setThemeState] = React.useState(getInitialTheme);
  const [fontState, _setFontState] = React.useState(getInitialFont);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(themeState));
  }, [themeState]);

  useEffect(() => {
    localStorage.setItem("font", JSON.stringify(fontState));
  }, [fontState]);

  // create main colors and font holster
  const GlobalStyle = createGlobalStyle`
  ::selection {
      background: ${primaryDefault}AF;
    }
  html,
  body {
    height: 100%;
    background-color: ${primaryBackground};
    color: ${textPrimary};
    ${[OpenSans, RobotoCondensed, FiraCode]}
    ${highlightJS}
  }

  /* TODO: FIXME: print don't work */
  @media print {
    & #SideBar,#NavBar {
      display:none !important;
      z-index:-100 !important;
      width: 0px !important;
      height: 0px !important;
    } 

    & #Article{
      position: absolute !important;
      height: 100vh !important;
      width: 100vw !important;
      top: 0 !important;
      left: 0 !important;
      margin: 0 !important;
      overflow-y: scroll !important;
      z-index:100 !important;
    }
  }
  `;

  const Wrapper = styled.div`
    background-color: ${primaryBackground};
    color: ${textPrimary};
    font-family: ${font};
  `;

  const toggleTheme = () => {
    const mode = themeState.mode === "light" ? `dark` : `light`;
    _setThemeState({ mode });
  };

  const toggleFont = () => {
    const type = fontState.type === "normal" ? `condensed` : `normal`;
    _setFontState({ type });
  };

  KIKThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <ThemeToggleContext.Provider
      value={{ toggleTheme, toggleFont, themeState, fontState }}
    >
      <ThemeProvider
        theme={{
          mode: themeState.mode,
          font: fontState.type
        }}
      >
        <GlobalStyle />
        <Wrapper id="Wrapper">{children}</Wrapper>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};

export default ThemeProvider;
