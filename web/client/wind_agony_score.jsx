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
    const scores =
        LineIntegral(curve, this.props.bounding_box, this.props.wind);
    const agony_score = scores.positive_integral;
    const blessing_score = -1.0 * scores.negative_integral;

    // Describe the scores in colorful language.
    let description = "";
    if (blessing_score > 1.0) {
      description += "Bitchin' tailwinds";
    } else if (blessing_score > 0.5) {
      description += "Strong tailwinds";
    } else if (blessing_score > 0.25) {
      description += "Some tailwinds";
    } else {
      description += "No tailwinds"
    }

    if (agony_score > 1.0) {
      description += " and god-awful headwinds";
    } else if (agony_score > 0.5) {
      description += " and strong headwinds";
    } else if (agony_score > 0.25) {
      description += " and some headwinds";
    } else {
      description += " and no headwinds";
    }

    return (
      <div>
        <h2>Wind Agony Score: {agony_score.toFixed(3)}</h2>
        <h2>Wind Blessing Score: {blessing_score.toFixed(3)}</h2>
        <h1>{description}</h1>
      </div>
    );
  }
}

export { WindAgonyScore };

