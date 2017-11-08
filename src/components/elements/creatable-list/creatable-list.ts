/*
 * ------------
 * StoryPlaces
 * ------------
 * This application was developed as part of the Leverhulme Trust funded
 * StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 * Copyright (c) 2017 University of Southampton
 *
 * David Millard, dem.soton.ac.uk
 * Andy Day, a.r.day.soton.ac.uk
 * Kevin Puplett, k.e.puplett.soton.ac.uk
 * Charlie Hargood, chargood.bournemouth.ac.uk
 * David Pepper, d.pepper.soton.ac.uk
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 * - The name of the University of Southampton nor the name of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {bindable, bindingMode, inject, computedFrom} from "aurelia-framework";
import {HasName} from "../../../resources/interfaces/HasName";
import {Identifiable} from "../../../resources/interfaces/Identifiable";
import {BaseCollection} from "../../../resources/collections/BaseCollection";
import {JSONable} from "../../../resources/interfaces/JSONable";

@inject(Element)
export class CreatableListCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) items: BaseCollection<Identifiable & HasName & JSONable>;
    @bindable createItem: () => Promise<HasName & Identifiable>;
    @bindable editItem: (any) => Promise<HasName & Identifiable>;
    @bindable itemType: string;

    constructor(private element: Element) {
    }

    edit(event: CustomEvent) {
        event.stopPropagation();
        let item = this.items.getClone(event.detail.id);

        this.editItem({item:item}).then(item => {
            if (!item) {
                return;
            }

            this.items.save(item);
            this.fireEvent('changed');
            this.fireEvent('created', {id: item.id})
        });
    }

    remove(event: CustomEvent) {
        event.stopPropagation();
        let itemId = event.detail.id;
        this.items.remove(itemId);
        this.fireEvent('changed');
        this.fireEvent('deleted', {id: itemId});

    }

    create() {
        this.createItem().then(item => {
            if (!item) {
                return;
            }

            this.items.save(item);
            this.fireEvent('changed');
            this.fireEvent('created', {id: item.id})
        });
    }

    private fireEvent(event: string, detail?: any) {
        if (detail == undefined) {
            detail = null;
        }

        this.element.dispatchEvent(this.makeEvent(event, detail));
    }

    private makeEvent(type: string, detail: any) {
        if ((window as any).CustomEvent) {
            return new CustomEvent(type, {bubbles: true, detail: detail});
        }

        let customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(type, true, true, {'detail': detail});
        return customEvent;
    }
}