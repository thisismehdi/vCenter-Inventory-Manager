package com.mehdi.vCenter.Inventory.Manager.services;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mehdi.vCenter.Inventory.Manager.config.AppConfig;
import com.mehdi.vCenter.Inventory.Manager.dtos.VmDetailsResponse;
import com.mehdi.vCenter.Inventory.Manager.dtos.VmSummaryResponse;
import com.mehdi.vCenter.Inventory.Manager.dtos.VmSummaryResponseWrapper;
import com.mehdi.vCenter.Inventory.Manager.entities.ChangementApplication;
import com.mehdi.vCenter.Inventory.Manager.entities.Client;
import com.mehdi.vCenter.Inventory.Manager.entities.LogEnvClient;
import com.mehdi.vCenter.Inventory.Manager.entities.Vm;
import com.mehdi.vCenter.Inventory.Manager.repositories.ChangementApplicationRepository;
import com.mehdi.vCenter.Inventory.Manager.repositories.LogEnvClientRepository;
import com.mehdi.vCenter.Inventory.Manager.repositories.VmRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class VmServiceImp implements VmService {
    private static final Logger logger = LoggerFactory.getLogger(VmServiceImp.class);

    private final VmRepository vmRepository;
    private final RestTemplate restTemplate;
    private final AppConfig appConfig;
    private final ObjectMapper objectMapper;

    private ChangementApplicationRepository changementApplicationRepository;
    private LogEnvClientRepository logEnvClientRepository;
    private static final String VCENTER_API_URL = "https://ilemcnsvcenter.ilem.net/rest/vcenter/vm";
    private ClientServiceImp clientService;
    private void logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
        ChangementApplication changement = new ChangementApplication();
        changement.setDate(new Date());
        changement.setTypeChangement(typeChangement);
        changement.setAction(action);
        changement.setPlaceChangement(placeChangement);
        changement.setSection(section);
        changement.setNomVm(nomVm);
        changement.setUtilisateur(utilisateur);
        changement.setNomClient(nomClient);
        changement.setAncienneDonnee(ancienneDonnee);
        changement.setNouvelleDonnee(nouvelleDonnee);
        changement.setDescription(description);
        changementApplicationRepository.save(changement);
    }

    @Override
    public List<Vm> getAllRoles() {
        return vmRepository.findAll();
    }

    @Override
    public Vm getRoleById(Long roleId) {
        return vmRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role with ID " + roleId + " not found"));
    }

    @Override
    public Vm saveRole(Vm role) {
        return vmRepository.save(role);
    }

    @Override
    public void deleteRole(Long id) {
        if (vmRepository.existsById(id)){
            Vm vm = getRoleById(id);
            //logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
            logChange("VM","Suppression","Configuration","VM non assignée","-",vm.getNom(),"Mehdi FILALI",vm.getNom(),"-","Suppression de VM "+vm.getNom());
            vmRepository.deleteById(id);
        }
    }

    @Override
    public Vm updateRole(Long id, Vm role) {
        return vmRepository.findById(id)
                .map(existingRole -> {
                    if(role.getClient()!=null && existingRole.getClient()==null){
                        Client client = clientService.getClientById(role.getClient().getId());
                        //logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
                        logChange("VM","Assignation","Configuration","VM non assignée",client.getNom(),role.getNom(),"Mehdi FILALI","-",client.getNom(),"Assignation de VM "+role.getNom()+" a client "+client.getNom());
                        logChange("VM","Assignation","Configuration","VM assignée",client.getNom(),role.getNom(),"Mehdi FILALI","-",client.getNom(),"Assignation de VM "+role.getNom()+" a client "+client.getNom());
                        logChange("VM","Assignation","Inventaire","-",client.getNom(),role.getNom(),"Mehdi FILALI","-",client.getNom(),"Assignation de VM "+role.getNom()+" a client "+client.getNom());
                        role.setDateAffectation(new Date());
                    }
                    else if(role.getClient()==null && existingRole.getClient()!=null){
                        Client client = clientService.getClientById(existingRole.getClient().getId());
                        //logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
                        logChange("VM","Assignation","Configuration","VM non assignée",client.getNom(),role.getNom(),"Mehdi FILALI",client.getNom(),"-","Suppression d'assignation de VM "+role.getNom()+" avec client "+client.getNom());
                        logChange("VM","Assignation","Configuration","VM assignée",client.getNom(),role.getNom(),"Mehdi FILALI",client.getNom(),"-","Suppression d'assignation de VM "+role.getNom()+" avec client "+client.getNom());
                        logChange("VM","Assignation","Inventaire","-",client.getNom(),role.getNom(),"Mehdi FILALI",client.getNom(),"-","Suppression d'assignation de VM "+role.getNom()+" avec client "+client.getNom());
                        role.setDateAffectation(null);
                    }
                    else if (role.getFacturable()!=existingRole.getFacturable()){
                        Client client = clientService.getClientById(role.getClient().getId());
                        String annc = role.getFacturable()?"non facturable":"facturable" ;
                        String nov = !role.getFacturable()?"non facturable":"facturable";
                        //logChange(String typeChangement, String action, String placeChangement, String section, String nomClient, String nomVm, String utilisateur, String ancienneDonnee, String nouvelleDonnee, String description) {
                        logChange("VM","Modification","Configuration","VM assignée",client.getNom(),role.getNom(),"Mehdi FILALI",annc,nov,"Changement le statut de VM "+role.getNom()+" de "+annc+" a "+nov);
                    }

                    existingRole = new Vm(role);
                    System.out.println(existingRole.getCode());
                    return vmRepository.save(existingRole);
                }).orElseThrow(() -> new RuntimeException("Role with ID " + id + " not found"));
    }

    @Override
    public List<Vm> getVMsByClientId(Long clientId) {
        return vmRepository.findByClientId(clientId);
    }

    //@Scheduled(cron = "0 17 15 * * *")
    public void fetchAndSaveVms() {
        String sessionToken = appConfig.getSessionToken();
        List<LogEnvClient> logs = new ArrayList<>();

        List<VmSummaryResponse> vmSummaries = fetchVmSummariesFromApi(sessionToken);
        List<Vm> vms = new ArrayList<>();
        List<Vm> existingVms = vmRepository.findAll();
        Map<String, Vm> oldVmMap = existingVms.stream()
                .collect(Collectors.toMap(
                        Vm::getCode,
                        vm -> vm,
                        (existing, replacement) -> existing
                ));
        for (VmSummaryResponse vmSummary : vmSummaries) {
            VmDetailsResponse vmDetailsResponse = fetchVmDetailsFromApi(vmSummary.getVm(), sessionToken);
            Vm vm = mapToVmEntity(vmSummary, vmDetailsResponse);
            vms.add(vm);
        }
        Map<String, Vm> newVmMap = vms.stream().collect(Collectors.toMap(Vm::getCode, vm -> vm));

        for (Vm newVm : vms) {
            if (!oldVmMap.containsKey(newVm.getCode())) {
                logs.add(createLog("Configuration","Vm non assignée","Ajout","-", newVm.getNom(), "", newVm.getNom(), "Ajout de VM " + newVm.getNom()));
                vmRepository.save(newVm);
            }
        }

        for (Vm oldVm : existingVms) {
            if (!newVmMap.containsKey(oldVm.getCode())) {
                String test = oldVm.getClient()!=null?""+oldVm.getClient().getNom():"-";
                logs.add(createLog("Configuration","Vm non assignée","Suppression",test, oldVm.getNom(), oldVm.getNom(), "", "Suppression de vm " + oldVm.getNom()));
                vmRepository.deleteById(oldVm.getId());
            }
        }

        for (Vm newVm : vms) {
            Vm oldVm = oldVmMap.get(newVm.getCode());
            if (oldVm != null) {
                compareVmAttributes(logs, oldVm, newVm);
            }
        }
        //vmRepository.saveAll(vms);
        logEnvClientRepository.saveAll(logs);
       //System.out.println(logs);
    }

    private void compareVmAttributes(List<LogEnvClient> logs, Vm oldVm, Vm newVm) {
        boolean check = false;
        if (!Objects.equals(oldVm.getNom(), newVm.getNom())) {
            if(oldVm.getClient()==null)
                logs.add(createLog("Configuration","Vm non assignée","Modification","-", newVm.getNom(), oldVm.getNom(), newVm.getNom(), "Le nom de vm a été changer de "+oldVm.getNom()+" a "+newVm.getNom()));
            else {
                logs.add(createLog("Configuration", "Vm assignée", "Modification",oldVm.getClient().getNom(), newVm.getNom(), oldVm.getNom(), newVm.getNom(), "Le nom de vm a été changer de " + oldVm.getNom() + " a " + newVm.getNom()));
                logs.add(createLog("Inventaire", "-", "Modification",oldVm.getClient().getNom(), newVm.getNom(), oldVm.getNom(), newVm.getNom(), "Le nom de vm a été changer de " + oldVm.getNom() + " a " + newVm.getNom()+" pour le client "+oldVm.getClient().getNom()));
            }
            check = true;
        }
        if (!Objects.equals(oldVm.getFqdn(), newVm.getFqdn())) {
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification", oldVm.getClient().getNom(), newVm.getNom(), oldVm.getFqdn(), newVm.getFqdn(), "Le FQDN a été changer de "+oldVm.getFqdn()+" a "+newVm.getFqdn()));
            else
                logs.add(createLog("-","-","Modification", "-", newVm.getNom(), oldVm.getFqdn(), newVm.getFqdn(), "Le FQDN a été changer de "+oldVm.getFqdn()+" a "+newVm.getFqdn()));

            check = true;
        }
        if (!Objects.equals(oldVm.getHostName(), newVm.getHostName())) {
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(), newVm.getNom(), oldVm.getHostName(), newVm.getHostName(), "Le HostName a été changer de "+oldVm.getHostName()+" a "+newVm.getHostName()));
            else
                logs.add(createLog("-","-","Modification","-", newVm.getNom(), oldVm.getHostName(), newVm.getHostName(), "Le HostName a été changer de "+oldVm.getHostName()+" a "+newVm.getHostName()));

            check = true;
        }
        if (!Objects.equals(oldVm.getStatut(), newVm.getStatut())) {
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(), newVm.getNom(), oldVm.getStatut(), newVm.getStatut(), "Le Statut a été changer de "+oldVm.getStatut()+" a "+newVm.getStatut()));
            else
                logs.add(createLog("-","-","Modification","-", newVm.getNom(), oldVm.getStatut(), newVm.getStatut(), "Le Statut a été changer de "+oldVm.getStatut()+" a "+newVm.getStatut()));

            check = true;
        }
        if (oldVm.getVcpu() != newVm.getVcpu()) {
            String description;
            if(oldVm.getVcpu() > newVm.getVcpu())
                description = "Diminution de CPU de "+oldVm.getVcpu()+" vers "+newVm.getVcpu();
            else
                description = "Augmentation de CPU de "+oldVm.getVcpu()+" vers "+newVm.getVcpu();
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(), newVm.getNom(), ""+oldVm.getVcpu(), String.valueOf(newVm.getVcpu()), description));
            else
                logs.add(createLog("-","-","Modification","-", newVm.getNom(), String.valueOf(oldVm.getVcpu()), String.valueOf(newVm.getVcpu()), description));
            check = true;
        }
        if (oldVm.getConsumedMemory() != newVm.getConsumedMemory()) {
            String description;
            if(oldVm.getConsumedMemory() > newVm.getConsumedMemory())
                description = "Diminution de Consumed Memory de "+oldVm.getConsumedMemory()+" vers "+newVm.getConsumedMemory();
            else
                description = "Augmentation de Consumed Memory de "+oldVm.getConsumedMemory()+" vers "+newVm.getConsumedMemory();
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(),  newVm.getNom(), String.valueOf(oldVm.getConsumedMemory()), String.valueOf(newVm.getConsumedMemory()), description));
            else
                logs.add(createLog("Inventaire","-","Modification","-",  newVm.getNom(), String.valueOf(oldVm.getConsumedMemory()), String.valueOf(newVm.getConsumedMemory()), description));
            check = true;
        }
        if (oldVm.getAssignedMemory() != newVm.getAssignedMemory()) {
            String description;
            if(oldVm.getAssignedMemory() > newVm.getAssignedMemory())
                description = "Diminution de Assigned Memory de "+oldVm.getAssignedMemory()+" vers "+newVm.getAssignedMemory();
            else
                description = "Augmentation de Assigned Memory de "+oldVm.getAssignedMemory()+" vers "+newVm.getAssignedMemory();
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(), newVm.getNom(), String.valueOf(oldVm.getAssignedMemory()), String.valueOf(newVm.getAssignedMemory()), description));
            else
                logs.add(createLog("Inventaire","-","Modification","-", newVm.getNom(), String.valueOf(oldVm.getAssignedMemory()), String.valueOf(newVm.getAssignedMemory()), description));

            check = true;
        }
        if (!Objects.equals(oldVm.getAssignedStorage(), newVm.getAssignedStorage())) {
            String description;
            if(oldVm.getAssignedStorage() > newVm.getAssignedStorage())
                description = "Diminution de Assigned Storage de "+oldVm.getAssignedStorage()+" vers "+newVm.getAssignedStorage();
            else
                description = "Augmentation de Assigned Storage de "+oldVm.getAssignedStorage()+" vers "+newVm.getAssignedStorage();
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(),  newVm.getNom(), String.valueOf(oldVm.getAssignedStorage()), String.valueOf(newVm.getAssignedStorage()), description));
            else
                logs.add(createLog("Inventaire","-","Modification","-",  newVm.getNom(), String.valueOf(oldVm.getAssignedStorage()), String.valueOf(newVm.getAssignedStorage()), description));

            check = true;
        }
        if (oldVm.getStorageConsumed() != newVm.getStorageConsumed()) {
            String description;
            if(oldVm.getStorageConsumed() > newVm.getStorageConsumed())
                description = "Diminution de Storage Consumed de "+oldVm.getStorageConsumed()+" vers "+newVm.getStorageConsumed();
            else
                description = "Augmentation de Storage Consumed de "+oldVm.getStorageConsumed()+" vers "+newVm.getStorageConsumed();
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","","Modification","-",  newVm.getNom(), String.valueOf(oldVm.getStorageConsumed()), String.valueOf(newVm.getStorageConsumed()), description));
            else
                logs.add(createLog("Inventaire","","Modification","-",  newVm.getNom(), String.valueOf(oldVm.getStorageConsumed()), String.valueOf(newVm.getStorageConsumed()), description));
            check = true;
        }
        if (!Objects.equals(oldVm.getOperationSys(), newVm.getOperationSys())) {
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(),  newVm.getNom(), oldVm.getOperationSys(), newVm.getOperationSys(), "Le OperationSys a été changer de "+oldVm.getOperationSys()+" a "+newVm.getOperationSys()));
            else
                logs.add(createLog("Inventaire","-","Modification","-",  newVm.getNom(), oldVm.getOperationSys(), newVm.getOperationSys(), "Le OperationSys a été changer de "+oldVm.getOperationSys()+" a "+newVm.getOperationSys()));
            check = true;
        }
        if (!Objects.equals(oldVm.getSqlLicence(), newVm.getSqlLicence())) {
            if(oldVm.getClient()!=null)
                logs.add(createLog("Inventaire","-","Modification",oldVm.getClient().getNom(), newVm.getNom(), oldVm.getSqlLicence(), newVm.getSqlLicence(), "Le SqlLicence a été changer de "+oldVm.getSqlLicence()+" a "+newVm.getSqlLicence()));
            else
                logs.add(createLog("Inventaire","-","Modification","-", newVm.getNom(), oldVm.getSqlLicence(), newVm.getSqlLicence(), "Le SqlLicence a été changer de "+oldVm.getSqlLicence()+" a "+newVm.getSqlLicence()));
            check = true;
        }
        if(check){
             updateRole(oldVm.getId(),newVm);
        }

    }

    private LogEnvClient createLog(String placeChangement,String section,String typeChangement,String nomClient, String nomVm, String ancienneDonnee, String nouvelleDonnee, String description) {
        LogEnvClient log = new LogEnvClient();
        log.setDate(new Date());
        log.setSection(section);
        log.setPlaceChangement(placeChangement);
        log.setTypeChangement(typeChangement);
        log.setNomClient(nomClient);
        log.setNomVm(nomVm);
        log.setAncienneDonnee(ancienneDonnee);
        log.setNouvelleDonnee(nouvelleDonnee);
        log.setDescription(description);
        return log;
    }

    private List<VmSummaryResponse> fetchVmSummariesFromApi(String sessionToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("vmware-api-session-id", sessionToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    VCENTER_API_URL, HttpMethod.GET, entity, String.class);

            String responseBody = response.getBody();
            logger.debug("VM Summaries Response Body: {}", responseBody);

            VmSummaryResponseWrapper wrapper = objectMapper.readValue(responseBody, VmSummaryResponseWrapper.class);
            return wrapper.getValue();
        } catch (Exception e) {
            logger.error("Exception occurred while fetching VM summaries", e);
            throw new RuntimeException("Exception occurred while fetching VM summaries", e);
        }
    }

    private VmDetailsResponse fetchVmDetailsFromApi(String vmId, String sessionToken) {
        String vmDetailsUrl = VCENTER_API_URL + "/" + vmId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("vmware-api-session-id", sessionToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(vmDetailsUrl, HttpMethod.GET, entity, String.class);
            String responseBody = response.getBody();
            logger.debug("VM Details Response Body: {}", responseBody);
            return objectMapper.readValue(responseBody, VmDetailsResponse.class);
        } catch (Exception e) {
            logger.error("Exception occurred while fetching VM details", e);
            throw new RuntimeException("Exception occurred while fetching VM details", e);
        }
    }

    private Vm mapToVmEntity(VmSummaryResponse vmSummary, VmDetailsResponse vmDetailsResponse) {
        Vm vm = new Vm();
        vm.setFqdn(vmSummary.getName());
        vm.setAssignedMemory(vmSummary.getMemory_size_MiB());
        vm.setVcpu(vmSummary.getCpu_count());
        vm.setFacturable(false);
        VmDetailsResponse.VmDetails details = vmDetailsResponse.getValue();
        vm.setStatut(details.getPower_state());
        vm.setCode(vmSummary.getVm());
        //vm.setNom(details.getNics());
        //vm.setConsumedMemory(details.getMemory().getSize_MiB());
        vm.setAssignedStorage( details.getDisks().stream().mapToLong(disk -> disk.getValue().getCapacity()).sum());
        vm.setOperationSys(details.getGuest_OS());
       /* if (details.getNics() != null && !details.getNics().isEmpty()) {
            vm.setNom(details.getNics().get(0).getValue().getBacking().getNetwork_name());
        }*/
        vm.setNom(vmSummary.getName());
        for (VmDetailsResponse.VmDetails.Disk disk : details.getDisks()) {
            if (disk.getValue().getBacking() != null && disk.getValue().getBacking().getVmdk_file() != null) {
                vm.setHostName(disk.getValue().getBacking().getVmdk_file());
                break;
            }
        }
        return vm;
    }



}