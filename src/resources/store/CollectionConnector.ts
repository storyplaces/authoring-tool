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
import {StoryPlacesAPI} from "./StoryplacesAPI";
import {Factory, inject, NewInstance} from "aurelia-framework";
import {Collection} from "../models/Collection";
import {CollectionsCollection} from "../collections/CollectionsCollection";

@inject(NewInstance.of(CollectionsCollection), NewInstance.of(StoryPlacesAPI), Factory.of(Collection))
export class CollectionConnector {

    constructor(private allCollections: CollectionsCollection, private storyplacesAPI: StoryPlacesAPI, private collectionFactory: (any?) => Collection) {
        this.storyplacesAPI.path = "/authoring/admin/collection";
    }

    byId(id: string): Collection {
        return this.allCollections.get(id);
    }

    fetchAll(): Promise<any> {
        return this.storyplacesAPI.getAll()
            .then(response => response.json())
            .then((jsonArray) => {
                this.allCollections.saveMany(jsonArray.map(collection => this.collectionFactory(collection)));

            });
    }

    get all(): Array<Collection> {
        return this.allCollections.all;
    }

    save(collection: Collection): Promise<Response> {
        return this.storyplacesAPI.save(collection).then(response => response.json() as any);
    }

    delete(collection: Collection): Promise<Response> | any {
        return this.storyplacesAPI.delete(collection.id)
            .then(response => response.json() as any)
            .then(response => {
                this.allCollections.remove(collection.id);
            })
    }

}