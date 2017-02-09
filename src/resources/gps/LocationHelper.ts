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


export class LocationHelper {

    pointIsInLocationRadius(pointLat: number, pointLong: number, locationLat:number, locationLong: number, radius:number): boolean {
        let distance = this.distanceInMetersBetweenTwoPoints(pointLat, pointLong, locationLat, locationLong);
        return distance <= radius
    }

    distanceInMetersBetweenTwoPoints(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number {
        let R = 12742000; // Radius of the earth in km * 1000 * 2
        let dLat = this.deg2rad(latitude2 - latitude1);  // deg2rad below
        let dLon = this.deg2rad(longitude2 - longitude1);

        let dLatSin = Math.sin(dLat / 2);
        let dLonSin = Math.sin(dLon / 2);

        let a = dLatSin * dLatSin +
            Math.cos(this.deg2rad(latitude1)) * Math.cos(this.deg2rad(latitude2)) *
            dLonSin * dLonSin;

        return R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }


    private deg2rad(deg): number {
        return deg * 0.01745329251994329576923690768489; // PI/180
    }
}