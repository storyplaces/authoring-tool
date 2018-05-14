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
import {bindable, bindingMode, computedFrom, inject} from "aurelia-framework";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import {Config} from "../../config/Config";
import {StoryJsonConnector} from "../../resources/store/StoryJsonConnector";
import {CurrentUser} from "../../resources/auth/CurrentUser";
import {AuthoringUserConnector} from "../../resources/store/AuthoringUserConnector";
import {PreviewingConnector} from "../../resources/store/PreviewingConnector";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";
import {PublishingConnector} from "../../resources/store/PublishingConnector";
import {AuthoringUser} from "../../resources/models/AuthoringUser";
import 'typeahead.js';

@inject(StoryJsonConnector, Config, CurrentUser, AuthoringUserConnector, PreviewingConnector, AuthoringStoryConnector, PublishingConnector)
export class StoryDetailTab {

    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;
    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay}) valid: boolean;

    private _jsonDownloadResults: string = "";
    private buildingJson: boolean = false;
    private downloadJsonLink: HTMLAnchorElement;

    private _results: string = "";

    private publishing: boolean = false;
    private buildingPreview: boolean = false;
    private isPreviewLink: boolean = false;

    private lookup: HTMLInputElement;

    constructor(private storyJsonConnector: StoryJsonConnector,
                private config: Config,
                private currentUser: CurrentUser,
                private authoringUserConnector: AuthoringUserConnector,
                private previewConnector: PreviewingConnector,
                private authoringStoryConnector: AuthoringStoryConnector,
                private publishingConnector: PublishingConnector) {
    }

    setDirty() {
        this.dirty = true;
    }

    downloadJson() {
        this.buildingJson = true;
        this.jsonDownloadResults = "";
        this.storyJsonConnector.downloadJson(this.story).then(result => {
            this.buildingJson = false;

            if (typeof result !== 'boolean') {
                var file = new Blob([JSON.stringify(result)], {type: "application/octet-stream"});
                this.downloadJsonLink.download = "download.json";
                this.downloadJsonLink.href = URL.createObjectURL(file);
                this.downloadJsonLink.click();
                return;
            }
            this.jsonDownloadResults = "Sorry it has not been possible to request your story JSON at this time due to a network issue.";
        });
    }

    get jsonDownloadResults(): string {
        return this._jsonDownloadResults;
    }

    set jsonDownloadResults(value: string) {
        this._jsonDownloadResults = value;
    }

    canSeeAdminPanel() {
        return this.currentUser.hasPrivilege('adminMenu');
    }

    created() {
        this.authoringUserConnector.fetchAll();
    }

    attached() {
        this.setupTypeAhead();
    }

    //@computedFrom('authoringUserConnector.all')
    get users() {
        return this.authoringUserConnector.all;
    }

    @computedFrom("authoringUserConnector.all", "story.authorIds")
    get storyOwner(): AuthoringUser {
        return this.authoringUserConnector.byId(this.story.authorIds[0]);
    }

    set storyOwner(owner: AuthoringUser) {
        this.story.authorIds.splice(0, 1, owner.id);
        this.setDirty();
    }

    preview() {
        this.buildingPreview = true;
        this.previewConnector.previewStory(this.story).then(result => {
            this.buildingPreview = false;

            if (typeof result !== 'boolean') {
                this.results = this.makePreviewLink(result);
                this.isPreviewLink = true;
                return
            }

            this.results = "Sorry it has not been possible to request a preview at this time due to a network issue.";
        });

    }

    private makePreviewLink(id: string) {
        let previewUrl = this.config.read('reading_tool_url') + 'story/' + id;
        return previewUrl;
    }

    set results(value: string) {
        this._results = value;
        this.isPreviewLink = false;
    }

    get results() {
        return this._results;
    }

    @computedFrom('authoringStoryConnector.hasUnSyncedStories')
    get canNotPublish(): boolean {
        return this.authoringStoryConnector.hasUnSyncedStories;
    }

    publish() {
        this.publishing = true;
        this.publishingConnector.publishStory(this.story).then(result => {
            this.publishing = false;

            if (typeof result !== 'boolean') {
                this.results = result;
                return
            }

            this.results = "Sorry it has not been possible to request publication at this time due to a network issue";
        });
    }

    private userMatcher(strings: Array<AuthoringUser>){
        return (q, cb) => {
            // regex used to determine if a string contains the substring `q`
            let substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            let matches = this.users.filter(item => substrRegex.test(item.name));

            cb(matches);
        };
    }

    setupTypeAhead() {
        ($(this.lookup as any) as any).typeahead({
            hint: false,
            highlight: false,
            minLength: 1,
            classNames: {
                empty: 'Typeahead-input'
            }
        },
            {
                name: 'users',
                display: (item: AuthoringUser) => item.name,
                templates: {
                    empty: '<div class="tt-no-suggestion"><strong>Sorry, there are no matches</strong></div>',
                    suggestion: (item: AuthoringUser) => (`<div><strong>${item.name}</strong> - ${item.email}</div>`)
                },
                source: this.userMatcher(this.users)
            }).on('typeahead:selected',
            (e, value: AuthoringUser) => {
                this.storyOwner = value;
            });
    }

}



