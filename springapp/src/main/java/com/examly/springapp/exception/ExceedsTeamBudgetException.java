package com.examly.springapp.exception;

public class ExceedsTeamBudgetException extends RuntimeException {

    public ExceedsTeamBudgetException() {
    }

    public ExceedsTeamBudgetException(String message) {
        super(message);
    }
}