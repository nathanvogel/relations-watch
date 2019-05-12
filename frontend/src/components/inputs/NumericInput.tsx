import styled from "styled-components";
import ReactNumeric from "react-numeric";
import { cssInput } from "./Input";

const NumericInput = styled(ReactNumeric).attrs({
  // Not working, probably not standard enough for React
  inputMode: "numeric"
})`
  ${cssInput}
`;

// type Props = any;
//
// class te extends React.Component<Props> {
//   render() {
//     return <ReactNumeric {...this.props} />;
//   }
// }

export default NumericInput;
