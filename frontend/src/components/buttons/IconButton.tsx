import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

type IconButtonProps = {
  small?: boolean;
  withText?: boolean;
  primary?: boolean;
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
  font-weight: ${props => (props.primary ? "bold" : "normal")};
  // Necessary to put line-height to override normalize.css for consistency
  // between <Link> and <button>
  line-height: ${props => props.theme.lineHeight}
  box-sizing: border-box;
  padding: 2px
    ${props => (props.withText ? props.theme.inputPaddingLR : "2px")};
  background-color: ${props =>
    props.primary ? props.theme.primaryButtonBG : props.theme.buttonBG};
  border-color: ${props =>
    props.withText && !props.primary
      ? props.theme.buttonBorder
      : "transparent"};
  border-width: ${props => props.theme.borderWidth};
  border-style: solid;
  border-radius: ${props => props.theme.smallRadius};
  box-shadow: ${props => props.theme.absentShadow};

  & > svg {
    height: ${props => (props.small ? "12px" : "22px")}
    width: ${props => (props.small ? "12px" : "22px")}
    // Vertically center the icon
    transform: translateY(2px);
  }

  cursor: pointer;
  color: ${props =>
    props.primary ? props.theme.lightTextColor : props.theme.mainTextColor};

  &:not([disabled]):hover {
    background-color: ${props =>
      props.primary
        ? props.theme.primaryButtonHoverBG
        : props.theme.buttonHoverBG};
    border-color: ${props =>
      props.withText && !props.primary
        ? props.theme.buttonBorder
        : "transparent"};
  }

  &:focus,
  &:not([disabled]):hover:focus {
    color: ${props =>
      props.primary ? props.theme.lightFocusColor : props.theme.focusColor};
    border-color: ${props => props.theme.focusColor};
    box-shadow: ${props => props.theme.focusShadow};
    outline: none;
  }

  &:disabled {
    background-color: ${props => props.theme.buttonBG};
    color: ${props => props.theme.disabledTextColor};
    cursor: not-allowed;
  }

  transition: all ${props => props.theme.shortAnim} ease-out;

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
