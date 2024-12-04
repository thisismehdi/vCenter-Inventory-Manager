import {Personne} from "./Personne.interface";

export interface Client {
  id : number;
  nom : string;
  ste : string;
  userID : string;
  lastName: string;
  notifier : boolean;
  personne : Personne;
  modifier? : boolean;
  selectedDelivery : string;
}
