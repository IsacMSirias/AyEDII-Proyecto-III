import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let documents

export default class DocumentsDAO {
  static async injectDB(conn) {
    if (documents) {
      return
    }
    try {
      documents = await conn.db(process.env.USERSREVIEWS_NS).collection("documents")
    } catch (e) {
      console.error(`Unable to establish collection handles in docDAO: ${e}`)
    }
  }

  static async addDocument(userId, doc, document, date) {
    try {
      const documentDoc = { name: doc.name,
          doc_id: doc._id,
          date: date,
          file: document,
          user_id: ObjectId(userId), }

      return await documents.insertOne(documentDoc)
    } catch (e) {
      console.error(`Unable to post document: ${e}`)
      return { error: e }
    }
  }

  static async updateDocument(documentId, docId, file, date) {
    try {
      const updateResponse = await documents.updateOne(
        { doc_id: docId, _id: ObjectId(documentId)},
        { $set: { file: file, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update document: ${e}`)
      return { error: e }
    }
  }

  static async deleteDocument(documentId, docId) {

    try {
      const deleteResponse = await documents.deleteOne({
        _id: ObjectId(documentId),
        doc_id: docId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete document: ${e}`)
      return { error: e }
    }
  }

}