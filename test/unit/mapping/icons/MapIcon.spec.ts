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

import IconOptions = L.IconOptions;
import {MapIconDefaults} from "../../../../src/resources/mapping/settings/MapIconDefaults";
import {MapIcon} from "../../../../src/resources/mapping/icons/MapIcon";
import * as L from "leaflet";

describe("MapIcon", () => {
    it("will create a MapIcon object when instantiated", () => {
        let defaults = new MapIconDefaults;
        let options: IconOptions = {} as any;

        let icon = new MapIcon(defaults, options);

        expect(icon instanceof MapIcon).toBe(true);
    });

    it("will create a leaflet icon when instantiated", () => {
        let defaults = new MapIconDefaults;
        let options: IconOptions = {} as any;

        let icon = new MapIcon(defaults, options);

        expect(icon.leafletIcon instanceof L.Icon);
    });

    it("will create a leaflet icon based upon the default options when instantiated with no extra options", () => {
        let defaults = new MapIconDefaults;
        let options: IconOptions = {} as any;

        let icon = new MapIcon(defaults, options);

        expect(icon.leafletIcon.options.iconUrl).toEqual(defaults.iconUrl);
        expect(icon.leafletIcon.options.iconSize).toEqual(defaults.iconSize);
        expect(icon.leafletIcon.options.shadowUrl).toEqual(defaults.shadowUrl);
    });

    it("will create a leaflet icon based upon the default options and extra passed options", () => {
        let defaults = new MapIconDefaults;
        let testShadowUrl = "/this/is/a/test";

        let options: IconOptions = {shadowUrl: testShadowUrl} as any;

        let icon = new MapIcon(defaults, options);

        expect(icon.leafletIcon.options.iconUrl).toEqual(defaults.iconUrl);
        expect(icon.leafletIcon.options.iconSize).toEqual(defaults.iconSize);
        expect(icon.leafletIcon.options.shadowUrl).toEqual(testShadowUrl);
    });

    it("will destroy the icon when destroy() is called", () => {
        let defaults = new MapIconDefaults;
        let options: IconOptions = {} as any;

        let icon = new MapIcon(defaults, options);
        icon.destroy();

        expect(icon.leafletIcon).toBeUndefined();
    });
});