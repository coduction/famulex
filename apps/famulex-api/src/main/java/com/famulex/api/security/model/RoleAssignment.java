package com.famulex.api.security.model;

import com.famulex.api.core.model.MembershipType;
import com.famulex.api.core.model.ValidFrom;
import com.famulex.api.group.model.Group;
import com.famulex.api.user.model.User;
import jakarta.persistence.*;
import lombok.*;

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
@Table(name = "fx_role_assignment")
public class RoleAssignment extends ValidFrom {

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, updatable = false)
  private MembershipType type;

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_role", nullable = false, updatable = false)
  private Role role;

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_user", nullable = false, updatable = false)
  private User user;

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_group", nullable = false, updatable = false)
  private Group group;

}
