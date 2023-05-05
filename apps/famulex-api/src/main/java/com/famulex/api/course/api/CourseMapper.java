package com.famulex.api.course.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.course.model.Course;
import com.famulex.api.course.model.CourseItem;
import com.famulex.api.course.model.CourseNode;
import com.famulex.api.course.model.CourseProgress;
import com.famulex.api.file.api.FileMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Interface CourseMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Mapper(config = MapperConfiguration.class, uses = FileMapper.class)
public interface CourseMapper {

  CourseResponse toResponse(Course course);

  @Mapping(target = "parentKey", source = "parent.key")
  CourseNodeResponse toResponse(CourseNode courseNode);

  CourseItemResponse toResponse(CourseItem courseItem);

  @Mapping(target = "courseKey", source = "course.key")
  @Mapping(target = "nodeKey", source = "courseNode.key")
  @Mapping(target = "itemKey", source = "courseItem.key")
  CourseProgressResponse toResponse(CourseProgress courseProgress);

  void updateFromRequest(CourseProgressRequest courseProgressRequest, @MappingTarget CourseProgress courseProgress);
}
