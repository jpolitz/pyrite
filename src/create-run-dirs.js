var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

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
      fs.writeFileSync(target + "/" + file, String(fs.readFileSync(sourceFile)));
      fs.fsyncSync(fs.openSync(target + "/" + file, 'r'));
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
      copyFiles(coalDir + "/" + cd, targetCoalDir);
      var targetCoalTestFile = studentOutDir + "/" + cd + "/" + testFilename;
      fs.writeFileSync(targetCoalTestFile, transformedContents);
      fs.fsyncSync(fs.openSync(targetCoalTestFile, 'r'));
    });
  });
}

function runTests(options) {
  var outDir = options.outDir;
  var runCommand = options.runCommand;
  var testFilename = options.testFilename;
  var child;

  console.log('Starting in ' + process.cwd());
  function handleSubmissions(sds) {
    if(sds.length === 0) { return; }
    else {
      var studentDir = sds.pop();
      function handleImpls(impls) {
        if(impls.length === 0) { handleSubmissions(sds); }
        else {
          var runDir = impls.pop();
          var changeDir = outDir + "/" + studentDir + "/" + runDir;
          var stdoutFile = changeDir + "/" + testFilename + ".out";
          var stderrFile = changeDir + "/" + testFilename + ".err";
          console.log("Switching to " + changeDir);
          child = exec("cd " + changeDir + " && " + runCommand, function (error, stdout, stderr) {
            if (error !== null) {
              console.log('While running for student ' + studentDir);
              console.log('On ' + runDir);
              console.log('Error while evaluating your command' + error);
              console.log('');
            }
            fs.writeFileSync(stdoutFile, stdout);
            fs.writeFileSync(stderrFile, stderr);
            console.log('Finished ' + runDir + ' for ' + studentDir);
            handleImpls(impls);
          });
        }
      }
      handleImpls(fs.readdirSync(outDir + "/" + studentDir));
    }
  }
  handleSubmissions(fs.readdirSync(outDir));
}

module.exports = {
  createRunDirs: createRunDirs,
  runTests: runTests
};

