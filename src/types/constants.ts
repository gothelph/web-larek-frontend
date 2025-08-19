import { ElementCreator } from './html';

export interface Settings {
	modalElement: '#modal-container';
	modalSettings: {
		close: '.modal__close';
		content: '.modal__content';
		activeClass: 'modal_active';
	};

	cardSettings: {
		catalogTemplate: '#card-catalog';
		previewTemplate: '#card-preview';
		basketTemplate: '#card-basket';
		selectors: {
			category: '.card__category';
			title: '.card__title';
			image: '.card__image';
			price: '.card__price';
			text: '.card__text';
			button: '.card__button';
			deleteButton: '.basket__item-delete';
		};
	};

	basketTemplate: '#basket';
	basketSettings: {
		container: '.basket__list';
		item: '.basket__item';
		index: '.basket__item-index';
		title: '.card__title';
		price: '.card__price';
		deleteButton: '.basket__item-delete';
		totalPrice: '.basket__price';
		checkoutButton: '.basket__button';
		activeItemClass: string;
		itemClass: string;
	};

	orderTemplate: '#order';
	orderSettings: {
		form: '.form[name="order"]';
		paymentMethods: {
			online: 'button[name="card"]';
			cash: 'button[name="cash"]';
		};
		addressInput: 'input[name="address"]';
		submitButton: '.order__button';
		errorContainer: '.form__errors';
	};

	contactsTemplate: '#contacts';
	contactsSettings: {
		form: '.form[name="contacts"]';
		emailInput: 'input[name="email"]';
		phoneInput: 'input[name="phone"]';
		submitButton: 'button[type="submit"]';
		errorContainer: '.form__errors';
	};

	successTemplate: '#success';
	successSettings: {
		title: '.order-success__title';
		description: '.order-success__description';
		closeButton: '.order-success__close';
	};
}
