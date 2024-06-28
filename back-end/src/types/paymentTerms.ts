type Duration = string;

type ImmediatePaymentTerms = {
  type: "immediate";
};

type NetDurationPaymentTerms = {
  type: "netDuration";
  value: Duration;
};

// type NetDatePaymentTerms = {
//   type: "netDate";
//   value: Date;
// };

type SplitPercentageDurationPaymentTerms = {
  type: "splitPercentageDuration";
  value: Array<{
    percentage: number;
    duration: Duration;
  }>;
};

// type SplitPercentageDatePaymentTerms = {
//   type: "splitPercentageDate";
//   value: Array<{
//     percentage: number;
//     date: Date;
//   }>;
// };

// type SplitAmountDurationPaymentTerms = {
//   type: "splitAmountDuration";
//   value: Array<{
//     amount: number;
//     duration: Duration;
//   }>;
// };

// type SplitAmountDatePaymentTerms = {
//   type: "splitAmountDate";
//   value: Array<{
//     amount: number;
//     date: Date;
//   }>;
// };

export type PaymentTerms =
  | ImmediatePaymentTerms
  | NetDurationPaymentTerms
  //   | NetDatePaymentTerms
  | SplitPercentageDurationPaymentTerms;
//   | SplitPercentageDatePaymentTerms
//   | SplitAmountDurationPaymentTerms;
//   | SplitAmountDatePaymentTerms;
