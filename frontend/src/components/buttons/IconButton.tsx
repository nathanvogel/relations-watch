import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

type IconButtonProps = {
  small?: boolean;
  withText?: boolean;
};

const withTextCSS = css<IconButtonProps>`
  & > svg {
    margin-right: ${props => (props.small ? "6px" : "9px")};
  }
`;

const iconButtonCSS = css<IconButtonProps>`
  height: auto;
  min-height: ${props => (props.small ? "16px" : "32px")};
  min-width: ${props => (props.small ? "16px" : "32px")};
  text-align: center;
  font-size: ${props => (props.small ? props.theme.fontSizeS : "inherit")}
  line-height: 1;
  box-sizing: border-box;
  padding: ${props => props.theme.inputPaddingTB}
    ${props => props.theme.inputPaddingLR};
  background-color: ${props => props.theme.buttonBG};
  border-color: ${props => props.theme.inputBorder};
  border-width: ${props => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${props => props.theme.smallRadius};

  & > svg {
    height: ${props => (props.small ? "12px" : "20px")}
    width: ${props => (props.small ? "12px" : "20px")}
    // Vertically center the icon
    transform: translateY(2px);
  }

  cursor: pointer;
  color: ${props => props.theme.mainTextColor};

  &:not([disabled]):hover {
    background-color: ${props => props.theme.surfaceHover};
    border-color: ${props => props.theme.inputBorder};
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
`;

export const IconButton = styled.button<IconButtonProps>`
  ${iconButtonCSS}
`;

export const IconButtonLink = styled(({ withText, small, ...rest }) => (
  <Link {...rest} />
))<IconButtonProps>`
  ${iconButtonCSS}
  // Prevent text breaking + allow parent (ButtonBar) to apply margin
  display: inline-block;

  &:link,
  &:visited,
  &:hover,
  &:active {
    color: ${props => props.theme.mainTextColor};
    text-decoration: none;
  }
`;

export default IconButton;
