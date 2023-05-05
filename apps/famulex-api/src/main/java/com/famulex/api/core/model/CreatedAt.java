package com.famulex.api.core.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import java.time.OffsetDateTime;

/**
 * Class CreatedAt
 *
 * @date 26.12.21
 * @author Alexander Boeckle, boeckle@coduction.com
 */
@Getter
@MappedSuperclass
public abstract class CreatedAt extends Persistable {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    protected OffsetDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        createdAt = OffsetDateTime.now();
    }

}
