import { SET_OPTION } from "./mutation-types";

export default {
  [SET_OPTION](state, { option, value }) {
    state.options[option] = value;
    localStorage.setItem(option, value);
  }
};
