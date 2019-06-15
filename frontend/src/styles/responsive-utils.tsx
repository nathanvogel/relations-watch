import { css, FlattenSimpleInterpolation } from "styled-components";
import React from "react";
import Responsive from "react-responsive";

type Sizes = { [key: string]: number };
const sizes: Sizes = {
  desktop: 992,
  tablet: 768,
  mobile: 576,
};

//  ===============================
//  STYLED-COMPONENTS other version
//  ===============================
// From: https://github.com/styled-components/styled-components/issues/2303#issuecomment-480047731
const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;
const customInverseMediaQuery = (maxWidth: number) =>
  `@media (min-width: ${maxWidth}px)`;

export const mediaq = {
  custom: customMediaQuery,
  desktop: customMediaQuery(sizes.desktop),
  tablet: customMediaQuery(sizes.tablet),
  mobile: customMediaQuery(sizes.mobile),
  notMobile: customInverseMediaQuery(sizes.mobile),
  notDesktop: customMediaQuery(sizes.desktop),
  notTablet: customMediaQuery(sizes.tablet),
};

/* Now we have our methods on media and can use them instead of raw queries
const Content = styled.div`
  ${media.desktop} {
    background: dodgerblue;
  }
  ${media.tablet} {
    background: mediumseagreen;
  }
  ${media.phone} {
    background: palevioletred;
  }
`;
  */

//  =================
//  STYLED-COMPONENTS
//  =================

type Acc = {
  [key: string]: (...args: any[]) => FlattenSimpleInterpolation;
};

type MediaQueryHelper = {
  desktop?: any;
  tablet?: any;
  mobile?: any;
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
