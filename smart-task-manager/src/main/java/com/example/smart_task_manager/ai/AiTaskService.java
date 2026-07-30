package com.example.smart_task_manager.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;

@Service
public class AiTaskService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public String suggestPriority(String title, String description, String dueDate) {

        if (title == null || title.isBlank() || description == null || description.isBlank()) {
            System.out.println("[AiTaskService] Skipping AI — empty title/description.");
            return fallbackPriority(dueDate);
        }

        String prompt =
                "You are a task priority classifier. Classify the task below as HIGH, MEDIUM, or LOW.\n\n" +
                        "Rules:\n" +
                        "- HIGH: due today, urgent, exams, submissions, deadlines\n" +
                        "- MEDIUM: due in a few days, moderate importance\n" +
                        "- LOW: no deadline, optional tasks\n\n" +
                        "Respond ONLY with HIGH, MEDIUM, or LOW.\n\n" +
                        "Task Title: " + title + "\n" +
                        "Task Description: " + description + "\n" +
                        "Due Date: " + dueDate;

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // ✅ Reduced to 2 retries with longer backoff — saves quota
        int maxRetries = 2;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 1) {
                    System.out.println("[AiTaskService] Retry attempt " + attempt + " after rate limit...");
                    Thread.sleep(5000L * attempt); // 10s on retry
                }

                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey;

                String rawResponse = restTemplate.postForObject(url, requestBody, String.class);

                if (rawResponse == null) {
                    System.err.println("[AiTaskService] Null response from Gemini.");
                    return fallbackPriority(dueDate);
                }

                String priority = extractPriorityFromResponse(rawResponse);
                System.out.println("[AiTaskService] Gemini suggested priority: " + priority);
                return priority;

            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                System.err.println("[AiTaskService] Retry interrupted.");
                break;

            } catch (Exception e) {
                String msg = e.getMessage() != null ? e.getMessage() : "";
                if (msg.contains("429")) {
                    System.err.println("[AiTaskService] Rate limit hit (429). Attempt " + attempt + "/" + maxRetries);
                    if (attempt == maxRetries) {
                        System.err.println("[AiTaskService] All retries exhausted. Using due-date fallback.");
                    }
                } else {
                    System.err.println("[AiTaskService] Error calling Gemini API: " + msg);
                    break;
                }
            }
        }

        // ✅ Smart fallback using dueDate instead of hardcoded "MEDIUM"
        return fallbackPriority(dueDate);
    }

    // ✅ NEW: Calculates priority based on due date when AI fails
    private String fallbackPriority(String dueDate) {
        if (dueDate == null || dueDate.isBlank()) {
            return "LOW";
        }
        try {
            LocalDateTime due = LocalDateTime.parse(dueDate);
            LocalDateTime now = LocalDateTime.now();
            long hoursLeft = java.time.Duration.between(now, due).toHours();

            if (hoursLeft <= 24) return "HIGH";
            if (hoursLeft <= 72) return "MEDIUM";
            return "LOW";

        } catch (DateTimeParseException e) {
            System.err.println("[AiTaskService] Could not parse dueDate for fallback: " + dueDate);
            return "MEDIUM";
        }
    }

    private String extractPriorityFromResponse(String rawResponse) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText()
                    .trim()
                    .toUpperCase();

            System.out.println("[AiTaskService] Raw extracted text from Gemini: " + text);

            if (text.contains("HIGH"))   return "HIGH";
            if (text.contains("LOW"))    return "LOW";
            if (text.contains("MEDIUM")) return "MEDIUM";

            System.err.println("[AiTaskService] Unexpected response text: " + text);
            return "MEDIUM";

        } catch (Exception e) {
            System.err.println("[AiTaskService] Failed to parse Gemini response: " + e.getMessage());
            return "MEDIUM";
        }
    }
}