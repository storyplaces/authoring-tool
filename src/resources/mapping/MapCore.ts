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
import {MapLayerInterface} from "./interfaces/MapLayerInterface";
import {MapDefaults} from "./settings/MapDefaults";
import {inject} from "aurelia-framework";
import {MapControlInterface} from "./interfaces/MapControlInterface";

import Map = L.Map;

import LatLngLiteral = L.LatLngLiteral;
import LatLng = L.LatLng;
import EventHandlerFn = L.EventHandlerFn;

@inject(MapDefaults)

export class MapCore {

    private mapReady: Promise<Map>;

    constructor(private mapDefaults: MapDefaults) {

    }

    attachTo(mapElement: HTMLElement) {
        this.mapReady = new Promise<any>(
            (resolve) => {
                L.map(mapElement, this.mapDefaults).whenReady(resolve);
            }
        ).then(map => map.target);
    }

    detach() {
        this.mapReady.then(
            map => {
                map.remove();
                this.mapReady = undefined;
            }
        );
    }

    addItem(layer: MapLayerInterface) {
        this.mapReady.then(
            map => {
                map.addLayer(layer.leafletLayer);
            }
        );
    }

    removeItem(layer: MapLayerInterface) {
        this.mapReady.then(
            map => {
                map.removeLayer(layer.leafletLayer);
            }
        );
    }

    hasItem(layer: MapLayerInterface): Promise<boolean> {
        return this.mapReady.then(
            map => {
                return map.hasLayer(layer.leafletLayer);
            }
        )
    }

    setLocation(latLng: LatLngLiteral) {
        this.mapReady.then(
            map => {
                map.setView(latLng, map.getZoom());
            }
        );
    }

    panTo(latLng: LatLngLiteral) {
        this.mapReady.then(
            map => {
                map.panTo(latLng, map.getZoom());
            }
        );
    }

    getLocation(): Promise<LatLng> {
        return this.mapReady.then(map => {
            return map.getCenter()
        });
    }

    addEvent(eventName: string, callback: EventHandlerFn): Promise<void> {
        return this.mapReady.then(map => {
            map.on(eventName, callback);
        });
    }

    removeEvent(eventName: string): Promise<void> {
        return this.mapReady.then(map => {
            map.off(eventName);
        });
    }

    removeAllEvents(): Promise<void> {
        return this.mapReady.then(map => {
            map.off();
        });
    }

    addControl(control: MapControlInterface): Promise<void> {
        return this.mapReady.then(map => {
            map.addControl(control.leafletControl);
        });
    }

    removeControl(control: MapControlInterface): Promise<void> {
        return this.mapReady.then(map => {
            map.removeControl(control.leafletControl);
        });
    }

}