import { IOrderInfo, IProductItem, IClientApi, IOrederResponse } from '../types';
import { API_URL } from '../utils/constants';
import { Api, ApiListResponse } from './base/api';

class ClientApi implements IClientApi {
  private api;

  constructor(apiUrl: string) {
    this.api = new Api(apiUrl);
  }

  async getProductList() {
    try {
      const products = (await this.api.get(
        '/product/'
      )) as ApiListResponse<IProductItem>;
      return products.items;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductItem(id: string) {
    try {
      const product = (await this.api.get(`/product/${id}`)) as IProductItem;
      return product;
    } catch (error) {
      console.error(error.message);
    }
  }

  async processOrder(orderInfo: IOrderInfo) {
    try {
      const order = (await this.api.post('/order/', orderInfo) as IOrederResponse);
      return order
    } catch (error) {
      console.error(error.message);
    }
  }
}

export const clientApi = new ClientApi(API_URL)
