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

import {computedFrom, inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {AuthoringAdvancedFunction} from "../../resources/models/AuthoringAdvancedFunction";
import {AuthoringAdvancedVariableCollection} from "../../resources/collections/AuthoringAdvancedVariableCollection";
import {AuthoringAdvancedFunctionCollection} from "../../resources/collections/AuthoringAdvancedFunctionCollection";

@inject(DialogController)

export class AuthoringAdvancedFunctionEdit {

    private func: AuthoringAdvancedFunction;
    private errors;

    private nameElement: HTMLInputElement;
    private variables: AuthoringAdvancedVariableCollection;
    private conditions: Array<any>;
    private errorCount: number;
    private functions: AuthoringAdvancedFunctionCollection;

    constructor(private dialogController: DialogController) {
        this.dialogController.settings.centerHorizontalOnly = true;
    }

    get availableTypes() {
        return AuthoringAdvancedFunction.allowedTypes;
    }

    @computedFrom('variables.all')
    get availableVariables() {
        return this.variables.all;
    }

    @computedFrom('functions.all')
    get availableFunctions() {
        return this.functions.all
            .filter(funcToTest => funcToTest.id != this.func.id)
            .map(func => {
                return {
                    id: func.id,
                    name: func.name,
                    suggestion: `<div>${func.name}</div>`,
                    search: func.name};
            });
    }

    get availableConditions() {
        return [];
    }

    activate(model: {
        func: AuthoringAdvancedFunction,
        variables: AuthoringAdvancedVariableCollection,
        conditions: null,
        functions: AuthoringAdvancedFunctionCollection
    }) {
        this.func = model.func;
        this.variables = model.variables;
        this.conditions = model.conditions;
        this.functions = model.functions;
    }

    attached() {
        this.nameElement.focus();
        this.clearErrors();
    }

    submit() {
        this.checkForErrors();

        if (this.errorCount != 0) {
            return;
        }

        return this.dialogController.ok(this.func);
    }

    private checkForErrors() {
        this.clearErrors();

        if (!this.func.name || this.func.name == "") {
            this.errorCount++;
            this.errors.name = "Please enter a name for the function";
        }
    }

    private clearErrors() {
        this.errorCount = 0;
        this.errors = {};
    }
}