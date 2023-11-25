package com.famulex.api.testing.model;

import com.famulex.api.authoring.testing.model.SectionDraft;
import com.famulex.api.authoring.testing.model.SectionType;
import com.famulex.api.core.model.Positionable;
import com.famulex.api.core.model.PublicKeyWithoutHistory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Class TestDraftSection
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 25.10.23
 */
@Getter
@Setter
@Entity
@Table(name = "fx_test_section")
public class Section extends PublicKeyWithoutHistory implements Positionable {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_section_draft")
  private SectionDraft sectionDraft;
  @Column(name = "version", nullable = false)
  private Integer version;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_test")
  private Test test;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_parent")
  private Section parent;
  @Column(name = "position", nullable = false)
  private Integer position;
  @Column(name = "type", nullable = false)
  private SectionType type;

  @Column(name = "title", nullable = false)
  private String title;
  @Column(name = "description")
  private String description;

  @Column(name = "shuffle_questions")
  private boolean shuffleQuestions;
  @Column(name = "shown_questions")
  private Integer shownQuestions;

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Section> sections = new ArrayList<>();

  @OrderBy("position ASC")
  @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Question> questions = new ArrayList<>();

  public boolean isDifferent(Section section) {
    if (section == null) {
      return true;
    }

    if (!Objects.equals(section.parent, this.parent)) {
      return true;
    } else if (!Objects.equals(section.position, this.position)) {
      return true;
    } else if (!Objects.equals(section.type, this.type)) {
      return true;
    } else if (!Objects.equals(section.title, this.title)) {
      return true;
    } else if (!Objects.equals(section.description, this.description)) {
      return true;
    } else if (!Objects.equals(section.shuffleQuestions, this.shuffleQuestions)) {
      return true;
    } else if (!Objects.equals(section.shownQuestions, this.shownQuestions)) {
      return true;
    }

    if (section.sections.size() != this.sections.size()) {
      return true;
    } else if (section.questions.size() != this.questions.size()) {
      return true;
    }

    for (int i = 0; i < section.sections.size(); i++) {
      if (section.sections.get(i).isDifferent(this.sections.get(i))) {
        return true;
      }
    }

    for (int i = 0; i < section.questions.size(); i++) {
      if (section.questions.get(i).isDifferent(this.questions.get(i))) {
        return true;
      }
    }

    return false;
  }

  public void setVersion(Integer version) {
    this.version = version;

    sections.forEach(section -> section.setVersion(version));
    questions.forEach(question -> question.setVersion(version));
  }
}
