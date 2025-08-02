import { cloneTemplate, createElement } from '../utils/utils';
import { IEvents } from './base/events';
import { BasketItemView, EventTypes, IBasketItem, IBasketView } from '../types';
import { Modal } from './modals';
import { Basket } from './base/BasketModel';
import { OrderInfoForm } from './orderForm';

class BasketItem extends BasketItemView {
  constructor({
    template,
    item,
    events,
    index,
  }: {
    template: string;
    item: IBasketItem;
    events: IEvents;
    index: number;
  }) {
    super({ type: 'basket', template, item, events });
    this.element = this.prepareTemplate({ item, template, events });
    this.element.querySelector('.basket__item-index').textContent = index.toString();
  }

  prepareTemplate = ({
    template,
    item,
    events,
  }: {
    template: string;
    item: IBasketItem;
    events: IEvents;
  }) => {
    const cardBasket = cloneTemplate<HTMLButtonElement>(template);
    cardBasket.querySelector('.basket__item-index').textContent = item.id;
    cardBasket.querySelector('.card__title').textContent = item.title;
    cardBasket.querySelector(
      '.card__price'
    ).textContent = `${item.price} синапсов`;

    cardBasket.querySelector('.card__button').addEventListener('click',
      () => events.emit(EventTypes.REMOVE_FROM_BASKET, { id: item.id })
    );

    return cardBasket;
  };
}

export class BasketView implements IBasketView {
  element: HTMLDivElement;
  listElement: HTMLUListElement;
  priceElement: HTMLSpanElement;
  basket: Basket;
  events: IEvents;

  constructor(events: IEvents, basket: Basket) {
    this.basket = basket;
    this.element = cloneTemplate<HTMLDivElement>('#basket');
    this.listElement = this.element.querySelector('.basket__list');
    this.events = events;

    const basketButton = document.querySelector('.header__basket') as HTMLButtonElement
    const basketCounter = basketButton.querySelector('.header__basket-counter') as HTMLSpanElement

    events.on<Map<string, IBasketItem>>(EventTypes.BASKET_UPDATE,
      (items) => {
        basketCounter.textContent = items.size.toString()
        this.element.querySelector(
          '.basket__price'
        ).textContent = `${this.basket.getTotalPrice()} синапсов`;
      }
    )
    events.on<IBasketItem>(EventTypes.ADD_TO_BASKET, (item) => this.addItem(item));
    events.on<Pick<IBasketItem, 'id'>>(EventTypes.REMOVE_FROM_BASKET,
      ({ id }) => this.removeItem(id)
    )

    const basketModal = new Modal(this.element, events);
    basketButton.addEventListener('click', () => basketModal.openModal())

    const orderButton = this.element.querySelector('.basket__button');
    orderButton.addEventListener('click', () => this.onConfirm());

    this.renderList()
  }

  getTotalPrice() {
    return this.basket.getTotalPrice()
  }

  renderList() {
    const basketList = this.element.querySelector(
      '.basket__list'
    ) as HTMLImageElement;
    const orderButton = this.element.querySelector(
      '.basket__button'
    ) as HTMLButtonElement;

    basketList.replaceChildren()

    if (this.basket.items.size === 0) {
      const emptyText = createElement('span')
      emptyText.textContent = 'Корзина пуста'
      emptyText.style.opacity = '0.3'
      emptyText.style.fontSize = '30px'

      basketList.appendChild(emptyText)
      orderButton.setAttribute('disabled', '');


    } else {
      orderButton.removeAttribute('disabled');
      let index = 1;
      this.basket.items.forEach((item) => {

        const basketItem = new BasketItem({
          item: item,
          template: '#card-basket',
          events: this.events,
          index,
        }).element;
        basketList.appendChild(basketItem)
        index++
      })
    }

  }

  addItem(item: IBasketItem) {
    this.basket.addItem(item);
    this.renderList()
  }

  onConfirm() {
    const orderInfoForm = new OrderInfoForm(this.events)
    orderInfoForm.render()
  }

  removeItem(id: string) {
    this.basket.removeItem(id);
    this.renderList()
  }

  clear() {
    this.basket.clear();
    this.renderList()
  }
}

