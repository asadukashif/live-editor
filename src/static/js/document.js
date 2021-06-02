// const hljs = require("highlightjs");
var ReconnectingWebSocket = require("reconnecting-websocket");
var sharedb = require("sharedb/lib/client");
var richText = require("rich-text");
// var Quill = require("quill");
const Split = require("split.js");
let ReconnectingWebSocket = require("reconnecting-websocket");
let sharedb = require("sharedb/lib/client");
let richText = require("rich-text");
let Quill = require("quill");
let fetch = require("node-fetch");
sharedb.types.register(richText.type);

sharedb.types.register(richText.type);

hljs.configure({
  // optionally configure hljs
  languages: ["python", "C++", "java"],
});

let quill = new Quill("#editor", {
  modules: {
    syntax: true, // Include syntax module
    toolbar: [["code-block"]], // Include button in toolbar
  },
  placeholder: "Hi!",
  theme: "snow",
});

let socket = new ReconnectingWebSocket("ws://" + window.location.host);
let connection = new sharedb.Connection(socket);

let docid = window.location.href.split("/")[4];
console.log(docid);

var doc = connection.get("examples", docid);
doc.subscribe(function (err) {
  if (err) throw err;
  quill.setContents(doc.data);
  quill.on("text-change", function (delta, oldDelta, source) {
    if (source !== "user") return;
    doc.submitOp(delta, { source: quill });
  });

  doc.on("op", function (op, source) {
    if (source === quill) return;
    quill.updateContents(op);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  Split(["#editor", "#terminal"], {
    direction: "vertical",
  });

  const editor = document.getElementById("editor");

  // setInterval(() => {
  //   hljs.highlightElement(document.querySelector(".ql-editor"));
  // }, 3000);
  hljs.lineNumbersBlock();
  document.getElementById("executeBtn").addEventListener("click", e => {
    console.log("Code: ", editor.textContent);
  });

  document.querySelector(".gutter").innerHTML += '<div class="split"></div>';
});
const data = { username: "example" };

let runButton = document.getElementById("run-code");
runButton.addEventListener("click", () => {
  const data = { code: quill.getContents().ops[0].insert };
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
