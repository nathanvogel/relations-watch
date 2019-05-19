import { simplifyYoutubeUrl } from "./refFromUrl";

// For proper parsing, the URL protocol is required.
// (the user will also need to put it).

const targetUrl = "https://www.youtube.com/watch?v=wR-JxJ9II78";
const validUrls = [
  "https://www.youtube.com/watch?v=wR-JxJ9II78&list=RDwR-JxJ9II78&start_radio=1&t=4",
  "http://www.youtube.com/watch?v=wR-JxJ9II78&list=RDwR-JxJ9II78&start_radio=1&t=4",
  "https://youtu.be/wR-JxJ9II78",
  "http://www.youtube.com/watch?v=wR-JxJ9II78&feature=feedrec_grec_index",
  "http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/wR-JxJ9II78",
  "http://www.youtube.com/v/wR-JxJ9II78?fs=1&amp;hl=en_US&amp;rel=0",
  "http://www.youtube.com/watch?v=wR-JxJ9II78#t=0m10s",
  "http://www.youtube.com/embed/wR-JxJ9II78?rel=0",
  "http://www.youtube.com/watch?v=wR-JxJ9II78"
];
const invalidUrls = [
  "https://www.fakeyoutube.com/watch?v=wR-JxJ9II78",
  "www.fakeyoutube.com/watch?v=wR-JxJ9II78",
  "https://youtu.bee/wR-JxJ9II78"
];

test("test valid youtube urls", () => {
  for (let url of validUrls) {
    expect(simplifyYoutubeUrl(url)).toBe(targetUrl);
  }
});

test("test invalid youtube urls", () => {
  for (let url of invalidUrls) {
    expect(simplifyYoutubeUrl(url)).toBe(url);
  }
});
