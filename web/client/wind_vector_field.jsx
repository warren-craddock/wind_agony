import React from 'react';

class WindVectorField extends React.Component {
  render = () => {
    // If there's no wind vector field yet, just return null.
    if (!this.props.wind) {
      return null;
    }

    // Create an offscreen canvas and fill it with the wind data.
    // FIXME make a parent component that computes bounding box and passes along
    // SVG heights and so on.
    const kNumPoints = 3;
    let canvas = document.createElement('canvas');
    canvas.width = kNumPoints;
    canvas.height = kNumPoints;
    let context = canvas.getContext('2d');
    context.putImageData(this.props.wind, 0, 0);

    // Convert the canvas to a data URL so it can be rendered along with the
    // rest of the SVG elements.
    const image_data = canvas.toDataURL();

    return (
      <g>
        <image
          x={this.props.bounding_box.min_lon}
          y={this.props.bounding_box.min_lat}
          width={this.props.bounding_box.lon_range}
          height={this.props.bounding_box.lat_range}
          preserveAspectRatio="none"
          xlinkHref={image_data} />
      </g>
    );

    return null;
  }
}

export { WindVectorField };

