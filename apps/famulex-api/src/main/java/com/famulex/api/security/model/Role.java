package com.famulex.api.security.model;

import com.famulex.api.core.model.PublicKey;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Class Group
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_role")
public class Role extends PublicKey {

  @Setter
  @Column(name = "name", nullable = false)
  private String name;

  @Setter
  @Column(name = "description")
  private String description;

  @Setter
  @Convert(converter = RightsConverter.class)
  @Column(name = "rights", nullable = false)
  private List<Right> rights = new ArrayList<>();

  @Setter
  @Column(name = "default_role", nullable = false)
  private boolean defaultRole;

  @Setter
  @Column(name = "system_role", nullable = false)
  private boolean systemRole;

  @Builder.Default
  @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RoleAssignment> assignments = new ArrayList<>();

}
