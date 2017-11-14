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
import {AuthoringAdvancedVariableCollection} from "../../resources/collections/AuthoringAdvancedVariableCollection";
import {AuthoringAdvancedFunctionCollection} from "../../resources/collections/AuthoringAdvancedFunctionCollection";
import {AuthoringAdvancedConditionCollection} from "../../resources/collections/AuthoringAdvancedConditionCollection";
import {AuthoringAdvancedCondition} from "../../resources/models/AuthoringAdvancedCondition";
import {AuthoringAdvancedLocationCollection} from "../../resources/collections/AuthoringAdvancedLocationCollection";

@inject(DialogController)

export class AuthoringAdvancedConditionEdit {

    private condition: AuthoringAdvancedCondition;
    private errors;

    private nameElement: HTMLInputElement;
    private variables: AuthoringAdvancedVariableCollection;
    private conditions: AuthoringAdvancedConditionCollection;
    private errorCount: number;
    private functions: AuthoringAdvancedFunctionCollection;
    private locations: AuthoringAdvancedLocationCollection;

    constructor(private dialogController: DialogController) {
        this.dialogController.settings.centerHorizontalOnly = true;
    }

    get availableTypes() {
        return AuthoringAdvancedCondition.allowedTypes;
    }

    get availableVariableTypes() {
        return AuthoringAdvancedCondition.allowedVariableTypes;
    }

    get availableComparisonOperands() {
        return AuthoringAdvancedCondition.allowedComparisonOperands;
    }

    get availableLogicalOperands() {
        return AuthoringAdvancedCondition.allowedLogicalOperands;
    }

    @computedFrom('variables.all')
    get availableVariables() {
        return this.variables.all;
    }

    @computedFrom('locations.all')
    get availableLocations() {
        return this.locations.all
    }

    @computedFrom('functions.all')
    get availableFunctions() {
        return this.functions.all
            .map(func => {
                return {
                    id: func.id,
                    name: func.name,
                    suggestion: `<div>${func.name}</div>`,
                    search: func.name
                };
            });
    }

    @computedFrom('conditions.all')
    get availableConditions() {
        return this.conditions.all
            .filter(conditionToTest => conditionToTest.id != this.condition.id)
            .map(condition => {
                return {
                    id: condition.id,
                    name: condition.name,
                    suggestion: `<div>${condition.name}</div>`,
                    search: condition.name
                };
            });
    }

    activate(model: {
        condition: AuthoringAdvancedCondition,
        variables: AuthoringAdvancedVariableCollection,
        conditions: AuthoringAdvancedConditionCollection,
        functions: AuthoringAdvancedFunctionCollection,
        locations: AuthoringAdvancedLocationCollection
    }) {
        this.condition = model.condition;
        this.variables = model.variables;
        this.conditions = model.conditions;
        this.functions = model.functions;
        this.locations = model.locations;
    }

    attached() {
        //this.nameElement.focus();
        this.clearErrors();
    }

    submit() {
        this.checkForErrors();

        if (this.errorCount != 0) {
            return;
        }

        return this.dialogController.ok(this.condition);
    }

    private aTypeChanged() {
        this.condition.variableA = "";
        this.errors.variableA = undefined;
    }

    private bTypeChanged() {
        this.condition.variableB = "";
        this.errors.variableB = undefined;
    }

    private checkForErrors() {
        this.clearErrors();

        if (!this.condition.name || this.condition.name == "") {
            this.errorCount++;
            this.errors.name = "Please enter a name for the function";
        }

        if (this.condition.type == undefined || this.condition.type == null || this.condition.type == "") {
            this.errorCount++;
            this.errors.type = "Please select a valid type";
        }

        switch (this.condition.type) {
            case 'comparison':
                this.checkForComparisonErrors();
                return;
            case 'check':
                this.checkForCheckErrors();
                return;
            case 'location':
                this.checkForLocationErrors();
                return;
            case 'logical':
                this.checkForLogicalErrors();
                return;
            case 'timepassed':
                this.checkForTimePassedErrors();
                return;
            case 'timerange':
                this.checkForTimeRangeErrors();
                return;
        }
    }

