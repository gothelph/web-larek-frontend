import { AppState } from './components/AppState';
import { Card } from './components/Card';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { ClientApi } from './components/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Succes';
import './scss/styles.scss';
import { IOrderInfo, IProductItem, eventNames } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new ClientApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardSettings.catalogTemplate
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardSettings.previewTemplate
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	settings.cardSettings.basketTemplate
);
const orderFormTemplate = ensureElement<HTMLTemplateElement>(
	settings.orderTemplate
);
const contactsFormTemplate = ensureElement<HTMLTemplateElement>(
	settings.contactsTemplate
);
const successTemplate = ensureElement<HTMLTemplateElement>(
	settings.successTemplate
);

const modalElement = ensureElement<HTMLElement>(settings.modalElement);

const eventEmitter = new EventEmitter();
const appState = new AppState(eventEmitter);

const page = new Page(eventEmitter, document.body);
const modal = new Modal(eventEmitter, modalElement);

const basket = new Basket(eventEmitter);
const orderForm = new Order(eventEmitter, cloneTemplate(orderFormTemplate));
const contactsForm = new Contacts(
	eventEmitter,
	cloneTemplate(contactsFormTemplate)
);

eventEmitter.on(eventNames.contacts.submit, () => {
	api
		.processOrder(appState.order)
		.then((result) => {
			const successActions = {
				onClick: () => {
					modal.closeModal();
					appState.clearBasket();
				},
			};
			const success = new Success(
				cloneTemplate(successTemplate),
				successActions
			);

			modal.render({
				content: success.render(result),
			});
			appState.clearOrder();
		})
		.catch((error) => {
			console.error(error);
		});
});

eventEmitter.on(eventNames.order.open, () => {
	modal.render({
		content: orderForm.render({
			payment: 'online',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appState.setOrderPart({ payment: 'online' });
});

eventEmitter.on(eventNames.order.submit, () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

eventEmitter.on(eventNames.order.ready, () => {
	contactsForm.valid = true;
});

eventEmitter.on(
	eventNames.contacts.change,
	(data: { field: keyof IOrderInfo; value: string }) => {
		appState.setOrderPart({ [data.field]: data.value });
	}
);

eventEmitter.on(
	eventNames.order.change,
	(data: { field: keyof IOrderInfo; value: string }) => {
		appState.setOrderPart({ [data.field]: data.value });
	}
);

eventEmitter.on(eventNames.formErrors.change, (errors: Partial<IOrderInfo>) => {
	const { payment: paymentMethod, address, email, phone } = errors;
	orderForm.valid = !paymentMethod && !address;
	orderForm.errors = Object.values({ paymentMethod, address })
		.filter((el) => !!el)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((el) => !!el)
		.join('; ');
});

eventEmitter.on(eventNames.basket.open, () => {
	modal.render({
		content: basket.render(),
	});
});

eventEmitter.on(eventNames.basket.change, () => {
	page.counter = appState.basket.size;

	basket.items = Array.from(appState.basket.values()).map(({ id }) => {
		const item = appState.products.find((el) => el.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appState.removeFromBasket(id),
		});
		return card.render(item);
	});

	basket.total = appState.getBasketTotal();
});

eventEmitter.on(eventNames.modal.open, () => {
	page.locked = true;
});

eventEmitter.on(eventNames.modal.close, () => {
	page.locked = false;
});

eventEmitter.on(eventNames.card.select, (product: IProductItem) => {
	appState.setPreview(product);
});

eventEmitter.on(eventNames.product.change, (products: IProductItem[]) => {
	page.catalog = products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => eventEmitter.emit(eventNames.card.select, product),
		});
		card.setType('column');

		return card.render(product);
	});
});

eventEmitter.on(eventNames.preview.change, (item: IProductItem) => {
	if (item) {
		const actions = {
			onClick: () => {
				if (appState.isInBasket(item.id)) {
					appState.removeFromBasket(item.id);
					card.button = 'В корзину';
				} else {
					appState.addToBasket(item);
					card.button = 'Удалить из корзины';
				}
			},
		};
		const card = new Card(cloneTemplate(cardPreviewTemplate), actions);
		card.button = appState.isInBasket(item.id)
			? 'Удалить из корзины'
			: 'В корзину';

		modal.render({
			content: card.render(item),
		});
	} else {
		modal.closeModal();
	}
});

api
	.getProductList()
	.then((products) => {
		appState.setProducts(products);
	})
	.catch((error) => console.error(error));

//
eventEmitter.on(eventNames.basket.change, () => {
	page.counter = appState.basket.size;

	basket.items = Array.from(appState.basket.values()).map(({ id }, index) => {
		const item = appState.products.find((el) => el.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appState.removeFromBasket(id),
		});
		card.index = index + 1; // Добавляем нумерацию
		return card.render(item);
	});

	basket.total = appState.getBasketTotal();
});

eventEmitter.on(eventNames.contacts.submit, () => {
	api
		.processOrder(appState.order)
		.then((result) => {
			appState.clearBasket();
			const successActions = {
				onClick: () => {
					modal.closeModal();
				},
			};
			const success = new Success(
				cloneTemplate(successTemplate),
				successActions
			);
			modal.render({
				content: success.render(result),
			});
			appState.clearOrder();
		})
		.catch((error) => {
			console.error(error);
		});
});
