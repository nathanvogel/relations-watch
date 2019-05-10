const theme = {
  focusColor: "#5B44E8",
  lightBgGrey1: "#DEDAEF",
  inputBG: "#EFEFF2",
  border: "#ededed",
  borderHover: "#8A879B",
  borderWidth: "2px",
  inputPaddingLR: "6px",
  inputPaddingTB: "4px",
  buttonLRSpacing: "4px",
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
