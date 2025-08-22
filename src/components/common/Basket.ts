import { IBasketModel, eventNames } from '../../types';
import { settings } from '../../utils/constants';
import { cloneTemplate, createElement, ensureElement } from '../../utils/utils';
import { View } from '../base/Component';
import { IEvents } from '../base/events';

export class Basket extends View<IBasketModel> {
	static template = ensureElement<HTMLTemplateElement>('#basket');

	_list: HTMLElement;
	_total: HTMLElement;
	_button: HTMLElement;

	constructor(events: IEvents) {
		super(events, cloneTemplate(Basket.template));

		const { container, totalPrice, checkoutButton } = settings.basketSettings;

		this._list = ensureElement<HTMLElement>(container, this.container);
		this._total = ensureElement<HTMLElement>(totalPrice, this.container);
		this._button = ensureElement<HTMLElement>(checkoutButton, this.container);

		this._button.addEventListener('click', () =>
			events.emit(eventNames.order.open)
		);

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.removeAttribute('disabled');
		} else {
			this._list.replaceChildren(
				createElement('p', { textContent: 'Корзина пуста' })
			);
			this._button.setAttribute('disabled', '');
		}
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}
}
