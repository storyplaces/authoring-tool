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
import {AuthoringPageCollection} from "../../../src/resources/collections/AuthoringPageCollection";
import {AuthoringLocationCollection} from "../../../src/resources/collections/AuthoringLocationCollection";
describe("StoryLookup", () => {

    let container: Container = new Container().makeGlobal();
    let story: AuthoringStory;

    let storyLookup: StoryLookup;
    let storyConnector: AuthoringStoryConnector;

    let testLocations: any;
    let testPages: any;
    let testChapters: any;

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    beforeEach(() => {
        testChapters = resolve(AuthoringChapterCollection, [
            {id: "c1", name: "Chapter 1", pageIds: ["p1"]},
            {id: "c2", name: "Chapter 2", pageIds: ["p1", "p2"]},
            {id: "c3", name: "Chapter 3", pageIds: [], locationId: ""}
        ]);

        testPages = resolve(AuthoringPageCollection, [
            {id: "p1", name: "Page 1", locationId: "l1"},
            {id: "p2", name: "Page 2", locationId: "l2"},
            {id: "p3", name: "Page 3"}
        ]);

        testLocations = resolve(AuthoringLocationCollection, [
            {id: "l1", lat: 1, long: 1, radius: 1},
            {id: "l2", lat: 2, long: 2, radius: 2},
            {id: "l3", lat: 3, long: 3, radius: 3}
        ]);

        story = resolve(AuthoringStory, {
            pages: testPages,
            chapters: testChapters,
            locations: testLocations,
        });

        storyConnector = resolve(AuthoringStoryConnector);
        storyLookup = new StoryLookup(storyConnector);
    });

    afterEach(() => {
        story = undefined;
    });

    describe("getChaptersForPageId", () => {
        it("returns an empty array if there are no chapters in a story", () => {
            story.chapters = resolve(AuthoringChapterCollection, []);
            let result = storyLookup.getChaptersForPageId(story, "p1");
            expect(result).toEqual([]);
        });

        it("returns an empty array if no chapters contain this page", () => {
            let result = storyLookup.getChaptersForPageId(story, "p3");
            expect(result).toEqual([]);
        });

        it("returns an array with chapters which contain this page", () => {
            let result = storyLookup.getChaptersForPageId(story, "p1");
            expect(result).toEqual([testChapters.get("c1"), testChapters.get("c2")]);
        });
    });

    describe("getLocationForPageId", () => {
        it("returns undefined if the page doesn't exist", () => {
            let result = storyLookup.getLocationForPageId(story, "unknown");
            expect(result).toBeUndefined();
        });

        it("returns undefined if there is no location associated with it", () => {
            let result = storyLookup.getLocationForPageId(story, "p3");
            expect(result).toBeUndefined();
        });

        it("returns a Location record if the page has a location associated with it", () => {
            let result = storyLookup.getLocationForPageId(story, "p2");
            expect(result).toBe(testLocations.get("l2"));
        });
    });

    describe("getCloneLocationForPageId", () => {
        it("returns undefined if the page doesn't exist", () => {
            let result = storyLookup.getCloneLocationForPageId(story, "unknown");
            expect(result).toBeUndefined();
        });

        it("returns undefined if there is no location associated with it", () => {
            let result = storyLookup.getCloneLocationForPageId(story, "p3");
            expect(result).toBeUndefined();
        });

        it("returns a Location record if the page has a location associated with it", () => {
            let result = storyLookup.getCloneLocationForPageId(story, "p2");
            expect(result).not.toBe(testLocations.get("l2"));
        });
    });

    describe("deletePageFromStory", () => {
        beforeEach(() => {
            spyOn(storyConnector, 'save').and.stub();
        });

        it("removes a page and the references to it from a chapter when the page exists and is a member of a single chapter", () => {
            storyLookup.deletePageFromStory(story, "p2");

            expect(storyConnector.save).toHaveBeenCalledWith(story);
            expect(story.pages.length()).toEqual(2, "Incorrect pages length");
            expect(story.pages.get("p2")).toBeUndefined();

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(1);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });


        it("removes a page and the references to it from a chapter when the page exists and is a member of multiple chapters", () => {
            storyLookup.deletePageFromStory(story, "p1");

            expect(storyConnector.save).toHaveBeenCalledWith(story);
            expect(story.pages.length()).toEqual(2, "Incorrect pages length");
            expect(story.pages.get("p1")).toBeUndefined();

            expect(story.chapters.get("c1").pageIds.length).toEqual(0);
            expect(story.chapters.get("c2").pageIds.length).toEqual(1);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it ("does nothing when the page exists but isn't part of a chapter", () => {
            storyLookup.deletePageFromStory(story, "p3");

            expect(storyConnector.save).toHaveBeenCalledWith(story);
            expect(story.pages.length()).toEqual(2, "Incorrect pages length");
            expect(story.pages.get("p3")).toBeUndefined();

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it ("does nothing when the page doesn't exist", () => {
            storyLookup.deletePageFromStory(story, "unknown");

            expect(storyConnector.save).toHaveBeenCalledWith(story);
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });
    });

    describe("pageIdsForStory", () => {
        it("returns an array with the ids for all the pages if there are pages", () => {
            let result = storyLookup.pageIdsForStory(story);
            expect(result).toContain("p1");
            expect(result).toContain("p2");
            expect(result).toContain("p3");
        });

        it("returns an empty array if no pages are defined", () => {
            story.pages = resolve(AuthoringPageCollection, []);
            let result = storyLookup.pageIdsForStory(story);
            expect(result).toEqual([]);
        });
    });

    describe("removePageIdFromChapterId", () => {
        it("will remove the page from the chapter if the page is a member of the chapter", () => {
            storyLookup.removePageIdFromChapterId(story, "p1", "c2");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(1);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);

            expect(story.chapters.get("c2").pageIds).toEqual(["p2"]);
        });

        it("will remove the page from the chapter if every thing exists but the page is not a member of the chapter", () => {
            storyLookup.removePageIdFromChapterId(story, "p2", "c1");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if the chapter doesn't exist", () => {
            storyLookup.removePageIdFromChapterId(story, "p1", "c4");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if the page doesn't exist", () => {
            storyLookup.removePageIdFromChapterId(story, "p4", "c1");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if nether the page or chapter exist", () => {
            storyLookup.removePageIdFromChapterId(story, "p4", "c4");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

    });

    describe("addPageIdToChapterId", () => {
        it("will add the page to the chapter if the page is not a member of the chapter", () => {
            storyLookup.addPageIdToChapterId(story, "p2", "c1");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(2);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);

            expect(story.chapters.get("c1").pageIds).toContain("p1");
            expect(story.chapters.get("c1").pageIds).toContain("p2");
        });

        it("will do nothing if the page is already a member of the chapter", () => {
            storyLookup.addPageIdToChapterId(story, "p1", "c1");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if the chapter doesn't exist", () => {
            storyLookup.addPageIdToChapterId(story, "p1", "c4");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if the page doesn't exist", () => {
            storyLookup.addPageIdToChapterId(story, "p4", "c1");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });

        it("will do nothing if nether the page or chapter exist", () => {
            storyLookup.addPageIdToChapterId(story, "p4", "c4");
            expect(story.pages.length()).toEqual(3, "Incorrect pages length");

            expect(story.chapters.get("c1").pageIds.length).toEqual(1);
            expect(story.chapters.get("c2").pageIds.length).toEqual(2);
            expect(story.chapters.get("c3").pageIds.length).toEqual(0);
        });
    });
});