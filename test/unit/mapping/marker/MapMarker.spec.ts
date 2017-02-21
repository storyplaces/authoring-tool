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

import {MapMarkerDefaults} from "../../../../src/resources/mapping/settings/MapMarkerDefaults";
import {MapMarker} from "../../../../src/resources/mapping/markers/MapMarker";
import {MapIcon} from "../../../../src/resources/mapping/icons/MapIcon";
import {MapIconDefaults} from "../../../../src/resources/mapping/settings/MapIconDefaults";
describe("MapMarker", () => {
    it("Creates a MapMarker instance when instantiated", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);

        expect(marker instanceof MapMarker).toEqual(true);
    });

    it("Creates a Leaflet marker instance when instantiated", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);

        expect(marker.leafletLayer instanceof L.Marker).toEqual(true);
    });

    it("Creates a Leaflet marker instance when instantiated", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);

        expect(marker.leafletLayer instanceof L.Marker).toEqual(true);
    });

    it("Creates a Leaflet marker with default settings when no extra settings are passed", () => {
        let defaults = new MapMarkerDefaults as any;
        let options = {};

        defaults.title = "test";

        let marker = new MapMarker(defaults, 1, 2, options);

        expect((marker.leafletLayer as any).options.title).toEqual("test"); // Looks as though the typings don't have types for options which appears to be where things get stored before the marker gets created when its added to a map
    });

    it("Creates a Leaflet marker with the passed settings merged into the defaults", () => {
        let defaults = new MapMarkerDefaults as any;
        let options = {} as any;

        defaults.title = "test";
        options.title = "this should override";

        let marker = new MapMarker(defaults, 1, 2, options);

        expect((marker.leafletLayer as any).options.title).toEqual("this should override"); // Looks as though the typings don't have types for options which appears to be where things get stored before the marker gets created when its added to a map
    });

    it("Can have its latitude read", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);

        expect(marker.latitude).toEqual(1);
    });

    it("Can have its latitude set", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);
        marker.latitude = 12;

        expect(marker.latitude).toEqual(12);
    });

    it("Can have its longitude read", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);

        expect(marker.longitude).toEqual(2);
    });

    it("Can have its longitude set", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};

        let marker = new MapMarker(defaults, 1, 2, options);
        marker.longitude = 12;

        expect(marker.longitude).toEqual(12);
    });

    it("Can have its icon set", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};
        let icon = new MapIcon(new MapIconDefaults, {} as any);

        let marker = new MapMarker(defaults, 1, 2, options);
        marker.icon = icon;

        expect((marker.leafletLayer as any).options.icon).toBe(icon.leafletIcon); // Looks as though the typings don't have types for options which appears to be where things get stored before the marker gets created when its added to a map
    });

    it("can have destroy called on it", () => {
        let defaults = new MapMarkerDefaults;
        let options = {};
        let marker = new MapMarker(defaults, 1, 2, options);

        marker.destroy();
        expect(marker.leafletLayer).toBeUndefined();
    });
});