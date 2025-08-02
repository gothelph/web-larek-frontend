import {
	BasketItemView,
	DetailProductView,
	IBasketItem,
	IProductItem,
	ProductView,
} from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { ProductModal } from './modals';

function getImageUrl(img: string) {
	return `${CDN_URL}${img}`;
}

export function createProductCard(product: IProductItem, events: IEvents) {
	const openProductModalEvent = `openProductModal_${product.id}`;

	const cardCatalog = new CardCatalog({
		template: '#card-catalog',
		item: product,
		onClick: (id) => events.emit(`openProductModal_${id}`),
	});

	const detailCardProduct = createDetailCardProduct(product, events);

	const productModal = new ProductModal(detailCardProduct, events, product);

	events.on(openProductModalEvent, () => productModal.closeModal());
	events.on(openProductModalEvent, () => productModal.openModal());

	return cardCatalog.element;
}

export function createDetailCardProduct(
	product: IProductItem,
	events: IEvents
) {
	const onClick = () => events.emit('addToBasket', product);
	const detailProduct = new DetailProduct({
		item: product,
		onClick,
		template: '#card-preview',
	});
	return detailProduct.element;
}
export function createBasketItem(basketItem: IBasketItem, events: IEvents) {
	const onClick = () => events.emit('removeFromBasket', basketItem);
	const detailProduct = new BasketItem({
		item: basketItem,
		onClick,
		template: '#card-basket',
	});
	return detailProduct.element;
}

class CardCatalog extends ProductView {
	constructor({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IProductItem;
		onClick: (id: string) => void;
	}) {
		super({ type: 'catalog', template, item, onClick, events: null });
		this.element = this.prepareTemplate({ item, onClick, template });
	}

	prepareTemplate = ({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IProductItem;
		onClick: (id: string) => void;
	}) => {
		const cardCatalog = cloneTemplate<HTMLButtonElement>(template);
		cardCatalog.querySelector('.card__title').textContent = item.title;

		const productImg = cardCatalog.querySelector(
			'.card__image'
		) as HTMLImageElement;
		productImg.src = getImageUrl(item.image);
		productImg.alt = item.title;

		cardCatalog.querySelector(
			'.card__price'
		).textContent = `${item.price} синапсов`;

		cardCatalog.addEventListener('click', () => onClick(item.id));

		return cardCatalog;
	};
}

class DetailProduct extends DetailProductView {
	constructor({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IProductItem;
		onClick: (id: string) => void;
	}) {
		super({ type: 'preview', template, item, onClick, events: null });
		this.element = this.prepareTemplate({ item, onClick, template });
	}

	prepareTemplate = ({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IProductItem;
		onClick: (id: string) => void;
	}) => {
		const cardPreview = cloneTemplate<HTMLButtonElement>(template);
		cardPreview.querySelector('.card__title').textContent = item.title;
		cardPreview.querySelector('.card__text').textContent = item.description;

		const previewImg = cardPreview.querySelector(
			'.card__image'
		) as HTMLImageElement;
		previewImg.src = getImageUrl(item.image);
		previewImg.alt = item.title;

		cardPreview.querySelector(
			'.card__price'
		).textContent = `${item.price} синапсов`;
		cardPreview.addEventListener('click', () => onClick(item.id));

		return cardPreview;
	};
}

class BasketItem extends BasketItemView {
	constructor({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IBasketItem;
		onClick: (id: string) => void;
	}) {
		super({ type: 'basket', template, item, onClick, events: null });
		this.element = this.prepareTemplate({ item, onClick, template });
	}

	prepareTemplate = ({
		template,
		item,
		onClick,
	}: {
		template: string;
		item: IBasketItem;
		onClick: (id: string) => void;
	}) => {
		const cardBasket = cloneTemplate<HTMLButtonElement>(template);
		cardBasket.querySelector('.basket__item-index').textContent = item.id;
		cardBasket.querySelector('.card__title').textContent = item.title;
		cardBasket.querySelector(
			'.card__price'
		).textContent = `${item.price} синапсов`;

		cardBasket.addEventListener('click', () => onClick(item.id));

		return cardBasket;
	};
}
