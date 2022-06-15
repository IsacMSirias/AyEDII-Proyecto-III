
export default class ProductService {

    getProductsSmall() {
		return fetch('data/restaurants.json').then(res => res.json()).then(d => d.data);
	}

	getProducts() {
		return fetch('data/restaurants.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
		return fetch('data/restaurants.json').then(res => res.json()).then(d => d.data);
	}
}
 