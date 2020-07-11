import { curry } from "./curry.js";
export {
  filter,
  last,
  map,
  reduce,
  reverse,
};
// filter :: (a -> Boolean) -> [a] -> [a]
const filter = curry((fn, xs) => xs.filter(fn));

// last :: [a] -> a
const last = (xs) => xs[xs.length - 1];

// map :: Functor f => (a -> b) -> f a -> f b
const map = curry((fn, f) => f.map(fn));

// reduce :: (b -> a -> b) -> b -> [a] -> b
const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));

// reverse :: [a, b, c] -> [c, b ,a]
const reverse = reduce((acc, x) => [x, ...acc], []);
