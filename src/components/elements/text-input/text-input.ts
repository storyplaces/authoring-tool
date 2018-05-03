import {bindable, bindingMode, computedFrom, inject} from "aurelia-framework";
import {EventMaker} from "../.../../../../resources/EventMaker";

@inject(EventMaker, Element)
export class TextInputCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value: string;
    @bindable name: string;
    @bindable error: string;
    @bindable focusOn: string;
    @bindable label: string;
    @bindable placeholder: string;
    private _element: Element;
    private _eventMaker: EventMaker;

    private inputElement: HTMLInputElement;

    constructor(eventMaker: EventMaker, element: Element) {
        this._eventMaker = eventMaker;
        this._element = element;
    }

    @computedFrom('error')
    get hasError() {
        return this.error != undefined && this.error != null && this.error != "";
    }

    @computedFrom('placeholder')
    get placeholderText() {
        return this.placeholder == undefined || this.placeholder == null ? "" : this.placeholder;
    }

    attached() {
        if (this.focusOn !== undefined) {
            this.inputElement.focus();
        }
    }

    changed() {
        this._eventMaker.fire('change', null, this._element)
    }
}