const Loki = require('lokijs');
const db = new Loki('loki.db',{
    autoload: true,
    autoloadCallback : databaseInitialize,
    autosave: true, 
    autosaveInterval: 4000
});
let kanbanCollection ;

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
    let kanban = db.getCollection("kanban");
    let shortUrl = db.getCollection("shortUrl");
    if (kanban === null) {
        console.log("new kanban");
        kanban = db.addCollection("kanban", {unique: ['name'] });
    }
    if (shortUrl === null) {
        console.log("new shortUrl");
        shortUrl = db.addCollection("shortUrl");
    }
  
    // kick off any program logic or start listening to external events
    runProgramLogic();
  }
  
  // example method with any bootstrap logic to run after database initialized
  function runProgramLogic() {
    var entryCount = db.getCollection("kanban").count();
    console.log("number of kanban entries in database : " + entryCount);
    kanbanCollection=db.getCollection("kanban");
   
  }
 
  function readCollection(name){
    return db.getCollection(name);
  }

let kanbanStrcu ={
    "id":"string",
    "name":"string",
    "total":"string",
    "shortUrl62hex":"string",
    "user":"string",
    "isPrivate":"Boolean",
    "item":[{
        "itemName":"string",
        "unit":"string",
        "number":"string",
        "endDateTime":"timestamp",
        "perUpdateNumber":"string"
    }],
};
let shortUrlStrcu ={
    "id":"number",
    "shortUrl62hex":"string",
    "originalUrl":"string",
    "user":"string",
    "isPrivate":"Boolean"
};


module.exports={
    database:db

} ;