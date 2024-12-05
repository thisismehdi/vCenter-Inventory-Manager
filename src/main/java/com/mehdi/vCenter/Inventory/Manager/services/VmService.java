package com.mehdi.vCenter.Inventory.Manager.services;

import com.mehdi.vCenter.Inventory.Manager.entities.Vm;

import java.util.List;

public interface VmService {
    List<Vm> getAllRoles();
    Vm getRoleById(Long roleId);

    Vm saveRole(Vm role);
    void deleteRole(Long id);
    Vm updateRole(Long id, Vm role);
    List<Vm> getVMsByClientId(Long clientId);
}
