import styled, { css } from "styled-components";
import Select from "react-select";
import { TP } from "../../utils/theme";

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

export const styledSelectCSS = css`
  ${"" /* min-width: 150px; */}
  display: inline-block;

  .rs__dropdown-indicator {
    padding: 0px ${(props: TP) => props.theme.inputPaddingLR};
  }
  .rs__value-container {
    padding: 0px ${(props: TP) => props.theme.inputPaddingLR};
  }
  .rs__single-value {
    padding: ${(props: TP) => props.theme.inputPaddingTB} 0px;
  }

  .rs__control {
    min-height: 20px;
    padding: 0px;
    background-color: ${(props: TP) => props.theme.inputBG};
    border-radius: ${(props: TP) => props.theme.radius};
    border-color: ${(props: TP) => props.theme.inputBG};
    border-width: ${(props: TP) => props.theme.borderWidth};
    border-style: solid;
  }
  .rs__control:hover {
    border-color: ${(props: TP) => props.theme.borderHover};
  }
  .rs__control--is-focused,
  .rs__control--is-focused:hover {
    border-color: ${(props: TP) => props.theme.focusColor};
    border-radius: ${(props: TP) => props.theme.radius};
    outline: none;
    box-shadow: none;
  }
`;

const StyledSelect = styled(Select).attrs({
  classNamePrefix: "rs"
})`
  ${styledSelectCSS}
`;

export default StyledSelect;
