import { clientApi } from './components/api';
import { Basket } from './components/base/BasketModel';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/basket';
import { createProductCard } from './components/productCard';
import './scss/styles.scss';
import { IProductItem } from './types';

const eventEmitter = new EventEmitter();
const basket = new Basket(eventEmitter);
new BasketView(eventEmitter, basket);

function renderGallery(products: IProductItem[]) {
	const gallery = document.querySelector('.gallery');
	products.forEach((product) => {
		const productCard = createProductCard(product, eventEmitter);
		gallery.appendChild(productCard);
	});
}

clientApi.getProductList().then((products) => renderGallery(products));
