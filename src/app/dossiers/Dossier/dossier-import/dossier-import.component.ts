import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DossierService} from "../../../Services/dossier.service";
import {Dossier} from "../../../Models/dossier";
import {Router} from "@angular/router";
import {AuthService} from "../../../Login/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  encapsulation : ViewEncapsulation.None,
  selector: 'app-dossier-import',
  templateUrl: './dossier-import.component.html',
  styleUrls: ['./dossier-import.component.css']
})
export class DossierImportComponent implements OnInit {


  doss_import : any;
  public comp = 3;
  public enatt = 1;
  public entrai = 2;


  constructor( private service : DossierService , private router : Router, private Auth : AuthService, private toastr : ToastrService) {
  }


  ngOnInit(): void {


    this.getDossierImport();

  }

  getDossierImport() {
    if (this.Auth.isAdmin()){
    this.service.getDossiersImport().subscribe(
      data => {
        this.doss_import = data;
        this.doss_import = this.doss_import._embedded.dossiers;
        this.loadScripts();
      });
  }
    else if (this.Auth.isEmployee()){
      this.service.getLoggedInEmployeeFolders('Import').subscribe(
        data =>{
          this.doss_import = data;
          this.loadScripts();
        });
    }
    else  if (this.Auth.isClient()) {
      this.service.getLoggedInClientFolders('Import').subscribe(
        data =>{
          this.doss_import = data;
          this.loadScripts();
        });

    }
  }

  //Delete Dossier
  DeleteDossier( p : Dossier){
    let conf = confirm("Are you sure ?");
    if (conf)
      this.service.DeleteDossier(p.id).subscribe(() => {
        this.toastr.success('Dossier a été supprimer avec success', 'Suppression dossier');
        setTimeout(() => {
          window.location.reload();
          // And any other code that should run only after 5s
        }, 2000);
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

}