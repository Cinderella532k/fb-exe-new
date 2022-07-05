import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'

@Component({
  selector: 'app-optiongroup',
  templateUrl: './optiongroup.component.html',
  styleUrls: ['./optiongroup.component.scss']
})
export class OptiongroupComponent implements OnInit {

  show = true
  optiondata: any;
  loginfo
  CompanyId: any = 0
  StoreId: any
  radioValue = 'A';
  errorMsg: string = '';
  status: number;
  isactive: boolean;
  OptId: any;
  optiongrp: any;

  OptionGroup = { Id: 0, Name: "", OptionGroupType: 1, Description: '', Options: [{ Id: 0, Name: "", Description: "", Price: 0, SortOrder: -1, OptionGroupId: 0, CompanyId: this.CompanyId }], CompanyId: this.CompanyId, MinimumSelectable: 1, MaximumSelectable: 1, Del: [{ Id: 0 }] };
  OptionGroupType = [{ Id: 1, Name: "Variant" }, { Id: 2, Name: "Addon" }];


  constructor(private Auth: AuthService) {

    this.OptionGroup = { Id: 0, Name: "", OptionGroupType: 1, Description: '', Options: [{ Id: 0, Name: "", Description: "", Price: 0, SortOrder: -1, OptionGroupId: this.OptionGroup.Id, CompanyId: this.CompanyId }], CompanyId: this.CompanyId, MinimumSelectable: 1, MaximumSelectable: 1, Del: [{ Id: 0 }] };

  }

  ngOnInit(): void {

    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getoption()

    })
  }

  getoption() {
    this.Auth.getOption(this.loginfo.companyId).subscribe(data => {
      this.optiondata = data;
      console.log(this.optiondata);
    });
  }


  active(id, act) {
    this.Auth.optionsactive(id, act).subscribe(data => {
      this.getoption();
    });
  }

  editadditional(OptId){
    console.log(this.OptId)
    if (this.OptId != '0') {
      this.Auth.EditOption(OptId).subscribe(data => {
        this.optiongrp = data[0];
        console.log(this.optiongrp)
        this.OptionGroup.Name = this.optiongrp.OptionGroup;
        this.OptionGroup.Id = this.optiongrp.Id;
        this.OptionGroup.Description = this.optiongrp.Description;
        this.OptionGroup.MinimumSelectable = this.optiongrp.MinimumSelectable;
        this.OptionGroup.MaximumSelectable = this.optiongrp.MaximumSelectable;
        this.OptionGroup.Options = [];
        this.OptionGroup.Del = [];
        this.OptionGroup.OptionGroupType = this.optiongrp.OptionGroupType;
        this.optiongrp.Options.forEach(element => {
          var obj = { Id: element.id, Name: element.name, Description: element.description, Price: element.price, OptionGroupId: this.OptionGroup.Id, SortOrder: element.sortOrder, CompanyId: this.CompanyId };
          this.OptionGroup.Options.push(obj);
          console.log(this.OptionGroup.Options)
        });       
      });
      
    }
  }



  back() {
    console.log('Bact to TaxGrp Screen!')
    this.OptionGroup = { Id: 0, Name: "", OptionGroupType: 1, Description: '', Options: [{ Id: 0, Name: "", Description: "", Price: 0, SortOrder: -1, OptionGroupId: 0, CompanyId: this.CompanyId }], CompanyId: this.CompanyId, MinimumSelectable: 1, MaximumSelectable: 1, Del: [{ Id: 0 }] };
    this.OptionGroupType = [{ Id: 1, Name: "Variant" }, { Id: 2, Name: "Addon" }];
  
    this.show = !this.show
  }

  addOption() {
    this.OptionGroup.Options.push({ Id: 0, Name: "", Description: "", Price: 0, SortOrder: -1, OptionGroupId: this.OptionGroup.Id, CompanyId: this.loginfo.companyId });
  }

  deleteOption(index) {
    var id = this.OptionGroup.Options[index].Id;
    this.OptionGroup.Del.push({ Id: id })
    this.OptionGroup.Options.splice(index, 1);
  }

  saveOption() {
    if (this.OptionGroup.OptionGroupType == 1) {
      this.OptionGroup.MinimumSelectable = 1;
      this.OptionGroup.MaximumSelectable = 1;
    } else if (this.OptionGroup.OptionGroupType == 2) {
      this.OptionGroup.MinimumSelectable = 0;
      this.OptionGroup.MaximumSelectable = -1;
    }
    console.log(this.OptionGroup)

    this.OptionGroup.CompanyId = this.loginfo.companyId

    if (this.OptionGroup.Id == 0) {
      var data = { data: JSON.stringify(this.OptionGroup) }
      this.Auth.saveoption(this.OptionGroup).subscribe(data => {

        this.show = !this.show
        this.getoption()
      
      });
    }
    else {
      var data = { data: JSON.stringify(this.OptionGroup) }
      this.Auth.Updateoption(this.OptionGroup).subscribe(data => {

  
        this.show = !this.show
        this.getoption()
        
      });
    }
  }



}
