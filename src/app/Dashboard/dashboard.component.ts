import { Component, OnInit } from '@angular/core';
import {UserService} from "../Services/user.service";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label, SingleDataSet} from "ng2-charts";
import {AuthService} from "../Login/auth.service";
import {DossierService} from "../Services/dossier.service";
import {LoginFormComponent} from "../Login/login-form/login-form.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  User : any;
  Employee : any;
  Clients : any;
  EmpTotal : number;
  ClientTotal : number;
  ImportTotal : number;
  ExportTotal : number;
  FolTotal : number;
  doss : any;
  doss_import: any;
  doss_export : any;
  anio: number = new Date().getFullYear();
  import : any;
  export : any;
  doss_details_export :any;
  doss_details_import :any;
  CurrentUser : any;
  folders_year : any;
  completed : any;



  EmployeeFolders : any;
  EmployeeFoldersImport;
  EmployeeFoldersExport:any;
  EmployeeFoldersEnattente :any;
  EmployeeFoldersCompleted : any;

  ClientFolders : any;
  ClientFoldersImport;
  ClientFoldersExport:any;
  ClientFoldersEnattente :any;
  ClientFoldersEntraitement :any;
  ClientFoldersCompleted : any;

  //Charts Import Export //
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Array < any > = [{
    backgroundColor: [ '#7CBFFD','#6BA45D'],
  }];


