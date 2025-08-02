import { IBasketModel, IBasketItem } from '../../types/index';

export class Basket implements IBasketModel {
	items: Map<string, IBasketItem> = new Map();

	getTotalPrice() {
		let total = 0;
		this.items.forEach((item) => (total += item.price));
		return total;
	}

	addItem(item: IBasketItem) {
		this.items.set(item.id, item);
	}

	removeItem(id: string) {
		this.items.delete(id);
	}

	clear() {
		this.items.clear();
	}
}
