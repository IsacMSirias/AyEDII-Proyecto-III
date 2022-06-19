import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let users

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      users = await conn.db(process.env.USERSREVIEWS_NS).collection("Cloud-Drive-AEDII")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usersDAO: ${e}`,
      )
    }
  }
  static async addUser(name,password ) {
    try {
      const NewUser = { name: name,
          password: password, }
      console.log(NewUser)

      return await users.insertOne(NewUser)
    } catch (e) {
      console.error(`Unable to post User: ${e}`)
      return { error: e }
    }
  }
  static async getUsers({
    filters = null,
    page = 0,
    usersPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("password" in filters) {
        query = { "password": { $eq: filters["password"] } }
      }
    }

    let cursor
    
    try {
      cursor = await users
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { usersList: [], totalNumusers: 0 }
    }

    const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

    try {
      const usersList = await displayCursor.toArray()
      const totalNumUsers = await users.countDocuments(query)

      return { usersList, totalNumUsers }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { usersList: [], totalNumUsers: 0 }
    }
  }

  static async getUsersByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "documents",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$user_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "documents",
                  },
              },
              {
                  $addFields: {
                      documents: "$documents",
                  },
              },
          ]
      return await users.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getUserByID: ${e}`)
      throw e
    }
  }
  static async getUsersByIDWhitTags(id,tags,lentags) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
                tags: tags,
            },
        },
              {
                  $lookup: {
                      from: "documents",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$user_id", "$$id"]                               
                                  },                                 
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "documents",
                  },
              },
              {
                  $addFields: {
                      documents: "$documents",
                  },
              },
          ]
      return await users.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getUserByIDWhitTags: ${e}`)
      throw e
    }
  }

  static async getNames() {
    let names = []
    try {
      names = await users.distinct("name")
      return names
    } catch (e) {
      console.error(`Unable to get names, ${e}`)
      return names
    }
  }
  static async getIdUser(name,password) 
      {
      try {
       const userIdResponse = await users
          .findOne({ name: name, password:password })
        return userIdResponse
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        resizeBy.json({ status: "not found" })
      }
 
    }
  }