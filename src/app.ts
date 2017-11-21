/*
 * StoryPlaces
 *
 * This application was developed as part of the Leverhulme Trust funded
 * StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 * Copyright (c) 2017
 * University of Southampton
 * Charlie Hargood, cah07r.ecs.soton.ac.uk
 * Kevin Puplett, k.e.puplett.soton.ac.uk
 * David Pepper, d.pepper.soton.ac.uk
 * Andy Day, a.r.day.soton.ac.uk
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  - The name of the University of Southampton nor the name of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 *  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Router, RouterConfiguration} from "aurelia-router";
import {autoinject} from "aurelia-framework";
import {UserConfig} from "./resources/store/UserConfig";
import {AuthenticateStep} from 'aurelia-authentication';
import {CurrentUser} from "./resources/auth/CurrentUser";
import {HasPrivilege} from "./resources/auth/HasPrivilege";
import {AuthManager} from "./resources/auth/AuthManager";

@autoinject()
export class App {
    router: Router;

    constructor(private userConfig: UserConfig, private currentUser: CurrentUser, private authManager: AuthManager) {
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'StoryPlaces';

        config.addPipelineStep('authorize', AuthenticateStep);
        config.addPipelineStep('authorize', HasPrivilege);

        config.map([
            {route: '/', name: 'home', moduleId: 'pages/static/home', title: 'Home'},

            {route: '/help', name: 'help', moduleId: 'pages/static/help', title: 'Help'},
            {route: '/about', name: 'about', moduleId: 'pages/static/about', title: 'About'},
            {route: '/privacy', name: 'privacy', moduleId: 'pages/static/privacy', title: 'Privacy'},

            {route: '/story', moduleId: 'pages/story/story-list-page', title: 'Stories', name: 'story-list', auth: true, privileges:{all:["listOwnStories"]}},
            {route: '/story/new', moduleId: 'pages/story/story-create-page', title: 'New Story', name: 'story-create', auth: true, privileges:{all:["createStory"]}},
            {route: '/story/:storyId/details', moduleId: 'pages/story/story-details-page', title: 'Story Details', name: 'story-details', auth: true, privileges:{all:["editOwnStory"]}},

            {route: '/story/:storyId/chapters', moduleId: 'pages/story/story-chapters-page', title: 'Story Chapters', name: 'story-chapters', auth: true, privileges:{all:["editOwnStory"]}},
            {route: '/story/:storyId/chapter/:chapterId', moduleId: 'pages/chapter/chapter-edit-page', title: 'Edit Chapter', name: 'chapter-edit', auth: true, privileges:{all:["editOwnStory"]}},
            {route: '/story/:storyId/chapter/new', moduleId: 'pages/chapter/chapter-edit-page', title: 'New Chapter', name: 'chapter-new', auth: true, privileges:{all:["editOwnStory"]}},

            {route: '/story/:storyId/pages', moduleId: 'pages/story/story-edit-page', title: 'Story Pages', name: 'story-pages', auth: true, privileges:{all:["editOwnStory"]}},
            {route: '/story/:storyId/page/:pageId', moduleId: 'pages/page/page-edit-page', title: 'Edit Page', name: 'page-edit', auth: true, privileges:{all:["editOwnStory"]}},
            {route: '/story/:storyId/page/new', moduleId: 'pages/page/page-edit-page', title: 'New Page', name: 'page-new', auth: true, privileges:{all:["editOwnStory"]}},

            {route: '/admin/story', moduleId: 'pages/admin/admin-story-list-page', title: 'Story Approval', name: 'admin-story-list', auth: true, privileges:{all:["updateReadingStoryPublishStatus"]} },
            {route: '/admin/user', moduleId: 'pages/admin/admin-user-list-page', title: 'User Management', name: 'admin-user-list', auth: true, privileges:{all:["getUserList"]} },

            {route: '/login', moduleId: 'pages/auth/login', title: 'Log In', name: 'login'},
            {route: '/post-login', moduleId: 'pages/auth/postLogin', title: 'Post login', name: 'post-login'},

            {route: '/logout', moduleId: 'pages/auth/logout', title: 'Log Out', name: 'logout', auth: true },
            {route: '/user', moduleId: 'pages/user/user-edit-page', title: 'Your Details', name: 'user-edit', auth: true, privileges:{all:["updateOwnUser"]}}
        ]);

        config.fallbackRoute('/story');

        this.router = router;
    }


    attached() {
        this.authManager.init();
    }

    canSeeAdminMenu() {
        return this.currentUser.hasPrivilege('adminMenu');
    }
}
