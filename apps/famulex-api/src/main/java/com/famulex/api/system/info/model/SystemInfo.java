package com.famulex.api.system.info.model;

import com.famulex.api.core.model.PublicKey;
import com.famulex.api.file.model.FilePermission;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Class SystemInfo
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.09.23
 */
@Getter
@Entity
@Table(name = "fx_system_info")
public class SystemInfo extends PublicKey {

    @Setter
    @ManyToOne
    @JoinColumn(name = "fk_logo_permission")
    private FilePermission logoPermission;

    @Setter
    @ManyToOne
    @JoinColumn(name = "fk_compact_logo_permission")
    private FilePermission compactLogoPermission;

}
