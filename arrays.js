import { curry } from "./curry.js";
export {
  filter,
  last,
  map,
  reduce,
  reverse,
  sortBy,
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

// sortBy :: Ord b => (a -> b) -> [a] -> [a]
const sortBy = curry((fn, xs) =>
  xs.sort((a, b) => {
    if (fn(a) === fn(b)) {
      return 0;
    }

    return fn(a) > fn(b) ? 1 : -1;
  })
);
