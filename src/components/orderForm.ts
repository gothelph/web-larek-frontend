import {
	IOrderInfo,
	OrderInfoFormView,
	OrderInfoContactsFormView,
} from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './modals';
import { Success } from './Succes';
import { Basket } from './base/BasketModel';

export class OrderInfoContactsForm extends OrderInfoContactsFormView {
	private basket: Basket;
	errors: HTMLElement;
	submit: HTMLButtonElement;
	element: HTMLFormElement;
	events: IEvents;
	private orderData: Partial<IOrderInfo>;

	constructor(events: IEvents, orderData: Partial<IOrderInfo>, basket: Basket) {
		super(events);
		this.events = events;
		this.orderData = orderData;
		this.basket = basket;
		const contactsForm = cloneTemplate<HTMLFormElement>('#contacts');
		this.element = contactsForm;
		this.errors = contactsForm.querySelector('.form__errors');
		this.submit = contactsForm.querySelector('.button');

		const emailInput = contactsForm.querySelector('input[name="email"]');
		const phoneInput = contactsForm.querySelector('input[name="phone"]');

		emailInput.addEventListener('input', (e: Event) => {
			this.onInputChange('email', (e.target as HTMLInputElement).value);
		});

		phoneInput.addEventListener('input', (e: Event) => {
			this.onInputChange('telephone', (e.target as HTMLInputElement).value);
		});

		contactsForm.addEventListener('submit', (e) => {
			e.preventDefault();
			this.processSubmit();
		});

		this.validateForm();
	}

	render() {
		const modal = new Modal(this.element, this.events);
		modal.openModal();
	}

	onInputChange(
		field: keyof Pick<IOrderInfo, 'email' | 'telephone'>,
		value: string
	) {
		this.orderData[field] = value;
		const isError = !this.validateForm();

		if (isError) {
			this.submit.setAttribute('disabled', '');
			this.errors.textContent = this.getErrorMessage();
		} else {
			this.submit.removeAttribute('disabled');
			this.errors.textContent = '';
		}
	}

	private validateForm(): boolean {
		const email = this.orderData.email?.trim() || '';
		const phone = this.orderData.telephone?.trim() || '';

		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isPhoneValid = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone);

		return isEmailValid && isPhoneValid;
	}

	private getErrorMessage(): string {
		const email = this.orderData.email?.trim() || '';
		const phone = this.orderData.telephone?.trim() || '';

		if (!email) return 'Укажите email';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			return 'Неверный формат email';
		if (!phone) return 'Укажите телефон';
		if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone)) {
			return 'Телефон должен быть в формате: +7 (XXX) XXX-XX-XX';
		}

		return '';
	}

	private async processSubmit() {
		if (!this.validateForm()) {
			this.errors.textContent = this.getErrorMessage();
			return;
		}

		const fullOrder: IOrderInfo = {
			...this.orderData,
			email: this.orderData.email.trim(),
			telephone: this.orderData.telephone.trim(),
			items: Array.from(this.basket.items.keys()),
			total: this.basket.getTotalPrice(),
		} as IOrderInfo;

		try {
			this.showSuccess(fullOrder.total);
			this.basket.clear();
		} catch (error) {
			console.error('Ошибка оформления заказа:', error);
			this.errors.textContent = 'Ошибка оформления заказа';
		}
	}

	private showSuccess(total: number) {
		const modalContainer = document.getElementById('modal-container');
		if (modalContainer) {
			modalContainer.classList.remove('modal_active');
		}

		const successElement = cloneTemplate<HTMLElement>('#success');

		const success = new Success(
			successElement,
			{
				onClick: () => {
					modalContainer?.classList.remove('modal_active');
					this.events.emit('order:success');
				},
			},
			this.basket
		);

		success.total = total;

		if (modalContainer) {
			const modalContent = modalContainer.querySelector('.modal__content');
			if (modalContent) {
				modalContent.innerHTML = '';
				modalContent.appendChild(success.element);
				modalContainer.classList.add('modal_active');
			}
		}
	}
}

export class OrderInfoForm extends OrderInfoFormView {
	errors: HTMLElement;
	submit: HTMLButtonElement;
	element: HTMLFormElement;
	events: IEvents;
	private basket: Basket;
	private modal: Modal | null = null;
	private selectedPayment: 'online' | 'whenReceiving' | null = null;
	private orderData: Partial<IOrderInfo> = {};

	constructor(events: IEvents, basket: Basket) {
		super(events);
		this.events = events;
		this.basket = basket;
		const orderForm = cloneTemplate<HTMLFormElement>('#order');
		this.element = orderForm;
		this.errors = orderForm.querySelector('.form__errors');
		this.submit = orderForm.querySelector('.order__button');
		const orderButtons = orderForm.querySelector('.order__buttons');

		const cashButton = orderButtons.querySelector('[name="cash"]');
		const cardButton = orderButtons.querySelector('[name="card"]');

		cashButton.addEventListener('click', () => {
			this.setPaymentMethod('whenReceiving', cashButton, cardButton);
		});

		cardButton.addEventListener('click', () => {
			this.setPaymentMethod('online', cardButton, cashButton);
		});

		const addressInput = orderForm.querySelector('input[name="address"]');
		addressInput.addEventListener('input', (e: Event) => {
			this.onInputChange('address', (e.target as HTMLInputElement).value);
		});

		orderForm.addEventListener('submit', (e) => {
			e.preventDefault();
			this.processSubmit();
		});

		this.validateForm();
	}

	render() {
		this.modal = new Modal(this.element, this.events);
		this.modal.openModal();
	}

	private setPaymentMethod(
		method: 'online' | 'whenReceiving',
		activeButton: Element,
		inactiveButton: Element
	) {
		this.selectedPayment = method;
		activeButton.classList.add('button_alt-active');
		inactiveButton.classList.remove('button_alt-active');
		this.orderData.paymentMethod = method;
		this.onInputChange('paymentMethod', method);
	}

	onInputChange(
		field: keyof Pick<IOrderInfo, 'paymentMethod' | 'address'>,
		value: string
	) {
		if (field === 'address') {
			this.orderData.address = value;
		}

		const isError = !this.validateForm();

		if (isError) {
			this.submit.setAttribute('disabled', '');
			this.errors.textContent = this.getErrorMessage();
		} else {
			this.submit.removeAttribute('disabled');
			this.errors.textContent = '';
		}
	}

	private validateForm(): boolean {
		const address = this.orderData.address?.trim() || '';
		const isAddressValid = address.length > 5;
		const isPaymentValid = this.selectedPayment !== null;

		return isAddressValid && isPaymentValid;
	}

	private getErrorMessage(): string {
		const address = this.orderData.address?.trim() || '';

		if (!address) return 'Укажите адрес доставки';
		if (address.length < 5) return 'Адрес слишком короткий';
		if (!this.selectedPayment) return 'Выберите способ оплаты';

		return '';
	}

	private processSubmit() {
		if (!this.validateForm()) {
			this.errors.textContent = this.getErrorMessage();
			return;
		}

		this.orderData = {
			...this.orderData,
			address: this.orderData.address.trim(),
			paymentMethod: this.selectedPayment,
		};

		this.modal.closeModal();

		const contactsForm = new OrderInfoContactsForm(
			this.events,
			this.orderData,
			this.basket
		);
		contactsForm.render();
	}
}
