import { multiParser } from "https://deno.land/x/multiparser/mod.ts";
import nodePandoc from "npm:node-pandoc";

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