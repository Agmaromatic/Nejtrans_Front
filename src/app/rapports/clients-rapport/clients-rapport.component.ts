import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Helper} from "../../Models/rapportAgents/helper";
import {Subhelper} from "../../Models/rapportAgents/subhelper";
import {RapportService} from "../../Services/rapport.service";
import {UserService} from "../../Services/user.service";
import {User} from "../../Models/user";

@Component({
  encapsulation : ViewEncapsulation.None,
  selector: 'app-clients-rapport',
  templateUrl: './clients-rapport.component.html',
  styleUrls: ['./clients-rapport.component.css']
})
export class ClientsRapportComponent implements OnInit {
  helper : Helper[];
  sub : Subhelper[]
  clients : User[];
  ClientsList : User[];
  client_helper:any;

  constructor(private service : RapportService  , private serv : UserService) {
  }

  ngOnInit(): void {
    this.getAgentsData();
    this.getClientList();

  }
  getAgentsData(){
    this.getClients();
    this.service.getFoldersClientData().subscribe(data =>{
      this.helper = data;
      this.loadScripts();
    })

  }

  getClients(){
    this.serv.getClients().subscribe(
      data =>{
        this.client_helper = data;
        this.clients = this.client_helper._embedded.users;
      });
  }


  getClientList(){
    this.serv.getClients().subscribe(
      data =>{
        this.client_helper = data;
        this.ClientsList = this.client_helper._embedded.users;
        this.loadScripts_1()
        console.log(this.ClientsList);
      });

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

  loadScripts_1() {

    // This array contains all the files/CDNs
    const dynamicScripts = [
      'assets/plugins/table/datatable/datatables.js',
      'assets/sorting_table.js',
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
