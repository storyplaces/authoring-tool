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

import {StoryPlacesAPI} from "../../../src/resources/store/StoryplacesAPI";
import {Container} from "aurelia-dependency-injection";
import {HttpClient} from "aurelia-fetch-client";
import {Identifiable} from "../../../src/resources/interfaces/Identifiable";
import {JSONable} from "../../../src/resources/interfaces/JSONable";
import {Config} from "../../../src/config/Config";
import {FetchConfig} from "aurelia-authentication";

describe("StoryPlacesAPI", () => {

    let container: Container;

    class TestIdentifiable implements Identifiable, JSONable {
        toJSON() {
            return {data: "test"}
        }

        id: string;

    }

    let config = new Config();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    beforeEach(() => {
        container = new Container().makeGlobal();
    });

    afterEach(() => {
        container = null;
    });

    it("can be instantiated and have an unset path", () => {
        let client = resolve(HttpClient);
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));

        expect(api.path).toBeUndefined();
    });

    it("can have its path set using the path setter", () => {
        let client = resolve(HttpClient);
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/"

        expect(api.path).toEqual("/stories/");
    });

    it("adds a trailing slash when setting a path without one", () => {
        let client = resolve(HttpClient);
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories"

        expect(api.path).toEqual("/stories/");
    });

    it("calls fetch client with a get request when getting all", (finished) => {
        let client = resolve(HttpClient);
        spyOn(client, "fetch").and.returnValue(new Promise((success, failure) => {
                return success(new Response("[]"));
            })
        );
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/"

        api.getAll().then((result) => {
            expect(result).toEqual(new Response("[]"));
            expect(client.fetch).toHaveBeenCalledTimes(1);
            expect(client.fetch).toHaveBeenCalledWith(api.path);
            finished();
        });
    });

    it("calls fetch client with a get request when getting one", (finished) => {
        let client = resolve(HttpClient);
        spyOn(client, "fetch").and.returnValue(new Promise((success, failure) => {
                return success(new Response("[]"));
            })
        );
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/"

        api.getOne("123").then((result) => {
            expect(result).toEqual(new Response("[]"));
            expect(client.fetch).toHaveBeenCalledTimes(1);
            expect(client.fetch).toHaveBeenCalledWith(api.path + "123");
            finished();
        });
    });

    it("calls fetch client with a post request saving something with no id", (finished) => {
        let client = resolve(HttpClient);
        spyOn(client, "fetch").and.returnValue(new Promise((success, failure) => {
                return success(new Response("[]"));
            })
        );
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/"
        let testObjectNoId = new TestIdentifiable();

        api.save(testObjectNoId).then((result) => {
            expect(result).toEqual(new Response("[]"));
            expect(client.fetch).toHaveBeenCalledTimes(1);
            expect(client.fetch).toHaveBeenCalledWith(api.path, {
                method: "post",
                body: JSON.stringify(testObjectNoId.toJSON())
            });
            finished();
        });
    });

    it("calls fetch client with a put request saving something with an id", (finished) => {
        let client = resolve(HttpClient);
        spyOn(client, "fetch").and.returnValue(new Promise((success, failure) => {
                return success(new Response("[]"));
            })
        );
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/";
        let testObjectNoId = new TestIdentifiable();
        testObjectNoId.id = "1";

        api.save(testObjectNoId).then((result) => {
            expect(result).toEqual(new Response("[]"));
            expect(client.fetch).toHaveBeenCalledTimes(1);
            expect(client.fetch).toHaveBeenCalledWith(api.path + testObjectNoId.id.toString(), {
                method: "put",
                body: JSON.stringify(testObjectNoId.toJSON())
            });
            finished();
        });
    });

    it("calls fetch client with a put request and no id in the url when calling saveNewString", (finished) => {
        let client = resolve(HttpClient);
        spyOn(client, "fetch").and.returnValue(new Promise((success, failure) => {
                return success(new Response("[]"));
            })
        );
        let api = new StoryPlacesAPI(client, config, resolve(FetchConfig));
        api.path = "/stories/";
        let testString = '{"test": "testString"}';

        api.saveNewString(testString).then((result) => {
            expect(result).toEqual(new Response("[]"));
            expect(client.fetch).toHaveBeenCalledTimes(1);
            expect(client.fetch).toHaveBeenCalledWith(api.path, {
                method: "put",
                body: testString
            });
            finished();
        });
    });

});