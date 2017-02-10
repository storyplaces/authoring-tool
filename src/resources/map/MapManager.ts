/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) 2017
 University of Southampton
 Charlie Hargood, cah07r.ecs.soton.ac.uk
 Kevin Puplett, k.e.puplett.soton.ac.uk
 David Pepper, d.pepper.soton.ac.uk

 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * The name of the University of Southampton nor the name of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {inject, BindingEngine, NewInstance, Factory, Disposable} from "aurelia-framework";
import {CurrentLocationMarker} from "./markers/CurrentLocationMarker";
import {MapMapLayer} from "./layers/MapMapLayer";
import {MapCore} from "../mapping/MapCore";
import {LocationSource, LocationManager} from "../gps/LocationManager";
import {LocationInformation} from "../gps/LocationInformation";
import {RecenterControl} from "./controls/RecenterControl";
import {CurrentMapLocation} from "./CurrentMapLocation";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {RequestCurrentLocationEvent} from "../events/RequestCurrentLocationEvent";
import {LocationUpdateFromMapEvent} from "../events/LocationUpdateFromMapEvent";

@inject(
    BindingEngine,
    MapCore,
    MapMapLayer,
    LocationManager,
    CurrentMapLocation,
    NewInstance.of(CurrentLocationMarker),
    NewInstance.of(RecenterControl),
    EventAggregator,
    Factory.of(LocationUpdateFromMapEvent)
)
export class MapManager {

    private mapElement: HTMLElement;
    private locationSub: Disposable;

    private trackingGPSLocation: boolean = true;

    private eventSub: Subscription;

    constructor(private bindingEngine: BindingEngine,
                private mapCore: MapCore,
                private baseLayer: MapMapLayer,
                private location: LocationManager,
                private mapLocation: CurrentMapLocation,
                private currentLocationMarker: CurrentLocationMarker,
                private recenterControl: RecenterControl,
                private eventAggregator: EventAggregator,
                private locationUpdateFromMapEventFactory: (latitude: number, longitude: number) => LocationUpdateFromMapEvent) {
    }

    attach(mapElement: HTMLElement) {

        this.mapElement = mapElement;
        this.mapCore.attachTo(this.mapElement);
        this.mapCore.addItem(this.baseLayer);
        this.mapCore.addItem(this.currentLocationMarker);

        this.mapCore.addEvent('moveend', (event) => this.setLocationFromMapEvent(event));
        this.mapCore.addEvent('move', (event) => this.moveCurrentLocationMarkerFromMapEvent(event));

        this.mapCore.addEvent('dblclick', () => this.enableRecenterControl());
        this.mapCore.addEvent('dragstart', () => this.enableRecenterControl());
        this.mapCore.addEvent('zoomstart', () => this.enableRecenterControl());

        this.mapCore.addEvent('recenter-control-click', () => this.disableRecenterControl());

        this.mapCore.addControl(this.recenterControl).then(() => {
            this.recenterControl.disable();
        });

        this.locationSub = this.bindingEngine.propertyObserver(this.location, 'location').subscribe((location) => this.locationChanged(location));
        this.locationChanged(this.location.location);
        this.panTo(this.location.location);

        this.eventSub = this.eventAggregator.subscribe(RequestCurrentLocationEvent, () => {
            this.eventAggregator.publish(this.locationUpdateFromMapEventFactory(this.location.location.latitude, this.location.location.longitude));
        });
    }

    detach() {
        if (this.locationSub) {
            this.locationSub.dispose();
            this.locationSub = undefined;
        }

        if (this.eventSub) {
            this.eventSub.dispose();
            this.eventSub = undefined;
        }

        this.mapCore.removeControl(this.recenterControl);
        this.mapCore.removeItem(this.baseLayer);
        this.mapCore.removeItem(this.currentLocationMarker);

        this.mapCore.removeEvent('moveend');
        this.mapCore.removeEvent('move');

        this.mapCore.removeEvent('dblclick');
        this.mapCore.removeEvent('dragstart');
        this.mapCore.removeEvent('zoomstart');
        this.mapCore.removeEvent('recenter-control-click');

        this.mapCore.detach();
    }

    private locationChanged(newLocation: LocationInformation) {
        this.currentLocationMarker.location = newLocation;

        if (this.location.source == LocationSource.GPS && this.trackingGPSLocation) {
            this.panTo(newLocation);
        }
    }

    private panTo(location: LocationInformation) {
        this.mapCore.panTo({lat: location.latitude, lng: location.longitude})
    }

    private moveCurrentLocationMarkerFromMapEvent(event) {
        if (this.location.source == LocationSource.Map) {
            let newLocation = event.target.getCenter();
            this.currentLocationMarker.location = {
                latitude: newLocation.lat,
                longitude: newLocation.lng,
                accuracy: undefined,
                heading: undefined
            };
        }
    }

    private setLocationFromMapEvent(event) {
        let newLocation = event.target.getCenter();
        this.mapLocation.location = {
            latitude: newLocation.lat,
            longitude: newLocation.lng,
            accuracy: undefined,
            heading: undefined
        };

    }

    private disableRecenterControl() {
        this.trackingGPSLocation = true;
        this.locationChanged(this.location.location);
        this.recenterControl.disable();
    }

    private enableRecenterControl() {
        if (this.location.source == LocationSource.GPS) {
            this.trackingGPSLocation = false;
            this.recenterControl.enable();
        }
    }
}