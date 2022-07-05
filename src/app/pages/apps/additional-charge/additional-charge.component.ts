import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'

@Component({
  selector: 'app-additional-charge',
  templateUrl: './additional-charge.component.html',
  styleUrls: ['./additional-charge.component.scss']
})
export class AdditionalChargeComponent implements OnInit {
  errorMsg: string = '';
  users: any;
  show = true
  loginfo
  additionalcharge: any = []
  tax: any
  selectedValue = null;
  addtnchrg: any;
  CompanyId: any

  additionalcharges: any = {
    id: 0,
    description: '',
    chargetype: 0,
    chargevalue: 0,
    taxgroupid: 0,
    createdDate: moment().format('YYYY-MM-DD HH:MM A'),
    modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
    companyId: 0,

  }
  types = [
    { "name": "Cash", "id": 1 },
    { "name": "Percentage", "id": 2 },
  ]
  constructor(private Auth: AuthService) { }

  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.getadditional()
      this.gettax()

      this.additionalcharges = {
        id: 0,
        description: '',
        chargetype: 0,
        chargevalue: 0,
        taxgroupid: 0,
        createdDate: moment().format('YYYY-MM-DD HH:MM A'),
        modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
        companyId: this.loginfo.companyId,
      }
    })
  }

  getadditional() {

    this.Auth.Getadditional(this.loginfo.companyId).subscribe(data => {
      this.additionalcharge = data;
      this.addtnchrg = this.additionalcharge.addtncharges;
      console.log(this.addtnchrg);
      for (let i = 0; i < this.additionalcharge.addtncharges.length; i++) {
        var obj = this.additionalcharge.taxGroup.filter(x => x.id == this.additionalcharge.addtncharges[i].taxgroupid);
        console.log(obj)
        this.additionalcharge.addtncharges[i].taxgroup = obj[0].description;
      }
      console.log(this.additionalcharge.addtncharges)
      this.show = true
    });
  }

  gettax() {
    this.Auth.GetTaxGrp(this.loginfo.companyId).subscribe(data => {
      this.tax = data
      console.log(this.tax)
    })
  }

  addadditional() {
    console.log(this.additionalcharges)
    var obj = {}
    Object.keys(this.additionalcharges).forEach(key => {
      obj[key.charAt(0).toUpperCase() + key.slice(1)] = this.additionalcharges[key]
    })
    if (this.additionalcharges.id == 0) {
      this.Auth.Addadditional(obj).subscribe(data => {
        console.log(data)
        this.Auth.updateadditionaldb(data['additionalcharges']).subscribe(data => {
          console.log(data)
          this.additionalcharges = {
            id: 0,
            description: '',
            chargetype: 0,
            chargevalue: 0,
            taxgroupid: 0,
            createdDate: moment().format('YYYY-MM-DD HH:MM A'),
            modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
            companyId: this.loginfo.companyId,
          }
          console.log(this.additionalcharges)
          this.getadditional()
        })
      })
    } else {
      this.Auth.Updateadditional(obj).subscribe(data1 => {
        this.Auth.updateadditionaldb(data1['additionalcharges']).subscribe(data => {
          console.log(data)
          this.additionalcharges = {
            id: 0,
            description: '',
            chargetype: 0,
            chargevalue: 0,
            taxgroupid: 0,
            createdDate: moment().format('YYYY-MM-DD HH:MM A'),
            modifiedDate: moment().format('YYYY-MM-DD HH:MM A'),
            companyId: this.loginfo.companyId,
          }
          console.log(this.additionalcharges)
          this.getadditional()
        })
      })
    }
  }

  editadditional(additionalcharge) {
    this.additionalcharges = additionalcharge

    console.log(this.additionalcharges)
    this.show = !this.show
  }


  back() {
    this.show = !this.show
  }


  
}
