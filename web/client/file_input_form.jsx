import React from 'react';

import { ReadTcxFile, ComputeBoundingBox, GetDarkSkyWindVectorField } from 'web/client/data_provider.js';

class FileInputForm extends React.Component {
  handleChange = (evt) => {
    // Asynchronously read the TCX file, then fire an action with the resulting
    // JavaScript object.
    ReadTcxFile(evt, (err, tcx) => {
      if (err) {
        console.log(err);
        return;
      }

      // The TCX file is loaded now; compute its bounding box, then fire an
      // action that will cause the page to re-render.
      const bounding_box = ComputeBoundingBox(tcx);
      this.props.dispatch({type: 'SET_TCX_DATA', payload: {tcx, bounding_box}});

      // Asynchronously get wind data from Dark Sky, then fire an action with
      // the resulting vector field.
      // FIXME move kNumPoints upwards somewhere.
      console.log('Calling GetDarkSkyWindVectorField');
      const kNumPoints = 5;
      GetDarkSkyWindVectorField(null, this.props.bounding_box, kNumPoints,
        image_data => this.props.dispatch(
          {type: 'SET_WIND_VECTOR_FIELD', payload: image_data}));
    });
  }

  render = () => {
    return (
      <div>
        <input
          type="file"
          id="file-input"
          style={{margin: "10px"}}
          onChange={this.handleChange}/>
      </div>
    );
  }
}

export { FileInputForm };
