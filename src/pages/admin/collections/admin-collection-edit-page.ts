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
 *   notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 * - The name of the University of Southampton nor the name of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
import {Disposable, Factory, inject, BindingEngine} from "aurelia-framework";
import {CollectionConnector} from "../../../resources/store/CollectionConnector";
import {Router} from "aurelia-router";
import {Collection} from "../../../resources/models/Collection";
import {
    Rule,
    validateTrigger,
    ValidationController,
    ValidationControllerFactory,
    ValidationRules
} from "aurelia-validation";
import {BootstrapValidationRenderer} from "../../../components/validation-renderer/BootstrapValidationRenderer";

@inject(CollectionConnector, Router, Factory.of(Collection), ValidationControllerFactory, Factory.of(BootstrapValidationRenderer), BindingEngine)
export class AdminCollectionListPage {

    private collectionId: string;
    private collection: Collection;

    public rules: Rule<Collection, any>[][];
    private validationController: ValidationController;
    private errorSub: Disposable;
    private valid: Boolean;


    constructor(private collectionConnector: CollectionConnector,
                private router: Router,
                private collectionFactory: (any?) => Collection,
                private controllerFactory: ValidationControllerFactory,
                private validationRendererFactory: () => BootstrapValidationRenderer,
                private bindingEngine: BindingEngine) {
        this.setupValidation();
    }

    attached() {
        this.collectionConnector.fetchAll();
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

    private calculateIfValid() {
        this.valid = (this.validationController.errors.length == 0);
    }

    activate(params) {
        try {
            this.collectionId = params.collectionId;
        } catch (err) {
            this.collectionId = "";
        }

        if (this.collectionId) {
            this.collectionConnector.fetchAll();
            this.collection = this.collectionConnector.byId(this.collectionId);
        } else {
            this.collection = this.collectionFactory();
        }
    }

    private validationRules() {
        return ValidationRules
            .ensure((collection: Collection) => collection.name).required().maxLength(255)
            .ensure((collection: Collection) => collection.description).required().maxLength(1024)
            .rules;
    }

    save() {
        if (!this.valid) {
            return;
        }
        this.collectionConnector.save(this.collection).then(() => {
            this.router.navigateToRoute("admin-collection-list");
        });

    }

}