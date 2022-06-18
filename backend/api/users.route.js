import express from "express"
import UsersCtrl from "./users.controller.js"
import DocumentsCtrl from "./documents.controller.js"
const router = express.Router()

router.route("/").get(UsersCtrl.apiGetUsers)
                 .post(UsersCtrl.apiPostUser)
router.route("/id/:id").get(UsersCtrl.apiGetUserById)
router.route("/id").get(UsersCtrl.apiGetIdUser)
router.route("/id/tags/:id").get(UsersCtrl.apiGetUserByIdWhitTags)


router
    .route("/document")
    .post(DocumentsCtrl.apiPostDocument)
    .put(DocumentsCtrl.apiUpdateDocument)
    .delete(DocumentsCtrl.apiDeleteDocument)

export default router