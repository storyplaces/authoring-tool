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

import {LocationInformation} from "./LocationInformation";
export enum GpsState {
    INITIALISING = 0,
    OK = 1,
    PERMISSION_DENIED = 2,
    POSITION_UNSUPPORTED = 3,
    ERROR = 4
}

export class Gps {
    public state: GpsState = GpsState.INITIALISING;
    public location: LocationInformation;

    private watchId: number;

    attach() {
        if (!navigator.geolocation) {
            this.state = GpsState.POSITION_UNSUPPORTED;
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position: Position) => {
                this.state = GpsState.OK;
                this.location = {latitude: position.coords.latitude, longitude: position.coords.longitude, heading: position.coords.heading, accuracy: position.coords.heading};
            },
            (failure: PositionError) => {
                this.state = (failure.code == failure.PERMISSION_DENIED) ? GpsState.PERMISSION_DENIED : GpsState.ERROR;
                this.location = undefined;
            },
            this.GPSOptions()
        );
    }

    detach() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    private GPSOptions(): PositionOptions {
        return {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 30000
        };
    }
}