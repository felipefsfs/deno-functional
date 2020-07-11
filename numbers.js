import { curry } from "./curry.js";
export {
  add,
};

// add :: Number -> Number -> Number
const add = curry((a, b) => a + b);
