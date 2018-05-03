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
 *    notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * - The name of the University of Southampton nor the name of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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

import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {AuthoringAdvancedLocation} from "../../resources/models/AuthoringAdvancedLocation";
import {RequestCurrentLocationEvent} from "../../resources/events/RequestCurrentLocationEvent";
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {LocationUpdateFromMapEvent} from "../../resources/events/LocationUpdateFromMapEvent";

@inject(DialogController,
    EventAggregator,
    RequestCurrentLocationEvent
)

export class AuthoringAdvancedLocationEdit {

    private location: AuthoringAdvancedLocation;
    private errors;
    private errorCount: number;
    private dialogController: DialogController;
    private eventAggregator: EventAggregator;
    private requestCurrentLocationEvent: RequestCurrentLocationEvent;
    private eventSub: Subscription;

    constructor(dialogController: DialogController,
                eventAggregator: EventAggregator,
                requestCurrentLocationEvent: RequestCurrentLocationEvent) {
        this.dialogController = dialogController;
        this.eventAggregator = eventAggregator;
        this.requestCurrentLocationEvent = requestCurrentLocationEvent;
        this.dialogController.settings.centerHorizontalOnly = true;
    }

    activate(model: { location: AuthoringAdvancedLocation }) {
        this.location = model.location;
    }

    attached() {
        this.eventSub = this.eventAggregator.subscribe(LocationUpdateFromMapEvent, (event: LocationUpdateFromMapEvent) => {
            this.setLocationFromMapEvent(event);
        });
    }

    detached() {
        if (this.eventSub) {
            this.eventSub.dispose();
            this.eventSub = undefined;
        }
    }

    submit() {
        this.clearErrors();
        this.checkForErrors();

        if (this.errorCount != 0) {
            return;
        }

        return this.dialogController.ok({status: "complete", location: this.location});
    }

    dropPinOnMap() {
        return this.dialogController.ok({status: "dropPin", location: this.location});
    }

    useCurrentLocation() {
        this.eventAggregator.publish(this.requestCurrentLocationEvent);
    }

    private setLocationFromMapEvent(event: LocationUpdateFromMapEvent) {
        this.location.lat = event.latitude;
        this.location.long = event.longitude;

        if (!this.location.radius) {
            this.location.radius = 30;
        }
    }


    private clearErrors() {
        this.errors = {};
        this.errorCount = 0;
    }

    private checkForErrors() {
        if (!this.location.name || this.location.name == "") {
            this.errors.name = "Please enter a name for the location";
            this.errorCount++;
        }

        if (!this.location.lat || this.location.lat < -90 || this.location.lat > 90) {
            this.errors.latitude = "Please enter a valid latitude";
            this.errorCount++;
        }

        if (!this.location.long || this.location.long < -180 || this.location.long > 180) {
            this.errors.longitude = "Please enter a valid longitude";
            this.errorCount++;
        }

        if (!this.location.radius || this.location.radius < 0 || this.location.radius > 2000) {
            this.errors.radius = "Please enter a valid radius";
            this.errorCount++;
        }
    }
}