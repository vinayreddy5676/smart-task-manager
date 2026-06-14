package com.example.smart_task_manager.service;

import com.example.smart_task_manager.model.User;
import com.example.smart_task_manager.repository.UserRepository;
import com.example.smart_task_manager.ai.AiTaskService;
import com.example.smart_task_manager.model.Task;
import com.example.smart_task_manager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;
    private final AiTaskService aiService;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository repo,
            AiTaskService aiService,
            UserRepository userRepository
    ) {
        this.repo = repo;
        this.aiService = aiService;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Task addTask(Task task, String email) {

        User user = getUserByEmail(email);

        task.setUser(user);

        if (task.getPriority() == null || task.getPriority().isBlank()) {

            String priority =
                    aiService.suggestPriority(
                            task.getTitle(),
                            task.getDescription(),
                            task.getDueDate() != null
                                    ? task.getDueDate().toString()
                                    : "No Due Date"
                    );

            task.setPriority(priority);
        }

        return repo.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setStatus(updatedTask.getStatus());
        existing.setPriority(updatedTask.getPriority());
        existing.setDueDate(updatedTask.getDueDate()); // ✅ Step 2

        return repo.save(existing);
    }

    // ✅ Step 3: mark as complete + record timestamp
    public Task completeTask(Long id) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(true);
        task.setStatus("COMPLETED");
        task.setCompletedAt(LocalDateTime.now());

        return repo.save(task);
    }

    public List<Task> getTasks(String email) {

        User user = getUserByEmail(email);

        return repo.findByUser(user);
    }

    public List<Task> getTasksByPriority(String priority) {
        return repo.findByPriority(priority);
    }

    public List<Task> getTasksByStatus(String status) {
        return repo.findByStatus(status);
    }

    public List<Task> searchTasks(String keyword) {
        return repo.findByTitleContaining(keyword);
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }
}