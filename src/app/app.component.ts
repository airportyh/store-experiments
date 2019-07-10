import { Component } from '@angular/core';
import { StoreWithHistory } from '../utility/store-with-history';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'validating-store';

  store = new StoreWithHistory({
    1: {
      id: 1,
      name: "Brian",
    },
    2: {
      id: 2,
      name: "Jerry"
    },
    3: {
      id: 3,
      name: "AJ"
    }
  });

  tableData$ = this.store.get([]);

  onChange(item, value) {
    this.store.set([item.id, 'name'], value)
  }

  trackByFn(idx, item) {
    return item.id;
  }
}
