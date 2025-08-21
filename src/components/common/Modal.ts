import { eventNames } from '../../types';
import { settings } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/Component';
import { IEvents } from '../base/events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends View<IModal> {
  _closeButton: HTMLButtonElement;
  _content: HTMLElement;

  constructor(events: IEvents, container: HTMLElement, ) {
    super(events, container);

    this._closeButton = ensureElement<HTMLButtonElement>(settings.modalSettings.close, container);
    this._content = ensureElement<HTMLElement>(settings.modalSettings.content, container);
    
    this._closeButton.addEventListener('click', this.closeModal.bind(this));
    this.container.addEventListener('click', this.closeModal.bind(this));
    this._content.addEventListener('click',(e) => e.stopPropagation() );
  }

  set content(content: HTMLElement) {
    this._content.replaceChildren(content);
  }

  render(data?: IModal) {
    super.render(data);
    this.openModal();
    return this.container;
  }

  closeModal() {
    this.container.classList.remove(settings.modalSettings.activeClass);
    this.content = null
    this.events.emit(eventNames.modal.close);
  }

  openModal() {
    this.container.classList.add(settings.modalSettings.activeClass);
    this.events.emit(eventNames.modal.open);
  }
}
