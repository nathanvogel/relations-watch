import styled, { css } from "styled-components";

type IconButtonProps = {
  small?: boolean;
  withText?: boolean;
};

const withTextCSS = css`
  & > svg {
    margin-right: ${props => props.theme.inputMarginTB};
  }
`;

const smallIconCSS = css`
  & > svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
  }
`;

const IconButton = styled.button<IconButtonProps>`
  height: auto;
  min-height: ${props => (props.small ? "16px" : "28px")};
  min-width: ${props => (props.small ? "16px" : "28px")};
  font-size: ${props => (props.small ? props.theme.fontSizeS : "inherit")}
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingLR};
  background-color: ${props => props.theme.inputBG};
  border-color: ${props => props.theme.inputBG};
  border-width: ${props => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${props => props.theme.radius};

  cursor: pointer;
  color: inherit;

  &:not([disabled]):hover {
    background-color: ${props => props.theme.surfaceHover};
    border-color: ${props => props.theme.surfaceHover};
  }

  &:not([disabled]):hover:focus,
  &:focus {
    border-color: ${props => props.theme.focusColor};
    outline: none;
  }

  &:disabled {
    color: ${props => props.theme.secondaryTextColor};
    cursor: not-allowed;
  }

  ${props => props.withText && withTextCSS}
  ${props => props.small && smallIconCSS}
`;

export default IconButton;
