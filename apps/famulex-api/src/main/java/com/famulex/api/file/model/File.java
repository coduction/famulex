package com.famulex.api.file.model;

import com.famulex.api.core.model.PublicKey;
import com.famulex.api.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.core.io.ByteArrayResource;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Class File
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 06.03.22
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@NamedEntityGraph(name = "File.Permissions", includeAllAttributes = true)
@Table(name = "fx_file")
public class File extends PublicKey {

  @ManyToOne
  @JoinColumn(name = "fk_creator")
  private User creator;

  @Column(name = "file_name", nullable = false)
  private String name;

  @Column(name = "mime_type", nullable = false)
  private String mimeType;

  @Column(name = "file_extension")
  private String extension;

  @Column(name = "file_size")
  private long size;

  @Column(name = "length")
  private Integer length;

  @Column(name = "deleted_at")
  private OffsetDateTime deletedAt;

  @Builder.Default
  @OneToMany(mappedBy = "file")
  private List<FilePermission> filePermissions = new ArrayList<>();

  @Transient
  private ByteArrayResource byteArrayResource;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof File file)) return false;
    return Objects.equals(getId(), file.getId());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getId());
  }
}
