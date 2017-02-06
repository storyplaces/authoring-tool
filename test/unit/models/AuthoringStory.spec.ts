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
import {Container} from "aurelia-framework";
import * as moment from "moment";

describe("Story model", () => {
    let authoringUserCollectionFactoryCalledWith;
    let authoringChapterCollectionFactoryCalledWith;
    let authoringPageCollectionFactoryCalledWith;
    let authoringLocationCollectionFactoryCalledWith;
    let typeChecker: TypeChecker

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

    let container: Container = new Container().makeGlobal();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    beforeEach(() => {
        authoringUserCollectionFactoryCalledWith = "set to something random";
        authoringChapterCollectionFactoryCalledWith = "set to something random";
        authoringPageCollectionFactoryCalledWith = "set to something random";
        authoringLocationCollectionFactoryCalledWith = "set to something random";
        typeChecker = new TypeChecker();
    });


    afterEach(() => {
        typeChecker = null;
    });


    it("can be instantiated with no data", () => {
        let model = new AuthoringStory(authoringUserCollectionFactory,
            authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            typeChecker);

        expect(model.id).toBeUndefined();
        expect(model.title).toBeUndefined();
        expect(model.description).toBeUndefined();
        expect(model.createdDate).toEqual(jasmine.any(Date));
        expect(model.modifiedDate).toEqual(jasmine.any(Date));
        expect(model.audience).toEqual(undefined);
        expect(model.authors).toEqual(undefined);
        expect(model.chapters).toEqual(undefined);
        expect(model.pages).toEqual(undefined);
        expect(model.locations).toEqual(undefined);
        expect(model.tags).toEqual(undefined);

        expect(authoringUserCollectionFactoryCalledWith).toBeUndefined();
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
            authors: [{id: "author"}],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"]
        };


        let model = new AuthoringStory(authoringUserCollectionFactory,
            authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
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
        expect(model.authors).toEqual(undefined);
        expect(model.locations).toEqual(undefined);
        expect(authoringUserCollectionFactoryCalledWith).toEqual([{id: "author"}]);
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
            authors: [{id: "author"}],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"]
        };

        let model = new AuthoringStory(authoringUserCollectionFactory,
            authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
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
        expect(model.authors).toEqual(undefined);
        expect(model.locations).toEqual(undefined);
        expect(authoringUserCollectionFactoryCalledWith).toEqual([{id: "author"}]);
        expect(authoringChapterCollectionFactoryCalledWith).toEqual([{id: "chapter"}]);
        expect(authoringPageCollectionFactoryCalledWith).toEqual([{id: "page"}]);
        expect(authoringLocationCollectionFactoryCalledWith).toEqual([{id: "location", "type": "null"}]);
    });


    it("will throw an error if something other than an object is passed to fromObject", () => {
        let model = new AuthoringStory(authoringUserCollectionFactory,
            authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
            typeChecker);

        expect(() => {
            model.fromObject([] as any)
        }).toThrow();

        expect(() => {
            model.fromObject("a" as any)
        }).toThrow();
    });


    it("will throw an error if title is not set to a string or undefined", () => {
        let model = new AuthoringStory(authoringUserCollectionFactory,
            authoringChapterCollectionFactory,
            authoringPageCollectionFactory,
            authoringLocationCollectionFactory,
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
            authors: [{id: "author"}],
            pages: [{id: "page"}],
            chapters: [{id: "chapter"}],
            locations: [{id: "location", type: "null"}],
            tags: ["tag"]
        };

        let model = resolve(AuthoringStory, data);

        let result = JSON.stringify(model);

        //TODO:  Make this a real test as we don't have any sub modules!
        expect(result).toEqual('{"id":"id","title":"title","description":"description","createdDate":"1970-01-13T20:38:31.000Z","modifiedDate":"1970-01-13T20:38:32.000Z","audience":"general","authors":[{"id":"author"}],"chapters":[{"id":"chapter"}],"pages":[{"id":"page"}],"locations":[{"id":"location"}],"tags":["tag"]}');
    });
});