package com.famulex.api.file.model;

import com.famulex.api.core.model.PublicKey;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

/**
 * Class FileAccess
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.09.23
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_file_access")
public class FileAccess extends PublicKey {

  @Column(name = "valid_until")
  private OffsetDateTime validUntil;

  @Setter
  @Column(name = "usage_count")
  private int usageCount;

  @ManyToOne
  @JoinColumn(name = "fk_file_permission")
  private FilePermission filePermission;
}
