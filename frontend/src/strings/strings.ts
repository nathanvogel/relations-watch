type MyStringRes = {
  [key: string]: string;
};

export const RELATION_TYPES: MyStringRes = {
  OWNS: "owns",
  OWNS_A_SHARE: "owns a share of",
  ENABLES_A_JOB: "enables a job for",
  ENABLES_A_CONTRACT: "enables a contract for",
  INFLUENCES_IDEAS: "influences the ideas of",
  FAMILY: "is in the same family as",
  FRIENDSHIP: "is friends with",
  LOVES: "loves",
  COMMON_ACTIVITES: "did something with",
  EXCHANGES_VALUES: "traded with"
};

export const ENTITY_TYPES: MyStringRes = {
  PHYSICAL_PERSON: "Personne physique",
  MORAL_PERSON: "Personne morale",
  EVENT: "Evénement",
  SPECIAL_GROUP: "Groupe spécial"
};
