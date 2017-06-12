const API_KEY = "24490cda9c1db43d3e46237c0ecdd2ba";

function ReadSingleFile(evt, callback) {
  const file = evt.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function(evt) {
    const contents = evt.target.result;
    callback(contents);
  };

  reader.readAsText(file);
}

export { ReadSingleFile };
