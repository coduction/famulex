package com.famulex.api.core.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Class DeletedAt
 *
 * @date 06.12.22
 * @author Alexander Boeckle, boeckle@coduction.com
 */
@Getter
@Setter
@MappedSuperclass
public abstract class DeletedAt extends PublicKey {

    @Column(name = "deleted_at")
    protected OffsetDateTime deletedAt;

}
