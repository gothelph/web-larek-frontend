import { IOrderInfo, IProductItem, IClientApi, IOrederResponse } from '../types';
import { Api, ApiListResponse } from './base/api';

export class ClientApi extends Api implements IClientApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  async getProductList() {
    try {
      const products = (await this.get(
        '/product/'
      )) as ApiListResponse<IProductItem>;
      return products.items.map(item => ({ ...item, image: this.cdn + item.image }));
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductItem(id: string) {
    try {
      const product = (await this.get(`/product/${id}`)) as IProductItem;
      return { ...product, image: `${this.cdn}${product.image}` };
    } catch (error) {
      console.error(error.message);
    }
  }

  async processOrder(orderInfo: Partial<IOrderInfo>) {
    try {
      const order = (await this.post('/order/', orderInfo) as IOrederResponse);
      return order
    } catch (error) {
      console.error(error.message);
    }
  }
}

