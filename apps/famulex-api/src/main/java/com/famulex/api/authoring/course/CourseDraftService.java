package com.famulex.api.authoring.course;

import com.famulex.api.authoring.course.api.CourseDraftMapper;
import com.famulex.api.authoring.course.model.CourseDraft;
import com.famulex.api.authoring.course.model.CourseDraftItem;
import com.famulex.api.authoring.course.model.CourseDraftNode;
import com.famulex.api.authoring.course.repository.CourseDraftItemRepository;
import com.famulex.api.authoring.course.repository.CourseDraftNodeRepository;
import com.famulex.api.authoring.course.repository.CourseDraftRepository;
import com.famulex.api.core.exception.EntityNotFoundException;
import com.famulex.api.core.util.PositioningHelper;
import com.famulex.api.course.model.*;
import com.famulex.api.course.repository.CourseItemRepository;
import com.famulex.api.course.repository.CourseNodeRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Class CourseDraftService
 *
 * @author Alexander Boeckle, boeckle@coduction.com
 * @date 07.12.22
 */
@Service
@RequiredArgsConstructor
public class CourseDraftService {

  @PersistenceContext
  private EntityManager entityManager;

  private final CourseDraftRepository courseDraftRepository;
  private final CourseDraftNodeRepository courseDraftNodeRepository;
  private final CourseDraftItemRepository courseDraftItemRepository;

  private final CourseDraftMapper courseDraftMapper;
  private final CourseNodeRepository courseNodeRepository;
  private final CourseItemRepository courseItemRepository;


  /**************************************************************************
   * CourseDraftNode
   *************************************************************************/
  @Transactional
  public CourseDraftNode createCourseDraftNode(CourseDraft courseDraft, CourseDraftNode parentNode, CourseDraftNode nodeToSave) {
    if (nodeToSave.getType() == null) {
      nodeToSave.setType(CourseNodeType.TEXT);
    }

    nodeToSave = saveCourseDraftNode(courseDraft, parentNode, nodeToSave);

    // If node is a chapter, do not create a default item
    if (nodeToSave.getType() == CourseNodeType.CHAPTER) {
      return nodeToSave;
    }

    // Create default node item
    CourseDraftItem item = CourseDraftItem.builder()
      .position(0)
      .build();

    item.setNode(nodeToSave);

    switch (nodeToSave.getType()) {
      case TEXT -> {
        item.setType(CourseItemType.TEXT);
      }
      case VIDEO -> {
        item.setType(CourseItemType.VIDEO);
      }
      case PDF -> {
        item.setType(CourseItemType.PDF);
      }
      case QUIZ -> {
        item.setType(CourseItemType.QUIZ);
      }
    }

    // Save node. The item will be saved as well because of cascade
    return courseDraftNodeRepository.save(nodeToSave);
  }

  public CourseDraftNode saveCourseDraftNode(CourseDraft courseDraft, CourseDraftNode parentNode, CourseDraftNode nodeToSave) {
    nodeToSave.setCourseDraft(courseDraft);
    nodeToSave.setParent(parentNode);

    // Load course draft nodes for parent
    List<CourseDraftNode> currentLevelNodes = courseDraftNodeRepository.findAllByParentOrderByPosition(parentNode);

    PositioningHelper.shiftIndexOnInsertion(currentLevelNodes, nodeToSave);
    courseDraftNodeRepository.saveAll(currentLevelNodes);

    nodeToSave = courseDraftNodeRepository.save(nodeToSave);

    return nodeToSave;
  }

