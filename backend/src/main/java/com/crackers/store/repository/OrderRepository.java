package com.crackers.store.repository;

import com.crackers.store.model.OrderResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderResponse, String> {
    List<OrderResponse> findAllByOrderByOrderDateDesc();
}
