import React from 'react';

import { GetTrackpointsFromTcx } from 'web/client/data_provider.js';
import { LineIntegral } from 'web/client/calculus.js';

class WindAgonyScore extends React.Component {
  render = () => {
    // If no TCX file has been loaded, just return null.
    if (!this.props.tcx) return null;

    // If no wind data has been loaded, just return null.
    if (!this.props.wind) return null;

    // Extract the list of trackpoints from the TCX object stored in the
    // toplevel Redux store.
    const trackpoints = GetTrackpointsFromTcx(this.props.tcx);

    // Extract simple pairs of (lon, lat) from each trackpoint.
    const curve = trackpoints.map(obj => ({
      lon: parseFloat(obj.Position[0].LongitudeDegrees[0]),
      lat: parseFloat(obj.Position[0].LatitudeDegrees[0])}));

    // Compute the line integral of the track through the wind vector field. The
    // line integral is defined to be negative when you're riding along with a
    // tailwind.
    const wind_agony_score =
      LineIntegral(curve, this.props.bounding_box, this.props.wind);

    // Describe the score in colorful language.
    let wind_agony_string = "";
    if (wind_agony_score < -1000) {
      wind_agony_string = "You barely had to pedal!";
    } else if (wind_agony_score < -100) {
      wind_agony_string = "Nice tailwind";
    } else if (wind_agony_score < 100) {
      wind_agony_string = "Virtually no wind";
    } else if (wind_agony_score < 1000) {
      wind_agony_string = "The headwind wasn't fun";
    } else {
      wind_agony_string = "The headwind was a miserable bastard";
    }

    return (
      <div>
        <h1>Wind Agony Score</h1>
        <h2>{wind_agony_score.toFixed(3)}</h2>
        <h2>{wind_agony_string}</h2>
      </div>
    );
  }
}

export { WindAgonyScore };

