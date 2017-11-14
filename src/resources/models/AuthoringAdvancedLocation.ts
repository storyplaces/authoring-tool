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
 *    notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * - The name of the University of Southampton nor the name of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
import {inject} from "aurelia-framework";
import {BaseModel} from "./BaseModel";
import {TypeChecker} from "../utilities/TypeChecker";
import {Identifiable} from "../interfaces/Identifiable";
import {HasName} from "../interfaces/HasName";


@inject(
    TypeChecker
)
export class AuthoringAdvancedLocation extends BaseModel implements Identifiable, HasName {
    private _name: string;
    private _lat: number;
    private _long: number;
    private _radius: number;

    constructor(typeChecker: TypeChecker,
                data?: any) {
        super(typeChecker);
        this.fromObject(data);
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this.typeChecker.validateAsStringOrUndefined("Name", name);
        this._name = value;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this.typeChecker.validateAsNumberOrUndefined("Radius", value);
        this._radius = value;
    }

    get long(): number {
        return this._long;
    }

    set long(value: number) {
        this.typeChecker.validateAsNumberOrUndefined("Long", value);
        this._long = value;
    }

    get lat(): number {
        return this._lat;
    }

    set lat(value: number) {
        this.typeChecker.validateAsNumberOrUndefined("Lat", value);
        this._lat = value;
    }

    public fromObject(data = {
        id: undefined,
        lat: undefined,
        long: undefined,
        radius: undefined,
        name: undefined
    }) {
        this.typeChecker.validateAsObjectAndNotArray("Data", data);
        this.id = data.id;
        this.lat = data.lat;
        this.long = data.long;
        this.radius = data.radius;
        this.name = data.name;
    }

    public toJSON() {
        return {
            id: this.id,
            lat: this.lat,
            long: this.long,
            radius: this.radius,
            name: this.name,
        }
    }

}