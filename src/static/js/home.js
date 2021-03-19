const socket = io("http://localhost:3000/");

socket.on("connect", () => {
  console.log("Connected to", socket.id);

  socket.on("welcome", (data) => {
    console.log("Server sent this", data);
  });
});

const textArea = document.getElementById("textarea");

textArea.addEventListener("keypress", (e) => {
  console.log(
    e,
    e.target.value,
    textArea.selectionStart, 
    textArea.selectionEnd
  );
  console.log(textAreaToList(e.target.value));
});

function textAreaToList(string) {
  return string.split("\n");
}

function getCursorPostion(cursor, value) {
  
  for () {

  }
}

console.log("Running...");
