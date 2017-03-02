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
import {Router} from "aurelia-router";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";
import {DialogService} from "aurelia-dialog";
import {DeleteConfirm} from "../../components/modals/delete-confirm";
import {AuthoringChapter} from "../../resources/models/AuthoringChapter";
import {DefaultAuthoringChapterFactory} from "../../resources/factories/DefaultAuthoringChapterFactory";

@inject(AuthoringStoryConnector, Router, DialogService, DefaultAuthoringChapterFactory)
export class ChapterEditPage {

    private params: {storyId: string, chapterId: string};
    private chapter: AuthoringChapter;
    private story: AuthoringStory;

    private storyModified: boolean = false;
    private chapterModified: boolean = false;

    private mapHidden: boolean = false;

    constructor(private storyConnector: AuthoringStoryConnector,
                private router: Router,
                private dialogService: DialogService,
                private defaultAuthoringChapterFactory: DefaultAuthoringChapterFactory) {
    }

    canActivate(params): any {
        this.params = params;

        if (this.itemsExist()) {
            this.clone();
            return true;
        }

        return this.storyConnector.sync().then(() => {
            if (this.itemsExist()) {
                this.clone();
                return true;
            }

            return false;
        });
    }

    private itemsExist(): boolean {
        if (!this.params.storyId) {
            return false;
        }

        let story = this.storyConnector.byId(this.params.storyId);

        if (!story) {
            return false;
        }

        if (!this.params.chapterId) {
            return true;
        }

        return story.chapters.get(this.params.chapterId) !== undefined;
    }

    canDeactivate() {
        let question = "Are you sure you wish to leave the page without saving? Any changes you have made will be lost."
        if (this.storyModified || this.chapterModified) {
            return this.dialogService.open({viewModel: DeleteConfirm, model: question}).then(response => {
                if (!response.wasCancelled) {
                    return true;
                }
                return false;
            });
        }
    }

    private clone() {
        this.cloneStory();
        this.cloneChapter();
    }

    private cloneStory() {
        this.story = this.storyConnector.cloneById(this.params.storyId);
        this.storyModified = true;
    }

    private cloneChapter() {
        this.chapter = this.params.chapterId ? this.story.chapters.getClone(this.params.chapterId) : this.defaultAuthoringChapterFactory.create();
        this.chapterModified = true;
    }


    private save() {
        this.story.chapters.save(this.chapter);
        this.chapterModified = false;

        this.storyConnector.save(this.story).then(() => {
            this.storyModified = false;
            this.router.navigateToRoute("story-chapters", {storyId: this.story.id});
        });
    }

    private cancel() {
        this.router.navigateToRoute("story-chapters", {storyId: this.story.id});
    }


}