import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../providers/inventory.service';
import { MatTableDataSource } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import Item from '../../models/item.model';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import Customer from '../../models/customer.model';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  itemNames: Array<any>;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  searchTerm: FormControl = new FormControl();
  quantity = 1;

  constructor(private _inventoryService: InventoryService) {}

  ngOnInit() {
    this.getItemNames();
  }

  submit() {
    this.addItemToInvoice(this.myControl.value);
    this.myControl.setValue('');
    this.quantity = 1;
    document.getElementById('item-selector').focus();
  }

  getItemNames() {
    console.log('getting item names....');
    this._inventoryService.getItemsNamesList().subscribe(names => {
      this.itemNames = names; // customerNames;
      // try using new filter func
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        //   map(val => this.filter(val))
        map(item => (item ? this.filter(item) : this.itemNames.slice()))
      );
    });
  }

  filter(val: string): string[] {
    return this.itemNames.filter(
      option => option.name.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  displayFn(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  addItemToInvoice(item) {
    this._inventoryService.handleNewInvoicePayload(item, this.quantity);
  }
}
