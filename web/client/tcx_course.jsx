import React from 'react';

class TcxCourse extends React.Component {
  render = () => {
    // If no trackpoints are available, just return null.
    if (!this.props.trackpoints) return null;

    // Extract lat,lon from the trackpoints. Join them with spaces.
    const lon_lat = this.props.trackpoints.map(
      tp => tp.Position[0].LongitudeDegrees[0] + ","
          + tp.Position[0].LatitudeDegrees[0]
    );
    const lon_lat_string = lon_lat.join(" ");

    return (
      <g>
        <polyline
          stroke="blue"
          fill="none"
          strokeWidth="0.001"
          points={lon_lat_string} />
      </g>
    );
  }
}

export { TcxCourse };
