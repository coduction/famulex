package com.famulex.api.membership.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.course.api.CourseMapper;
import com.famulex.api.membership.model.CourseMembership;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Interface MembershipMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 14.12.22
 */
@Mapper(config = MapperConfiguration.class, uses = CourseMapper.class)
public interface CourseMembershipMapper {

  @Mapping(target = "course", ignore = true)
  @Mapping(target = "courseDraft", ignore = true)
  CourseMembershipResponse toResponse(CourseMembership courseMembership);

  @InheritConfiguration
  @Mapping(target = "course")
  @Mapping(target = "lastNodeKey", source = "lastCourseNode.key")
  CourseMembershipResponse toResponseForUser(CourseMembership courseMembership);

  CourseMembership toCourseMembership(CourseMembershipRequestCreate courseMembershipRequest);
}
