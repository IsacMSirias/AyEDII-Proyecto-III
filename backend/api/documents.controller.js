import DocumentsDAO from "../dao/documentsDAO.js"

export default class DocumentsController {
  static async apiPostDocument(req, res, _next) {
    try {
      const userId = req.body.user_id
  
      const document = req.body.file
  
      const docInfo = {
        name: req.body.name,
        _id: req.body.doc_id
      }
      const date = new Date()
      const tags = req.body.tags
      
      const DocumentResponse = await DocumentsDAO.addDocument(
        userId,
        docInfo,
        document,
        date,
        tags,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateDocument(req, res, next) {
    try {
      const documentId = req.body.document_id
      const file = req.body.file
      const tags = req.body.tags
      const date = new Date()
      

      const documentResponse = await DocumentsDAO.updateDocument(
        documentId,
        req.body.doc_id,
        file,
        date,
        tags,
        
      )

      var { error } = documentResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (documentResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update document - doc may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteDocument(req, res, next) {
    try {
      const documentId = req.query.id
      const docId = req.body.doc_id
      console.log(documentId)
      const documentResponse = await DocumentsDAO.deleteDocument(
        documentId,
        docId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}