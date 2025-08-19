import { IProductItem, IBasketItem, IOrderInfo, EventTypes } from '../types';
import { IEvents } from './base/events';

export class AppState {
	private events: IEvents;

	public products: IProductItem[] = [];
	public basket: Map<string, IBasketItem> = new Map();
	public order: Partial<IOrderInfo> = {};
	public isLoading: boolean = false;
	public error: string | null = null;

	constructor(events: IEvents) {
		this.events = events;
	}

	setProducts(products: IProductItem[]) {
		this.products = products;
		this.events.emit('products:changed', this.products);
	}

	getProduct(id: string): IProductItem | undefined {
		return this.products.find((p) => p.id === id);
	}

	addToBasket(item: IBasketItem) {
		this.basket.set(item.id, item);
		this.events.emit(EventTypes.BASKET_UPDATE, this.basket);
	}

	removeFromBasket(id: string) {
		this.basket.delete(id);
		this.events.emit(EventTypes.BASKET_UPDATE, this.basket);
	}

	clearBasket() {
		this.basket.clear();
		this.events.emit(EventTypes.BASKET_UPDATE, this.basket);
	}

	getBasketTotal(): number {
		let total = 0;
		this.basket.forEach((item) => (total += item.price));
		return total;
	}

	setOrderPart(data: Partial<IOrderInfo>) {
		this.order = { ...this.order, ...data };
		this.events.emit('order:changed', this.order);
	}

	resetOrder() {
		this.order = {};
		this.events.emit('order:changed', this.order);
	}
}
