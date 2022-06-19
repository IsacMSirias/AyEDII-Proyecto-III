import DocumentsDAO from "../dao/documentsDAO.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { compress_LZ77 } = require('../build/Release/compresslz77.node');
const { decompress_LZ77 } = require('../build/Release/decompresslz77.node');
const { compress_LZ78 } = require('../build/Release/compresslz78.node');
const { decompress_LZ78 } = require('../build/Release/decompresslz78.node');

export default class DocumentsController {
  static async apiPostDocument(req, res, _next) {
    try {
      var compressData;
      if (true) {
        compressData = compress_LZ78(req.body.file);
      } if (req.body.tags[1]==='LZ77') {
        compressData = compress_LZ77(req.body.file);
      } else {
        compressData = req.body.file;
      }
      const userId = req.body.user_id
      const docName = req.body.name
      const document = compress_LZ78(req.body.file)
      const date = new Date().toLocaleString()
      const tags = req.body.tags
      const type = req.body.type   
      const DocumentResponse = await DocumentsDAO.addDocument(
        userId,
        docName,
        document,
        date,
        tags,
        type,
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
      const date = new Date().toLocaleString()
      const type = req.body.type   


      const documentResponse = await DocumentsDAO.updateDocument(
        documentId,
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
      console.log(documentId)
      const documentResponse = await DocumentsDAO.deleteDocument(
        documentId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}