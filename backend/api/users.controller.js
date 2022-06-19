import UsersDAO from "../dao/usersDAO.js"

export default class UsersController {
  static async apiGetUsers(req, res, next) {
    const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.name) {
        filters.name = req.query.name
    } else if (req.query.password) {
      filters.password = req.query.password
    } 

    const { usersList, totalNumUsers } = await UsersDAO.getUsers({
      filters,
      page,
      usersPerPage,
    })

    let response = {
      users: usersList,
      page: page,
      filters: filters,
      entries_per_page: usersPerPage,
      total_results: totalNumUsers,
    }
    res.json(response)
  }

  static async apiGetUserById(req, res, next) {
    try {
      let id = req.params.id || {}
      let user = await UsersDAO.getUsersByID(id)
      if (!user) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(user)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  static async apiPostUser(req, res, next){
    try {
      const name = req.body.name
      const password = req.body.password
      
      
      const UserResponse = await UsersDAO.addUser(
        name,
        password,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  static async apiGetIdUser(req, res, next) {
    try {
      const name = req.query.name
      const password = req.query.password

      const IdResponse = await UsersDAO.getIdUser(name,password)
      if(!IdResponse){
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(IdResponse)
    }
    catch (e){
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  static async apiGetUserByIdWhitTags(req, res, next) {
    try {
      let id = req.params.id 
      console.log(id)
      let tags = req.body.tags
      console.log(tags[0])
      let lentags = tags.length
      console.log(lentags)
      let user = await UsersDAO.getUsersByIDWhitTags(id, tags, lentags)
      console.log(user)
      if (!user) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(user)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}