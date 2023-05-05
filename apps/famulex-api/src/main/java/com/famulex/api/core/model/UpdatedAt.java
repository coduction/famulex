package com.famulex.api.core.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.OffsetDateTime;

/**
 * Class UpdatedAt
 *
 * @date 26.12.21
 * @author Alexander Boeckle, boeckle@coduction.com
 */
@Getter
@MappedSuperclass
public abstract class UpdatedAt extends CreatedAt {

    @LastModifiedDate
    @Column(nullable = false)
    protected OffsetDateTime updatedAt;

    @Override
    protected void prePersist() {
        super.prePersist();

        updatedAt = createdAt;
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
