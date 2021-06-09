const WebSocket = require("reconnecting-websocket");
const ShareDB = require("sharedb/lib/client");
const CodeMirror = require("codemirror");
require("codemirror/mode/javascript/javascript");
const ShareDBCodeMirror = require("./sharedb-codemirror");
const { langMap } = require("../../config/langMap");
const docid = window.location.href.split("/")[4];
const language = langMap[docid.slice(0, 4)];
const Split = require("split.js");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closetag");

require("codemirror/keymap/sublime");
require("codemirror/addon/comment/comment");
require("codemirror/addon/comment/continuecomment");

const DEBUG = false;
const MODES = {
  python: "text/x-python",
  "node-js": "text/javascript",
  cpp: "text/x-c++src",
};
const EXTS = {
  python: ".py",
  "node-js": ".js",
  cpp: ".cpp",
};
const VERSIONS = {
  python: "3.9.4",
  "node-js": "15.10.0",
  cpp: "10.2.0",
};

let ws, connection, codeMirror, shareDBCodeMirror;
console.log(language);
window.onload = event => {
  ws = new WebSocket("ws://" + window.location.host);
  connection = new ShareDB.Connection(ws);

  switch (language) {
    case "cpp":
      require("codemirror/mode/clike/clike");
      break;
    case "node-js":
      require("codemirror/mode/javascript/javascript");

      break;
    case "python":
      require("codemirror/mode/python/python");
      break;
  }

  codeMirror = new CodeMirror(document.getElementById("textarea"), {
    lineNumbers: true,
    tabSize: 2,
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchBrackets: true,
    theme: "material-darker",
    mode: MODES[language],
    lineWrapping: true,
    keyMap: "sublime",
  });
  shareDBCodeMirror = new ShareDBCodeMirror(codeMirror, {
    verbose: DEBUG,
    key: "content",
  });
  console.log(docid);
  doc = connection.get("docs", docid);
  shareDBCodeMirror.attachDoc(doc, error => {
    if (error) {
      console.error(error);
      return;
    }
    codeMirror.setOption("mode", MODES[language]);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  Split(["#textarea", "#terminal"], {
    direction: "vertical",
  });

  let commandLineArgs;
  let stdin;
  document.getElementById("save-btn").addEventListener("click", e => {
    const commandLineArgsField = document.getElementById("cl-args-field");
    const stdinField = document.getElementById("stdin-field");

    commandLineArgs = commandLineArgsField.value.split(" ");
    stdin = stdinField.value;
  });

  const terminalOutput = document.getElementById("terminal-output");

  const runButton = document.getElementById("run-code");
  runButton.addEventListener("click", () => {
    const code = codeMirror.getValue();

    terminalOutput.classList.remove("text-danger");
    terminalOutput.innerHTML = "Compiling...";

    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify({
        version: VERSIONS[language],
        language,
        files: [
          {
            name: `${new Date().toISOString()}${EXTS[language]}`,
            content: code,
          },
        ],
        stdin: stdin,
        args: commandLineArgs,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const { run, compile } = data;
        let output = "";
        let statusCode = 0;

        // Checking for compilation errors
        if (compile && compile.stderr) {
          terminalOutput.classList.add("text-danger");
          output = compile.stderr;
          statusCode = compile.code;
        } else {
          // Checking for runtime errors
          statusCode = run.code;

          if (!run.stderr) {
            output = run.stdout;
          } else {
            terminalOutput.classList.add("text-danger");
            output = run.stderr;
          }
        }
        terminalOutput.innerHTML = `${output}\n\nProgram finished with exit code ${statusCode}`;
      });
  });
});
