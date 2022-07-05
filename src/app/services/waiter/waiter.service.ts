import { Injectable } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { AuthService } from 'src/app/auth.service'
// import { KOTModule, OrderModule } from 'src/app/pages/apps/order/order.module'
import { SyncService } from '../sync/sync.service'
import { NotAnElectroApp, Settings } from './helper.module'
// import { PrintService } from '../print/print.service'
// import { OrderService, Payload } from '../order/order.service'
import { ElectronService } from 'ngx-electron'
import { NzNotificationService } from 'ng-zorro-antd'
// import { EventService } from '../event/event.service'

@Injectable({
  providedIn: 'root',
})
export class WaiterService {
  waiterSocket: Socket
  serverip: string
  serverurl: string
  socket_server_module: any
  constructor(
    private auth: AuthService,
    private sync: SyncService,
    // private orderservice: OrderService,
    private electronS: ElectronService,
    private notificationS: NzNotificationService,
    // private event: EventService,
  ) {
    this.serverip = localStorage.getItem('socket-server-ip') //socket-src
    this.serverurl = 'http://' + this.serverip + ':8000'
    this.socket_server_module = this.electronS.isElectronApp
      ? this.electronS.remote.require('./socket-src/socketServer.js')
      : new NotAnElectroApp(notificationS)
    if (this.serverip) this.startServer(this.serverip)
  }

  // connect() {
  //   this.serverip = localStorage.getItem('socket-server-ip')
  //   if (this.serverip) {
  //     this.waiterSocket = io(this.serverurl)
  //     this.waiterSocket.on('connect', () => {
  //       console.log('connected')
  //       this.event.notify().subscribe(data => {
  //         // console.log('PREORDER UPDATE EVENT EMIT', data)
  //         if (data.hasOwnProperty('newerrororder')) {
  //           this.waiterSocket.emit('preorder:update', '0')
  //         } else if (data.waiterorder == 'PREORDER') {
  //           this.waiterSocket.emit('preorder:update', '0')
  //         } else if (data.waiterorder == 'TABLEORDER') {
  //           this.waiterSocket.emit('tableorder:update', '0')
  //         }
  //       })
  //     })

  //     this.waiterSocket.on('order:create', (payload: Payload) => {
  //       console.log(payload)
  //       this.orderservice.onOrderCreate(payload)
  //     })

  //     this.waiterSocket.on('order:update', (payload: Payload) => {
  //       console.log(payload)
  //       this.orderservice.onOrderUpdate(payload)
  //     })

  //     this.waiterSocket.on('order:clear', (payload: Payload) => {
  //       console.log(payload)
  //       this.orderservice.cleartableorder(payload.DiningTableId)
  //     })

  //     this.waiterSocket.on('table:swap', payload => {
  //       console.log(payload)
  //       this.orderservice.swapTblOrder(payload.fromTableKey, payload.toTableKey)
  //     })

  //     this.waiterSocket.on('table:split', pld => {
  //       console.log(pld)
  //       this.orderservice.splittable(+pld.tablekey.split('_'))
  //     })

  //     this.waiterSocket.on('table:remove', pld => {
  //       this.orderservice.removeplittable(pld.tablekey)
  //     })
  //   }
  // }

  startServer(serverip: string) {
    localStorage.setItem('socket-server-ip', serverip)
    this.socket_server_module.startServer(8000, serverip)
  }

  availableAddresses() {
    return this.socket_server_module.getAvailableAddresses()
  }

  notElectronApp() {
    return { error: true, message: "This ain't an Electron App" }
  }
}
