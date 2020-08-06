// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

const fs = require("fs");
var notesData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    res.json(notesData);
  });

  app.get("/api/notes/:id", function(req, res) {
    res.json(notesData[parseInt(req.params.id)]);

});
  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    // req.body is available since we're using the body parsing middleware
    
    let newNote = req.body;
    let noteId = (notesData.length).toString();
    console.log(noteId);
    newNote.id = noteId;
    notesData.push(newNote);
    
    fs.writeFileSync("./db/db.json", JSON.stringify(notesData), function(err) {
        if (err) throw (err);        
    }); 
    res.json(notesData);    

  });

  // DELETE Requests

  app.delete("/api/notes/:id", function (req, res) {
    let noteId = req.params.id;
    let newId = 0;
    notesData = notesData.filter(currentNote => {
       return currentNote.id != noteId;
    });
    for (currentNote of notesData) {
        currentNote.id = newId.toString();
        newId++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(notesData));
    res.json(notesData);
}); 

}
