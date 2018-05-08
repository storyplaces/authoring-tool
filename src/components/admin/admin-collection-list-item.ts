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
import {autoinject, bindable, containerless} from "aurelia-framework";
import {DialogService} from "aurelia-dialog";
import {DeleteConfirm} from "../modals/delete-confirm";
import {Collection} from "../../resources/models/Collection";
import {CollectionConnector} from "../../resources/store/CollectionConnector";
import {Router} from "aurelia-router";
import {ReadingStoryConnector} from "../../resources/store/ReadingStoryConnector";
import {Config} from "../../config/Config";

/**
 * Created by andy on 28/11/16.
 */


@autoinject()
@containerless()
export class AdminCollectionListItem {

    @bindable collection: Collection;

    private storyNames: Array<string>;

    constructor(private collectionConnector: CollectionConnector, private dialogService: DialogService, private router: Router, private readingStoryConnector: ReadingStoryConnector, private config: Config) {
    }

    attached() {
        this.readingStoryConnector.fetchAll().then(() => {
            this.storyNames = this.collection.storyIds.map(storyId => {
               let story = this.readingStoryConnector.allStories.find(readingStory => readingStory.id == storyId);
               if (story) {
                   return story.name;
               }

               return "";
            });
        });
    }

    delete(): void {
        let question = "Are you sure you wish to delete the collection " + this.collection.name + "?";
        this.dialogService.open({viewModel: DeleteConfirm, model: question}).whenClosed(response => {
            if (!response.wasCancelled) {
                this.collectionConnector.delete(this.collection);
            }
        });
    }

    edit(): void {
        this.router.navigateToRoute("admin-collection-edit", {"collectionId": this.collection.id});
    }

    generateURL(collectionId: string) {
        return this.config.read('reading_tool_url') + 'collection/' + collectionId;
    }

}