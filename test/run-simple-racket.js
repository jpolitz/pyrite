var crd = require("../src/create-run-dirs.js");

var options = {
  assignmentDir: "./simple-racket",
  outDir: "./simple-racket-out",
  testFilename: "test.rkt",
  importMatcher: false,
  runCommand: "racket test.rkt"
}

crd.createRunDirs(options);
crd.runTests(options);
