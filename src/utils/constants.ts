import { Settings } from '../types/constants';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings: Settings = {
  modalElement: '#modal-container',
  modalSettings: {
    close: '.modal__close',
    content: '.modal__content',
    activeClass: 'modal_active',
  },

  pageSettings: {
    basketCounter: '.header__basket-counter',
    basketButton: '.header__basket',
    wrapper: '.page__wrapper',
    gallery: '.gallery',
    lockClass: 'page__wrapper_locked',
  },

  cardSettings: {
    catalogTemplate: '#card-catalog',
    previewTemplate: '#card-preview',
    basketTemplate: '#card-basket',
    selectors: {
      category: '.card__category',
      title: '.card__title',
      image: '.card__image',
      price: '.card__price',
      description: '.card__description',
      button: '.card__button',
      alignClass: 'card__column',
    },
  },

  basketTemplate: '#basket',
  basketSettings: {
    container: '.basket__list',
    totalPrice: '.basket__price',
    checkoutButton: '.basket__button',
  },

  orderTemplate: '#order',
  orderSettings: {
    payment: {
      online:'.button_alt[name="card"]',
      cash:'.button_alt[name="cash"]',
      classActive: 'button_alt-active',
    },
  },

  contactsTemplate: '#contacts',

  formSettings: {
    errorContainer: '.form__errors',
    submitButton: 'button[type="submit"]',
  },

  successTemplate: '#success',
  successSettings: {
    description: '.order-success__description',
    closeButton: '.order-success__close',
  },
};
