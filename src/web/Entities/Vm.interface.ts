import {Client} from "./Client.interface";

export interface Vm{
  id: number
  code : string;
  nom: string;
  fqdn: string;
  hostName: string;
  statut: string;
  vcpu: number;
  consumedMemory: number;
  assignedMemory: number;
  assignedStorage: number;
  storageConsumed: number;
  operationSys: string;
  sqlLicence: string;
  facturable: boolean;
  selected? :boolean;
  client? : Client;
  selectedClientdelivery : string;
  selectedClient : string;

  dateAffectation : Date;


}
