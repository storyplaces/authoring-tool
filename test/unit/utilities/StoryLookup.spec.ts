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
import {Container} from "aurelia-framework";
import {StoryLookup} from "../../../src/resources/utilities/StoryLookup";
import {AuthoringStory} from "../../../src/resources/models/AuthoringStory";
import {AuthoringChapterCollection} from "../../../src/resources/collections/AuthoringChapterCollection";
import {AuthoringStoryConnector} from "../../../src/resources/store/AuthoringStoryConnector";
import {AuthoringChapter} from "../../../src/resources/models/AuthoringChapter";
import {AuthoringPageCollection} from "../../../src/resources/collections/AuthoringPageCollection";
describe("StoryLookup", () => {

    let container: Container = new Container().makeGlobal();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    describe("getChaptersForPageId", () => {
        let mockStory: AuthoringStory;
        let storyConnector: AuthoringStoryConnector;
        let storyLookup: StoryLookup;

        let connectorSpy: jasmine.Spy;
        beforeEach(() => {
            mockStory = {} as AuthoringStory;
            storyConnector = resolve(AuthoringStoryConnector);
            connectorSpy = spyOn(storyConnector, 'byId').and.returnValue(mockStory);
            storyLookup = new StoryLookup(storyConnector);
        });

        it("returns an empty array if there are no chapters in a story", () => {
            mockStory.chapters = resolve(AuthoringChapterCollection);
            let result = storyLookup.getChaptersForPageId("storyId", "pageId");
            expect(result).toEqual([]);
        });

        it("returns an empty array if no chapters contain this page", () => {
            mockStory.chapters = resolve(AuthoringChapterCollection, [resolve(AuthoringChapter, {
                id: "123",
                pageIds: []
            }), resolve(AuthoringChapter, {id: "456", pageIds: []})]);
            let result = storyLookup.getChaptersForPageId("storyId", "pageId");
            expect(result).toEqual([]);
        });

        it("returns an empty array if the story does not exist", () => {
            connectorSpy.and.returnValue(undefined);
            let result = storyLookup.getChaptersForPageId("storyId", "pageId");
            expect(result).toEqual([]);
        });

        it("returns an array with chapters which contain this page", () => {
            let testChapter = resolve(AuthoringChapter, {
                id: "123",
                name: "name",
                colour: "blue",
                pageIds: ["pageId"],
                unlockedByPageIds: [],
                unlockedByPagesOperator: "and",
                locksAllOtherChapters: false,
                locksChapters: []
            })
            mockStory.chapters = resolve(AuthoringChapterCollection, [testChapter]);
            let result = storyLookup.getChaptersForPageId("storyId", "pageId");
            expect(result).toEqual([testChapter]);
        })

    });

    describe("deletePageFromStory", () => {
        let mockStory: AuthoringStory;
        let storyConnector: AuthoringStoryConnector;
        let storyLookup: StoryLookup;
        let byIdSpy: jasmine.Spy;

        beforeEach(() => {
            mockStory = {} as AuthoringStory;
            storyConnector = resolve(AuthoringStoryConnector);
            byIdSpy = spyOn(storyConnector, 'byId').and.returnValue(mockStory);
            spyOn(storyConnector, 'save');
            storyLookup = new StoryLookup(storyConnector);
        });

        it("calls remove on the AuthoringPagesCollection and removeReferencesToPage on the AuthoringChapterCollection", () => {
            mockStory.pages = resolve(AuthoringPageCollection);
            mockStory.chapters = resolve(AuthoringChapterCollection);

            spyOn(mockStory.pages, "remove");
            spyOn(mockStory.chapters, "removeReferencesToPage");

            storyLookup.deletePageFromStory("storyId", "pageId");

            expect(mockStory.pages.remove).toHaveBeenCalledWith("pageId");
            expect(mockStory.chapters.removeReferencesToPage).toHaveBeenCalledWith("pageId");
            expect(storyConnector.save).toHaveBeenCalledWith(mockStory);

        });

        it("throws an error if the story with given id does not exist", () => {
            byIdSpy.and.returnValue(undefined);

            expect(() => {storyLookup.deletePageFromStory("storyId", "pageId")}).toThrowError("Story with id storyId does not exist.");

        });
    });
});