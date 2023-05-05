package com.famulex.api.course;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.model.*;
import com.famulex.api.course.repository.CourseItemRepository;
import com.famulex.api.course.repository.CourseNodeRepository;
import com.famulex.api.course.repository.CourseProgressRepository;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.membership.CourseMembershipService;
import com.famulex.api.membership.repository.CourseMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository courseRepository;
  private final CourseNodeRepository courseNodeRepository;
  private final CourseItemRepository courseItemRepository;

  private final CourseMembershipRepository courseMembershipRepository;
  private final CourseProgressRepository courseProgressRepository;

  private final CourseMembershipService courseMembershipService;

  public void updateParentCourseProgresses(CourseProgress updatedCourseProgress, List<CourseProgress> courseProgresses) {

    // Depending on type retrieve parent key from node or item
    UUID parentNodeKey = updatedCourseProgress.getType() == CourseProgressType.NODE ? updatedCourseProgress.getCourseNode().getParentKey() : updatedCourseProgress.getCourseItem().getNode().getKey();

    CourseProgress parentCourseProgress;
    Set<CourseProgress> childProgresses;

    if (parentNodeKey == null) {
      // No parent course progress found -> Root level reached, update course progress
      parentCourseProgress = courseProgresses.stream()
        .filter(courseProgress -> courseProgress.getType() == CourseProgressType.COURSE)
        .filter(courseProgress -> courseProgress.getCourse() != null) // Theoretically should not happen
        .findFirst()
        .orElse(null);

      if (parentCourseProgress == null)
        throw new RuntimeException("No root course progress found for child progress: " + updatedCourseProgress);

      childProgresses = courseProgresses.stream()
        .filter(courseProgress -> courseProgress.getType() == CourseProgressType.NODE)
        .filter(courseProgress -> courseProgress.getCourseNode() != null) // Theoretically should not happen
        .filter(courseProgress -> courseProgress.getCourseNode().getParentKey() == null) // filter for root level progresses
        .collect(Collectors.toSet());
    } else {
      parentCourseProgress = courseProgresses.stream()
        .filter(courseProgress -> courseProgress.getType() == CourseProgressType.NODE)
        .filter(courseProgress -> courseProgress.getCourseNode() != null) // Theoretically should not happen
        .filter(courseProgress -> courseProgress.getCourseNode().getKey().equals(parentNodeKey))
        .findFirst()
        .orElse(null);

      if (parentCourseProgress == null)
        throw new RuntimeException("No parent course progress found for child progress: " + updatedCourseProgress);

      if (updatedCourseProgress.getType() == CourseProgressType.NODE) {
        // sum the progress of items
        childProgresses = courseProgresses.stream()
          .filter(courseProgress -> courseProgress.getType() == CourseProgressType.NODE)
          .filter(courseProgress -> courseProgress.getCourseNode() != null) // Theoretically should not happen
          .filter(courseProgress -> courseProgress.getCourseNode().getParentKey().equals(parentNodeKey)).collect(Collectors.toSet()); // course-progresses with same parent as updated one
      } else {
        childProgresses = courseProgresses.stream()
          .filter(courseProgress -> courseProgress.getType() == CourseProgressType.ITEM)
          .filter(courseProgress -> courseProgress.getCourseItem() != null) // Theoretically should not happen
          .filter(courseProgress -> courseProgress.getCourseItem().getNode().getKey().equals(parentNodeKey)).collect(Collectors.toSet()); // course-progresses with same parent as updated one
      }
    }

    int progressSum = childProgresses.stream()
      .filter(courseProgress -> !courseProgress.getKey().equals(updatedCourseProgress.getKey())) // remove the updated course-progress
      .map(courseProgress -> courseProgress.getCompleted() ? 100 : courseProgress.getProgress()) // use 100 if completed, otherwise use progress
      .reduce(Integer::sum).orElse(0) + (updatedCourseProgress.getCompleted() ? 100 : updatedCourseProgress.getProgress()); // sum up the progress of all children + progress of updated course-progress

    long childCount = childProgresses.size();

    int progress = (int) (progressSum / childCount);

    parentCourseProgress.setProgress(progress);
    if (progress == 100) { // if progress is 100% -> set completes to true
      parentCourseProgress.setCompleted(true);
    } else if (progress < 100 && updatedCourseProgress.getType() != CourseProgressType.ITEM) { // if progress is less than 100% -> set completes to false, but only for chapters and course to preserve manual completion
      parentCourseProgress.setCompleted(false);
    }

    courseProgressRepository.save(parentCourseProgress);

    if (parentNodeKey == null) return; // root level reached, no further parent course progress to update

    updateParentCourseProgresses(parentCourseProgress, courseProgresses); // recursive call to update next parent
  }

  /**************************************************************************
   * Helper methods
   *************************************************************************/
  public void checkExistence(UUID courseKey) {
    if (!courseRepository.existsByKey(courseKey)) {
      throw new EntityNotFoundException(Course.class, courseKey);
    }
  }

  public void checkExistence(UUID courseKey, UUID nodeKey) {
    checkExistence(courseKey);

    if (!courseNodeRepository.existsByKey(nodeKey)) {
      throw new EntityNotFoundException(CourseNode.class, nodeKey);
    }
  }

  public void checkExistence(UUID courseKey, UUID nodeKey, UUID itemKey) {
    checkExistence(courseKey, nodeKey);

    if (!courseItemRepository.existsByKey(itemKey)) {
      throw new EntityNotFoundException(CourseItem.class, itemKey);
    }
  }

  public Course loadCourse(UUID courseKey) {
    return courseRepository.findByKey(courseKey)
      .orElseThrow(() -> new EntityNotFoundException(Course.class, courseKey));
  }

  public CourseNode loadCourseNode(UUID courseKey, UUID nodeKey) {
    checkExistence(courseKey);

    return courseNodeRepository.findByKey(nodeKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseNode.class, nodeKey));
  }

  public CourseItem loadCourseItem(UUID courseKey, UUID nodeKey, UUID itemKey) {
    checkExistence(courseKey, nodeKey);

    return courseItemRepository.findByKey(itemKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseItem.class, itemKey));
  }
}
