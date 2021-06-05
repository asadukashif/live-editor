// let ReconnectingWebSocket = require('reconnecting-websocket');
// let sharedb = require('sharedb/lib/client');
// let richText = require('rich-text');
// let Quill = require('quill');
// let fetch = require('node-fetch')
// sharedb.types.register(richText.type);


// // hljs.configure({
// //   // optionally configure hljs
// //   languages: ["javascript", "ruby", "python"],
// // });

// let quill = new Quill("#editor", {
//   // modules: {
//   //   syntax: true, // Include syntax module
//   //   toolbar: [["code-block"]], // Include button in toolbar
//   // },
//   theme: "snow",
// });

// let socket = new ReconnectingWebSocket('ws://' + window.location.host);
// let connection = new sharedb.Connection(socket);


// let docid = window.location.href.split('/')[4]
// console.log(docid);

// var doc = connection.get('examples', docid);
// doc.subscribe(function(err) {
//   if (err) throw err;
//   quill.setContents(doc.data);
//   quill.on('text-change', function(delta, oldDelta, source) {
//     if (source !== 'user') return;
//     doc.submitOp(delta, {source: quill});
//   });
//   doc.on('op', function(op, source) {
//     if (source === quill) return;
//     quill.updateContents(op);
//   });
// });

// const data = { username: 'example' };

// let runButton = document.getElementById("run-code");
// runButton.addEventListener("click", () => {
//   const data = { code: quill.getContents().ops[0].insert};
//   console.log(data);
  
//   fetch('/run', {
//     method: 'POST', // or 'PUT'
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// })


var WebSocket = require('reconnecting-websocket');
var ShareDB = require('sharedb/lib/client');
var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
var ShareDBCodeMirror = require('./sharedb-codemirror');


var debug = true;

var ws, connection, codeMirror, shareDBCodeMirror;

let docid = window.location.href.split('/')[4]

window.onload = (event) => {
  ws = new WebSocket('ws://' + window.location.host);
  
	connection = new ShareDB.Connection(ws);
	codeMirror = new CodeMirror(document.getElementById('textarea'));
	shareDBCodeMirror = new ShareDBCodeMirror(codeMirror, {verbose: debug, key: 'content'});
  
  console.log(docid);
	doc = connection.get('docs', docid);
	shareDBCodeMirror.attachDoc(doc, (error) => {
		if (error) {
			console.error(error);
			return;
		}
		codeMirror.setOption('mode', 'javascript');
	});
}
