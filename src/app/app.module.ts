import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FieldComponent } from './field/field.component';
import { FormComponent } from './form/form.component';
import { RowComponent } from './row/row.component';
import { TableComponent } from './table/table.component';
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    FormComponent,
    RowComponent,
    TableComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
