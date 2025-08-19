import { ensureElement } from '../utils/utils';
import { Component } from './Component';
import { Basket } from './base/BasketModel';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLElement;

	constructor(
		container: HTMLElement,
		actions: ISuccessActions,
		private basket: Basket
	) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			container
		);

		this.basket.clear();

		if (actions?.onClick) {
			this._close.addEventListener('click', () => {
				actions.onClick();
			});
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
