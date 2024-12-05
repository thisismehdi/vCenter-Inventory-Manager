package com.mehdi.vCenter.Inventory.Manager.controllers;
import com.mehdi.vCenter.Inventory.Manager.entities.Personne;
import com.mehdi.vCenter.Inventory.Manager.services.PersonneService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PersonneController {
    private PersonneService personneService;

    @GetMapping("/personnes")
    public List<Personne> getAllPersonnes(){
        return personneService.getAllPersonnes();
    }

    @GetMapping("/personne/{id}")
    public Personne getPersonneById(@RequestParam Long personneId){
        return personneService.getPersonneById(personneId);
    }

    @PostMapping("/personne")
    public Personne savePersonne( @RequestBody Personne personne){
        return personneService.savePersonne(personne);
    }

    @PutMapping("/personne/{id}")
    public Personne updatePersonne(@PathVariable Long id,@RequestBody Personne personne){return personneService.updatePersonne(id,personne);   }
}
