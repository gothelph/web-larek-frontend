import { IOrderInfo } from '../types';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrderInfo> {
	_paymentOnline: HTMLButtonElement;
	_paymentCash: HTMLButtonElement;

	constructor(events: IEvents, container: HTMLFormElement) {
		super(events, container);
		this._paymentOnline = ensureElement<HTMLButtonElement>(
			settings.orderSettings.payment.online,
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			settings.orderSettings.payment.cash,
			this.container
		);

		this._paymentOnline.addEventListener('click', () => {
			this.payment = 'online';
			this.onInputChange('payment', 'online');
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}

	set payment(value: IOrderInfo['payment']) {
		const { classActive } = settings.orderSettings.payment;
		this._paymentOnline.classList.toggle(classActive, value === 'online');
		this._paymentCash.classList.toggle(classActive, value === 'cash');
	}

	set address(value: string) {
		const input = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		input.value = value;
	}
}
