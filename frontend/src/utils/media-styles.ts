import { css, FlattenSimpleInterpolation } from "styled-components";

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
  mobile: 576
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
