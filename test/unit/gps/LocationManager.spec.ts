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

import {GpsState, Gps} from "../../../src/resources/gps/Gps";
import {LocationManager} from "../../../src/resources/gps/LocationManager";
import {Container, BindingEngine} from "aurelia-framework";
import {LocationInformation} from "../../../src/resources/gps/LocationInformation";
import {CurrentMapLocation} from "../../../src/resources/map/CurrentMapLocation";

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

describe("LocationManager", () => {

    class MockGps {
        public state: GpsState = GpsState.INITIALISING;
        public location: LocationInformation = {longitude: 1, latitude: 1, heading: 1, accuracy: 1};

        public attach() {
        }

        public detach() {
        }
    }

    class MockMapLocation {
        public location: LocationInformation = {longitude: 2, latitude: 2, heading: 2, accuracy: 2};
    }

    class MockUserConfig {
        public locationDemo: boolean = false;
    }

    let mockGps: MockGps;
    let mockMapLocation: MockMapLocation;
    let mockUserConfig: MockUserConfig;
    let container: Container = new Container().makeGlobal();
    let bindingEngine: BindingEngine = resolve(BindingEngine);

    function resolve(object: Function, data?: any) {
        return container.invoke(object, [data]);
    }

    beforeEach(() => {
        mockGps = new MockGps();
        mockMapLocation = new MockMapLocation();
        mockUserConfig = new MockUserConfig();
    });

    afterEach(() => {
        mockGps = undefined;
        mockMapLocation = undefined;
        mockUserConfig = undefined;
    });

    describe("when system is in GPS mode", () => {
        let location: LocationManager;

        beforeEach(() => {
            mockUserConfig.locationDemo = false;
            location = new LocationManager(mockGps as Gps, mockMapLocation as CurrentMapLocation, bindingEngine, mockUserConfig);
        });

        it("will return OK when the GPS is OK", (done) => {
            mockGps.state = GpsState.OK;

            window.setTimeout(() => {
                expect(location.ok).toEqual(true, "for OK");
                expect(location.gpsPermissionDenied).toEqual(false, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(false, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(false, "for Unsupported");
                done();
            }, 1);
        });

        it("will return OK when the GPS is Initialising", (done) => {
            mockGps.state = GpsState.INITIALISING;

            window.setTimeout(() => {
                expect(location.ok).toEqual(true, "for OK");
                expect(location.gpsPermissionDenied).toEqual(false, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(false, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(false, "for Unsupported");
                done();
            }, 1);
        });

        it("will return Permission Denied when GPS has Permission Denied", (done) => {
            mockGps.state = GpsState.PERMISSION_DENIED;

            window.setTimeout(() => {
                expect(location.ok).toEqual(false, "for OK");
                expect(location.gpsPermissionDenied).toEqual(true, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(false, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(false, "for Unsupported");
                done();
            }, 1);
        });


        it("will return Unavailable when the GPS is Unavailable", (done) => {
            mockGps.state = GpsState.ERROR;

            window.setTimeout(() => {
                expect(location.ok).toEqual(false, "for OK");
                expect(location.gpsPermissionDenied).toEqual(false, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(true, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(false, "for Unsupported");
                done();
            }, 1);
        });


        it("will return Unavailable when the GPS is Unavailable", (done) => {
            mockGps.state = GpsState.POSITION_UNSUPPORTED;

            window.setTimeout(() => {
                expect(location.ok).toEqual(false, "for OK");
                expect(location.gpsPermissionDenied).toEqual(false, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(false, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(true, "for Unsupported");
                done();
            }, 1);
        });

        it("will show changes in location from GPS", (done) => {
            mockGps.state = GpsState.OK;
            mockGps.location = {longitude: 123, latitude: 456, heading: 789, accuracy: 321} as LocationInformation;

            window.setTimeout(() => {
                expect(location.location.longitude).toEqual(123);
                expect(location.location.latitude).toEqual(456);
                expect(location.location.heading).toEqual(789);
                expect(location.location.accuracy).toEqual(321);

                done();
            }, 1);
        });

        it("will not show changes in location from the MapGPS", (done) => {
            mockGps.state = GpsState.OK;
            let previousLocation = location.location;

            mockMapLocation.location = {longitude: 123, latitude: 456, heading: 789, accuracy: 321} as LocationInformation;

            window.setTimeout(() => {
                expect(location.location.longitude).toEqual(previousLocation.longitude);
                expect(location.location.latitude).toEqual(previousLocation.latitude);
                expect(location.location.heading).toEqual(previousLocation.heading);
                expect(location.location.accuracy).toEqual(previousLocation.accuracy);

                done();
            }, 1);
        });
    });

    describe("when system is in Map mode", () => {
        let location: LocationManager;

        beforeEach(() => {
            mockUserConfig.locationDemo = true;
            location = new LocationManager(mockGps as Gps, mockMapLocation as CurrentMapLocation, bindingEngine, mockUserConfig);
        });

        it("will always return OK", (done) => {
            window.setTimeout(() => {
                expect(location.ok).toEqual(true, "for OK");
                expect(location.gpsPermissionDenied).toEqual(false, "for Permission Denied");
                expect(location.gpsUnavailable).toEqual(false, "for Unavailable");
                expect(location.gpsUnsupported).toEqual(false, "for Unsupported");
                done();
            }, 1);
        });


        it("will not show changes in location from GPS", (done) => {
            mockGps.state = GpsState.OK;
            let previousLocation = location.location;

            mockGps.location = {longitude: 123, latitude: 456, heading: 789, accuracy: 321} as LocationInformation;

            window.setTimeout(() => {
                expect(location.location.longitude).toEqual(previousLocation.longitude);
                expect(location.location.latitude).toEqual(previousLocation.latitude);
                expect(location.location.heading).toEqual(previousLocation.heading);
                expect(location.location.accuracy).toEqual(previousLocation.accuracy);

                done();
            }, 1);
        });

        it("will show changes in location from the Map", (done) => {
            mockGps.state = GpsState.OK;

            mockMapLocation.location = {longitude: 123, latitude: 456, heading: 789, accuracy: 321} as LocationInformation;

            window.setTimeout(() => {
                expect(location.location.longitude).toEqual(123);
                expect(location.location.latitude).toEqual(456);
                expect(location.location.heading).toEqual(789);
                expect(location.location.accuracy).toEqual(321);
                done();
            }, 1);
        });
    });
});