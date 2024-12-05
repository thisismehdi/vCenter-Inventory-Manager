package com.mehdi.vCenter.Inventory.Manager.services;

import com.mehdi.vCenter.Inventory.Manager.entities.LogEnvClient;

import java.util.List;

public interface LogEnvClientService {
    List<LogEnvClient> getAllChangements();
    LogEnvClient getChangementById(Long id);
    LogEnvClient  saveChangement(LogEnvClient changementApplication);
}
