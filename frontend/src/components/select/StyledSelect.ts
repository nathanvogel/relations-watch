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
  display: inline-block;
  width: 100%;

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

  .rs__menu {
    margin-top: 0px;
    margin-bottom: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: ${(props: TP) => props.theme.radius};
    border-bottom-right-radius: ${(props: TP) => props.theme.radius};

    .rs__menu-list {
      padding-top: 0px;
      padding-bottom: 0px;

      .rs__option {
        box-sizing: border-box;
        background-color: ${(props: TP) => props.theme.appBG};
        border-color: ${(props: TP) => props.theme.appBG};
        border-width: ${(props: TP) => props.theme.borderWidth};
        border-style: solid;
        border-radius: 0px;
        padding-top: ${(props: TP) => props.theme.inputPaddingTB};
        padding-bottom: ${(props: TP) => props.theme.inputPaddingTB};
        color: ${(props: TP) => props.theme.mainTextColor};
      }

      .rs__option--is-focused {
        border-color: ${(props: TP) => props.theme.borderHover};
        border-radius: ${(props: TP) => props.theme.radius};
      }

      .rs__option--is-selected {
        color: ${(props: TP) => props.theme.mainTextColor};
        background-color: ${(props: TP) => props.theme.inputBG};
      }
    }
  }
`;

const StyledSelect = styled(Select).attrs({
  classNamePrefix: "rs"
})`
  ${styledSelectCSS}
`;

export default StyledSelect;
