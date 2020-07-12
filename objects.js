import { curry } from "./curry.js";
import { Maybe } from "./alg_structs.js";
import { compose } from "./funcs.js";
export {
  prop,
  safeProp,
};

// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);

// safeProp :: String -> Object -> Maybe a
const safeProp = curry((p, obj) => compose(Maybe.of, prop(p))(obj));
