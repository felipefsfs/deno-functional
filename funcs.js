export {
  compose,
  pipe,
};
const compose = (...fns) =>
  (...args) => fns.reduceRight((res, fn) => [fn(...res)], args)[0];

const pipe = (...fns) =>
  (...args) => fns.reduce((res, fn) => [fn(...res)], args)[0];
