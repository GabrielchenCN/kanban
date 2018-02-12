const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const kanbanCollection = require('./db.js').kanban;
app.use(koaBody({ multipart: true }));
router.get('/kanban', 
  (ctx) => {
    ctx.body = JSON.stringify(kanbanCollection.find());
  }
);
router.post('/kanban', 
  (ctx) => {
    console.log(ctx.request.body);
    kanbanCollection.insert(ctx.request.body)
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
  }
);
router.del('/kanban/:id', 
  (ctx) => {
    console.log(ctx.params);
    console.log(ctx.request);
    kanbanCollection.findAndRemove({"id":ctx.params.id})
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
  }
);

router.put('/kanban', 
  (ctx) => {
    console.log(ctx.request.body.name);
    let doc = kanbanCollection.chain().find({'id':ctx.request.body.id});
    console.log("doc",doc.data());
    if(doc.data().length>0){
        
      doc.data().item = ctx.request.body.item;
      kanbanCollection.update(doc.data())
      ctx.body = JSON.stringify({msg:"update",data:ctx.request.body});
  
      }else{
        kanbanCollection.insert(ctx.request.body);
        ctx.body = JSON.stringify({msg:"create",data:ctx.request.body});
      
      }
    // => POST body
   
  }
);

app.use(router.routes());

app.listen(3000);
console.log('server running in the port:3000');