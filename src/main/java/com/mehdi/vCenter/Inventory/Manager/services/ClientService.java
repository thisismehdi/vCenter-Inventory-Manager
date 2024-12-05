package com.mehdi.vCenter.Inventory.Manager.services;



import com.mehdi.vCenter.Inventory.Manager.entities.Client;

import java.util.List;

public interface ClientService {
    List<Client> getAllClients();
    Client getClientById(Long clientId);
    Client  saveClient(Client client);
    void deleteClient(Long id);
    public Client updateClient(Long id,Client client);

}
