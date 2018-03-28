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
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  searchTerm: FormControl = new FormControl();

  constructor(private _inventoryService: InventoryService) {}

  ngOnInit() {
  }
  // -----------------------------------------------------------------------------------------
  // push the scanned item to the inventory services invoice list
  addItemToInvoice(item) {
    this._inventoryService.handleNewInvoicePayload(item, this.quantity);
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
