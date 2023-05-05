package com.famulex.api.authoring.course.model;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.file.model.FilePermission;
import com.famulex.api.file.model.FilePermissionType;
import org.mapstruct.*;

/**
 * Interface CoursePublicationMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 15.12.22
 */
@Mapper(config = MapperConfiguration.class)
public interface CoursePublicationMapper {

  @Mapping(target = "courseDraft", source = ".")
  @Mapping(target = "memberships", ignore = true)
  @Mapping(target = "testConfigurations", ignore = true)
  Course toCourse(CourseDraft courseDraft);

  @InheritConfiguration
  @Mapping(target = "nodes", ignore = true)
  @Mapping(target = "courseDraft", ignore = true)
  void updateCourse(CourseDraft courseDraft, @MappingTarget Course course);

//    @AfterMapping
//    default void updateResult(CourseDraft courseDraft, @MappingTarget Course course) {
//        // Update memberships
//        courseDraft.getMemberships().forEach(membership -> membership.setCourse(course));
//
//        // Do not update nodes or items if the course was already existing since new ones can be created in the publication process
//        // This will be done after nodes and items are created
//        if (course.getId() != null) {
//            return;
//        }
//
//        // Collect all parent nodes in a map
//        Map<UUID, CourseNode> nodes = course.getNodes()
//            .stream()
//            .collect(Collectors.toMap(CourseNode::getKey, node -> node));
//
//        // Update nodes
//        course.getNodes().forEach(node -> {
//            updateResult(node, course);
//
//            // Set parent node
//            if (node.getParentKey() != null) {
//                node.setParent(nodes.get(node.getParentKey()));
//            }
//        });
//    }

  // This mapping will be used by the generated implementation by toCourse when called without context
  // TODO Check whether to ignore items
  @Mapping(target = "parent", ignore = true)
  @Mapping(target = "parentKey", source = "parent.key")
  @Mapping(target = "children", ignore = true)
  @Mapping(target = "draftNode", source = ".")
  CourseNode toCourseNode(CourseDraftNode courseDraftNode);


  @InheritConfiguration
  @Mapping(target = "items", ignore = true)
  @Mapping(target = "draftNode", ignore = true)
  void updateCourseNode(CourseDraftNode courseNodeDraft, @MappingTarget CourseNode courseNode);

//    @AfterMapping
//    default void updateResult(@MappingTarget CourseNode courseNode, @Context Course course) {
//        courseNode.setCourse(course);
//
//        // Do not update items if the node was already existing since new items can be created in the publication process
//        if (courseNode.getId() != null) {
//            return;
//        }
//
//        // Update items
//        courseNode.getItems().forEach(item -> updateResult(item, courseNode));
//    }

  // This mapping will be used by the generated implementation by toCourseNode and toCourse when called without context
  @Mapping(target = "node", ignore = true)
  @Mapping(target = "draftItem", source = ".")
  CourseItem toCourseItem(CourseDraftItem courseDraftItem);

  @InheritConfiguration
  @Mapping(target = "draftItem", ignore = true)
  void updateCourseItem(CourseDraftItem courseDraftItem, @MappingTarget CourseItem courseItem);

//    @AfterMapping
//    default void updateResult(@MappingTarget CourseItem courseItem, @Context CourseNode courseNode) {
//        courseItem.setNode(courseNode);
//    }

  @Mapping(target = "courseDraft", ignore = true)
  @Mapping(target = "courseDraftItem", ignore = true)
  FilePermission toFilePermission(FilePermission filePermission);

  default FilePermissionType toFilePermissionType(FilePermissionType filePermissionType) {
    if (filePermissionType == FilePermissionType.COURSE_DRAFT) {
      return FilePermissionType.COURSE;
    }

    if (filePermissionType == FilePermissionType.COURSE_DRAFT_ITEM) {
      return FilePermissionType.COURSE_ITEM;
    }

    return filePermissionType;
  }

  @AfterMapping
  default void setCourseOnPermission(@MappingTarget Course course) {
    course.getFilePermissions().forEach(filePermission -> {
      filePermission.setCourse(course);
    });
  }

  @AfterMapping
  default void setCourseItemOnPermission(@MappingTarget CourseItem courseItem) {
    courseItem.getFilePermissions().forEach(filePermission -> {
      filePermission.setCourseItem(courseItem);
    });
  }
}
