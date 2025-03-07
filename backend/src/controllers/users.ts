
import db from "../database/connectDB.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserSchema } from "../schema/user.ts";
import { create } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { key } from "../utils/apiKey.ts";
import { DocumentSchema } from "../schema/document.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const docs = db.collection<DocumentSchema>('documents');

const Users = db.collection<UserSchema>("users");

export const signup = async (
  { request, response }: { request: any; response: any },
) => {
  const { username, password, email } = await request.body.json();

  const checker = await Users.find({username}).toArray();
  if (checker.length !== 0){
    response.status = 500;
    response.body = {
      message: "user exists",
    };
    return;
  }
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  const _id = await Users.insertOne({
    username,
    password: hashedPassword,
    email: email,
  });

  const doc_id_1= await docs.insertOne({
    user_id: new ObjectId(_id),
      title:"Template 1",
      content: ''
  })
  const doc_id_2= await docs.insertOne({
    user_id: new ObjectId(_id),
      title:"Template 2",
      content: ''
  })
  const p= Deno.run({ cmd: ["sh", "template.sh", "./src/uploads/"+doc_id_1,"./src/uploads/"+doc_id_2 ],  stdout: "piped",
    stderr: "piped"});
    const output = await p.output();
    const files = new TextDecoder().decode(output);
    p.close()
    const client = new SMTPClient({
      connection: {
       
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: "encrygen@gmail.com",
          password: "vniwrrfbdwwxziqr",
        },
      },
    });
    const mailOptions = {
      from: '"CoffeeTek" <encrygen@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Welcome to CoffeeTek ☕ '+username, // Subject line
      content:"",
      html: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css"><link href="/home/louai/CoffeeTex/frontend/src/assets/App_original.css" rel="stylesheet"><div><h4>Dear ${username},<br/>Welcome to CoffeeTek.☕︎ <br/><br/> Your username is <strong>${username}</strong> <br/> Your password is <strong>${password}</strong> <br/><br/>Best regards,<br/> CoffeeTek Team </h4></div>`
  };
 
   
      await client.send(mailOptions)
      await client.close()

   
  response.status = 201;
  response.body = { message: "User Created", userId: _id };
};

export const signin = async (
  { request, response }: { request: any; response: any },
) => {
  const { username, password } = await request.body.json();
  console.log(password)

  const user = await Users.findOne({ username });
  if (!user) {
    response.status = 404;
    response.body = { message: "User not found" };
  }

  console.log(user)

  const confirmPassword = await bcrypt.compare(password, user.password);

  if (!confirmPassword) {
    response.status = 404;
    response.body = { message: "Incrrect password" };
  }

  const payload = {
    id: user?._id,
    name: user?.username,
  };

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  if (jwt) {
    response.status = 200;
    response.body = {
      userId: user?._id,
      username: user?.username,
      token: jwt,
    };
  } else {
    response.status = 500;
    response.body = {
      message: "internal server error",
    };
  }
  return;
};
