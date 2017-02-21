import {LocationHelper} from "../../../src/resources/gps/LocationHelper";

/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) $today.year
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

describe("LocationHelpers", () => {

    let helper = new LocationHelper;

    describe("method distanceInMetersBetweenTwoPoints", () => {
        it("will calculate distances to 10cm accuracy within a 200m radius", () => {
            //Southampton
            expect(helper.distanceInMetersBetweenTwoPoints(50.9361435, -1.3961910, 50.9360987, -1.3961843)).toBeCloseTo(5.00, 1); // 5.00m
            expect(helper.distanceInMetersBetweenTwoPoints(50.9362792, -1.3962106, 50.9360987, -1.3961843)).toBeCloseTo(20.16, 1); // 20.16m
            expect(helper.distanceInMetersBetweenTwoPoints(50.9369936, -1.3963454, 50.9360987, -1.3961843)).toBeCloseTo(100.15, 1); // 100.15m
            expect(helper.distanceInMetersBetweenTwoPoints(50.9379051, -1.3964646, 50.9360987, -1.3961843)).toBeCloseTo(201.82, 1); // 201.82m

            //San Francisco
            expect(helper.distanceInMetersBetweenTwoPoints(37.7990104, -122.4083448, 37.7990407, -122.4083879)).toBeCloseTo(5.07, 1); // 5.07m
            expect(helper.distanceInMetersBetweenTwoPoints(37.7990104, -122.4083448, 37.7991347, -122.4085148)).toBeCloseTo(20.35, 1); // 20.35m
            expect(helper.distanceInMetersBetweenTwoPoints(37.7990104, -122.4083448, 37.7995988, -122.4092073)).toBeCloseTo(100.12, 1); // 100.12m
            expect(helper.distanceInMetersBetweenTwoPoints(37.7990104, -122.4083448, 37.8001761, -122.4100802)).toBeCloseTo(200.12, 1); // 200.12m

            //Sydney
            expect(helper.distanceInMetersBetweenTwoPoints(-33.8524110, 151.2105351, -33.8523713, 151.2105618)).toBeCloseTo(5.06, 1); // 5.07m
            expect(helper.distanceInMetersBetweenTwoPoints(-33.8524110, 151.2105351, -33.8522538, 151.2106423)).toBeCloseTo(20.09, 1); // 20.09m
            expect(helper.distanceInMetersBetweenTwoPoints(-33.8524110, 151.2105351, -33.8516173, 151.2110498)).toBeCloseTo(100.25, 1); // 100.25m
            expect(helper.distanceInMetersBetweenTwoPoints(-33.8524110, 151.2105351, -33.8508186, 151.2115442)).toBeCloseTo(200.09, 1); // 200.09m
        });
    });

    describe("method pointIsInLocationRadius", () => {
        it("will return true if location is within range", () => {
            expect(helper.pointIsInLocationRadius(50.9361435, -1.3961910, 50.9360987, -1.3961843, 6)).toBeTruthy();
        });

        it("will return false if location is not within range", () => {
            expect(helper.pointIsInLocationRadius(50.9362792, -1.3962106, 50.9360987, -1.3961843, 6)).toBeFalsy();
        });
    });

});