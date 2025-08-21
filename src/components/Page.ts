import { eventNames } from "../types";
import { settings } from "../utils/constants";
import { IEvents } from "./base/events";
import { IMainPageView } from "../types";

export class Page implements IMainPageView {
  private container: HTMLElement;
  private events: IEvents;
  private _basketCounter: HTMLSpanElement;
  private _gallery: HTMLDivElement;
  private _page: HTMLDivElement;

  constructor( events: IEvents, container: HTMLElement,) {
    this.container = container;
    this.events = events;

    const { basketCounter, basketButton, wrapper, gallery } = settings.pageSettings;

    this._basketCounter = this.container.querySelector(basketCounter) as HTMLSpanElement;
    this._gallery = this.container.querySelector(gallery) as HTMLDivElement;
    this._page = this.container.querySelector(wrapper) as HTMLDivElement;

    this.container.querySelector(basketButton).addEventListener('click', () => {
      this.events.emit(eventNames.basket.open)
    })
  }

  set catalog(elements: HTMLElement[]) {
    this._gallery.replaceChildren(...elements);
  }

  set counter(value: number) {
    this._basketCounter.textContent = value.toString();
  }

  set locked(value: boolean) {
    this._page.classList.toggle(settings.pageSettings.lockClass, value);
  }
}
