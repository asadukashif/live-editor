const { app, io } = require("./config/default");
const connectDB = require("./config/db");
const Document = require("./models/Document");

// Connect to the database
connectDB();

app.use("/", require("./routes/HomeRoute"));
app.use("/document", require("./routes/DocumentRoute"));
app.use("/auth", require("./routes/AuthRoute"));

io.on("connection", socket => {
  console.log("Connected");
  socket.on("get-document", async documentID => {
    socket.join(documentID);
    let document = await findOrCreateDocument(documentID);
    socket.emit("load-document", document.data);
    
    socket.on("send-changes", delta => {
      socket.broadcast.to(documentID).emit("receive-changes", delta)
    })  

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentID, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({
    _id: id,
    data: ''  
  })
}