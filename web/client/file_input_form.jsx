import React from 'react';

import { ReadSingleFile } from 'web/client/data_provider.js';

class FileInputForm extends React.Component {
  handleChange = (evt) => {
    ReadSingleFile(evt, (contents) => {
      console.log(contents);
    })
  }

  render = () => {
    return (
      <div>
        <input type="file" id="file-input" onChange={this.handleChange}/>
        <h3>Contents of the file:</h3>
        <pre id="file-content"></pre>
      </div>
    );
  }
}

export { FileInputForm };
