const WebSocket = require("reconnecting-websocket");
const ShareDB = require("sharedb/lib/client");
const CodeMirror = require("codemirror");
require("codemirror/mode/javascript/javascript");
const ShareDBCodeMirror = require("./sharedb-codemirror");
const { langMap } = require("../../config/langMap");
let ws, connection, codeMirror, shareDBCodeMirror;
const docid = window.location.href.split("/")[4];
const language = langMap[docid.slice(0, 4)];
const Split = require("split.js");

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
    theme: "material-darker",
    mode: MODES[language],
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
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    })
      .then(response => response.json())
      .then(data => {
        let output = "";
        if (!data.run.stderr) {
          output = data.run.stdout;
        } else {
          terminalOutput.classList.add("text-danger");
          output = data.run.stderr;
        }
        terminalOutput.innerHTML =
          output + `\n\nProgram finished with exit code ${data.run.code}`;
      });
  });
});
