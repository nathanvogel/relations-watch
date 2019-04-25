function prefixToFromWithCollectionName(doc) {
  if (doc._to.indexOf("entities/") < 0) doc._to = "entities/" + doc._to;
  if (doc._from.indexOf("entities/") < 0) doc._from = "entities/" + doc._from;
}

function getRootDomain(hostname) {
  var parts = hostname.split(".").reverse();
  // see if the second level domain is a common SLD.
  if (
    parts.length >= 3 &&
    parts[1].match(/^(com|edu|gov|net|mil|org|nom|co|name|info|biz|ac)$/i)
  ) {
    return [parts[2], parts[1], parts[0]].join(".");
  } else {
    return [parts[1], parts[0]].join(".");
  }
}

module.exports = {
  prefixToFromWithCollectionName,
  getRootDomain
};
