import { ObjectId } from "https://deno.land/x/mongo/mod.ts";

export interface UserSchema{
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
}