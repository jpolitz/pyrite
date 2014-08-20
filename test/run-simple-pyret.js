var crd = require("../src/create-run-dirs.js");

crd.createRunDirs({
  assignmentDir: "./simple-pyret",
  outDir: "./simple-pyret-out",
  testFilename: "test.arr",
  importMatcher: 'import my-gdrive("sort") as S',
  importLine: 'import "sort.arr" as S'
});

