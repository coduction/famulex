package com.famulex.api.group.api;

import com.famulex.api.core.mapper.MapperConfiguration;
import com.famulex.api.group.model.Group;
import com.famulex.api.jooq.tables.records.FxGroupRecord;
import org.mapstruct.Mapper;

/**
 * Class GroupMapper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 10.12.22
 */
@Mapper(config = MapperConfiguration.class)
public interface GroupMapper {

  GroupResponse toGroupResponse(Group group);

  GroupResponse toGroupResponse(FxGroupRecord groupRecord);

  Group toGroup(GroupRequest groupRequest);
}
