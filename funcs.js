import { curry } from "./curry.js";
export {
  compose,
  pipe,
  flip,
};
const compose = (...fns) =>
  (...args) => fns.reduceRight((res, fn) => [fn(...res)], args)[0];

const pipe = (...fns) =>
  (...args) => fns.reduce((res, fn) => [fn(...res)], args)[0];

// flip :: (a -> b -> c) -> b -> a -> c
const flip = curry((fn, a, b) => fn(b, a));
