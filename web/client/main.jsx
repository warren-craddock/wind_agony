import React from 'react';
import { render } from 'react-dom';

import { FileInputForm } from 'web/client/file_input_form.jsx';
import { WindAgonyMap } from 'web/client/wind_agony_map.jsx';

class App extends React.Component {
  render = () => {
    return (
      <div>
        <FileInputForm />
        <WindAgonyMap />
      </div>
    );
  }
};

render(<App />, document.getElementById('root'));
