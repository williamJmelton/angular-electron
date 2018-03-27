import Item from '../models/item.model';
import Customer from '../models/customer.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class InventoryService {
  api_url = 'http://localhost:3000';
  itemUrl = `${this.api_url}/api/items`;
  customerUrl = `${this.api_url}/api/customers`;
  InvoiceSubject = new ReplaySubject<Array<Item>>();
  OrderedItems = Array<Item>();
  savedInvoice = Array<Item>();
  selectedCustomer = new ReplaySubject<Customer>();
  customerNamesList = new ReplaySubject<Array<Customer>>();
  customerNamesSubject = new ReplaySubject<Array<Customer>>();
  _selectedCustomer = false;
  newItem: Item;

  constructor(private http: HttpClient) {
    this.OrderedItems = [];
    this.InvoiceSubject.next([]);
  }

  sendItemToInvoice(items: Array<Item>) {
    this.InvoiceSubject.next(items);
  }

  handleNewInvoicePayload(item: Item, quantity: number) {
    console.log(
      'handling the payload containing',
      item,
      'with a quantity of',
      quantity
    );
    let isThere = false;
    this.getItemById(item._id).subscribe(itemRes => {
      this.newItem = itemRes.data;
      console.log('we are about to add ', this.newItem, 'to the invoice');
      // checkif the item is in the invoice already
      for (let i = 0; i < this.OrderedItems.length; i++) {
        // we are going through each item in the array here...
        if (this.OrderedItems[i]._id === this.newItem._id) {
          // if we are here, the item has been found already...
          console.log('the item is here, so add to the qnty');
          this.OrderedItems[i].orderQty += quantity;
          isThere = true;
          break;
        }
      }
      // if we don't find the item in the array, do that logic here.
      if (!isThere) {
        console.log(
          'item is not there, adding',
          this.newItem,
          'to the invoice array'
        );
        // change the order quantity before pusing it, it wasnt set earlier
        this.newItem.orderQty = quantity;
        this.OrderedItems.push(this.newItem);
        console.log('the new invoice array is', this.OrderedItems);
      }
      // submit the modified array to the inventory service for safekeeping.
      this.sendItemToInvoice(this.OrderedItems);
    });
  }

  getInvoicedItems(): Observable<Item[]> {
    return this.InvoiceSubject.asObservable();
  }

  getCustomerNamesList(): Observable<Customer[]> {
    const customerNamesURL = `${this.customerUrl}/names`;
    return this.http.get(customerNamesURL).map(res => {
      // Maps the response object sent from the server
      return res['data'].docs as Customer[];
    });
  }

  getItemsNamesList(): Observable<Item[]> {
    const itemNamesURL = `${this.itemUrl}/names`;
    return this.http.get(itemNamesURL).map(res => {
      // Maps the response object sent from the server
      console.log('result from service is:', res);
      return res['data'].docs as Item[];
    });
  }

  // Creates a new item in the database, using an item template
  createItem(item: Item): Observable<any> {
    console.log('This is the service, adding the item, which is: ');
    console.log(item);
    // returns the observable of http post request
    return this.http.post(`${this.itemUrl}`, item);
  }

  // Returns all items, takes no arguments. WHOLE DATABASE OF ITEMS
  getItems(): Observable<Item[]> {
    return this.http.get(this.itemUrl).map(res => {
      // Maps the response object sent from the server
      return res['data'].docs as Item[];
    });
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get(this.customerUrl).map(res => {
      return res['data'].docs as Customer[];
    });
  }

  setSelectedCustomer(customer, tf: boolean) {
    this.selectedCustomer.next(customer);
    this._selectedCustomer = tf;
  }

  getSelectedCustomer(): Observable<Customer> {
    return this.selectedCustomer.asObservable();
  }

  // Update todo, takes a ToDo Object as parameter
  editTodo(item: Item) {
    const itemUrl = `${this.itemUrl}`;
    // returns the observable of http put request
    return this.http.put(itemUrl, item);
  }

  // get a single item by it's unique ID
  getItemById(id: string): Observable<any> {
    const getByIdURL = `${this.itemUrl}/${id}`;
    return this.http.get(getByIdURL).map(res => {
      return res;
    });
  }

  getItemByScancode(scancode: string): Observable<any> {
    const getByscancodeURL = `${this.itemUrl}/getbyscancode/${scancode}`;
    return this.http.get(getByscancodeURL).map(res => {
      // console.log('From service: ');
      // console.log(res);
      return res;
    });
  }

  deleteItemById(id: string) {
    console.log('service sending req to server');
    const deleteByIdURL = `${this.itemUrl}/${id}`;
    return this.http.delete(deleteByIdURL);
  }

  // Default Error handling method.
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
