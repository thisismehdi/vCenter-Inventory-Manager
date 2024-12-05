package com.mehdi.vCenter.Inventory.Manager.services;


import com.mehdi.vCenter.Inventory.Manager.entities.ChangementApplication;
import com.mehdi.vCenter.Inventory.Manager.entities.Client;
import com.mehdi.vCenter.Inventory.Manager.entities.Personne;
import com.mehdi.vCenter.Inventory.Manager.entities.Vm;
import com.mehdi.vCenter.Inventory.Manager.repositories.ChangementApplicationRepository;
import com.mehdi.vCenter.Inventory.Manager.repositories.ClientRepository;
import com.mehdi.vCenter.Inventory.Manager.repositories.PersonneRepository;
import com.mehdi.vCenter.Inventory.Manager.repositories.VmRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientServiceImp implements ClientService{
    private ClientRepository clientRepository;
    private ChangementApplicationRepository changementApplicationRepository;
    private VmRepository vmRepository;
    private PersonneRepository personneRepository;

    private void logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
        ChangementApplication changement = new ChangementApplication();
        changement.setDate(new Date());
        changement.setTypeChangement(typeChangement);
        changement.setAction(action);
        changement.setPlaceChangement(placeChangement);
        changement.setSection(section);
        changement.setNomVm(nomVm);
        changement.setUtilisateur(utilisateur);
        changement.setNomClient(nomClient);
        changement.setAncienneDonnee(ancienneDonnee);
        changement.setNouvelleDonnee(nouvelleDonnee);
        changement.setDescription(description);
        changementApplicationRepository.save(changement);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientById(Long clientId) {
        return clientRepository.findById(clientId).orElse(null);
    }

    @Override
    public Client saveClient(Client client) {
        Client savedClient = clientRepository.save(client);
        //logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
        logChange("Client","Ajout","Configuration","Référentiel client",client.getNom(),"-","Mehdi FILALI","-",client.getNom(),"Ajout de client "+client.getNom());
        //logChange("Client","Ajout","Inventaire","-",client.getNom(),"-","Mehdi FILALI","-",client.getNom(),"Ajout de client "+client.getNom());
        return savedClient;
    }

    @Override
    public void deleteClient( Long id){
        if(clientRepository.existsById(id)){
            Client client = getClientById(id);
            if(client.getVm()==null) {
                logChange("Client", "Suppression", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client.getNom(), "-", "Suppression de client " + client.getNom());
                //logChange("Client","Suppression","Inventaire","-",client.getNom(),"-","Mehdi FILALI",client.getNom(),"-","Suppression de client "+client.getNom());
            }
            clientRepository.deleteById(id);
        }

    }

    @Override
    public Client updateClient(Long id, Client client) {
        return clientRepository.findById(id)
                .map(client1 -> {
                    List<Vm> vms = new ArrayList<>();
                    vms = vmRepository.findByClientId(id);
                    if(!client.getNom().equals(client1.getNom())) {
                        logChange("Nom de client", "Modification", "Inventaire", "-", client.getNom(), "-", "Mehdi FILALI", client1.getNom(), client.getNom(), "Changment de Nom de client " + client1.getNom()+" à "+client.getNom());
                        logChange("Nom de client", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getNom(), client.getNom(), "Changment de Nom de client " + client1.getNom()+" à "+client.getNom());
                        for (Vm vm : vms){
                            logChange("Nom de client", "Modification", "Configuration", "Vm assignée", client.getNom(),vm.getNom() , "Mehdi FILALI", client1.getNom(), client.getNom(), "Changment de Nom de client " + client1.getNom()+" à "+client.getNom());
                            logChange("Nom de client", "Modification", "Inventaire", "-", client.getNom(),  vm.getNom(), "Mehdi FILALI", client1.getNom(), client.getNom(), "Changment de Nom de client " + client1.getNom()+" à "+client.getNom());
                            logChange("Nom de client", "Modification", "Configuration", "Référentiel client", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getNom(), client.getNom(), "Changment de Nom de client " + client1.getNom()+" à "+client.getNom());
                        }
                    }
                    if(!client.getSte().equals(client1.getSte())) {
                        logChange("STE", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de STE de " + client1.getSte()+" à "+client.getSte());
                        //log User ID
                        logChange("User ID", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de User ID de " + client1.getUserID()+" à "+client.getUserID());
                        //Log Last Name
                        logChange("Last Name", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de Last Name de " + client1.getLastName()+" à "+client.getLastName());
                        for (Vm vm : vms){
                            logChange("STE", "Modification", "Configuration", "Vm Assingée", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de STE de " + client1.getSte()+" à "+client.getSte());
                            logChange("STE", "Modification", "Inventaire", "-", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de STE de " + client1.getSte()+" à "+client.getSte());
                            // log User ID and
                            logChange("User ID", "Modification", "Configuration", "Vm Assingée", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de User ID de " + client1.getUserID()+" à "+client.getUserID());
                            logChange("User ID", "Modification", "Inventaire", "-", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de User ID de " + client1.getUserID()+" à "+client.getUserID());
                            //Last Name
                            logChange("Last Name", "Modification", "Configuration", "Vm Assingée", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de Last Name de " + client1.getLastName()+" à "+client.getLastName());
                            logChange("Last Name", "Modification", "Inventaire", "-", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getSte(), client.getSte(), "Changment de Last Name de " + client1.getLastName()+" à "+client.getLastName());
                        }
                    }

                    if(client.getNotifier() != client1.getNotifier()){
                        String description = client1.getNotifier()?"le delivery sera non notifié":"le delivery sera notifié";
                        logChange("Notification", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getNotifier()?"Notifié":"Non notifié", client1.getNotifier()?"Non notifié":"Notifié", description);
                    }

                    if(client.getPersonne().getId()!=client1.getPersonne().getId()){
                        Optional<Personne> personneOptional = personneRepository.findById(client.getPersonne().getId());
                        Personne personne = personneOptional.get();
                        String description = "Changer le Delivery de "+ client1.getPersonne().getNom()+" à "+personne.getNom()+" pour le client : "+client1.getNom();
                        logChange("Delivery", "Modification", "Configuration", "Référentiel client", client.getNom(), "-", "Mehdi FILALI", client1.getPersonne().getNom(), personne.getNom(), description);
                        for (Vm vm : vms){
                            logChange("Delivery", "Modification", "Configuration", "Vm Assingée", client.getNom(), vm.getNom(), "Mehdi FILALI", client1.getPersonne().getNom(), personne.getNom(), description);
                        }
                    }
                    client1 = new Client(client);
                    return clientRepository.save(client1);
                }).orElseThrow(() -> new RuntimeException("Client with ID " + id + " not found"));
    }
/*detectChanges(){
    this.changementClient(this.client);
    this.changement.action = 'Modification';
    this.vmService.getVMsByClientId(this.client.id).subscribe(data => {
      this.vmNames = data.map(vm => vm.nom);
    if(this.oldClient.nom != this.client.nom){
      this.changement.typeChangement = 'nom';
      this.changement.ancienneDonnee = this.oldClient.nom;
      this.changement.nouvelleDonnee = this.client.nom;
      this.changement.description = 'changment le nom de client de '+this.oldClient.nom+' à '+this.client.nom;
      this.saveChangement(this.changement);
      //console.log(this.vmNames)
        for(let vm of this.vmNames){
          this.changement.nomVm = vm;
          this.saveChangement(this.changement);
          //console.log(this.changement)
        }
    }
    this.changementClient(this.client);
    this.changement.action = 'Modification';
    if(this.oldClient.ste != this.client.ste){
      this.changement.typeChangement = 'STE';
      this.changement.ancienneDonnee = this.oldClient.ste;
      this.changement.nouvelleDonnee = this.client.ste;
      this.changement.description = 'changment de STE de client de '+this.oldClient.ste+' à '+this.client.ste;
      this.saveChangement(this.changement);
        for(let vm of this.vmNames){
         this.changement.nomVm = vm;
          this.saveChangement(this.changement);
         // console.log(this.changement)
        }
    }
    });
  }
*/
}
