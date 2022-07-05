import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { AppsRouterModule } from './apps-routing.module'
import { FormsModule } from '@angular/forms'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { QuillModule } from 'ngx-quill'
import { SortablejsModule } from 'ngx-sortablejs'
import { NestableModule } from 'ngx-nestable'
import { WidgetsComponentsModule } from 'src/app/components/kit/widgets/widgets-components.module'

// Apps
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { ElectronService } from 'ngx-electron'
import { JwtInterceptor } from 'src/app/services/interceptors/jwt.interceptors'
import { AppsMessagingComponent } from 'src/app/pages/apps/messaging/messaging.component'
import { AppsCalendarComponent } from 'src/app/pages/apps/calendar/calendar.component'
import { AppsProfileComponent } from 'src/app/pages/apps/profile/profile.component'
import { AppsGalleryComponent } from 'src/app/pages/apps/gallery/gallery.component'
import { AppsMailComponent } from 'src/app/pages/apps/mail/mail.component'
import { GithubExploreComponent } from 'src/app/pages/apps/github-explore/github-explore.component'
import { GithubDiscussComponent } from 'src/app/pages/apps/github-discuss/github-discuss.component'
import { JiraDashboardComponent } from 'src/app/pages/apps/jira-dashboard/jira-dashboard.component'
import { JiraAgileBoardComponent } from 'src/app/pages/apps/jira-agile-board/jira-agile-board.component'
import { TodoistListComponent } from 'src/app/pages/apps/todoist-list/todoist-list.component'
import { DigitaloceanDropletsComponent } from 'src/app/pages/apps/digitalocean-droplets/digitalocean-droplets.component'
import { DigitaloceanCreateComponent } from 'src/app/pages/apps/digitalocean-create/digitalocean-create.component'
import { GoogleAnalyticsComponent } from 'src/app/pages/apps/google-analytics/google-analytics.component'
import { HelpdeskDashboardComponent } from 'src/app/pages/apps/helpdesk-dashboard/helpdesk-dashboard.component'
import { WordpressPostComponent } from 'src/app/pages/apps/wordpress-post/wordpress-post.component'
import { WordpressPostsComponent } from 'src/app/pages/apps/wordpress-posts/wordpress-posts.component'
import { WordpressAddComponent } from 'src/app/pages/apps/wordpress-add/wordpress-add.component'
import { SaleComponent } from './sale/sale.component'
import { SettingComponent } from './setting/setting.component'
import { ReceiptComponent } from './receipt/receipt.component'
import { CustomerComponent } from './customer/customer.component'
import { AddproductComponent } from './addproduct/addproduct.component'
import { StockEntryComponent } from './stock-entry/stock-entry.component'
import { BatchEntryComponent } from './batch-entry/batch-entry.component'
import { ProductOptionsComponent } from './product-options/product-options.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component'
import { ProductsComponent } from './products/products.component'
import { CategoryComponent } from './category/category.component'
import { AddcategoryComponent } from './addcategory/addcategory.component'
import { PurchaseEntryComponent } from './purchase-entry/purchase-entry.component'
import { VendorsComponent } from './vendors/vendors.component'
import { DispatchComponent } from './dispatch/dispatch.component'
import { EditInternalOrderComponent } from './edit-internal-order/edit-internal-order.component'
import { DispatchItemsComponent } from './dispatch-items/dispatch-items.component'
import { TaxgroupComponent } from './taxgroup/taxgroup.component'
import { ReceiveOrdComponent } from './receive-ord/receive-ord.component'
import { EditreceiveComponent } from './editreceive/editreceive.component'
import { CreditComponent } from './credit/credit.component'
import { EditcreditComponent } from './editcredit/editcredit.component'
import { CreditrepayComponent } from './creditrepay/creditrepay.component'
import { PurchasemaintComponent } from './purchasemaint/purchasemaint.component'
import { PurchasebillComponent } from './purchasebill/purchasebill.component'
import { BillpaybyvendorComponent } from './billpaybyvendor/billpaybyvendor.component'
import { MaintbilltypesComponent } from './maintbilltypes/maintbilltypes.component'
import { AssetsComponent } from './assets/assets.component'
import { AssettypesComponent } from './assettypes/assettypes.component'
import { EditcreditrepayComponent } from './editcreditrepay/editcreditrepay.component'
import { CreditdetailsComponent } from './creditdetails/creditdetails.component'
import { EditcreditdetailsComponent } from './editcreditdetails/editcreditdetails.component'
import { LocationComponent } from './location/location.component'
import { BankaccountsComponent } from './bankaccounts/bankaccounts.component'
import { BankaccountdetailComponent } from './bankaccountdetail/bankaccountdetail.component'
import { BillbyvendorComponent } from './billbyvendor/billbyvendor.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DashboardComponent } from './dashboard/dashboard.component'

