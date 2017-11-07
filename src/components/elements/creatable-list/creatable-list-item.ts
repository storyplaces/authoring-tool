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
import {containerless, bindable, inject} from "aurelia-framework";
import {MutableListAvailableItem} from "../../../resources/interfaces/MutableListAvailableItem";
import {Identifiable} from "../../../resources/interfaces/Identifiable";
import {HasName} from "../../../resources/interfaces/HasName";

@containerless
@inject(Element)
export class CreatableListItem {
    @bindable item: Identifiable & HasName;
    @bindable deleteCallback: Function;

    constructor(private element: Element) {
    }

    edit() {
        this.fireEvent('edit', {'id': this.item.id});
    }

    remove() {
        this.fireEvent('remove', {'id': this.item.id});
    }

    fireEvent(event: string, detail?: any) {
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