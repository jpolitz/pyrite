var crd = require("../src/create-run-dirs.js");

var options = {
  assignmentDir: "./simple-pyret",
  outDir: "./simple-pyret-out",
  testFilename: "test.arr",
  importMatcher: 'import my-gdrive("sort") as S',
  importLine: 'import "sort.arr" as S',
  runCommand: "make"
};

crd.createRunDirs(options);
crd.runTests(options);

