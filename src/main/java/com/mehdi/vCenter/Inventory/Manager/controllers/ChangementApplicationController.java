package com.mehdi.vCenter.Inventory.Manager.controllers;
import com.mehdi.vCenter.Inventory.Manager.entities.ChangementApplication;
import com.mehdi.vCenter.Inventory.Manager.services.ChangementApplicationServiceImp;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ChangementApplicationController {
    private ChangementApplicationServiceImp changementApplicationServiceImp;

    @GetMapping("/changementsApp")
    public List<ChangementApplication> getAllChangements(){
        return changementApplicationServiceImp.getAllChangements();
    }

    @GetMapping("/changementApp/{id}")
    public ChangementApplication getChangementById(@RequestParam Long id){
        return changementApplicationServiceImp.getChangementById(id);
    }

    @PostMapping("/changementApp")
    public ChangementApplication saveClient(@RequestBody ChangementApplication changementApplication){
        return changementApplicationServiceImp.saveChangement(changementApplication);
    }

}
