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
import {inject, Factory, NewInstance} from "aurelia-framework";
import {MapGroup} from "../../mapping/layers/MapGroup";
import {TriStateMarker} from "./TriStateMarker";
import {MapCircle} from "../../mapping/markers/MapCircle";
import {AuthoringChapter} from "../../models/AuthoringChapter";
import {ChapterMarker} from "./ChapterMarker";
import {AdvancedLocationMarkerPin} from "./AdvancedLocationMarkerPin";

@inject(Factory.of(MapCircle), Factory.of(AdvancedLocationMarkerPin))
export class AdvancedLocationMarker extends MapGroup {

    public advancedLocationId: string;

    private mainMarker: AdvancedLocationMarkerPin;
    private radiusCircle: MapCircle;

    private _latitude: number;
    private _longitude: number;
    private _radius: number;


    constructor(private circleFactory: (lat?, lon?, radius?) => MapCircle,
                private markerFactory: (lat?, lon?, text?) => AdvancedLocationMarkerPin,
                latitude: number, longitude: number, radius: number, popupText: string) {
        super();

        this._latitude = latitude;
        this._longitude = longitude;
        this._radius = radius;

        this.mainMarker = markerFactory(latitude, longitude, popupText);
        this.radiusCircle = circleFactory(latitude, longitude, radius);
        this.radiusCircle.fillColour="#a42bcb";
        this.radiusCircle.fillOpacity=0.4;
        this.radiusCircle.border="#5f1e7a";
        this.radiusCircle.borderOpacity=0.5;

        this.addItem(this.mainMarker);
        this.addItem(this.radiusCircle);
    }

    set latitude(latitude: number) {
        this._latitude = latitude;
        if (this.radiusCircle) {
            this.radiusCircle.latitude = latitude;
        }

        this.mainMarker.latitude = latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    get latitude(): number {
        return this._latitude;
    }

    set longitude(longitude: number) {
        this._longitude = longitude;
        if (this.radiusCircle) {
            this.radiusCircle.longitude = longitude;
        }

        this.mainMarker.longitude = longitude;
    }

    set radius(radius: number) {
        this._radius = radius;
        if (this.radiusCircle) {
            this.radiusCircle.radius = radius;
        }
    }

    public destroy() {
        if (this.radiusCircle) {
            this.radiusCircle.destroy();
        }

        this.mainMarker.destroy();
        super.destroy();
    }
}