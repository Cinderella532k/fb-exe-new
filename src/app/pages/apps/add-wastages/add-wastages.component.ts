import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import * as moment from 'moment'


@Component({
  selector: 'app-add-wastages',
  templateUrl: './add-wastages.component.html',
  styleUrls: ['./add-wastages.component.scss']
})
export class AddWastagesComponent implements OnInit {

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.addwastages()
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 1);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  loginfo
  CompanyId: any
  StoreId: any
  products: any
  wastage: any = []

  wastages: any = {
    id: 0,
    productId: 0,
    quantity: 0,
    wastagedate: moment().format('YYYY-MM-DD HH:MM A'),
    companyId: 0,
    storeId: 0

  }

  constructor(private Auth: AuthService,) { }

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.CompanyId
      this.StoreId = this.loginfo.StoreId
      this.wastages = {
        id: 0,
        productId: 0,
        quantity: 0,
        wastagedate: moment().format('YYYY-MM-DD HH:MM A'),
        companyId: this.loginfo.companyId,
        storeId: this.loginfo.storeId
      }
      this.getproducts()
      this.getwastages()
      this.getunits()
    })


  }
  waste: any

  getwastages() {
    this.Auth.getswastages(this.loginfo.companyId).subscribe(data => {
      this.wastage = data;
      this.waste = this.wastage.wastages;
      console.log(this.waste);
      for (let i = 0; i < this.wastage.wastages.length; i++) {
        var obj = this.wastage.product.filter(x => x.productId == this.wastage.wastages[i].productId)
      }
      console.log(this.wastage)
    })
  }
  unit: any
  getunits() {
    this.Auth.getUnits().subscribe(data => {
      this.unit = data
      console.log(this.unit)
    })
  }


  getproducts() {
    this.Auth.getproducts().subscribe(data => {
      this.products = data
      console.log(this.products)
    })
  }

  addwastages() {

    console.log(this.wastages)
    var obj = {}
    Object.keys(this.wastages).forEach(key => {
      obj[key.charAt(0).toUpperCase() + key.slice(1)] = this.wastages[key]
    })


    this.Auth.Addwastages(obj).subscribe(data => {
      console.log(data)
      this.getwastages()
    })

  }

}
