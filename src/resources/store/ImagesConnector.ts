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
import {inject, NewInstance} from "aurelia-framework";

import {HttpClient} from "aurelia-fetch-client";
import {Config} from "../../config/Config";
import {FetchConfig} from "aurelia-authentication";

export interface imageUploadResponse {
    message: string,
    imageId: string
}

export interface imageDownloadResponse {
    contentType: string,
    content: string
}

@inject(NewInstance.of(HttpClient), Config, FetchConfig)
export class ImagesConnector {

    private cache : Map<string, imageDownloadResponse> = new Map<string, imageDownloadResponse>()

    constructor(protected client: HttpClient, protected config: Config, private fetchConfig: FetchConfig) {
        this.configure();
    }

    private configure() {
        let headers = {};

        // headers['Content-Type'] = "application/json";
        headers['Accept'] = "application/json";

        this.client.configure(config => {
            config
                .withBaseUrl(this.config.read('server'))
                .withDefaults({
                    headers: headers
                })
                .useStandardConfiguration();
        });

        this.fetchConfig.configure(this.client);
    }


    upload(storyId: string, formData: FormData): Promise<imageUploadResponse> {
        return this.client.fetch(`/authoring/story/${storyId}/image`, {
            method: 'post',
            body: formData
        }).then(response => response.json() as Promise<imageUploadResponse>);
    }

    fetchThumb(storyId: string, imageId: string) {

        let key = `${storyId}.${imageId}`;

        if (this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }

        return this.client.fetch(this.makeThumbUrl(storyId, imageId), {method: 'get'})
            .then(response => response.json() as Promise<imageDownloadResponse>)
            .then(imageDownload => {
                this.cache.set(key, imageDownload);
                return imageDownload;
            })
    }

    fetchFull(storyId: string, imageId: string) {
        return this.client.fetch(this.makeFullUrl(storyId, imageId), {method: 'get'})
            .then(response => response.json() as Promise<imageDownloadResponse>)
            .then(imageDownload => {
                return imageDownload;
            })
    }


    private makeFullUrl(storyId: string, imageId: string) {
        return `/authoring/story/${storyId}/image/${imageId}`;
    }

    private makeThumbUrl(storyId: string, imageId: string) {
        return `/authoring/story/${storyId}/image/${imageId}/thumb`;
    }
}