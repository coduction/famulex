package com.famulex.api.core.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;
import java.util.UUID;

/**
 * Class PublicKey
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 26.12.21
 */
@Getter
@Setter
@MappedSuperclass
public abstract class PublicKey extends UpdatedAt {

    @Column(name = "key", nullable = false, updatable = false, unique = true)
    protected UUID key;

    @Override
    protected void prePersist() {
        super.prePersist();

        if (key == null) {
            key = UUID.randomUUID();
        }
    }

    @Override
    public boolean equals(Object o) {
        // If there is no id, compare the key
        if (id == null) {
            if (this == o) return true;
            if (!(o instanceof PublicKey that)) return false;
            return key.equals(that.key);
        }

        return super.equals(o);
    }

    @Override
    public int hashCode() {
        // If there is no id, hash the key
        if (id == null) {
            return Objects.hash(key);
        }

        return super.hashCode();
    }
}
