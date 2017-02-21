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


import {ChapterIcon} from "../../../../src/resources/map/icons/ChapterIcon";
describe("ChapterIcon", () => {
    it("will create an icon in the first column, first row for index 0", () => {
        let icon = new ChapterIcon("red", 0);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-20, 45]);
    });

    it("will create an icon in the first column, second row for index 1", () => {
        let icon = new ChapterIcon("red", 1);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-20, 20]);
    });

    it("will create an icon in the second column, first row for index 2", () => {
        let icon = new ChapterIcon("red", 2);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-45, 45]);
    });

    it("will create an icon in the second column, first row for index 3", () => {
        let icon = new ChapterIcon("red", 3);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-45, 20]);
    });

    it("will create an icon in the second column, first row for index 3", () => {
        let icon = new ChapterIcon("red", 4);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-70, 45]);
    });

    it("will create an icon in the second column, first row for index 3", () => {
        let icon = new ChapterIcon("red", 5);
        expect(icon.leafletIcon.options.iconAnchor).toEqual([-70, 20]);
    });

    it("will create it with the correct urls based upon the passed colour", () => {
        let icon = new ChapterIcon("red", 0);
        expect(icon.leafletIcon.options.iconUrl).toContain("/red.png");
        expect(icon.leafletIcon.options.iconRetinaUrl).toContain("/red-2x.png");
    });

    it("will create it with the correct urls based upon the passed colour", () => {
        let icon = new ChapterIcon("blue", 0);
        expect(icon.leafletIcon.options.iconUrl).toContain("/blue.png");
        expect(icon.leafletIcon.options.iconRetinaUrl).toContain("/blue-2x.png");
    });

    it("will create it with the correct urls based upon the passed colour", () => {
        let icon = new ChapterIcon("yellow", 0);
        expect(icon.leafletIcon.options.iconUrl).toContain("/yellow.png");
        expect(icon.leafletIcon.options.iconRetinaUrl).toContain("/yellow-2x.png");
    });
});