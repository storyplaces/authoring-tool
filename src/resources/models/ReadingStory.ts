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

@inject(TypeChecker)
export class ReadingStory extends BaseModel {

    private _author: string;
    private _name: string;
    private _description: string;
    private _tags: Array<string>;
    private _audience: string;
    private _publishState: string;
    private _publishDate: string;

    constructor(typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    public fromObject(data = {
        id: undefined,
        name: undefined,
        tags: undefined,
        author: undefined,
        description: undefined,
        audience: undefined,
        publishState: undefined,
        publishDate: undefined
    }) {
        console.log(data);
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.author = data.author;
        this.description = data.description;
        this.name = data.name;
        this.tags = data.tags;
        this.audience = data.audience;
        this.publishState = data.publishState;
        this.publishDate = data.publishDate;
    }

    public toJSON() {
        return {
            id: this.id,
            author: this.author,
            description: this.description,
            name: this.name,
            tags: this.tags,
            audience: this.audience,
            publishState: this.publishState,
            publishDate: this.publishDate
        }
    }

    get audience(): string {
        return this._audience;
    }

    set audience(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Audience", value);
        this._audience = value;
    }

    get publishState(): string {
        return this._publishState;
    }

    set publishState(value: string) {
        this.typeChecker.validateAsStringOrUndefined("PublishState", value);
        this._publishState = value;
    }

    get publishDate(): string {
        return this._publishDate;
    }

    set publishDate(value: string) {
        this.typeChecker.validateAsStringOrUndefined("PublishDate", value);
        this._publishDate = value;
    }

    get author(): string {
        return this._author;
    }

    set author(author: string) {
        this.typeChecker.validateAsStringOrUndefined('Author', author);
        this._author = author;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this.typeChecker.validateAsStringOrUndefined('Name', name);
        this._name = name;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this.typeChecker.validateAsStringOrUndefined('Description', description);
        this._description = description;
    }

    get tags(): Array<string> {
        return this._tags;
    }

    set tags(value: Array<string>) {
        this._tags = value;
    }

}