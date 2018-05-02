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

import {AuthoringStory} from "../../../src/resources/models/AuthoringStory";
import {TypeChecker} from "../../../src/resources/utilities/TypeChecker";
import {Container, Factory} from "aurelia-framework";
import * as moment from "moment";
import {AuthoringAdvancedVariableCollection} from "../../../src/resources/collections/AuthoringAdvancedVariableCollection";
import {AuthoringAdvancedConditionCollection} from "../../../src/resources/collections/AuthoringAdvancedConditionCollection";
import {AuthoringAdvancedFunctionCollection} from "../../../src/resources/collections/AuthoringAdvancedFunctionCollection";
import {AuthoringAdvancedLocationCollection} from "../../../src/resources/collections/AuthoringAdvancedLocationCollection";
import {AuthoringPageCollection} from "../../../src/resources/collections/AuthoringPageCollection";

describe("Authoring Story model", () => {
    let authoringUserCollectionFactoryCalledWith;
    let authoringChapterCollectionFactoryCalledWith;
    let authoringPageCollectionFactoryCalledWith;
    let authoringLocationCollectionFactoryCalledWith;
    let authoringAdvancedVariableCollectionFactoryCalledWith;
    let authoringAdvancedFunctionCollectionFactoryCalledWith;
    let authoringAdvancedConditionCollectionFactoryCalledWith;
    let authoringAdvancedLocationCollectionFactoryCalledWith;

    let typeChecker: TypeChecker;

    let authoringUserCollectionFactory = (data) => {
        authoringUserCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringChapterCollectionFactory = (data) => {
        authoringChapterCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringPageCollectionFactory = (data) => {
        authoringPageCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringLocationCollectionFactory = (data) => {
        authoringLocationCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringAdvancedVariableCollectionFactory = (data) => {
        authoringAdvancedVariableCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringAdvancedFunctionCollectionFactory = (data) => {
        authoringAdvancedFunctionCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringAdvancedConditionCollectionFactory = (data) => {
        authoringAdvancedConditionCollectionFactoryCalledWith = data;
        return undefined;
    };

    let authoringAdvancedLocationCollectionFactory = (data) => {
        authoringAdvancedLocationCollectionFactoryCalledWith = data;
        return undefined;
    };

    let container: Container = new Container().makeGlobal();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    beforeEach(() => {
        authoringChapterCollectionFactoryCalledWith = "set to something random";
        authoringPageCollectionFactoryCalledWith = "set to something random";
        authoringLocationCollectionFactoryCalledWith = "set to something random";
        authoringAdvancedVariableCollectionFactoryCalledWith = "set to something random";
        authoringAdvancedFunctionCollectionFactoryCalledWith = "set to something random";
        authoringAdvancedConditionCollectionFactoryCalledWith = "set to something random";
        authoringAdvancedLocationCollectionFactoryCalledWith = "set to something random";
        typeChecker = new TypeChecker();
    });

    afterEach(() => {
        typeChecker = null;
    });

    it("can be instantiated with no data", () => {
        let model = new AuthoringStory(authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            authoringAdvancedVariableCollectionFactory,
            authoringAdvancedFunctionCollectionFactory,
            authoringAdvancedConditionCollectionFactory,
            authoringAdvancedLocationCollectionFactory,
            typeChecker);

        expect(model.id).toBeUndefined();
        expect(model.title).toBeUndefined();
        expect(model.description).toBeUndefined();
        expect(model.createdDate).toEqual(jasmine.any(Date));
        expect(model.modifiedDate).toEqual(jasmine.any(Date));
        expect(model.audience).toEqual(undefined);
        expect(model.authorIds).toEqual(undefined);
        expect(model.chapters).toEqual(undefined);
        expect(model.pages).toEqual(undefined);
        expect(model.locations).toEqual(undefined);
        expect(model.tags).toEqual(undefined);
        expect(model.logLocations).toEqual(undefined);

        expect(authoringChapterCollectionFactoryCalledWith).toBeUndefined();
        expect(authoringPageCollectionFactoryCalledWith).toBeUndefined();
        expect(authoringLocationCollectionFactoryCalledWith).toBeUndefined();
    });

    it("can be instantiated with data", () => {
        let data = {
            id: "id",
            title: "title",
            description: "description",
            createdDate: moment.unix(1111111),
            modifiedDate: moment.unix(1111112),
            audience: "general",
            authorIds: ["author"],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"],
            imageIds: [],
            logLocations: true
        };

        let model = new AuthoringStory(authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            authoringAdvancedVariableCollectionFactory,
            authoringAdvancedFunctionCollectionFactory,
            authoringAdvancedConditionCollectionFactory,
            authoringAdvancedLocationCollectionFactory,
            typeChecker,
            data);

        expect(model.id).toEqual("id");
        expect(model.title).toEqual("title");
        expect(model.description).toEqual("description");
        expect(model.audience).toEqual("general");
        expect(model.createdDate).toEqual(moment.unix(1111111).toDate());
        expect(model.modifiedDate).toEqual(moment.unix(1111112).toDate());
        expect(model.tags).toEqual(["tag"]);

        expect(model.pages).toEqual(undefined);
        expect(model.chapters).toEqual(undefined);
        expect(model.authorIds).toEqual(["author"]);
        expect(model.locations).toEqual(undefined);
        expect(model.logLocations).toEqual(true);
        expect(authoringChapterCollectionFactoryCalledWith).toEqual([{id: "chapter"}]);
        expect(authoringPageCollectionFactoryCalledWith).toEqual([{id: "page"}]);
        expect(authoringLocationCollectionFactoryCalledWith).toEqual([{id: "location", "type": "null"}]);
    });

    it("can have an anonymous Object passed to it", () => {
        let data = {
            id: "id",
            title: "title",
            description: "description",
            createdDate: moment.unix(1111111),
            modifiedDate: moment.unix(1111112),
            audience: "general",
            authorIds: ["author"],
            imageIds: [],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"],
            advancedFunctions: [],
            advancedConditions: [],
            advancedLocations: [],
            advancedVariables: [],
            logLocations: true
        };

        let model = new AuthoringStory(authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            authoringAdvancedVariableCollectionFactory,
            authoringAdvancedFunctionCollectionFactory,
            authoringAdvancedConditionCollectionFactory,
            authoringAdvancedLocationCollectionFactory,
            typeChecker);
        model.fromObject(data);

        expect(model.id).toEqual("id");
        expect(model.title).toEqual("title");
        expect(model.description).toEqual("description");
        expect(model.audience).toEqual("general");
        expect(model.createdDate).toEqual(moment.unix(1111111).toDate());
        expect(model.modifiedDate).toEqual(moment.unix(1111112).toDate());
        expect(model.tags).toEqual(["tag"]);

        expect(model.pages).toEqual(undefined);
        expect(model.chapters).toEqual(undefined);
        expect(model.authorIds).toEqual(["author"]);
        expect(model.locations).toEqual(undefined);
        expect(model.logLocations).toEqual(true);
        expect(authoringChapterCollectionFactoryCalledWith).toEqual([{id: "chapter"}]);
        expect(authoringPageCollectionFactoryCalledWith).toEqual([{id: "page"}]);
        expect(authoringLocationCollectionFactoryCalledWith).toEqual([{id: "location", "type": "null"}]);
    });

    it("will throw an error if something other than an object is passed to fromObject", () => {
        let model = new AuthoringStory(authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            authoringAdvancedVariableCollectionFactory,
            authoringAdvancedFunctionCollectionFactory,
            authoringAdvancedConditionCollectionFactory,
            authoringAdvancedLocationCollectionFactory,
            typeChecker);

        expect(() => {
            model.fromObject([] as any)
        }).toThrow();

        expect(() => {
            model.fromObject("a" as any)
        }).toThrow();
    });

    it("will throw an error if title is not set to a string or undefined", () => {
        let model = new AuthoringStory(authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            authoringAdvancedVariableCollectionFactory,
            authoringAdvancedFunctionCollectionFactory,
            authoringAdvancedConditionCollectionFactory,
            authoringAdvancedLocationCollectionFactory,
            typeChecker);

        expect(() => {
            model.title = 1 as any
        }).toThrow();
    });

    it("will output JSON when passed to JSON.stringify", () => {
        let data = {
            id: "id",
            title: "title",
            description: "description",
            createdDate: moment.unix(1111111),
            modifiedDate: moment.unix(1111112),
            audience: "general",
            authorIds: ["author"],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"],
            logLocations: true
        };

        let model = resolve(AuthoringStory, data);

        let result = JSON.stringify(model);

        expect(result).toEqual('{"id":"id","title":"title","description":"description","createdDate":"1970-01-13T20:38:31.000Z","modifiedDate":"1970-01-13T20:38:32.000Z","audience":"general","authorIds":["author"],"chapters":[{"id":"chapter"}],"pages":[{"id":"page","advancedConditionIds":[],"advancedFunctionIds":[]}],"locations":[{"id":"location","type":"circle"}],"tags":["tag"],"logLocations":true,"advancedFunctions":[],"advancedConditions":[],"advancedVariables":[],"advancedLocations":[]}');
    });

    describe('in use functions', () => {
        let authoringStory;

        beforeEach(() => {
            let variable1 = {'id': 'var1', 'name': 'var1'};
            let variable2 = {'id': 'var2', 'name': 'var2'};
            let variable3 = {'id': 'var3', 'name': 'var3'};
            let variable4 = {'id': 'var4', 'name': 'var4'};
            let variable5 = {'id': 'var5', 'name': 'var5'};
            let variable6 = {'id': 'var6', 'name': 'var6'};

            let condition1 = {'id': 'comparison1', 'name': 'comparison1', 'type': 'comparison', 'variableA': 'var1'};
            let condition2 = {'id': 'comparison2', 'name': 'comparison2', 'type': 'comparison', 'variableB': 'var2'};
            let condition3 = {'id': 'check1', 'name': 'check1', 'type': 'check', 'variableId': 'var3'};
            let condition4 = {'id': 'check2', 'name': 'check2', 'type': 'check', 'variableId': 'var4'};
            let condition5 = {'id': 'comparison3', 'name': 'comparison3', 'type': 'comparison', 'variableB': 'var4'};

            let function1 = {'id': 'function1', 'name': 'setFunction1', 'variableId': 'var5', 'conditionIds': ['condition1']};
            let function2 = {'id': 'function2', 'name': 'setFunction2', 'variableId': 'var4', 'conditionIds': ['condition3']};
            let function3 = {'id': 'function3', 'name': 'setFunction3', 'variableId': 'var6'};
            let function4 = {'id': 'function4', 'name': 'setFunction4', 'variableId': 'var6'};

            let page1 = {'id': 'page1', 'name': 'Page1', 'advancedFunctionIds': ['function3', 'function4'], 'advancedConditionIds': ['condition2']};
            let page2 = {'id': 'page2', 'name': 'Page2', 'advancedFunctionIds': ['function4'], 'advancedConditionIds': ['condition3']};

            authoringStory = new AuthoringStory(authoringChapterCollectionFactory,
                Factory.of(AuthoringPageCollection).get(container) as any,
                authoringLocationCollectionFactory,
                Factory.of(AuthoringAdvancedVariableCollection).get(container) as any,
                Factory.of(AuthoringAdvancedFunctionCollection).get(container) as any,
                Factory.of(AuthoringAdvancedConditionCollection).get(container) as any,
                Factory.of(AuthoringAdvancedLocationCollection).get(container) as any,
                typeChecker);

            authoringStory.fromObject({
                id: "id",
                title: "title",
                description: "description",
                createdDate: moment.unix(1111111),
                modifiedDate: moment.unix(1111112),
                audience: "general",
                authorIds: ["author"],
                imageIds: [],
                pages: [page1, page2],
                chapters: [],
                locations: [],
                tags: ["tag"],
                advancedFunctions: [function1, function2, function3, function4],
                advancedConditions: [condition1, condition2, condition3, condition4, condition5],
                advancedLocations: [],
                advancedVariables: [variable1, variable2, variable3, variable4, variable5, variable6],
                logLocations: true
            });

        });

        describe('condition in use', () => {
            it("will return true for a condition in use in a function", () => {
                expect(authoringStory.conditionInUse({'id': 'condition1'}).inUse).toEqual(true);
            });

            it("will return the function which a condition is used by", () => {
                expect(authoringStory.conditionInUse({'id': 'condition1'}).usedIn).toEqual(['Advanced Function: setFunction1']);
            });

            it("will return true for a condition in use on a page", () => {
                expect(authoringStory.conditionInUse({'id': 'condition2'}).inUse).toEqual(true);
            });

            it("will return the page the condition is used by", () => {
                expect(authoringStory.conditionInUse({'id': 'condition2'}).usedIn).toEqual(['Page: Page1']);
            });

            it("will return true when a function is used by a condition and a page", () => {
                expect(authoringStory.conditionInUse({'id': 'condition3'}).inUse).toEqual(true);
            });

            it("will return a list of pages and functions a condition is used by", () => {
                expect(authoringStory.conditionInUse({'id': 'condition3'}).usedIn.length).toEqual(2);
                expect(authoringStory.conditionInUse({'id': 'condition3'}).usedIn).toContain('Page: Page2');
                expect(authoringStory.conditionInUse({'id': 'condition3'}).usedIn).toContain('Advanced Function: setFunction2');
            });

            it("will return false when a condition is not in use", () => {
                expect(authoringStory.conditionInUse({'id': 'condition4'}).inUse).toEqual(false);
            });

            it("will return an empty list when the condition is not in use", () => {
                expect(authoringStory.conditionInUse({'id': 'condition4'}).usedIn.length).toEqual(0);
            });
        });

        describe('function in use', () => {
            it("will return true for a function in use on a page", () => {
                expect(authoringStory.functionInUse({'id': 'function3'}).inUse).toEqual(true);
            });

            it("will return the page a function in use on", () => {
                expect(authoringStory.functionInUse({'id': 'function3'}).usedIn).toEqual(['Page: Page1']);
            });

            it("will return true for a function in use on multiple pages", () => {
                expect(authoringStory.functionInUse({'id': 'function4'}).inUse).toEqual(true);
            });

            it("will return the pages a function in use on", () => {
                expect(authoringStory.functionInUse({'id': 'function4'}).usedIn.length).toEqual(2);
                expect(authoringStory.functionInUse({'id': 'function4'}).usedIn).toContain('Page: Page1');
                expect(authoringStory.functionInUse({'id': 'function4'}).usedIn).toContain('Page: Page2');
            });

            it("will return false for a function not in use on a page", () => {
                expect(authoringStory.functionInUse({'id': 'not-a-function'}).inUse).toEqual(false);
            });

            it("will return an empty list when the function is not in use", () => {
                expect(authoringStory.functionInUse({'id': 'not-a-function'}).usedIn.length).toEqual(0);
            });
        });

        describe('variable in use', () => {
            // Single checks

            it('will return true if a variableA is in use in a comparison condition', () => {
                expect(authoringStory.variableInUse({'id': 'var1'}).inUse).toEqual(true);
            });

            it('will return the condition variableA is in use in', () => {
                expect(authoringStory.variableInUse({'id': 'var1'}).usedIn).toEqual(['Advanced Condition: comparison1']);
            });

            it('will return true if a variableB is in use in a comparison condition', () => {
                expect(authoringStory.variableInUse({'id': 'var2'}).inUse).toEqual(true);
            });

            it('will return the condition variableB is in use in', () => {
                expect(authoringStory.variableInUse({'id': 'var2'}).usedIn).toEqual(['Advanced Condition: comparison2']);
            });

            it('will return true if a variableId is in use in a check condition', () => {
                expect(authoringStory.variableInUse({'id': 'var3'}).inUse).toEqual(true);
            });

            it('will return the condition variableId is in use in', () => {
                expect(authoringStory.variableInUse({'id': 'var3'}).usedIn).toEqual(['Advanced Condition: check1']);
            });

            it('will return true if a variableId is in use in a function', () => {
                expect(authoringStory.variableInUse({'id': 'var5'}).inUse).toEqual(true);
            });

            it('will return the function variableId is in use in', () => {
                expect(authoringStory.variableInUse({'id': 'var5'}).usedIn).toEqual(['Advanced Function: setFunction1']);
            });

            // Multiple checks

            it('will return true if the variable is in use in a multiple conditions', () => {
                expect(authoringStory.variableInUse({'id': 'var4'}).inUse).toEqual(true);
            });

            it('will return the conditions the variable is in use in', () => {
                expect(authoringStory.variableInUse({'id': 'var4'}).usedIn.length).toEqual(3);
                expect(authoringStory.variableInUse({'id': 'var4'}).usedIn).toContain('Advanced Condition: comparison3');
                expect(authoringStory.variableInUse({'id': 'var4'}).usedIn).toContain('Advanced Condition: check2');
                expect(authoringStory.variableInUse({'id': 'var4'}).usedIn).toContain('Advanced Function: setFunction2');
            });

            it('will return false if a variable is not in use', () => {
                expect(authoringStory.variableInUse({'id': 'not-a-variable'}).inUse).toEqual(false);
            });

            it('will return the no usedIn information', () => {
                expect(authoringStory.variableInUse({'id': 'not-a-variable'}).usedIn.length).toEqual(0);
            });
        });
    });
});