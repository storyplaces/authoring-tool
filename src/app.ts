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
import {AuthoringStoryConnector} from "./resources/store/AuthoringStoryConnector";
import {UserConfig} from "./resources/store/UserConfig";

@autoinject()
export class App {
    router: Router;

    constructor(private storyConnector: AuthoringStoryConnector, private userConfig: UserConfig) {
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'StoryPlaces';

        config.map([
            {route: '/', name: 'home', moduleId: 'pages/static/home', title: 'Home'},

            {route: '/help', name: 'help', moduleId: 'pages/static/help', title: 'Help'},
            {route: '/about', name: 'about', moduleId: 'pages/static/about', title: 'About'},

            {route: '/story', moduleId: 'pages/story/story-list-page', title: 'Stories', name: 'story-list'},
            {route: '/story/new', moduleId: 'pages/story/story-create-page', title: 'New Story', name: 'story-create'},
            {route: '/story/:storyId/details', moduleId: 'pages/story/story-details-page', title: 'Story Details', name: 'story-details'},


            {route: '/story/:storyId/chapters', moduleId: 'pages/story/story-chapters-page', title: 'Story Chapters', name: 'story-chapters'},
            {route: '/story/:storyId/chapter/:chapterId', moduleId: 'pages/chapter/chapter-edit-page', title: 'Edit Chapter', name: 'chapter-edit'},
            {route: '/story/:storyId/chapter/new', moduleId: 'pages/chapter/chapter-edit-page', title: 'New Chapter', name: 'chapter-new'},


            {route: '/story/:storyId/pages', moduleId: 'pages/story/story-edit-page', title: 'Story Pages', name: 'story-pages'},
            {route: '/story/:storyId/page/:pageId', moduleId: 'pages/page/page-edit-page', title: 'Edit Page', name: 'page-edit'},
            {route: '/story/:storyId/page/new', moduleId: 'pages/page/page-edit-page', title: 'New Page', name: 'page-new'},
        ]);

        this.router = router;
    }

    attached() {

    }

}
