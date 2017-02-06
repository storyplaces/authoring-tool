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
import {Container} from "aurelia-framework";
import {AuthoringStoryConnector} from "../../../src/resources/store/AuthoringStoryConnector";
import {AuthoringStoryCollection} from "../../../src/resources/collections/AuthoringStoryCollection";
import {StoryPlacesAPI} from "../../../src/resources/store/StoryplacesAPI";
import {AuthoringStoryFactory} from "../../../src/resources/factories/AuthoringStoryFactory";
import {Identifiable} from "../../../src/resources/interfaces/Identifiable";

describe("AuthoringStoryConnector", () => {
    let container: Container = new Container().makeGlobal();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    function apiReturnsSuccessfulSave(storyPlacesAPI: StoryPlacesAPI, newID?: string) {
        spyOn(storyPlacesAPI, 'save').and.callFake((passed: Identifiable) => {
            if (newID) {
                passed.id = newID;
            }

            let response = new Response(JSON.stringify({object: passed}));
            return Promise.resolve(response);
        });
    }

    function apiReturnsErrorCodeOnSave(storyPlacesAPI: StoryPlacesAPI, errorCode: number = 500) {
        spyOn(storyPlacesAPI, 'save').and.callFake((passed) => {
            let response = new Response(JSON.stringify({object: passed}), {status: errorCode});
            return Promise.reject(response);
        });
    }

    function apiReturnsSuccessfulFetch(storyPlacesAPI: StoryPlacesAPI, dataToReturn: Array<Object>) {
        spyOn(storyPlacesAPI, 'getAll').and.callFake(() => {
            let response = new Response(JSON.stringify(dataToReturn));
            return Promise.resolve(response);
        });
    }

    it("can be instantiated with a StoryCollection and a storyplacesAPI", () => {
        let authoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory = resolve(AuthoringStoryFactory);

        new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);
    });

    it("sets the storyPlacesAPI path to /authoring/story/", () => {
        let authoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory = resolve(AuthoringStoryFactory);

        new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);
        expect(storyPlacesAPI.path).toEqual("/authoring/story/");
    });

    it("returns storyCollection.all when all is called", () => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);
        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "123";

        authoringStoryCollection.save(authoringStory);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        let result = authoringStoryConnector.all;
        expect(result[0]).toBe(authoringStory);
    });

    it("calls storyCollection.get when byId is called", () => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);
        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "123";

        authoringStoryCollection.save(authoringStory);

        spyOn(authoringStoryCollection, 'get').and.callThrough();

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        let result = authoringStoryConnector.byId("123");
        expect(result).toBe(authoringStory);
        expect(authoringStoryCollection.get).toHaveBeenCalledTimes(1);
    });

    it("can create a new story", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        apiReturnsSuccessfulSave(storyPlacesAPI, "123");

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .newAuthoringStory()
            .then(result => {
                expect(result.id).toEqual("123");
                expect(authoringStoryCollection.get("123")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
                expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalled();
                done();
            });
    });

    it("can update a story assuming server accepts the story", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "345";

        apiReturnsSuccessfulSave(storyPlacesAPI);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .save(authoringStory)
            .then(() => {
                expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
                expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
                done();
            });
    });

    it("will leave a story as dirty if the server is unreachable", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "345";

        apiReturnsErrorCodeOnSave(storyPlacesAPI, 500);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .save(authoringStory)
            .then(() => {
                expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true);
                expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
                done();
            });
    });

    it("will flush existing dirty stories when syncDirty() is called", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "345";

        let goodResponse = false;

        spyOn(storyPlacesAPI, 'save').and.callFake((passed) => {
            if (goodResponse) {
                let response = new Response(JSON.stringify({object: passed}));
                return Promise.resolve(response);
            }

            let response = new Response(JSON.stringify({object: passed}), {status: 500});
            return Promise.reject(response);
        });

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .save(authoringStory)
            .then(() => {
                expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true);
                expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
            })
            .then(() => {
                goodResponse = true;
                authoringStoryConnector
                    .syncDirty()
                    .then(() => {
                        expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                        expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
                        expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
                        expect(authoringStoryConnector.syncing).toEqual(false);
                        expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
                        done();
                    });
            });
    });

    it("will flush existing conflicting stories when syncDirty() is called and is successful", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "345";

        let goodResponse = false;

        spyOn(storyPlacesAPI, 'save').and.callFake((passed) => {
            if (goodResponse) {
                let response = new Response(JSON.stringify({object: passed}));
                return Promise.resolve(response);
            }

            let response = new Response(JSON.stringify({object: passed}), {status: 409});
            return Promise.reject(response);
        });

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .save(authoringStory)
            .then(() => {
                expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true, "Test sync after failure");
                expect(authoringStoryConnector.hasConflictingStories).toEqual(true, "Test conflicting after failure");
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
            })
            .then(() => {
                goodResponse = true;
                authoringStoryConnector
                    .syncDirty()
                    .then(() => {
                        expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                        expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false, "Test sync after success");
                        expect(authoringStoryConnector.hasConflictingStories).toEqual(false, "Test conflicting after success");
                        expect(authoringStoryConnector.syncing).toEqual(false);
                        expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
                        done();
                    });
            });
    });

    it("will mark a story as conflicting and leave it in the dirty list if the server returns a 409 response", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "345";

        apiReturnsErrorCodeOnSave(storyPlacesAPI, 409);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector
            .save(authoringStory)
            .then(() => {
                expect(authoringStoryCollection.get("345")).not.toBeUndefined();
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true);
                expect(authoringStoryConnector.hasConflictingStories).toEqual(true);
                expect(authoringStoryConnector.syncing).toEqual(false);
                expect(storyPlacesAPI.save).toHaveBeenCalledWith(authoringStory);
                done();
            });
    });

    it("will download stories from the server if they don't already exist", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStory = authoringStoryFactory.create();
        authoringStory.id = "123";
        let authoringStory2 = authoringStoryFactory.create();
        authoringStory2.id = "456";
        let authoringStory3 = authoringStoryFactory.create();
        authoringStory3.id = "789";

        spyOn(storyPlacesAPI, 'getAll').and.callFake(() => {
            let response = new Response(JSON.stringify([authoringStory, authoringStory2, authoringStory3]));
            return Promise.resolve(response);
        });

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector.fetchAll().then(() => {
            expect(authoringStoryConnector.byId("123")).not.toBeUndefined();
            expect(authoringStoryConnector.byId("456")).not.toBeUndefined();
            expect(authoringStoryConnector.byId("789")).not.toBeUndefined();
            expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
            expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
            expect(authoringStoryConnector.syncing).toEqual(false);
            expect(storyPlacesAPI.getAll).toHaveBeenCalled();
            done();
        });
    });

    it("will download stories from the server if they already exist, they are newer on the server and not marked as modified", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStoryRemote = authoringStoryFactory.create();
        authoringStoryRemote.id = "123";
        authoringStoryRemote.title = "Remote";
        authoringStoryRemote.modifiedDate = new Date(Date.now() + 100000);

        let authoringStoryLocal = authoringStoryFactory.create();
        authoringStoryLocal.id = "123";
        authoringStoryLocal.title = "Local";

        authoringStoryCollection.save(authoringStoryLocal); // We do this to stop it being sent on the network

        spyOn(storyPlacesAPI, 'getAll').and.callFake(() => {
            let response = new Response(JSON.stringify([authoringStoryRemote]));
            return Promise.resolve(response);
        });

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector.fetchAll().then(() => {
            expect(storyPlacesAPI.getAll).toHaveBeenCalled();
            expect(authoringStoryConnector.byId("123").title).toEqual("Remote");
            expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
            expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
            expect(authoringStoryConnector.syncing).toEqual(false);
            done();
        });
    });

    it("will not download stories from the server if they already exist, they are newer on the server and are marked as modified and mark them as conflicting", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStoryRemote = authoringStoryFactory.create();
        authoringStoryRemote.id = "123";
        authoringStoryRemote.title = "Remote";
        authoringStoryRemote.modifiedDate = new Date(Date.now() + 100000);

        let authoringStoryLocal = authoringStoryFactory.create();
        authoringStoryLocal.id = "123";
        authoringStoryLocal.title = "Local";

        apiReturnsErrorCodeOnSave(storyPlacesAPI);
        apiReturnsSuccessfulFetch(storyPlacesAPI, [authoringStoryRemote]);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);
        authoringStoryConnector.save(authoringStoryLocal).then(() => {
            expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true, "Test sync status before fetch");
            expect(authoringStoryConnector.hasConflictingStories).toEqual(false, "Test conflicting status before fetch");

            authoringStoryConnector.fetchAll().then(() => {
                expect(storyPlacesAPI.getAll).toHaveBeenCalled();
                expect(authoringStoryConnector.byId("123").title).toEqual("Local");
                expect(authoringStoryConnector.hasUnSyncedStories).toEqual(true, "Test sync status after fetch");
                expect(authoringStoryConnector.hasConflictingStories).toEqual(true, "Test conflicting status after fetch");
                expect(authoringStoryConnector.syncing).toEqual(false);
                done();
            });
        });
    });

    it("will not download stories from the server if they already exist and they are newer on the client", (done) => {
        let authoringStoryCollection: AuthoringStoryCollection = resolve(AuthoringStoryCollection);
        let storyPlacesAPI: StoryPlacesAPI = resolve(StoryPlacesAPI);
        let authoringStoryFactory: AuthoringStoryFactory = resolve(AuthoringStoryFactory);

        let authoringStoryRemote = authoringStoryFactory.create();
        authoringStoryRemote.id = "123";
        authoringStoryRemote.title = "Remote";

        let authoringStoryLocal = authoringStoryFactory.create();
        authoringStoryLocal.id = "123";
        authoringStoryLocal.title = "Local";
        authoringStoryLocal.modifiedDate = new Date(Date.now() + 100000);

        authoringStoryCollection.save(authoringStoryLocal); // We do this to stop it being sent on the network

        apiReturnsSuccessfulFetch(storyPlacesAPI, [authoringStoryRemote]);

        let authoringStoryConnector = new AuthoringStoryConnector(authoringStoryCollection, authoringStoryFactory, storyPlacesAPI);

        authoringStoryConnector.fetchAll().then(() => {
            expect(storyPlacesAPI.getAll).toHaveBeenCalled();
            expect(authoringStoryConnector.byId("123").title).toEqual("Local");
            expect(authoringStoryConnector.hasUnSyncedStories).toEqual(false);
            expect(authoringStoryConnector.hasConflictingStories).toEqual(false);
            expect(authoringStoryConnector.syncing).toEqual(false);
            done();
        });
    });
});
