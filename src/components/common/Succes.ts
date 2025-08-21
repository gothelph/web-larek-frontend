import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _total: HTMLElement;
  protected _close: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    const { description, closeButton } = settings.successSettings;

    this._total = ensureElement<HTMLElement>(description, container);
    this._close = ensureElement<HTMLElement>(closeButton, container);


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
