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
import {bindable, BindingEngine, bindingMode, Disposable, Factory, inject} from "aurelia-framework";
import {audiences, AuthoringStory} from "../../resources/models/AuthoringStory";
import {
    Rule,
    validateTrigger,
    ValidationController,
    ValidationControllerFactory,
    ValidationRules
} from "aurelia-validation";
import {BootstrapValidationRenderer} from "../validation-renderer/BootstrapValidationRenderer";

@inject(ValidationControllerFactory, Factory.of(BootstrapValidationRenderer), BindingEngine)
export class StoryDetailsForm {

    @bindable({defaultBindingMode: bindingMode.twoWay}) story: AuthoringStory;
    @bindable({defaultBindingMode: bindingMode.twoWay}) dirty: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay}) valid: boolean;

    private validationController: ValidationController;
    private errorSub: Disposable;
    public rules: Rule<AuthoringStory, any>[][];

    constructor(private controllerFactory: ValidationControllerFactory,
                private validationRendererFactory: () => BootstrapValidationRenderer,
                private bindingEngine: BindingEngine) {
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

    private calculateIfValid() {
        this.valid = (this.validationController.errors.length == 0);
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

    get tags() {
        return this.story.tags.join(', ');
    }

    set tags(tagString: string) {
        let tags = tagString.split(',')

        this.story.tags = tags.map(tag => tag.trim());
    }

}



