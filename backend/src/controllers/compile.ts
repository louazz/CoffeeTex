import { multiParser } from "https://deno.land/x/multiparser/mod.ts";
import nodePandoc from "npm:node-pandoc";
import db from "../database/connectDB.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";
import { DocumentSchema } from "../schema/document.ts";

const docs = db.collection<DocumentSchema>('documents');
export const fileUpload = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { docId: string };
  },
) => {
  const form = await multiParser(request.originalRequest.request);
  const data = form.files["key"].content;
  console.log(form.files["key"].filename)
  await Deno.writeFile("./src/uploads/" + params.docId + "/"+form.files["key"].filename, data);

  response.status = 200;
};

export const uploadZip = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { userId: string };
  },
) => {
  const id = params.userId;
 console.log(id);
  
  const form = await multiParser(request.originalRequest.request);
  const data = form.files["key"].content;
  //console.log(form.files["key"].filename)
  const _id = await docs.insertOne({
    user_id: new ObjectId(id),
      title:form.files["key"].filename,
      content: "",
  })
  let cmd = new Deno.Command("mkdir", { args: ["./src/uploads/"+_id] });
  let { stdout, stderr } = await cmd.output();
// stdout & stderr are a Uint8Array
//console.log(new TextDecoder().decode(stdout));
  await Deno.writeFile("./src/uploads/" + _id + "/"+form.files["key"].filename, data);
  
  const process = Deno.run({
    cmd: ["sh","zip.sh", './src/uploads/' + _id + "/"+form.files["key"].filename,'./src/uploads/' + _id],
    stdout: "piped",
    stderr: "piped"
  });
    
  const output = await process.output() // "piped" must be set
  const outStr = new TextDecoder().decode(output);


  //console.log(outStr)
  
  process.close();

  const decoder = new TextDecoder("utf-8");
  const tmp = await Deno.readFile("./src/uploads/"+_id+"/latex.tex");
  const content = decoder.decode(tmp);


  const doc= await docs.updateOne({_id: new ObjectId(_id)},{  $set: { title:form.files["key"].filename, content}});
 console.log(id);
  response.status = 200;
  response.body={document: doc}

};

export const getFiles = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { docId: string }
  }
  
)=>{
  const id = params.docId;
  const list = new Deno.Command("ls", { args: ["./src/uploads/"+id] });
  let { stdout, stderr } = await cmd.output();
  const ls = new TextDecoder().decode(stdout)
  
  response.status=200;
  response.body={list: ls}
  

}
export const getLog = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { docId: string }
  }
  
)=>{
  const id = params.docId;
  const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile('./src/uploads/'+id+"latex.log");
if (data){
  console.log(decoder.decode(data));
  const log = decoder.decode(data);
  response.status=200;
  response.body={log: log}
  
}else{
  response.status= 404
}

}

export const compileFile= async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { docId: string };
  },
) => {
  const id = params.docId;
  
  const process = Deno.run({
    cmd: ["sh","script.sh", './src/uploads/'+id], 
    stdout: "piped",
    stderr: "piped"
  });
  
  
  const output = await process.output() // "piped" must be set
  const outStr = new TextDecoder().decode(output);


  console.log(outStr)
  
  process.close();

  let file = await Deno.readFile("./src/uploads/" + id + "/latex.pdf");
  
  const head = new Headers();
  head.set("content-type", "application/pdf");
  response.head = head;
  response.body = file;
  response.status = 200;
};

export const Docx = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { docId: string };
  },
) => {
  const id = params.docId;
  let src = "./src/uploads/" + id + "/latex.tex";

  // Arguments can be either a single String or in an Array
  let args = "-f latex -t docx -o ./src/uploads/" + id + "/latex.docx";

  // Set your callback function
  const callback = (err: any, result: any) => {
    if (err) console.error("Oh Nos: ", err);
    return console.log(result), result;
  };

  // Call pandoc
  nodePandoc(src, args, callback);
  const file = await Deno.readFile("./src/uploads/" + id + "/latex.docx");
  const head = new Headers();
  head.set(
    "content-type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  response.head = head;
  response.body = file;
  response.status = 200;
};
export const ToText = async (
  { request, response, params }: {
    request: any;
    response: any;
    params: { userId: string };
  },
) => {
  const form = await multiParser(request.originalRequest.request);
  const data = form.files["key"].content;
  console.log(form.files["key"].content)
  await Deno.writeFile("./src/uploads/texts/" + params.userId +".pdf", data);

  const id = params.userId;
  const process = Deno.run({
    cmd: ["sh","pdftotext.sh", './src/uploads/texts/'+id], 
    stdout: "piped",
    stderr: "piped"
  });
  
  
  const output = await process.output() // "piped" must be set
  const outStr = new TextDecoder().decode(output);


  console.log(outStr)
  
  process.close();

  let file = await Deno.readFile('./src/uploads/texts/'+id+'.txt');
  
  const head = new Headers();
  head.set("content-type", "text/plain");
  response.head = head;
  response.body = file;
  response.status = 200;
}