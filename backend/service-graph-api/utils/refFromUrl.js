const UrlParse = require("url-parse");
const { getRootDomain } = require("./utils");

const youtubeRegexp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

function getSimplifiedLink(fullUrl, parsedUrl, rootDomain) {
  // Default computation of the root domain if it's not provided
  if (!parsedUrl) parsedUrl = new UrlParse(fullUrl);
  if (!rootDomain) rootDomain = getRootDomain(parsedUrl.hostname);

  // Uniform Youtube links
  var url = getUniformYoutubeLink(fullUrl, parsedUrl, rootDomain);
  // Uniform links with #anchors
  url = removeHash(url, parsedUrl);
  // Remove protocol last, otherwise it's potentially hard to parse the url.
  var ref = url.replace(/^https?:\/\//, "");
  return ref;
}

/**
 * Like removeHash(), but precomputes args.
 * This function is intended for test usage only.
 */
function removeHashFromStr(fullUrl) {
  const parsedUrl = new UrlParse(fullUrl);
  return removeHash(fullUrl, parsedUrl);
}

function removeHash(fullUrl, parsedUrl) {
  if (!parsedUrl.hash) return fullUrl;
  return removeLast(fullUrl, parsedUrl.hash);
}

function removeLast(str, searchTerm) {
  return str.replace(new RegExp(searchTerm + "$"), "");
}

/**
 * Like getUniformYoutubeLink(), but precomputes args.
 * This function is intended for test usage only.
 */
function simplifyYoutubeUrl(fullUrl) {
  const parsedUrl = new UrlParse(fullUrl);
  const rootDomain = getRootDomain(parsedUrl.hostname);
  return getUniformYoutubeLink(fullUrl, parsedUrl, rootDomain);
}

function getUniformYoutubeLink(fullUrl, parsedUrl, rootDomain) {
  if (!rootDomain) return fullUrl;
  if (!parsedUrl) return fullUrl;
  if (rootDomain !== "youtube.com" && rootDomain !== "youtu.be") return fullUrl;

  var matches = fullUrl.match(youtubeRegexp);
  // console.log("Matches:", matches);
  for (let match of matches) {
    if (match && match.length == 11) {
      return "https://www.youtube.com/watch?v=" + match;
    }
  }
}

module.exports = {
  getSimplifiedLink,
  simplifyYoutubeUrl,
  getUniformYoutubeLink,
  removeHashFromStr,
  removeHash
  // getUniformYoutubeLink_Regexp
};
