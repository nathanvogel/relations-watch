import React from "react";
import styled from "styled-components";

// Adapted to Typescript from
// https://github.com/styled-components/styled-components/issues/305#issuecomment-298680960
// But I'm currently favoring this solution
// https://github.com/styled-components/styled-components/issues/305#issuecomment-266197867

type SwallowArg = {
  swallowProps: string[];
};

const defaultSwallowArg: SwallowArg = { swallowProps: [] };

export const swallowingStyled = (
  WrappedComponent: React.ComponentType<any>,
  arg: SwallowArg = defaultSwallowArg
) => {
  const Wrapper: React.FunctionComponent<
    React.PropsWithChildren<{ [key: string]: any }>
  > = ({ children, ...props }) => {
    arg.swallowProps.forEach(propName => {
      delete props[propName];
    });
    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };
  return styled(Wrapper);
};
