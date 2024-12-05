package com.mehdi.vCenter.Inventory.Manager.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mehdi.vCenter.Inventory.Manager.dtos.PersonneDto;
import com.mehdi.vCenter.Inventory.Manager.entities.Personne;
import com.mehdi.vCenter.Inventory.Manager.repositories.PersonneRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
@Service
@AllArgsConstructor
public class PersonneServiceImp implements PersonneService{
    @Autowired
    @Lazy
    private RestTemplate restTemplate;
    private PersonneRepository personneRepository;
    private final String url = "person.api";
    @Override
    public List<Personne> getAllPersonnes() {
        return personneRepository.findAll();
    }

    @Override
    public Personne getPersonneById(Long personneId) {
        return personneRepository.findById(personneId).orElse(null);
    }

    @Override
    public Personne savePersonne(Personne personne) {
        return personneRepository.save(personne);
    }

    @Override
    public Personne updatePersonne(Long id,Personne personne) {
        return personneRepository.findById(id)
                .map(personne1 -> {
                    personne1 = new Personne(personne);
                    return personneRepository.save(personne1);
                }).orElseThrow(() -> new RuntimeException("Personne with ID " + id + " not found"));
    }

    public void insererPersonne() throws JsonProcessingException {

        try {

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                //System.out.println("API Response is: " + response.getBody());

                ObjectMapper mapper = new ObjectMapper(); //mapped thrr json file to a java object
                JsonNode root = mapper.readTree(response.getBody()); // convert the Json to a tree , so we can handle the json data
                if (root.isArray()) {
                    for (JsonNode Personroot : root) {
                        Personne personne = new Personne();

                        personne.setNom(Personroot.path("refResource").path("refPerson").path("firstName").asText());
                        personne.setPrenom(Personroot.path("refResource").path("refPerson").path("lastName").asText());
                        personne.setEmail(Personroot.path("refResource").path("refPerson").path("email").asText());
                        System.out.println("the person to be saved look like : " + personne);

                        insertPerson(personne);
                    }
                    System.out.println("All persons saved successfully !");
                } else {
                    System.err.println("the api it s not an array !! it shall be ");
                }
            } else {
                System.err.println("Failed to retrieve data: Status code " + response.getStatusCode());
            }
        } catch (ResourceAccessException e) {
            System.err.println("Failed to retrieve data: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
    }



    // the second method to insert all Ilem's Collanorators with their personal data

    public void fetchAndInsertPerson() {

        ResponseEntity<PersonneDto[]> response = restTemplate.getForEntity(this.url, PersonneDto[].class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            System.out.println("API Response is: " + response.getBody());
            for (PersonneDto personneDto : response.getBody()) {
                Personne personne = convertToEntity(personneDto);
                insertPerson(personne);
            }
        } else {
            throw new RuntimeException("Failed to fetch data from API");
        }
    }
    private Personne convertToEntity(PersonneDto personneDto) {
        Personne personne = new Personne();
        try{
            if (personneDto != null ) {
                PersonneDto.RefPerson refPerson = personneDto.getRefResource().getRefPerson();
                if (refPerson.getFirstName() != null) {
                    personne.setNom(refPerson.getFirstName());
                }
                if (refPerson.getLastName() != null) {
                    personne.setPrenom(refPerson.getLastName());
                }
                if (refPerson.getEmail() != null) {
                    personne.setEmail(refPerson.getEmail());
                }
            }
            else{
                System.err.println("Invalid PersonneDto structure: Missing required data");
            }
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
        }
        return personne;
    }

    @Transactional
    public Personne insertPerson(Personne newPersonne) {
        return personneRepository.save(newPersonne);
    }
}
