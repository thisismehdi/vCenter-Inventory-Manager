import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import * as XLSX from "xlsx";
import {vmService} from "../../../service/vm.service";
import {Vm} from "../../../../Entities/Vm.interface";

@Component({
  selector: 'app-information-total',
  templateUrl: './information-total.component.html',
  styleUrls: ['./information-total.component.css']
})
export class InformationTotalComponent {
  vms : Array<Vm> =[];
  role:Vm = {
    id:0,
    code:'',
    nom: '',
    fqdn: '',
    hostName: '',
    statut: '',
    vcpu: 0,
    consumedMemory: 0,
    assignedMemory: 0,
    assignedStorage: 0,
    storageConsumed: 0,
    operationSys: '',
    sqlLicence: '',
    facturable:true,
    selectedClientdelivery : '',
    selectedClient : '',
    client :{
      id : 0,
      nom: "",
      ste: "",
      userID : "",
      lastName :"",
      selectedDelivery:"",
      notifier: false,
      personne: {
        id : 0
      }
    },
    dateAffectation : new Date()
  }
  totalVm=0
  consumedMemory = 0;
  assignedMemory = 0;
  assignedStorage = 0;
  storageConsumed = 0;
  ste ="";

  constructor(private http:HttpClient, private vmService : vmService,private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const clientId = +params['id'];
      this.getVms(clientId);
    });
  }
  exportexcel(): void {
    const headers = ['name',	'Ste',	'vcpu',	'consumedMemory', 'assignedMemory', 'assignedStorage', 'storageConsumed'];
    const data = Object.values(this.role).filter((value, index) => index !== 0 && index !== 3&& index !== 4&& index !== 5&& index !== 6&& index !== 13&& index !== 14);
    const dataArrayWithHeaders = [headers, data];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArrayWithHeaders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.role.nom + ".xlsx");
  }

  calculeDesRoles(){
  }

  getVms(clientid:number){
    this.vmService.getVMsByClientId(clientid)
      .subscribe({
        next: data => {
          this.vms = data;
          this.totalVm = this.vms.length;
          this.vms.forEach(role =>{
            this.role.consumedMemory += role.consumedMemory;
            this.role.assignedMemory +=role.assignedMemory;
            this.role.assignedStorage += role.assignedStorage/8000000000;
            this.role.storageConsumed +=role.storageConsumed;
            this.role.vcpu += role.vcpu;
            this.role.nom = role.nom;
          });
        },
        error: err => {
          console.error('Error fetching VMs', err);
        }
      });
  }
}
