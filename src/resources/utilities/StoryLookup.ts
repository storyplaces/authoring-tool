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
import {AuthoringStoryConnector} from "../store/AuthoringStoryConnector";
import {autoinject} from "aurelia-framework";
import {AuthoringLocation} from "../models/AuthoringLocation";
import {AuthoringStory} from "../models/AuthoringStory";
/**
 * Created by andy on 02/02/17.
 */

@autoinject()
export class StoryLookup {

    constructor(private storyConnector: AuthoringStoryConnector) {
    }

    // Returns an array of AuthoringChapters which contain the given page Id (in the specified story)
    public getChaptersForPageId(story: AuthoringStory, pageId: string) {
        return story.chapters.all.filter(chapter => {
            return chapter.pageIds.indexOf(pageId) != -1;
        });
    }

    public getLocationForPageId(story: AuthoringStory, pageId: string): AuthoringLocation {
        let page = story.pages.get(pageId);
        if (!page) {
            return undefined;
        }

        return story.locations.get(page.locationId);
    }

    public getCloneLocationForPageId(story: AuthoringStory, pageId: string): AuthoringLocation {
        let page = story.pages.get(pageId);
        if (!page) {
            return undefined;
        }

        return story.locations.getClone(page.locationId);
    }

    // Remove a page from the story
    // Also remove the page Id from all chapters in the story
    public deletePageFromStory(story: AuthoringStory, pageId: string) {
        story.pages.remove(pageId);
        story.chapters.removeReferencesToPage(pageId);
        this.storyConnector.save(story);
    }

    // Return a list of page Ids for a given storyId
    public pageIdsForStory(story: AuthoringStory) {
        return story.pages.all.map(page => page.id);
    }

    removePageIdFromChapterId(story: AuthoringStory, pageId: string, chapterId: string) {
        let chapter = story.chapters.get(chapterId);

        if (!chapter) {
            return;
        }

        let index = chapter.pageIds.indexOf(pageId);

        if (index != -1) {
            chapter.pageIds.splice(index, 1);
        }
    }

    addPageIdToChapterId(story: AuthoringStory, pageId: string, chapterId: string) {
        let page = story.pages.get(pageId);
        let chapter = story.chapters.get(chapterId);

        if (!chapter || !page) {
            return;
        }

        let index = chapter.pageIds.indexOf(pageId);

        if (index == -1) {
            chapter.pageIds.push(pageId);
        }
    }
}
