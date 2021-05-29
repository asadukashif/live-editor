let quill = new Quill("#editor", {
  // modules: {
  //   syntax: true, // Include syntax module
  //   toolbar: [["code-block"]], // Include button in toolbar
  // },
  theme: "snow",
});

const SAVE_INTERVAL_MS = 3000;

let documentID = window.location.href.split("/")[4];

let socket = io();

// Why did this not work??
// socket.on("connection", socket => {
//   console.log("Connected to server");
//   socket.emit("get-document", documentID);
// })

socket.emit("get-document", documentID);

const interval = setInterval(() => {
  console.log("Emiting the save doc event");
  socket.emit("save-document", quill.getContents());
}, SAVE_INTERVAL_MS);

socket.emit("save-changes", quill.getContents());

quill.on("text-change", (delta, oldDelta, source) => {
  if (source != "user") return;
  socket.emit("send-changes", delta);
});

socket.on("receive-changes", delta => {
  quill.updateContents(delta);
});

socket.on("load-document", document => {
  quill.setContents(document);
});
