import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { get, set } from "lodash/fp";

export type Update = {
  path: string[],
  newValue: any
}

export type StoreMiddleware = (update: Update, data: any) => Update[];

export class Store {
  dataSubject: BehaviorSubject<any>;
  middleware: StoreMiddleware[];

  constructor(initialValue: any, middleware: StoreMiddleware[]) {
    this.dataSubject = new BehaviorSubject(initialValue);
    this.middleware = middleware;
  }

  get(path?: string[]): Observable<any> {
    // allow empty paths
    if (!path || path.length === 0) {
      return this.dataSubject.asObservable();
    }
    return this.dataSubject.pipe(
      map(data => get(path, data)),
      distinctUntilChanged()
    );
  }

  set(path: string[], value: any): void {
    const loopLimit = 10;
    let data = this.dataSubject.value;
    const updates = [{
      path: path,
      newValue: value
    }];
    let i = 0;
    while (updates.length > 0) {
      const update = updates.pop();
      data = this.applyUpdate(update, data);
      for (const mw of this.middleware) {
        const moreUpdates = mw(update, data)
          .filter((update) => {
            // filter out unnecessary updates
            // to avoid infinite loops
            const value = get(update.path, data);
            return value !== update.newValue;
          });
        // add moreUpdates to the updates array
        updates.splice(0, 0, ...moreUpdates);
      }
      i++;
      if (i >= loopLimit) {
        throw new Error(`Middleware generateed updates for ${loopLimit} consecutive turns, quitting to avoid infinite looping. Please debug your store middleware.`);
      }
    }

    this.dataSubject.next(data);
  }

  private applyUpdate(update: Update, data: any) {
    if (update.path.length === 0) {
      data = update.newValue;
    } else {
      data = set(update.path, update.newValue, data);
    }
    return data;
  }
}
