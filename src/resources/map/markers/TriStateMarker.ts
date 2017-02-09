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
import {MapMarker} from "../../mapping/markers/MapMarker";
import {MapMarkerDefaults} from "../../mapping/settings/MapMarkerDefaults";
import {inject} from "aurelia-framework";
import {GreenIcon} from "../icons/GreenIcon";
import {RedIcon} from "../icons/RedIcon";
import {MapIcon} from "../../mapping/icons/MapIcon";
import {StatefulMarker} from "../interfaces/StatefulMarker";
import {PopupMarker} from "../interfaces/PopupMarker";
import {BlueIcon} from "../icons/BlueIcon";

@inject(MapMarkerDefaults, RedIcon, GreenIcon, BlueIcon)
export class TriStateMarker extends MapMarker implements PopupMarker{

    public pageId: string;

    private _active: boolean = false;

    constructor(markerDefaults: MapMarkerDefaults, private inactiveIcon: RedIcon, private activeIcon: GreenIcon, private selectedIcon: BlueIcon,
                latitude: number, longitude: number, active: boolean, selected: boolean, popupText: string) {
        super(markerDefaults, latitude, longitude, {icon: inactiveIcon.leafletIcon});
        this.active = active;
        this.selected = selected;
        this.popupText = popupText;
    }

    set active(active: boolean) {
        this._active = active;
        this.icon = active ? this.activeIcon : this.inactiveIcon;
    }

    set selected(selected: boolean) {
        if (selected) {
            this.icon = this.selectedIcon;
            return
        }

        this.active = this._active;
    }

    set popupText(text: string) {
        this.marker.unbindPopup();
        this.marker.bindPopup(text);
    }
}