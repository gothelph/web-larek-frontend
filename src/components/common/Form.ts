import { eventNames } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/Component";
import { IEvents } from "../base/events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends View<IFormState> {
  _submit: HTMLButtonElement;
  _errors: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(events, container);

    this._submit = ensureElement<HTMLButtonElement>(settings.formSettings.submitButton, this.container);
    this._errors = ensureElement<HTMLElement>(settings.formSettings.errorContainer, this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(eventNames[this.container.name as 'contacts' | 'order'].submit);
    });

  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  onInputChange(field: keyof T, value: string) {
    this.events.emit(eventNames[this.container.name as 'contacts' | 'order'].change, { field, value });
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this as object, inputs);
    return this.container;
  }
}
