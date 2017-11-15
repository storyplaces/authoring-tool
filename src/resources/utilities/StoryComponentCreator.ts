import {AuthoringStory} from "../models/AuthoringStory";
import {Identifiable} from "../interfaces/Identifiable";
import {HasName} from "../interfaces/HasName";

export class StoryComponentCreator {
    public makeStoryVariables(story: AuthoringStory): Array<Identifiable & HasName> {
        let pageReadVariables = story.pages.all.map(page => {
            return {
                id: this.generatePageReadVariableId(page.id),
                name: `Auto: Page '${page.name}' read`
            }
        });

        let chapterUnlockedVariables = story.chapters.all.map(chapter => {
            return {
                id: this.generateChapterUnlockedVariableId(chapter.id),
                name: `Auto: Chapter '${chapter.name}' unlocked`
            }
        });

        return chapterUnlockedVariables.concat(pageReadVariables);
    }

    public makeStoryConditions(story: AuthoringStory): Array<Identifiable & HasName> {
        let pageReadConditions = story.pages.all.map(page => {
            return {
                id: this.generatePageReadConditionId(page.id),
                name: `Auto: Page '${page.name}' read`
            }
        });

        let pageNotReadConditions = story.pages.all.map(page => {
            return {
                id: this.generatePageNotReadConditionId(page.id),
                name: `Auto: Page '${page.name}' not read`
            }
        });

        let chapterUnlockedConditions = story.chapters.all.map(chapter => {
            return {
                id: this.generateChapterUnlockedConditionId(chapter.id),
                name: `Auto: Chapter '${chapter.name}' unlocked`
            }
        });

        let locationConditions = story.pages.all
            .filter(page => {
                return page.locationId !== null && page.locationId !== undefined && page.locationId !== "";
            })
            .map(page => {
                return {
                    id: this.generateLocationCondition(page.locationId),
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
                    id: this.generateLocationId(page.locationId),
                    name: `Auto: Page '${page.name}' location`
                }
            });
    }

    public generateLocationId(locationId) {
        return `${locationId}`;
    }

    public generateLocationCondition(locationId) {
        return `location-${locationId}`;
    }

    public generateChapterUnlockedConditionId(chapterId: string) {
        return `chapter-unlocked-${chapterId}`;
    }

    public generatePageNotReadConditionId(pageId: string) {
        return `page-not-read-${pageId}`;
    }

    public generatePageReadConditionId(pageId: string) {
        return `page-read-${pageId}`;
    }

    public generatePageReadVariableId(pageId: string) {
        return `page-read-${pageId}-variable`;
    }

    public generateChapterUnlockedVariableId(chapterId:string) {
        return `chapter-unlocked-${chapterId}-variable`;
    }
}