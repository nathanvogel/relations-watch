// import original module declarations
import "styled-components";
import theme from "../styles/theme";

// and extend them!
type Theme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
