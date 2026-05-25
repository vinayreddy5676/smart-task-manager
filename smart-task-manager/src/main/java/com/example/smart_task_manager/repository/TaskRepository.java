package com.example.smart_task_manager.repository;

import com.example.smart_task_manager.model.Task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByPriority(String priority);

    List<Task> findByStatus(String status);

    List<Task> findByTitleContaining(String keyword);
}