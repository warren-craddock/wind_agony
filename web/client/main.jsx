import React from 'react';
import { render } from 'react-dom';

import { connect, Provider } from 'react-redux';

import { FileInputForm } from 'web/client/file_input_form.jsx';
import { WindAgonyMap } from 'web/client/wind_agony_map.jsx';

import { store } from 'store.js';

// We're going to connect our Redux store to our React component tree. To do
// this, you must provide a function that converts whatever is in the store
// into a plain JavaScript object that will be given to the top-level React
// component as props. In our case, we just convert the store into plain
// JavaScript with Immutable's handy toJS() method.
function mapStateToProps(state) {
  return state.toJS();
}

class App extends React.Component {
  render = () => {
    return (
      <div>
        <FileInputForm {...this.props} />
        <WindAgonyMap {...this.props} />
      </div>
    );
  }
};

// Now we create a new "higher-order" React component, based on SocketIoApp,
// that is connected to the Redux store. Whenever the Redux store changes, our
// new ReduxApp will be re-rendered.
let ReduxApp = connect(mapStateToProps)(App);

// Finally, we have to wrap our App with a <Provider> component, which
// is connected to the store of our choice -- here it is just called "store".
render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>, document.getElementById('root'));
