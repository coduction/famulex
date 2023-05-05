package com.famulex.api.group.model;

import com.famulex.api.core.model.PublicKey;
import com.famulex.api.file.model.FilePermission;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "fx_group")
public class Group extends PublicKey {

  @NotNull
  @Setter
  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private GroupType type;

  @NotBlank
  @Setter
  @Column(name = "name", nullable = false)
  private String name;

  @Setter
  @Column(name = "description")
  private String description;

  @Builder.Default
  @OneToMany(mappedBy = "group")
  private List<FilePermission> filePermissions = new ArrayList<>();

}
