import { ObjectId } from "https://deno.land/x/mongo/mod.ts";

export interface DocumentSchema{
    _id: ObjectId,
    user_id: ObjectId,
    title: string,
    content: string
}