import { IOrderInfo, OrderInfoFormView } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './modals';

const orderInfo: Partial<IOrderInfo> = {}

export class OrderInfoForm extends OrderInfoFormView {
  errors: HTMLElement;
  submit: HTMLButtonElement;
  element: HTMLFormElement;
  events: IEvents;

  constructor(events: IEvents) {
    super(events)

    this.events = events;

    const orderForm = cloneTemplate<HTMLFormElement>('#order')
    this.element = orderForm;
    this.errors = orderForm.querySelector('.form__errors')
    this.submit = orderForm.querySelector('.order__button')
    const orderButtons = orderForm.querySelector('.order__buttons')

    // function clearButtonsState() {
    //   orderButtons.childNodes.forEach((button: HTMLButtonElement) => {
    //     button.classList.remove('button_alt-active')
    //   })
    // }

    const cashButton = orderButtons.querySelector('[name="cash"]')
    const cardButton = orderButtons.querySelector('[name="card"]')

    const paymentMethodButtons = [cashButton, cardButton]

    cashButton.addEventListener('click', () => {
      const isActive = cashButton.classList.contains('button_alt-active')
      paymentMethodButtons.forEach(button =>
        button.classList.remove('button_alt-active')
      )
      cashButton.classList.toggle('button_alt-active')

    })

    // orderButtons.chil.forEach((button: HTMLButtonElement) => {
    //   button.addEventListener('click', () => {
    //     const isActive = button.classList.contains('button_alt-active')
    //     if (isActive) {
    //       button.classList.remove('button_alt-active')
    //     } else {
    //       clearButtonsState()
    //       button.classList.add('button_alt-active')
    //       this.onInputChange('paymentMethod', button.name)
    //     }
    //   })
    // })
    //
  }


  render() {
    const modal = new Modal(this.element, this.events)
    modal.openModal();
  };

  onInputChange(field: keyof Pick<IOrderInfo, 'paymentMethod' | 'address'>, value: string) {
    console.log(field, value)
    const isError = true

    if (isError) {
      this.submit.setAttribute('disabled', '')
      this.errors.textContent = 'error'
    } else {
      this.submit.removeAttribute('disabled')
      this.errors.textContent = ''
    }
  };
}
