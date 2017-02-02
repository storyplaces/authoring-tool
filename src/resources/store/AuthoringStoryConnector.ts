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
import {AuthoringStoryCollection} from "../collections/AuthoringStoryCollection";
import {NewInstance, inject, computedFrom} from "aurelia-framework";
import {AuthoringStory} from "../models/AuthoringStory";
import {AuthoringStoryFactory} from "../factories/AuthoringStoryFactory";
import {StoryPlacesAPI} from "./StoryplacesAPI";
import {Identifiable} from "../interfaces/Identifiable";

export interface AuthoringStoryWriteResponse {
    message: string,
    object: Identifiable
}

export interface hasModifiedDate {
    modifiedDate: string;
}

@inject(NewInstance.of(AuthoringStoryCollection), AuthoringStoryFactory, NewInstance.of(StoryPlacesAPI))
export class AuthoringStoryConnector {
    private dirtyAuthoringStoryIds: Array<string> = [];
    private conflictingAuthoringStoryIds: Array<string> = [];
    private numberOfNetworkConnections: number = 0;

    constructor(private authoringStoryCollection: AuthoringStoryCollection, private authoringStoryFactory: AuthoringStoryFactory, private api: StoryPlacesAPI) {
        api.path = "/authoring/story/";
    }

    @computedFrom('numberOfNetworkConnections')
    get syncing(): boolean {
        return this.numberOfNetworkConnections != 0;
    }

    @computedFrom('dirtyAuthoringStoryIds')
    get hasUnSyncedStories(): boolean {
        return this.dirtyAuthoringStoryIds.length != 0;
    }

    @computedFrom('conflictingAuthoringStoryIds')
    get hasConflictingStories(): boolean {
        return this.conflictingAuthoringStoryIds.length != 0;
    }

    get all(): Array<AuthoringStory> {
        return this.authoringStoryCollection.all;
    }

    byId(id: string): AuthoringStory {
        return this.authoringStoryCollection.get(id);
    }

    save(authoringStory: AuthoringStory): Promise<undefined> {
        authoringStory.modifiedDate = new Date();
        this.authoringStoryCollection.save(authoringStory);
        this.addToDirtyList(authoringStory.id);
        return this.syncDirty();
    }

    private addToDirtyList(authoringStoryId: string) {
        if (this.dirtyAuthoringStoryIds.indexOf(authoringStoryId) != -1) {
            this.dirtyAuthoringStoryIds.push(authoringStoryId);
        }
    }

    private addToConflictList(authoringStoryId: string) {
        if (this.conflictingAuthoringStoryIds.indexOf(authoringStoryId) != -1) {
            this.conflictingAuthoringStoryIds.push(authoringStoryId);
        }
    }

    private removeFromDirtyList(authoringStoryId: string) {
        let foundIndex = this.dirtyAuthoringStoryIds.indexOf(authoringStoryId);
        if (foundIndex != -1) {
            this.dirtyAuthoringStoryIds.splice(foundIndex, 1);
        }
    }

    private inDirtyList(authoringStoryId: string) {
        return this.dirtyAuthoringStoryIds.indexOf(authoringStoryId) != -1;
    }

    newAuthoringStory(): Promise<boolean> {
        let defaultAuthoringStory = this.authoringStoryFactory.create();

        return this.sendStoryToServer(defaultAuthoringStory)
            .then(json => {
                this.authoringStoryCollection.save(json);
            })
            .then(() => true, (error) => {
                throw error
            })
    }

    syncDirty() {
        let sequence = Promise.resolve();

        this.dirtyAuthoringStoryIds.forEach(authoringStoryId => {
            sequence = sequence.then(() => {
                return this.sendStoryToServer(this.authoringStoryCollection.get(authoringStoryId))
                    .then(authoringStory => {
                        this.removeFromDirtyList(authoringStory.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        });

        return sequence;
    }

    sync() : Promise<undefined>{
        return this.syncDirty()
            .then(() => this.fetchAllAuthoringStoriesFromServer());
    }

    private fetchAllAuthoringStoriesFromServer(): Promise<undefined> {
        return this.api
            .getAll()
            .then(response => response.json() as any)
            .then(jsonArray => {
                (jsonArray as Array<Identifiable & hasModifiedDate>)
                    .forEach(authoringStory => {
                        let serverModified = new Date(authoringStory.modifiedDate);
                        let local = this.authoringStoryCollection.get(authoringStory.id);

                        if (!local || local.modifiedDate < serverModified) {
                            this.authoringStoryCollection.save(authoringStory);
                        }
                    })
            })
            .catch(reject => {
                console.error(reject)
            })
    }

    private sendStoryToServer(authoringStory: AuthoringStory): Promise<Identifiable> {
        this.numberOfNetworkConnections++;
        return this.api
            .save(authoringStory)
            .catch(error => {
                this.numberOfNetworkConnections--;

                if (error.response == 409) {
                    this.addToConflictList(authoringStory.id);
                    throw new Error("Conflict detected");
                }

                throw new Error("Unable to save story");
            })
            .then(response => response.json() as any)
            .then(jsonObject => {
                this.numberOfNetworkConnections--;
                return (jsonObject as AuthoringStoryWriteResponse).object;
            });
    }

}