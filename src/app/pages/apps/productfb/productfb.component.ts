import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/auth.service'  
import { Location } from '@angular/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as moment from 'moment'
// import { idbService } from '../service/idb.service';
// import { LocsService } from "../service/locs.service";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Directive, HostListener, ElementRef, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { NzNotificationService } from 'ng-zorro-antd'
// import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PredefinedQuantityModule, ProductModule } from './productfb.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataService } from 'src/app/services/data.service';
import { toast, dangertoast } from 'src/assets/dist/js/toast-data';

@Component({  
  selector: 'app-productfb',
  templateUrl: './productfb.component.html',
  styleUrls: ['./productfb.component.scss']
})
export class ProductfbComponent implements OnInit {

  cakeQuantities: any;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "Shift") this.shiftpressed = true
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key == "Shift") this.shiftpressed = false
  }
  // @ViewChild('optionGroups')
  @ViewChild("optionGroups", { static: false }) private optionGroup: ElementRef;

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  shiftpressed: boolean = false
  prodId: number;
  errorMsg: any;
  productTypes: any;
  companyId: any;
  tabledata: any;
  CompanyId: any
  StoreId: any
  id: any
  taxgroups: any
  taxGroupId: number
  producttypes: any

  optiondata: any
  categories: any
  masterproduct: any = []
  show = true
  product: any = {
    id: 0,
    name: '',
    barCode: null,
    description: '',
    brand: '',
    categoryId: 0,
    taxGroupId: 0,
    productTypeId: 0,
    unitId: 0,
    price: null,
    productCode: null,
    CompanyId: 1,
    action: '',
  }
  isvisible: boolean
  visible = false
  checked: Boolean = true
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  term: ''
  https = 0
  prod: any
  products: any
  barcodes: any = []
  variantcombinations: any = []
  categoryvariantgroups: any = []
  variantcombination: any
  barcodevariants: any = []
  datasavetype: string = '1'
  prodid = ''

  units: any = {
    id: 0,
    description: '',
    companyId: 0
  }

  mapOfSort: { [key: string]: any } = {
    id: null,
    name: null,
    description: null,
    category: null,
    tax: null,
    price: null,
    quantity: null,
    status: null,
  }
  sortName: string | null = null
  sortValue: string | null = null
  loginfo: any
  products1: ProductModule;
  predefinedquantities: Array<PredefinedQuantityModule> = []
  newpdquantity: PredefinedQuantityModule = null
  selectedItems: any = [];
  opgp: any;
  image: any = null;
  blobimageurl: SafeUrl;
  producttype: number;
  Kot: any = [];
  taxGroup: any;
  categoryId: any;
  category: any;
  logInfo: any
  taxId: number;


  //edit tax
  // public uploader: FileUploader = new FileUploader({url: this.uploadAPI, itemAlias: 'file'});
  nullvalue: any = null;
  public settings = {};
  OptionGroupId1: number;
  statement: string;
  conditionString: any = "";
  optionArray: any = [];
  OptionGroupId: any;
  optionGroupId: any;


  constructor(private route: ActivatedRoute, private el: ElementRef,
    private router: Router, private data: DataService,
    private _avRoute: ActivatedRoute,
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    public location: Location,
    private fb: FormBuilder,
    private http: HttpClient, private sanitizer: DomSanitizer

  ) {
    this.prodId = Number(this._avRoute.snapshot.params["id"]);
    var logInfo = JSON.parse(localStorage.getItem("loginInfo"));
    this.CompanyId = logInfo.CompanyId;
    this.StoreId = logInfo.storeId;
  }


  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo', 'printersettings']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getMasterproduct();
      this.getCategories();
      this.getproducttype();
      this.gettax();
      this.getUnits();
      this.getoption();
      this.newpdquantity = new PredefinedQuantityModule({ companyid: this.CompanyId, productid: this.prodId })
      this.settings = {
        singleSelection: false,
        idField: 'Id',
        textField: 'Name',  
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        maxHeight: 200,
        itemsShowLimit: 3,
        searchPlaceholderText: 'Search',
        noDataAvailablePlaceholderText: 'No Stores Found',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
      };
      console.log(this.settings)

    })
 
  }

  getoption() {
    this.Auth.getOption(this.loginfo.companyId).subscribe(data => {
      this.optiondata = data;
    console.log(this.optiondata)
    });
  }

  strdate: string
  enddate: string 

  getMasterproduct() {
    this.Auth.getProduct( this.loginfo.companyId,).subscribe(data => {
      this.masterproduct = data
      this.prod = this.masterproduct.filter(x => x.isactive == !this.showInactive)
      console.log(this.prod)
      this.predefinedquantities = data["PredefinedQuantities"]
      // this.cakeQuantities = data["CakeQuantities"].sort((a, b) => { return a.Quantity - b.Quantity })
      console.log(this.products);
      console.log(this.products1)
      this.products1 = new ProductModule(data, this.CompanyId);
      console.log(this.products1);
      console.log(this.products.ProductOptionGroups);
      this.category = this.products.category.filter(x => x.ParentCategoryId != null)
      this.taxGroup = this.products.taxGroup
      this.units = this.products.units
      this.productTypes = this.products.productType
      this.product = this.products.product[0];
      this.Kot = this.products.Kot;
      var response: any = data;
      if (response.status == 0) {
        this.errorMsg = response.msg;
        // console.log(dangertoast(this.errorMsg));

      }
      this.selectedItems = [];
      console.log(this.products);

      this.products.productOptionGroups.forEach(element => {
        console.log(element)
        this.products1.ProductOptionGroups.push(element.OptionGroupId);
        this.selectedItems.push(this.products.optionGroups.filter(x => x.Id == element.OptionGroupId)[0]);
        console.log(this.selectedItems);
        console.log(this.products.optionGroups);
      });
    })
  }

  getCategories() {
    this.Auth.getcategories(this.loginfo.companyId, 'A').subscribe(data => {
      this.categories = data
      this.product.categoryId = this.categories[0].id
      this.category = this.categories.filter(x => x.isactive);
      this.getMasterproduct()
      // console.log(this.categories)
    })
  }

  getproducttype() {
    this.Auth.getProductType().subscribe(data => {
      this.producttypes = data
      this.product.productTypeId = this.producttypes[0].id
    })
  }

  gettax() {
    this.Auth.GetTaxGrp(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data
      this.product.taxGroupId = this.taxgroups[0].id
      // console.log(this.taxgroups);
    })
  }


  unit: any
  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data
      this.product.unitId = this.units[0].id
      //  console.log(this.units)
    })
  }

  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }
  arrayBuffer: any
  file: File
  incomingfile(event) {
    this.file = event.target.files[0]
    console.log(this.file)
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }
  }

  active(id, act) {
    console.log(id, act)
    this.Auth.prdactive(id, act).subscribe(data => {
      this.getMasterproduct()
    })
  }

  showInactive: Boolean = false
  changefilter(bool) {
    this.showInactive = bool
    console.log(bool)
    if (bool) {
      this.prod = this.masterproduct.products.filter(x => !x.isactive)
    } else {
      this.prod = this.masterproduct.products.filter(x => x.isactive)
    }
    console.log(this.prod.length)
  }


  getproduct(id) {
    if (this.prodid != '0') {
      this.Auth.getproductbyid(id).subscribe(data => {
        this.product = data['product']
        console.log(this.product)
        this.barcodes = data['barcodes']
        this.barcodevariants = data['barcodevariants']
        this.barcodes.forEach(bc => {
          bc.vids = []
          bc.com_code = ''
          this.barcodevariants
            .filter(x => x.barcodeId == bc.id)
            .forEach(bcv => {
              bc.vids.push(bcv.variantId)
            })
          bc.com_code = bc.vids.sort().join('_')
        })
        this.getcategoryvariants()
        this.getCategories()
      })
    } else {
      this.getcategoryvariants()
    }
    this.getMasterproduct()
  }


  validation() {
    var isvalid = true
    if (this.product.categoryId == 0) isvalid = false
    if (this.product.productTypeId == 0) isvalid = false
    if (this.product.taxGroupId == 0) isvalid = false
    if (this.product.unitId == 0) isvalid = false
    if (this.product.name == '') isvalid = false
    if (this.product.description == '') isvalid = false
    if (this.product.brand == '') isvalid = false
    if (this.product.price == null) isvalid = false
    if (this.product.productCode == null) isvalid = false


    return isvalid
  }
  back() {
    this.show = !this.show
    this.product = {
      name: '',
      description: '',
      category: 0,
      taxGroup: 0,
      price: null,
      action: '',
    }
  }
  submitted: boolean = false
  addProduct() {
    this.product.CompanyId = this.CompanyId;
    this.submitted = true
    if (this.validation()) {
      if (this.product.id == 0) {
        // // console.log(this.product.id)
        this.product.action = 'A'
        this.Auth.updateProduct(this.product).subscribe(data => {
          console.log(data)
          if (this.datasavetype == '1') {
            this.Auth.addproduct_l({
              product: this.product,
              variantcombinations: this.combinations,
            }).subscribe(data => {
              console.log(data)
              this.Auth.updateproductdb().subscribe(data2 => {
                this.notification.success('Product Added', 'Product Added Successfully')
                this.show = !this.show
                this.getMasterproduct()
              })
            })
          } else if (this.datasavetype == '2') {
            this.notification.success('Product Added', 'Product Added Successfully')
            this.show = !this.show
          }
        })
      } else {
        this.product.action = 'U'
        this.Auth.updateProduct({
          product: this.product,
          variantcombinations: this.combinations,
        }).subscribe(data => {
          console.log(data)
          if (this.datasavetype == '1') {
            this.Auth.updateproduct_l({
              product: this.product,
              variantcombinations: this.combinations,
            }).subscribe(data => {
              console.log(data)
              this.Auth.updateproductdb().subscribe(data2 => {
                this.notification.success('Product Updated', 'Product Updated Successfully')
                this.back()
              })
            })
          } else if (this.datasavetype == '2') {
            this.notification.success('Product Updated', 'Product Updated Successfully')
            this.back()
          }
        })
      }
    } else {
      this.notification.error('Error', 'Product Added UnSuccessfully')
    }
    this.getMasterproduct()
  }
  setcombinationname() {
    this.combinations.forEach(cmb => {
      cmb.product = this.product.name
      console.log(this.product.name)
    })
  }

  variantgroupobj: any = {}
  getcategoryvariants() {
    this.variantcombination = null
    this.variantgroupobj = {}
    this.combinations = []
    this.Auth.getcategoryvariants(this.product.categoryId).subscribe(data => {
      this.categoryvariantgroups = data
      this.categoryvariantgroups.forEach(cvg => {
        this.variantgroupobj[cvg.variantGroupName] = cvg.variants
      })
      if (this.barcodes && this.barcodevariants) this.setcvselect()
    })
  }
  setcvselect() {
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}
    this.categoryvariantgroups.forEach(cvg => {
      cvg.variants.forEach(v => {
        if (this.barcodevariants.some(x => x.variantId == v.id)) {
          cvg.selected = true
          v.selected = true
          if (!this.variantcombination[cvg.variantGroupId])
            this.variantcombination[cvg.variantGroupId] = []
          this.variantcombination[cvg.variantGroupId].push(v.id)
        }
      })
    })
    this.getallcombinations(Object.values(this.variantcombination))
  }
  combinations = []
  keys = []
  variantchecked(vgid, vid, e) {
    this.combinations = []
    if (this.variantcombination == (undefined || null)) this.variantcombination = {}

    if (e.target.checked) {
      if (this.variantcombination[vgid] == (undefined || null)) this.variantcombination[vgid] = []
      this.variantcombination[vgid].push(vid)
    } else {
      var index = this.variantcombination[vgid].indexOf(vid)
      this.variantcombination[vgid].splice(index, 1)
    }
    Object.keys(this.variantcombination).forEach(key => {
      if (this.variantcombination[key].length == 0) delete this.variantcombination[key]
    })
    this.getallcombinations(Object.values(this.variantcombination))
  }
  getallcombinations(args) {
    this.combinations = []
    this.variantcombinations = []
    var r = []
    var max = args.length - 1
    function helper(arr, i) {
      for (var j = 0, l = args[i].length; j < l; j++) {
        var a = arr.slice(0) // clone arr
        a.push(args[i][j])
        if (i == max) r.push(a)
        else helper(a, i + 1)
      }
    }
    if (args.length > 0) helper([], 0)
    else r = []
    this.variantcombinations = r
    this.keys = []
    this.categoryvariantgroups.forEach(cvg => {
      if (cvg.variants.some(x => x.selected == true)) {
        cvg.selected = true
        this.keys.push(cvg.variantGroupName)
      } else {
        cvg.selected = false
      }
    })
    var obj: any = {}
    this.variantcombinations.forEach(vcb => {
      obj.product = this.product.name
      this.keys.forEach(key => {
        obj[key] = this.getvariantname(vcb, key)
      })
      obj.barcode = this.getbarcode(vcb).barcode
      obj.variantids = vcb
      obj.id = this.getbarcode(vcb).id
      this.combinations.push(Object.assign({}, obj))
    })
  }
  getvariantname(arr, key) {
    var variantarray = this.variantgroupobj[key]
    var variantname = ''
    arr.forEach(id => {
      if (variantarray.some(x => x.id == id)) {
        variantname = variantarray.filter(x => x.id == id)[0].name
      }
    })
    return variantname
  }
  getbarcode(vids) {
    var data = { barcode: '', id: 0 }
    var barcode = ''
    var com_code = vids.sort().join('_')
    if (this.barcodes.some(x => x.com_code == com_code)) {
      data.barcode = this.barcodes.filter(x => x.com_code == com_code)[0].barCode
      data.id = this.barcodes.filter(x => x.com_code == com_code)[0].id
    }
    return data
  }

  filteredvalues = [];
  filtersearch(): void {
    this.prod = this.term
      ? this.masterproduct.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.masterproduct.products;
    console.log(this.prod)
  }


  upload(files) {
    this.image = files[0];
    this.blobimageurl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image).replace('unsafe:', ''));
    this.products1.ImgUrl = null;
  }

  focus() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      console.log(invalidElements[1]);

      invalidElements[1].focus();
    }

  }
  ////POPUP////
  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );

  }

  saveProduct() {
    this.submitted = true;
    console.log(this.products1)
    var postdata = { objData: JSON.stringify(this.products1) };
    //postdata.data = ;
    console.log(postdata);
    // var image = { image: this.image };
    // this.auth.saveProduct(postdata, this.image, this.products1.Id, this.CompanyId).subscribe(data => {
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
  categopt(e) {
    this.products1.ProductOptionGroups = [];
    this.selectedItems = [];
    console.log(e);
    this.opgp = this.products.categoryOptionGroups.filter(x => x.CategoryId == e);
    console.log(this.opgp);
    this.opgp.forEach(element => {
      this.products1.ProductOptionGroups.push(element.OptionGroupId);
      this.selectedItems.push(this.products.optionGroups.filter(x => x.Id == element.OptionGroupId)[0]);
    });
    console.log(this.selectedItems);
    console.log(this.products1.ProductOptionGroups);
    console.log(this.products.optionGroups);
  }
  clear() {
    this.products1.ProductOptionGroups = [];
    this.selectedItems = [];
    console.log(this.selectedItems);
    console.log(this.products1.ProductOptionGroups);
  }

  public onFilterChange(item: any) {
    console.log(item);

  }

  public onItemSelect(item: any) {
    console.log(item);
    this.products1.ProductOptionGroups.push(item.id);
    console.log(this.products1.ProductOptionGroups);

  }
  public onDeSelect(item: any) {
    console.log(item);
    var ind1 = this.products1.ProductOptionGroups.findIndex(x => x == item.id);
    this.products1.ProductOptionGroups.splice(ind1, 1);
  }

  public onSelectAll(items: any) {
    console.log(items);
    items.forEach(element => {
      this.products1.ProductOptionGroups.push(element.id);
    });
  }
  public onDeSelectAll(items: any) {
    console.log(items);
    this.products1.ProductOptionGroups = [];
  }


}
