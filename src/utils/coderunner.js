const { spawn } = require("child_process");
const fs = require("fs");

const runPython = (code) => {
  const file = `${Date.now()}.py`;
  fs.writeFile(file, code, (err) => {
    if (err) {
      console.log(err);
    }
    return;
  });
  const pythonProcess = spawn("python3", [file]);
  pythonProcess.stdout.on("data", function (data) {
    console.log(data.toString());
    fs.unlink(file, (err) => {
      if (err) {
        console.log(err);
      }
      return;
    });
  });
};

runPython('print("Hello World")');
