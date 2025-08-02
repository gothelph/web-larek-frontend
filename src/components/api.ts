import { IOrderInfo, IProductItem } from '../types';
import { API_URL } from '../utils/constants';
import { Api, ApiListResponse } from './base/api';

const api = new Api(API_URL);

export async function getProducts() {
	try {
		const products = (await api.get(
			'/product/'
		)) as ApiListResponse<IProductItem>;
		return products.items;
	} catch (error) {
		console.error(error.message);
	}
}

export async function getProduct(id: string) {
	try {
		const product = (await api.get(`/product/${id}`)) as IProductItem;
		return product;
	} catch (error) {
		console.error(error.message);
	}
}

export async function order(orderInfo: IOrderInfo) {
	try {
		await api.post('/order/', orderInfo);
	} catch (error) {
		console.error(error.message);
	}
}
