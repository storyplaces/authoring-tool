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
import {EventAggregator} from "aurelia-event-aggregator";
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

@inject(
    Factory.of(AuthoringAdvancedVariableCollection),
    Factory.of(AuthoringAdvancedVariable),
    Factory.of(AuthoringAdvancedFunctionCollection),
    Factory.of(AuthoringAdvancedFunction),
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

    private variables: AuthoringAdvancedVariableCollection;
    private functions: AuthoringAdvancedFunctionCollection;

    constructor(private variableCollectionFactory: () => AuthoringAdvancedVariableCollection,
                private variableFactory: () => AuthoringAdvancedVariable,
                private functionCollectionFactory: () => AuthoringAdvancedFunctionCollection,
                private functionFactory: () => AuthoringAdvancedFunction,
                private dialogService: DialogService,
                private storyLookup: StoryLookup,
                private eventAggregator: EventAggregator,
                private requestCurrentLocationEvent: RequestCurrentLocationEvent,
                private requestPinDropEvent: RequestPinDropEvent,
                private cancelPinDropEvent: CancelPinDropEvent,
                private controllerFactory: ValidationControllerFactory,
                private validationRendererFactory: () => BootstrapValidationRenderer,
                private bindingEngine: BindingEngine) {

    }

    attached() {
        this.dirty = false;
        this.variables = this.variableCollectionFactory();
        this.functions = this.functionCollectionFactory();
        console.log(this.variableFactory);
    }

    /*** DIRTY ***/
    setDirty() {
        this.dirty = true;
    }

    createVariable(): Promise<Identifiable & HasName> {
        let newVariable = this.variableFactory();

        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedVariableEdit,
                model: newVariable
            }).whenClosed(response => {
                if (!response.wasCancelled) {
                    return response.output;
                }
                return null;
            });
    }

    editVariable(variable: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.dialogService
            .open({
                viewModel: AuthoringAdvancedVariableEdit,
                model: variable
            }).whenClosed(response => {
                if (!response.wasCancelled) {
                    return response.output;
                }
                return null;
            });
    }

    createFunction(): Promise<Identifiable & HasName> {
        let newFunc = this.functionFactory();

        return this.dialogService
            .open({viewModel: AuthoringAdvancedFunctionEdit, model: {func: newFunc, variables: this.variables, functions: this.functions}})
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    return response.output;
                }
                return null;
            });
    }

    editFunction(func: Identifiable & HasName): Promise<Identifiable & HasName> {
        return this.dialogService
            .open({viewModel: AuthoringAdvancedFunctionEdit, model: {func: func, variables: this.variables, functions: this.functions}})
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    return response.output;
                }
                return null;
            });
    }

}