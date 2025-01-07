import {MongoClient} from "https://deno.land/x/mongo/mod.ts";

const client = new MongoClient()

await client.connect("mongodb+srv://doadmin:0b5Jscvp63l427O1@mongo-db-coffeetex-0b897bfd.mongo.ondigitalocean.com/admin?authMechanism=SCRAM-SHA-1");


console.log("Databse connected");

const db = client.database("coffeetex")

export default db;