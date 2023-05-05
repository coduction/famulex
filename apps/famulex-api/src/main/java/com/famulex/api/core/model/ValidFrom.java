package com.famulex.api.core.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Class DeletedAt
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.12.22
 */
@Getter
@Setter
@MappedSuperclass
public abstract class ValidFrom extends ValidUntil {

    @Column(name = "valid_from")
    protected OffsetDateTime validFrom;

}
