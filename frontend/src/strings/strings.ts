type MyStringRes = {
  [key: string]: string;
};

export const RELATION_TYPES: MyStringRes = {
  OWNS: "owns",
  OWNS_A_SHARE: "owns a share of",
  ENABLES_A_JOB: "enables a job for",
  ENABLES_A_CONTRACT: "enables a contract for",
  INFLUENCES_IDEAS: "influences the ideas of",
  EXCHANGES_VALUES: "has values exchanges with",
  COMMON_ACTIVITES: "has common activities with",
  FAMILY: "is a related of",
  FRIENDSHIP: "is friends with",
  LOVES: "loves"
};
