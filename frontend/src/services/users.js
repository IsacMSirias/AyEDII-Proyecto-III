import http from "../htttp-common";

class UsersDataService {
    getUsers() {
        return http.get('');
    }

    get(user, password) {
        return http.get('/id', {
        params: {
                "name": 'Usuario',
                "password": 'agregadoporpost123'
            }
        });
    }

    find(query, by = "name", page = 0) {
        return http.get(`restaurants?${by}=${query}&page=${page}`);
    } 

    createReview(data) {
        return http.post("/review-new", data);
    }

    updateReview(data) {
        return http.put("/review-edit", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    }
}

export default new UsersDataService();