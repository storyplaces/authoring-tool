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
import {bindable, inject, Factory, bindingMode, BindingEngine, Disposable, computedFrom} from "aurelia-framework";
import {AuthoringStory, audiences} from "../../resources/models/AuthoringStory";
import {
    ValidationControllerFactory,
    ValidationController,
    ValidationRules,
    validateTrigger,
    Rule
} from "aurelia-validation";
import {BootstrapValidationRenderer} from "../validation-renderer/BootstrapValidationRenderer";
import {AuthoringStoryConnector} from "../../resources/store/AuthoringStoryConnector";
import {PublishingConnector} from "../../resources/store/PublishingConnector";
import {PreviewingConnector} from "../../resources/store/PreviewingConnector";
import {Config} from "../../config/Config";
import {StoryJsonConnector} from "../../resources/store/StoryJsonConnector";

@inject(StoryJsonConnector, Config)
export class StoryDetailTab {

    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;
    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay}) valid: boolean;

    private _jsonDownloadResults: string = "";
    private buildingJson: boolean = false;
    private downloadJsonLink: HTMLAnchorElement;

    constructor(private storyJsonConnector: StoryJsonConnector,
                private config: Config) {
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

}



