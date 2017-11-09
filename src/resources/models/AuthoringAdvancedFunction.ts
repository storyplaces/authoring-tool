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
export class AuthoringAdvancedFunction extends BaseModel implements HasName {
    static allowedTypes: Array<{ internal: string, display: string }> =
        [
            {internal: "set", display: "Set"},
            {internal: "settimestamp", display: "Set to current time"},
            {internal: "increment", display: "Increment"},
            {internal: "chain", display: "Chain"}
        ];
    private _name: string;
    private _variableId: string;
    private _value: string;
    private _chainFunctionIds: Array<string>;
    private _type: string;
    private _conditionIds: Array<string>;

    constructor(typeChecker: TypeChecker, data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    get conditionIds(): Array<string> {
        return this._conditionIds;
    }

    set conditionIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Conditions", value, "string");
        this._conditionIds = value || [];
    }

    get type(): string {
        return this._type;
    }

    set type(value: string | string) {
        this.typeChecker.validateAsStringOrUndefined("Type", value);

        if (value != undefined && AuthoringAdvancedFunction.allowedTypes.findIndex(item => item.internal == value) == -1) {
            throw new Error("Unsupported function type");
        }
        this._type = value;
    }

    get chainFunctionIds(): Array<string> {
        return this._chainFunctionIds;
    }

    set chainFunctionIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("ChainFunctionIds", value, "string");
        this._chainFunctionIds = value || [];
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Value", name);
        this._value = value;
    }

    get variableId(): string {
        return this._variableId;
    }

    set variableId(value: string) {
        this.typeChecker.validateAsStringOrUndefined("VariableId", name);
        this._variableId = value;
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
        variableId: undefined,
        value: undefined,
        chainFunctionIds: undefined,
        conditionIds: undefined,
        type:undefined,
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.name = data.name;
        this.variableId = data.variableId;
        this.value = data.value;
        this.chainFunctionIds = data.chainFunctionIds;
        this.conditionIds = data.conditionIds;
        this.type = data.type;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            variableId: this.variableId,
            value: this.value,
            chainFunctionIds: this.chainFunctionIds,
            conditionIds: this.conditionIds,
            type: this.type
        }
    }
}