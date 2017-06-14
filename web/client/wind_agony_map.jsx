import React from 'react';

import { GetTrackpointsFromTcx } from 'web/client/data_provider.js';
import { TcxCourse } from 'web/client/tcx_course.jsx';
import { WindVectorField } from 'web/client/wind_vector_field.jsx';

class WindAgonyMap extends React.Component {
  render = () => {
    // If no TCX file has been loaded, just return null.
    if (!this.props.tcx) return null;

    // Extract the list of trackpoints from the TCX object stored in the
    // toplevel Redux store.
    const trackpoints = GetTrackpointsFromTcx(this.props.tcx);

    // Compute the viewBox of the SVG document from the track's bounding box.
    const view_box = [
      this.props.bounding_box.min_lon,
      this.props.bounding_box.min_lat,
      this.props.bounding_box.lon_range,
      this.props.bounding_box.lat_range
    ].join(" ");

    // Create an SVG document that includes the TCX track and the wind vector
    // field.
    // TODO(wcraddock): The transform here is a total hack. This simple demo
    // only supports tracks in the northern hemisphere.
    const max_height = window.innerHeight * 0.65;
    const scale_string = `scale(1, -1)`;
    const translate_distance =
      -1.0 * (this.props.bounding_box.min_lat + this.props.bounding_box.max_lat);
    const translate_string = `translate(0, ${translate_distance})`
    return (
      <svg
        viewBox={view_box}
        style={{margin: "20px", maxHeight: max_height}}>
        <g transform={scale_string}>
          <g transform={translate_string}>
            <TcxCourse
              trackpoints={trackpoints} />
            <WindVectorField
              bounding_box={this.props.bounding_box}
              wind={this.props.wind || null} />
          </g>
        </g>
      </svg>
    );
  }
}

export { WindAgonyMap };

