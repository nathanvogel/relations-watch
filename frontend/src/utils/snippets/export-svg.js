var CONTAINER_TAGS = ["svg", "g"];
var STYLE_PROPS = {
  rect: ["fill", "stroke", "stroke-width", "opacity"],
  path: ["fill", "stroke", "stroke-width", "opacity"],
  circle: ["fill", "stroke", "stroke-width", "opacity"],
  line: ["stroke", "stroke-width", "opacity"],
  text: [
    "fill",
    "font-size",
    "text-anchor",
    "font-family",
    "font-weigth",
    "text-decoration",
    "paint-order",
    "stroke",
    "stroke-width",
    "stroke-opacity",
    "stroke-linecap",
    "stroke-linejoin",
  ],
  polygon: ["stroke", "fill", "opacity"],
};

function read_Element(ParentNode, OrigData) {
  var Children = ParentNode.childNodes;
  var OrigChildDat = OrigData.childNodes;

  for (var cd = 0; cd < Children.length; cd++) {
    var Child = Children[cd];

    var TagName = Child.tagName;
    if (CONTAINER_TAGS.indexOf(TagName) >= 0) {
      read_Element(Child, OrigChildDat[cd]);
    } else if (TagName in STYLE_PROPS) {
      var StyleDef = window.getComputedStyle(OrigChildDat[cd]);

      var StyleString = "";
      for (var st = 0; st < STYLE_PROPS[TagName].length; st++) {
        StyleString +=
          STYLE_PROPS[TagName][st] +
          ":" +
          StyleDef.getPropertyValue(STYLE_PROPS[TagName][st]) +
          "; ";
      }

      Child.setAttribute("style", StyleString);
    }
  }
}

function exportStyledSVG(svgElem) {
  var oDOM = svgElem.cloneNode(true);
  read_Element(oDOM, svgElem);

  var data = new XMLSerializer().serializeToString(oDOM);
  var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  var url = window.URL.createObjectURL(svg);

  var link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.appendChild(document.createTextNode(""));
  link.download = "relations.watch.svg";
  link.href = url;

  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
}

export default exportStyledSVG;
