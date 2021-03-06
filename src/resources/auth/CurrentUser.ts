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
import * as jwtDecode from "jwt-decode";
import {Factory, inject, NewInstance} from "aurelia-framework";
import {StoryPlacesAPI} from "../store/StoryplacesAPI";
import {AuthoringUser} from "../models/AuthoringUser";
import {TypeChecker} from "../utilities/TypeChecker";

@inject(NewInstance.of(StoryPlacesAPI), Factory.of(AuthoringUser), TypeChecker)
export class CurrentUser {

    private _userId: string;
    public loggedIn: boolean;
    private user: AuthoringUser;

    constructor(private storyPlacesAPI: StoryPlacesAPI, private authoringUserFactory: () => AuthoringUser, private typeChecker: TypeChecker) {
        storyPlacesAPI.path = "/authoring/user/";
        this.clearData();
    }

    public setFromJwt(jwt: string) {
        let payload: any;

        try {
            payload = jwtDecode(jwt);
        } catch (e) {
            return Promise.reject("Bad token");
        }

        this._userId = payload.sub;

        // Fetch user info from the server
        this.user.id = this._userId;
        return this.fetch()
            .then((user) => {
                this.user.bio = user.bio;
                this.user.name = user.name;
                this.user.privileges = user.privileges || [];
            })
            .then(() => {
                this.loggedIn = true;
                return true
            });
    }

    get userId(): string {
        return this._userId;
    }

    get displayName(): string {
        return this.user.name;
    }

    set displayName(name: string) {
        this.typeChecker.validateAsStringOrUndefined("Display Name", name);
        this.user.name = name;
    }

    get bio(): string {
        return this.user.bio;
    }

    set bio(bio: string) {
        this.typeChecker.validateAsStringOrUndefined("Bio", bio);
        this.user.bio = bio;
    }

    public hasPrivilege(privilege: string): boolean {
        return (this.user.privileges.indexOf(privilege) != -1);
    }

    private clearData() {
        this.user = this.authoringUserFactory();
        this.loggedIn = false;
    }

    public logOut() {
        this.clearData();
    }

    public fetch(): Promise<any> {
        return this.storyPlacesAPI.getOne(this._userId).then((user) => {
            return user.json();
        })
    }

    public save(): Promise<Response> {
        return this.storyPlacesAPI.save(this.user);
    }

}