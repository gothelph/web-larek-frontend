import { ModalView } from '../types';
import { IEvents } from './base/events';

const modal = document.getElementById('modal-container') as HTMLDivElement;

export class Modal extends ModalView {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    modal.addEventListener('click', (e) => {
      if ((e.target as HTMLElement)?.classList.contains("modal")) this.closeModal()
    })

    this.element = container;

    const closeButton = modal.querySelector('.modal__close');
    closeButton.addEventListener('click', () => this.closeModal());
  }

  private render() {
    const content = modal.querySelector('.modal__content');
    content.replaceChildren();
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
