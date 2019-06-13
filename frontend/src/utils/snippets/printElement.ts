function printElement(element: Element) {
  const { height, width } = element.getBoundingClientRect();
  var mywindow = window.open("", "PRINT", `height=${height},width=${width}`);
  if (mywindow == null) {
    console.error("Coulnd't create window");
    return;
  }
  const parentNode = element.parentElement;
  if (parentNode == null) {
    console.error("Coulnd't get parentNode");
    return;
  }
  var headtxt = "";
  if (document.head) headtxt = document.head.innerHTML;
  mywindow.document.write("<html><head>");
  mywindow.document.write(headtxt);
  mywindow.document.write("</head><body>");
  // mywindow.document.write("<h2>" + document.title + "</h2>");
  mywindow.document.write(parentNode.innerHTML);
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10

  mywindow.print();
  mywindow.close();

  return true;
}

export default printElement;
