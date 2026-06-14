package com.example.smart_task_manager.controller;

import com.example.smart_task_manager.dto.TaskDTO;
import com.example.smart_task_manager.model.Task;
import com.example.smart_task_manager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public Task addTask(
            @Valid @RequestBody TaskDTO dto,
            Authentication authentication
    ) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate()); // ✅ Step 2
        String email = authentication.getName();

        return service.addTask(task, email);
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO dto
    ) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate()); // ✅ Step 2
        return service.updateTask(id, task);
    }

    // ✅ Step 3: mark task as complete
    @PatchMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        return service.completeTask(id);
    }

    @GetMapping
    public List<Task> getTasks(Authentication authentication) {

        String email = authentication.getName();

        return service.getTasks(email);
    }


    @GetMapping("/priority/{priority}")
    public List<Task> getTasksByPriority(@PathVariable String priority) {
        return service.getTasksByPriority(priority);
    }

    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable String status) {
        return service.getTasksByStatus(status);
    }

    @GetMapping("/search/{keyword}")
    public List<Task> searchTasks(@PathVariable String keyword) {
        return service.searchTasks(keyword);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
    }
}