// Actions
const SAVE_USERS = 'home/SAVE_USERS';

// Initial State
const initialState = {
  users: []
};

// Reducer
const usersReducer = (state = initialState, action) =>
  action.type === SAVE_USERS ? ({ ...state, users: removeDuplicatesByKey([...state.users, ...action.users], 'id') }) :
  state;

// Action Creators
export const saveUsersAction = (users) => ({ type: SAVE_USERS, users });


// Helpers

// Generic function used to remove duplicates from array based on comparator (key)
const removeDuplicatesByKey = (list, comparator) => list.filter((x, i, self) => self.findIndex(t => t[comparator] === x[comparator]) === i);

export default usersReducer;
