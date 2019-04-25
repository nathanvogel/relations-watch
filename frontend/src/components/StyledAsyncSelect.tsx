import styled from "styled-components";
// import AsyncSelect from "react-select/lib/Async";
import AsyncCreatable from "react-select/lib/AsyncCreatable";

const StyledAsyncSelect = styled(AsyncCreatable)`
  min-width: 150px;
  display: inline-block;

  .rs__indicators {
    display: none;
  }
  .rs__control {
    min-height: 22px;
    border-radius: 0px;
  }
  .rs__control--is-focused {
    border-radius: 0px;
  }
`;

export default StyledAsyncSelect;
