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

  static async addDocument(userId, docname, document, date, tags ) {
    try {
      const documentDoc = { name: docname,
          date: date,
          file: document,
          tags: tags,
          user_id: ObjectId(userId), }
      console.log(documentDoc)

      return await documents.insertOne(documentDoc)
    } catch (e) {
      console.error(`Unable to post document: ${e}`)
      return { error: e }
    }
  }

  static async updateDocument(documentId, file, date, tags) {
    try {
      const updateResponse = await documents.updateOne(
        { _id: ObjectId(documentId)},
        { $set: { file: file, date: date, tags: tags} },
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
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete document: ${e}`)
      return { error: e }
    }
  }

}