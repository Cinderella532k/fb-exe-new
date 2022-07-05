import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import * as moment from 'moment'


@Component({
  selector: 'app-orderwise-sales',
  templateUrl: './orderwise-sales.component.html',
  styleUrls: ['./orderwise-sales.component.scss']
})
export class OrderwiseSalesComponent implements OnInit {

  constructor(private Auth: AuthService,) { }

  ordsales: any
  strdate: string
  enddate: string
  CompanyId: any
  StoreId: any
  dateRange = []
  loginfo
  TotalSales = 0;
  TotalPayments = 0;
  errorMsg: string = '';
  status: number;
  term;

  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
    })
    this.strdate = moment().format('YYYY-MM-DD')
    this.enddate = moment().format('YYYY-MM-DD')
    this.ordwisesale()
  }

  ordwisesale() {
    this.Auth.orderwise(this.strdate, this.enddate, this.StoreId, this.CompanyId).subscribe(data => {
      this.ordsales = data["order"]
      console.log(this.ordsales)
      this.TotalPayments = 0;
      this.TotalSales = 0;
      for (let i = 0; i < this.ordsales.length; i++) {
        console.log(this.ordsales[i].ItemJson)
        this.ordsales[i].orderedDate = moment(this.ordsales[i].orderedDate).format('LLL');
        this.TotalPayments = this.TotalPayments + this.ordsales[i].paidAmount;
        this.TotalSales = this.TotalSales + this.ordsales[i].billAmount;
      }
      this.TotalSales = +(this.TotalSales.toFixed(2))
      this.TotalPayments = +(this.TotalPayments.toFixed(2))
      var response: any = data
      if (response.status == 0) {
        this.status = 0;
        this.errorMsg = response.msg;
      }

    })
  }
  onChange(result: Date): void {
    console.log('onChange: ', result)
    this.strdate = moment(result[0]).format('YYYY-MM-DD')
    this.enddate = moment(result[1]).format('YYYY-MM-DD')
    this.ordwisesale()

  }
  strMatch(string, substring) {
    return string.toLowerCase().includes(substring)
  }
  filter(order) {
    const term = this.term.toLowerCase()
    if (term == '') return true
    var ismatching = false
    Object.keys(order).forEach(key => {
      if (typeof (order[key]) == 'string') this.strMatch(order[key], term) ? ismatching = true : null
      if (typeof (order[key]) == 'number') this.strMatch(order[key].toString(), term) ? ismatching = true : null
    })
    return ismatching
  }
  calculate() {
    this.TotalSales = 0
    this.TotalPayments = 0
    this.ordsales.filter(x => this.filter(x)).forEach(order => {
      this.TotalSales += order.billAmount
      this.TotalPayments += order.paidAmount
    });
  }

}
