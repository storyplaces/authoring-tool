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
export class AuthoringChapter extends BaseModel {

    private _name: string;
    private _colour: string;
    private _pageIds: Array<string>;
    private _unlockedByPageIds: Array<string>;
    private _unlockedByPagesOperator: string;
    private _locksAllOtherChapters: Boolean;
    private _locksChapters: Array<string>;

    constructor(typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    public fromObject(data = {
        id: undefined,
        name: undefined,
        colour: undefined,
        pageIds: undefined,
        unlockedByPageIds: undefined,
        unlockedByPagesOperator: undefined,
        locksAllOtherChapters: undefined,
        locksChapters: undefined
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.colour = data.colour;
        this.name = data.name;
        this.pageIds = data.pageIds;
        this.unlockedByPageIds = data.unlockedByPageIds;
        this.unlockedByPagesOperator = data.unlockedByPagesOperator;
        this.locksAllOtherChapters = data.locksAllOtherChapters;
        this.locksChapters = data.locksChapters;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            colour: this.colour,
            pageIds: this.pageIds,
            unlockedByPageIds: this.unlockedByPageIds,
            unlockedByPagesOperator: this.unlockedByPagesOperator,
            locksAllOtherChapters: this.locksAllOtherChapters,
            locksChapters: this.locksChapters
        }
    }

    get unlockedByPageIds(): Array<string> {
        return this._unlockedByPageIds;
    }

    set unlockedByPageIds(value: Array<string>) {
        this._unlockedByPageIds = value;
    }

    get pageIds(): Array<string> {
        return this._pageIds;
    }

    set pageIds(value: Array<string>) {
        this._pageIds = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Name', value);
        this._name = value;
    }

    get colour(): string {
        return this._colour;
    }

    set colour(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Colour', value);
        this._colour = value;
    }

    get unlockedByPagesOperator(): string {
        return this._unlockedByPagesOperator;
    }

    set unlockedByPagesOperator(value: string) {
        this.typeChecker.validateAsStringOrUndefined('UnlockedByPagesOperator', value);
        this._unlockedByPagesOperator = value;
    }

    get locksAllOtherChapters(): Boolean {
        return this._locksAllOtherChapters;
    }

    set locksAllOtherChapters(value: Boolean) {
        this.typeChecker.validateAsBooleanOrUndefined('LocksAllOtherChapters', value);
        this._locksAllOtherChapters = value;
    }

    get locksChapters(): Array<string> {
        return this._locksChapters;
    }

    set locksChapters(value: Array<string>) {
        this._locksChapters = value;
    }
}

export var ChapterColours: Array<string> = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];