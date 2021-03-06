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
import {autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";

@autoinject()
export class StoryEditPage {

    private storyId: string;

    private mapHidden: boolean = false;

    private selectedChapterId: string;
    private selectedChapterPageIds: Array<string> = [];

    @computedFrom('storyId', 'this.storyConnector.all')
    get story(): AuthoringStory {
        return this.storyConnector.byId(this.storyId);
    }

    constructor(private storyConnector: AuthoringStoryConnector,
                private router: Router) {
    }

    canActivate(params) {
        this.storyId = params.storyId;

        if (this.hasData()) {
            return true;
        }

        return this.storyConnector.sync().then(() => {
            return this.hasData();
        });
    }

    activate() {
        this.selectedChapterId = "";
        this.selectedChapterChanged();
    }

    selectedChapterChanged() {
        if (this.selectedChapterId == "") {
            this.selectedChapterPageIds = this.story.pages.all.map(page => page.id);
            return;
        }

        if (this.selectedChapterId == "loose-pages") {
            let pagesInChapters = [];
            this.story.chapters.all.forEach(chapter => {pagesInChapters = pagesInChapters.concat(chapter.pageIds)});
            this.selectedChapterPageIds = this.story.pages.all.filter(page => pagesInChapters.indexOf(page.id) == -1).map(page => page.id);
            return;
        }

        let selectedAuthoringChapter = this.story.chapters.get(this.selectedChapterId);

        if (selectedAuthoringChapter) {
            this.selectedChapterPageIds = selectedAuthoringChapter.pageIds;
            return;
        }

        this.selectedChapterPageIds = [];
        return;
    }

    private hasData(): boolean {
        return this.story !== undefined;
    }

    private new(): void {
        this.router.navigateToRoute('page-new', {storyId: this.story.id});
    }
}