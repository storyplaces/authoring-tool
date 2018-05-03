import {Identifiable} from "../interfaces/Identifiable";
import {HasName} from "../interfaces/HasName";

export type ItemInUse =
    {
        item: Identifiable & HasName,
        inUse: boolean,
        usedIn: Array<string>
    };

