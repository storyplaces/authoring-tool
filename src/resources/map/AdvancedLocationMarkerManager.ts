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
import {MapCore} from "../mapping/MapCore";
import {BindingEngine, Disposable, Factory, inject} from "aurelia-framework";
import {AuthoringStory} from "../models/AuthoringStory";
import {AuthoringAdvancedLocation} from "../models/AuthoringAdvancedLocation";
import {AdvancedLocationMarker} from "./markers/AdvancedLocationMarker";

@inject(MapCore, BindingEngine, Factory.of(AdvancedLocationMarker))
export class AdvancedLocationMarkerManager {

    private story: AuthoringStory;
    private advancedLocationMarkers: Array<AdvancedLocationMarker> = [];
    private advancedLocationsChangedSub: Disposable;
    private active: boolean;

    constructor(private mapCore: MapCore,
                private bindingEngine: BindingEngine,
                private advancedLocationMarkerFactory: (latitude: number, longitude: number, radius: number, popupText: string, active: boolean) => AdvancedLocationMarker) {
    }

    attach(story: AuthoringStory, active: boolean) {
        this.story = story;
        this.active = active || false;

        this.advancedLocationsChangedSub = this.bindingEngine.collectionObserver(this.story.advancedLocations.all).subscribe(shards => {
            this.advancedLocationsChanged(shards)
        });

        this.addMarkersForExistingLocations();
    }

    detach() {
        this.story = undefined;
        this.advancedLocationMarkers.forEach(marker => marker.destroy());
        this.advancedLocationMarkers = [];

        if (this.advancedLocationsChangedSub) {
            this.advancedLocationsChangedSub.dispose();
            this.advancedLocationsChangedSub = undefined;
        }
    }

    private makeAdvancedLocationMarkerPopupText(location: AuthoringAdvancedLocation) {
        return `<p><b>Advanced Location: ${location.name}</b></p>`;
    }

    private advancedLocationsChanged(shards) {
        shards.forEach(shard => {
            shard.removed.forEach((location: AuthoringAdvancedLocation) => {
                this.removeMarkerForAdvancedLocation(location);
            });

            if (shard.addedCount == 1) {
                let location = this.story.advancedLocations.all[shard.index];
                this.createMarkerForAdvancedLocation(location);
            }
        });
    }

    private createMarkerForAdvancedLocation(location: AuthoringAdvancedLocation): AdvancedLocationMarker {
        let marker: AdvancedLocationMarker;
        marker = this.advancedLocationMarkerFactory(location.lat || 0, location.long || 0, location.radius || 0, this.makeAdvancedLocationMarkerPopupText(location), this.active);
        marker.advancedLocationId = location.id;
        this.advancedLocationMarkers.push(marker);
        this.mapCore.addItem(marker);

        return marker
    }

    private removeMarkerForAdvancedLocation(location: AuthoringAdvancedLocation) {
        let markersToRemove = this.advancedLocationMarkers.filter(marker => marker.advancedLocationId == location.id);

        markersToRemove.forEach(marker => {
            this.mapCore.removeItem(marker);
            let index = this.advancedLocationMarkers.indexOf(marker);
            this.advancedLocationMarkers.splice(index, 1);
        });
    }

    private addMarkersForExistingLocations() {
        this.story.advancedLocations.forEach(location => {
            this.createMarkerForAdvancedLocation(location);
        });
    }
}