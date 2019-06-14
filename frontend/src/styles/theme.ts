import { RelationType, FamilialLink } from "../utils/types";
// import { DefaultTheme } from "styled-components";

const theme = {
  mainFont:
    '"Simplon Norm", "Proxima Nova", proxima-nova, "IBM Plex Sans", "Helvetica Neue", Helvetica, "Droid Sans", sans-serif',
  // brandFont: '"SangBleu Republic", "Calluna", "Lapture", serif',
  brandFont:
    '"Simplon Norm", "Rigid Square", "PoynterGothicText", "Officina Sans ITC Pro", "Proxima Nova", proxima-nova, "IBM Plex Sans", "Helvetica Neue", Helvetica, "Droid Sans", sans-serif',
  fontSizeS: "15px",
  fontSizeM: "20px",
  fontSizeL: "24px",
  mainTextColor: "rgba(0, 0, 0, 0.84)",
  lightTextColor: "#ffffff",
  linkTextColor: "rgba(89, 27, 1, 0.84)",
  visitedLinkTextColor: "rgba(89, 27, 1, 0.84)",
  hoverLinkTextColor: "#B83700",
  secondaryTextColor: "#72727c",
  disabledTextColor: "#72727c",
  focusColor: "#B83700",
  lightFocusColor: "#FFD2BF",
  absentShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.06)",
  focusShadow: "0px 2px 4px 2px #B8370033",
  entityViewShadow: "0px 4px 8px 6px rgba(0, 0, 0, 0.06)",
  appBG: "#FFFFFF",
  sidebarBG: "#F0D5B653",
  appBarBG: "#FFFFFF",
  modalBG: "#FFFFFF",
  modalPreviewBG: "#FFFFFF",
  darkBG: "rgba(0, 0, 0, 0.84)",
  lightBG: "#44000014",
  inputBG: "#44000014",
  buttonBG: "transparent",
  buttonHoverBG: "#00000014",
  primaryButtonBG: "rgba(89, 27, 1, 0.84)",
  primaryButtonHoverBG: "rgba(50, 18, 4, 0.84)",
  errorBG: "#E37777",
  successBG: "#B4DE7E",
  border: "rgba(89, 27, 1, 0.1)",
  inputBorder: "44000014",
  borderHover: "#44000030",
  buttonBorder: "rgba(89, 27, 1, 0.84)",
  strongBorder: "rgba(0, 0, 0, 0.84)",
  confirmingTextColor: "#366936",
  refutingTextColor: "#752F40",
  refutingBackgroundColor: "#F3DFD7",
  strongBorderWidth: "0px",
  borderWidth: "1px",
  inputPaddingLR: "12px",
  inputPaddingTB: "2px",
  inputLRSpacing: "4px",
  inputTBSpacing: "6px",
  marginLR: "12px",
  marginTB: "12px",
  inputMarginTB: "12px",
  blockPadding: "18px",
  blockSpacingTB: "20px",
  navBarHeight: "50px",
  hoverBoxHeight: "150px",
  appMaxWidth: "1024px",
  appSidebarWidth: "250px",
  appMiniSidebarWidth: "135px",
  appPaddingLR: "24px",
  appPaddingTB: "12px",
  longFieldHeight: "3em",
  lineHeight: "1.4",
  smallRadius: "3px",
  bigRadius: "5px",
};

export const RELATION_COLORS = {
  [RelationType.IsOwned]: "#7E57C2",
  [RelationType.IsControlled]: "#2196F3",
  [RelationType.JobDependsOn]: "#009688",
  [RelationType.ValueExchange]: "#8BC34A",
  [RelationType.Family]: "#ffd32a",
  [RelationType.Love]: "#F669D7",
  [RelationType.Opposition]: "#ff3f34",
  [RelationType.IsInfluenced]: "#ffa801",
  [RelationType.Attendance]: "#4DD0E1",
  [RelationType.GroupMember]: "#4DD0E1",
  [RelationType.Other]: "#1e272e",
};

export const edgeColor = (type: RelationType, fType?: FamilialLink) => {
  if (type === RelationType.Family && fType === FamilialLink.spouseOf)
    return RELATION_COLORS[RelationType.Love];
  return RELATION_COLORS[type];
};

export default theme;
