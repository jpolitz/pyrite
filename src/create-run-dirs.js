var fs = require('fs');

/* options is
  {
     assigmentDir: string,
     outDir: string,
     testFilename: string,
     importLine: string,
     importMatcher: string
  }

  Takes a directory structure like:

  assignment-dir/
    submissions/
      student1/<testFilename>
      student2/<testFilename>
      ...
    coal/
      coal1Name/
        coal1File1.(arr|rkt|etc)
        coal1File2.(arr|rkt|etc)
        ...
      coal2Name/
        coal2File1.(arr|rkt|etc)
        coal2File2.(arr|rkt|etc)
        ...
      ...
    gold/
      goldFile1.(arr|rkt|etc)
      goldFile2.(arr|rkt|etc)
      ...

  And produces

  <outDir>/
    student1/
      coal1/
        <student1/testFilename> as <testFilename>
        coal1File1.(arr|rkt|etc)
        coal1File2.(arr|rkt|etc)
        ...
      coal2/
        <student1/testFilename> as <testFilename>
        coal1File1.(arr|rkt|etc)
        coal1File2.(arr|rkt|etc)
        ...
      gold/
        <student1/testFilename> as <testFilename>
        goldFile1.(arr|rkt|etc)
        goldFile2.(arr|rkt|etc)
        ...
   
  AND, in the copied testFilename files, lines matching "importMatcher" are
  replaced with "importLine", so for example, you could specify:

  importMatcher: 'import m-gdrive("nile") as N'
  importLine: 'import "nile.arr" as N

  Then the student files would all say 'import "nile.arr" as N'

*/
function createRunDirs(options) {
  var assignmentDir = options.assignmentDir;
  var outDir = options.outDir;
  var testFilename = options.testFilename;
  var importLine = options.importLine;
  var importMatcher = options.importMatcher;

  if(!fs.existsSync(assignmentDir)) {
    throw "Assignment directory " + assignmentDir + " does not exist.";
  }

  if(outDir.lastIndexOf("/") === outDir.length) {
    throw "Output directory " + outDir + " cannot have a trailing slash";
  }

  if(fs.existsSync(outDir)) {
    var movedOutDir = outDir + new Date().getTime();
    console.log("Output directory " + outDir + " exists; moving to " + movedOutDir);
    fs.renameSync(outDir, movedOutDir);
  }

  fs.mkdirSync(outDir);

  var submissionsDir = assignmentDir + "/submissions";
  var goldDir = assignmentDir + "/gold";
  var coalDir = assignmentDir + "/coal";

  function transformFile(contents) {
    if(!importMatcher) { return contents; }
    var lines = contents.split("\n"); 
    var result = "";
    for(var i = 0; i < lines.length; i++) {
      if(lines[i].indexOf(importMatcher) !== -1) {
        result += importLine + "\n";
      }
      else {
        result += lines[i] + "\n";
      }
    }
    return result;
  }

  function copyFiles(source, target) {
    fs.readdirSync(source).forEach(function(file) {
      var sourceFile = source + "/" + file;
      fs.createReadStream(sourceFile).pipe(fs.createWriteStream(target + "/" + file));
    });
  }

  var submissionDirs = fs.readdirSync(submissionsDir);
  var coalDirs = fs.readdirSync(coalDir);
  submissionDirs.forEach(function(sd) {
    var studentOutDir = outDir + "/" + sd;
    var studentTestFilename =  submissionsDir + "/" + sd + "/" + testFilename;
    var studentFileContents = String(fs.readFileSync(studentTestFilename));
    var transformedContents = transformFile(studentFileContents);
    fs.mkdirSync(outDir + "/" + sd);

    var targetGoldDir = studentOutDir + "/" + "gold";
    fs.mkdirSync(targetGoldDir);
    copyFiles(goldDir, targetGoldDir);

    var targetGoldTestFile = studentOutDir + "/" + "gold" + "/" + testFilename;
    fs.writeFileSync(targetGoldTestFile, transformedContents);

    coalDirs.forEach(function(cd) {
      var targetCoalDir = studentOutDir + "/" + cd;
      fs.mkdirSync(targetCoalDir);
      copyFiles(coalDir + "/" + cd, targetGoldDir);
      var targetCoalTestFile = studentOutDir + "/" + cd + "/" + testFilename;
      fs.writeFileSync(targetCoalTestFile, transformedContents);
    });
  });
}

module.exports = { createRunDirs: createRunDirs };
