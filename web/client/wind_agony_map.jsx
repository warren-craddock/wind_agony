import React from 'react';

class WindAgonyMap extends React.Component {
  render = () => {
    // If no TCX file has been loaded, just return an empty SVG document.
    if (!this.props.tcx) {
      return <svg />;
    }

    // Extract the list of trackpoints from the TCX object stored in the
    // toplevel Redux store.
    const trackpoints =
      this.props.tcx.TrainingCenterDatabase.Courses[0].Course[0].Track[0].Trackpoint;

    // Reduce the trackpoints to compute their bounding box.
    const initial_value = [Infinity, -Infinity, Infinity, -Infinity];
    const reduce_fn = (acc, tp) => {
      acc[0] = Math.min(acc[0], tp.Position[0].LongitudeDegrees[0]);
      acc[1] = Math.max(acc[1], tp.Position[0].LongitudeDegrees[0]);
      acc[2] = Math.min(acc[2], tp.Position[0].LatitudeDegrees[0]);
      acc[3] = Math.max(acc[3], tp.Position[0].LatitudeDegrees[0]);
      return acc;
    }
    const bounding_box = trackpoints.reduce(reduce_fn, initial_value);

    // Compute the size of the SVG document, filling most of the browser
    // viewport in the vertical direction, so it's all visible on one screen.
    const track_lon_min = bounding_box[0];
    const track_lat_min = bounding_box[2];
    const track_lon_range = bounding_box[1] - bounding_box[0];
    const track_lat_range = bounding_box[3] - bounding_box[2];
    const track_aspect_ratio = track_lon_range / track_lat_range;
    const svg_height = 0.75 * window.innerHeight;
    const svg_width = track_aspect_ratio * svg_height;

    // Compute the viewBox of the SVG document from the track's bounding box.
    const view_box =
      [track_lon_min, track_lat_min, track_lon_range, track_lat_range];

    // Extract lat,lon from the trackpoints. Join them with spaces.
    const lon_lat = trackpoints.map(
      tp => tp.Position[0].LongitudeDegrees[0] + ","
          + tp.Position[0].LatitudeDegrees[0]
    );
    const lon_lat_string = lon_lat.join(" ");

    // Emit the path of trackpoints as an SVG polyline.
    // TODO(wcraddock): The transform here is a total hack. This simple demo
    // only supports tracks in the northern hemisphere.
    return (
      <svg
        width={svg_width}
        height={svg_height}
        viewBox={view_box.join(" ")}
        transform="scale(1, -1)"
        style={{margin: "10px"}}>
        <polyline
          stroke="blue"
          fill="none"
          strokeWidth="0.001"
          points={lon_lat_string} />
      </svg>
    );
  }
}

export { WindAgonyMap };

