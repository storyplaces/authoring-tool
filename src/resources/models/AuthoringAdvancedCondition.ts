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
import {inject} from "aurelia-framework";
import {BaseModel} from "./BaseModel";
import {TypeChecker} from "../utilities/TypeChecker";
import {HasName} from "../interfaces/HasName";

@inject(TypeChecker)
export class AuthoringAdvancedCondition extends BaseModel implements HasName {
    static allowedTypes: Array<{ internal: string, display: string }> =
        [
            {internal: 'comparison', display: 'ComparisonCondition'},
            {internal: 'check', display: 'CheckCondition'},
            {internal: 'location', display: 'LocationCondition'},
            {internal: 'logical', display: 'LogicalCondition'},
            {internal: 'timepassed', display: 'TimePassedCondition'},
            {internal: 'timerange', display: 'TimeRangeCondition'},

        ];
    static allowedLogicalOperands: Array<{ internal: string, display: string }> =
        [
            {internal: 'AND', display: 'and'},
            {internal: 'OR', display: 'or'},
        ];
    static allowedVariableTypes: Array<{ internal: string, display: string }> =
        [
            {internal: 'Integer', display: 'Integer'},
            {internal: 'String', display: 'String'},
            {internal: 'Variable', display: 'Variable'},
        ];
    static allowedComparisonOperands: Array<{ internal: string, display: string }> =
        [
            {internal: '==', display: 'equals'},
            {internal: '!=', display: 'not equal to'},
            {internal: '<', display: 'less than'},
            {internal: '>', display: 'greater than'},
            {internal: '<=', display: 'less than or equal to'},
            {internal: '>=', display: 'greater than or equal to'},
        ];
    private _name: string; // for all
    private _variableId: string; // for check and time passed
    private _type: string; // for all
    private _start: string; // for time range
    private _end: string; // for time range
    private _minutes: number; //for time passed
    private _operand: string; // for logical and comparison
    private _conditionIds: Array<string>; // for logical
    private _locationId: string; // for location
    private _variableA: string; // for comparison
    private _variableB: string; // for comparison
    private _variableAType: string; // for comparison
    private _variableBType: string; // for comparison

    constructor(typeChecker: TypeChecker, data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    get variableBType(): string {
        return this._variableBType;
    }

    set variableBType(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Variable B Type", value);

        if (value != undefined && AuthoringAdvancedCondition.allowedVariableTypes.findIndex(item => item.internal == value) == -1) {
            throw new Error("Unsupported variable type");
        }

        this._variableBType = value;
    }

    get variableAType(): string {
        return this._variableAType;
    }

    set variableAType(value: string) {

        this.typeChecker.validateAsStringOrUndefined("Variable A Type", value);

        if (value != undefined && AuthoringAdvancedCondition.allowedVariableTypes.findIndex(item => item.internal == value) == -1) {
            throw new Error("Unsupported variable type");
        }

        this._variableAType = value;
    }

    get variableB(): string {
        return this._variableB;
    }

    set variableB(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Variable B", value);

        this._variableB = value;
    }

    get variableA(): string {
        return this._variableA;
    }

    set variableA(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Variable A", value);
        this._variableA = value;
    }

    get locationId(): string {
        return this._locationId;
    }

    set locationId(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Location Id", value);

        this._locationId = value;
    }

    get conditionIds(): Array<string> {
        return this._conditionIds;
    }

    set conditionIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Condition Ids", value, "string");
        this._conditionIds = value;
    }

    get operand(): string {
        return this._operand;
    }

    set operand(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Operand", value);

        if (value != undefined &&
            AuthoringAdvancedCondition.allowedComparisonOperands.findIndex(item => item.internal == value) == -1 &&
            AuthoringAdvancedCondition.allowedLogicalOperands.findIndex(item => item.internal == value) == -1
        ) {
            throw new Error("Unsupported opearand type");
        }
        this._operand = value;
    }

    get minutes(): number {
        return this._minutes;
    }

    set minutes(value: number) {
        this.typeChecker.validateAsNumberOrUndefined("minutes", value)
        this._minutes = value;
    }

    get end(): string {
        return this._end;
    }

    set end(value: string) {
        this.typeChecker.validateAsStringOrUndefined("end", value);
        if (value.match(/^[0-2]?[0-9]:[0-6]?[0-9]$/) == null) {
            throw new Error("End time not in hh:mm format");
        }

        this._end = value;
    }

    get start(): string {
        return this._start;
    }

    set start(value: string) {
        this.typeChecker.validateAsStringOrUndefined("start", value);
        if (value.match(/^[0-2]?[0-9]:[0-6]?[0-9]$/) == null) {
            throw new Error("Start time not in hh:mm format");
        }

        this._start = value;
    }

    get variableId(): string {
        return this._variableId;
    }

    set variableId(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Variable", value);
        this._variableId = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Type", value);

        if (value != undefined && AuthoringAdvancedCondition.allowedTypes.findIndex(item => item.internal == value) == -1) {
            throw new Error("Unsupported condition type");
        }

        this._type = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Name", name);
        this._name = value;
    }

    public fromObject(data = {
        id: undefined,
        name: undefined,
        variable: undefined,
        type: undefined,
        start: undefined,
        end: undefined,
        minutes: undefined,
        operand: undefined,
        conditions: undefined,
        location: undefined,
        a: undefined,
        b: undefined,
        aType: undefined,
        bType: undefined
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.name = data.name;
        this.variableId = data.variable;
        this.type = data.type;
        this.start = data.start;
        this.end = data.end;
        this.minutes = data.minutes;
        this.operand = data.operand;
        this.conditionIds = data.conditions;
        this.locationId = data.location;
        this.variableA = data.a;
        this.variableB = data.b;
        this.variableAType = data.aType;
        this.variableBType = data.bType;
    }

    public toJSON() {

        switch (this.type) {
            case 'comparison' :
                return this.comparisonJSON();
            case 'check' :
                return this.checkJSON();
            case 'location':
                return this.locationJSON();
            case 'logical' :
                return this.logicalJSON();
            case 'timepassed' :
                return this.timePassedJSON();
            case 'timerange' :
                return this.timeRangeJSON();
        }

        return {
            id: this.id,
            name: this.name,
            type: "invalid"
        }
    }

    private comparisonJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            a: this.variableA,
            b: this.variableB,
            aType: this.variableAType,
            bType: this.variableBType,
            operand: this.operand,
        }
    }

    private checkJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            variable: this.variableId
        }
    }

    private locationJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            location: this.locationId
        }
    }

    private logicalJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            operand: this.operand,
            conditions: this.conditionIds
        }
    }

    private timePassedJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            variable: this.variableId,
            minutes: this.minutes
        }
    }

    private timeRangeJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            variable: this.variableId,
            start: this.start,
            end: this.end
        }
    }
}