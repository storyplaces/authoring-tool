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
import {inject, Factory, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";
import {StoryLookup} from "../../resources/utilities/StoryLookup";
import {AuthoringPage} from "../../resources/models/AuthoringPage";
import {AuthoringLocation} from "../../resources/models/AuthoringLocation";
import {DialogService} from "aurelia-dialog";
import {DeleteConfirm} from "../../components/modals/delete-confirm";
import {DefaultAuthoringPageFactory} from "../../resources/factories/DefaultAuthoringPageFactory";
import {UserConfig} from "../../resources/store/UserConfig";

@inject(AuthoringStoryConnector, StoryLookup, Factory.of(AuthoringPage), Factory.of(AuthoringLocation), Factory.of(AuthoringStory), Router, DialogService, DefaultAuthoringPageFactory, UserConfig)
export class PageEditPage {
    private params: {storyId: string, pageId: string};
    private page: AuthoringPage;
    private location: AuthoringLocation;
    private story: AuthoringStory;

    private valid: boolean;
    private dirty: boolean;

    constructor(private storyConnector: AuthoringStoryConnector,
                private storyLookup: StoryLookup,
                private pageFactory: (data?) => AuthoringPage,
                private locationFactory: (data?) => AuthoringLocation,
                private storyFactory: (data?) => AuthoringStory,
                private router: Router,
                private dialogService: DialogService,
                private defaultAuthoringPageFactory: DefaultAuthoringPageFactory,
                private userConfig: UserConfig) {
    }

    canActivate(params) : any{
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

    @computedFrom('story.hasAdvanced', 'userConfig.advancedMode')
    get advanced() {
        return this.story.hasAdvanced || this.userConfig.advancedMode
    }

    private itemsExist(): boolean {
        if (!this.params.storyId) {
            return false;
        }

        let story = this.storyConnector.byId(this.params.storyId);

        if (!story) {
            return false;
        }

        if (!this.params.pageId) {
            return true;
        }

        return story.pages.get(this.params.pageId) !== undefined;
    }

    canDeactivate() {
        let question = "Are you sure you wish to leave the page without saving? Any changes you have made will be lost."
        if (this.dirty) {
            return this.dialogService.open({viewModel: DeleteConfirm, model: question}).whenClosed(response => {
                if (!response.wasCancelled) {
                    return true;
                }
                return false;
            });
        }
    }

    private clone() {
        this.cloneStory();
        this.clonePage();
        this.cloneLocation();
    }

    private cloneStory() {
        this.story = this.storyConnector.cloneById(this.params.storyId);
    }

    private clonePage() {
        if (this.params.pageId) {
            this.page = this.story.pages.getClone(this.params.pageId);
            return
        }

        this.page = this.defaultAuthoringPageFactory.create();
        this.story.pages.save(this.page);
    }

    private cloneLocation() {
        this.location = undefined;

        if (this.params.pageId) {
            this.location = this.storyLookup.getCloneLocationForPageId(this.story, this.params.pageId);
        }
    }

    private save() {
        if (!this.valid) {
            return;
        }

        if (this.location) {
            this.page.locationId = this.story.locations.save(this.location);
        } else {
            this.page.locationId = undefined;
        }
        this.story.pages.save(this.page);

        this.cleanUpImages();

        this.storyConnector.save(this.story).then(() => {
            this.dirty = false;
            this.router.navigateToRoute("story-pages", {storyId: this.story.id});
        });
    }

    private cancel() {
        this.router.navigateToRoute("story-pages", {storyId: this.story.id});
    }

    private cleanUpImages() {
        this.story.pages.forEach(page => {
           if (this.story.imageIds.indexOf(page.imageId) === -1) {
               page.imageId = "";
           }
        });
    }
}