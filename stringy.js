import { curry } from "./curry.js";
export {
  split,
  match,
};
// split :: String -> String -> [String]
const split = curry((sep, str) => str.split(sep));

// match :: RegExp -> String -> Boolean
const match = curry((re, str) => re.test(str));
