export interface ProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string; 
    price: number;
}

export interface BasketItem {
    id: string;
    title: string;
    price: number;
}

export interface BasketModel{
    getTotalPrice(): number;
    addItem(item: BasketItem): void;
    removeItem(id: string): void;
    clear(): void;
    items: Map<string, BasketItem>;
}

export interface OrderInfo {
    paymentMethod: 'online' | 'whenReceiving'
    address: string
    email: string
    telephone: string
    total: number
    items: string[]
}


export interface ApiError {
    error: string
}

export interface ClientApi {
    getProductList(): Promise<{total: number; items: ProductItem[]}>

    getProductItem(id: string): Promise<ProductItem | ApiError>

    processOrder(order: OrderInfo): Promise<{id: string; total: number} | ApiError>
}

// Интерфейсы отображения

// Карточка товара
export interface ProductView extends ProductItem {
    onClick: (id: string) => void;
}

export interface DetailProductView extends ProductItem {
    onAddToBasket: (id: string) => void;
}

// Отображение элемента корзины
export interface BasketItemView extends BasketItem {
    onRemove: (id: string) => void;
}

// Отображение корзины
export interface BasketView extends BasketModel {
    onConfirm: () => void
}

// Список карточек
export interface ProductListView {
    products: ProductItem[];
}

export interface ModalView {
    openModal: (modal: HTMLDivElement) => void
    closeModal: (modal: HTMLDivElement) => void
}

export interface OrderInfoFormView extends Pick<OrderInfo, 'paymentMethod' | "address"> {
    onNextClick: () => void
    onCancel: () => void
}

export interface OrderInfoContactsFormView extends Pick<OrderInfo, 'email' | "telephone"> {
    onCancel: () => void
    onSubmit: () => void
}

export type SuccessView = Pick<OrderInfo, 'total'>;


// Валидация

export interface ValidatorSettings {
    formSelector: string,
    inputSelector: string,
    submitButtonSelector: string,
    inactiveButtonClass:string,
    inputErrorClass: string,
    errorClass: string
}

export interface Validator {
    settings: ValidatorSettings
    enableValidation: () => void
    clearValidation: (form: HTMLFormElement) => void
}