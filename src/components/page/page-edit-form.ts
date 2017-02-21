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
import {bindable, inject, Factory, computedFrom} from "aurelia-framework";
import {AuthoringPage} from "../../resources/models/AuthoringPage";
import {AuthoringLocation} from "../../resources/models/AuthoringLocation";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import "typeahead.js";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {RequestCurrentLocationEvent} from "../../resources/events/RequestCurrentLocationEvent";
import {LocationUpdateFromMapEvent} from "../../resources/events/LocationUpdateFromMapEvent";
import {RequestPinDropEvent} from "../../resources/events/RequestPinDropEvent";
import {BindingSignaler} from "aurelia-templating-resources";
import {AuthoringChapter} from "../../resources/models/AuthoringChapter";
import {StoryLookup} from "../../resources/utilities/StoryLookup";
import {CancelPinDropEvent} from "../../resources/events/CancelPinDropEvent";


@inject(Factory.of(AuthoringLocation), StoryLookup, EventAggregator, RequestCurrentLocationEvent, RequestPinDropEvent, CancelPinDropEvent, BindingSignaler)
export class PageEditFormCustomElement {
    @bindable page: AuthoringPage;
    @bindable location: AuthoringLocation;
    @bindable story: AuthoringStory;

    private eventSub: Subscription;

    unlockedByAddField: string;
    unlockedByAddObject: AuthoringPage;
    unlockedByText: HTMLInputElement;
    private droppingPin: boolean;

    constructor(private locationFactory: () => AuthoringLocation,
                private storyLookup: StoryLookup,
                private eventAggregator: EventAggregator,
                private requestCurrentLocationEvent: RequestCurrentLocationEvent,
                private requestPinDropEvent: RequestPinDropEvent,
                private cancelPinDropEvent: CancelPinDropEvent,
                private bindingSignaler: BindingSignaler) {

    }

    attached() {
        this.eventSub = this.eventAggregator.subscribe(LocationUpdateFromMapEvent, (event: LocationUpdateFromMapEvent) => {
            console.log("setting event from form");

            this.location.lat = event.latitude;
            this.location.long = event.longitude;

            if (!this.location.radius) {
                this.location.radius = 30;
            }
            this.droppingPin = false;
        });

        $(this.unlockedByText).typeahead({
                hint: false,
                highlight: false,
                minLength: 1
            },
            {
                name: 'unlockedByPages',
                display: 'name',
                templates: {
                    empty: ['<div class="empty-message">',
                        'No pages matching your input.',
                        '</div>'].join('\n'),
                    suggestion: (value: AuthoringPage) => "<div><strong>" + value.name + "</strong> - " + value.pageHint + "</div>"
                },
                source: (query, cb) => {
                    let matches = [];
                    let substrRegex = new RegExp(query, 'i');

                    this.getAvailablePages().forEach((page) => {
                            if (substrRegex.test(page.name)) {
                                matches.push(page);
                            }
                        }
                    );
                    cb(matches);
                }
            }
        ).on('typeahead:selected',
            (e, value) => {
                this.unlockedByAddObject = value;
                this.addUnlockedBy();
            });
    }

    detached() {
        console.log("detaching form");
        if (this.eventSub) {
            this.eventSub.dispose();
            this.eventSub = undefined;
        }
    }

    removeLocation() {
        this.story.locations.remove(this.location.id);
        this.location = undefined;
    }

    addLocation() {
        this.location = this.locationFactory();
    }

    @computedFrom('page.unlockedByPageIds')
    get unlockedByPages(): Array < AuthoringPage > {
        let pages = [];
        this.page.unlockedByPageIds.forEach(pageId => {
            // Some validation to ensure the page is a valid page in the story
            if (this.storyLookup.pageIdsForStory(this.story.id).indexOf(pageId) != -1) {
                pages.push(this.story.pages.get(pageId));
            }
        });
        return pages;
    }

    getAvailablePages(): Array < AuthoringPage > {
        let matches = this.story.pages.all.filter((page) => {
            return (this.unlockedByPages.indexOf(page) == -1) && (page.id != this.page.id);
        });
        console.log("matches", matches);
        return matches;
    }

    @computedFrom('page.id')
    get pageChapters(): Array<AuthoringChapter> {
        return this.storyLookup.getChaptersForPageId(this.story.id, this.page.id);
    }

    addUnlockedBy() {
        this.page.unlockedByPageIds.push(this.unlockedByAddObject.id);
        this.unlockedByAddField = "";
        $(this.unlockedByText).typeahead("val", "");
        this.bindingSignaler.signal('unlockedByChanged');
    }

    useCurrentLocation() {
        this.eventAggregator.publish(this.requestCurrentLocationEvent);
    }

    dropPinOnMap() {
        if (this.droppingPin) {
            this.droppingPin = false;
            this.eventAggregator.publish(this.cancelPinDropEvent);
            return;
        }
        this.droppingPin = true;
        this.eventAggregator.publish(this.requestPinDropEvent);
    }
}