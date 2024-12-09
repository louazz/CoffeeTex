import {MongoClient} from "https://deno.land/x/mongo/mod.ts";

const client = new MongoClient()

await client.connect("mongodb://mongo:27017");


console.log("Databse connected");

const db = client.database("encrylatex")

export default db;