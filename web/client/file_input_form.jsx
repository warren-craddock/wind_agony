import React from 'react';

import { ReadTcxFile } from 'web/client/data_provider.js';

class FileInputForm extends React.Component {
  handleChange = (evt) => {
    // Read the TCX file, and fire an action with the resulting JavaScript
    // object.
    ReadTcxFile(evt, (err, obj) => {
      if (!err)
        this.props.dispatch({type: 'SET_TCX_FILE', payload: obj});
    });
  }

  render = () => {
    return (
      <div>
        <input type="file" id="file-input" onChange={this.handleChange}/>
      </div>
    );
  }
}

export { FileInputForm };
