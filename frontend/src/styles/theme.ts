import { RelationType } from "../utils/types";
import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  mainFont: '"Helvetica Neue", Helvetica, "Droid Sans", sans-serif',
  fontSizeS: "13px",
  fontSizeM: "18px",
  fontSizeL: "25px",
  mainTextColor: "rgb(0, 0, 0, 0.84)" /* Stolen from Medium */,
  lightTextColor: "#ffffff",
  linkTextColor: "#0077CC", // Stackoverflow
  visitedLinkTextColor: "#0077CC",
  hoverLinkTextColor: "#33AAFF",
  secondaryTextColor: "#72727c",
  focusColor: "#5B44E8",
  appBG: "#FFFFFF",
  lightBG: "#EFEFF2",
  inputBG: "#EFEFF2",
  border: "#ededed",
  borderHover: "#8A879B",
  surfaceHover: "#B8B7BC",
  confirmingTextColor: "#366936",
  refutingTextColor: "#752F40",
  refutingBackgroundColor: "#F3DFD7",
  borderWidth: "2px",
  inputPaddingLR: "8px",
  inputPaddingTB: "4px",
  inputLRSpacing: "4px",
  inputTBSpacing: "4px",
  marginLR: "12px",
  marginTB: "12px",
  inputMarginTB: "12px",
  blockPadding: "12px",
  blockSpacingTB: "20px",
  navBarHeight: "54px",
  appMaxWidth: "1024px",
  appPaddingLR: "24px",
  appPaddingTB: "12px",
  longFieldHeight: "3em",
  radius: "4px"
};

export const RELATION_COLORS = {
  [RelationType.IsOwned]: "#e7b300",
  [RelationType.JobDependsOn]: "#ee8012",
  [RelationType.IsControlled]: "#a63e14",
  [RelationType.ValueExchange]: "#ffeb00",
  [RelationType.Family]: "#007500",
  [RelationType.Friendship]: "#00b8b8",
  [RelationType.Love]: "#de3d83",
  [RelationType.Opposition]: "#db2f27",
  [RelationType.IsInfluenced]: "#f45844",
  [RelationType.Attendance]: "#00b8b8",
  [RelationType.GroupMember]: "#0095a3",
  [RelationType.Other]: "#444444"
};

export default theme;
