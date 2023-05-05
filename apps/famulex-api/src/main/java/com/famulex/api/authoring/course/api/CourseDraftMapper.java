package com.famulex.api.authoring.course.api;

import com.famulex.api.authoring.course.api.request.CourseDraftItemRequestCreate;
import com.famulex.api.authoring.course.api.request.CourseDraftNodeRequestCreate;
import com.famulex.api.authoring.course.api.request.CourseDraftNodeRequestUpdate;
import com.famulex.api.authoring.course.api.request.CourseDraftRequest;
import com.famulex.api.authoring.course.api.response.CourseDraftItemResponse;
import com.famulex.api.authoring.course.api.response.CourseDraftNodeResponse;
import com.famulex.api.authoring.course.api.response.CourseDraftResponse;
import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.file.api.FileMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Interface CourseDraftMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 08.12.22
 */
@Mapper(config = MapperConfiguration.class, uses = FileMapper.class)
public interface CourseDraftMapper {
  /**************************************************************************
   * Course Draft
   *************************************************************************/
  CourseDraftResponse toResponse(CourseDraft courseDraft);

  CourseDraft fromRequest(CourseDraftRequest courseDraftRequest);

  void updateFromRequest(CourseDraftRequest courseDraftRequest, @MappingTarget CourseDraft courseDraft);

  /**************************************************************************
   * Course Draft Node
   *************************************************************************/
  @Mapping(target = "parentKey", source = "parent.key")
  CourseDraftNodeResponse toResponse(CourseDraftNode courseDraftNode);

  CourseDraftNode fromRequest(CourseDraftNodeRequestCreate requestCreate);

  void updateFromRequest(CourseDraftNodeRequestUpdate requestUpdate, @MappingTarget CourseDraftNode courseDraftNode);

  /**************************************************************************
   * Course Draft Item
   *************************************************************************/
  CourseDraftItemResponse toResponse(CourseDraftItem courseDraftItem);

  CourseDraftItem fromRequest(CourseDraftItemRequestCreate requestCreate);

}
