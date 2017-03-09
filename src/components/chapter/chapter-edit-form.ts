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
import {bindable, inject, computedFrom} from "aurelia-framework";
import {AuthoringPage} from "../../resources/models/AuthoringPage";
import {AuthoringStory} from "../../resources/models/AuthoringStory";
import "typeahead.js";
import {BindingSignaler} from "aurelia-templating-resources";
import {AuthoringChapter} from "../../resources/models/AuthoringChapter";
import {StoryLookup} from "../../resources/utilities/StoryLookup";


@inject(StoryLookup, BindingSignaler)
export class ChapterEditFormCustomElement {
    @bindable chapter: AuthoringChapter;
    @bindable story: AuthoringStory;

    chapterPageAddField: string;
    chapterPageAddObject: AuthoringPage;
    chapterPageText: HTMLInputElement;

    constructor(private storyLookup: StoryLookup,
                private bindingSignaler: BindingSignaler) {

    }

    attached() {
        ($(this.chapterPageText as any) as any).typeahead({
                hint: false,
                highlight: false,
                minLength: 1
            },
            {
                name: 'chapterPages',
                display: 'name',
                templates: {
                    empty: ['<div class="empty-message">',
                        'No pages matching your input.',
                        '</div>'].join('\n'),
                    suggestion: (value: AuthoringPage) => "<div><strong>" + value.name + "</strong> - " + value.pageHint + "</div>"
                },
                source: (query, cb) => {
                    let matches = [];
                    let substrRegex = new RegExp(query, 'i');

                    this.getAvailablePages().forEach((page) => {
                            if (substrRegex.test(page.name)) {
                                matches.push(page);
                            }
                        }
                    );
                    cb(matches);
                }
            }
        ).on('typeahead:selected',
            (e, value) => {
                this.chapterPageAddObject = value;
                this.addChapterPage();
            });
    }

    detached() {
    }


    @computedFrom('chapter.unlockedByPageIds')
    get chapterPages(): Array < AuthoringPage > {
        let pages = [];
        this.chapter.pageIds.forEach(pageId => {
            // Some validation to ensure the page is a valid page in the story
            if (this.storyLookup.pageIdsForStory(this.story).indexOf(pageId) != -1) {
                pages.push(this.story.pages.get(pageId));
            }
        });
        console.log("Pages in chapter: ", pages);
        return pages;
    }

    getAvailablePages(): Array < AuthoringPage > {
        let matches = this.story.pages.all.filter((page) => {
            return (this.chapterPages.indexOf(page) == -1);
        });
        return matches;
    }

    addChapterPage() {
        this.chapter.pageIds.push(this.chapterPageAddObject.id);
        this.chapterPageAddField = "";
        ($(this.chapterPageText as any) as any).typeahead("val", "");
        this.bindingSignaler.signal('chapterPageChanged');
    }

}