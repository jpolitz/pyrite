var crd = require("../src/create-run-dirs.js");

crd.createRunDirs({
  assignmentDir: "./simple-racket",
  outDir: "./simple-racket-out",
  testFilename: "test.rkt",
  importMatcher: false
});

