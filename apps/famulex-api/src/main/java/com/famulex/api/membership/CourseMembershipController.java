package com.famulex.api.membership;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.group.model.Group;
import com.famulex.api.group.repository.GroupRepository;
import com.famulex.api.membership.api.CourseMembershipMapper;
import com.famulex.api.membership.api.CourseMembershipRequestCreate;
import com.famulex.api.membership.api.CourseMembershipResponse;
import com.famulex.api.membership.model.CourseMembership;
import com.famulex.api.membership.model.CourseRole;
import com.famulex.api.membership.model.MembershipType;
import com.famulex.api.membership.repository.CourseMembershipRepository;
import com.famulex.api.user.UserService;
import com.famulex.api.user.model.User;
import com.famulex.api.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

/**
 * Class CourseUserMembershipController
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 13.12.22
 */
@Tag(name = "CourseMembership")
@RestController
@RequestMapping("/memberships")
@RequiredArgsConstructor
public class CourseMembershipController {

  private final CourseRepository courseRepository;
  private final CourseDraftRepository courseDraftRepository;
  private final CourseMembershipRepository courseMembershipRepository;
  private final UserRepository userRepository;
  private final GroupRepository groupRepository;

  private final UserService userService;
  private final CourseMembershipService courseMembershipService;

  private final CourseMembershipMapper courseMembershipMapper;

  // Load all memberships of a course
  @Transactional
  @GetMapping("/my")
  public Page<CourseMembershipResponse> loadMyMemberships(@ParameterObject Pageable pagination) { // Page<CourseMembershipResponse>
    User currentUser = userService.loadUserFromContext();

    Page<Object[]> courseMembershipsAndProgressStats = courseMembershipRepository.findWithProgressStatsByUserAndRole(currentUser, CourseRole.PARTICIPANT, pagination);

    return courseMembershipsAndProgressStats.map(result -> {
      var response = courseMembershipMapper.toResponseForUser((CourseMembership) result[0]);

//            response.set(((Long) result[1]).intValue());
//            response.setLevelsCompleted(((Long) result[2]).intValue());
//            response.setProgress(((Long) result[3]).intValue());
      // TODO Refactor Flat Call Lion and ask for help

      return response;
    });
  }

  @GetMapping("/courses/{courseKey}")
  public Page<CourseMembershipResponse> loadCourseMemberships(@PathVariable UUID courseKey, @ParameterObject Pageable pagination) {
    CourseDraft courseDraft = courseDraftRepository.findByKey(courseKey).orElseThrow(() -> new EntityNotFoundException(Course.class, courseKey));

    return courseMembershipRepository.findByCourseDraft(courseDraft, pagination)
      .map(courseMembershipMapper::toResponse);
  }

  @Transactional
  @PostMapping("/courses/{courseKey}")
  public CourseMembershipResponse createCourseMembership(@PathVariable UUID courseKey, @Valid @RequestBody CourseMembershipRequestCreate membershipRequest) {
    // Load course draft
    // Membership can only be created for course drafts
    // Memberships for published courses are managed during the publication process
    CourseDraft courseDraft = courseDraftRepository.findByKey(courseKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseDraft.class, courseKey));

    // Load user or group
    Optional<User> user = userRepository.findByKey(membershipRequest.getUserKey());
    Optional<Group> group = groupRepository.findByKey(membershipRequest.getGroupKey());

    // TODO Check for existing memberships

    CourseMembership membership = courseMembershipMapper.toCourseMembership(membershipRequest);

    membership.setCourseDraft(courseDraft);

    // Set published course if exists
    Course publishedCourse = courseDraft.getPublishedCourse();
    if (publishedCourse != null) {
      membership.setCourse(publishedCourse);
    }

    // Set user or group
    if (user.isPresent()) {
      membership.setUser(user.get());
      membership.setType(MembershipType.USER);
    } else if (group.isPresent()) {
      membership.setGroup(group.get());
      membership.setType(MembershipType.GROUP);
    }

    // Save membership
    membership = courseMembershipRepository.save(membership);


    // Initialize course progress
    courseMembershipService.createProgressForMembership(membership);


    return courseMembershipMapper.toResponse(membership);
  }

  // Set last node
  @Transactional
  @PutMapping("/{userMembershipKey}/lastNode")
  public CourseMembershipResponse setMembershipLastNode(@PathVariable UUID userMembershipKey, @RequestParam UUID lastNodeKey) {
    CourseMembership membership = courseMembershipRepository.findByKey(userMembershipKey)
      .orElseThrow(() -> new EntityNotFoundException("Course user membership not found", userMembershipKey));

    // TODO Refactor Flat
    CourseNode node = membership.getCourse().getNodes().stream().filter(n -> n.getKey().equals(lastNodeKey)).findFirst().orElseThrow(() -> new EntityNotFoundException("Node not found", lastNodeKey));

    membership.setLastCourseNode(node);
    membership = courseMembershipRepository.save(membership);

    return courseMembershipMapper.toResponse(membership);
  }

  // Delete a membership
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{membershipKey}")
  public void deleteMembership(@PathVariable UUID membershipKey) {
    // Load membership
    CourseMembership membership = courseMembershipRepository.findByKey(membershipKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseMembership.class, membershipKey));

    // Delete membership
    courseMembershipRepository.delete(membership);
  }
}
