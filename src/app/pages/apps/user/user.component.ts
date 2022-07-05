import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  show = true
  store: any
  loginfo
  CompanyId: any
  StoreId: any
  multipleValue = [];
  role: any
  getuser: any = { users: [] }
  User: any;
  errorMsg: string = '';
  showloading = true;
  userData = { id: 0, name: "", pin: 0, roleId: 0, accountId: 0, companyId: 0, Stores: [], mapped_stores: [], mapped_stores_name: [] }
  users: any;


  constructor(private Auth: AuthService) {

    this.users = JSON.parse(localStorage.getItem("users"));
  }

  ngOnInit(): void {


    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      this.getdata()
      this.getrole()
      this.GetUser()
    })
  }

  getdata() {
    this.Auth.getstore(this.loginfo.companyId).subscribe(data => {
      this.store = data
      console.log(data)
    })

  }

  getrole() {
    this.Auth.role(this.loginfo.companyId).subscribe(data => {
      this.role = data
      console.log(this.role)
    })
  }

  GetUser() {
    this.Auth.getuser(this.loginfo.companyId).subscribe(user => {
      this.getuser = user;
      console.log(this.getuser);
      this.getuser.users = this.getuser.users.filter(x => x.role.roleId != 1);
      this.getuser.users.forEach(element => {
        element.Stores = element.mapped_stores_name.join(", ");
        // this.getuser.userstores.filter(x => x.userId == element.id).forEach(element1 => {
        // element.Stores = element.Stores + element1.store.name + ',';
        // console.log(user);
        // this.User = this.getuser.users;
        // });
      });
      var response: any = user
      if (response.status == 0) {
        this.errorMsg = response.msg;
      }
      this.showloading = false
    })
  }

  back() {
    this.show = !this.show
    this.userData = { id: 0, name: "", pin: 0, roleId: 0, accountId: 0, companyId: 0, Stores: [], mapped_stores: [], mapped_stores_name: [] }

  }
  saveuser() {
    this.userData.companyId = this.CompanyId
    var data = { objData: JSON.stringify(this.userData) }
    console.log(data);
    this.Auth.saveUser(this.userData).subscribe(data => {
      this.users.filter(x => x.id == this.userData.id)[0] = this.userData;
      console.log(this.userData);
      var response: any = data
      if (response.status == 0) {
        this.errorMsg = response.msg;
        alert(this.errorMsg)
      }
      else {
        this.errorMsg = response.msg;
        this.GetUser()
        this.show = false;
        var obj = { Id: response.user.id, Name: response.user.name, Pin: response.user.pin, RoleId: response.user.roleId, Role: this.role.filter(x => x.id == response.user.roleId)[0].name, CompanyId: response.user.companyId }
        var index = this.users.findIndex(x => x.id == obj.Id);
        if (index >= 0) {
          this.users[index] = obj;
        } else {
          this.users.push(obj);
        }
        localStorage.setItem("users", JSON.stringify(this.users))
        this.back()
      }
    });
  }

  editstore(userData) {
    console.log(userData)
    this.userData = userData
    this.show = !this.show
  }


  deleteuser(Id) {
    console.log(Id);
    this.Auth.DeleteUser(Id).subscribe(x => {
      this.GetUser();
      var response: any = x
      if (response.status == 0) {
        this.errorMsg = response.msg;
      }
      else {
        this.errorMsg = response.msg;
        var index = this.users.findIndex(x => x.id == Id);
        this.users.splice(index, 1);
        console.log(this.users, index)
        localStorage.setItem("users", JSON.stringify(this.users))
      }
    });
  }




}
