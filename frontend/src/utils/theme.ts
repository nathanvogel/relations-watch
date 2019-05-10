const theme = {
  mainFont:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mainTextColor: "#000000",
  secondaryTextColor: "#72727c",
  focusColor: "#5B44E8",
  lightBgGrey1: "#DEDAEF",
  inputBG: "#EFEFF2",
  border: "#ededed",
  borderHover: "#8A879B",
  borderWidth: "2px",
  inputPaddingLR: "8px",
  inputPaddingTB: "4px",
  inputLRSpacing: "4px",
  inputTBSpacing: "4px",
  marginLR: "12px",
  marginTB: "12px",
  inputMarginTB: "12px",
  longFieldHeight: "3em",
  radius: "4px"
};

export type AppTheme = typeof theme;

/**
 * Theme Props for auto-complete of theme props.
 */
export type TP = {
  theme: AppTheme;
  [key: string]: any;
};

export default theme;
