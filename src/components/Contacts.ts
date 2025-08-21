import { IOrderInfo } from "../types";
import { Form } from "./common/Form";

export class Contacts extends Form<IOrderInfo> {
  set email(value: string) {
    const input = this.container.elements.namedItem('email') as HTMLInputElement;
    input.value = value;
  }

  set phone(value: string) {
    const input = this.container.elements.namedItem('phone') as HTMLInputElement;
    input.value = value;
  }

}
