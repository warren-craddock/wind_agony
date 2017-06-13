import React from 'react';

import { LineIntegral } from 'web/client/calculus.js';

class WindAgonyScore extends React.Component {
  render = () => {
    // If no TCX file has been loaded, just return null.
    if (!this.props.tcx) return null;

    // If no wind data has been loaded, just return null.
    if (!this.props.wind) return null;

    // Extract the list of trackpoints from the TCX object stored in the
    // toplevel Redux store.
    const trackpoints =
      this.props.tcx.TrainingCenterDatabase.Courses[0].Course[0].Track[0].Trackpoint;

    // Extract simple pairs of (lon, lat) from each trackpoint.
    const curve = trackpoints.map(obj => ({
      lon: parseFloat(obj.Position[0].LongitudeDegrees[0]),
      lat: parseFloat(obj.Position[0].LatitudeDegrees[0])}));

    // Compute the line integral of the track through the wind vector field.
    const wind_agony_score =
      LineIntegral(curve, this.props.bounding_box, this.props.wind);

    return (
      <div>
        <h1>Wind Agony Score</h1>
        <h2>{wind_agony_score.toFixed(3)}</h2>
      </div>
    );
  }
}

export { WindAgonyScore };

