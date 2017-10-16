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
import {StageComponent} from "aurelia-testing";
import {AuthoringStory} from "../../../src/resources/models/AuthoringStory";
import {Container} from "aurelia-framework";
import {bootstrap} from "aurelia-bootstrapper";

describe("Story List Item Custom Component", () => {
    const storyTitle = "Test title";
    const storyDescription = "Test description";
    const storyTags = ["Tag a", "Tag b"];
    const storyGeneralRating = 'general';
    const storyGeneralRatingLong = "General Audience";
    const storyFamilyRating = 'family';
    const storyFamilyRatingLong = "Family Friendly";
    const storyAdvisoryRating = 'advisory';
    const storyAdvisoryRatingLong = "Advisory Content";
    const storyAuthorIds = ["andy"];
    const storyId = "abcdefg123456";

    let component;
    let story;

    function buildComponent(rating) {
        let container = new Container();
        story = container.invoke(AuthoringStory, [{
            id: storyId,
            title: storyTitle,
            description: storyDescription,
            tags: storyTags,
            audience: rating,
            authorIds: storyAuthorIds
        }]);

        component = StageComponent
            .withResources('components/story/story-list-item')
            .inView('<story-list-item story.bind="story"></story-list-item>')
            .boundTo({story: story});
    }

    afterEach(() => {
        component.dispose();
    });

    it("will show the story title", (done) => {
        buildComponent(storyGeneralRating);

        component.create(bootstrap).then(() => {
            const element = document.querySelector('.grabbable-list-item-text > h4');
            expect(element.innerHTML).toEqual(storyTitle);
            done();
        });
    });

    it("will show the story description", (done) => {
        buildComponent(storyGeneralRating);
        component.create(bootstrap).then(() => {
            const element = document.querySelector('p.grabbable-list-item-text-body-small');
            expect(element.innerHTML).toEqual(storyDescription);
            done();
        });
    });

    it("will show the story tags", (done) => {
        buildComponent(storyGeneralRating);
        component.create(bootstrap).then(() => {
            const elements = document.querySelectorAll('span.label-default');
            expect(elements[0].innerHTML).toContain(storyTags[0]);
            expect(elements[1].innerHTML).toContain(storyTags[1]);
            done();
        });
    });

    it("will show a general rating", (done) => {
        buildComponent(storyGeneralRating);
        component.create(bootstrap).then(() => {
            const element = document.querySelector('span.label-info');
            expect(element.innerHTML).toContain(storyGeneralRatingLong);
            done();
        });
    });

    it("will show an advisory rating", (done) => {
        buildComponent(storyAdvisoryRating);
        component.create(bootstrap).then(() => {
            const element = document.querySelector('span.label-danger');
            expect(element.innerHTML).toContain(storyAdvisoryRatingLong);
            done();
        });
    });
    it("will show a family rating", (done) => {
        buildComponent(storyFamilyRating);
        component.create(bootstrap).then(() => {
            const element = document.querySelector('span.label-success');
            expect(element.innerHTML).toContain(storyFamilyRatingLong);
            done();
        });
    });

    xit("links to the correct url", (done) => {
        component.create(bootstrap).then(() => {
            const element = document.querySelector('a');

            console.log(element);

            expect(element.href).toEqual('#/story/' + storyId);
            done();
        });
    });
});