import http from "../htttp-common";

class UsersDataService {
    getUsers() {
        return http.get('');
    }

    get(user, password) {
        return http.get('/id', {
        params: {
                name: user,
                password: password
            }
        });
    }
    getDocumentsWhitTags(id, tags) {
        return http.get('/id/tags', {
        params: {
                id: id,
                tags: tags
            }
        });
    }

    postUser(user, password) {
        return http.post('', {
            name: user,
            password: password
        });
    }

    find(query, by = "name", page = 0) {
        return http.get(`restaurants?${by}=${query}&page=${page}`);
    }
    
    getDocuments(id) {
        return http.get(`/id/${id}`)
    }

    createDocument(data) {
        return http.post("/document", data);
    }

    updateDocument(data) {
        return http.put("/document", data);
    }

    deleteDocument(id) {
        return http.delete(`/document?id=${id}`);
    }

}

export default new UsersDataService();