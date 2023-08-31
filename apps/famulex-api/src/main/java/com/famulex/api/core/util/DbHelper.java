package com.famulex.api.core.util;

import org.jooq.SelectFieldOrAsterisk;
import org.jooq.SortField;
import org.jooq.TableField;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Sort;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

/**
 * Class DbHelper
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 25.05.23
 */
public class DbHelper {

    public static <T> Collection<SortField<?>> getSortFields(Sort sortSpecification, T type) {
        return getSortFields(sortSpecification, type, false);
    }

    public static <T> Collection<SortField<?>> getSortFields(Sort sortSpecification, T type, boolean isDistinct) {
        Collection<SortField<?>> querySortFields = new ArrayList<>();

        if (sortSpecification == null) {
            if (isDistinct) {
                querySortFields.add(convertTableFieldToSortField(getTableField("id", type), Sort.Direction.ASC));
            }

            return querySortFields;
        }

        Iterator<Sort.Order> specifiedFields = sortSpecification.iterator();

        while (specifiedFields.hasNext()) {
            Sort.Order specifiedField = specifiedFields.next();

            String sortFieldName = specifiedField.getProperty();
            Sort.Direction sortDirection = specifiedField.getDirection();

            TableField tableField = getTableField(sortFieldName, type);
            SortField<?> querySortField = convertTableFieldToSortField(tableField, sortDirection);
            querySortFields.add(querySortField);
        }

        if (isDistinct) {
            querySortFields.add(convertTableFieldToSortField(getTableField("id", type), Sort.Direction.ASC));
        }

        return querySortFields;
    }

    public static <T> Collection<SelectFieldOrAsterisk> getDistinctFields(Sort sortSpecification, T type) {
        Collection<SelectFieldOrAsterisk> distinctFields = new ArrayList<>();

        if (sortSpecification == null) {
            distinctFields.add(getTableField("id", type));

            return distinctFields;
        }

        Iterator<Sort.Order> specifiedFields = sortSpecification.iterator();

        while (specifiedFields.hasNext()) {
            Sort.Order specifiedField = specifiedFields.next();

            String sortFieldName = specifiedField.getProperty();

            TableField tableField = getTableField(sortFieldName, type);
            distinctFields.add(tableField);
        }

        distinctFields.add(getTableField("id", type));

        return distinctFields;
    }

    private static <T> TableField getTableField(String sortFieldName, T type) {
        TableField sortField = null;
        try {
            sortFieldName = TextHelper.camelToSnake(sortFieldName, true);
            Field tableField = type.getClass().getField(sortFieldName);
            sortField = (TableField) tableField.get(type);
        } catch (NoSuchFieldException | IllegalAccessException ex) {
            String errorMessage = String.format("Could not find table field: {}", sortFieldName);
            throw new InvalidDataAccessApiUsageException(errorMessage, ex);
        }

        return sortField;
    }

    private static SortField<?> convertTableFieldToSortField(TableField tableField, Sort.Direction sortDirection) {
        if (sortDirection == Sort.Direction.ASC) {
            return tableField.asc();
        } else {
            return tableField.desc();
        }
    }
}
