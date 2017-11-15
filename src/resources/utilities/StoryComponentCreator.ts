import {AuthoringStory} from "../models/AuthoringStory";
import {Identifiable} from "../interfaces/Identifiable";
import {HasName} from "../interfaces/HasName";

export class StoryComponentCreator {
    public makeStoryVariables(story: AuthoringStory): Array<Identifiable & HasName> {
        let pageReadVariables = story.pages.all.map(page => {
            return {
                id: `page-read-${page.id}-variable`,
                name: `Auto: Page '${page.name}' read`
            }
        });

        let chapterUnlockedVariables = story.chapters.all.map(chapter => {
            return {
                id: `chapter-unlocked${chapter.id}-variable`,
                name: `Auto: Chapter '${chapter.name}' unlocked`
            }
        });

        return chapterUnlockedVariables.concat(pageReadVariables);
    }

    public makeStoryConditions(story: AuthoringStory): Array<Identifiable & HasName> {
        let pageReadConditions = story.pages.all.map(page => {
            return {
                id: `page-read-${page.id}`,
                name: `Auto: Page '${page.name}' read`
            }
        });

        let pageNotReadConditions = story.pages.all.map(page => {
            return {
                id: `page-not-read-${page.id}`,
                name: `Auto: Page '${page.name}' not read`
            }
        });

        let chapterUnlockedConditions = story.chapters.all.map(chapter => {
            return {
                id: `chapter-unlocked-${chapter.id}`,
                name: `Auto: Chapter '${chapter.name}' unlocked`
            }
        });

        let locationConditions = story.pages.all
            .filter(page => {
                return page.locationId !== null && page.locationId !== undefined && page.locationId !== "";
            })
            .map(page => {
                return {
                    id: `location-${page.locationId}`,
                    name: `Auto: User at page '${page.name}' location`
                }
            });

        return chapterUnlockedConditions.concat(pageReadConditions).concat(pageNotReadConditions).concat(locationConditions);
    }

    public makeStoryLocations(story: AuthoringStory): Array<Identifiable & HasName> {
        return story.pages.all
            .filter(page => {
                return page.locationId !== null && page.locationId !== undefined && page.locationId !== "";
            })
            .map(page => {
                return {
                    id: `${page.locationId}`,
                    name: `Auto: Page '${page.name}' location`
                }
            });
    }
}