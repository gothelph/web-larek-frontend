import { IEvents } from '../components/base/events';

export abstract class SuccessView {
	constructor(protected events: IEvents) {}
	element: HTMLElement;
	abstract render(total: number): void;
}

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}

export interface IBasketModel {
	items: Map<string, IBasketItem>;
	total: number;
}

export interface IOrderInfo {
	payment: 'online' | 'cash';
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

export interface IApiError {
	error: string;
}

export interface IOrederResponse {
	id: string;
	total: number;
}

export interface IClientApi {
	getProductList(): Promise<IProductItem[]>;
	getProductItem(id: string): Promise<IProductItem | IApiError>;
	processOrder(order: IOrderInfo): Promise<IOrederResponse | IApiError>;
}

export type CardViewType = 'catalog' | 'preview' | 'basket';

export interface IMainPageView {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export const eventNames = {
	preview: {
		change: 'preview:change',
	},
	basket: {
		open: 'basket:open',
		change: 'basket:change',
	},
	card: {
		select: 'card:select',
	},
	formErrors: {
		change: 'formErrors:change',
	},
	order: {
		change: 'order:change',
		submit: 'order:submit',
		ready: 'order:ready',
		open: 'order:open',
	},
	contacts: {
		submit: 'contacts:submit',
		change: 'contacts:change',
	},
	product: {
		change: 'product:change',
	},
	modal: {
		open: 'modal:open',
		close: 'modal:close',
	},
};
