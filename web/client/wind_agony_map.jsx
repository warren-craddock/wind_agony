import React from 'react';

class WindAgonyMap extends React.Component {
  render = () => {
    const rect_style = {
      fill: "rgb(255, 0, 0)"
    };

    return (
      <svg>
        <rect width="300" height="300" style={rect_style} />
      </svg>
    );
  }
}

export { WindAgonyMap };

