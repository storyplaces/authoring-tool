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
    private _name: string;
    private _content: string;
    private _pageHint: string;
    private _locationId: string;
    private _allowMultipleReadings: boolean;
    private _unlockedByPageIds: Array<string>;
    private _unlockedByPagesOperator: string;
    private _finishesStory: boolean;
    private _imageId: string;
    private _advancedFunctionIds: Array<string>;
    private _advancedConditionIds: Array<string>;

    constructor(typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    get advancedConditionIds(): Array<string> {
        return this._advancedConditionIds;
    }

    set advancedConditionIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Condition Ids", value, "string");
        this._advancedConditionIds = value || [];
    }

    get advancedFunctionIds(): Array<string> {
        return this._advancedFunctionIds;
    }

    set advancedFunctionIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Function Ids", value, "string");
        this._advancedFunctionIds = value || [];
    }

    get finishesStory(): boolean {
        return this._finishesStory;
    }

    set finishesStory(value: boolean) {
        this.typeChecker.validateAsBooleanOrUndefined("Finishes Story", value);
        this._finishesStory = value;
    }

    get pageHint(): string {
        return this._pageHint;
    }

    set pageHint(value: string) {
        this.typeChecker.validateAsStringOrUndefined('PageHint', value);
        this._pageHint = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Name', value);
        this._name = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Colour', value);
        this._content = value;
    }

    get unlockedByPagesOperator(): string {
        return this._unlockedByPagesOperator;
    }

    set unlockedByPagesOperator(value: string) {
        this.typeChecker.validateAsStringOrUndefined('UnlockedByPagesOperator', value);

        if (value != 'and' && value != 'or' && value != undefined) {
            throw new TypeError("Unlocked by pages operator must be either and or or");
        }

        this._unlockedByPagesOperator = value;
    }

    get unlockedByPageIds(): Array<string> {
        return this._unlockedByPageIds;
    }

    set unlockedByPageIds(value: Array<string>) {
        this._unlockedByPageIds = value;
    }

    get allowMultipleReadings(): boolean {
        return this._allowMultipleReadings;
    }

    set allowMultipleReadings(value: boolean) {
        this.typeChecker.validateAsBooleanOrUndefined('AllowMultipleReadings', value);
        this._allowMultipleReadings = value;
    }

    get locationId(): string {
        return this._locationId;
    }

    set locationId(value: string) {
        this.typeChecker.validateAsStringOrUndefined('LocationId', value);
        this._locationId = value;
    }

    get imageId(): string {
        return this._imageId;
    }

    set imageId(value: string) {
        this.typeChecker.validateAsStringOrUndefined('ImageId', value);
        this._imageId = value;
    }

    public fromObject(data = {
        id: undefined,
        name: undefined,
        content: undefined,
        pageHint: undefined,
        locationId: undefined,
        allowMultipleReadings: undefined,
        unlockedByPageIds: undefined,
        unlockedByPagesOperator: undefined,
        finishesStory: undefined,
        imageId: undefined,
        advancedConditionIds: undefined,
        advancedFunctionIds: undefined,
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
        this.finishesStory = data.finishesStory;
        this.imageId = data.imageId;
        this.advancedConditionIds = data.advancedConditionIds;
        this.advancedFunctionIds = data.advancedFunctionIds;
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
            unlockedByPagesOperator: this.unlockedByPagesOperator,
            finishesStory: this.finishesStory,
            imageId: this.imageId,
            advancedConditionIds: this.advancedConditionIds,
            advancedFunctionIds: this.advancedFunctionIds
        }
    }
}