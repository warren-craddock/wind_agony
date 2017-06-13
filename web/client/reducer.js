import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

const initialState = Immutable.fromJS({
  tcx: null,
});

// Define a reducer, which is a function from (state, action) => new state.
let reducer = handleActions({
  // Sent after a TCX file has been loaded and parsed into a JavaScript object.
  // Wind data will be cleared and downloaded for the geographical region.
  SET_TCX_DATA: (state, action) => {
    console.log('ACTION: SET_TCX_DATA');
    state = state.set('tcx', action.payload.tcx);
    state = state.set('bounding_box', action.payload.bounding_box);
    state = state.set('wind', null);
    return state;
  },

  // Sent after wind vector data has been retrieved.
  SET_WIND_VECTOR_FIELD: (state, action) => {
    console.log('ACTION: SET_WIND_VECTOR_FIELD');
    state = state.set('wind', action.payload);
    return state;
  },
}, initialState);

export { reducer };
