package com.mehdi.vCenter.Inventory.Manager.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Value("${vsphere.api.username}")
    private String username;

    @Value("${vsphere.api.password}")
    private String password;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    public String getSessionToken() {
        String url = "your-url-api";
        RestTemplate restTemplate = restTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(username, password);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>("", headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            System.out.println(response.getStatusCode().value());
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode root = objectMapper.readTree(responseBody);
                String sessionId = root.path("value").asText();
                System.out.println("Session ID: " + sessionId);
                return sessionId;
            } else {
                throw new RuntimeException("Failed to get session token");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Exception occurred while getting session token", e);
        }
    }


}