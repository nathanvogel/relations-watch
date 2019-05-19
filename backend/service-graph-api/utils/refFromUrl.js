const UrlParse = require("url-parse");
const { getRootDomain } = require("./utils");

const youtubeRegexp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

function getSimplifiedLink(fullUrl, parsedUrl, rootDomain) {
  // Default computation of the root domain if it's not provided
  if (!parsedUrl) parsedUrl = new UrlParse(fullUrl);
  if (!rootDomain) rootDomain = getRootDomain(parsedUrl.hostname);

  // Uniform Youtube links
  fullUrl = getUniformYoutubeLink(fullUrl, parsedUrl, rootDomain);

  // Remove protocol
  var ref = fullUrl.replace(/^https?:\/\//, "");

  // TODO : remove hash
  return ref;
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

function getUniformYoutubeLink_Regexp(fullUrl, parsedUrl, rootDomain) {
  if (!rootDomain) return fullUrl;
  if (!parsedUrl) return fullUrl;
  if (rootDomain !== "youtube.com" && rootDomain !== "youtu.be") return fullUrl;

  var matches = fullUrl.match(youtubeRegexp);
  console.log("Matches:", matches);
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
  getUniformYoutubeLink_Regexp
};
