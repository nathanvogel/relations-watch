function prefixToFromWithCollectionName(doc) {
  if (doc._to.indexOf("entities/") < 0) doc._to = "entities/" + doc._to;
  if (doc._from.indexOf("entities/") < 0) doc._from = "entities/" + doc._from;
}

module.exports = {
  prefixToFromWithCollectionName
};
