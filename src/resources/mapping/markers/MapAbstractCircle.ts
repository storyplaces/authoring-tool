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
import {MapLayerInterface} from "../interfaces/MapLayerInterface";
import Circle = L.Circle;
import CircleMarker = L.CircleMarker;
import Layer = L.Layer;

export abstract class MapAbstractCircle implements MapLayerInterface {

    protected marker: Circle | CircleMarker;

    get leafletLayer(): Layer {
        return this.marker;
    };

    get latitude(): number {
        return this.marker.getLatLng().lat;
    }

    set latitude(latitude: number) {
        this.marker.setLatLng({lat: latitude, lng: this.longitude});
    }

    get longitude(): number {
        return this.marker.getLatLng().lng;
    }

    set longitude(longitude: number) {
        this.marker.setLatLng({lat: this.latitude, lng: longitude});
    }

    get radius(): number {
        return this.marker.getRadius();
    }

    set radius(value: number) {
        this.marker.setRadius(value);
    }

    set fillColour(colour: string) {
        this.marker.setStyle({fillColor: colour});
    }

    set fillOpacity(opacity: number) {
        this.marker.setStyle({opacity: opacity});
    }

    destroy() {
        this.marker.remove();
    }
}