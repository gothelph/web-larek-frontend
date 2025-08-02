import { cloneTemplate } from '../utils/utils';
import { Basket } from './base/BasketModel';
import { IEvents } from './base/events';
import { IBasketItem, IBasketView } from '../types';

function renderBasket(events: IEvents) {
	const basketView = new BasketView(events);
	return basketView.element;
}

class BasketView implements IBasketView {
	// element: HTMLDivElement;
	// listElement: HTMLUListElement;
	// basket = new Basket();

	element: HTMLDivElement;
	listElement: HTMLUListElement;
	priceElement: HTMLSpanElement;
	basket = new Basket();

	constructor(events: IEvents) {
		this.element = cloneTemplate('#basket');
		this.listElement = this.element.querySelector('.basket__list');
		const orderButton = this.element.querySelector('.basket__button');
		orderButton.addEventListener('click', () => this.onConfirm());
		events.on('addToBasket', this.addItem);
		events.on('removeFromBasket', ({ id }: { id: string }) =>
			this.removeItem(id)
		);
	}

	getTotalPrice(): number {
		return 1000;
	}

	addItem(item: IBasketItem): void {
		this.basket.addItem(item);
		this.renderPrice();

		// TODO push element
	}

	onConfirm() {
		// TODO validate
		// TODO event.emit()
	}

	renderPrice() {
		this.element.querySelector(
			'.basket__price'
		).textContent = `${this.basket.getTotalPrice()} синапсов`;
	}

	removeItem(id: string): void {
		this.basket.removeItem(id);
		this.renderPrice();

		// TODO remove element
	}

	clear() {
		this.basket.clear();
		this.renderPrice();

		// TODO clear list
	}
}
