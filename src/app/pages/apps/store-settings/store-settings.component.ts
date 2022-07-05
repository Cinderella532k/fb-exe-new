import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
// import { idbService } from "../service/idb.service";
import { Observable } from "rxjs";
import { startWith, map, debounceTime } from 'rxjs/operators';
// import { LocsService } from "../service/locs.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Directive, HostListener } from '@angular/core';
import { ProductModule } from '../productfb/productfb.module';
import { AuthService } from 'src/app/auth.service';
// import { AutoselectService } from "../autoselect.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from '@angular/router';
// import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";
import { Location } from '@angular/common';
import { dangertoast, toast } from 'src/assets/dist/js/toast-data';

declare function setHeightWidth(): any;
declare function mintos(): any;
@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.css']
})
export class StoreSettingsComponent implements OnInit {
  name = 'Angular';
  myForm: FormGroup;
  arr: FormArray;
  key = 'Name';
  store: any;
  product: any = { DeliveryPrice: 0, Price: 0, TakeawayPrice: 0 };
  submitted = false;
  prodId: any;
  ProductId = 0;
  StoreId: number;
  products: any;
  products1: ProductModule;
  storeproduct: any;
  variants1: any;
  groupId: number;
  number: any;
  show: boolean = false;
  product2: any;
  product3: any;
  product4: any;
  product5: any;
  number2: any;
  data1: any;
  CompanyId: number;
  errorMsg: string = '';
  constructor(private route: ActivatedRoute, private el: ElementRef,
    private router: Router, 
    // private IDB: idbService,
     private _avRoute: ActivatedRoute, 
    //  private LOCS: LocsService,
    private Auth: AuthService, private modalService: NgbModal, private fb: FormBuilder, public location: Location) {

    this.prodId = Number(this._avRoute.snapshot.params["Id"]);
    // var userinfo = localStorage.getItem("userinfo");
    // var userinfoObj = JSON.parse(userinfo);
    // console.log(userinfoObj)
    // this.CompanyId = userinfoObj[0].CompanyId;
    var logInfo = JSON.parse(localStorage.getItem("loginInfo"));
    this.CompanyId = logInfo.CompanyId;
    this.StoreId = logInfo.storeId;

  }



  ngOnInit() {
    this.getStores();
    setHeightWidth();

  }
  getStores() {

    this.Auth.getSave(this.CompanyId).subscribe(data => {
      this.store = data;
      console.log(this.store);
      var response: any = data
      if (response.status == 0) {
        this.errorMsg = response.msg;
        console.log(dangertoast(this.errorMsg));

      }
    });
  }


  Submit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    console.log(this.myForm.value)
    var data = { data: JSON.stringify(this.myForm.value) }
    this.Auth.addProd(data).subscribe(data => {
      this.router.navigate(['addon'])
    });
  }

  onSubmit() {
    console.log(this.myForm.value);
  }

  selectEvent(e) {
    this.show = true;
    this.Auth.getStrePrd(this.prodId, e.Id).subscribe(data => {
      this.data1 = data;
      console.log(this.data1)
      if (this.data1.storeproduct.length > 0) {
        this.product = this.data1.storeproduct[0];
        this.show;
      }
      else {
        this.product = { DeliveryPrice: 0, Price: 0, TakeawayPrice: 0 };
      }
      if (this.data1.storeproductOption.length > 0) {
        this.product2 = this.data1.storeproductOption;
        this.number = this.data1.storeproductOption[0].OptionGroupId;
      }
      else {
        this.product2 = [{ Price: 0, TakeawayPrice: 0, DeliveryPrice: 0, Name: "Small", OptionGroupId: 1 }]
      }
      // if(this.data1.storeproductAddons.length > 0)
      // {
      //   this.product4 = this.data1.storeproductAddons;
      //   this.number2= this.data1.storeproductAddons[0].AddonGroupId;

      // }
      // else
      // {
      //   this.product4 = [{Price: 0, TakeawayPrice: 0, DeliveryPrice: 0, Description: "Small", VariantGroupId: 1}]
      // }
      this.product3 = this.data1.OptionGroup;
      // this.product5 = this.data1.AddonGroup;
      console.log(this.product2);
      console.log(this.product3);
      console.log(this.product);
      console.log(this.product4);
      console.log(this.product5);
      var response: any = data
      if (response.status == 0) {
        this.errorMsg = response.msg;
        console.log(dangertoast(this.errorMsg));

      }
    });
  }

  saveProduct() {
    this.submitted = true;
    var postdata = { data: JSON.stringify(this.data1) };
    console.log(postdata);
    console.log(this.product.Id)
    // this.Auth.savestoreProduct(postdata).subscribe(data => {
    //   this.router.navigateByUrl("/product")
    //   var response: any = data
    //   if (response.status == 0) {
    //     this.errorMsg = response.msg;
    //     console.log(dangertoast(this.errorMsg));
    //   }
    //   else {
    //     this.errorMsg = response.msg;
    //     console.log(toast(this.errorMsg));
    //   }
    // });
  }
  goback() {
    this.router.navigateByUrl("/product")
  }



}



