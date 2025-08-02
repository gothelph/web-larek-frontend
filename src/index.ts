import { getProducts } from './components/api';
import { EventEmitter } from './components/base/events';
import { createProductCard } from './components/productCard';
import './scss/styles.scss';
import { IProductItem } from './types';

// const cardCatalogTemplate = document.getElementById(
// 	'card-catalog'
// ) as HTMLTemplateElement;
// const cardPreviewTemplate = document.getElementById(
// 	'card-preview'
// ) as HTMLTemplateElement;
// const cardBasketTemplate = document.getElementById(
// 	'card-basket'
// ) as HTMLTemplateElement;
// const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
// const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
// const contactsTemplate = document.getElementById(
// 	'contacts'
// ) as HTMLTemplateElement;

const eventEmitter = new EventEmitter();

function renderGallery(products: IProductItem[]) {
	const gallery = document.querySelector('.gallery');

	products.forEach((product) => {
		const productCard = createProductCard(product, eventEmitter);

		gallery.appendChild(productCard);
	});
}

getProducts().then((products) => renderGallery(products));
