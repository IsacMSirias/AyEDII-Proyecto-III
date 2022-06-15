import express from "express"
import UsersCtrl from "./users.controller.js"
import DocumentsCtrl from "./documents.controller.js"
const router = express.Router()

router.route("/").get(UsersCtrl.apiGetUsers)
router.route("/id/:id").get(UsersCtrl.apiGetUserById)

router
    .route("/document")
    .post(DocumentsCtrl.apiPostDocument)
    .put(DocumentsCtrl.apiUpdateDocument)
    .delete(DocumentsCtrl.apiDeleteDocument)

export default router