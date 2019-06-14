import styled, { css } from "styled-components";
import Select from "react-select";

// <div class="rs-container">
//   <div class="rs__control">
//     <div class="rs__value-container">...</div>
//     <div class="rs__indicators">...</div>
//   </div>
//   <div class="rs__menu">
//     <div class="rs__menu-list">
//       <div class="rs__option">...</div>
//     </div>
//   </div>
// </div>

export type StyledSelectProps = {
  forceMenuOnTop?: boolean;
};

export const styledSelectCSS = css<StyledSelectProps>`
  display: inline-block;
  width: 100%;

  .rs__dropdown-indicator {
    padding: 0px ${props => props.theme.inputPaddingLR};
  }
  .rs__value-container {
    padding: 0px ${props => props.theme.inputPaddingLR};
  }
  .rs__single-value {
    padding: ${props => props.theme.inputPaddingTB} 0px;
  }

  .rs__control {
    min-height: 20px;
    padding: 0px;
    background-color: ${props => props.theme.inputBG};
    border-radius: ${props => props.theme.smallRadius};
    border-color: ${props => props.theme.inputBorder};
    border-width: ${props => props.theme.borderWidth};
    border-style: solid;
  }
  .rs__control:hover {
    border-color: ${props => props.theme.borderHover};
  }
  .rs__control--is-focused,
  .rs__control--is-focused:hover {
    border-color: ${props => props.theme.focusColor};
    border-radius: ${props => props.theme.smallRadius};
    outline: none;
    box-shadow: none;
  }

  .rs__placeholder {
    // Make sure the placeholder doesn't wrap
    white-space: nowrap;
    // Make sure the placeholder can't be selected by the user
    // (mostly when long-pressing to paste)
    user-select: none;
  }

  // Goal:    Make sure the user can long-press to paste
  // But:     It doesn't work, rs__value-container seems to be blocking
  //          or re-interpreting the event as unfocus/refocus.
  input {
    min-width: 5em;
  }

  .rs__menu {
    margin-top: 0px;
    margin-bottom: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: ${props => props.theme.smallRadius};
    border-bottom-right-radius: ${props => props.theme.smallRadius};
    z-index: 200;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);

    .rs__menu-list {
      padding-top: 0px;
      padding-bottom: 0px;

      .rs__option {
        box-sizing: border-box;
        background-color: ${props => props.theme.appBG};
        border-color: ${props => props.theme.appBG};
        border-width: ${props => props.theme.borderWidth};
        border-style: solid;
        border-radius: 0px;
        padding-top: ${props => props.theme.inputPaddingTB};
        padding-bottom: ${props => props.theme.inputPaddingTB};
        color: ${props => props.theme.mainTextColor};
      }

      .rs__option--is-focused {
        border-color: ${props => props.theme.borderHover};
        border-radius: ${props => props.theme.smallRadius};
      }

      .rs__option--is-selected {
        color: ${props => props.theme.mainTextColor};
        background-color: ${props => props.theme.inputBG};
      }
    }
  }

  ${props =>
    props.forceMenuOnTop &&
    `
    .rs__menu {
      position: absolute !important;
      top: auto !important;
      bottom: calc(100% - 1px) !important;
      border-bottom-left-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
      border-top-left-radius: 5px !important;
      border-top-right-radius: 5px !important;
    }
  `}
`;

const StyledSelect = styled(Select).attrs({
  classNamePrefix: "rs",
})<StyledSelectProps>`
  ${styledSelectCSS}
`;

export default StyledSelect;
