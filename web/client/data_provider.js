const parseString = require('xml2js').parseString;

const DARK_SKY_API_KEY = "24490cda9c1db43d3e46237c0ecdd2ba";

function ReadTcxFile(evt, callback) {
  const file = evt.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function(evt) {
    // Convert the TCX file from XML to JSON.
    const xml = evt.target.result;
    parseString(xml, callback);
  };

  reader.readAsText(file);
}

export { ReadTcxFile };
