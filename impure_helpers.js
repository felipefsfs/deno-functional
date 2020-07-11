import { curry } from "./curry.js";
export {
  trace,
};

const trace = curry((tag, x) => {
  console.log("T >>", tag, ">>", x);
  return x;
});
