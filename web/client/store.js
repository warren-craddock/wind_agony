import { createStore } from 'redux';
import { reducer } from 'reducer.js';

let store = createStore(reducer);

store.subscribe(() => {
  let currentState = store.getState();
  console.log('Store contains', currentState.toJS());
});

export { store };
