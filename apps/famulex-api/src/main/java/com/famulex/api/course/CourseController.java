package com.famulex.api.course;

import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.api.CourseMapper;
import com.famulex.api.course.api.CourseProgressRequest;
import com.famulex.api.course.api.CourseProgressResponse;
import com.famulex.api.course.api.CourseResponse;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.repository.CourseProgressRepository;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.membership.api.CourseMembershipMapper;
import com.famulex.api.membership.api.CourseMembershipResponse;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.membership.repository.CourseMembershipRepository;
import com.famulex.api.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Class CourseController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.10.22
 */
@Tag(name = "Course")
@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

  private final CourseRepository courseRepository;
  private final CourseProgressRepository progressRepository;
  private final CourseMembershipRepository membershipRepository;

  private final UserService userService;
  private final CourseService courseService;

  private final CourseMapper courseMapper;
  private final CourseMembershipMapper membershipMapper;

//    @GetMapping("/my")
//    @Transactional(readOnly = true)
//    public Page<CourseResponse> loadMyCourses(@ParameterObject Pageable pagination) {
//        User currentUser = userService.loadUserFromContext();
//
//        // Load all course user memberships with role PARTICIPANT
//        CourseMembership example = CourseMembership.builder()
//            .user(currentUser)
//            .role(CourseRole.PARTICIPANT)
//            .build();
//
//        // Load all course memberships
//        List<CourseMembership> courseMemberships = courseMembershipRepository.findAll(Example.of(example)); // TODO Improve: Use pagination here instead of in the next step
//
//        // Load all courses as page
//        Page<CourseResponse> courseResponses = courseRepository.findByMembershipsIn(courseMemberships, pagination).map(courseMapper::toCourseResponse);
//
//        // Set membershipKey on course response
////        courseMemberships.forEach(courseMembership -> {
////            courseResponses.getContent().stream()
////                .filter(courseResponse -> courseResponse.getKey().equals(courseMembership.getCourse().getKey()))
////                .filter(courseResponse -> courseResponse.getMembershipKey() == null)
////                .findFirst()
////                .ifPresent(courseResponse -> courseResponse.setMembershipKey(courseMembership.getKey()));
////        });
//
//        // Load progress for course and root nodes
//        List<CourseProgress> courseProgresses = courseProgressRepository.findByMembershipIn(courseMemberships);
//
//        // Remove all course progresses that are not for root nodes
//        courseProgresses.removeIf(courseProgress -> {
//            if (courseProgress.getCourseItem() != null) {
//                return true;
//            }
//
//            if (courseProgress.getCourse() != null) {
//                return false;
//            }
//
//            if (courseProgress.getCourseNode() != null) {
//                return !courseProgress.getCourseNode().isRoot();
//            }
//
//            // Should never happen
//            return true;
//        });
//
//        courseProgresses.stream()
//            .filter(courseProgress -> courseProgress.getType().equals(CourseProgressType.COURSE))
//            .forEach(courseProgress -> {
//                courseProgresses.stream()
//                    .filter(nodeProgress -> nodeProgress.getType().equals(CourseProgressType.COURSE_NODE))
//                    .filter(nodeProgress -> nodeProgress.getCourseNode().getCourse().equals(courseProgress.getCourse()))
//                    .forEach(courseProgress::addToLevels);
//            });
//
//        // Add progress to course responses
//        courseResponses.forEach(courseResponse -> {
//            courseProgresses.stream()
//                .filter(courseProgress -> courseProgress.getCourse().getKey().equals(courseResponse.getKey()))
//                .filter(courseProgress -> courseProgress.getMembership().getKey().equals(courseResponse.getMembershipKey()))
//                .findFirst()
//                .ifPresent(courseProgress -> courseResponse.setProgress(courseMapper.toCourseProgressResponse(courseProgress)));
//        });
//
//        return courseResponses;
//    }

  @GetMapping("/{courseKey}")
  public CourseResponse loadCourse(@PathVariable UUID courseKey) {
    Course course = courseRepository.findByKey(courseKey)
      .orElseThrow(() -> new EntityNotFoundException(Course.class, courseKey));

    return courseMapper.toResponse(course);
  }

  @PreAuthorize("@SecurityHelper.isMyCourseMembership(#membershipKey)")
  @GetMapping("/membership/{membershipKey}")
  public CourseMembershipResponse loadCourseByMembership(@PathVariable UUID membershipKey) {
    var membership = membershipRepository.findByKey(membershipKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseMembership.class, membershipKey));

    return membershipMapper.toResponseForUser(membership);
  }

