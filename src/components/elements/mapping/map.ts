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
import {MapManager} from "../../../resources/map/MapManager";
import {inject, bindable, BindingEngine} from "aurelia-framework";
import {MarkerManager} from "../../../resources/map/MarkerManager";
import {AuthoringStory} from "../../../resources/models/AuthoringStory";
import {AuthoringPage} from "../../../resources/models/AuthoringPage";
import {AuthoringLocation} from "../../../resources/models/AuthoringLocation";

@inject(
    MapManager,
    MarkerManager,
    BindingEngine
)
export class MapCustomElement {
    mapElement: HTMLElement;

    @bindable story: AuthoringStory;
    @bindable currentPage: AuthoringPage;
    @bindable currentLocation: AuthoringLocation;
    @bindable activePageIds: Array<string>;

    constructor(private mapManager: MapManager, private markerManager: MarkerManager, private bindingEngine: BindingEngine) {
    }


    attached() {
        this.mapManager.attach(this.mapElement);
        this.markerManager.attach(this.story, this.currentPage, this.currentLocation, this.activePageIds);

        this.bindingEngine.propertyObserver(this, 'currentLocation').subscribe(newLocation => { this.markerManager.selectedLocation = newLocation});
        this.bindingEngine.propertyObserver(this, 'activePageIds').subscribe(newPageIds => {this.markerManager.activePageIds = newPageIds});
    }


    detached() {
        this.markerManager.detach();
        this.mapManager.detach()
    }
}