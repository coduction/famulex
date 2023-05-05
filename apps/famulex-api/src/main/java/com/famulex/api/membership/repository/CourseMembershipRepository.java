package com.famulex.api.membership.repository;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.membership.model.CourseRole;
import com.famulex.api.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface CourseMembershipRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.12.22
 */
@Repository
public interface CourseMembershipRepository extends JpaRepository<CourseMembership, Long> {

  Optional<CourseMembership> findByKey(UUID key);

  List<CourseMembership> findByCourseDraft(CourseDraft courseDraft);

  Page<CourseMembership> findByCourseDraft(CourseDraft courseDraft, Pageable pageable);

  @Query("SELECT cm, " +
    // "COUNT(progresses) as countTotal, " + // AND nodes.parent IS NULL
    "SUM((CASE WHEN nodes.parent IS NULL THEN 1 ELSE 0 END)) as rootLevelCount, " + // AND nodes.parent IS NULL
    "SUM((CASE WHEN nodes.parent IS NULL AND progresses.progress IS NOT NULL AND progresses.progress = 100 THEN 1 ELSE 0 END)) as rootLevelCompleteCount, " +
    "COALESCE(SUM((CASE WHEN nodes.type = 'CHAPTER' THEN 0 ELSE (CASE WHEN progresses.completed IS NOT NULL AND progresses.completed = true THEN 100 ELSE progresses.progress END) END)) / SUM((CASE WHEN nodes.type = 'CHAPTER' THEN 0 ELSE 1 END)), 0) as progress " + // only count non chapter progress - should be more accurate
    "FROM CourseMembership cm " +
    "LEFT JOIN cm.course course " +
    "LEFT JOIN course.nodes nodes " +
    "LEFT JOIN nodes.progresses progresses ON progresses.courseNode.id = nodes.id AND progresses.membership.id = cm.id " +
    "WHERE cm.role = :role " +
    "AND cm.user = :user " +
    "AND cm.course IS NOT NULL " +
    "GROUP BY cm")
  Page<Object[]> findWithProgressStatsByUserAndRole(@Param("user") User user, @Param("role") CourseRole role, Pageable pageable);
}
