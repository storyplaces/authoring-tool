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
import {inject, Factory, BindingEngine, Disposable} from "aurelia-framework";
import {AuthoringStory} from "../models/AuthoringStory";
import {AuthoringLocation} from "../models/AuthoringLocation";
import {AuthoringPage} from "../models/AuthoringPage";
import {AuthoringLocationMarker} from "./markers/AuthoringLocationMarker";
import {AuthoringChapter} from "../models/AuthoringChapter";
import {EventAggregator} from "aurelia-event-aggregator";
import {RequestPinDropEvent} from "../events/RequestPinDropEvent";
import {LocationUpdateFromMapEvent} from "../events/LocationUpdateFromMapEvent";


@inject(MapCore, BindingEngine, EventAggregator, Factory.of(LocationUpdateFromMapEvent), Factory.of(AuthoringLocationMarker))
export class MarkerManager {

    private story: AuthoringStory;
    private selectedPage: AuthoringPage;
    private _selectedLocation: AuthoringLocation;
    private markers: Array<AuthoringLocationMarker> = [];
    private _activePageIds: Array<string>;

    private selectedPageMarker: AuthoringLocationMarker;

    private selectedLocationLatSub: Disposable;
    private selectedLocationLongSub: Disposable;
    private selectedLocationRadiusSub: Disposable;

    constructor(private mapCore: MapCore,
                private bindingEngine: BindingEngine,
                private eventAggregator: EventAggregator,
                private locationUpdateFromMapEventFactory: (latitude: number, longitude: number) => LocationUpdateFromMapEvent,
                private authLocMarkerFactory: (latitude: number, longitude: number, active: boolean, selected: boolean, radius: number, popupText: string, chapters: Array<AuthoringChapter>, unlockedBy: boolean) => AuthoringLocationMarker) {
    }

    attach(story: AuthoringStory, selectedPage: AuthoringPage, selectedLocation: AuthoringLocation, activePageIds: Array<string>) {
        this.story = story;
        this.selectedPage = selectedPage || {} as any;
        console.log(activePageIds);
        this._activePageIds = activePageIds || [];
        this.initMarkersForUnSelectedPages();
        this.selectedLocation = selectedLocation;

        this.eventAggregator.subscribe(RequestPinDropEvent, () => {
            this.eventAggregator.publish(this.locationUpdateFromMapEventFactory(1,2));
        });
    }

    detach() {
        this.story = undefined;
        this._selectedLocation = undefined;
        this.selectedPage = undefined;
        this.markers.forEach(marker => marker.destroy());
        this.markers = [];
        this.destroySelectedLocationListeners();
    }


    private getLocation(page: AuthoringPage): AuthoringLocation {
        if (page.id == this.selectedPage.id) {
            return this._selectedLocation;
        }
        return this.story.locations.get(page.locationId);
    }

    private initMarkersForUnSelectedPages() {
        this.story.pages.forEach(page => {
            if (!this.pageIsSelected(page)) {
                this.createMarkerForPage(page, this.pageIsActive(page), false);
            }
        });
    }

    set activePageIds(newActivePageIds) {
        this._activePageIds = newActivePageIds || [];

        this.markers.forEach(marker => {
            marker.active = this._activePageIds.indexOf(marker.pageId) != -1;
        });
    }

    set selectedLocation(newLocation) {
        console.log("setting location");

        if (newLocation) {
            this._selectedLocation = newLocation;
            this.initSelectedLocationListeners();
            this.selectedPageMarker = this.createMarkerForPage(this.selectedPage, false, true);
            return
        }

        this.destroySelectedLocationListeners();
        if (this.selectedPageMarker) {
            this.mapCore.removeItem(this.selectedPageMarker);
            this.destroySelectedLocationListeners();
        }
    }

    private initSelectedLocationListeners() {
        this.selectedLocationLatSub = this.bindingEngine.propertyObserver(this._selectedLocation, 'lat').subscribe(newLat => {
            this.selectedPageMarker.latitude = newLat || 0
        });
        this.selectedLocationLongSub = this.bindingEngine.propertyObserver(this._selectedLocation, 'long').subscribe(newLong => {
            this.selectedPageMarker.longitude = newLong || 0
        });
        this.selectedLocationRadiusSub = this.bindingEngine.propertyObserver(this._selectedLocation, 'radius').subscribe(newRadius => {
            this.selectedPageMarker.radius = newRadius || 0
        });
    }

    private destroySelectedLocationListeners() {
        if (this.selectedLocationLatSub) {
            this.selectedLocationLatSub.dispose();
        }
        if (this.selectedLocationLongSub) {
            this.selectedLocationLongSub.dispose();
        }
        if (this.selectedLocationRadiusSub) {
            this.selectedLocationRadiusSub.dispose();
        }
    }

    private pageIsActive(page: AuthoringPage) {
        return this._activePageIds.indexOf(page.id) != -1;
    }

    private pageIsSelected(page: AuthoringPage) {
        return page.id == this.selectedPage.id;
    }

    private createMarkerForPage(page: AuthoringPage, active: boolean, selected: boolean): AuthoringLocationMarker {
        let location = this.getLocation(page);
        let marker: AuthoringLocationMarker;

        if (location instanceof AuthoringLocation) {
            let chapters = this.getChaptersForPage(page);

            marker = this.authLocMarkerFactory(location.lat || 0, location.long || 0, active, selected, location.radius || 0, this.makeMarkerPopupText(page), chapters, true);
            marker.pageId = page.id;
            this.markers.push(marker);
            this.mapCore.addItem(marker);
        }

        console.log(page, marker);
        return marker
    }

    private getChaptersForPage(page: AuthoringPage): Array<AuthoringChapter> {
        let chapters: Array<AuthoringChapter> = [];

        this.story.chapters.forEach(chapter => {
            if (chapter.pageIds.indexOf(page.id) != -1) {
                chapters.push(chapter);
            }
        });

        return chapters;
    }

    private makeMarkerPopupText(page: AuthoringPage) {
        return `<p><b>${page.name}</b></p>${page.pageHint}`;
    }
}