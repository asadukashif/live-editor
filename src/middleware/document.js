const { connection } = require("../config/sharedb")

module.exports = {
  fetchCreateDoc: (req, res, next) => {
    // var connection = backend.connect();
    // const docid = req.params.id
    const docid = "richtext"
    var doc = connection.get('examples', docid);
    doc.fetch(function(err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create([{insert: 'Hi!'}], 'rich-text');
        return;
      }
    });
    next();
  }
}