/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) 2017
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
import {MapControlInterface} from "../../mapping/interfaces/MapControlInterface";
import Map = L.Map;

import * as L from "leaflet"

interface DisableableControl extends L.Control {
    enable();
    disable();
}

export class RecenterControl implements MapControlInterface {
    leafletControl: DisableableControl;

    constructor() {
        let RecenterControl = (L as any).Control.extend({

            link: undefined,
            map: undefined,

            mapReady: undefined,

            onAdd: function (map: Map) {

                this.mapReady = new Promise<any>((resolve) => map.whenReady(resolve)).then(event => event.target);

                let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                this.link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
                L.DomUtil.create('span', 'glyphicon glyphicon-record', this.link);

                this.link.title = "Recenter";

                L.DomEvent
                    .on(this.link, 'click dblclick', (e) => {L.DomEvent.stopPropagation(e); L.DomEvent.preventDefault(e);})
                    .on(this.link, 'click', this.onClick, this);

                return container;
            },

            onRemove: function (map) {
                L.DomEvent
                    .off(this.link, 'click dblclick', (e) => {L.DomEvent.stopPropagation(e); L.DomEvent.preventDefault(e);})
                    .off(this.link, 'click', this.onClick, this);
            },

            onClick() {
                this.mapReady.then(map => map.fireEvent('recenter-control-click'));
            },

            disable() {
                this.link.classList.add('leaflet-disabled');
                L.DomEvent.off(this.link, 'click', this.onClick, this)
            },

            enable() {
                this.link.classList.remove('leaflet-disabled');
                L.DomEvent.on(this.link, 'click', this.onClick, this)
            }
        });

        this.leafletControl = new RecenterControl({position: 'topleft'});
    }

    disable() {
        this.leafletControl.disable();
    }

    enable() {
        this.leafletControl.enable();
    }
}