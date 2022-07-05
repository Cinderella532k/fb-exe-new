import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { idbService } from './idb.service';
import { AuthService } from '../auth.service';
import { element } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class DataService {
  updateEveryMS = 1000;  
  online$: boolean;
  orderList:any;
  unsyncItems:any;
  unsynced:number;
  tempdata:any;
  constructor(private IDB: idbService,private Auth: AuthService) {
    // this.online$ = merge(
    //   of(navigator.onLine),
    //   fromEvent(window, 'online').pipe(mapTo(true)),
    //   fromEvent(window, 'offline').pipe(mapTo(false))
    // );
   }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // this.execute();
  }
  async execute()
  {
    // while (true) {
    // this.online$ = navigator.onLine;
    // if(this.online$)
    // {
    //   var orders;
    //   this.IDB.IDBGetStoreObser("Orders").subscribe(data =>{orders = data;
    //   orders.forEach(element => {
    //     if(element.islive == 0){
    //       var postdata = { ordData: JSON.stringify([element]) };
    //       this.Auth.saveOrder(postdata).subscribe(x => {
    //         this.IDB.IDBDeleteStoreByKey("Orders",element.Id).subscribe(y =>{
    //           var data:any = x;
    //           element.Id = data.OrderId;
    //           element.islive = 1;
    //           element.issync = 1;
    //           this.IDB.IDBUpdateStore("Orders",element).subscribe(z =>{});
    //         })
    //       })
    //     }else if(element.issync == 0){
    //       var postdata = { ordData: JSON.stringify([element]) };
    //       this.Auth.editOrder(postdata).subscribe(data =>{
    //         element.islive = 1;
    //         element.issync = 1;
    //         this.IDB.IDBUpdateStore("Orders",element).subscribe(z =>{
    //             });
    //           });
    //         }
    //       });
    //     });
    //   }
    //   else
    //   {
    //   }
    //   await this.sleep(2000);
    // }
  }
  sleep(ms) {
  // ret urn;
  return new Promise(resolve => setTimeout(resolve, ms));
  }
  // update()
  // {
  //   console.log("update");
  //   const Observable = this.IDB.IDBGetStoreObser("Orders");
  //       Observable.subscribe(Data => {
  //         this.orderList = Data;
  //         console.log(this.orderList);
  //         this.unsyncItems = this.orderList.filter(x => x.issync == 0);
  //         this.unsynced = this.unsyncItems.length;
  //         console.log(this.unsynced);
        
  //         this.online$ = navigator.onLine;
  //         if(this.unsynced > 0)
  //         {
  //           if(this.online$)
  //           {
  //             console.log(this.unsyncItems)
  //             console.log(this.unsynced)
  //             this.unsyncItems.forEach(element => {
  //               // console.log(this.unsyncItems.length);
  //               var postdata = { ordData: JSON.stringify([element])};
  //               this.Auth.saveOrder(postdata).subscribe(data => {
  //                 console.log(element.Id);
  //                 this.IDB.IDBDeleteStoreByKey("Orders",element.Id);
  //                 this.tempdata = data;
  //                 this.tempdata.Order.issync = 1;
  //                 this.IDB.IDBUpdateStore("Orders",this.tempdata.Order);
  //                 // console.log("idbupdate");
  //                 // console.log("idbdelete");
  //               });
  //             });
  //             console.log("online")
  //           }
  //           else
  //           {
  //             console.log("offline")
  //           }
  //         }
  //       });
  // }
}