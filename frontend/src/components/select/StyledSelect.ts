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

  // ===========================================================
  // THE REST IS IN GlobalStyle TO APPLY IT ALSO ON PORTAL NODES
  // ===========================================================
`;

const StyledSelect = styled(Select).attrs({
  classNamePrefix: "rs",
})<StyledSelectProps>`
  ${styledSelectCSS}
`;

export default StyledSelect;
