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

import {autoinject} from "aurelia-framework";
import {NavigationInstruction, Next, Redirect} from "aurelia-router";
import {CurrentUser} from "./CurrentUser";

@autoinject()
export class HasPrivilege {

    constructor(private currentUser: CurrentUser) {
    }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        let authorised = true;

        if (!this.currentUser.userId) {
            return next();
        }

        navigationInstruction.getAllInstructions().forEach(instruction => {
            let privileges = (instruction.config as any).privileges;

            if (!privileges) {
                return;
            }

            authorised = authorised && this.hasAllPrivileges(privileges) && this.hasAnyPrivileges(privileges);
        });

        if (!authorised) {
            return next.cancel(new Redirect('login'));
        }

        return next();
    }

    private hasAnyPrivileges(privileges): boolean {

        if (!privileges.any) {
            return true;
        }

        if (!Array.isArray(privileges.any)) {
            throw new Error("Privileges must be passed as any array");
        }

        return privileges.any.some(privilege => this.currentUser.hasPrivilege(privilege));
    }

    private hasAllPrivileges(privileges): boolean {
        if (!privileges.all) {
            return true;
        }

        if (!Array.isArray(privileges.all)) {
            throw new Error("Privileges must be passed as any array");
        }

        return privileges.all.every(privilege => this.currentUser.hasPrivilege(privilege));
    }
}