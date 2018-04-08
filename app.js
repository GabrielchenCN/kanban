const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const path = require('path')
const static = require('koa-static')
const databaseInst = require('./db.js');
const db = databaseInst.database;
let kanbanCollection = null;
//async read data
setTimeout(function(){
  kanbanCollection = db.getCollection("kanban");
  console.log(kanbanCollection);
},100)


app.use(koaBody({ multipart: true }));

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './kanban'

app.use(static(
  path.join(__dirname, staticPath)
))

//get all public kanban
router.get('/kanbans',
  (ctx) => {
    // ctx.body = JSON.stringify(kanbanCollection.find({ "isPublic":"true" }));
    ctx.body = kanbanCollection.chain().find({ "isPublic": "true" }).data();
    console.log(kanbanCollection.chain().find({ "isPublic": "true" }).data());
    // ctx.body = JSON.stringify(kanbanCollection.find());
  }
);
//get kanban by id
router.get('/kanban/:id',
  (ctx) => {
    let doc = kanbanCollection.findOne({ 'id':parseInt(ctx.params.id, 10)});
    if(!doc){
      return ctx.body = JSON.stringify({msg:"not found",data:[]});
    }
    if (doc.isPublic){
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