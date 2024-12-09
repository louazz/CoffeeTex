import {Application} from "https://deno.land/x/oak/mod.ts"
import router from "./src/routes/allRoutes.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app= new Application();
const PORT= 8000

app.use(oakCors({
    origin: "*" 
}))
app.use(router.routes());
app.use(router.allowedMethods());



console.log("Application started at port: "+PORT)

await app.listen({port: PORT})