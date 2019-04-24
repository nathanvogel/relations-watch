module.exports = {
  relCollectionName: "relations",
  entCollectionName: "entities",
  souCollectionName: "sources",
  ENTITY_TYPES: {
    PHYSICAL_PERSON: 1,
    MORAL_PERSON: 2,
    EVENT: 10,
    SPECIAL_GROUP: 100
  },
  RELATION_TYPES: {
    OWNS: 1,
    OWNS_A_SHARE: 2,
    ENABLES_A_JOB: 3,
    ENABLES_A_CONTRACT: 4,
    INFLUENCES_IDEAS: 10,
    EXCHANGES_VALUES: 100,
    COMMON_ACTIVITES: 110,
    FAMILY: 300,
    FRIENDSHIP: 310,
    LOVES: 400
  },
  SOURCE_TYPES: {
    LINK: 1,
    REF: 2
  }
};
