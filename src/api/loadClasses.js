import classes from "../data/classes.js";

// Pretends to be a server call. Takes 700ms, and can be told to fail
// so we can test the error + retry screen.
export function loadClasses({ shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Could not load classes. Please try again."));
      } else {
        resolve(classes);
      }
    }, 700);
  });
}
