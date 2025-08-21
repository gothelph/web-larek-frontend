import { IEvents } from "./events";

export class Component<T> {
	protected container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	toggleClass(className: string) {
		this.container.classList.toggle(className);
	}

	get element(): HTMLElement {
		return this.container;
	}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: T): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

export class View<T> extends Component<T> {
  constructor(protected readonly events: IEvents, container: HTMLElement) {
    super(container);
  }
}
