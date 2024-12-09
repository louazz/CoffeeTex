import db from "../database/connectDB.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";
import { DocumentSchema } from "../schema/document.ts";

const docs = db.collection<DocumentSchema>('documents');

export const create = async({request, response}: {request:any; response:any})=>{
    const {user_id,title, content }= await request.body.json();

    const _id = await docs.insertOne({
      user_id: new ObjectId(user_id),
        title,
        content
    })
    let cmd0 = new Deno.Command("mkdir", { args: ["uploads"] });
    let { stdout0, stderr0 } = await cmd0.output();

   let cmd = new Deno.Command("mkdir", { args: ["./src/uploads/"+_id] });
   let { stdout, stderr } = await cmd.output();
// stdout & stderr are a Uint8Array
console.log(new TextDecoder().decode(stdout));
    const file = await Deno.create("./src/uploads/"+_id+"/latex.tex");

    await Deno.writeTextFile("./src/uploads/"+_id+"/latex.tex", content);
    response.status= 201;
    response.body= {message: "Document created", id: _id, title: title}
}

export const getByUserId= async ({params, response}: {params:{userId:string}, response:any})=>{
    const id= params.userId;
    const documents= await docs.find({user_id: new ObjectId(id)}).toArray();

    if(!documents){
        response.status=404
        response.body={message: "no document found"}
        return;
    }

    response.status=201;
    response.body= {documents: documents}
}

export const findById= async({params , response}:{params:{docId: string}, response: any})=>{
    const id= params.docId;
    const document= await docs.findOne({_id: new ObjectId(id)})

    if (!document){
        response.status= 404;
        response.body= {message: "no document fount with this id"}
        return;
    }

    response.status=200;
    response.body= {document: document}
}

export const updateById= async ({params , request, response}:{params : {docId: string}, request: any, response:any})=>{
    const id= params.docId;
    const {title, content}= await request.body.json();
    const doc= await docs.updateOne({_id: new ObjectId(id)},{  $set: { title, content}});

    if (!doc){
        response.status=404;
        response.body= {message: "no document found with this id"}
    }

    await Deno.writeTextFile("./src/uploads/"+id+"/latex.tex", content);
    response.status=200;
    response.body={document: doc}
}

export const deleteById= async ({params, request, response}: {params:{docId: string}, request:any, response:any})=>{
    const id= params.docId;
    const doc= await docs.deleteOne({_id: new ObjectId(id)})
    const p=Deno.run({ cmd: ["rm", "-rf", "./src/uploads/"+id]});
    response.status=200;
    response.body= {message: "Document deleted"}
}