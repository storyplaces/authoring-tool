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
import {bindable, containerless, autoinject, computedFrom} from "aurelia-framework";
import {AuthoringPage} from "../../resources/models/AuthoringPage";
import {AuthoringChapter} from "../../resources/models/AuthoringChapter";
import {StoryLookup} from "../../resources/utilities/StoryLookup";
import {DialogService} from "aurelia-dialog";
import {DeleteConfirm} from "../modals/delete-confirm";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
/**
 * Created by andy on 28/11/16.
 */


@autoinject()
@containerless()
export class PageListItem {

    @bindable page: AuthoringPage;
    @bindable story: AuthoringStory;

    selected: boolean;
    private subscriber: Subscription;

    constructor(private storyLookup: StoryLookup, private dialogService: DialogService, private eventAggregator: EventAggregator) {
    }

    attached() {
        this.subscriber = this.eventAggregator.subscribe('pageListItemSelected', response => {
            if (response.page != this.page) {
                this.selected = false;
            } else {
                this.selected = response.selected;
            }
        });
    }

    detached() {
        this.subscriber.dispose();
    }

    @computedFrom("storyId")
    get chapters(): Array<AuthoringChapter> {
        return this.storyLookup.getChaptersForPageId(this.story, this.page.id);
    }

    delete(): void {
        let question = "Are you sure you wish to delete the page " + this.page.name + "?";
        this.dialogService.open({viewModel: DeleteConfirm, model: question}).whenClosed(response => {
            if (!response.wasCancelled) {
                this.storyLookup.deletePageFromStory(this.story, this.page.id);
            }
        });
    }

    select(): void {
        this.selected = !this.selected;
        this.eventAggregator.publish('pageListItemSelected', {page: this.page, selected: this.selected});
    }

    get pageStyle(): string {
        if (this.selected) {
            return "page-selected";
        }
        return "";
    }

}