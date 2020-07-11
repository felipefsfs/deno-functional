export {
  curry,
};
// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn, ...args0) {
  const arity = fn.length;
  return _curry_upt_args(...args0);
  function _curry_upt_args(...args) {
    return _curry;
    function _curry(...new_args) {
      if ((args.length + new_args.length) < arity) {
        return _curry_upt_args(...args, ...new_args);
      }
      return fn(...args, ...new_args);
    }
  }
}
