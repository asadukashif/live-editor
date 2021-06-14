const WebSocket = require("reconnecting-websocket");
const ShareDB = require("sharedb/lib/client");
const CodeMirror = require("codemirror");
require("codemirror/mode/javascript/javascript");
const ShareDBCodeMirror = require("./sharedb-codemirror");
const { langMap } = require("../../config/langMap");
const docid = window.location.href.split("/")[4];
const language = langMap[docid.slice(0, 4)];
const Split = require("split.js");
const { CodeExecutor } = require("./CodeExecutor");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closetag");

require("codemirror/keymap/sublime");
require("codemirror/addon/comment/comment");
require("codemirror/addon/comment/continuecomment");

const collection = "docs";
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

window.onload = event => {
  ws = new WebSocket(
    (window.location.protocol === "https:" ? "wss://" : "ws://") +
      window.location.host
  );
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
  doc = connection.get(collection, docid);
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
    sizes: [70, 30],
  });

  const shareBtn = document.getElementById("share-btn");
  shareBtn.lastElementChild.style.display = "none";

  shareBtn.addEventListener("click", e => {
    shareBtn.firstElementChild.style.display = "none";
    shareBtn.classList.toggle("btn-outline-success");
    shareBtn.classList.toggle("btn-outline-info");

    shareBtn.lastElementChild.style.display = "";
    const URLContainer = document.getElementById("url-container");
    const copyElement = document.createElement("input");
    const URL = URLContainer.dataset.url;
    copyElement.setAttribute("value", URL);
    URLContainer.appendChild(copyElement);
    copyElement.select();
    document.execCommand("copy");
    URLContainer.removeChild(copyElement);
    setTimeout(() => {
      shareBtn.firstElementChild.style.display = "";
      shareBtn.lastElementChild.style.display = "none";
      shareBtn.classList.toggle("btn-outline-success");
      shareBtn.classList.toggle("btn-outline-info");
    }, 1500);
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

    console.log("Langauge", language);
    const codeExecutor = new CodeExecutor(
      code,
      language,
      EXTS[language],
      VERSIONS[language],
      {
        stdin,
        args: commandLineArgs,
      }
    );

    terminalOutput.innerHTML = "Compiling...";

    codeExecutor.execute(data => {
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
