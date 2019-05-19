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

export const styledSelectCSS = css`
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
    border-radius: ${props => props.theme.radius};
    border-color: ${props => props.theme.inputBG};
    border-width: ${props => props.theme.borderWidth};
    border-style: solid;
  }
  .rs__control:hover {
    border-color: ${props => props.theme.borderHover};
  }
  .rs__control--is-focused,
  .rs__control--is-focused:hover {
    border-color: ${props => props.theme.focusColor};
    border-radius: ${props => props.theme.radius};
    outline: none;
    box-shadow: none;
  }

  .rs__menu {
    margin-top: 0px;
    margin-bottom: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: ${props => props.theme.radius};
    border-bottom-right-radius: ${props => props.theme.radius};

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
        border-radius: ${props => props.theme.radius};
      }

      .rs__option--is-selected {
        color: ${props => props.theme.mainTextColor};
        background-color: ${props => props.theme.inputBG};
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
