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

import {ImagesConnector} from "../../../resources/store/ImagesConnector";
import {autoinject, bindable} from "aurelia-framework";

@autoinject()
export class ImagePickerUploadCustomElement {
    @bindable storyId: string;
    @bindable disabled: boolean;
    @bindable camera: string;
    private fileButton: HTMLInputElement;
    private formElement: HTMLFormElement;
    private Orientation_Up = 1;
    private Orientation_Right = 8;
    private Orientation_Left = 6;
    private Orientation_UpsideDown = 3;

    constructor(private imagesConnector: ImagesConnector, private element: Element) {
    }

    private fileChanged(evt) {

        if (this.fileButton.files.length == 0) {
            return;
        }

        if (this.fileButton.files.length > 1) {
            throw new Error("It is only possible to upload one file at a time");
        }

        let file = this.fileButton.files[0];

        if (!file.type.match(/image.*/)) {
            throw new Error("It is only possible to upload image files");
        }

        this.getOrientation(file)
            .then(orientation => {
                return this.loadImageFromFile(file)
                    .then(img => {
                        return this.resizeImageToCanvas(img, orientation);
                    })
            })
            .then(canvas => {
                return this.convertCanvasToBlob(canvas);
            })
            .then(imageBlob => {
                return this.convertBlobToFormData(imageBlob);
            })
            .then(formData => {
                return this.imagesConnector.upload(this.storyId, formData);
            })
            .then(response => {
                this.uploadComplete(response.imageId);
            });

    }

    private convertBlobToFormData(imageBlob) {
        let formData = new FormData();
        formData.append("image", imageBlob);
        return formData;
    }

    private loadImageFromFile(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = document.createElement("img");
            img.onload = () => {
                resolve(img)
            };
            img.onabort = () => {
                reject(new Error("unable to load image"))
            };
            img.src = window.URL.createObjectURL(file);
        });
    }

    private uploadComplete(imageId: string) {
        this.element.dispatchEvent(this.createUploadEvent(imageId));
    }

    private createUploadEvent(imageId: string) {
        if ((window as any).CustomEvent) {
            return new CustomEvent('upload', {bubbles: true, detail: imageId});
        }

        let changeEvent = document.createEvent('CustomEvent');
        changeEvent.initCustomEvent('upload', true, true, imageId);
        return changeEvent;
    }

    private resizeImageToCanvas(img: HTMLImageElement, orientation: number): HTMLCanvasElement {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;

        let originX;
        let originY;
        let imageWidth;
        let imageHeight;

        let rotation = this.calculateRotation(orientation);

        let canvas = document.createElement("canvas") as HTMLCanvasElement;
        let canvasWidth = img.width;
        let canvasHeight = img.height;
        let ctx = canvas.getContext("2d");

        if (rotation == 90 || rotation == 270) {
            canvasWidth = img.height;
            canvasHeight = img.width;
        }

        if (canvasWidth > canvasHeight) {
            if (canvasWidth > MAX_WIDTH) {
                canvasHeight *= MAX_WIDTH / canvasWidth;
                canvasWidth = MAX_WIDTH;
            }
        } else {
            if (canvasHeight > MAX_HEIGHT) {
                canvasWidth *= MAX_HEIGHT / canvasHeight;
                canvasHeight = MAX_HEIGHT;
            }
        }

        if (rotation == 0) {
            originX = 0;
            originY = 0;
            imageWidth = canvasWidth;
            imageHeight = canvasHeight;
        }

        if (rotation == 90) {
            originX = 0;
            originY = -canvasWidth;
            imageWidth = canvasHeight;
            imageHeight = canvasWidth;
        }

        if (rotation == 180) {
            originX = -canvasWidth;
            originY = -canvasHeight;
            imageWidth = canvasWidth;
            imageHeight = canvasHeight;
        }

        if (rotation == 270) {
            originX = -canvasHeight;
            originY = 0;
            imageWidth = canvasHeight;
            imageHeight = canvasWidth;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.rotate(rotation * Math.PI/180);

        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        (ctx as any).msImageSmoothingEnabled = true;
        ctx.imageSmoothingEnabled = true;
        (ctx as any).imageSmoothingQuality = "high";

        ctx.drawImage(img, originX, originY, imageWidth, imageHeight);

        return canvas;
    }

    private convertCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise(success => {
            if (!HTMLCanvasElement.prototype.toBlob) {
                this.toBlobPolyfill(canvas, success)
            }

            canvas.toBlob(success)
        });
    }

    private toBlobPolyfill(canvas: HTMLCanvasElement, success: (value?: (PromiseLike<any> | any)) => void) {
        setTimeout(() => {
            let binStr = atob(canvas.toDataURL('image/png').split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            success(new Blob([arr], {type: 'image/png'}));
        });
    }

    private getOrientation(file): Promise<number> {
        return new Promise(success => {
            let reader = new FileReader();

            reader.onload = function (e) {
                let view = new DataView((e.target as any).result);
                if (view.getUint16(0, false) != 0xFFD8) return success(-2);
                let length = view.byteLength, offset = 2;
                while (offset < length) {
                    let marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker == 0xFFE1) {
                        if (view.getUint32(offset += 2, false) != 0x45786966) return success(-1);
                        let little = view.getUint16(offset += 6, false) == 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        let tags = view.getUint16(offset, little);
                        offset += 2;
                        for (let i = 0; i < tags; i++)
                            if (view.getUint16(offset + (i * 12), little) == 0x0112)
                                return success(view.getUint16(offset + (i * 12) + 8, little));
                    }
                    else if ((marker & 0xFF00) != 0xFF00) break;
                    else offset += view.getUint16(offset, false);
                }
                return success(-1);
            };

            reader.readAsArrayBuffer(file);
        });
    }

    private calculateRotation(orientation: number) {
        switch (orientation) {
            case this.Orientation_Up:
                return 0;
            case this.Orientation_Left:
                return 90;
            case this.Orientation_UpsideDown:
                return 180;
            case this.Orientation_Right:
                return 270;
            default:
                throw new Error("Unsupported rotation");
        }
    }
}