// barcharts for Dossier per year
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [];


  constructor(private service: UserService , public Auth : AuthService ) { }

  ngOnInit(): void {
    if (this.Auth.isEmployee()){
      this.getFoldersEmployee();
      this.getFoldersEmployeeImport();
      this.getFoldersEmployeeExport();
      this.getFoldersEmployeeEntraitement();
      this.getFoldersEmployeeCompleted();
    }
    else if (this.Auth.isClient()) {
      this.getFoldersClient();
      this.getFoldersClientImport();
      this.getFoldersClientExport();
      this.getFoldersClientEntraitement();
      this.getFoldersClientCompleted();
      this.getFoldersClientEnAttente();
    }
    this.getImportExportwithYear(this.anio);

    this.getTopClients();
    this.getTopEmployees();

    this.getDashStatsClientsTotal();
    this.getDashStatsImportTotal();
    this.getDashStatsExportTotal();
    this.getDashStatsFolderTotal();
    this.getDashStatsEmpTotal();
    this.getAllDossierperyear(this.anio);
    if (this.Auth.isClient()){
      this.getDossiersCLientPerYearAndType(this.anio);
    }
    else if (this.Auth.isEmployee()){
      this.getDossiersEmployeeImportCountPeryear(this.anio);
    }
  }
  getTopClients(){
    this.service.getTopClients().subscribe(data =>{
      this.Clients = data;
      this.Clients =this.Clients._embedded.users;

    })
  }

  getTopEmployees(){
    this.service.getTopEmployees().subscribe(data =>{
      this.Employee =data;
      this.Employee = this.Employee._embedded.users;

    }
    )
  }

  getDashStatsFolderTotal(){
    this.service.getDashboardcountStats("FolTotal").subscribe(data =>{
      this.FolTotal = data;
    })
  }
  getDashStatsImportTotal(){
    this.service.getDashboardcountStats("ImportTotal").subscribe(data =>{
      this.ImportTotal = data;
    })
  }
  getDashStatsExportTotal(){
    this.service.getDashboardcountStats("ExportTotal").subscribe(data =>{
      this.ExportTotal = data;
    })
  }
  getDashStatsClientsTotal(){
    this.service.getDashboardcountStats("ClientTotal").subscribe(data =>{
      this.ClientTotal = data;
    })
  }
  getDashStatsEmpTotal(){
    this.service.getDashboardcountStats("EmpTotal").subscribe(data =>{
      this.EmpTotal = data;
    })
  }


  getAllDossierperyear(year : number){
      if (this.Auth.isAdmin()){
        this.service.getAllFolderbyYear(year).subscribe(data=>{
          this.doss=data;
          var month = this.doss.map(function (elem){
            return elem.month;
          })
          var count = this.doss.map(function (elem){
            return elem.count;
          })
          this.barChartLabels = month;
          this.barChartData = [{data : count , label : 'Dossiers  Year '+year}];
        })
      }
      else if (this.Auth.isClient()){
        this.service.getCurrentUser().subscribe(data =>{
          this.CurrentUser = data;
        this.service.getClientFolderCount(this.CurrentUser.id,year).subscribe(data=>{
          this.folders_year=data;
          var month = this.folders_year.map(function (elem){
            return elem.month;
          })
          var count = this.folders_year.map(function (elem){
            return elem.count;
          })

          this.barChartLabels = month;
          this.barChartData = [{data : count , label : 'Dossiers  Year '+year}];
        })

      })
   }
      else if (this.Auth.isEmployee()){
        this.service.getCurrentUser().subscribe(data =>{
          this.CurrentUser=data;
          this.service.getEmployeeFoldercountByYear(this.CurrentUser.username,2,year).subscribe(data=>{
            this.completed=data;
            var month = this.completed.map(function (elem){
              return elem.month;
            })
            var count = this.completed.map(function (elem){
              return elem.count+1;
            })
            this.barChartLabels = month;
            this.barChartData = [{data : count , label : 'Dossiers  Year '+year}];

          })


        })



      }

  }
 // ALL Dossier by Client with type and Year


  getImportExportwithYear(year : number){
      this.service.getDashboardDossiersTypeAndYear('Export',year).subscribe(data=>{
        this.import=data;
        this.service.getDashboardDossiersTypeAndYear('Import',year).subscribe(data=>{
          this.export=data;
          this.pieChartLabels =['Import', 'Export'];
          this.pieChartData =[this.import,this.export];
        })
      })
  }
  // ALL Dossier by Client Import Per Year and type
  getDossiersCLientPerYearAndType(year : number){
    this.service.getCurrentUser().subscribe(data => {
      this.CurrentUser = data;
      this.service.getClientsDossiersTypePerYear(this.CurrentUser.id, 'Import', year).subscribe(data => {
        this.import = data;
        this.service.getClientsDossiersTypePerYear(this.CurrentUser.id, 'Export', year).subscribe(data => {
          this.export = data;
          this.pieChartLabels = ['Import', 'Export'];
          this.pieChartData = [this.import.length, this.export.length];
        })
      })
    })
  }
  getDossiersEmployeeImportCountPeryear(year : number){
    this.service.getCurrentUser().subscribe(data => {
      this.CurrentUser = data;
      this.service.getEmployeeFoldercountPerTypeWithYear(this.CurrentUser.username, 'Import', year).subscribe(data => {
        this.import = data;
        this.service.getEmployeeFoldercountPerTypeWithYear(this.CurrentUser.username, 'Export', year).subscribe(data => {
          this.export = data;
          this.pieChartLabels = ['Import', 'Export'];
          this.pieChartData = [this.import, this.export];
        })
      })
    })
    }


    //for Employee Dashboard
  getFoldersEmployee(){
    this.service.getCountFoldersEmployee('All').subscribe(data =>{
      this.EmployeeFolders = data;
    })
}
  getFoldersEmployeeImport(){
    this.service.getCountFoldersEmployee('Import').subscribe(data =>{
      this.EmployeeFoldersImport = data;
    })
  }
  getFoldersEmployeeExport(){
    this.service.getCountFoldersEmployee('Export').subscribe(data =>{
      this.EmployeeFoldersExport = data;
    })
  }
  getFoldersEmployeeEntraitement(){
    this.service.getCountFoldersEmployee('Entraitement').subscribe(data =>{
      this.EmployeeFoldersEnattente = data;
    })
  }
  getFoldersEmployeeCompleted(){
    this.service.getCountFoldersEmployee('Terminer').subscribe(data =>{
      this.EmployeeFoldersCompleted = data;
    })
  }


  //for Client Dashboard
  getFoldersClient(){
    this.service.getCountFoldersClient('All').subscribe(data =>{
      this.ClientFolders = data;
    })
  }
  getFoldersClientImport(){
    this.service.getCountFoldersClient('Import').subscribe(data =>{
      this.ClientFoldersImport = data;
    })
  }
  getFoldersClientExport(){
    this.service.getCountFoldersClient('Export').subscribe(data =>{
      this.ClientFoldersExport = data;
    })
  }
  getFoldersClientEnAttente(){
    this.service.getCountFoldersClient('Enattente').subscribe(data =>{
      this.ClientFoldersEnattente = data;
    })
  }
  getFoldersClientEntraitement(){
    this.service.getCountFoldersClient('Entraitement').subscribe(data =>{
      this.ClientFoldersEntraitement = data;
    })
  }
  getFoldersClientCompleted(){
    this.service.getCountFoldersEmployee('Terminer').subscribe(data =>{
      this.ClientFoldersCompleted = data;
    })
  }

  loadScripts() {

    // This array contains all the files/CDNs
    const dynamicScripts = [
      'assets/plugins/table/datatable/datatables.js',
      'assets/plugins/table/datatable/button-ext/dataTables.buttons.min.js',
      'assets/plugins/table/datatable/button-ext/jszip.min.js',
      'assets/plugins/table/datatable/button-ext/buttons.html5.min.js',
      'assets/plugins/table/datatable/button-ext/buttons.print.min.js',
      'assets/export_table.js',
      //Load all your script files here'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    } }
}