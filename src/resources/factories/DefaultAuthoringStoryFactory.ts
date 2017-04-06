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
import {inject, Factory} from "aurelia-framework";
import {AuthoringStory} from "../models/AuthoringStory";
import {CurrentUser} from "../auth/CurrentUser";

@inject(Factory.of(AuthoringStory), CurrentUser)
export class DefaultAuthoringStoryFactory {

    constructor(private authoringStoryFactory: (data?) => AuthoringStory, private currentUser: CurrentUser) {
    }

    create(): AuthoringStory {
        return this.authoringStoryFactory(this.defaultStory());
    }

    private defaultStory(): Object {
        let now = new Date().toISOString();

        return {
            title: "New Story",
            description: "",
            audience: "general",
            createdDate: now,
            modifiedDate: now,
            authorIds: [this.currentUser.userId],
            tags: [],
            pages: [{
                // "id": "defaultPage",
                "name": "Start Page",
                "content": `Edit this page to create the first page in your story.

To help get you started, it is useful to know that your story pages may or may not be pinned to a location on the map. A page pinned to a location can only be read in that location. By default, pages can only be read once, although you can change this.

Pages first appear as 'loose pages'. But if you want, you can organise your pages into chapters. Pages in a chapter are only accessible when that chapter is open - so chapters are a good way of managing progression through your story.

Your start page should always be a 'loose page,' so that it can be read at the beginning of the story. You may choose to have more than one possible start page.

Enjoy writing your story!`,
                "pageHint": "Read this page to begin the story",
                "allowMultipleReadings": false,
                "finishesStory": false,
                "unlockedByPageIds": [],
                "unlockedByPagesOperator": "and"
            }],
            chapters: [],
            locations: [],
            version: 1,
            imageIds: []
        }
    }
}