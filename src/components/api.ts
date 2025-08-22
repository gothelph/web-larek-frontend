import {
	IOrderInfo,
	IProductItem,
	IClientApi,
	IOrederResponse,
} from '../types';
import { Api, ApiListResponse } from './base/api';

export class ClientApi extends Api implements IClientApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async getProductList() {
		const products = (await this.get(
			'/product/'
		)) as ApiListResponse<IProductItem>;
		return products.items.map((item) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	async getProductItem(id: string) {
		const product = (await this.get(`/product/${id}`)) as IProductItem;
		return { ...product, image: `${this.cdn}${product.image}` };
	}

	async processOrder(orderInfo: Partial<IOrderInfo>) {
		return (await this.post('/order/', orderInfo)) as IOrederResponse;
	}
}
