import { curry } from "./curry.js";
export {
  prop,
};

// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);
