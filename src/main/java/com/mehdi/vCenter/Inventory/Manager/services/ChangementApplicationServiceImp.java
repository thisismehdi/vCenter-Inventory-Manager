package com.mehdi.vCenter.Inventory.Manager.services;

import com.mehdi.vCenter.Inventory.Manager.entities.ChangementApplication;
import com.mehdi.vCenter.Inventory.Manager.repositories.ChangementApplicationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@AllArgsConstructor
public class ChangementApplicationServiceImp implements ChangementApplicationService {
    private ChangementApplicationRepository changementApplicationRepository;

    @Override
    public List<ChangementApplication> getAllChangements() {
       return changementApplicationRepository.findAll();
    }

    @Override
    public ChangementApplication getChangementById(Long id) {
        return changementApplicationRepository.findById(id).orElse(null);
    }

    @Override
    public ChangementApplication saveChangement(ChangementApplication changementApplication) {
        return changementApplicationRepository.save(changementApplication);
    }
}
