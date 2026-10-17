package com.examly.springapp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Min(value = 15, message = "Age must be at least 15")
    @Max(value = 50, message = "Age must be at most 50")
    private int age;

    @NotBlank(message = "Category is required")
    private String category;

    @Positive(message = "Bidding price must be positive")
    private double biddingPrice;

    private boolean sold;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties("players")
    private Team team;
}