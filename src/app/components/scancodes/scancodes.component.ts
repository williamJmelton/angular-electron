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
  selector: 'app-scancodes',
  templateUrl: './scancodes.component.html',
  styleUrls: ['./scancodes.component.scss']
})
export class ScancodesComponent implements OnInit {
  scanCode = '';
  quantity = 1;
  itemToBeAdded: Item = new Item();
  customerNames: Array<any>;
  // customerNames = ['Ali', 'Mohommad'];
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  searchTerm: FormControl = new FormControl();

  // debug vars
  submittedItem: Object;

  constructor(private _inventoryService: InventoryService) {}

  ngOnInit() {
    this.getCustomerNames();
  }

  submit() {
      console.log(this.myControl.value);
  }

  getCustomerNames() {
    this._inventoryService.getCustomerNamesList().subscribe(names => {
    //   const customerNames = [];
    //   names.forEach(element => {
    //     customerNames.push(element.customerName);
    //   });
      this.customerNames = names; // customerNames;
      console.log('in the getCustomerNames Subscription' , this.customerNames);
      // try using new filter func
      this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
        //   map(val => this.filter(val))
        map(customer => customer ? this.filter(customer) : this.customerNames.slice())
        );
    });
  }

  filter(val: string): string[] {
    return this.customerNames.filter(
      option => option.customerName.toLowerCase().indexOf(val) === 0
    );
  }

  displayFn(customer?: Customer): string | undefined {
    return customer ? customer.customerName : undefined;
  }
  // -----------------------------------------------------------------------------------------
  // push the scanned item to the inventory services invoice list
  addItemToInvoice(item) {
    let isThere = false;
    // checkif the item is in the invoice already
    for (let i = 0; i < this._inventoryService.OrderedItems.length; i++) {
      // we are going through each item in the array here...
      if (this._inventoryService.OrderedItems[i].name === item.name) {
        // if we are here, the item has been found already...
        this._inventoryService.OrderedItems[i].orderQty += this.quantity;
        isThere = true;
        break;
      }
    }
    // if we don't find the item in the array, do that logic here.
    if (!isThere) {
      this._inventoryService.OrderedItems.push(item);
    }
    // submit the modified array to the inventory service for safekeeping.
    console.log(this._inventoryService.OrderedItems);
    this._inventoryService.sendItemToInvoice(
      this._inventoryService.OrderedItems
    );
  }
  // --------------------------------------------------------------------------------------------
  // checks if the scancode submited isn't null and then sends the job to updateSelectedItemByScanCode
  onSubmitScanCode(scancode: string) {
    // check if the scancode value is not empty
    if (scancode !== '' || null) {
      // if it isn't empty, go and get the item by the scancode from the service.
      this._inventoryService.getItemByScancode(scancode).subscribe(item => {
        this.itemToBeAdded = item.data;
        this.itemToBeAdded.orderQty = this.quantity;
        this.addItemToInvoice(this.itemToBeAdded);
      });
      // after the process has ran, set the focus back to the scancode element
      document.getElementById('scancode').focus();
    }
    this.scanCode = '';
    // throw this into the subscription maybe
    // this.updateSelectedItemsByScanCode(this.itemToBeAdded);
  }
}
