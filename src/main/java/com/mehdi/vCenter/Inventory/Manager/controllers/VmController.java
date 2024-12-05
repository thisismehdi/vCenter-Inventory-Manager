package com.mehdi.vCenter.Inventory.Manager.controllers;

import com.mehdi.vCenter.Inventory.Manager.entities.Vm;
import com.mehdi.vCenter.Inventory.Manager.services.VmService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VmController {
    private VmService vmService;
    @GetMapping("/vms")
    public List<Vm> getAllVms(){
        return vmService.getAllRoles();
    }

    @GetMapping("/vm/{vmId}")
    public Vm getVmById(@RequestParam Long vmId){
        return vmService.getRoleById(vmId);
    }

    @PostMapping("/vm")
    public Vm saveVm(@RequestBody Vm vm){
        return vmService.saveRole(vm);
    }

    @DeleteMapping("/vm/{id}")
    public void deleteVm(@RequestParam Long id){
        vmService.deleteRole(id);
    }

    @PutMapping("/vm/{id}")
    public Vm updateVm(@PathVariable Long id, @RequestBody Vm vm){
        return vmService.updateRole(id,vm);
    }

    @GetMapping("/vmClient/{clientId}")
    public List<Vm> getVMsByClientId(@PathVariable Long clientId) {
        return vmService.getVMsByClientId(clientId);
    }

}