//    @Transactional
//    @GetMapping("/{courseKey}/membership/{membershipKey}")
//    public CourseResponse loadCourse(@PathVariable UUID courseKey, @PathVariable UUID membershipKey) {
//        Course course = courseRepository.findWithContentByKey(courseKey)
//            .orElseThrow(() -> new EntityNotFoundException(Course.class, courseKey));
//
//        CourseMembership courseMembership = courseMembershipRepository.findByKey(membershipKey)
//            .orElseThrow(() -> new EntityNotFoundException(CourseMembership.class, membershipKey));
//
//        // Check if membership is of current user
//        User currentUser = userService.loadUserFromContext();
//        if (!courseMembership.getUser().equals(currentUser)) {
//            throw new BadRequestException("Membership is not of current user");
//        }
//
//        // Check if membership is of course
//        if (!courseMembership.getCourse().equals(course)) {
//            throw new BadRequestException("Membership is not of course");
//        }
//
//        // Load progress and map to response
//        List<CourseProgress> courseProgresses = courseProgressRepository.findByMembership(courseMembership);
//
//        // Load course progresses into maps for easier handling
//        Map<UUID, CourseProgress> courseProgressMap = courseProgresses.stream()
//            .filter(progress -> progress.getType().equals(CourseProgressType.COURSE))
//            .collect(Collectors.toMap(progress -> progress.getCourse().getKey(), progress -> progress));
//        Map<UUID, CourseProgress> courseNodeProgressMap = courseProgresses.stream()
//            .filter(progress -> progress.getType().equals(CourseProgressType.NODE))
//            .collect(Collectors.toMap(progress -> progress.getCourseNode().getKey(), progress -> progress));
//        Map<UUID, CourseProgress> courseItemProgressMap = courseProgresses.stream()
//            .filter(progress -> progress.getType().equals(CourseProgressType.ITEM))
//            .collect(Collectors.toMap(progress -> progress.getCourseItem().getKey(), progress -> progress));
//
//        // Set progress on course and nodes and items
//        course.setProgress(courseProgressMap.get(course.getKey()));
//        course.getNodes().forEach(courseNode -> {
//            courseNode.setProgress(courseNodeProgressMap.get(courseNode.getKey()));
//            courseNode.getItems().forEach(courseItem -> {
//                courseItem.setProgress(courseItemProgressMap.get(courseItem.getKey()));
//            });
//        });
//
//        // Map course to response
//        return courseMapper.toResponse(course);
//    }

  @Transactional
  @PutMapping("/{courseKey}/progress/{courseProgressKey}")
  public CourseProgressResponse updateCourseProgress(@PathVariable UUID courseKey,
                                                     @PathVariable UUID courseProgressKey,
                                                     @Valid @RequestBody CourseProgressRequest courseProgressRequest) {
//        Course course = courseRepository.findWithContentByKey(courseKey)
//            .orElseThrow(() -> new EntityNotFoundException(Course.class, courseKey));
//
//        CourseProgress courseProgress = courseProgressRepository.findByKey(courseProgressKey)
//            .orElseThrow(() -> new EntityNotFoundException(CourseProgress.class, courseProgressKey));
//
//        //if (!courseProgress.getCourse().equals(course)) {
//        //    throw new BadRequestException("CourseProgress does not belong to course");
//        //}
//
//        // get all course progresses for the membership on course - necessary for bubble up
//        List<CourseProgress> courseProgresses = courseProgressRepository.findByMembership(courseProgress.getMembership());
//
//        if (courseProgressRequest.getCompleted() == null) {
//            // Set completed if progress is 100 and completed is not set
//            courseProgressRequest.setCompleted(courseProgressRequest.getProgress() == 100);
//        }
//        if (courseProgressRequest.getProgress() == null && courseProgressRequest.getCompleted() != null && courseProgressRequest.getCompleted() && courseProgress.getType() != CourseProgressType.ITEM) {
//            courseProgressRequest.setProgress(100); // Set progress to 100 if completed and progress is not set, but not on items to preserve actual progress
//        }
//
//        courseMapper.updateFromRequest(courseProgressRequest, courseProgress);
//
//        // Bubble up progress
//        courseService.updateParentCourseProgresses(courseProgress, courseProgresses);
//
//        return courseMapper.toResponse(courseProgressRepository.save(courseProgress));
    // TODO Refactoring Flat
    return null;
  }

//    private void updateCourseProgressResult(CourseProgress courseProgress, @MappingTarget CourseProgressResponse courseProgressResponse) {
//        /*// Do not set any levels info for course node items
//        if (courseProgress.getType().equals(CourseProgressType.COURSE_NODE_ITEM)) {
//            return;
//        }
//
//        // If I am a course progress, count only info of root nodes
//        if (courseProgress.getType().equals(CourseProgressType.COURSE)) {
//            Set<CourseNode> rootNodes = courseProgress.getCourse().getNodes()
//                .stream()
//                .filter(CourseNode::isRoot)
//                .collect(Collectors.toSet());
//
//            //
//
//            courseProgressResponse.setLevelsTotal(courseProgressResponse.getNodes().stream()
//                .filter(courseNodeProgress -> courseNodeProgress.getParentKey() == null)
//                .mapToInt(CourseNodeProgressResponse::getTotal)
//                .sum());
//            courseProgressResponse.setLevelsCompleted(courseProgressResponse.getNodes().stream()
//                .filter(courseNodeProgress -> courseNodeProgress.getParentKey() == null)
//                .mapToInt(CourseNodeProgressResponse::getCompleted)
//                .sum());
//            return;
//        }
//
//        // Set levelsTotal*/
//
//
//        // Set levelsCompleted
//    }
}
