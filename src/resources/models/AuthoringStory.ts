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
import {computedFrom, Factory, inject} from "aurelia-framework";
import {BaseModel} from "./BaseModel";
import {TypeChecker} from "../utilities/TypeChecker";
import {AuthoringChapterCollection} from "../collections/AuthoringChapterCollection";
import {AuthoringPageCollection} from "../collections/AuthoringPageCollection";
import {AuthoringLocationCollection} from "../collections/AuthoringLocationCollection";
import {AuthoringAdvancedVariableCollection} from "../collections/AuthoringAdvancedVariableCollection";
import {AuthoringAdvancedFunctionCollection} from "../collections/AuthoringAdvancedFunctionCollection";
import {AuthoringAdvancedConditionCollection} from "../collections/AuthoringAdvancedConditionCollection";
import {AuthoringAdvancedLocationCollection} from "../collections/AuthoringAdvancedLocationCollection";
import {Identifiable} from "../interfaces/Identifiable";
import {HasName} from "../interfaces/HasName";
import {ItemInUse} from "../types/ItemInUse";

@inject(
    Factory.of(AuthoringChapterCollection),
    Factory.of(AuthoringPageCollection),
    Factory.of(AuthoringLocationCollection),
    Factory.of(AuthoringAdvancedVariableCollection),
    Factory.of(AuthoringAdvancedFunctionCollection),
    Factory.of(AuthoringAdvancedConditionCollection),
    Factory.of(AuthoringAdvancedLocationCollection),
    TypeChecker
)
export class AuthoringStory extends BaseModel {
    private _title: string;
    private _description: string;
    private _createdDate: Date;
    private _modifiedDate: Date;
    private _audience: string;
    private _authorIds: Array<string>;
    private _chapters: AuthoringChapterCollection;
    private _pages: AuthoringPageCollection;
    private _locations: AuthoringLocationCollection;
    private _tags: Array<string>;
    private _imageIds: Array<string>;
    private _logLocations: boolean;
    private _advancedVariables: AuthoringAdvancedVariableCollection;
    private _advancedLocations: AuthoringAdvancedLocationCollection;
    private _advancedFunctions: AuthoringAdvancedFunctionCollection;
    private _advancedConditions: AuthoringAdvancedConditionCollection;

    constructor(private authoringChapterCollectionFactory: (any?) => AuthoringChapterCollection,
                private authoringPageCollectionFactory: (any?) => AuthoringPageCollection,
                private authoringLocationCollectionFactory: (any?) => AuthoringLocationCollection,
                private authoringAdvancedVariableCollectionFactory: (any?) => AuthoringAdvancedVariableCollection,
                private authoringAdvancedFunctionCollectionFactory: (any?) => AuthoringAdvancedFunctionCollection,
                private authoringAdvancedConditionCollectionFactory: (any?) => AuthoringAdvancedConditionCollection,
                private authoringAdvancedLocationCollectionFactory: (any?) => AuthoringAdvancedLocationCollection,
                typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);

        this.fromObject(data);

