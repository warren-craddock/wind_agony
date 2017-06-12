import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

const initialState = Immutable.fromJS({
  tcx: null,
});

// Define a reducer, which is a function from (state, action) => new state.
let reducer = handleActions({
  SET_TCX_FILE: (state, action) => {
    return state.set('tcx', action.payload);
  },
}, initialState);

export { reducer };
