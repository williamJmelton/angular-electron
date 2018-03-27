import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

// Handmade components for the application
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NewItemComponent } from './components/new-item/new-item.component';
import { NavComponent } from './components/nav/nav.component';
import { ItemComponent } from './components/item/item.component';
import { EditItemDialogComponent } from './components/items/items.component';
import { ItemsComponent } from './components/items/items.component';
import { InvoicingComponent } from './components/invoicing/invoicing.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ScancodesComponent } from './components/scancodes/scancodes.component';
import { ItemSelectorComponent } from './components/item-selector/item-selector.component';

// Material Components for the application
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatInputModule} from '@angular/material/';
import {MatSelectModule} from '@angular/material/';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableDataSource} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


// Application Providers
import { InventoryService } from './providers/inventory.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    NewItemComponent,
    NavComponent,
    ItemComponent,
    ItemsComponent,
    InvoiceComponent,
    EditItemDialogComponent,
    CustomersComponent,
    InvoicingComponent,
    ScancodesComponent,
    ItemSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatToolbarModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService, InventoryService],
  bootstrap: [AppComponent],
  entryComponents: [ EditItemDialogComponent ]
})
export class AppModule { }
