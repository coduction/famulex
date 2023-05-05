package com.famulex.api.security.model;

/**
 * Enum Right
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 13.11.22
 */
public enum Right {

    SYNC_KEYCLOAK(Rights.SYNC_KEYCLOAK),
    MANAGE_USERS(Rights.MANAGE_USERS);

    Right(String label) {
        this.label = label;
    }

    private final String label;

    public String toString() {
        return this.label;
    }
}
