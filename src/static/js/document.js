let WebSocket = require("reconnecting-websocket");
let ShareDB = require("sharedb/lib/client");
let CodeMirror = require("codemirror");
require("codemirror/mode/javascript/javascript");
// require('codemirror/mode/')
let ShareDBCodeMirror = require("./sharedb-codemirror");
let { langMap } = require("../../config/langMap");
let debug = true;
let ws, connection, codeMirror, shareDBCodeMirror;
let docid = window.location.href.split("/")[4];
let language = langMap[docid.slice(0, 4)];
console.log(language);
window.onload = event => {
  ws = new WebSocket("ws://" + window.location.host);
  connection = new ShareDB.Connection(ws);
  codeMirror = new CodeMirror(document.getElementById("textarea"), {
    lineNumbers: true,
    theme: "material-darker",
    mode: "text/x-csrc",
  });
  shareDBCodeMirror = new ShareDBCodeMirror(codeMirror, {
    verbose: debug,
    key: "content",
  });
  console.log(docid);
  doc = connection.get("docs", docid);
  shareDBCodeMirror.attachDoc(doc, error => {
    if (error) {
      console.error(error);
      return;
    }
    codeMirror.setOption("mode", "javascript");
  });
};
let runButton = document.getElementById("run-code");
runButton.addEventListener("click", () => {
  console.log(codeMirror);
  console.log();
  const data = { code: codeMirror.getValue() };
  console.log(data);
  fetch("/run", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
});
