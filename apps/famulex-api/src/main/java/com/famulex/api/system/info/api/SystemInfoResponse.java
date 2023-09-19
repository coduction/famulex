package com.famulex.api.system.info.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

/**
 * Class SystemInfoResponse
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Getter
@Setter
@Schema(name = "SystemInfo")
public class SystemInfoResponse {

    private String logoUrl;
    private String compactLogoUrl;

}
