package com.famulex.api.core.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Objects;

/**
 * Class Persistable
 *
 * @date 26.12.21
 * @author Alexander Boeckle, boeckle@coduction.com
 */
@Getter
@MappedSuperclass
public abstract class Persistable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    protected Long id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Persistable that)) return false;
        return getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
