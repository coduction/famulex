package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.authoring.course.model.CoursePublicationMapper;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.model.WithSuccessFlag;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.model.CourseStatus;
import com.famulex.api.course.repository.CourseNodeRepository;
import com.famulex.api.course.repository.CourseRepository;
import com.famulex.api.membership.CourseMembershipService;
import com.famulex.api.testing.TestConfigurationService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseDraftPublicationService {

  /**************************************************************************
   * Repositories
   *************************************************************************/
  private final CourseRepository courseRepository;
  private final CourseDraftRepository courseDraftRepository;
  private final CourseNodeRepository courseNodeRepository;

  /**************************************************************************
   * Services
   *************************************************************************/
  private final CourseMembershipService courseMembershipService;
  private final TestConfigurationService testConfigurationService;

  /**************************************************************************
   * Mappers
   *************************************************************************/
  private final CoursePublicationMapper publishMapper;

  @PersistenceContext
  private final EntityManager entityManager;

  @Transactional
  public CourseDraft loadAndValidateCourseDraft(UUID draftKey) {
    // Load course draft with nodes, items and file permits
    CourseDraft courseDraft = courseDraftRepository.findByKey(draftKey)
      .orElseThrow(() -> new EntityNotFoundException("Course draft not found", draftKey));

    // Validate course draft
    courseDraft.validate();

    return courseDraft;
  }

  @Transactional
  public WithSuccessFlag<CourseDraft> publishCourseDraft(UUID draftKey) {
    CourseDraft courseDraft = loadAndValidateCourseDraft(draftKey);

    // If draft is not valid, stop publication process
    if (courseDraft.isInvalid(false)) {
      courseDraft.setStatus(CourseStatus.INVALID);
      courseDraft = courseDraftRepository.save(courseDraft);


      return WithSuccessFlag.<CourseDraft>builder()
        .successful(false)
        .object(courseDraft)
        .build();
    }

    // Publish course draft
    // Load eventually existing published course
    Optional<Course> publishedCourse = courseRepository.findByCourseDraft(courseDraft);

    // If no published course exists, create a new one
    if (publishedCourse.isEmpty()) {
      // Convert course draft to course
      Course course = publishMapper.toCourse(courseDraft);

      course.getNodes().forEach(courseNode -> {
        // Set course on all nodes
        courseNode.setCourse(course);

        // Set node on all items
        courseNode.getItems().forEach(courseItem -> courseItem.setNode(courseNode));
      });

      // Set course on all memberships
      courseDraft.getMemberships().forEach(membership -> { // Set Memberships from Draft to Course
        membership.setCourse(course);
        course.setMembership(membership);
      });

      // Save course
      return saveCourse(courseDraft, course);
    }

    // Update published course
    Course course = publishedCourse.get();
    publishMapper.updateCourse(courseDraft, course);

    // Collect course node keys and their item keys which are to be published
    Map<UUID, CourseDraftNode> courseDraftNodesToPublish = courseDraft.getNodes()
      .stream()
      .collect(Collectors.toMap(CourseDraftNode::getKey, courseDraftNode -> courseDraftNode));

    Map<UUID, CourseDraftItem> courseDraftItemsToPublish = courseDraftNodesToPublish.values()
      .stream()
      .flatMap(courseDraftNode -> courseDraftNode.getItems().stream())
      .collect(Collectors.toMap(CourseDraftItem::getKey, courseDraftItem -> courseDraftItem));

    // Remove deleted nodes
    // course.getNodes().stream()
    //        .filter(courseNode -> !courseDraftNodesToPublish.containsKey(courseNode.getKey()))
    //        .forEach(courseNodeRepository::delete);

    course.getNodes().removeIf(courseNode -> !courseDraftNodesToPublish.containsKey(courseNode.getKey()));
    courseRepository.save(course);

    entityManager.flush();


    // Collect existing nodes
    Map<UUID, CourseNode> existingNodes = course.getNodes()
      .stream()
      .collect(Collectors.toMap(CourseNode::getKey, courseNode -> courseNode));

    // Collect existing items
    Map<UUID, CourseItem> existingItems = existingNodes.values()
      .stream()
      .flatMap(courseNode -> courseNode.getItems().stream())
      .collect(Collectors.toMap(CourseItem::getKey, courseItem -> courseItem));

    // Insert or update nodes
    for (CourseDraftNode draftNode : courseDraftNodesToPublish.values()) {
      // If node does not exist, create it
      if (!existingNodes.containsKey(draftNode.getKey())) {
        CourseNode courseNode = publishMapper.toCourseNode(draftNode);
        course.addNode(courseNode);

        // Add node and items to existing ones
        existingNodes.put(courseNode.getKey(), courseNode);

        List<CourseItem> items = courseNode.getItems();
        existingItems.putAll(items.stream().collect(Collectors.toMap(CourseItem::getKey, courseItem -> courseItem)));

        // Save course node
        courseNodeRepository.save(courseNode);

        // Initialize Progress for new node and its items
        course.getMemberships().forEach(membership -> courseMembershipService.createProgressForNodeAndItems(courseNode, membership));

        // Continue with next node
        continue;
      }

      // If node exists, update it
      CourseNode courseNode = existingNodes.get(draftNode.getKey());
      publishMapper.updateCourseNode(draftNode, courseNode);

      // Check items and remove deleted ones
      courseNode.getItems().removeIf(item -> !courseDraftItemsToPublish.containsKey(item.getKey()));

      // Check whether item exists and update it
      for (CourseDraftItem draftItem : draftNode.getItems()) {
        if (!existingItems.containsKey(draftItem.getKey())) {
          CourseItem item = publishMapper.toCourseItem(draftItem);
          courseNode.addItem(item);

          // Add item to existing ones
          existingItems.put(item.getKey(), item);

          // Continue with next item
          continue;
        }

        // Update item
        CourseItem item = existingItems.get(draftItem.getKey());
        publishMapper.updateCourseItem(draftItem, item);
      }
    }

    // Set parent on all course nodes
    for (CourseNode courseNode : existingNodes.values()) {
      if (courseNode.getParentKey() != null) {
        courseNode.setParent(existingNodes.get(courseNode.getParentKey()));
      }
    }

    return saveCourse(courseDraft, course);
  }

  private WithSuccessFlag<CourseDraft> saveCourse(CourseDraft draft, Course course) {
    // Save course
    courseRepository.save(course);

    // Set course draft status to published
    draft.setStatus(CourseStatus.PUBLISHED);
    draft.setPublishedAt(OffsetDateTime.now());

    // Save course draft
    draft = courseDraftRepository.save(draft);

    if (course.getCreatedAt() == null) {
      // Initialize progress for all memberships
      draft.getMemberships().forEach(courseMembershipService::createProgressForMembership);
    }

    return WithSuccessFlag.<CourseDraft>builder()
      .successful(true)
      .object(draft)
      .build();
  }

}
