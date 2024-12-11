import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as XLSX from "xlsx";
import {ActivatedRoute} from "@angular/router";
import {Vm} from "../../../../Entities/Vm.interface";
import {vmService} from "../../../service/vm.service";
import {ChangementAppService} from "../../../service/ChangementAppService";
import {ChangementVCenter} from "../../../../Entities/ChangementVCenter.interface";

@Component({
  selector: 'app-information-detailles',
  templateUrl: './information-detailles.component.html',
  styleUrls: ['./information-detailles.component.css']
})
export class InformationDetaillesComponent implements OnInit{
  role : Vm={
    id: 0,
    code:"",
    nom: "",
    fqdn: "",
    hostName: "",
    statut: "",
    vcpu: 0,
    consumedMemory: 0,
    assignedMemory: 0,
    assignedStorage: 0,
    storageConsumed: 0,
    operationSys: "",
    sqlLicence: "",
    facturable: false,
    selected:false,
    selectedClientdelivery : "",
    selectedClient : "",
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
  role_id=2;
  showDatePicker = false;
  selectedDate: string  = "";
  changements :  ChangementVCenter[]=[];
  changementsFilter :  ChangementVCenter[]=[];

  constructor(private http:HttpClient,private route: ActivatedRoute, private vmService : vmService, private changementApp: ChangementAppService) {
  }
  exportexcel(): void {
    const headers = ['name',	'Ste',	'fqdn',	'userID', 'lastName', 'statut', 'vcpu', 'consumedMemory', 'assignedMemory', 'assignedStorage','storageConsumed','operationSystem','sqlLicence'];
    const data = Object.values(this.role).filter((value, index) => index !== 0);
    const dataArrayWithHeaders = [headers, data];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArrayWithHeaders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.role.nom+ ".xlsx");
  }

  //changements App
  fetchChangement(){
    this.changementApp.getChangementClient().subscribe({
      next : data =>{
        this.changements=data.filter(changement=> {
          return changement.nomVm == this.nomVm
        });

        // @ts-ignore
        this.changements.sort((a, b) =>   new Date(b.date) - new Date(a.date));
        // this.filteredChangementsClient = this.changementsClient;
        this.changementsFilter=this.changements
        console.log(this.changements)
      },
    })
  }
  nomVm:String="";
  roleFilter : Vm ={
    id: 0,
    code:"",
    nom: "",
    fqdn: "",
    hostName: "",
    statut: "",
    vcpu: 0,
    consumedMemory: 0,
    assignedMemory: 0,
    assignedStorage: 0,
    storageConsumed: 0,
    operationSys: "",
    sqlLicence: "",
    facturable: false,
    selected:false,
    selectedClientdelivery : "",
    selectedClient : "",
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
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.role_id = +params['id'];
      this.getRole(this.role_id);
    })
    this.fetchChangement();
  }

  getRole(roleId: number) {
    this.vmService.getVmById(roleId)
      .subscribe({
        next : data =>{
          if(data.client!=null)
            this.role = data;
          this.nomVm = this.role.nom;
          this.roleFilter = data;
        },
      })
  }
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.dateFilter();
    this.showDatePicker = false;
  }
  tmp:string="";
  dateFilter(){
    if(this.changements){
      this.findMax("CPU")
      if(this.tmp!="")
        this.roleFilter.vcpu = +this.tmp;
      else this.roleFilter.vcpu = this.role.vcpu;
      this.findMax("ASSIGNED_STORAGE")
      if(this.tmp!="")
        this.roleFilter.assignedStorage = +this.tmp;
      else this.roleFilter.assignedStorage = this.role.assignedStorage;
      this.findMax("ASSIGNED_Memory")
      if(this.tmp!="")
        this.roleFilter.assignedMemory = +this.tmp;
      else this.roleFilter.assignedMemory = this.role.assignedMemory;
    }
  }

  findMax(att:string): Date | null {
    this.tmp=""
    const selectedDateOnly = new Date(this.selectedDate);
    const selectedDateFormat = new Date(selectedDateOnly.getFullYear(), selectedDateOnly.getMonth(), selectedDateOnly.getDate());
    let minFormat: Date | null = null;
    console.log(this.changements)
    console.log("----------------------")
    this.changements.forEach(c => {
      const tmp = new Date(c.date)
      const dateFormat = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
      if(c.valeurChanger === att)
        if (dateFormat >= selectedDateFormat && (minFormat === null || dateFormat <= minFormat) ) {
          minFormat = dateFormat;
          this.tmp=c.ancienneDonnee;
          console.log(this.tmp);
        }
        else this.tmp = c.nouvelleDonnee
    });
    return minFormat;
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }


  filterChangementsByDate() {
    if (this.selectedDate) {
      /*const selectedDateOnly = new Date(this.selectedDate).toISOString().split('T')[0];
      this.filteredChangementsClient = this.changementsClient.filter(changement =>
        new Date(changement.date).toISOString().split('T')[0] === selectedDateOnly
      );*/
    }
    /*
    else {
      this.filteredChangementsClient = this.changementsClient;
    }*/
  }

}
