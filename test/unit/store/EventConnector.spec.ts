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
import {EventConnector} from "../../../src/resources/store/EventConnector"
import {StoryPlacesAPI} from "../../../src/resources/store/StoryplacesAPI";
import {Identifiable} from "../../../src/resources/interfaces/Identifiable";
import {AuthoringStory} from "../../../src/resources/models/AuthoringStory";

describe("EventConnector", () => {
    let container: Container = new Container().makeGlobal();

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    it("can be instantiated with a storyplacesAPI and have it set the API's path", () => {
        let api = resolve(StoryPlacesAPI);
        let eventConnector = new EventConnector(api);

        expect(api.path).toEqual("/authoring/story/");
    });

    it("can be instantiated with number of network connections initialized to zero", () => {
        let api = resolve(StoryPlacesAPI);
        let eventConnector = new EventConnector(api);

        expect(eventConnector.numberOfNetworkConnections).toEqual(0);
    });

    it("calls trigger on StoryPlaces API and returns the json object when triggerStoryEvent is called", (done) => {
        let api = resolve(StoryPlacesAPI);
        let eventConnector = new EventConnector(api);
        spyOn(api, "trigger").and.callFake((object: Identifiable, event: string) => {
            let response = new Response(JSON.stringify({"event": event}));
            return Promise.resolve(response);
        });

        eventConnector.triggerStoryEvent(resolve(AuthoringStory), "testEvent").then((result) => {
            expect((result as any).event).toEqual("testEvent");
            done();
        });
    });
}