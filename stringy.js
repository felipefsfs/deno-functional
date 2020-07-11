import { curry } from "./curry.js";
export {
  split,
  match,
  replace,
  intercalate,
  toLowerCase,
  toString,
  toUpperCase,
  concat,
};
// split :: String -> String -> [String]
const split = curry((sep, str) => str.split(sep));

// match :: RegExp -> String -> Boolean
const match = curry((re, str) => re.test(str));

// replace :: RegExp -> String -> String -> String
const replace = curry((re, rpl, str) => str.replace(re, rpl));

// intercalate :: String -> [String] -> String
const intercalate = curry((str, xs) => xs.join(str));

// toString :: a -> String
const toString = String;

// toLowerCase :: String -> String
const toLowerCase = (s) => s.toLowerCase();

// toUpperCase :: String -> String
const toUpperCase = (s) => s.toUpperCase();

// concat :: String -> String -> String
const concat = curry((a, b) => a.concat(b));
