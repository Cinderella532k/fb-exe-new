import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';




@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit {

  show = true
  stores: any
  loginfo
  CompanyId: number
  StoreId: number
  status: number;
  errorMsg: string = '';
  isprogress = false;
  storeid = ''
  OutletForm: any = {
    id: 0,
    name: '',
    address: '',
    city: '',
    postalcode: '',
    contactNo: '',
    email: '',
    openingTime: '',
    closingTime: '',
    gstno: '',
    companyId: 0
  }
  isactive: boolean;

  constructor(private Auth: AuthService, private formBuilder: FormBuilder, public router: Router, private _fb: FormBuilder,) { }

  ngOnInit(): void {

    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getstoreoutlet()
    })

    this.OutletForm = {
      id: 0,
      name: '',
      address: '',
      city: '',
      postalcode: '',
      contactNo: '',
      email: '',
      openingTime: '',
      closingTime: '',
      gstno: '',
      companyId: 0
    }
  }


  tabledata: []
  getstoreoutlet() {
    this.Auth.getstore(this.CompanyId).subscribe(data => {
      this.stores = data
      this.tabledata = this.stores
      console.log(this.stores)
    })
  }
  submitted: boolean = false
  AddOutlet() {
    this.submitted = true;
    if (this.OutletForm.id == 0) {
      var data = { data: JSON.stringify(this.OutletForm) }
      console.log(this.OutletForm);
      this.OutletForm.companyId = this.CompanyId

      this.Auth.addstore(this.OutletForm).subscribe(data => {

        var response: any = data
        if (response.status == 0) {
          this.status = 0;
          this.errorMsg = response.msg;
          console.log(response)
        }
        else {
          this.errorMsg = response.msg;
        }
        this.getstoreoutlet()
        this.show = !this.show
      })

    }
    else {
      var data = { data: JSON.stringify(this.OutletForm) }
      console.log(this.OutletForm);
      this.Auth.updatestore(this.OutletForm).subscribe(data => {

        this.getstoreoutlet()

        var response: any = data
        if (response.status == 0) {
          this.status = 0;
          this.errorMsg = response.msg;
        }
        else {
          this.errorMsg = response.msg;
        }
      });
      this.getstoreoutlet()
      this.show = !this.show
    }
  }


  editstore(OutletForm) {
    this.OutletForm = OutletForm
    this.show = !this.show
  }

  back() {
    this.show = !this.show
    this.OutletForm = {
      id: 0,
      name: '',
      address: '',
      city: '',
      postalcode: '',
      contactNo: '',
      email: '',
      openingTime: '',
      closingTime: '',
      gstno: '',
      companyId: 0
    }
  }

  active(id, act) {
    console.log(id, act)
    this.Auth.outletActive(id, act).subscribe(data => {
      console.log(data)
      this.getstoreoutlet()
    });
  }


  term: string = ''
  filtersearch(): void {
    this.tabledata = this.term
      ? this.stores.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.stores
    console.log(this.tabledata)
  }

}
