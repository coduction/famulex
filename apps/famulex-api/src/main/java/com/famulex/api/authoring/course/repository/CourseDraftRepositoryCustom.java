package com.famulex.api.authoring.course.repository;

import com.famulex.api.authoring.course.api.request.CourseDraftFilter;
import com.famulex.api.jooq.tables.records.FxCourseDraftRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

/**
 * Interface CourseDraftRepository
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 23.02.22
 */
@Repository
public interface CourseDraftRepositoryCustom {

  Page<FxCourseDraftRecord> searchCourseDrafts(CourseDraftFilter filter, Pageable pageable);

}
