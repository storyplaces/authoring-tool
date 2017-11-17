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
import {bindable, inject, Factory, bindingMode, BindingEngine, Disposable, computedFrom} from "aurelia-framework";
import {AuthoringPage} from "../../resources/models/AuthoringPage";
import {AuthoringLocation} from "../../resources/models/AuthoringLocation";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import "typeahead.js";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {RequestCurrentLocationEvent} from "../../resources/events/RequestCurrentLocationEvent";
import {LocationUpdateFromMapEvent} from "../../resources/events/LocationUpdateFromMapEvent";
import {RequestPinDropEvent} from "../../resources/events/RequestPinDropEvent";
import {AuthoringChapter} from "../../resources/models/AuthoringChapter";
import {StoryLookup} from "../../resources/utilities/StoryLookup";
import {CancelPinDropEvent} from "../../resources/events/CancelPinDropEvent";
import {ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger} from "aurelia-validation";
import {BootstrapValidationRenderer} from "../validation-renderer/BootstrapValidationRenderer";
import {MutableListAvailableItem} from "../../resources/interfaces/MutableListAvailableItem";
import {ChapterMembershipChangedEvent} from "../../resources/events/ChapterMembershipChangedEvent";
import {AuthoringAdvancedFunction} from "../../resources/models/AuthoringAdvancedFunction";
import {AuthoringAdvancedCondition} from "../../resources/models/AuthoringAdvancedCondition";
import {StoryJsonConnector} from "../../resources/store/StoryJsonConnector";
import {StoryComponentCreator} from "../../resources/utilities/StoryComponentCreator";

@inject(
    Factory.of(AuthoringLocation),
    StoryLookup, EventAggregator,
    RequestCurrentLocationEvent,
    RequestPinDropEvent,
    CancelPinDropEvent,
    ValidationControllerFactory,
    Factory.of(BootstrapValidationRenderer),
    BindingEngine,
    Factory.of(ChapterMembershipChangedEvent),
    StoryComponentCreator)
