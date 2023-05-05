package com.famulex.api.membership;

import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.model.CourseProgress;
import com.famulex.api.course.model.CourseProgressType;
import com.famulex.api.course.repository.CourseProgressRepository;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.membership.repository.CourseMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseMembershipService {

  private final CourseRepository courseRepository;
  private final CourseMembershipRepository courseMembershipRepository;
  private final CourseProgressRepository courseProgressRepository;

  public void createProgressForNodeAndItems(CourseNode courseNode, CourseMembership membership) {
    CourseProgress courseNodeProgress = new CourseProgress();
    courseNodeProgress.setCourseNode(courseNode);
    courseNodeProgress.setMembership(membership);
    courseNodeProgress.setType(CourseProgressType.NODE);

    courseProgressRepository.save(courseNodeProgress);

    courseNode.getItems().forEach(courseItem -> {
      CourseProgress courseItemProgress = new CourseProgress();
      courseItemProgress.setCourseItem(courseItem);
      courseItemProgress.setMembership(membership);
      courseItemProgress.setType(CourseProgressType.ITEM);

      courseProgressRepository.save(courseItemProgress);
    });
  }

  public void createProgressForMembership(CourseMembership membership) {
    // Load course
    Course course = membership.getCourse();
    if (course == null) {
      System.out.println("Course is null - no progress to create");
      return;
    }

    CourseProgress courseProgress = new CourseProgress();
    courseProgress.setCourse(course);
    courseProgress.setMembership(membership);
    courseProgress.setType(CourseProgressType.COURSE);

    courseProgressRepository.save(courseProgress);

    List<CourseNode> courseNodes = course.getNodes();
    if (courseNodes != null) {
      courseNodes.forEach(courseNode -> createProgressForNodeAndItems(courseNode, membership));
    }
  }
}
