const Loki = require('lokijs');
const db = new Loki('loki.json');
let kanban = db.addCollection('kanban');


module.exports={
    kanban:kanban
} ;