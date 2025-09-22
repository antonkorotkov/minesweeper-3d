/**
 * A base singleton class to be extended by other classes.
 */
export default abstract class Singleton {
    protected static getSingleton<T>(this: any, ...args: any[]): T {
        if (!this.instance)
            this.instance = new this(...args);

        return this.instance as T;
    }
}
