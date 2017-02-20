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
import {autoinject, BindingEngine, Disposable} from "aurelia-framework";
import {Gps, GpsState} from "./Gps";
import {LocationInformation} from "./LocationInformation";
import {CurrentMapLocation} from "../map/CurrentMapLocation";

export enum LocationSource {
    GPS = 1,
    Map = 2
}


@autoinject()
export class LocationManager {

    ok: boolean = false;
    gpsPermissionDenied: boolean = false;
    gpsUnavailable: boolean = false;
    gpsUnsupported: boolean = false;

    gpsStateSub: Disposable;
    gpsPositionSub: Disposable;
    mapPositionSub: Disposable;

    location: LocationInformation = {latitude: 50.935659, longitude: -1.396098, heading: 0, accuracy: 0};
    source: LocationSource = LocationSource.GPS;

    constructor(private gps: Gps, private currentMapLocation: CurrentMapLocation, private bindingEngine: BindingEngine) {
        this.switchToGPS();
    }

    switchToGPS() {
        this.switchLocationSourceToGPS();
    }

    switchToMap() {
        this.switchLocationSourceToMap();
    }

    private switchLocationSourceToMap() {
        this.detachGpsListeners();
        this.source = LocationSource.Map;
        this.ok = true;
        this.disableGPS();

        this.attachMapListeners();

        this.updatePosition(this.currentMapLocation.location);
    }

    private switchLocationSourceToGPS() {
        this.detachMapListeners();
        this.source = LocationSource.GPS;

        this.initialiseGPS();
        this.attachGpsListeners();
        this.updatePosition(this.gps.location);
    }

    private attachMapListeners() {
        if (!this.mapPositionSub) {
            this.mapPositionSub = this.bindingEngine.propertyObserver(this.currentMapLocation, 'location')
                .subscribe((newPosition: LocationInformation) => {
                    this.updatePosition(newPosition)
                });
        }
    }

    private detachMapListeners() {
        if (this.mapPositionSub) {
            this.mapPositionSub.dispose();
            this.mapPositionSub = undefined;
        }
    }

    private attachGpsListeners() {
        if (!this.gpsStateSub) {
            this.gpsStateSub = this.bindingEngine.propertyObserver(this.gps, 'state')
                .subscribe((newState: GpsState) => {
                    this.updateStateFromGps(newState);
                });
        }

        if (!this.gpsPositionSub) {
            this.gpsPositionSub = this.bindingEngine.propertyObserver(this.gps, 'location')
                .subscribe((newPosition: LocationInformation) => {
                    this.updatePosition(newPosition)
                });
        }
    }

    private detachGpsListeners() {
        if (this.gpsStateSub) {
            this.gpsStateSub.dispose();
            this.gpsStateSub = undefined;
        }
        if (this.gpsPositionSub) {
            this.gpsPositionSub.dispose();
            this.gpsPositionSub = undefined;
        }
    }

    private initialiseGPS() {
        this.gps.attach();

        this.updateStateFromGps(this.gps.state);
    }

    private disableGPS() {
        this.gpsPermissionDenied = false;
        this.gpsUnavailable = false;
        this.gpsUnsupported = false;

        this.gps.detach();
    }

    private updateStateFromGps(newState: GpsState) {
        if (this.source == LocationSource.GPS) {
            this.ok = (newState == GpsState.INITIALISING || newState == GpsState.OK);
            this.gpsPermissionDenied = (newState == GpsState.PERMISSION_DENIED);
            this.gpsUnavailable = (newState == GpsState.ERROR);
            this.gpsUnsupported = (newState == GpsState.POSITION_UNSUPPORTED);
        }
    }

    private updatePosition(newPosition: LocationInformation) {
        if (this.ok && newPosition) {
            this.location = newPosition;
        }
    }
}