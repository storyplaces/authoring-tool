export class EventMaker {

    fire(event: string, detail:any, element: Element) {
        element.dispatchEvent(this.makeEvent(event, detail));
    }

    private makeEvent(eventName: string, detail: any) {
        if ((window as any).CustomEvent) {
            return new CustomEvent(eventName, {bubbles: true, detail: detail});
        }

        let changeEvent = document.createEvent('CustomEvent');
        changeEvent.initCustomEvent(eventName, true, true, detail);
        return changeEvent;
    }
}