import { css, FlattenSimpleInterpolation } from "styled-components";
import React from "react";
import Responsive from "react-responsive";

//  =================
//  STYLED-COMPONENTS
//  =================
type Sizes = {
  [key: string]: number;
};

type Acc = {
  [key: string]: (...args: any[]) => FlattenSimpleInterpolation;
};

type MediaQueryHelper = {
  desktop?: any;
  tablet?: any;
  mobile?: any;
};

const sizes: Sizes = {
  desktop: 992,
  tablet: 768,
  mobile: 576,
};

// Iterate through the sizes and create a media template
export const media: MediaQueryHelper = Object.keys(sizes).reduce(
  (acc: Acc, label: string): Acc => {
    acc[label] = (...args) => {
      // @ts-ignore
      const cssLines = css(...args);
      return css`
        @media (max-width: ${sizes[label] / 16}em) {
          ${cssLines}
        }
      `;
    };

    return acc;
  },
  {}
);

//  ================
//  REACT-RESPONSIVE
//  ================

export const Desktop = (props: any) => (
  <Responsive {...props} maxWidth={sizes.desktop} />
);
export const Tablet = (props: any) => (
  <Responsive {...props} maxWidth={sizes.tablet} />
);
export const Mobile = (props: any) => (
  <Responsive {...props} maxWidth={sizes.mobile} />
);
export const NotMobile = (props: any) => (
  <Responsive {...props} minWidth={sizes.mobile + 1} />
);

// const Example = () => (
//   <div>
//     <Desktop>Desktop or laptop</Desktop>
//     <Tablet>Tablet</Tablet>
//     <Mobile>Mobile</Mobile>
//     <Default>Not mobile (desktop or laptop or tablet)</Default>
//   </div>
// );
