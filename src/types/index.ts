import { IEvents } from '../components/base/events';

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}

export interface IBasketModel {
	getTotalPrice(): number;
	addItem(item: IBasketItem): void;
	removeItem(id: string): void;
	clear(): void;
	items: Map<string, IBasketItem>;
}

export interface IOrderInfo {
	paymentMethod: 'online' | 'whenReceiving';
	address: string;
	email: string;
	telephone: string;
	total: number;
	items: string[];
}

export interface IApiError {
	error: string;
}

export interface IClientApi {
	getProductList(): Promise<{ total: number; items: IProductItem[] }>;

	getProductItem(id: string): Promise<IProductItem | IApiError>;

	processOrder(
		order: IOrderInfo
	): Promise<{ id: string; total: number } | IApiError>;
}

// Интерфейсы отображения

export type CardViewType = 'catalog' | 'preview' | 'basket';

// Фабрика для подготовки шаблона карточки по его типу
type CardViewFactoryType<T extends CardViewType> = ({
	type,
	template,
	item,
	onClick,
}: {
	type: T;
	template: string;
	item: CardItemType<T>;
	onClick: (id: string) => void;
}) => HTMLElement;

type CardItemType<T extends CardViewType> = T extends 'basket'
	? IBasketItem
	: IProductItem;

// Шаблон карточки
abstract class CardView<T extends CardViewType> {
	constructor({
		type,
		template,
		item,
		onClick,
		events,
	}: {
		type: T;
		template: string;
		item: CardItemType<T>;
		onClick: (id: string) => void;
		events: IEvents;
	}) {}

	prepareTemplate: CardViewFactoryType<T>;
	element: HTMLElement;
}

// Карточка товара
export abstract class ProductView extends CardView<'catalog'> {}

// Карточка информации о товаре
export abstract class DetailProductView extends CardView<'preview'> {}

// Карточка элемента корзины
export abstract class BasketItemView extends CardView<'basket'> {}

// Отображение корзины
export interface IBasketView extends IBasketModel {
	onConfirm: () => void;
}

// Отображение главной страницы
export interface IMainPageView {
	productList: ProductView[];
	headerBasketButton: HTMLButtonElement;
	headerBasketCounter: HTMLSpanElement;
	gallery: HTMLDivElement;
	renderProductList: () => void;
	fetchProductList: () => void;
}

export abstract class ModalView {
	constructor(container: HTMLElement, events: IEvents) {}
	element: HTMLElement;
	closeButton: HTMLButtonElement;
	abstract openModal(modal: HTMLDivElement): void;
	abstract closeModal(modal: HTMLDivElement): void;
	// abstract render(): void;
}

abstract class Form<T> {
	constructor(form: HTMLFormElement, events: IEvents) {}
	errors: HTMLElement;
	submit: HTMLButtonElement;
	render: () => void;
	onInputChange: (field: keyof T, value: string) => void;
}

export abstract class OrderInfoFormView extends Form<
	Pick<IOrderInfo, 'paymentMethod' | 'address'>
> {}

export abstract class OrderInfoContactsFormView extends Form<
	Pick<IOrderInfo, 'email' | 'telephone'>
> {}

export type ISuccessView = Pick<IOrderInfo, 'total'>;

// Валидация

export interface IValidatorSettings {
	formSelector: string;
	inputSelector: string;
	submitButtonSelector: string;
	inactiveButtonClass: string;
	inputErrorClass: string;
	errorClass: string;
}

export interface IValidator {
	settings: IValidatorSettings;
	enableValidation: () => void;
	clearValidation: (form: HTMLFormElement) => void;
}

//Отображение

//рендер главной страницы