        if (this.createdDate == undefined) {
            this.createdDate = new Date();
            this.modifiedDate = this.createdDate;
        }
    }

    get advancedVariables(): AuthoringAdvancedVariableCollection {
        return this._advancedVariables;
    }

    set advancedVariables(value: AuthoringAdvancedVariableCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Advanced Variables', value, 'AuthoringAdvancedVariableCollection', AuthoringAdvancedVariableCollection);
        this._advancedVariables = value;
    }

    get advancedLocations(): AuthoringAdvancedLocationCollection {
        return this._advancedLocations;
    }

    set advancedLocations(value: AuthoringAdvancedLocationCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Advanced Locations', value, 'AuthoringAdvancedLocationCollection', AuthoringAdvancedLocationCollection);

        this._advancedLocations = value;
    }

    get advancedFunctions(): AuthoringAdvancedFunctionCollection {
        return this._advancedFunctions;
    }

    set advancedFunctions(value: AuthoringAdvancedFunctionCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Advanced Functions', value, 'AuthoringAdvancedFunctionCollection', AuthoringAdvancedFunctionCollection);
        this._advancedFunctions = value;
    }

    get advancedConditions(): AuthoringAdvancedConditionCollection {
        return this._advancedConditions;
    }

    set advancedConditions(value: AuthoringAdvancedConditionCollection) {
        this.typeChecker.validateAsObjectOrUndefined('Advanced Conditions', value, 'AuthoringAdvancedConditionCollection', AuthoringAdvancedConditionCollection);
        this._advancedConditions = value;
    }

    get tags(): Array<string> {
        return this._tags;
    }

    set tags(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Tags", value, "string");
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

    get authorIds(): Array<string> {
        return this._authorIds;
    }

    set authorIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("authorIds", value, "string");
        this._authorIds = value;
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
        if (isNaN(value.getTime())) {
            this._modifiedDate = undefined;
            return;
        }
        this._modifiedDate = value;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    set createdDate(value: Date) {
        if (isNaN(value.getTime())) {
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

    get imageIds(): Array<string> {
        return this._imageIds;
    }

    set imageIds(value: Array<string>) {
        this.typeChecker.isUndefinedOrArrayOf("Image Ids", value, "string");
        this._imageIds = value;
    }

    get logLocations(): boolean {
        return this._logLocations;
    }

    set logLocations(value: boolean) {
        this.typeChecker.validateAsBooleanOrUndefined("logLocations", value);
        this._logLocations = value;
    }

    @computedFrom('advancedFunctions', 'advancedConditions', 'advancedLocations', 'advancedVariables')
    get hasAdvanced(): boolean {
        if (!this.advancedFunctions && !this.advancedConditions && !this.advancedLocations && !this.advancedVariables) {
            return false;
        }

        if (this.advancedFunctions.length() == 0 && this.advancedConditions.length() == 0 && this.advancedLocations.length() == 0 && this.advancedVariables.length() == 0) {
            return false;
        }

        return true;
    }

    public fromObject(data = {
        id: undefined,
        title: undefined,
        description: undefined,
        createdDate: undefined,
        modifiedDate: undefined,
        audience: undefined,
        authorIds: undefined,
        chapters: undefined,
        pages: undefined,
        locations: undefined,
        tags: undefined,
        imageIds: undefined,
        logLocations: undefined,
        advancedFunctions: undefined,
        advancedConditions: undefined,
        advancedVariables: undefined,
        advancedLocations: undefined,
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.createdDate = new Date(data.createdDate);
        this.modifiedDate = new Date(data.modifiedDate);
        this.audience = data.audience;
        this.authorIds = data.authorIds;
        this.chapters = this.authoringChapterCollectionFactory(data.chapters);
        this.pages = this.authoringPageCollectionFactory(data.pages);
        this.locations = this.authoringLocationCollectionFactory(data.locations);
        this.tags = data.tags;
        this.imageIds = data.imageIds;
        this.logLocations = data.logLocations;
        this.advancedConditions = this.authoringAdvancedConditionCollectionFactory(data.advancedConditions);
        this.advancedFunctions = this.authoringAdvancedFunctionCollectionFactory(data.advancedFunctions);
        this.advancedLocations = this.authoringAdvancedLocationCollectionFactory(data.advancedLocations);
        this.advancedVariables = this.authoringAdvancedVariableCollectionFactory(data.advancedVariables);
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            createdDate: this.createdDate.toISOString(),
            modifiedDate: this.modifiedDate.toISOString(),
            audience: this.audience,
            authorIds: this.authorIds,
            chapters: this.chapters,
            pages: this.pages,
            locations: this.locations,
            tags: this.tags,
            imageIds: this.imageIds,
            logLocations: this.logLocations,
            advancedFunctions: this.advancedFunctions,
            advancedConditions: this.advancedConditions,
            advancedVariables: this.advancedVariables,
            advancedLocations: this.advancedLocations,
        }
    }

    variableInUse(variable: Identifiable & HasName): ItemInUse {
        let usedInConditions = this.advancedConditions.all
            .filter(condition => {
                let usedInVariableA = condition.variableA ? (condition.variableA == variable.id) : false;
                let usedInVariableB = condition.variableB ? (condition.variableB == variable.id) : false;
                let usedInVariableId = condition.variableId ? (condition.variableId == variable.id) : false;

                return usedInVariableA || usedInVariableB || usedInVariableId;
            })
            .map(condition => `Advanced Condition: ${condition.name}`);

        let usedInFunctions = this.advancedFunctions.all
            .filter(advancedFunction => {
                return advancedFunction.variableId ? (advancedFunction.variableId == variable.id) : false;
            })
            .map(advancedFunction => `Advanced Function: ${advancedFunction.name}`);

        let inUse = usedInConditions.length !== 0 || usedInFunctions.length !== 0;

        return {item: variable, inUse: inUse, usedIn: usedInConditions.concat(usedInFunctions)};
    }

    functionInUse(func: Identifiable & HasName): ItemInUse {
        let usedInPages = this.pages.all
            .filter(page => {
                return page.advancedFunctionIds.indexOf(func.id) !== -1;
            })
            .map(page => `Page: ${page.name}`);

        return {item: func, inUse: usedInPages.length !== 0, usedIn: usedInPages};
    }

    conditionInUse(condition: Identifiable & HasName): ItemInUse {
        let usedInFunctions = this.advancedFunctions.all
            .filter(advancedFunction => {
                return advancedFunction.conditionIds.indexOf(condition.id) != -1;
            })
            .map(advancedFunction => `Advanced Function: ${advancedFunction.name}`);

        let usedInPages = this.pages.all
            .filter(page => {
                return page.advancedConditionIds.indexOf(condition.id) !== -1;
            })
            .map(page => `Page: ${page.name}`);

        let inUse = usedInPages.length !== 0 || usedInFunctions.length !== 0;

        return {item: condition, inUse: inUse, usedIn: usedInPages.concat(usedInFunctions)};
    }

}

export var audiences = [
    {shortname: "general", fullname: "General Audience"},
    {shortname: "family", fullname: "Family Friendly"},
    {shortname: "advisory", fullname: "Advisory Content"}
];

