import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import { FormBuilder } from '@angular/forms';
declare function setHeightWidth(): any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  companydetails: any 
  loginfo
  CompanyId: number
  StoreId: number
  name: any;
  users: any;
  errormsg = "";
  errorMsg: string = '';
  submitted = false;
  address: any;
  city: any;
  state: any;
  country: any;
  postalcode: any;
  email: any;
  phno: any;
  pin: any;

  constructor(private Auth: AuthService, private el: ElementRef, private _fb: FormBuilder,) {

    this.users = JSON.parse(localStorage.getItem("users"));

  }


  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getcompany()
    })
    setHeightWidth();

  }

  getcompany() {
    this.Auth.getcompanydata(this.loginfo.companyId).subscribe(data => {
      this.companydetails = data
      console.log(this.companydetails)
    })
  }

  checkpi() {
    this.users.forEach(element => {
      if (this.companydetails.users.pin == element.pin) {
        this.errormsg = "Pin Already Taken"
        return;
      }
    });
  }

  saveData() {
    this.submitted = true;
    var pinchk = false
    this.errormsg = ""
    console.log(this.companydetails)
    this.users.forEach(element => {
      if (this.companydetails.user.pin == element.pin && element.id != this.companydetails.user.id) {
        this.errormsg = "Pin Already Taken"
        pinchk = true;
        return;
      }
    });
    if (pinchk) {
      return
    }
    console.log(this.companydetails);
    var postdata = { objData: JSON.stringify(this.companydetails) };
    console.log(postdata);
    this.Auth.saveCompany(postdata).subscribe(data => {
      this.users.filter(x => x.id == this.companydetails.user.id)[0].pin = this.companydetails.user.pin;
      localStorage.setItem("users", JSON.stringify(this.users))
      var response: any = data
      if (response.status == 0) {
        this.errorMsg = response.msg;
      }
      else {
        this.errorMsg = response.msg;
      }
      console.log(this.users)
    });

  }

  focus() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      console.log(invalidElements[1]);
      invalidElements[1].focus();
      return
    }
    this.saveData()
    console.log(invalidElements);
    console.log(invalidElements[1]);

  }

}

