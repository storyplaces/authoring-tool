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

@inject(ValidationControllerFactory, Factory.of(BootstrapValidationRenderer), BindingEngine, AuthoringStoryConnector, PublishingConnector, PreviewingConnector, Config)
export class StoryDetailsForm {

    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;
    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay}) valid: boolean;

    private validationController: ValidationController;
    private errorSub: Disposable;
    public rules: Rule<AuthoringStory, any>[][];

    private _results: string = "";

    private publishing: boolean = false;
    private buildingPreview: boolean = false;
    private isPreviewLink: boolean = false;

    constructor(private controllerFactory: ValidationControllerFactory,
                private validationRendererFactory: () => BootstrapValidationRenderer,
                private bindingEngine: BindingEngine,
                private authoringStoryConnector: AuthoringStoryConnector,
                private publishingConnector: PublishingConnector,
                private previewConnector: PreviewingConnector,
                private config: Config) {
        this.setupValidation();
    }

    attached() {
        this.dirty = false;
        this.validationController.validate().then(() => {
            this.calculateIfValid();
        });
    }

    private setupValidation() {
        this.rules = this.validationRules();

        this.validationController = this.controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(this.validationRendererFactory());
        this.validationController.validateTrigger = validateTrigger.changeOrBlur;
        this.valid = true;

        this.errorSub = this.bindingEngine.collectionObserver(this.validationController.errors).subscribe(() => {
            this.calculateIfValid();
        });
    }

    private validationRules() {
        return ValidationRules
            .ensure((story: AuthoringStory) => story.title).required().maxLength(255)
            .ensure((story: AuthoringStory) => story.description).required().maxLength(1024)
            .ensure((story: AuthoringStory) => story.audience).required().matches(/general|family|advisory/)
            .rules;
    }

    detached() {
        if (this.errorSub) {
            this.errorSub.dispose();
            this.errorSub = undefined;
        }
    }

    get audiences(): Array<Object> {
        return audiences;
    }

    setDirty() {
        this.dirty = true;
    }

    private calculateIfValid() {
        this.valid = (this.validationController.errors.length == 0);
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

    set results(value: string){
        this._results = value;
        this.isPreviewLink = false;
    }

    get results() {
        return this._results;
    }

    get tags() {
        return this.story.tags.join(', ');
    }

    set tags(tagString: string) {
        let tags = tagString.split(',')

        this.story.tags = tags.map(tag => tag.trim());
    }

}



