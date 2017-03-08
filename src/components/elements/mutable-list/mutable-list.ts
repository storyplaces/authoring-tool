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
import {inject, bindable, bindingMode} from "aurelia-framework";
import {MutableListAvailableItem} from "../../../resources/interfaces/MutableListAvailableItem";

@inject(Element)
export class MutableListCustomElement {
    @bindable availableItems: Array<MutableListAvailableItem>;
    @bindable placeholder: string;
    @bindable({defaultBindingMode: bindingMode.twoWay}) selectedItems: Array<string>;

    private lookup: HTMLInputElement;
    private itemsToDisplay: Array<MutableListAvailableItem>;
    private itemsToSearch: Array<MutableListAvailableItem>;

    constructor(private element: Element) {
    }

    selectedItemsChanged() {
        this.recalculateLists();
    }

    availableItemsChanged() {
        this.recalculateLists();
    }

    recalculateLists() {
        this.itemsToDisplay = (this.availableItems || []).filter(item => (this.selectedItems || []).indexOf(item.id) !== -1);
        this.itemsToSearch = (this.availableItems || []).filter(item => (this.selectedItems || []).indexOf(item.id) == -1);
    }

    deleteItem(event: CustomEvent) {
        event.stopPropagation();
        let itemId = event.detail.itemId;

        let index = this.selectedItems.indexOf(itemId);

        if (index !== -1) {
            this.selectedItems.splice(index, 1);
            this.recalculateLists();
            this.changed();
        }
    }

    addItem(itemId: string) {
        if (!this.availableItems.some(item => item.id == itemId)) {
            throw new Error("Bad item added to list");
        }

        let index = this.selectedItems.indexOf(itemId);

        if (index == -1) {
            this.selectedItems.push(itemId);
            this.recalculateLists();
            this.changed();
        }
    }

    attached() {
        this.setupTypeAhead();
    }

    setupTypeAhead() {
        ($(this.lookup as any) as any).typeahead({
                hint: false,
                highlight: false,
                minLength: 1
            },
            {
                name: 'typeAhead',
                display: 'name',
                templates: {
                    empty: '<div class="tt-no-suggestion"><strong>Sorry, there are no matches</strong></div>',
                    suggestion: (item: MutableListAvailableItem) => item.suggestion
                },
                source: (query, cb) => {
                    let substrRegex = new RegExp(query, 'i');
                    cb(this.itemsToSearch.filter(item => substrRegex.test(item.search)));
                }
            }
        ).on('typeahead:selected',
            (e, value: MutableListAvailableItem) => {
                this.addItem(value.id);
                ($(e.target) as any).typeahead("val", "");
            });
    }

    changed() {
        this.element.dispatchEvent(this.makeChangeEvent());
    }

    private makeChangeEvent() {
        if ((window as any).CustomEvent) {
            return new CustomEvent('change', {bubbles: true});
        }

        let deleteEvent = document.createEvent('CustomEvent');
        deleteEvent.initCustomEvent('change', true, true, {});
        return deleteEvent;
    }
}