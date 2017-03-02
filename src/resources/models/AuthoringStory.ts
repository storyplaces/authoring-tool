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
import {Factory, inject} from "aurelia-framework";
import {BaseModel} from "./BaseModel";
import {TypeChecker} from "../utilities/TypeChecker";
import {AuthoringUserCollection} from "../collections/AuthoringUserCollection";
import {AuthoringChapterCollection} from "../collections/AuthoringChapterCollection";
import {AuthoringPageCollection} from "../collections/AuthoringPageCollection";
import {AuthoringLocationCollection} from "../collections/AuthoringLocationCollection";

@inject(
    Factory.of(AuthoringUserCollection),
    Factory.of(AuthoringChapterCollection),
    Factory.of(AuthoringPageCollection),
    Factory.of(AuthoringLocationCollection),
    TypeChecker
)
export class AuthoringStory extends BaseModel {


    private _title: string;
    private _description: string;
    private _createdDate: Date;
    private _modifiedDate: Date;
    private _audience: string;
    private _authors: AuthoringUserCollection;
    private _chapters: AuthoringChapterCollection;
    private _pages: AuthoringPageCollection;
    private _locations: AuthoringLocationCollection;
    private _tags: Array<string>;


    constructor(private authoringUserCollectionFactory: (any?) => AuthoringUserCollection,
                private authoringChapterCollectionFactory: (any?) => AuthoringChapterCollection,
                private authoringPageCollectionFactory: (any?) => AuthoringPageCollection,
                private authoringLocationCollectionFactory: (any?) => AuthoringLocationCollection,
                typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);

        this.fromObject(data);

        if (this.createdDate == undefined) {
            this.createdDate = new Date();
            this.modifiedDate = this.createdDate;
        }
    }

    public fromObject(data = {
        id: undefined,
        title: undefined,
        description: undefined,
        createdDate: undefined,
        modifiedDate: undefined,
        audience: undefined,
        authors: undefined,
        chapters: undefined,
        pages: undefined,
        locations: undefined,
        tags: undefined
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.createdDate = new Date(data.createdDate);
        this.modifiedDate = new Date(data.modifiedDate);
        this.audience = data.audience;
        this.authors = this.authoringUserCollectionFactory(data.authors);
        this.chapters = this.authoringChapterCollectionFactory(data.chapters);
        this.pages = this.authoringPageCollectionFactory(data.pages);
        this.locations = this.authoringLocationCollectionFactory(data.locations);
        this.tags = data.tags;

    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdDate: this.createdDate.toISOString(),
            modifiedDate: this.modifiedDate.toISOString(),
            audience: this.audience,
            authors: this.authors,
            chapters: this.chapters,
            pages: this.pages,
            locations: this.locations,
            tags: this.tags
        }
    }

    get tags(): Array<string> {
        return this._tags;
    }

    set tags(value: Array<string>) {
        this._tags = value;
    }

    get locations(): AuthoringLocationCollection {
        return this._locations;
    }

    set locations(value: AuthoringLocationCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Locations', value, 'AuthoringLocationCollection', AuthoringLocationCollection);
        this._locations = value;
    }

    get pages(): AuthoringPageCollection {
        return this._pages;
    }

    set pages(value: AuthoringPageCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Pages', value, 'AuthoringPageCollection', AuthoringPageCollection);
        this._pages = value;
    }

    get chapters(): AuthoringChapterCollection {
        return this._chapters;
    }

    set chapters(value: AuthoringChapterCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Chapters', value, 'AuthoringChapterCollection', AuthoringChapterCollection);
        this._chapters = value;
    }

    get authors(): AuthoringUserCollection {
        return this._authors;
    }

    set authors(value: AuthoringUserCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Authors', value, 'AuthoringUserCollection', AuthoringUserCollection);
        this._authors = value;
    }

    get audience(): string {
        return this._audience;
    }

    set audience(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Audience', value);
        this._audience = value;
    }

    get modifiedDate(): Date {
        return this._modifiedDate;
    }

    set modifiedDate(value: Date) {
        if (isNaN(value.getTime())){
            this._modifiedDate = undefined;
            return;
        }
        this._modifiedDate = value;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    set createdDate(value: Date) {
        if (isNaN(value.getTime())){
            this._createdDate = undefined;
            return;
        }
        this._createdDate = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Description', value);
        this._description = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this.typeChecker.validateAsStringOrUndefined('Title', value);
        this._title = value;
    }

}

export var audiences = [
    {shortname: "general", fullname: "General Audience"},
    {shortname: "family", fullname: "Family Friendly"},
    {shortname: "advisory", fullname: "Advisory Content"}
];