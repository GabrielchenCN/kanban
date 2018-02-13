const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const databaseInst = require('./db.js');
const db = databaseInst.database;
let kanbanCollection = null;
//async read data
setTimeout(function(){
  kanbanCollection = db.getCollection("kanban");
  console.log(kanbanCollection);
},100)


app.use(koaBody({ multipart: true }));

//get all public kanban
router.get('/kanban',
  (ctx) => {
    ctx.body = JSON.stringify(kanbanCollection.find({ isPrivate: false }));
  }
);
//get kanban by id
router.get('/kanban/:id',
  (ctx) => {
    let doc = kanbanCollection.findOne({ 'id':parseInt(ctx.params.id, 10)});
    if(!doc){
      return ctx.body = JSON.stringify({msg:"not found",data:[]});
    }
    if(!doc.isPrivate){
      ctx.body = JSON.stringify(doc);
    }else{
       //todo:should check the user auth
       if(ctx.headers.token){
        ctx.body = JSON.stringify(doc);
       }else{
        ctx.status = 403
        ctx.body = JSON.stringify({msg:"No Auth",data:[]})
       }
    }


    
  }
);
router.post('/kanban',
  (ctx) => {
    let doc = kanbanCollection.insert(ctx.request.body)
    // => POST body
    ctx.body = JSON.stringify(doc);
  }
);
router.del('/kanban/:id',
  (ctx) => {
    //todo:check delete auth
    kanbanCollection.findAndRemove({ "id": parseInt(ctx.params.id, 10) })
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
  }
);

router.put('/kanban',
  (ctx) => {
    let doc = kanbanCollection.findOne({ 'id': ctx.request.body.id });
    if (doc) {
      //todo:check the auth
      doc=Object.assign(doc,ctx.request.body);
      kanbanCollection.update(doc);
      ctx.body = JSON.stringify({ msg: "update", data: doc });

    } else {
      kanbanCollection.insert(ctx.request.body);
      ctx.body = JSON.stringify({ msg: "create", data: doc });

    }

  }
);

app.use(router.routes());

app.listen(3000);
console.log('server running in the port:3000');