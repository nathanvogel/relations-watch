import { RelationType } from "./types";

const theme = {
  mainFont:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  mainTextColor: "rgb(0, 0, 0, 0.84)" /* Stolen from Medium */,
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
  blockPadding: "12px",
  blockSpacingTB: "20px",
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

export const RELATION_COLORS = {
  [RelationType.IsOwned]: "#e7b300",
  [RelationType.JobDependsOn]: "#ee8012",
  [RelationType.IsControlled]: "#a63e14",
  [RelationType.ValueExchange]: "#ffeb00",
  [RelationType.Family]: "#007500",
  [RelationType.Friendship]: "#00b8b8",
  [RelationType.Love]: "#de3d83",
  [RelationType.Opposition]: "#db2f27",
  [RelationType.Influences]: "#f45844",
  [RelationType.Attendance]: "#00b8b8",
  [RelationType.GroupMember]: "#0095a3",
  [RelationType.Other]: "#444444"
};

export default theme;
