import { IBasketModel, IBasketItem, EventTypes } from '../../types/index';
import { IEvents } from './events';

export class Basket implements IBasketModel {
	items: Map<string, IBasketItem> = new Map();
  events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

	getTotalPrice() {
		let total = 0;
		this.items.forEach((item) => (total += item.price));
		return total;
	}

	addItem(item: IBasketItem) {
		this.items.set(item.id, item);
    this.events.emit(EventTypes.BASKET_UPDATE, this.items)
	}

	removeItem(id: string) {
		this.items.delete(id);
    this.events.emit(EventTypes.BASKET_UPDATE, this.items)
	}

	clear() {
		this.items.clear();
    this.events.emit(EventTypes.BASKET_UPDATE, this.items)
	}
}