  @Transactional
  public void deleteCourseDraftNode(CourseDraftNode nodeToDelete) {
    // Load course draft nodes for parent and sort by position
    List<CourseDraftNode> currentLevelNodes = courseDraftNodeRepository.findAllByParentOrderByPosition(nodeToDelete.getParent());

    // Shift indices of existing nodes
    PositioningHelper.shiftIndexOnDeletion(currentLevelNodes, nodeToDelete);

    // Remove node to delete from existing nodes
    currentLevelNodes.remove(nodeToDelete);
    courseDraftNodeRepository.saveAll(currentLevelNodes);
//        courseDraftNodeRepository.flush();

    courseDraftNodeRepository.delete(nodeToDelete);

    // Save existing nodes to persist new positions

//        courseDraftNodeRepository.flush();

//        // Load eventually published nodes and unset source node and source items
//        Optional<CourseNode> publishedNode = courseNodeRepository.findBySourceNode(nodeToDelete);
//        if (publishedNode.isPresent()) {
//            publishedNode.get().setSourceNode(null);
//            courseNodeRepository.save(publishedNode.get());
//
//            List<CourseItem> publishedItems = courseItemRepository.findByNode(publishedNode.get());
//            publishedItems.forEach(item -> {
//                item.setSourceItem(null);
//            });
//            courseItemRepository.saveAll(publishedItems);
//        }


//        // Unset source node and items
//        if (nodeToDelete.getPublishedNode() != null) {
//            nodeToDelete.getPublishedNode().setSourceNode(null);
//            nodeToDelete.getPublishedNode().getItems().forEach(item -> item.setSourceItem(null));
//
//            courseItemRepository.saveAll(nodeToDelete.getPublishedNode().getItems());
//            courseNodeRepository.save(nodeToDelete.getPublishedNode());
//
//            // Flush to database
//            entityManager.flush();
//        }
//
//        // Unset published node and items
//        nodeToDelete.setPublishedNode(null);
//        nodeToDelete.getItems().forEach(item -> item.setPublishedItem(null));
//
//        courseDraftItemRepository.saveAll(nodeToDelete.getItems());
//        courseDraftNodeRepository.save(nodeToDelete);
//
//        // Flush to database
//        entityManager.flush();
//        entityManager.getTransaction().begin();
  }

  /**************************************************************************
   * CourseDraftItem
   *************************************************************************/
  public CourseDraftItem saveCourseDraftItem(CourseDraftNode node, CourseDraftItem itemToSave) {
    itemToSave.setNode(node);

    // Load all items for current node
    List<CourseDraftItem> currentItems = courseDraftItemRepository.findByNodeOrderByPosition(node);

    PositioningHelper.shiftIndexOnInsertion(currentItems, itemToSave);
    courseDraftItemRepository.saveAll(currentItems);

    itemToSave = courseDraftItemRepository.save(itemToSave);

    return itemToSave;
  }

  public void deleteCourseDraftItem(CourseDraftItem itemToDelete) {
    // Load course draft nodes for parent
    List<CourseDraftItem> currentItems = courseDraftItemRepository.findByNodeOrderByPosition(itemToDelete.getNode());

    PositioningHelper.shiftIndexOnDeletion(currentItems, itemToDelete);
    courseDraftItemRepository.saveAll(currentItems);

    courseDraftItemRepository.delete(itemToDelete);
  }

  /**************************************************************************
   * Helper methods
   *************************************************************************/
  public void checkExistence(UUID courseDraftKey) {
    if (!courseDraftRepository.existsByKey(courseDraftKey)) {
      throw new EntityNotFoundException(CourseDraft.class, courseDraftKey);
    }
  }

  public void checkExistence(UUID courseDraftKey, UUID nodeDraftKey) {
    checkExistence(courseDraftKey);

    if (!courseDraftNodeRepository.existsByKey(nodeDraftKey)) {
      throw new EntityNotFoundException(CourseDraftNode.class, nodeDraftKey);
    }
  }

  public void checkExistence(UUID courseDraftKey, UUID nodeDraftKey, UUID itemDraftKey) {
    checkExistence(courseDraftKey, nodeDraftKey);

    if (!courseDraftItemRepository.existsByKey(itemDraftKey)) {
      throw new EntityNotFoundException(CourseItem.class, itemDraftKey);
    }
  }

  public CourseDraft loadCourseDraft(UUID courseDraftKey) {
    return courseDraftRepository.findByKey(courseDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(Course.class, courseDraftKey));
  }

  public CourseDraftNode loadCourseDraftNode(UUID courseDraftKey, UUID nodeDraftKey) {
    checkExistence(courseDraftKey);

    return courseDraftNodeRepository.findByKey(nodeDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseNode.class, nodeDraftKey));
  }

  public CourseDraftItem loadCourseDraftItem(UUID courseDraftKey, UUID nodeDraftKey, UUID itemDraftKey) {
    checkExistence(courseDraftKey, nodeDraftKey);

    return courseDraftItemRepository.findByKey(itemDraftKey)
      .orElseThrow(() -> new EntityNotFoundException(CourseItem.class, itemDraftKey));
  }
}
