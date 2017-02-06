/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) 2016
 University of Southampton
 Charlie Hargood, cah07r.ecs.soton.ac.uk
 Kevin Puplett, k.e.puplett.soton.ac.uk
 David Pepper, d.pepper.soton.ac.uk

 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * The name of the University of Southampton nor the name of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {BaseModel} from "../../../src/resources/models/BaseModel";
import {TypeChecker} from "../../../src/resources/utilities/TypeChecker";

describe("BaseModel", () => {
    let typeChecker = new TypeChecker;

    class TestModel extends BaseModel {


        toJSON() {
        }

        fromObject({id = undefined}) {
            this.id = id;
        }
    }


    it("will throw an error if id is set to something other than a string", () => {
        let model = new TestModel(typeChecker);

        expect(() => {
            model.id = 1 as any
        }).toThrow();

        expect(() => {
            model.id = false as any
        }).toThrow();

        expect(() => {
            model.id = {} as any
        }).toThrow();

        expect(() => {
            model.id = function () {
            } as any
        }).toThrow();
    });

    it("will throw an error if id is passed to fromObject as something other than a string", () => {
        let model = new TestModel(typeChecker);

        expect(() => {
            model.fromObject({id: 1} as any)
        }).toThrow();

        expect(() => {
            model.fromObject({id: false} as any)
        }).toThrow();

        expect(() => {
            model.fromObject({id: {}} as any)
        }).toThrow();

        expect(() => {
            model.fromObject({
                id: function () {
                } as any
            })
        }).toThrow();
    });

    it("will not throw an error if id is set to a string", () => {
        let model = new TestModel(typeChecker);

        model.id = "1";

        expect(model.id).toEqual("1");
    });

    it("will have toJSON called when passed to JSONStringify", () => {
        let model = new TestModel(typeChecker);

        spyOn(model, 'toJSON');

        JSON.stringify(model);

        expect(model.toJSON).toHaveBeenCalledTimes(1);
    })
});