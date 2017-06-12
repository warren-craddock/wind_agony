import React from 'react';

class WindAgonyMap extends React.Component {
  render = () => {
    // If no TCX file has been loaded, just return an empty SVG document.
    if (!this.props.tcx) {
      return <svg />;
    }

    return (
      <svg>
        <rect width="300" height="300" style={{fill: "rgb(255, 0, 0)"}} />
      </svg>
    );
  }
}

export { WindAgonyMap };