export class PageEditFormCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) page: AuthoringPage;
    @bindable({defaultBindingMode: bindingMode.twoWay}) location: AuthoringLocation;
    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;

    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay}) valid: boolean;
    @bindable advanced: boolean;

    private errorSub: Disposable;
    private eventSub: Subscription;

    private droppingPin: boolean;
    private validationController: ValidationController;
    private rules;

    private availablePages: Array<MutableListAvailableItem>;
    private availableChapters: Array<MutableListAvailableItem>;
    private memberOfChapters: Array<string> = [];
    private memberOfChaptersSub: Disposable;

    private imageLibraryVisible:boolean = false;

    /*** LIFECYCLE ***/

    constructor(private locationFactory: () => AuthoringLocation,
                private storyLookup: StoryLookup,
                private eventAggregator: EventAggregator,
                private requestCurrentLocationEvent: RequestCurrentLocationEvent,
                private requestPinDropEvent: RequestPinDropEvent,
                private cancelPinDropEvent: CancelPinDropEvent,
                private controllerFactory: ValidationControllerFactory,
                private validationRendererFactory: () => BootstrapValidationRenderer,
                private bindingEngine: BindingEngine,
                private chapterMembershipChangedEventFactory: (pageId: string) => ChapterMembershipChangedEvent,
                private storyComponentCreator: StoryComponentCreator) {
        this.setupValidation();
    }

    attached() {
        this.dirty = false;
        this.validationController.validate().then(() => {
            this.calculateIfValid();
        });

        this.makeMemberOfChapters();
        this.makeAvailablePages();
        this.makeAvailableChapters();
        this.setupSubscriptions();
    }

    private setupSubscriptions() {
        this.eventSub = this.eventAggregator.subscribe(LocationUpdateFromMapEvent, (event: LocationUpdateFromMapEvent) => {
            this.setLocationFromMapEvent(event);
        });

        this.memberOfChaptersSub = this.bindingEngine.collectionObserver(this.memberOfChapters).subscribe(splices => {
            this.memberOfChaptersChanged(splices);
        });
    }

    detached() {
        if (this.eventSub) {
            this.eventSub.dispose();
            this.eventSub = undefined;
        }

        if (this.errorSub) {
            this.errorSub.dispose();
            this.errorSub = undefined;
        }

        if (this.memberOfChaptersSub) {
            this.memberOfChaptersSub.dispose();
            this.memberOfChaptersSub = undefined;
        }
    }

    @computedFrom('story.advancedConditions')
    get availableAdvancedConditions() {
        return this.story.advancedConditions.all.concat(this.storyComponentCreator.makeStoryConditions(this.story) as any)
            .map((condition: AuthoringAdvancedCondition): MutableListAvailableItem => {
                return {
                    id: condition.id,
                    name: condition.name,
                    suggestion: `<div><strong>${condition.name}</strong></div>`,
                    search: condition.name
                };
            });
    }

    @computedFrom('story.advancedFunctions')
    get availableAdvancedFunctions() {
        return this.story.advancedFunctions.all
            .map((func: AuthoringAdvancedFunction): MutableListAvailableItem => {
            return {
                id: func.id,
                name: func.name,
                suggestion: `<div><strong>${func.name}</strong></div>`,
                search: func.name
            };
        });
    }

    /*** VALIDATION ***/

    private setupValidation() {
        this.rules = this.validationRules();

        this.validationController = this.controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(this.validationRendererFactory());
        this.validationController.validateTrigger = validateTrigger.changeOrBlur;
        this.valid = true;

        this.errorSub = this.bindingEngine.collectionObserver(this.validationController.errors).subscribe(() => {
            this.calculateIfValid();
        });
    }

    private calculateIfValid() {
        this.valid = (this.validationController.errors.length == 0);
    }

    private validationRules() {
        return ValidationRules
            .ensure((page: AuthoringPage) => page.name).displayName("Page Name").required().maxLength(255)
            // .ensure((page: AuthoringPage) => page.content).displayName("Page Content").required()
            .ensure((page: AuthoringPage) => page.pageHint).displayName("Hint Text").maxLength(255)
            .ensure((location: AuthoringLocation) => location.lat).displayName("Latitude").required().satisfies(value => value == undefined || (parseFloat(value) >= -90 && parseFloat(value) <= 90)).withMessage(`\${$displayName} must be between -90 and 90 inclusive`)
            .ensure((location: AuthoringLocation) => location.long).displayName("Longitude").required().satisfies(value => value == undefined || (parseFloat(value) >= -180 && parseFloat(value) <= 180)).withMessage(`\${$displayName} must be between -180 and 180 inclusive`)
            .ensure((location: AuthoringLocation) => location.radius).displayName("Radius").required().satisfies(value => value == undefined || (parseFloat(value) >= 0 && parseFloat(value) <= 100000)).withMessage(`\${$displayName} must be between 0 and 100000 inclusive`)
            .rules;
    }

    /*** LOCATIONS ***/

    removeLocation() {
        this.story.locations.remove(this.location.id);
        this.location = undefined;
        this.setDirty();
    }

    addLocation() {
        this.location = this.locationFactory();
        this.dropPinOnMap();
        this.setDirty();
        this.validationController.validate();
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

    private setLocationFromMapEvent(event: LocationUpdateFromMapEvent) {
        this.location.lat = event.latitude;
        this.location.long = event.longitude;

        if (!this.location.radius) {
            this.location.radius = 30;
        }
        this.droppingPin = false;
        this.setDirty();
    }

    /*** UNLOCKED BY / CHAPTERS ***/
    private makeAvailablePages() {
        this.availablePages = this.story.pages.all.filter(page => page.id != this.page.id)
            .map((page: AuthoringPage): MutableListAvailableItem => {
                return {
                    id: page.id,
                    name: page.name,
                    suggestion: `<div><strong>${page.name}</strong> - ${page.pageHint}</div>`,
                    search: `${page.name} ${page.pageHint}`
                };
            });
    }

    private makeAvailableChapters() {
        this.availableChapters = this.story.chapters.all
            .map((chapter: AuthoringChapter): MutableListAvailableItem => {
                return {
                    id: chapter.id,
                    name: chapter.name,
                    suggestion: `<div><strong>${chapter.name}</strong></div>`,
                    search: chapter.name
                };
            })
    }

    private makeMemberOfChapters() {
        this.memberOfChapters = this.storyLookup.getChaptersForPageId(this.story, this.page.id).map(page => page.id);
    }

    private memberOfChaptersChanged(splices) {
        this.setDirty();
        splices.forEach((splice) => {
            if (splice.addedCount == 1) {
                let chapterId = this.memberOfChapters[splice.index];
                this.storyLookup.addPageIdToChapterId(this.story, this.page.id, chapterId);
                this.eventAggregator.publish(this.chapterMembershipChangedEventFactory(this.page.id));
            }

            splice.removed.forEach(removedChapterId => {
                this.storyLookup.removePageIdFromChapterId(this.story, this.page.id, removedChapterId);
                this.eventAggregator.publish(this.chapterMembershipChangedEventFactory(this.page.id));
            });
        });
    }

    set unlockedOperator(value: boolean) {
        this.page.unlockedByPagesOperator = value ? "and" : "or";
    }

    @computedFrom('page.unlockedByPagesOperator')
    get unlockedOperator(): boolean {
        return this.page.unlockedByPagesOperator == "and";
    }

    /*** DIRTY ***/
    setDirty() {
        this.dirty = true;
    }

    private imagePicked() {
        this.imageLibraryVisible = false;
    }

    private showImageLibrary() {
        this.imageLibraryVisible = !this.imageLibraryVisible;
    }

    private imageFailed() {
        this.page.imageId = "";
    }
}