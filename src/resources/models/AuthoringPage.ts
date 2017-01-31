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


@inject(
    TypeChecker
)
export class AuthoringPage extends BaseModel {


    private _name: String;
    private _content: String;
    private _pageHint: String;
    private _locationId: String;
    private _allowMultipleReadings: Boolean;
    private _unlockedByPageIds: Array<String>;
    private _unlockedByPagesOperator: String;

    constructor(typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    public fromObject(data = {
        id: undefined,
        name: undefined,
        content: undefined,
        pageHint: undefined,
        locationId: undefined,
        allowMultipleReadings: undefined,
        unlockedByPageIds: undefined,
        unlockedByPagesOperator: undefined
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.content = data.content;
        this.name = data.name;
        this.pageHint = data.pageHint;
        this.locationId = data.locationId;
        this.allowMultipleReadings = data.allowMultipleReadings;
        this.unlockedByPageIds = data.unlockedByPageIds;
        this.unlockedByPagesOperator = data.unlockedByPagesOperator;

    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            content: this.content,
            pageHint: this.pageHint,
            locationId: this.locationId,
            allowMultipleReadings: this.allowMultipleReadings,
            unlockedByPageIds: this.unlockedByPageIds,
            unlockedByPagesOperator: this.unlockedByPagesOperator
        }
    }

    get pageHint(): String {
        return this._pageHint;
    }

    set pageHint(value: String) {
        this.typeChecker.validateAsStringOrUndefined('PageHint', value);
        this._pageHint = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this.typeChecker.validateAsStringOrUndefined('Name', value);
        this._name = value;
    }

    get content(): String {
        return this._content;
    }

    set content(value: String) {
        this.typeChecker.validateAsStringOrUndefined('Colour', value);
        this._content = value;
    }

    get unlockedByPagesOperator(): String {
        return this._unlockedByPagesOperator;
    }

    set unlockedByPagesOperator(value: String) {
        this.typeChecker.validateAsStringOrUndefined('UnlockedByPagesOperator', value);
        this._unlockedByPagesOperator = value;
    }
    get unlockedByPageIds(): Array<String> {
        return this._unlockedByPageIds;
    }

    set unlockedByPageIds(value: Array<String>) {
        this._unlockedByPageIds = value;
    }
    get allowMultipleReadings(): Boolean {
        return this._allowMultipleReadings;
    }

    set allowMultipleReadings(value: Boolean) {
        this.typeChecker.validateAsBooleanOrUndefined('AllowMultipleReadings', value);
        this._allowMultipleReadings = value;
    }
    get locationId(): String {
        return this._locationId;
    }

    set locationId(value: String) {
        this.typeChecker.validateAsStringOrUndefined('LocationId', value);
        this._locationId = value;
    }

}