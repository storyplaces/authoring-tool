import {bindable, bindingMode, computedFrom, inject} from "aurelia-framework";
import {EventMaker} from "../../../resources/EventMaker";

export interface ListPickerItem {
    id: string,
    name: string
};

@inject(EventMaker, Element)
export class ListPickerCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value: string;
    @bindable name: string;
    @bindable error: string;
    @bindable label: string;
    @bindable items: Array<ListPickerItem>;
    @bindable placeholder: string;
    private _element: Element;
    private _eventMaker: EventMaker;


    constructor(eventMaker: EventMaker, element: Element) {
        this._eventMaker = eventMaker;
        this._element = element;
    }

    @computedFrom('error')
    get hasError() {
        return this.error != undefined && this.error != null && this.error != "";
    }

    @computedFrom('placeholder')
    get hasPlaceholder() {
        return this.placeholder != undefined && this.placeholder != null && this.placeholder != "";
    }

    @computedFrom('placeholder')
    get placeholderSeparator() {
        return "-".repeat(this.placeholder.length);
    }

    changed() {
        this._eventMaker.fire('change', null, this._element)
    }
}