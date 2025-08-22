import { IProductItem } from '../types';
import { settings } from '../utils/constants';
import { getElementData } from '../utils/utils';
import { setElementData } from '../utils/utils';
import { bem, ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick?: (e: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
	_title: HTMLElement;
	_button: HTMLButtonElement;
	_price: HTMLElement;
	_catgory: HTMLElement;
	_image: HTMLImageElement;
	_description: HTMLElement;
	_index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		const { category, title, image, price, description, button } =
			settings.cardSettings.selectors;

		this._title = ensureElement<HTMLElement>(title, container);
		this._price = ensureElement<HTMLElement>(price, container);
		this._index = container.querySelector('.basket__item-index');

		this._catgory = container.querySelector(category);
		this._image = container.querySelector(image);
		this._button = container.querySelector(button);
		this._description = container.querySelector(description);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	toggle(modifier: string) {
		this.toggleClass(bem('card', undefined, modifier).name);
	}

	setType(type: 'column' | 'center') {
		const { alignClass } = settings.cardSettings.selectors;
		if (type === 'column') {
			this.container.classList.add(alignClass);
		} else {
			this.container.classList.remove(alignClass);
		}
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	set id(value: string) {
		setElementData(this.container, { id: value });
	}

	get id() {
		return getElementData<{ id: string }>(this.container, {
			id: (data?: string) => data || '',
		}).id;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set category(value: string) {
		this.setText(this._catgory, value);
		const modifier = categoryToModifier[value];
		this.container
			.querySelector(settings.cardSettings.selectors.category)
			?.classList.add(bem('card', 'category', modifier).name);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}

const categoryToModifier: Record<string, string> = {
	дополнительное: 'additional',
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	кнопка: 'button',
	другое: 'other',
};
