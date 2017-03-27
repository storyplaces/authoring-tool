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
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";
import {DeleteConfirm} from "../../components/modals/delete-confirm";
import {DialogService} from "aurelia-dialog";
import {Router} from "aurelia-router";


@inject(AuthoringStoryConnector, Factory.of(AuthoringStory), DialogService, Router)
export class StoryEditPage {

    private storyId: string;

    private mapHidden: boolean = false;
    private story: AuthoringStory;
    private dirty: boolean;
    private valid: boolean;
    private saving: boolean = false;
    private saved: boolean = false;

    constructor(private storyConnector: AuthoringStoryConnector,
                private storyFactory: (data?) => AuthoringStory,
                private dialogService: DialogService,
                private router: Router) {
    }

    canActivate(params) {
        this.storyId = params.storyId;

        if (this.itemsExist()) {
            this.cloneStory();
            return true;
        }

        return this.storyConnector.sync().then(() => {
            this.cloneStory();
            return this.itemsExist();
        });
    }

    private itemsExist(): boolean {
        if (!this.storyId) {
            return false;
        }

        let story = this.storyConnector.byId(this.storyId);

        if (!story) {
            return false;
        }
    }

    canDeactivate() {
        let question = "Are you sure you wish to leave the page without saving? Any changes you have made will be lost."
        if (this.dirty) {
            return this.dialogService.open({viewModel: DeleteConfirm, model: question}).then(response => {
                if (!response.wasCancelled) {
                    return true;
                }
                return false;
            });
        }
    }

    private cloneStory() {
        this.story = this.storyConnector.cloneById(this.storyId);
    }

    private hasData(): boolean {
        return this.story !== undefined;
    }


    save() {
        if (!this.valid) {
            return;
        }

        this.saving = true;
        this.saved = false;
        this.storyConnector.save(this.story).then(() => {
            this.dirty = false;
            this.saving = false;
            this.saved = true;
        });
    }
}