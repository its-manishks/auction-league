package com.examly.springapp.exception;

public class PlayerAlreadyAssignedException extends RuntimeException {

    public PlayerAlreadyAssignedException() {
    }

    public PlayerAlreadyAssignedException(String message) {
        super(message);
    }
}