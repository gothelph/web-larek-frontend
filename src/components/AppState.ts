import { IProductItem, IBasketItem, IOrderInfo, eventNames } from '../types';
import { validateEmail, validatePhone } from '../utils/utils';
import { IEvents } from './base/events';

export class AppState {
	private events: IEvents;

	preview: IProductItem | null = null;
	products: IProductItem[] = [];
	basket: Map<string, IBasketItem> = new Map();
	order: Partial<IOrderInfo> = {};
	formErrors: {
		paymentMethod?: string;
		address?: string;
		email?: string;
		phone?: string;
	} = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	setPreview(product: IProductItem) {
		this.preview = product;
		this.events.emit(eventNames.preview.change, this.preview);
	}

	setProducts(products: IProductItem[]) {
		this.products = products;
		this.events.emit(eventNames.product.change, this.products);
	}

	addToBasket(item: IBasketItem) {
		this.basket.set(item.id, item);
		this.events.emit(eventNames.basket.change, this.basket);
	}

	removeFromBasket(id: string) {
		this.basket.delete(id);
		this.events.emit(eventNames.basket.change, this.basket);
	}

	clearBasket() {
		this.basket.clear();
		this.events.emit(eventNames.basket.change, this.basket);
	}

	getBasketTotal(): number {
		let total = 0;
		this.basket.forEach((item) => (total += item.price));
		return total;
	}

	clearOrder() {
		this.order = {};
	}

	setOrderPart(data: Partial<IOrderInfo>) {
		this.order = { ...this.order, ...data };

		if (this.order.payment && this.validateOrder()) {
			this.order.total = this.getBasketTotal();
			this.order.items = Array.from(this.basket.values()).map(({ id }) => id);
			this.events.emit(eventNames.order.ready, this.order);
		}
	}

	isInBasket(id: string) {
		return this.basket.has(id);
	}

	getProduct(id: string): IProductItem | undefined {
		return this.products.find((p) => p.id === id);
	}

	validateOrder() {
		const errors = {} as typeof this.formErrors;
		if (!this.order.payment)
			errors.paymentMethod = 'Необходимо выбрать способ оплаты';

		if (!this.order.address) errors.address = 'Необходимо указать адрес';
		else if (this.order.address.length < 5)
			errors.address = 'Адрес слишком короткий';

		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!validateEmail(this.order.email))
			errors.email = 'Неверный формат email';

		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		else if (!validatePhone(this.order.phone)) {
			errors.phone = 'Телефон должен быть в формате: +7 (XXX) XXX-XX-XX';
		}

		this.formErrors = errors;
		this.events.emit(eventNames.formErrors.change, this.formErrors);

		return Object.keys(errors).length === 0;
	}
}
