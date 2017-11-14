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
import {bindable, BindingEngine, bindingMode, Factory, inject} from "aurelia-framework";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import "typeahead.js";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {RequestCurrentLocationEvent} from "../../resources/events/RequestCurrentLocationEvent";
import {RequestPinDropEvent} from "../../resources/events/RequestPinDropEvent";
import {StoryLookup} from "../../resources/utilities/StoryLookup";
import {CancelPinDropEvent} from "../../resources/events/CancelPinDropEvent";
import {ValidationControllerFactory} from "aurelia-validation";
import {BootstrapValidationRenderer} from "../validation-renderer/BootstrapValidationRenderer";
import {Identifiable} from "../../resources/interfaces/Identifiable";
import {HasName} from "../../resources/interfaces/HasName";
import {AuthoringAdvancedVariableCollection} from "../../resources/collections/AuthoringAdvancedVariableCollection";
import {AuthoringAdvancedVariable} from "../../resources/models/AuthoringAdvancedVariable";
import {DialogService} from "aurelia-dialog";
import {AuthoringAdvancedVariableEdit} from "../modals/authoring-advanced-variable-edit";
import {AuthoringAdvancedFunctionEdit} from "../modals/authoring-advanced-function-edit";
import {AuthoringAdvancedFunction} from "../../resources/models/AuthoringAdvancedFunction";
import {AuthoringAdvancedFunctionCollection} from "../../resources/collections/AuthoringAdvancedFunctionCollection";
import {AuthoringAdvancedConditionCollection} from "../../resources/collections/AuthoringAdvancedConditionCollection";
import {AuthoringAdvancedCondition} from "../../resources/models/AuthoringAdvancedCondition";
import {AuthoringAdvancedConditionEdit} from "../modals/authoring-advanced-condition-edit";
import {AuthoringAdvancedLocationEdit} from "../modals/authoring-advanced-location-edit";
import {AuthoringAdvancedLocationCollection} from "../../resources/collections/AuthoringAdvancedLocationCollection";
import {AuthoringAdvancedLocation} from "../../resources/models/AuthoringAdvancedLocation";
import {LocationUpdateFromMapEvent} from "../../resources/events/LocationUpdateFromMapEvent";

@inject(
    Factory.of(AuthoringAdvancedVariableCollection),
    Factory.of(AuthoringAdvancedVariable),
    Factory.of(AuthoringAdvancedFunctionCollection),
    Factory.of(AuthoringAdvancedFunction),
    Factory.of(AuthoringAdvancedConditionCollection),
    Factory.of(AuthoringAdvancedCondition),
    Factory.of(AuthoringAdvancedLocationCollection),
    Factory.of(AuthoringAdvancedLocation),
    DialogService,
    StoryLookup,
    EventAggregator,
    RequestCurrentLocationEvent,
    RequestPinDropEvent,
    CancelPinDropEvent,
    ValidationControllerFactory,
    Factory.of(BootstrapValidationRenderer),
    BindingEngine)
export class StoryAdvancedFormCustomElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;
    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable mapPane: HTMLDivElement;

    private variables: AuthoringAdvancedVariableCollection;
    private functions: AuthoringAdvancedFunctionCollection;
    private conditions: AuthoringAdvancedConditionCollection;
    private locations: AuthoringAdvancedLocationCollection;
    private eventSub: Subscription;
    private resolve: (value?: (PromiseLike<any> | any)) => void;
    private location: AuthoringAdvancedLocation;

    constructor(private variableCollectionFactory: () => AuthoringAdvancedVariableCollection,
                private variableFactory: () => AuthoringAdvancedVariable,
                private functionCollectionFactory: () => AuthoringAdvancedFunctionCollection,
                private functionFactory: () => AuthoringAdvancedFunction,
                private conditionCollectionFactory: () => AuthoringAdvancedConditionCollection,
                private conditionFactory: () => AuthoringAdvancedCondition,
                private locationCollectionFactory: () => AuthoringAdvancedLocationCollection,
                private locationFactory: () => AuthoringAdvancedLocation,
                private dialogService: DialogService,
                private storyLookup: StoryLookup,
                private eventAggregator: EventAggregator,
                private requestCurrentLocationEvent: RequestCurrentLocationEvent,
                private requestPinDropEvent: RequestPinDropEvent,
                private cancelPinDropEvent: CancelPinDropEvent) {

    }

    private keyListener = (evt) => {
        evt = evt || window.event;

        if ("key" in evt && (evt.key == "Escape" || evt.key == "Esc")) {
            this.resolveLocationUpdatePromise(null);
            return;
        }

        if (evt.keyCode == 27){
            this.resolveLocationUpdatePromise(null);
            return;
        }
    };

    private mouseListener = (evt: MouseEvent) => {
        if((evt as any).path.indexOf(this.mapPane) == -1) {
            this.resolveLocationUpdatePromise(null);
        }
    };

    attached() {
        this.dirty = false;
        this.variables = this.variableCollectionFactory();
        this.functions = this.functionCollectionFactory();
        this.conditions = this.conditionCollectionFactory();
        this.locations = this.locationCollectionFactory();
        window.addEventListener('keyup', this.keyListener);
        window.addEventListener('click', this.mouseListener);

        this.location = null;

        this.eventSub = this.eventAggregator.subscribe(LocationUpdateFromMapEvent, (event: LocationUpdateFromMapEvent) => {
            this.resolveLocationUpdatePromise(event);
        });
    }

    detached() {
        if (this.eventSub) {
            this.eventSub.dispose();
            this.eventSub = undefined;
        }

        window.removeEventListener('keyup', this.keyListener);
        window.removeEventListener('click', this.mouseListener);

    }

    private resolveLocationUpdatePromise(event?: LocationUpdateFromMapEvent) {
        if (!this.location || !this.resolve) {
            return;
        }

        if (event) {
            this.setLocationFromMapEvent(event, this.location);
        }

        let locationToReturn = this.location;
        let resolveToCall = this.resolve;

        this.location = null;
        this.resolve = null;

        this.eventAggregator.publish(this.cancelPinDropEvent);
        resolveToCall(locationToReturn);
    }

    /*** DIRTY ***/
    setDirty() {
        this.dirty = true;
    }

    createVariable(): Promise<Identifiable & HasName> {
        let newVariable = this.variableFactory();
        return this.editVariable(newVariable);
    }

    editVariable(variable: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedVariableEdit,
                model: {variable: variable},
                keyboard: 'Escape'
            })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return null;
                }

                return response.output;
            });
    }

    createFunction(): Promise<Identifiable & HasName> {
        let newFunc = this.functionFactory();
        return this.editFunction(newFunc);
    }

    editFunction(func: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedFunctionEdit,
                model: {func: func, variables: this.variables, functions: this.functions, conditions: this.conditions},
                keyboard: 'Escape'
            })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return null;
                }

                return response.output;
            });
    }

    createCondition(): Promise<Identifiable & HasName> {
        let newCondition = this.conditionFactory();
        return this.editCondition(newCondition)
    }

    editCondition(condition: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedConditionEdit,
                model: {condition: condition, variables: this.variables, functions: this.functions, conditions: this.conditions, locations: this.locations},
                keyboard: 'Escape'
            })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return null;
                }

                return response.output;
            });
    }

    createLocation(): Promise<Identifiable & HasName> {
        let newLocation = this.locationFactory();
        return this.editLocation(newLocation);
    }

    editLocation(location: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.openLocationDialog(location);
    }

    private openLocationDialog(location: Identifiable & HasName) {
        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedLocationEdit,
                model: {location: location},
                keyboard: 'Escape'
            })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return null;
                }

                if (response.output.status == "complete") {
                    return response.output.location;
                }

                return this.getMapLocation(location as AuthoringAdvancedLocation)
                    .then((location: AuthoringAdvancedLocation) => {
                        return this.openLocationDialog(location);
                    })
            });
    }

    private getMapLocation(location: AuthoringAdvancedLocation) {
        return new Promise(resolve => {
            this.location = location;
            this.resolve = resolve;

            this.eventAggregator.publish(this.requestPinDropEvent);
        });
    }

    private setLocationFromMapEvent(event: LocationUpdateFromMapEvent, location: AuthoringAdvancedLocation) {
        location.lat = event.latitude;
        location.long = event.longitude;

        if (!location.radius) {
            location.radius = 30;
        }
    }
}