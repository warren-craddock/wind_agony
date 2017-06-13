import React from 'react';

const tinycolor = require("tinycolor2");

class WindVectorField extends React.Component {
  render = () => {
    // If there's no wind vector field yet, just return null.
    if (!this.props.wind) {
      return null;
    }

    // The wind data is an odd packed format, with the red channel containing
    // the bearing, and the green channel containing the speed. For
    // visualization, treat the wind data as HSL colors, where bearing is hue
    // and speed is saturation. Convert these colors into RGB for display.
    let rgb_image_data =
      new ImageData(this.props.wind.width, this.props.wind.height);
    for (let i = 0; i < this.props.wind.length; i += 1) {
      // Intepret the wind data point as an HSL color.
      // debugger;
      const kWindHeadingScale = 255.0 / 360.0;
      const kWindSpeedScale = 255.0 / 50.0;  // 50 mph is max displayed speed
      const hsl_color = tinycolor({
        h: this.props.wind[i].bearing * kWindHeadingScale,
        s: this.props.wind[i].speed * kWindSpeedScale,
        l: 0.5
      });

      // Convert the HSL color into RGB and fill in the output image pixel.
      const rgb_color = hsl_color.toRgb();
      rgb_image_data.data[i * 4 + 0] = rgb_color.r;
      rgb_image_data.data[i * 4 + 1] = rgb_color.g;
      rgb_image_data.data[i * 4 + 2] = rgb_color.b;
      rgb_image_data.data[i * 4 + 3] = 128;  // alpha 0.5
    }

    // Create an offscreen canvas and fill it with the wind data.
    // FIXME make a parent component that computes bounding box and passes along
    // SVG heights and so on.
    const kNumPoints = 10;
    let canvas = document.createElement('canvas');
    canvas.width = kNumPoints;
    canvas.height = kNumPoints;
    let context = canvas.getContext('2d');
    context.putImageData(rgb_image_data, 0, 0);

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

