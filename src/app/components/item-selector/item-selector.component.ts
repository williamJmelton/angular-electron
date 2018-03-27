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
  // customerNames = ['Ali', 'Mohommad'];
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
        map(
          item =>
            item ? this.filter(item) : this.itemNames.slice()
        )
      );
    });
  }

  filter(val: string): string[] {
    return this.itemNames.filter(
      option => option.name.toLowerCase().indexOf(val) === 0
    );
  }

  displayFn(item?: Item): string | undefined {
    return item ? item.name : undefined;
  }

  addItemToInvoice(item) {
    this._inventoryService.handleNewInvoicePayload(item, this.quantity);
  //   let isThere = false;
  //   this._inventoryService.getItemById(item._id).subscribe(itemRes => {
  //     item = itemRes.data;
  //     item.orderQty = this.quantity;
  //   });
  //   // checkif the item is in the invoice already
  //   for (let i = 0; i < this._inventoryService.OrderedItems.length; i++) {
  //     // we are going through each item in the array here...
  //     if (this._inventoryService.OrderedItems[i]._id === item._id) {
  //       // if we are here, the item has been found already...
  //       this._inventoryService.OrderedItems[i].orderQty += this.quantity;
  //       isThere = true;
  //       break;
  //     }
  //   }
  //   // if we don't find the item in the array, do that logic here.
  //   if (!isThere) {
  //     this._inventoryService.OrderedItems.push(item);
  //   }
  //   // submit the modified array to the inventory service for safekeeping.
  //   this._inventoryService.sendItemToInvoice(
  //     this._inventoryService.OrderedItems
  //   );
  // }
}
