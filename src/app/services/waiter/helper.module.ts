import { NzNotificationService } from "ng-zorro-antd"

export class Settings {
  public static receiptStyle: string = `
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
}

export class NotAnElectroApp {
  constructor(private notificationS: NzNotificationService) { }
  startServer(host) {
    this.notificationS.error("Platform Error", "This ain't an Electron App")
    return { error: true, message: "This ain't an Electron App" }
  }

  getAvailableAddresses() {
    this.notificationS.error("Platform Error", "This ain't an Electron App")
    return { error: true, message: "This ain't an Electron App" }
  }

}