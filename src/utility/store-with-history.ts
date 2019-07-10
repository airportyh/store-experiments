import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { get, set } from "lodash/fp";

export class StoreWithHistory {
  dataSubject: BehaviorSubject<any>;
  history: any[];
  historyCursor: number;

  constructor(initialValue: any) {
    this.dataSubject = new BehaviorSubject(initialValue);
    this.history = [initialValue];
    this.historyCursor = 0;
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

  undo(): boolean {
    if (this.historyCursor > 0) {
      this.historyCursor--;
      const data = this.history[this.historyCursor];
      this.dataSubject.next(data);
      return true;
    } else {
      return false;
    }
  }

  redo(): boolean {
    if (this.historyCursor < this.history.length - 1) {
      this.historyCursor++;
      const data = this.history[this.historyCursor];
      this.dataSubject.next(data);
      return true;
    } else {
      return false;
    }
  }

  set(path: string[], value: any): void {
    const data = this.history[this.historyCursor];
    let newData = path.length === 0 ? value : set(path, value, data);
    if (this.historyCursor < this.history.length - 1) {
      // branching, forget the extra history in front of us
      this.history = this.history.slice(0, this.historyCursor + 1);
    }
    this.history.push(newData);
    this.historyCursor++;
    this.dataSubject.next(newData);
  }

}
