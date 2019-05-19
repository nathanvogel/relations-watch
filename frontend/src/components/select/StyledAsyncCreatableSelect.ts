import styled from "styled-components";
import AsyncCreatable from "react-select/lib/AsyncCreatable";

import { styledSelectCSS } from "./StyledSelect";

const StyledAsyncCreatableSelect = styled(AsyncCreatable).attrs({
  classNamePrefix: "rs"
})`
  ${styledSelectCSS}

  .rs__indicators {
    display: none;
  }
`;

// const StyledAsyncCreatableSelect: React.FunctionComponent<
//   SelectComponentsProps
// > = (props: any) => {
//   console.log("CR", props);
//   return <StyledAsAsyncCreatableSelect as={AsyncCreatable} {...props} />;
// };

export default StyledAsyncCreatableSelect;
