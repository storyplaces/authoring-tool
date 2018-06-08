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

import {autoinject, bindable, bindingMode} from "aurelia-framework";
import {AudioConnector, audioDownloadResponse} from "../../../resources/store/AudioConnector";
import {DeleteConfirm} from "../../modals/delete-confirm";
import {DialogService} from "aurelia-dialog";
import {Config} from "../../../config/Config";

@autoinject()
export class AudioUpload {
    @bindable storyId: string;
    @bindable disabled: boolean;

    @bindable({defaultBindingMode: bindingMode.twoWay}) audioIds;
    @bindable({defaultBindingMode: bindingMode.twoWay}) currentAudioId;

    private audioContent;

    private fileButton: HTMLInputElement;
    private formElement: HTMLFormElement;

    constructor(private audioConnector: AudioConnector,
                private element: Element,
                private dialogService: DialogService,
                private config: Config) {
    }

    attached() {
        this.fetchAudio();
    }

    private fileChanged(evt) {

        if (this.fileButton.files.length == 0) {
            return;
        }

        if (this.fileButton.files.length > 1) {
            throw new Error("It is only possible to upload one file at a time");
        }

        let file = this.fileButton.files[0];

        if (!file.type.match(/audio.*/)) {
            throw new Error("It is only possible to upload audio files");
        }

        let audioFormData = this.convertFileToFormData(file);

        this.audioConnector.upload(this.storyId, audioFormData)
            .then(response => {
                if (this.currentAudioId) {
                    this.deleteItemFromStory(this.currentAudioId);
                    this.deleteAudioFromPage();
                }
                this.currentAudioId = response.audioId;
                this.audioIds.push(response.audioId);
                this.fetchAudio();
            });
    }

    private convertFileToFormData(audioFile) {
        let formData = new FormData();
        formData.append("audio", audioFile);
        return formData;
    }

    private deleteAudio(audioId) {
        this.promptDelete().then(result => {
            if (result) {
                this.deleteItemFromStory(audioId);
                this.deleteAudioFromPage();
            }
        });
    }

    private deleteItemFromStory(audioId) {
        let index = this.audioIds.indexOf(audioId);
        if (index !== -1) {
            this.audioIds.splice(index, 1);
        }
    }

    private promptDelete() {
        let question = "Are you sure you wish to delete this audio file?";

        return this.dialogService.open({viewModel: DeleteConfirm, model: question})
            .whenClosed(response => {
                if (!response.wasCancelled) {
                    return true;
                }
                return false;
            });

    }

    private deleteAudioFromPage() {
        this.currentAudioId = "";
        this.audioContent = "";
    }

    private fetchAudio(): void {
        if (!this.currentAudioId) {
            this.audioContent  = "";
            return;
        }
        this.audioConnector.fetchFull(this.storyId, this.currentAudioId)
            .then((response: audioDownloadResponse) => {
                this.audioContent = `data:${response.contentType};base64,${response.content}`;
        });
    }
}