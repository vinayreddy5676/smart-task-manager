package com.example.smart_task_manager.repository;

import com.example.smart_task_manager.model.Task;
import com.example.smart_task_manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // OLD METHODS
    List<Task> findByPriority(String priority);

    List<Task> findByStatus(String status);

    List<Task> findByTitleContaining(String keyword);

    // NEW METHODS
    List<Task> findByUser(User user);

    List<Task> findByUserAndPriority(User user, String priority);

    List<Task> findByUserAndStatus(User user, String status);

    List<Task> findByUserAndTitleContaining(User user, String keyword);
}