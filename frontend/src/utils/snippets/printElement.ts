function printElements(elements: Element[]) {
  if (elements.length <= 0) {
    console.log("No given elements. Aborting print.");
    return;
  }
  const { height, width } = elements[0].getBoundingClientRect();
  var mywindow = window.open("", "PRINT", `height=${height},width=${width}`);
  if (mywindow == null) {
    console.error("Coulnd't create window");
    return;
  }
  var headtxt = "";
  if (document.head) headtxt = document.head.innerHTML;
  mywindow.document.write("<html><head>");
  mywindow.document.write(headtxt);
  mywindow.document.write("</head><body>");
  // mywindow.document.write("<h2>" + document.title + "</h2>");
  for (let element of elements) {
    mywindow.document.write(element.outerHTML);
  }
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10

  mywindow.print();
  mywindow.close();

  return true;
}

export default printElements;
