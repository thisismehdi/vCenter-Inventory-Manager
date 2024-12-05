package com.mehdi.vCenter.Inventory.Manager.controllers;

import com.mehdi.vCenter.Inventory.Manager.entities.LogEnvClient;
import com.mehdi.vCenter.Inventory.Manager.services.LogEnvClientServiceImp;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LogEnvClientController {
    private LogEnvClientServiceImp clientServiceImp;
    @GetMapping("/logs")
    public List<LogEnvClient> getAllChangements(){
        return clientServiceImp.getAllChangements();
    }

    @GetMapping("/log/{id}")
    public LogEnvClient getChangementById(@RequestParam Long id){
        return clientServiceImp.getChangementById(id);
    }

    @PostMapping("/log")
    public LogEnvClient saveClient(@RequestBody LogEnvClient logEnvClient){
        return clientServiceImp.saveChangement(logEnvClient);
    }
}
