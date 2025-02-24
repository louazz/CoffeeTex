import { Router } from "https://deno.land/x/oak/mod.ts";
import { signin, signup } from "../controllers/users.ts";
import { create, deleteById, findById, getByUserId, updateById } from "../controllers/documents.ts";
import { Docx, compileFile, fileUpload, ToText,uploadZip, getLog, getFiles, saveFiles, uploadDocx, addFile, deleteFile, listFiles } from "../controllers/compile.ts";
import { isAuthorized } from "../middleware/isAuthorized.ts";

const router = new Router();

router.post("/api/signup", signup)
router.post("/api/signin", signin)

router.post("/api/document",isAuthorized, create);
router.get("/api/document/user/:userId",isAuthorized, getByUserId);
router.get("/api/document/:docId", isAuthorized,findById);
router.patch("/api/document/:docId",isAuthorized,updateById);
router.delete("/api/document/:docId",isAuthorized, deleteById);

router.post("/api/document/save/:docId", saveFiles)
router.get("/api/document/ls/:docId", getFiles);
router.get("/api/document/log/:docId", getLog);
router.post("/api/document/upload/:docId", fileUpload);
router.get("/api/document/compile/:docId",compileFile)
router.post("/api/document/docx/:userId", uploadDocx)
router.get("/api/document/latexdocx/:docId", Docx)
router.post("/api/document/zip/:userId", uploadZip)
router.post("/api/document/addfile/:docId", addFile)
router.post("/api/document/deletefile/:docId", deleteFile)
router.get("/api/document/listfiles/:docId", listFiles)

export default router;