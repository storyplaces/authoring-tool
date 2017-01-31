/**
 * Created by andy on 29/11/16.
 */

export abstract class AbstractConnector<T> {

    abstract get all(): Array<T>;
    abstract byId(id: string): T;

    abstract fetchAll(): Promise<Array<T>>;
    abstract fetchById(id: string): Promise<T>;

    abstract save(object: T): Promise<T>;
    abstract remove(id: string): Promise<boolean>;

}