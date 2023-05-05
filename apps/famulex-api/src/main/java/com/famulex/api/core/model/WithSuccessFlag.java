package com.famulex.api.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Class WithSuccessFlag
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 03.04.23
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class WithSuccessFlag<T> {

    private boolean successful;
    private T object;
}
