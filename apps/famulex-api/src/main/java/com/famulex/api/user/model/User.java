package com.famulex.api.user.model;

import com.famulex.api.core.model.Language;
import com.famulex.api.core.model.PublicKey;
import com.famulex.api.core.model.UserType;
import com.famulex.api.file.model.File;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.security.model.RoleAssignment;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.keycloak.representations.idm.UserRepresentation;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Class User
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 11.10.22
 */
@Log4j2
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fx_user")
public class User extends PublicKey {

  @Setter
  @Column(name = "email", unique = true, nullable = false)
  private String email;

  @Setter
  @Column(name = "username", unique = true, nullable = false)
  private String username;

  @Setter
  @Column(name = "password")
  private String password;    // Prepared for future use, currently not used

  @Setter
  @Column(name = "type")
  @Enumerated(EnumType.STRING)
  private UserType type;

  @Setter
  @Column(name = "last_active_at")
  private OffsetDateTime lastActiveAt;

  @Setter
  @Column(name = "first_name", nullable = false)
  private String firstName;

  @Setter
  @Column(name = "last_name", nullable = false)
  private String lastName;

  @Column(name = "language")
  @Enumerated(EnumType.STRING)
  @Setter
  @Builder.Default
  private Language language = Language.ENGLISH;

  @Builder.Default
  @OneToMany(mappedBy = "user")
  private List<RoleAssignment> roleAssignments = new ArrayList<>();

  @Builder.Default
  @OneToMany(mappedBy = "user")
  private List<CourseMembership> courseMemberships = new ArrayList<>();

  @Builder.Default
  @OneToMany(mappedBy = "user")
  private List<FilePermission> filePermissions = new ArrayList<>();

  @Builder.Default
  @OneToMany(mappedBy = "creator")
  private List<File> createdFiles = new ArrayList<>();


  @Setter
  @Transient
  private UserRepresentation userRepresentation;

  @Transient
  public String getDisplayName() {
    return firstName + " " + lastName;
  }

  @Transient
  public List<String> getRoles() {
    return userRepresentation != null ?
      userRepresentation.getRealmRoles() :
      null;
  }

  public void setKey(UUID key) {
    this.key = key;
  }

  @Override
  protected void prePersist() {
    super.prePersist();

    log.info("Created user: {}", this);
  }

  @Override
  protected void preUpdate() {
    super.preUpdate();

    log.info("Updated user: {}", this);
  }

  @PreRemove
  protected void preRemove() {
    log.info("Deleted user: {}", this);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return key.equals(user.key);
  }

  @Override
  public int hashCode() {
    return Objects.hash(key);
  }

  @Override
  public String toString() {
    return key.toString();
  }
}