import { ChartModule } from 'angular2-chartjs'
import { ChartistModule } from 'ng-chartist'
import { NgxBarcodeModule } from 'ngx-barcode';
import { StockComponent } from './stock/stock.component';
import { DaywiseSaleComponent } from './daywise-sale/daywise-sale.component';
import { OrderwiseSalesComponent } from './orderwise-sales/orderwise-sales.component';
import { ProductwiseSalesComponent } from './productwise-sales/productwise-sales.component';
import { PaymenttypesComponent } from './paymenttypes/paymenttypes.component';
import { MonthwiseSalesComponent } from './monthwise-sales/monthwise-sales.component';
import { WastageReportComponent } from './wastage-report/wastage-report.component';
import { ProductionwiseReportComponent } from './productionwise-report/productionwise-report.component';
import { PurchasewiseReportComponent } from './purchasewise-report/purchasewise-report.component';
import { ProductionsComponent } from './productions/productions.component';
import { OptiongroupComponent } from './optiongroup/optiongroup.component';
import { AdditionalChargesComponent } from './additional-charges/additional-charges.component';
import { PercentagePipe } from '../../pipes/percentage/percentage.pipe';
import { WastageProductComponent } from './wastage-product/wastage-product.component';
import { CompanyComponent } from './company/company.component';
import { OutletComponent } from './outlet/outlet.component';
import { UserComponent } from './user/user.component';
import { AddWastagesComponent } from './add-wastages/add-wastages.component';
import { AdditionalChargeComponent } from './additional-charge/additional-charge.component';
import { NgxPrintModule } from 'ngx-print';
import { SellComponent } from './sell/sell.component'
import { DiningTablePipe, OrderTypePipe, ParentcategoryfilterPipe, PrepTimePipe, ProductfilterPipe, StampPipe } from 'src/app/pipes/order/orderfilter.pipe'
import { FilterPipe } from 'src/app/pipes/filter/filter.pipe';
import { ProductfbComponent } from './productfb/productfb.component'
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
// import { NgMultiSelectDropDownModule } from '@ng-bootstrap/ng-bootstrap/modal/modal'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
const COMPONENTS = [
  AppsMessagingComponent,
  AppsCalendarComponent,
  AppsProfileComponent,
  AppsGalleryComponent,
  AppsMailComponent,
  GithubExploreComponent,
  GithubDiscussComponent,
  JiraDashboardComponent,
  JiraAgileBoardComponent,
  TodoistListComponent,
  DigitaloceanDropletsComponent,
  DigitaloceanCreateComponent,
  GoogleAnalyticsComponent,
  HelpdeskDashboardComponent,
  WordpressPostComponent,
  WordpressPostsComponent,
  WordpressAddComponent,
  ProductOptionsComponent,
  ParentcategoryfilterPipe,
  FilterPipe,
  ProductfilterPipe,
  OrderTypePipe,
  DiningTablePipe,
  PrepTimePipe,
  StampPipe
]

@NgModule({
  imports: [
    SharedModule,
    AppsRouterModule,
    FormsModule,
    PerfectScrollbarModule,
    WidgetsComponentsModule,
    QuillModule.forRoot(),
    SortablejsModule,
    NestableModule,
    NgbModule,
    Ng2SearchPipeModule,
    ChartModule,
    ChartistModule,
    NgxBarcodeModule,
    NgxPrintModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ...COMPONENTS,
    SaleComponent,
    SettingComponent,
    ReceiptComponent,
    CustomerComponent,
    AddproductComponent,
    StockEntryComponent,
    BatchEntryComponent,
    InternalTransferComponent,
    ProductsComponent,
    CategoryComponent,
    AddcategoryComponent,
    PurchaseEntryComponent,
    VendorsComponent,
    DispatchComponent,
    EditInternalOrderComponent,
    DispatchItemsComponent,
    TaxgroupComponent,
    ReceiveOrdComponent,
    EditreceiveComponent,
    CreditComponent,
    EditcreditComponent,
    CreditrepayComponent,
    PurchasemaintComponent,
    PurchasebillComponent,
    BillpaybyvendorComponent,
    MaintbilltypesComponent,
    AssetsComponent,
    AssettypesComponent,
    EditcreditrepayComponent,
    CreditdetailsComponent,
    EditcreditdetailsComponent,
    LocationComponent,
    BankaccountsComponent,
    BankaccountdetailComponent,
    BillbyvendorComponent,
    DashboardComponent,
    StockComponent,
    DaywiseSaleComponent,
    OrderwiseSalesComponent,
    ProductwiseSalesComponent,
    PaymenttypesComponent,
    MonthwiseSalesComponent,
    WastageReportComponent,
    ProductionwiseReportComponent,
    PurchasewiseReportComponent,
    ProductionsComponent,
    OptiongroupComponent,
    AdditionalChargesComponent,
    PercentagePipe,
    WastageProductComponent,
    CompanyComponent,
    OutletComponent,
    UserComponent,
    AddWastagesComponent,
    AdditionalChargeComponent,
    SellComponent,
    ProductfbComponent,
    // NgMultiSelectDropDownModule
    
  ],

  providers: [
    ElectronService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class AppsModule {}
