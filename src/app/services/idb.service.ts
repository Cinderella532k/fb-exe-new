import { Injectable } from "@angular/core";
// import { NgxIndexedDB } from "ngx-indexed-db";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class idbService {
  DataBase = "biz1book";
  Version = 1;
  // IDBCreateStore(data) {
  //   let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
  //   for (let ObjectNamekey in data) {
  //     if (data.hasOwnProperty(ObjectNamekey)) {
  //       let Values = data[ObjectNamekey];
  //       let StoreName = ObjectNamekey;
  //       IDBName.openDatabase(1, evt => {
  //         var db = evt.currentTarget.result;
  //         for (let ObjectNamekey in data) {
  //           if (data.hasOwnProperty(ObjectNamekey)) {
  //             let StoreName = ObjectNamekey;
  //             let objectStore = db.createObjectStore(StoreName, {
  //               keyPath: "Id",
  //               autoIncrement: true
  //             });
  //             objectStore.createIndex("Id", "Id", { unique: false });
  //           }
  //         }

  //         let objectStore = db.createObjectStore("Orders", {
  //           keyPath: "Id",
  //           autoIncrement: true
  //         });
  //         let objectStore1 = db.createObjectStore("Transactions", {
  //           keyPath: "Id",
  //           autoIncrement: true
  //         });
  //         objectStore.createIndex("Id", "Id", { unique: false });
  //         objectStore1.createIndex("Id", "Id", { unique: false });
  //         // console.log("iidb")
  //       }).then(function() {
  //         for (let entry of Values) {
  //           //console.log(entry);
  //           IDBName.add(StoreName, entry).then(
  //             () => {},
  //             error => {
  //               //console.log(error);
  //             }
  //           );
  //         }
  //       });
  //     }
  //   }
  // }

  // IDBCreateSingleStore(StoreName, Values) {
  //   console.log(StoreName,Values)
  //   let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
  //   IDBName.openDatabase(1, evt => {
  //     var db = evt.currentTarget.result;

  //     let objectStore = db.createObjectStore(StoreName, {
  //       keyPath: "Id",
  //       autoIncrement: true
  //     });
  //     objectStore.createIndex("Id", "Id", { unique: false });
  //   }).then(function() {
  //     for (let entry of Values) {
  //       IDBName.add(StoreName, entry).then(() => {}, error => {});
  //     }
  //   });
  // }

  // IDBInsertStore(StoreName, Value) {
  //   let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
  //   IDBName.openDatabase(1, evt => {}).then(function() {
  //     IDBName.add(StoreName, Value).then(() => {}, error => {});
  //   });
  // }

  // IDBGetStoreObser(StoreName) {
  //   const studentsObservable = new Observable(observer => {
  //     let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
  //     IDBName.openDatabase(1, evt => {
  //       var db = evt.currentTarget.result;
  //     }).then(function() {
  //       IDBName.getAll(StoreName).then(
  //         data => {
  //           observer.next(data);
  //         },
  //         error => {
      
  //         }
  //       );
  //     });
  //   });
  //   return studentsObservable;
  // }

  // IDBGetStoreById(StoreName, Key, Value) {
  //   console.log(StoreName, Key, Value);
  //   const studentsObservable = new Observable(observer => {
  //     let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
 
  //     IDBName.openDatabase(1, evt => {
  //       var db = evt.currentTarget.result;
  //     }).then(function() {
  //       IDBName.getByIndex(StoreName, Key, Value).then(
  //         data => {
  //           console.log(data);
  //           observer.next(data);
  //         },
  //         error => {
       
  //         }
  //       );
  //     });
  //   });
  //   return studentsObservable;
  // }
//   IDBUpdateStoreById(StoreName, Id, Key, Value) {
//       let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
//       let data:any;
//       this.IDBGetStoreById(StoreName,"Id",Id).subscribe(x =>{data = x
//         const str = Key;
//         data[str] = Value
//         console.log(data)
//       IDBName.openDatabase(1, evt => {}).then(function() {
//         IDBName.update(StoreName,data)
//         console.log("suxes") 
//       });  
//     });
//     const studentsObservable = this.IDBGetStoreById(StoreName,"Id",Id);
//     return studentsObservable;
// }

// IDBUpdateStoreByProperty(StoreName,property, pvalue, Key, Value) {
//     let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
//     let data:any;
//     this.IDBGetStoreById(StoreName,property,pvalue).subscribe(x =>{data = x
//       const str = Key;
//       data[str] = Value
//       console.log(data)
//     IDBName.openDatabase(1, evt => {}).then(function() {
//       IDBName.update(StoreName,data)
//       console.log("suxes") 
//     });  
//   });
// }

// IDBUpdateStore(StoreName, Value) {
//     let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
//     IDBName.openDatabase(1, evt => {}).then(function() {
//       IDBName.update(StoreName,Value)
//     });
//     const studentsObservable = this.IDBGetStoreObser("Orders");
//     return studentsObservable;
// }

// IDBDeleteStoreByKey(StoreName, Key) {
//     let IDBName = new NgxIndexedDB(this.DataBase, this.Version);
//     IDBName.openDatabase(1, evt => {}).then(function() {
//       IDBName.delete(StoreName,Key);
//     });  
//     const studentsObservable = this.IDBGetStoreObser("Orders");
//     return studentsObservable;
// }

  // IDBCreateStoreval(data, stName) {
  //   let IDBName = new NgxIndexedDB(this.DataBase, this.Version);

  //   if (data.hasOwnProperty(stName)) {
  //     let Values = data[stName];
  //     let StoreName = stName;
  //     IDBName.openDatabase(1, evt => {
  //       var db = evt.currentTarget.result;
  //       for (let ObjectNamekey in data) {
  //         if (data.hasOwnProperty(ObjectNamekey)) {
  //           let StoreName = ObjectNamekey;
  //           db.createObjectStore(StoreName, {
  //             keyPath: "id",
  //             autoIncrement: true
  //           });
  //         }
  //       }
  //     }).then(function() {
  //       for (let entry of Values) {
  //         IDBName.add(StoreName, entry).then(
  //           () => {},
  //           error => {
  //             //console.log(error);
  //           }
  //         );
  //       }
  //     });
  //   }
  // }
}
