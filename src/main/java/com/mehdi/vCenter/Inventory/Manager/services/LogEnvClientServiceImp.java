package com.mehdi.vCenter.Inventory.Manager.services;


import com.mehdi.vCenter.Inventory.Manager.entities.LogEnvClient;
import com.mehdi.vCenter.Inventory.Manager.repositories.LogEnvClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@AllArgsConstructor
public class LogEnvClientServiceImp implements LogEnvClientService{
    private LogEnvClientRepository logEnvClientRepository;
    @Override
    public List<LogEnvClient> getAllChangements() {
        return logEnvClientRepository.findAll();
    }

    @Override
    public LogEnvClient getChangementById(Long id) {
        return logEnvClientRepository.findById(id).get();
    }

    @Override
    public LogEnvClient saveChangement(LogEnvClient changementApplication) {
        return logEnvClientRepository.save(changementApplication);
    }
}
