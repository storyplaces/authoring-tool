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
import {inject, Factory, NewInstance} from "aurelia-framework";
import {MapGroup} from "../../mapping/layers/MapGroup";
import {TriStateMarker} from "./TriStateMarker";
import {MapCircle} from "../../mapping/markers/MapCircle";
import {AuthoringChapter} from "../../models/AuthoringChapter";
import {ChapterIcon} from "../icons/ChapterIcon";
import {ChapterMarker} from "./ChapterMarker";

@inject(Factory.of(MapCircle), Factory.of(TriStateMarker), Factory.of(ChapterMarker), NewInstance.of(MapGroup))
export class AuthoringLocationMarker extends MapGroup {

    public pageId: string;

    private mainMarker: TriStateMarker;
    private circle: MapCircle;

    private _latitude: number;
    private _longitude: number;
    private _radius: number;

    constructor(private circleFactory: (lat?, lon?, radius?) => MapCircle,
                private markerFactory: (lat?, lon?, active?, selected?, text?) => TriStateMarker,
                private chapterMarkerFactory: (lat: number, lon: number, colour: string, index: number, popup: string) => ChapterMarker,
                private chapterMarkerGroup: MapGroup,
                latitude: number, longitude: number, active: boolean, selected: boolean, radius: number, popupText: string, chapters: Array<AuthoringChapter>, unlockedBy: boolean) {
        super();

        this._latitude = latitude;
        this._longitude = longitude;
        this._radius = radius;

        this.mainMarker = markerFactory(latitude, longitude, active, selected, popupText);
        this.circle = circleFactory(latitude, longitude, radius);

        this.addItem(this.circle);
        this.addItem(this.mainMarker);
        this.addItem(this.chapterMarkerGroup);

        this.chapters = chapters
    }

    set latitude(latitude: number) {
        this._latitude = latitude;
        this.circle.latitude = latitude;
        this.mainMarker.latitude = latitude;
    }

    set longitude(longitude: number) {
        this._longitude = longitude;
        this.circle.longitude = longitude;
        this.mainMarker.longitude = longitude;
    }

    set radius(radius: number) {
        this._radius = radius;
        this.circle.radius = radius;
    }

    set chapters(chapters: Array<AuthoringChapter>) {
        this.chapterMarkerGroup.removeAllItems();
        for (let index = 0; index < chapters.length; index++) {
            let chapter = chapters[index];
            let marker = this.chapterMarkerFactory(this._latitude, this._longitude, chapter.colour, index, chapter.name);
            this.chapterMarkerGroup.addItem(marker);
        }
    }

    private chapterMarkerLatitude(baseLatitude: number, index: number): number {
        return baseLatitude + 0.0002;
    }

    private chapterMarkerLongitude(baseLongitude: number, index: number): number {
        return baseLongitude + (0.0002 * (index + 1));
    }

    public destroy() {
        this.circle.destroy();
        this.mainMarker.destroy();
        super.destroy();
    }
}