    private clearErrors() {
        this.errorCount = 0;
        this.errors = {};
    }

    private checkForTimeRangeErrors() {
        this.checkVariableSupplied();
        this.checkForTimeRangeStartErrors();
        this.checkForTimeRangeEndErrors();
    }

    private checkForTimeRangeEndErrors() {
        if (this.condition.end == undefined || this.condition.end == null) {
            this.errorCount++;
            this.errors.end = "End time required in HH:MM format";
            return;
        }

        if (!this.isValidTimeString(this.condition.end)) {
            this.errorCount++;
            this.errors.end = "End time is not a valid time";
        }
    }

    private checkForTimeRangeStartErrors() {
        if (this.condition.start == undefined || this.condition.start == null) {
            this.errorCount++;
            this.errors.start = "Start time required in HH:MM format";
            return
        }

        if (!this.isValidTimeString(this.condition.start)) {
            this.errorCount++;
            this.errors.start = "Start time is not a valid time";
        }
    }

    private isValidTimeString(time: string): boolean {
        let parts = time.split(":");

        if (parts.length != 2) {
            return false;
        }

        if (parseInt(parts[0]) < 0 || parseInt(parts[0]) >= 24) {
            return false;
        }

        if (parseInt(parts[1]) < 0 || parseInt(parts[1]) > 60) {
            return false;
        }

        return true;
    }

    private checkForTimePassedErrors() {
        this.checkVariableSupplied();

        if (this.condition.minutes == undefined || this.condition.minutes == null) {
            this.errorCount++;
            this.errors.minutes = "Please supply the number of minutes";
        }

        if (this.condition.minutes < 0) {
            this.errorCount++;
            this.errors.minutes = "Only positive numbers of minutes are permitted";
        }

    }

    private checkForLogicalErrors() {
        if (this.condition.operand == undefined || this.condition.operand == null || this.condition.operand == "") {
            this.errorCount++;
            this.errors.operand = "Please select a valid operand";
        }
    }

    private checkForLocationErrors() {
        if (this.condition.locationId == undefined || this.condition.locationId == null || this.condition.locationId == "") {
            this.errorCount++;
            this.errors.locationId = "Please select a location";
        }
    }

    private checkForCheckErrors() {
        this.checkVariableSupplied();
    }

    private checkForComparisonErrors() {
        if (this.condition.operand == undefined || this.condition.operand == null || this.condition.operand == "") {
            this.errorCount++;
            this.errors.operand = "Please select a valid operand";
        }

        if (this.condition.variableAType == undefined || this.condition.variableAType == null || this.condition.variableAType == "") {
            this.errorCount++;
            this.errors.variableAType = "Please select a valid type";
        }

        if (this.condition.variableBType == undefined || this.condition.variableBType == null || this.condition.variableBType == "") {
            this.errorCount++;
            this.errors.variableBType = "Please select a valid type";
        }

        if (this.condition.variableAType == 'Integer' && !this.isValidInteger(this.condition.variableA)) {
            this.errorCount++;
            this.errors.variableA = "Please enter an integer";
        }

        if (this.condition.variableBType == 'Integer' && !this.isValidInteger(this.condition.variableB)) {
            this.errorCount++;
            this.errors.variableB = "Please enter an integer";
        }

        if (!this.condition.variableA || this.condition.variableA == "") {
            this.errorCount++;
            this.errors.variableA = "Please select a variable";
        }

        if (!this.condition.variableB || this.condition.variableB == "") {
            this.errorCount++;
            this.errors.variableB = "Please select a variable";
        }

    }

    private isValidInteger(value: string) {
        if (value == undefined) {
            return false;
        }

        if (value == null) {
            return false;
        }

        if (value == "") {
            return false;
        }

        if (value.match(/^-?[0-9]+$/) == null) {
            return false;
        }

        return true;
    }

    private checkVariableSupplied() {
        if (!this.condition.variableId || this.condition.variableId == "") {
            this.errorCount++;
            this.errors.variableId = "Please select a variable";
        }
    }
}