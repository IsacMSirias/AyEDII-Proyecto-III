import UsersDAO from "../dao/usersDAO.js"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { decompress_LZ77 } = require('../build/Release/decompresslz77.node');
const { decompress_LZ78 } = require('../build/Release/decompresslz78.node');


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
      console.log(user.documents)
      for (const file in user.documents) {
        var decompressData;
        switch (user.documents[file].tags[1]) {
          case 'LZ77':
            decompressData = decompress_LZ77(user.documents[file].file);
            break;
          case 'LZ78':
            decompressData = decompress_LZ78(user.documents[file].file);
            break;
          default:
            decompressData = user.documents[file].file;
            break;
        }
        user.documents[file].file = decompressData;
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
      var documentswhittag = {}
      documentswhittag.documents=[]
      let id = req.params.id 
      let tags = req.query.tags   
      let user = await UsersDAO.getUsersByIDWhitTags(id)
      if (!user) {
        res.status(404).json({ error: "Not found" })
        return
            }
      if(user.documents){
        for(var i = 0;i<=user.documents.length-1;i++){
          for(var j=0;j<=user.documents[0].tags.length-1;j++){
            if(user.documents[i].tags[j]==tags){
              documentswhittag.documents.push(user.documents[i])
            }


            }
          }
        }
      
      res.json(documentswhittag)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}