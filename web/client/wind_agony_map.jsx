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

    // Compute a size for the SVG drawing that fits on one screen.
    // const track_aspect_ratio = this.props.bounding_box.lon_range /
    //                            this.props.bounding_box.lat_range;
    // let svg_height = 0.75 * window.innerHeight;
    // let svg_width = track_aspect_ratio * svg_height;
    // if (svg_width > window.innerWidth) {
    //   svg_width = 0.75 * window.innerWidth;
    //   svg_height = svg_width / track_aspect_ratio;
    // }

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
    return (
      <svg
        viewBox={view_box}
        transform="scale(1, -1)"
        style={{margin: "20px", maxHeight: window.innerHeight * 0.65}}>
        <TcxCourse
          trackpoints={trackpoints} />
        <WindVectorField
          bounding_box={this.props.bounding_box}
          wind={this.props.wind || null} />
      </svg>
    );
  }
}

export { WindAgonyMap };

