import { TreeNode }            from "primeng/api";
import { QuestionDraft }       from "@famulex/shared/famulex-api-client";
import { iconForQuestionType } from "@famulex/shared/util";
import { Dictionary }          from "@ngrx/entity";

export function buildQuestionsTree(entities: Dictionary<QuestionDraft>, selectedKey: string | null): TreeNode<QuestionDraft>[] {
  const nodes = Object.values(entities)
    .filter((node): node is QuestionDraft => node !== undefined);

  // // If there are no nodes, return an empty tree
  // if (!nodes.length) {
  //   return [];
  // }

  const nodeMap: { [key: string]: TreeNode<QuestionDraft> } = {};

  // Helper function to get children of a node. If it doesn't have children, create an empty array
  const getChildren = (treeNode: TreeNode<QuestionDraft>): TreeNode<QuestionDraft>[] => {
    if (!treeNode.children) {
      treeNode.children = [];
    }

    return treeNode.children;
  };

  // Helper function to append to children of a node. Takes parentKey and the node to append.
  const appendToChildrenOfParent = (parentKey: string, node: TreeNode<QuestionDraft>): void => {
    const parentNode = nodeMap[parentKey];

    if (!parentNode.children) {
      parentNode.children = [];
    }

    parentNode.children.push(node);
    node.parent = parentNode;
  };

  // Helper function to append the special "ACTION-ADD" node
  const appendActionAddNode = (levelNodes: TreeNode<QuestionDraft>[], parent?: QuestionDraft): void => {
    levelNodes.push({
      type: "ACTION_ADD_NODE",
      data: parent,
      label: $localize`Add Question`,
      icon: "fa fa-fw fa-plus",
      styleClass: "action-add-node",
      leaf: true,
      selectable: false,
      draggable: false,
      droppable: false
    });
  };

  // Convert each QuestionDraft to TreeNode and store in map for quick access
  nodes.forEach(node => nodeMap[node.key] = convertQuestionDraftToTreeNode(node));

  // Recursive function to build the tree
  const buildTree = (levelNodes: TreeNode<QuestionDraft>[], currentNode: QuestionDraft): void => {
    // Take the treeNode from the map
    const treeNode = nodeMap[currentNode.key];

    // TODO Implement nested nodes
    // if (currentNode.parentKey) {
    //   appendToChildrenOfParent(currentNode.parentKey, treeNode);
    // } else {
    //   levelNodes.push(treeNode);
    // }

    levelNodes.push(treeNode);

    // Get children of the current node, sort them by position and recursively build the tree
    // nodes.filter(child => child.parentKey === currentNode.key)
    //   .sort((a, b) => a.position - b.position)
    //   .forEach(childNode => buildTree(getChildren(treeNode), childNode));

    // If it's a chapter or has children, append the "ACTION-ADD" node
    // if (currentNode.type === CourseNodeType.Chapter) {
    //   appendActionAddNode(getChildren(treeNode), currentNode);
    // }
  };

  const tree: TreeNode<QuestionDraft>[] = [];

  // Get root nodes, sort them by position and recursively build the tree
  // nodes.filter(node => !node.parentKey)
  //   .sort((a, b) => a.position - b.position)
  //   .forEach(rootNode => buildTree(tree, rootNode));

  nodes.sort((a, b) => a.position - b.position)
    .forEach(rootNode => buildTree(tree, rootNode));

  // Expand the selected node and all its parents
  if (selectedKey) {
    const selectedNode = nodeMap[selectedKey];

    if (selectedNode) {
      selectedNode.expanded = true;

      let parentNode = selectedNode.parent;
      while (parentNode) {
        parentNode.expanded = true;
        parentNode = parentNode.parent;
      }
    }
  }
  // Append "ACTION-ADD" node at the root level
  appendActionAddNode(tree);

  return tree;
}

export function buildCurrentQuestionTreeNode(entities: Dictionary<QuestionDraft>, selectedKey: string | null): TreeNode<QuestionDraft> | null {
  if (!selectedKey) {
    return null;
  }

  const node = entities[selectedKey];

  if (!node) {
    return null;
  }

  return convertQuestionDraftToTreeNode(node);
}

function convertQuestionDraftToTreeNode(question: QuestionDraft): TreeNode<QuestionDraft> {
  return {
    key: question.key,
    label: question.title,
    icon: iconForQuestionType(question.type),
    data: question,
    selectable: true,
    draggable: true,
    leaf: true
  } as TreeNode<QuestionDraft>;
}
