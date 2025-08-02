import {
  BasketItemView,
  DetailProductView,
  EventTypes,
  IBasketItem,
  IProductItem,
  ProductView,
} from '../types';
import { CDN_URL } from '../utils/constants';
import { bem, cloneTemplate, setElementData } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './modals';

function getImageUrl(img: string) {
  return `${CDN_URL}${img}`;
}

export function createProductCard(product: IProductItem, events: IEvents) {
  const cardCatalog = new CardCatalog({
    template: '#card-catalog',
    item: product,
    events: events,
  });

  const detailCardProduct = createDetailCardProduct(product, events);

  const productModal = new Modal(detailCardProduct, events);

  events.on<Pick<IProductItem, 'id'>>(EventTypes.OPEN_PRODUCT_MODAL,
    ({ id }) => id === product.id && productModal.openModal()
  );

  return cardCatalog.element;
}

export function createDetailCardProduct(
  product: IProductItem,
  events: IEvents
) {
  const detailProduct = new DetailProduct({
    item: product,
    template: '#card-preview',
    events
  });
  return detailProduct.element;
}

class CardCatalog extends ProductView {
  constructor({
    template,
    item,
    events
  }: {
    template: string;
    item: IProductItem;
    events: IEvents
  }) {
    super({ type: 'catalog', template, item, events });
    this.element = this.prepareTemplate({ item, template, events });
  }

  prepareTemplate = ({
    template,
    item,
    events
  }: {
    template: string;
    item: IProductItem;
    events: IEvents
  }) => {
    const cardCatalog = cloneTemplate<HTMLButtonElement>(template);
    cardCatalog.classList.add('card__column')
    cardCatalog.querySelector('.card__title').textContent = item.title;

    const category = cardCatalog.querySelector('.card__category')
    const modifier = categoryToModifier[item.category];
    category.classList.add(bem('card', 'category', modifier).name)
    category.textContent = item.category;

    const productImg = cardCatalog.querySelector(
      '.card__image'
    ) as HTMLImageElement;
    productImg.src = getImageUrl(item.image);
    productImg.alt = item.title;

    cardCatalog.querySelector(
      '.card__price'
    ).textContent = item.price ? `${item.price} синапсов` : 'Бесценно';

    cardCatalog.addEventListener('click',
      () => events.emit(EventTypes.OPEN_PRODUCT_MODAL, { id: item.id })
    );

    return cardCatalog;
  };
}

class DetailProduct extends DetailProductView {
  constructor({
    template,
    item,
    events
  }: {
    template: string;
    item: IProductItem;
    events: IEvents;
  }) {
    super({ type: 'preview', template, item, events });
    this.element = this.prepareTemplate({ item, template, events });
  }

  prepareTemplate = ({
    template,
    item,
    events
  }: {
    template: string;
    item: IProductItem;
    events?: IEvents;
  }) => {
    const cardPreview = cloneTemplate<HTMLButtonElement>(template);
    cardPreview.querySelector('.card__title').textContent = item.title;
    cardPreview.querySelector('.card__text').textContent = item.description;

    const category = cardPreview.querySelector('.card__category')
    const modifier = categoryToModifier[item.category]
    category.classList.add(bem('card', 'category', modifier).name)
    category.textContent = item.category;


    const previewImg = cardPreview.querySelector(
      '.card__image'
    ) as HTMLImageElement;
    previewImg.src = getImageUrl(item.image);
    previewImg.alt = item.title;

    cardPreview.querySelector(
      '.card__price'
    ).textContent = item.price ? `${item.price} синапсов` : 'Бесценно';

    const button = cardPreview.querySelector('.card__button')

    function addToBasketHandler() {
      events.emit(EventTypes.ADD_TO_BASKET, item)
    }

    function removeFromBasketHandler() {
      events.emit(EventTypes.REMOVE_FROM_BASKET, item)
    }

    if (item.price) {
      button.removeAttribute('disabled')
      button.textContent = 'Купить'
      button.addEventListener('click', addToBasketHandler);
    } else {
      button.setAttribute('disabled', '')
      button.textContent = 'Недоступно'
    }

    events.on<Map<string, IBasketItem>>(EventTypes.BASKET_UPDATE, (items) => {
      if (!item.price) return

      if (items.has(item.id)) {
        button.textContent = 'Удалить из корзины'
        button.removeEventListener('click', addToBasketHandler)
        button.addEventListener('click', removeFromBasketHandler);
      } else {
        button.textContent = 'Купить'
        button.removeEventListener('click', removeFromBasketHandler);
        button.addEventListener('click', addToBasketHandler)
      }
    })

    return cardPreview;
  };
}


const categoryToModifier: Record<string, string> = {
  'дополнительное': 'additional',
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'кнопка': 'button',
  'другое': 'other'
}
