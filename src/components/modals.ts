import { IProductItem, ModalView } from '../types';
import { Basket } from './base/BasketModel';
import { IEvents } from './base/events';

const modal = document.getElementById('modal-container') as HTMLDivElement;

export class ProductModal extends ModalView {
	constructor(container: HTMLElement, events: IEvents, product: IProductItem) {
		super(container, events);

		this.element = container;

		const closeButton = modal.querySelector('.modal__close');
		closeButton.addEventListener('click', () => this.closeModal());
	}

	private render() {
		const content = modal.querySelector('.modal__content');
		content.appendChild(this.element);
	}

	closeModal() {
		this.element.remove();
		modal.classList.remove('modal_active');
	}

	openModal() {
		this.render();
		modal.classList.add('modal_active');
	}
}

export class BasketModal extends ModalView {
	constructor(container: HTMLTemplateElement, events: IEvents, basket: Basket) {
		super(container, events);

		const basketElement = container.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLDivElement;

		const basketList = basketElement.querySelector(
			'.basket__list'
		) as HTMLImageElement;

		const orderButton = basketElement.querySelector('.basket__button');
		orderButton.addEventListener('click', () => {
			//*TODO* openModal
		});

		this.element = basketElement;

		const closeButton = modal.querySelector('.modal__close');
		closeButton.addEventListener('click', () => this.closeModal());

		events.on('addToBasket', basket.addItem);
	}

	private render() {
		const content = modal.querySelector('.modal__content');
		content.appendChild(this.element);
	}

	closeModal() {
		this.element.remove();
		modal.classList.remove('modal_active');
	}

	openModal() {
		this.render();
		modal.classList.add('modal_active');
	}
}
