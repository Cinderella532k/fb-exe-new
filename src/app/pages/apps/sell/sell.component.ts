import { Component, OnInit, ViewChild, HostListener, TemplateRef, ElementRef, Input, } from '@angular/core';
import {
  NgbModal, NgbTypeahead, NgbCalendar, NgbDate, NgbModalConfig, NgbDateParserFormatter,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ElectronService } from 'ngx-electron';
import * as moment from 'moment';
import { WaiterService } from 'src/app/services/waiter/waiter.service';
import { PrintService } from 'src/app/services/print/print.service';
import { EventService } from 'src/app/services/event/event.service';
import { fromEvent, merge, Observable, Observer, Subject, timer } from 'rxjs'
// import { SignalRService } from 'src/app/services/signal-r/signal-r.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'
import { SyncService } from 'src/app/services/sync/sync.service';
import {
  OrderModule, OrderItemModule, CurrentItemModule, KOTModule, Transaction,
  AdditionalCharge,
} from './sell.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
  inputs: ['Sellpageid', 'sectionid'],
})
export class SellComponent implements OnInit {
  @ViewChild('quantityref', { static: false }) private QuantityRef: ElementRef
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('au', { static: true }) autocompleteref: ElementRef
  @ViewChild('viewordermodal', { static: true }) viewordermodal: ElementRef
  @ViewChild('split_payment_modal', { static: true }) split_payment_modal: ElementRef
  orderid: any;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'F9') {
      var order = JSON.parse(localStorage.getItem('lastorder'))
      if (order && order.InvoiceNo) this.printreceiptbyorder(order)
    }
  }
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  isOnlineserv: Observable<boolean>
  isOnline: boolean
  @Input() orderpageid: number = 0
  @Input() sectionid: number = 0
  stores = []
  paymentTypes: any = []
  categories: any = []
  parentcategories = []
  childcategories = []
  charges = []
  diningareas = []
  diningtables = []
  loginfo
  deliverydate
  tempkotobj = null
  deliverytime
  preorders: any = []
  products: any = []
  order: OrderModule
  onlineorders: any = []
  onlineorderscount = {
    placed: 0,
    inprogress: 0,
    completed: 0,
    cancelled: 0,
  }
  ordercount = {
    '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
    '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
    '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
  }

  orderstatus = {
    '-1': { name: 'Cancelled' },
    '0': { name: 'Placed' },
    '1': { name: 'Accepted' },
    '2': { name: 'Preparing' },
    '3': { name: 'Food Ready' },
    '4': { name: 'Dispatched' },
    '5': { name: 'Delivered' },
  }
  listOfOption: Array<{ label: string; value: string }> = []
  size = 'default'
  selectedValue = 'gf'

  public model: any = ''
  public show: boolean = false
  public buttonName: any = 'Back'
  autocompleteproducts = []
  hide = true
  cards = [
    { name: 'Quick Order', ordertypeid: 5, class: 'bg-success', icon: 'fe fe-zap' },
    { name: 'Dine In', ordertypeid: 1, class: 'bg-primary', icon: 'fa fa-cutlery' },
    { name: 'Take Away', ordertypeid: 2, class: 'bg-warning', icon: 'fe fe-briefcase' },
    { name: 'Delivery', ordertypeid: 3, class: 'bg-gray-6', icon: 'fa fa-send-o' },
    { name: 'Pick Up', ordertypeid: 4, class: 'bg-red', icon: 'fa fa-truck' },
    { name: 'Online Orders', ordertypeid: 6, class: 'bg-dark', icon: 'fe fe-globe' },
  ]
  tablefilterid = -1
  currentDiningArea = { Id: 0, DiningArea: 'Loading...' }
  currenttimestamp: number = new Date().getTime()
  orderstatusfilterid: number = -5
  ordersearchterm: string = ''
  activeKey = 0
  printersettings = { receiptprinter: '', kotprinter: '' }
  user: any
  statusbtns = []
  preptimecheck = 0
  tableorders: Array<OrderModule> = []
  hoveredDate: NgbDate | null = null
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null
  daterangeshow: string = ''
  datefilterfield = ''
  customerdetaildrawer = false
  selectedcategoryid = 0
  closeorder: boolean = false
  onlinestatusid = [-1]
  sortstatus = {
    OrderNo: 0,
    customer: 0,
    OrderedDateTime: 0,
    DeliveryDateTime: 0,
    BillAmount: 0,
    OrderStatusId: 0,
  }
  refreshlist = true
  private filteredonlineorders: any = []
  temporaryItem: any = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 };
  barcodemode: boolean = false;
  customerdetails = { id: 0, name: '', phoneNo: '', email: '', address: '', companyId: 0, datastatus: '' }
  customers: any = [];
  orderkey = { orderno: 1, timestamp: 0, GSTno: '' }
  visible = false
  // Auto complete+
  inputValue: string
  options: string[] = []
  isVisible = false
  variantgroups: any = [];
  variantgroupids: any = [];
  category: any = { id: 0, parentCategoryId: '', description: '', isactive: true, sortOrder: -1, companyId: 1, variantgroupids: [] };
  pcategories: any = [];
  nodesFiles = [
    {
      title: 'All',
      key: '100',
      expanded: false,
    },
  ]
  variants: any = [];
  // variantgroups: any = [];
  autocompletevalidation: boolean = true
  typeheadSelected: any

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private notification: NzNotificationService,
    private modalService1: NzModalService,
    private electronservice: ElectronService,
    private calendar: NgbCalendar,
    public dFormatter: NgbDateParserFormatter,
    private waiterS: WaiterService,
    private printservice: PrintService,
    private event: EventService,
    private sync: SyncService,
    config: NgbModalConfig,
    // private signal_r: SignalRService,


  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  printhtmlstyle = `
  <style>
    #printelement {
      width: 270px;
    }
    .header {
        text-align: center;
    }
    .item-table {
        width: 100%;
    }
    .text-right {
      text-align: right!important;
    }
    .text-left {
      text-align: left!important;
    }
    .text-center {
      text-align: center!important;
    }
    tr.nb, thead.nb {
        border-top: 0px;
        border-bottom: 0px;
    }
    table, p, h3 {
      empty-cells: inherit;
      font-family: Helvetica;
      font-size: small;
      width: 290px;
      padding-left: 0px;
      border-collapse: collapse;
    }
    table, tr, td {
      border-bottom: 0;
    }
    hr {
      border-top: 1px dashed black;
    }
    tr.bt {
      border-top: 1px dashed black;
      border-bottom: 0px;
    }
    tr {
      padding-top: -5px;
    }
  </style>`

  printtemporderkot(kot: KOTModule) {
    // // console.log(moment().format('DD-MM-YYYY hh:mm A'))
    // // console.log(moment(kot.ModifiedDate).format('DD-MM-YYYY hh:mm A'))
    // console.log(this.order.OrderName)
    var kottemplate = `
    <div id="printelement">
      <div class="header">
          <h3>ORDER TICKET #${kot.KOTNo}</h3>
          <table class="item-table">
              <tbody>
                  <tr class="nb">
                      <td class="text-left">${this.temporder.InvoiceNo}</td>
                      <td class="text-right">${this.temporder.OrderName}</td>
                  </tr>
                  <tr class="nb">
                      <td class="text-left">Date/Time</td>
                      <td class="text-right">${moment(kot.ModifiedDate).format(
      'DD-MM-YYYY / hh:mm A',
    )}</td>
                  </tr>
              </tbody>
          </table>
      </div>
      <hr>`
    if (kot.added.length > 0) {
      kottemplate += `
      <div class="text-center">ADDED ITEMS</div>
      <table class="item-table">
          <thead class="nb">
              <th class="text-left">ITEM</th>
              <th class="text-right">QTY</th>
          </thead>
          <tbody>
      `
      kot.added.forEach(ai => {
        // // console.log('ADDED ITEMS',ai.Quantity,ai.showname)
        kottemplate += `
        <tr class="nb">
            <td class="text-left">${ai.showname}</td>
            <td class="text-right">+${ai.Quantity}</td>
        </tr>
      `
      })
      kottemplate += `
        </tbody>
      </table>
      <hr>
      `
    }
    if (kot.removed.length > 0) {
      kottemplate += `
      <div class="text-center">REMOVED ITEMS</div>
      <table class="item-table">
          <thead class="nb">
              <th class="text-left">ITEM</th>
              <th class="text-right">QTY</th>
          </thead>
          <tbody>
      `
      kot.removed.forEach(ri => {
        // // console.log('REMOV ITEMS',ri.Quantity,ri.showname)
        kottemplate += `
        <tr class="nb">
            <td class="text-left">${ri.showname}</td>
            <td class="text-right">(${ri.Quantity})</td>
        </tr>
      `
      })
      kottemplate += `
        </tbody>
      </table>
      <hr>
      `
    }
    kottemplate += `
      <hr ${this.temporder.Note ? '' : 'hidden'}>
      <div class="text-center" ${this.temporder.Note ? '' : 'hidden'}>
          <p>Note: ${this.temporder.Note}</p>
      </div>
    `
    kottemplate += `
      <div class="text-center">
          <p>Powered By Biz1Book.</p>
      </div>
    </div>
    `
    kottemplate += this.printhtmlstyle
    // console.log(kottemplate)
    var printers = []
    if (this.printersettings) {
      if (this.printersettings['kotgroups'].some(x => x.KOTGroupId == kot.KOTGroupId)) {
        printers = this.printersettings['kotgroups'].filter(x => x.KOTGroupId == kot.KOTGroupId)[0]
          .Printers
      } else {
        printers = [this.printersettings.kotprinter]
      }
      this.printservice.print(kottemplate, printers)
    }
  }


  ngOnInit(): void {

    this.orderkey = localStorage.getItem("orderkey") ? JSON.parse(localStorage.getItem("orderkey")) : { orderno: 1, timestamp: 0, GSTno: '' }
    this.auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.order = new OrderModule(6)
      this.sync.sync()
      this.getdata();
      this.getCategory();
      this.getvariantgroups();
      this.products = [];
      this.getproducts();
      this.GetStorePaymentType();
      this.temporaryItem.Quantity = null;
      this.products.forEach(product => {
        product.Quantity = null;
        product.tax = 0;
        product.amount = 0;
      })
      this.customerdetails = { id: 0, name: '', phoneNo: '', email: '', address: '', companyId: this.loginfo.companyId, datastatus: '' }
    })
    this.isOnlineserv.subscribe(data => {
      console.log(data)
      this.isOnline = data
      this.event.emitNotif({ networkstatus: this.isOnline })
    })
    this.eventConfig()
    const numbers = timer(3000, 1000)
    numbers.subscribe(x => {
      this.currenttimestamp = new Date().getTime()
    })


  }

  ngOnChanges(changes) {
    console.log(changes)
  }

  changeKey(key) {
    this.activeKey = key
  }


  nzClick(event) {
    // console.log(event)
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true, windowClass: 'modal-holder' })
  }

  clearallorders() {
    this.order = new OrderModule(6)
  }

  async eventConfig() {
    this.event.notify().subscribe(data => {
      console.log('EVENT SERVICE TRIGGER', data)
      if (data.hasOwnProperty('newerrororder')) {
        this.getpreorders()
      } else if (data.waiterorder == 'PREORDER') {
        this.getpreorders()
      } else if (data.waiterorder == 'TABLEORDER') {
        this.gettables()
        // this.gettblorders()
      }
    })
  }


  temponlineorder
  cancelonlineorder(orderid) {
    this.temponlineorder = this.onlineorders.filter(x => x.uPOrderId == orderid)[0]
    this.modalService.open(this.cancelreason_modal, { centered: true })
  }

  viewonlineorder(orderid) {
    // console.log(orderid)
    this.temponlineorder = this.onlineorders.filter(x => x.uPOrderId == orderid)[0]
    this.temponlineorder.invoiceno =
      this.temponlineorder.json.order.details.channel.charAt(0).toUpperCase() +
      this.temponlineorder.json.order.details.ext_platforms[0].id
    this.temponlineorder.json.order.items.forEach(item => {
      item.baseprice = item.price
      item.showname = item.title
      item.options_to_add.forEach(option => {
        item.baseprice += option.price
        item.showname += '/' + option.title
      })
    })

    this.modalService.open(this.viewonlineorder_modal, { centered: true, size: 'xl' })
    localStorage.setItem('testonlineorder', JSON.stringify(this.temponlineorder))
  }

  receivetableorder() {
    // this.generatekot()
    this.printreceipt()
  }

  sortpreorders(field) {
    Object.keys(this.sortstatus).forEach(key => {
      if (key == field) {
        this.sortstatus[field] == 0
          ? (this.sortstatus[field] = 1)
          : this.sortstatus[field] == 1
            ? (this.sortstatus[field] = -1)
            : (this.sortstatus[field] = 1)
      } else {
        this.sortstatus[key] = 0
      }
    })
    console.log(field, this.sortstatus[field])
    if (this.sortstatus[field] == 1) {
      this.preorders = this.preorders.sort((a, b) =>
        a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0,
      )
    } else if (this.sortstatus[field] == -1) {
      this.preorders = this.preorders.sort((a, b) =>
        a[field] > b[field] ? -1 : b[field] > a[field] ? 1 : 0,
      )
    }
    this.refreshlist = !this.refreshlist
    console.log(this.preorders[0].OrderNo)
  }

  CompanyId: any
  StoreId: any

  getdata() {
    this.auth
      .getdbdata([
        'product',
        'category',
        // 'orderkey',
        'paymenttypes',
        'additionalcharges',
        'loginfo',
        'printersettings',
        'diningarea',
        'diningtable',
        'preorders',
        'user',
        'tableorders',
        'stores',
        'orderstatusbtns',
      ])
      .subscribe(data => {
        this.loginfo = data['loginfo'][0]
        this.CompanyId = this.loginfo.companyId
        this.StoreId = this.loginfo.storeId
        console.log(data)
        this.paymentTypes = data['paymenttypes']
        this.products = data['product']
        console.log(this.products.filter(x => x.ishidden))
        this.categories = data['category']
        this.charges = data['additionalcharges']
        this.loginfo = data['loginfo'][0]
        // this.orderkey = data['orderkey'][0]
        this.printersettings = data['printersettings'][0]
        this.diningareas = data['diningarea']
        this.diningtables = data['diningtable']
        this.preorders = data['preorders']
        this.user = data['user'][0]
        this.statusbtns = data['orderstatusbtns']
        this.stores = data['stores'].sort((a, b) => (a.Name > b.Name ? 1 : -1))
        this.diningareas = this.diningareas.sort((a, b) => (a.Id > b.Id ? 1 : b.Id > a.Id ? -1 : 0))
        this.diningtables = this.diningtables.sort((a, b) =>
          a.TableKey > b.TableKey ? 1 : b.TableKey > a.TableKey ? -1 : 0,
        )
        this.currentDiningArea = this.diningareas[0]
        this.tableorders = data['tableorders']
        this.diningtables.forEach(tbl => {
          if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
            // console.log(tbl.TableName)
            tbl.TableStatusId = 1
          } else {
            tbl.TableStatusId = 0
          }
        })
        this.preptimecheck = 1 / (this.loginfo.FoodPrepTime * 10)
        // this.ordservice.getData()

        this.ordercount = {
          '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
          '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
          '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        }
        this.preorders.forEach(order => {
          order.status_name = this.orderstatus[order.OrderStatusId].name
          order.deliverytimestamp = order.DeliveryDateTime
            ? new Date(order.DeliveryDateTime).getTime()
            : 0
          if (
            order.OrderStatusId == 5 &&
            (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
          )
            this.ordercount[order.OrderTypeId.toString()]['5']++
          else if (
            order.OrderStatusId == -1 &&
            (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
          )
            this.ordercount[order.OrderTypeId.toString()]['-1']++
          else if (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
            this.ordercount[order.OrderTypeId.toString()]['-5']++
          else if (order.DeliveryStoreId && order.StoreId != order.DeliveryStoreId)
            this.ordercount[order.OrderTypeId.toString()]['-2']++
          // console.log(this.orderstatus[order.OrderStatusId].name)
        })
        this.preorders.sort((a, b) => {
          return new Date(a.DeliveryDateTime).getTime() - new Date(b.DeliveryDateTime).getTime()
        })
        this.parentcategories = this.category.filter(x => x.parentCategoryId == null)
        this.childcategories = this.category.filter(x => x.parentCategoryId != null)

        console.log(this.parentcategories)
        console.log(this.childcategories)
      })
  }


  splittable(tableid) {
    var lastsplittableid = +this.getavailablesplitid(tableid)
    var parentTable = this.diningtables.filter(x => x.Id == tableid)[0]
    var table = {
      Id: parentTable.Id,
      DiningAreaId: parentTable.DiningAreaId,
      TableKey: parentTable.TableKey + '_' + (lastsplittableid + 1),
      TableName: '',
      TableStatusId: 0,
    }
    table.TableName = parentTable.TableName + '/' + String.fromCharCode(65 + lastsplittableid)
    parentTable.LastSplitTableId = lastsplittableid + 1
    this.auth.splitTable({ parenttable: parentTable, splittable: table }).subscribe(data => {
      this.waiterS.waiterSocket.emit('tableorder:update', parentTable.TableKey)
      this.gettables()
      // this.ordservice.getData()

    })
  }
  removeplittable(splitetablekey) {
    var parentTable = this.diningtables.filter(x => x.Id == +splitetablekey.split('_')[0])[0]
    parentTable.LastSplitTableId -= 1
    this.auth.deletesplittable(splitetablekey).subscribe(data => {
      this.waiterS.waiterSocket.emit('tableorder:update', parentTable.TableKey)
      this.gettables()
      // this.ordservice.getData()
    })
  }

  gettables() {
    this.auth.getdbdata(['diningtable', 'tableorders']).subscribe(data => {
      this.diningtables = data['diningtable']
      this.diningtables = this.diningtables.sort((a, b) =>
        a.TableKey > b.TableKey ? 1 : b.TableKey > a.TableKey ? -1 : 0,
      )
      this.tableorders = data['tableorders']
      this.diningtables.forEach(tbl => {
        if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
          console.log(tbl.TableName, tbl.TableStatusId + '_')
          tbl.TableStatusId = 1
        } else {
          tbl.TableStatusId = 0
        }
      })
    })
  }

  getavailablesplitid(tableid) {
    var availablesplitid = 0
    var result = this.diningtables
      .filter(x => x.TableKey.includes('_') && x.TableKey.includes(tableid.toString()))
      .map(function (a) {
        return +a.TableKey.split('_')[1]
      })
    var missedarr = []
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i + 1] - result[i] > 1) {
          for (let j = 1; j < result[i + 1] - result[i]; j++) {
            missedarr.push(result[i] + j)
          }
        }
      }
      if (missedarr.length > 0) {
        availablesplitid = missedarr[0] - 1
      } else {
        availablesplitid = result[result.length - 1]
      }
    }
    return +availablesplitid
    // this.diningtables.filter(x => x.TableKey.includes('_') && x.TableKey.includes(tableid.toString()))
  }
  filteronlineorders() {
    this.onlineorderscount = {
      placed: 0,
      inprogress: 0,
      completed: 0,
      cancelled: 0,
    }
    this.onlineorders.forEach((order, index) => {
      // order.json = JSON.parse(order.json)
      // order.rider_details = JSON.parse(order.riderDetails)
      // order.status_details = JSON.parse(order.acceptedTimeStamp)
      if (order.orderStatusId == 0) this.onlineorderscount.placed++
      if ([1, 3, 4].includes(order.orderStatusId)) this.onlineorderscount.inprogress++
      if (order.orderStatusId == 5) this.onlineorderscount.completed++
      if (order.orderStatusId == -1) this.onlineorderscount.cancelled++
    })
    this.filteredonlineorders = this.onlineorders.filter(x =>
      this.onlinestatusid.includes(x.orderStatusId),
    )
  }

  syncorderbyid() {
    if (this.temporder.OrderId > 0) {
      this.temporder['loading'] = true
      this.preorders.filter(
        x =>
          x.InvoiceNo == this.temporder.InvoiceNo &&
          x.createdtimestamp == this.temporder.createdtimestamp,
      )[0]['loading'] = true
    }
    this.modalService.dismissAll()
  }

  currstsbtns = []
  customstsbtn = false
  vieworderlist(type) {
    console.log(this.currstsbtns)
    this.sectionid = 1
    this.orderpageid = type
    if (type == 6) {
      // this.getstoreuporders()
    }
  }
  storePaymentTypes: any = []
  GetStorePaymentType() {
    this.auth.getstorepaymentType(this.loginfo.storeId).subscribe(data => {
      console.log(data)
      this.storePaymentTypes = data
    })
  }

  paidamountinputevent() {
    if (!this.order.PaidAmount) {
      this.order.PaidAmount = 0
      this.order.StorePaymentTypeId = 0
    }
  }

  getOrderById(order) {
    order.loading = true
    this.auth.getOrderById(order.OrderId).subscribe(data => {
      // console.log(data, JSON.parse(data["OrderJson"]))
      var orderjson = JSON.parse(data['OrderJson'])
      orderjson._id = order._id
      orderjson.status = 'S'
      this.auth.updatepreorders(orderjson).subscribe(ldata => {
        this.getpreorders()
      })
    })
  }

  createtableorder(tableid, tablekey) {
    this.order = new OrderModule(1)
    this.order.UserId = this.user.UserId
    this.order.UserName = this.user.Name
    console.log(tablekey, this.tableorders)
    if (this.tableorders.some(x => x.diningtablekey == tablekey)) {
      this.orderlogging('edit_table_order')
      var tableorder = this.tableorders.filter(x => x.diningtablekey == tablekey)[0]
      for (var k in tableorder) this.order[k] = tableorder[k]
      console.log(this.order)
    } else {
      this.orderlogging('create_table_order')
      this.order.OrderName =
        `DI/${this.currentDiningArea.DiningArea}/` +
        this.diningtables.filter(x => x.TableKey == tablekey)[0].TableName
      this.order.DiningTableId = tableid
      this.order.diningtablekey = tablekey
      // this.savetblorder()
    }
    this.show = false
    this.sectionid = 2
    // this.waiterS.waiterSocket.emit("table:lock", { id: this.diningtables.filter(x => x.TableKey == tablekey)[0].Id, tableKey: tablekey, timestamp: new Date().getTime() })
  }


  editorder(order: OrderModule) {
    this.order = new OrderModule(order.OrderTypeId)
    for (var k in order) this.order[k] = order[k]
    this.orderlogging('edit_order')
    this.auth.getpreorderby_id(order['_id']).subscribe(data => {
      this.order.OrderId = data['OrderId']
      this.show = false
      this.sectionid = 2
      // console.log(this.order)
    })
  }

  toggle() {
    this.show = !this.show
    if (this.show) this.buttonName = 'Back'
    else this.buttonName = 'Back'
  }

  orderlogging(eventname) {
    var logdata = {
      event: eventname,
      orderjson: JSON.stringify(this.order),
      ordertypeid: this.order.OrderTypeId,
      // orderno: this.ordservice.orderkey.orderno,
      // kotno: this.ordservice.orderkey.kotno,
      timestamp: new Date().getTime(),
    }
    this.auth.logorderevent(logdata).subscribe(data => { })
  }


  modalclose() {
    this.modalService.dismissAll()
  }
  // Online Order page BUtton text change function
  onlineusers: Array<any> = [
    {
      onlineactive: false,
    },
  ]

  onlineclick(onlineuser) {
    // var qq: string = 'ggg'
    // qq.startsWith()
    onlineuser.onlineactive = !onlineuser.onlineactive
  }
  createorder(ordertypeid) {
    console.log(ordertypeid)
    this.order = new OrderModule(ordertypeid)
    this.order.createdtimestamp = new Date().getTime()
    this.charges.forEach(charge => {
      this.order.additionalchargearray.push(new AdditionalCharge(charge))
    })
    if (![2, 3, 4].includes(this.order.OrderTypeId)) {
      this.order.additionalchargearray.forEach(charge => {
        charge.selected = false
      })
    }
    this.order.StoreId = this.StoreId
    // this.order.DeliveryStoreId = this.loginfo.StoreId
    this.orderlogging('create_order')
    this.show = false
    this.sectionid = 2
    if (this.order.IsAdvanceOrder || this.order.OrderTypeId == 2) {
      this.deliverydate = moment().format('YYYY-MM-DD')
      this.deliverytime = moment().format('HH:MM')
    }
  }
  // Take Away Button Text CHange Function
  users: Array<any> = [
    {
      active: false,
    },
  ]

  click(user) {
    user.active = !user.active
  }

  addfreequantity(key) {
    this.order.Items.forEach(item => {
      if (item.ProductKey == key) {
        if (item.Quantity > 0) {
          item.Quantity--
          item.ComplementryQty++
        }
      }
    })
    this.orderlogging('freequantity_add')
    this.order.setbillamount()
  }

  getcustomer() {
    this.auth.getCustomerByPhone(this.order.CustomerDetails.PhoneNo).subscribe(data => {
      // console.log(data)
      var customer: any = data[0]
      if (customer) {
        for (var key in this.order.CustomerDetails) this.order.CustomerDetails[key] = customer[key]
        this.savetblorder()
      }
    })
  }
  savetblorder() {
    if (this.order.OrderTypeId == 1) {
      this.auth.savetblorder(this.order).subscribe(data => {
        this.waiterS.waiterSocket.emit('tableorder:update', this.order.diningtablekey)
        this.gettblorders()
      })
    }
  }

  gettblorders() {
    this.auth.getdbdata(['tableorders']).subscribe(data => {
      this.tableorders = data['tableorders']
      this.diningtables.forEach(tbl => {
        if (this.tableorders.some(x => x.diningtablekey == tbl.TableKey)) {
          tbl.TableStatusId = 1
        } else {
          tbl.TableStatusId = 0
        }
      })
    })
  }
  getcustomerhtml() {
    var html = ''
    // console.log(this.order.CustomerDetails.PhoneNo ? true : false)
    // console.log(this.order.CustomerDetails.Name ? true : false)
    // console.log(this.order.CustomerDetails.Address ? true : false)
    // console.log(this.order.CustomerDetails.City ? true : false)
    if (this.order.CustomerDetails.PhoneNo) {
      html = `<div ${this.order.CustomerDetails.PhoneNo ? '' : 'hidden'} class="header">
          <h3 ${this.order.CustomerDetails.Name ? '' : 'hidden'}>${this.order.CustomerDetails.Name
        }</h3>
          <p>${this.order.CustomerDetails.Address ? this.order.CustomerDetails.Address + '<br>' : ''
        }${this.order.CustomerDetails.City ? this.order.CustomerDetails.City + ',' : ''}${this.order.CustomerDetails.PhoneNo
        }</p>
      </div>
      <hr>`
    }
    return html
  }

  getCategory() {
    this.auth.getcategories(1, "A").subscribe(data => {
      this.categories = data;
      this.category = this.categories.filter(x => x.isactive);
      console.log(this.categories)
      this.show = true
      this.parentcategories = this.category.filter(x => x.parentCategoryId == null)
      this.childcategories = this.category.filter(x => x.parentCategoryId != null)

      console.log(this.parentcategories)
      console.log(this.childcategories)
    })
  }

  // Autocomplete
  acselectedpd: any
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => {
        if (term == '') return []
        if (term.includes('*')) {
          term = term.replace('*', '')
          return this.products.filter(
            x => x.barCode?.toLowerCase() == term.toLowerCase() && term != '' && !x.ishidden,
          )
        }
        if (term.includes(' ')) {
          var subterms = term.split(' ').filter(st => st != '')
          return this.products.filter(x => {
            if (x.ishidden) return false
            var name_substring = x.product.split(' ').filter(st => st != '')
            var match = true
            if (subterms.length > name_substring.length) match = false
            name_substring.forEach((ns, i) => {
              if (match && i < subterms.length)
                if (!ns.toLowerCase().startsWith(subterms[i].toLowerCase())) match = false
            })
            return match
          })
        } else {
          return this.products.filter(v => v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 && !v.ishidden)
        }
      }),
    )


  // Auto Compelete
  onInput(value: string): void {
    this.autocompleteproducts = value
      ? this.products.filter(x => x.product.toLowerCase().includes(value.toLowerCase()))
      : []
  }

  fieldselect(event) {
    // alert('hi');
    // console.log(event)
    // console.log(event.element.nativeElement.id)
    var Products = this.products.filter(x => x.productId == +event.element.nativeElement.id)[0]
  }
  getproducts() {
    this.auth.getproducts().subscribe(data => {
      this.products = data;
      console.log(this.products)
      this.products.forEach(prod => {
        prod.maxqty = prod.quantity
      });
      this.groupProduct()
    })
  }
  groupedProducts = []
  groupProduct() {
    console.log("group products")
    var helper = {};
    this.groupedProducts = this.products.reduce((r, o) => {
      var key = o.barcodeId + '-'

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      }

      return r;
    }, []);

    console.log(this.groupedProducts);
  }

  addproductbyautocomplete() {
    if (this.QuantityRef['nativeElement'].value) {
      var options = {
        quantity: +this.QuantityRef['nativeElement'].value,
        key: '',
      }
      this.order.additem(this.acselectedpd, options)
      this.model = ''
      this.QuantityRef['nativeElement'].value = ''
      this.instance['_elementRef']['nativeElement'].focus()
    }
  }

  // Option Group payment_modal
  @ViewChild('prod_details', { static: false }) public prod_detail_modal: TemplateRef<any>
  @ViewChild('cancelreason_modal', { static: false }) public cancelreason_modal: TemplateRef<any>
  @ViewChild('viewonlineorder_modal', { static: false }) public viewonlineorder_modal: TemplateRef<any
  >
  @ViewChild('payment_modal', { static: false }) public payment_modal: TemplateRef<any>

  currentitem: OrderItemModule 
  addProduct(product) {
    var options = {
      quantity: 1,
      key: '',
    }
    if (product.OptionGroup && product.OptionGroup.length > 0) {
      this.currentitem = new CurrentItemModule(product)
      this.modalService.open(this.prod_detail_modal, {
        windowClass: 'modal-holder',
        centered: true,
      })
      this.orderlogging('item_with_option_add')
    } else {
      this.order.additem(product, options)
      this.model = ''
      this.QuantityRef['nativeElement'].value = ''
      this.instance['_elementRef']['nativeElement'].focus()
      this.orderlogging('item_add')
    }
    if (this.order.OrderTypeId == 1) {
      this.savetblorder()
    }
  }

  itemdetails(product) {
    this.currentitem = new CurrentItemModule(JSON.parse(JSON.stringify(product)))
    this.modalService.open(this.prod_detail_modal, { centered: true })
  }



  setvariantvalue(OptionGroup, Option) {
    OptionGroup.Option.forEach(element => {
      element.selected = false
    })
    if (OptionGroup.selected != Option.Id) {
      OptionGroup.selected = Option.Id
      Option.selected = true
    } else {
      OptionGroup.selected = false
      Option.selected = false
    }
    this.setcurrentitemprice()
  }
  setcurrentitemprice() {
    console.log(this.order.Items)
    var singleqtyoptionprice = 0
    this.currentitem.TotalAmount = 0
    this.currentitem.OptionGroup.forEach(opg => {
      if (opg.selected) {
        opg.Option.forEach(option => {
          if (option.selected) {
            if (option.IsSingleQtyOption) {
              singleqtyoptionprice += option.Price
            } else {
              this.currentitem.TotalAmount += option.Price
            }
            // this.currentitem.TotalAmount += option.Price
          }
        })
      }
    })
    this.currentitem.TotalAmount += this.currentitem.Price
    this.currentitem.TotalAmount *= this.currentitem.Quantity
    this.currentitem.TotalAmount += singleqtyoptionprice
    if (this.currentitem.DiscType == 1) {
      this.currentitem.TotalAmount -= this.currentitem.DiscAmount
    } else if (this.currentitem.DiscType == 2) {
      this.currentitem.TotalAmount -=
        (this.currentitem.TotalAmount * this.currentitem.DiscPercent) / 100
    }
  }
  SetAddonValue(OptionGroup, Option, check) {
    if (check) {
      Option.selected = true
    } else {
      Option.selected = false
    }
    if (OptionGroup.Option.some(x => x.selected == true)) {
      OptionGroup.selected = true
    } else {
      OptionGroup.selected = false
    }
    this.setcurrentitemprice()
  }

  formatter = (x: { Product: string }) => x.Product
  selectedItem(item) {
    console.log(item)
    if (item.hasOwnProperty('OptionGroup')) {
      this.addProduct(item)
    } else {
      this.acselectedpd = item
      this.QuantityRef['nativeElement'].focus()
    }
  }

  getpreorders() {
    this.auth.getdbdata(['preorders']).subscribe(dbdata => {
      this.preorders = dbdata['preorders']
      this.ordercount = {
        '2': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '3': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
        '4': { '-5': 0, '5': 0, '-1': 0, '-2': 0 },
      }
      this.preorders.forEach(order => {
        order.status_name = this.orderstatus[order.OrderStatusId].name
        order.deliverytimestamp = order.DeliveryDateTime
          ? new Date(order.DeliveryDateTime).getTime()
          : 0
        if (
          order.OrderStatusId == 5 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['5']++
        else if (
          order.OrderStatusId == -1 &&
          (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
        )
          this.ordercount[order.OrderTypeId.toString()]['-1']++
        else if (!order.DeliveryStoreId || order.StoreId == order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-5']++
        else if (order.DeliveryStoreId && order.StoreId != order.DeliveryStoreId)
          this.ordercount[order.OrderTypeId.toString()]['-2']++
        // console.log(this.orderstatus[order.OrderStatusId].name)
      })
      this.preorders.sort((a, b) => {
        return new Date(a.DeliveryDateTime).getTime() - new Date(b.DeliveryDateTime).getTime()
      })
      // this.waiterS.waiterSocket.emit("preorder:update", "0")
      // if (this.orderpageid != 0)
      //   this.vieworderlist(this.orderpageid)
    })
  }


  temporder: OrderModule = null
  transaction: Transaction
  savetemporder() {
    this.temporder.status = 'P'
    this.temporder.datastatus = 'edit_order'
    this.temporder.DeliveryDateTime = moment(this.deliverydate + ' ' + this.deliverytime).format(
      'YYYY-MM-DD HH:mm',
    )
    this.deliverydate = ''
    this.deliverytime = ''
    this.auth.updatepreorders(this.temporder).subscribe(data => {
      // this.sync.sync()
      this.getpreorders()
    })
    this.modalService.dismissAll()
  }

  cleardiscount() {
    this.order.DiscAmount = 0
    this.order.DiscAmount = 0
    this.order.Items.forEach(item => {
      item.DiscAmount = 0
      item.DiscPercent = 0
    })
    this.order.setbillamount()
    this.orderlogging('discount_clear')
    this.savetblorder()
  }

  setpayment(paymenttypeid) {
    this.order.StorePaymentTypeId = paymenttypeid
    this.order.PaidAmount = this.order.BillAmount
    // console.log(this.deliverydate, this.deliverytime)
    // console.log(moment(this.deliverydate + ' ' + this.deliverytime).format('YYYY-MM-DD HH:MM A'))
  }
  advanceordervalidate() {
    var valid = true
    if (!this.order.CustomerDetails.PhoneNo) valid = false
    if (!this.deliverydate || !this.deliverytime) valid = false
    // if(!this.datevalidation()) valid = false
    return valid
  }


  isvalid_delivery_date: boolean = true
  datevalidation() {
    var min_timestamp = 0
    var max_timestamp = 95649033600000
    var delivery_timestamp = new Date(this.deliverydate).getTime()
    var isvalid = false
    if (delivery_timestamp >= min_timestamp && delivery_timestamp <= max_timestamp) {
      console.log('valid date')
      isvalid = true
    } else {
      console.log('invalid date')
      isvalid = false
    }
    this.isvalid_delivery_date = isvalid
    return isvalid
  }

  saveOrder() {
    console.log(this.order.CustomerDetails);
    this.placeorderclicked = true
    if (this.order.IsAdvanceOrder) {
      if (!this.advanceordervalidate() || !this.datevalidation()) return
    }
    this.order.OrderNo = this.orderkey.orderno
    this.updateorderno()
    this.order.OrderNo = this.orderkey.orderno
    this.order.BillDate = moment().format('YYYY-MM-DD HH:MM A')
    // this.order.CreatedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.DeliveryDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.ModifiedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.InvoiceNo = this.StoreId + moment().format('YYYYMMDD') + '/' + this.order.OrderNo
    this.order.CompanyId = this.loginfo.companyId
    this.order.StoreId = this.loginfo.storeId

    this.order.InvoiceNo =
    this.loginfo.StoreId + moment().format('YYYYMMDD') + '/' + this.order.OrderNo
    this.order.CustomerDetails.CompanyId = this.loginfo.CompanyId
    this.order.CustomerDetails.StoreId = this.loginfo.StoreId
    this.printreceipt()
    this.order.setrefid()
    this.transaction = null
    this.order.Transactions = []
    this.order.deliverytimestamp = this.order.DeliveryDateTime
    ? new Date(this.order.DeliveryDateTime).getTime()
    : 0
  if (this.order.PaidAmount > 0) {
    if (this.order.StorePaymentTypeId != -1) {
      var transaction = new Transaction()
      // transaction.Id = this.loginfo.CompanyId
      transaction.Amount = this.order.PaidAmount
      transaction.OrderId = this.order.OrderId
      transaction.CustomerId = this.order.CustomerDetails.Id
      // transaction.PaymentTypeId = this.
      transaction.StorePaymentTypeId = this.order.StorePaymentTypeId
      transaction.TranstypeId = 1
      transaction.PaymentStatusId = 0
      transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
      transaction.TransDate = moment().format('YYYY-MM-DD')
      transaction.UserId = this.order.UserId
      transaction.CompanyId = this.loginfo.CompanyId
      transaction.StoreId = this.loginfo.StoreId
      transaction.Notes = null
      transaction.InvoiceNo = this.order.InvoiceNo
      transaction.saved = true
      this.transaction = transaction
      this.order.Transactions.push(this.transaction)
    } else if (this.order.StorePaymentTypeId == -1) {
      this.transactionlist = this.transactionlist.filter(x => x.Amount > 0)
      this.transactionlist.forEach(trxn => {
        trxn.InvoiceNo = this.order.InvoiceNo
        trxn.CompanyId = this.order.CompanyId
        trxn.StoreId = this.loginfo.StoreId
        trxn.saved = true
        this.order.Transactions.push(trxn)
      })
    }
  }
  this.order.alltransactions = [...this.order.Transactions]
  if (this.order.IsAdvanceOrder || this.order.OrderTypeId == 2) {
    // if (!this.advanceordervalidate()) return
    this.order.isordersaved = true
    this.order.events.push({ name: 'order_placed', time: new Date().getTime() })
    this.order.OrderStatusId = 1
    this.order.DeliveryDateTime = moment(this.deliverydate + ' ' + this.deliverytime).format(
      'YYYY-MM-DD HH:mm',
    )
    localStorage.setItem('lastorder', JSON.stringify(this.order))
    this.auth.saveordertonedb(this.order).subscribe(data => {
      // console.log(data)
      this.sync.sync()
      // console.log(this.order)
      this.clearorder(this.order.OrderTypeId)
    })
  } else {
    this.orderlogging('saving_order')
  }
    var products = []
    console.log(this.order.CustomerDetails)
    this.auth.saveorderdb(this.order).subscribe(data1 => {
      // console.log(data1)
      this.sync.sync();
      // this.vendorsubmitted = false;
      // this.OrderNo = data1["lastorderno"]++
      var stockbatchdata = {}
      // stockbatchdata["batches"] = data1["batches"]
      // stockbatchdata["stockBatches"] = data1["stockBatches"]
      this.order = new OrderModule(6);
    })
    this.notification.success("Ordered Saved successfully!", `Ordered Saved successfully.`)
  }


  updateorderno() {
    this.orderkey.orderno++
    localStorage.setItem('orderkey', JSON.stringify(this.orderkey))
    // this.Auth.updateorderkey(this.orderkey).subscribe(data => { })
    console.log(this.orderkey)
  }

  placeorderclicked = false
  updateorder() {
    // this.generatekot()
    this.order.status = 'P'
    this.order.datastatus = 'edit_order'
    this.order.setrefid()
    this.auth.updatepreorders(this.order).subscribe(data => {
      this.sync.sync()
      this.clearorder(this.order.OrderTypeId)
    })
  }

  clearorder(typeid) {
    this.orderlogging('clearing_order')
    this.visible = false
    this.placeorderclicked = false
    console.log(typeid)
    if (typeid == 5) {
      this.order = null
      this.createorder(typeid)
    } else if (typeid == 1) {
      var tablekey = this.order.diningtablekey
      this.auth.deletetblorder(this.order.diningtablekey).subscribe(data => {
        if (tablekey.includes('_')) {
          this.removeplittable(tablekey)
        } else {
          this.waiterS.waiterSocket.emit('tableorder:update', tablekey)
          this.gettblorders()
        }
      })
      var table = this.diningtables.filter(x => x.Id == this.order.DiningTableId)[0]
      this.order = null
      this.sectionid = 1
      this.orderpageid = typeid
      // this.waiterS.waiterSocket.emit("table:release", { id: table.Id, tableKey: table.TableKey, timestamp: new Date().getTime() })
    } else {
      this.order = null
      this.sectionid = 1
      this.orderpageid = typeid
    }
  }
  openpaymentmodal(order: OrderModule) {
    this.issplitpayment = false
    this.temporder = order
    this.transaction = new Transaction()
    this.transaction.Remaining = this.temporder.BillAmount - this.temporder.PaidAmount
    this.transaction.Amount = this.transaction.Remaining
    this.transaction.OrderId = order.OrderId
    this.transaction.StoreId = this.loginfo.StoreId
    this.transaction.TransDate = moment().format('YYYY-MM-DD')
    this.transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
    this.transaction.TranstypeId = 1
    this.transaction.UserId = order.UserId
    this.transaction.CompanyId = order.CompanyId
    this.transaction.CustomerId = order.CustomerDetails.Id
    console.log(this.transaction)
    const modalref = this.modalService.open(this.payment_modal, { size: 'xl', backdrop: 'static' })
    modalref.result.then(
      result => {
        console.log('result', result)
      },
      reason => {
        console.log('reason', reason)
        if (reason == 'Back' && order.deliveryclicked && order.OrderTypeId == 4) {
          this.orderstatuschange(order, 5)
        } else if (!order.deliveryclicked && order.OrderTypeId == 4) {
          order.deliveryclicked = false
        }
      },
    )
  }
  openrefundmodal(order: OrderModule) {
    this.issplitpayment = false
    this.temporder = order
    this.transaction = new Transaction()
    this.transaction.Remaining = this.temporder.PaidAmount - this.temporder.BillAmount
    this.transaction.Amount = this.transaction.Remaining
    this.transaction.OrderId = order.OrderId
    this.transaction.StoreId = this.loginfo.StoreId
    this.transaction.TransDate = moment().format('YYYY-MM-DD')
    this.transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
    this.transaction.TranstypeId = 2
    this.transaction.UserId = order.UserId
    this.transaction.CompanyId = order.CompanyId
    this.transaction.CustomerId = order.CustomerDetails.Id
    this.transaction.InvoiceNo = order.InvoiceNo
    // console.log(this.transaction)
    this.modalService.open(this.payment_modal, { size: 'xl', backdrop: 'static' })
  }
  makepayment() {
    console.log(this.temporder)
    if (!this.temporder.Transactions) this.temporder.Transactions = []
    if (this.transaction.TranstypeId == 1) this.temporder.PaidAmount += this.transaction.Amount
    else if (this.transaction.TranstypeId == 2) this.temporder.PaidAmount -= this.transaction.Amount
    // this.temporder.Transactions.push(this.transaction)
    // if (!this.temporder.changeditems.includes('transaction')) {
    //   this.temporder.changeditems.push('transaction')
    // }
    this.temporder.status = 'P'

    // if (this.temporder.PaidAmount == this.temporder.BillAmount && this.temporder.OrderTypeId == 4) this.temporder.OrderStatusId = 3

    if (this.temporder.OrderId > 0) {
      this.temporder.datastatus = 'edit_order'
    } else {
      this.temporder.datastatus = 'new_order'
    }
    this.auth.getpreorderby_id(this.temporder['_id']).subscribe(data => {
      this.temporder.OrderId = data['OrderId']
      if (this.temporder.OrderId > 0) {
        this.temporder.datastatus = 'edit_order'
      } else {
        this.temporder.datastatus = 'new_order'
      }
      this.transaction.OrderId = this.temporder.OrderId
      this.transaction.InvoiceNo = this.temporder.InvoiceNo
      this.auth.savetransactiontonedb(this.transaction).subscribe(trdt => {
        if (this.temporder.deliveryclicked && this.temporder.OrderTypeId == 4) {
          this.orderstatuschange(this.temporder, 5)
        } else {
          this.auth.updatepreorders(this.temporder).subscribe(data => {
            this.getpreorders()
            this.sync.sync()
          })
        }
      })
    })
    this.modalService.dismissAll()
  }

  transactionlist: Array<Transaction> = null
  issplitpayment: boolean = false
  splitpaymenttotal = 0
  splitpayment() {
    this.transactionlist = []
    this.issplitpayment = true
    this.paymentTypes.forEach(pt => {
      var transaction = new Transaction()
      transaction = new Transaction()
      transaction.Remaining = this.temporder.BillAmount - this.temporder.PaidAmount
      transaction.Amount = 0
      transaction.OrderId = this.temporder.OrderId
      transaction.StoreId = this.loginfo.StoreId
      transaction.TransDate = moment().format('YYYY-MM-DD')
      transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
      transaction.TranstypeId = 1
      transaction.UserId = this.temporder.UserId
      transaction.CompanyId = this.temporder.CompanyId
      transaction.CustomerId = this.temporder.CustomerDetails.Id
      transaction.StorePaymentTypeName = pt.description
      transaction.StorePaymentTypeId = pt.id
      this.transactionlist.push(transaction)
    })
  }
  calculatesplitpaymenttotal() {
    this.splitpaymenttotal = 0
    this.transactionlist.forEach(tr => {
      this.splitpaymenttotal += tr.Amount
    })
  }
  makesplitpayment() {
    var transactionarray = this.transactionlist.filter(x => x.Amount > 0)
    this.auth.getpreorderby_id(this.temporder['_id']).subscribe(data => {
      this.temporder.status = 'P'
      this.temporder.OrderId = data['OrderId']
      if (this.temporder.OrderId > 0) {
        this.temporder.datastatus = 'edit_order'
      } else {
        this.temporder.datastatus = 'new_order'
      }
      transactionarray.forEach(tr => {
        if (tr.TranstypeId == 1) this.temporder.PaidAmount += tr.Amount
        else if (tr.TranstypeId == 2) this.temporder.PaidAmount -= tr.Amount
        tr.OrderId = this.temporder.OrderId
        tr.InvoiceNo = this.temporder.InvoiceNo
      })

      if (this.temporder.PaidAmount == this.temporder.BillAmount && this.temporder.OrderTypeId == 4)
        this.temporder.OrderStatusId = 4

      this.auth.savetransactiontonedb(transactionarray).subscribe(trdt => {
        if (this.temporder.deliveryclicked && this.temporder.OrderTypeId == 4) {
          this.orderstatuschange(this.temporder, 5)
        } else {
          this.auth.updatepreorders(this.temporder).subscribe(data => {
            this.getpreorders()
            this.sync.sync()
          })
        }
      })
      this.modalService.dismissAll()
    })
  }
  issplitpaymentdrawer: boolean = false
  opensplitpaymentmodal() {
    this.issplitpaymentdrawer = true
    if (this.order.StorePaymentTypeId != -1) {
      this.order.StorePaymentTypeId = -1
      this.resetsplitpayment()
    }
  }

  open(content) {
    this.modalService.open(content)
  }
  cur
  resetsplitpayment() {
    this.transactionlist = []
    this.paymentTypes.forEach(pt => {
      var transaction = new Transaction()
      transaction = new Transaction()
      transaction.Remaining = this.order.BillAmount
      transaction.Amount = 0
      transaction.OrderId = this.order.OrderId
      transaction.StoreId = this.loginfo.StoreId
      transaction.TransDate = moment().format('YYYY-MM-DD')
      transaction.TransDateTime = moment().format('YYYY-MM-DD HH:mm')
      transaction.TranstypeId = 1
      transaction.UserId = this.order.UserId
      transaction.CompanyId = this.order.CompanyId
      transaction.CustomerId = this.order.CustomerDetails.Id
      transaction.StorePaymentTypeName = pt.description
      transaction.StorePaymentTypeId = pt.Id
      this.transactionlist.push(transaction)
    })
  }
  cancelsplitpayment() {
    this.order.PaidAmount = 0
    this.order.StorePaymentTypeId = 0
    this.transactionlist = []
    this.issplitpaymentdrawer = false
    this.calculatesplitpaymenttotal()
  }
  confirmsplitpayment() {
    this.order.PaidAmount = this.splitpaymenttotal
    this.issplitpaymentdrawer = false
  }

  orderstatuschange(order, statusid) {
    // console.log(order)
    if (order.PaidAmount != order.BillAmount && !order.deliveryclicked) {
      order.deliveryclicked = true
      var diff = order.BillAmount - order.PaidAmount
      if (diff > 0) {
        this.openpaymentmodal(order)
      } else {
        this.openrefundmodal(order)
      }
      return
    }
    var obj = { name: '', time: new Date().getTime() }
    if (statusid == 1) obj.name = 'accepted'
    if (statusid == 3) obj.name = 'food_ready'
    if (statusid == 4) obj.name = 'dispatched'
    if (statusid == 5) obj.name = 'delivered'
    if (statusid == -1) obj.name = 'cancelled'
    order.OrderStatusId = statusid
    order.status = 'P'
    if (!order.changeditems) order.changeditems = []
    if (!order.changeditems.includes('orderstatus')) {
      order.changeditems.push('orderstatus')
    }
    if (order.events) order.events.push(obj)
    else {
      order.events = []
      order.events.push(obj)
    }
    this.auth.getpreorderby_id(order._id).subscribe(data => {
      order.OrderId = data['OrderId']
      if (order.OrderId > 0) {
        order.datastatus = 'edit_order'
      } else {
        order.datastatus = 'new_order'
      }
      this.auth.updatepreorders(order).subscribe(data => {
        this.sync.sync()
        this.getpreorders()
      })
    })
  }


  getstoreuporders() {
    this.auth.getstoreuporders(this.StoreId).subscribe(data => {
      var orders = []
      var newordercount = 0
      data['orders'].forEach(element => {
        var obj = {}

        Object.keys(element).forEach(key => {
          obj[key.charAt(0).toLowerCase() + key.slice(1)] = element[key]
        })
        orders.push(obj)
      })
      orders.forEach((element, index) => {
        if (element.orderStatusId == 0) newordercount++

        if (typeof element.json == 'string') {
          element.json = JSON.parse(element.json)
        }

        if (
          element.riderDetails != null &&
          element.riderDetails != '' &&
          typeof element.riderDetails == 'string'
        ) {
          element.riderDetails = JSON.parse(element.riderDetails)
        }
      })
      // this.signal_r.startBot(data['orders'])
      this.onlineorders = orders
      // console.log(this.onlineorders)
      if (this.onlineorders.some(x => x.orderStatusId == 0)) {
        // this.notification.startnotificationsound()
      }
      // if (this.onlineorders.some(x => x.orderStatusId == 0)) {
      this.onlinestatusid = [0]
      this.event.emitNotif({ newordercount: newordercount })
      // }
      this.filteronlineorders()
    })
  }

  getvariants() {
    this.auth.getvariants(this.CompanyId).subscribe(data => {
      this.variants = data;
      console.log(this.variants)
      this.show = true
      // this.variantgroups.forEach(vg => {
      //   vg.count = this.variants.filter(x => x.variantGroupId = vg.id).length
      // });
      this.variants.forEach(v => {
        v.variantGroup = this.variantgroups.filter(x => x.id == v.variantGroupId)[0]
      });
      console.log(this.variants)
    })
  }

  getvariantgroups() {
    this.auth.getvariantgroups(this.CompanyId).subscribe(data => {
      this.variantgroups = data;
      // this.variantgroups = this.variantgroups.filter(x => x.id == 0);
      this.show = true;
      console.log(this.variantgroups)
      this.getvariants();
    })
  }
  addcurrentitem() {
    var options = {
      quantity: this.currentitem.Quantity,
      key: '',
    }
    console.log(this.order.additem)
    this.order.additem(this.currentitem, options)
    this.model = ''
    this.QuantityRef['nativeElement'].value = ''
    this.instance['_elementRef']['nativeElement'].focus()
    this.modalService.dismissAll()
    this.orderlogging('current_item_add_save')
    if (this.order.OrderTypeId == 1) {
      this.savetblorder()
    }
  }

  printreceipt() {
    // console.log(this.order.AllItemDisc, this.order.AllItemTaxDisc, this.order.AllItemTotalDisc)
    // console.log(this.order.OrderDiscount, this.order.OrderTaxDisc, this.order.OrderTotDisc)
    this.orderlogging('receipt_print')
    var printtemplate = `
  <div id="printelement">
  <div class="header">
      <h3>${this.loginfo.Company}</h3>
      <p>
          ${this.loginfo.Store}, ${this.loginfo.Address}<br>
          ${this.loginfo.City}, ${this.loginfo.ContactNo}
          GSTIN:<br>
          Receipt: ${this.order.InvoiceNo}<br>
          ${moment(this.order.OrderedDateTime).format('LLL')}
      </p>
  </div>
  <hr>
  ${this.getcustomerhtml()}
  <table class="item-table">
      <thead class="nb">
          <th class="text-left" style="width: 100px;">ITEM</th>
          <th class="text-right">PRICE</th>
          <th class="text-right">QTY</th>
          <th class="text-right">AMOUNT</th>
      </thead>
      <tbody>`
    var extra = 0
    this.order.Items.forEach(item => {
      printtemplate += `
    <tr class="nb">
        <td class="text-left">${item.showname}</td>
        <td class="text-right">${item.baseprice.toFixed(2)}</td>
        <td class="text-right">${item.Quantity}${item.ComplementryQty > 0 ? '(' + item.ComplementryQty + ')' : ''
        }</td>
        <td class="text-right">${item.TotalAmount.toFixed(2)}</td>
    </tr>`
      extra += item.Extra
    })
    printtemplate += `
  <tr class="bt">
      <td class="text-left"><strong>Sub Total</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${this.order.subtotal.toFixed(2)}</td>
  </tr>
  <tr class="nb" ${this.order.OrderTotDisc + this.order.AllItemTotalDisc == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>Discount</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(+(this.order.OrderTotDisc + this.order.AllItemTotalDisc).toFixed(
      0,
    )).toFixed(2)}</td>
  </tr>
  <tr class="nb" ${this.order.Tax1 == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>CGST</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(
        this.order.Tax1 +
        +((this.order.OrderTotDisc + this.order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
  </tr>
  <tr class="nb" ${this.order.Tax2 == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>SGST</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(
        this.order.Tax2 +
        +((this.order.OrderTotDisc + this.order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
  </tr>`
    this.order.additionalchargearray.forEach(charge => {
      if (charge.selected) {
        printtemplate += `
      <tr class="nb">
          <td class="text-left"><strong>${charge.Description}</strong></td>
          <td colspan="2"></td>
          <td class="text-right">${charge.ChargeValue}</td>
      </tr>`
      }
    })
    printtemplate += `
        <tr class="nb" ${extra > 0 ? '' : 'hidden'}>
            <td class="text-left"><strong>Extra</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${extra.toFixed(2)}</td>
        </tr>
        <tr class="nb">
            <td class="text-left"><strong>Paid</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${this.order.PaidAmount.toFixed(2)}</td>
        </tr>
        <tr class="nb">
            <td class="text-left"><strong>Total</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${this.order.BillAmount.toFixed(2)}</td>
        </tr>
        <tr class="nb" ${this.order.BillAmount - this.order.PaidAmount > 0 ? '' : 'hidden'}>
            <td class="text-left"><strong>Balance</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${(this.order.BillAmount - this.order.PaidAmount).toFixed(
      2,
    )}</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <div class="text-center">
      <p>Powered By Biz1Book.</p>
    </div>
  </div>`
    printtemplate += this.printhtmlstyle
    // console.log(printtemplate)
    // var printhtml = document.getElementById("rprintelcontainer").innerHTML
    // printhtml += this.printhtmlstyle
    // // console.log(printhtml)
    // // console.log(printtemplate)
    if (this.printersettings) {
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
    }
  }
  printreceiptbyorder(order) {
    // console.log(order.AllItemDisc, order.AllItemTaxDisc, order.AllItemTotalDisc)
    // console.log(order.OrderDiscount, order.OrderTaxDisc, order.OrderTotDisc)
    // this.orderlogging('receipt_print_by_order')
    var printtemplate = `
  <div id="printelement">
  <div class="header">
      <h3>${this.loginfo.company}</h3>
      <p>
          ${this.loginfo.Store}, ${this.loginfo.Address}<br>
          ${this.loginfo.City}, ${this.loginfo.ContactNo}
          GSTIN:<br>
          Receipt: ${order.InvoiceNo}<br>
          ${moment(order.OrderedDateTime).format('LLL')}
      </p>
  </div>
  <hr ${order.CustomerDetails.PhoneNo ? '' : 'hidden'}>
  <div ${order.CustomerDetails.PhoneNo ? '' : 'hidden'} class="header">
      <h3 ${order.CustomerDetails.Name ? '' : 'hidden'}>${order.CustomerDetails.Name}</h3>
      <p>${order.CustomerDetails.Address ? order.CustomerDetails.Address + '<br>' : ''}${order.CustomerDetails.City ? order.CustomerDetails.City + ',' : ''
      }${order.CustomerDetails.PhoneNo}</p>
  </div>
  <hr>
  <table class="item-table">
      <thead class="nb">
          <th class="text-left" style="width: 100px;">ITEM</th>
          <th class="text-right">PRICE</th>
          <th class="text-right">QTY</th>
          <th class="text-right">AMOUNT</th>
      </thead>
      <tbody>`
    var extra = 0
    order.Items.forEach(item => {
      printtemplate += `
    <tr class="nb">
        <td class="text-left">${item.showname}</td>
        <td class="text-right">${item.baseprice.toFixed(2)}</td>
        <td class="text-right">${item.Quantity}${item.ComplementryQty > 0 ? '(' + item.ComplementryQty + ')' : ''
        }</td>
        <td class="text-right">${item.TotalAmount.toFixed(2)}</td>
    </tr>`
      extra += item.Extra
    })
    printtemplate += `
  <tr class="bt">
      <td class="text-left"><strong>Sub Total</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${order.subtotal.toFixed(2)}</td>
  </tr>
  <tr class="nb" ${order.OrderTotDisc + order.AllItemTotalDisc == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>Discount</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(+(order.OrderTotDisc + order.AllItemTotalDisc).toFixed(
      0,
    )).toFixed(2)}</td>
  </tr>
  <tr class="nb" ${order.Tax1 == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>CGST</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(
        order.Tax1 + +((order.OrderTotDisc + order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
  </tr>
  <tr class="nb" ${order.Tax2 == 0 ? 'hidden' : ''}>
      <td class="text-left"><strong>SGST</strong></td>
      <td colspan="2"></td>
      <td class="text-right">${(
        order.Tax2 + +((order.OrderTotDisc + order.AllItemTotalDisc) / 2).toFixed(0)
      ).toFixed(2)}</td>
  </tr>`
    order.additionalchargearray.forEach(charge => {
      if (charge.selected) {
        printtemplate += `
        <tr class="nb">
            <td class="text-left"><strong>${charge.Description}</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${charge.ChargeValue}</td>
        </tr>`
      }
    })
    printtemplate += `
        <tr class="nb" ${extra > 0 ? '' : 'hidden'}>
            <td class="text-left"><strong>Extra</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${extra.toFixed(2)}</td>
        </tr>
        <tr class="nb">
            <td class="text-left"><strong>Paid</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${order.PaidAmount.toFixed(2)}</td>
        </tr>
        <tr class="nb">
            <td class="text-left"><strong>Total</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${order.BillAmount.toFixed(2)}</td>
        </tr>
        <tr class="nb" ${order.BillAmount - order.PaidAmount > 0 ? '' : 'hidden'}>
            <td class="text-left"><strong>Balance</strong></td>
            <td colspan="2"></td>
            <td class="text-right">${(order.BillAmount - order.PaidAmount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <div class="text-center">
      <p>Powered By Biz1Book.</p>
    </div>
  </div>`
    printtemplate += this.printhtmlstyle
    console.log(printtemplate)
    if (this.printersettings) {
      this.printservice.print(printtemplate, [this.printersettings.receiptprinter])
    }
  }
}
