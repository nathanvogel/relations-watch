declare module "react-numeric" {
  import * as React from "react";

  export type ReactNumericType = "text" | "tel" | "hidden";

  export type ReactNumericValue = string | number;

  export type ReactNumericEmptyInputBehavior =
    | "null"
    | "focus"
    | "press"
    | "always"
    | "zero";

  export type ReactNumericLeadingZero = "allow" | "deny" | "keep";

  export type ReactNumericNegativePositiveSignPlacement = "l" | "r" | "p" | "s";

  export type ReactNumericOnInvalidPaste =
    | "error"
    | "ignore"
    | "clamp"
    | "truncate"
    | "replace";

  export type ReactNumericOutputFormat = "string" | "number";

  export type ReactNumericOverrideMinMaxLimits = "ceiling" | "floor" | "ignore";

  export type ReactNumericWheelOn = "focus" | "hover";

  export type ReactNumericWheelStep = string | number;

  export interface ReactNumericProps {
    type?: ReactNumericType;
    className?: string;
    style?: Object;
    disabled?: boolean;
    name?: string;
    tabIndex?: number;
    unselectable?: boolean;
    value?: ReactNumericValue;
    onChange?: (...args: any[]) => any;
    onFocus?: (...args: any[]) => any;
    onBlur?: (...args: any[]) => any;
    onKeyPress?: (...args: any[]) => any;
    onKeyUp?: (...args: any[]) => any;
    onKeyDown?: (...args: any[]) => any;
    allowDecimalPadding?: boolean;
    caretPositionOnFocus?: number;
    createLocalList?: boolean;
    currencySymbol?: string;
    currencySymbolPlacement?: string;
    decimalCharacter?: string;
    decimalCharacterAlternative?: string;
    decimalPlaces?: number;
    decimalPlacesRawValue?: number;
    decimalPlacesShownOnBlur?: number;
    decimalPlacesShownOnFocus?: number;
    defaultValueOverride?: string;
    digitalGroupSpacing?: string;
    digitGroupSeparator?: string;
    divisorWhenUnfocused?: number;
    emptyInputBehavior?: ReactNumericEmptyInputBehavior;
    eventBubbles?: boolean;
    eventIsCancelable?: boolean;
    failOnUnknownOption?: boolean;
    formatOnPageLoad?: boolean;
    historySize?: number;
    isCancellable?: boolean;
    leadingZero?: ReactNumericLeadingZero;
    maximumValue?: string;
    minimumValue?: string;
    modifyValueOnWheel?: boolean;
    negativeBracketsTypeOnBlur?: string;
    negativePositiveSignPlacement?: ReactNumericNegativePositiveSignPlacement;
    negativeSignCharacter?: string;
    noEventListeners?: boolean;
    onInvalidPaste?: ReactNumericOnInvalidPaste;
    outputFormat?: ReactNumericOutputFormat;
    overrideMinMaxLimits?: ReactNumericOverrideMinMaxLimits;
    positiveSignCharacter?: string;
    rawValueDivisor?: number;
    readOnly?: boolean;
    roundingMethod?: string;
    saveValueToSessionStorage?: boolean;
    selectNumberOnly?: boolean;
    selectOnFocus?: boolean;
    serializeSpaces?: string;
    showOnlyNumbersOnFocus?: boolean;
    showPositiveSign?: boolean;
    showWarnings?: boolean;
    styleRules?: Object;
    suffixText?: string;
    symbolWhenUnfocused?: string;
    unformatOnHover?: boolean;
    unformatOnSubmit?: boolean;
    valuesToStrings?: Object;
    wheelOn?: ReactNumericWheelOn;
    wheelStep?: ReactNumericWheelStep;
    preDefined?: Object;
  }

  export default class ReactNumeric extends React.Component<
    ReactNumericProps,
    any
  > {
    render(): JSX.Element;
  }

  export const predefinedOptions: any;
}
