package com.mehdi.vCenter.Inventory.Manager.controllers;

import com.mehdi.vCenter.Inventory.Manager.entities.Client;
import com.mehdi.vCenter.Inventory.Manager.services.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CLientController {
    private ClientService clientService;
    @GetMapping("/clients")
    public List<Client> getAllClients(){
        return clientService.getAllClients();
    }

    @GetMapping("/client/{clientId}")
    public Client getClientById(@RequestParam Long clientId){
        return clientService.getClientById(clientId);
    }

    @PostMapping("/client")
    public Client saveClient(@RequestBody Client client){
        return clientService.saveClient(client);
    }

    @DeleteMapping("/client/{id}")
    public void deletClient(@PathVariable Long id){
        clientService.deleteClient(id);
    }

    @PutMapping("/client/{id}")
    public Client updateClient(@PathVariable Long id,@RequestBody Client client){
        return clientService.updateClient(id,client);
    }
}
