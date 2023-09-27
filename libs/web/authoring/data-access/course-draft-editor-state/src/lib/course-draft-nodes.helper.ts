import { TreeNode }                        from "@coduction/primeng/api";
import { CourseDraftNode, CourseNodeType } from "@famulex/shared/famulex-api-client";
import { iconForCourseNodeType }           from "@famulex/shared/util";
import { Dictionary }                      from "@ngrx/entity";

export function buildNodesTree(entities: Dictionary<CourseDraftNode>, selectedKey: string | null): TreeNode<CourseDraftNode>[] {
  const nodes = Object.values(entities)
    .filter((node): node is CourseDraftNode => node !== undefined);

  // If there are no nodes, return an empty tree
  if (!nodes.length) {
    return [];
  }

  const nodeMap: { [key: string]: TreeNode<CourseDraftNode> } = {};

  // Helper function to get children of a node. If it doesn't have children, create an empty array
  const getChildren = (treeNode: TreeNode<CourseDraftNode>): TreeNode<CourseDraftNode>[] => {
    if (!treeNode.children) {
      treeNode.children = [];
    }

    return treeNode.children;
  };

  // Helper function to append to children of a node. Takes parentKey and the node to append.
  const appendToChildrenOfParent = (parentKey: string, node: TreeNode<CourseDraftNode>): void => {
    const parentNode = nodeMap[parentKey];

    if (!parentNode.children) {
      parentNode.children = [];
    }

    parentNode.children.push(node);
    node.parent = parentNode;
  };

  // Helper function to append the special "ACTION-ADD" node
  const appendActionAddNode = (levelNodes: TreeNode<CourseDraftNode>[], parent?: CourseDraftNode): void => {
    levelNodes.push({
      type: "ACTION_ADD_NODE",
      data: parent,
      label: $localize`Add Node`,
      icon: "fa fa-fw fa-plus",
      styleClass: "action-add-node",
      leaf: true,
      selectable: false,
      draggable: false,
      droppable: false
    });
  };

  // Convert each CourseDraftNode to TreeNode and store in map for quick access
  nodes.forEach(node => nodeMap[node.key] = convertCourseDraftNodeToTreeNode(node));

  // Recursive function to build the tree
  const buildTree = (levelNodes: TreeNode<CourseDraftNode>[], currentNode: CourseDraftNode): void => {
    // Take the treeNode from the map
    const treeNode = nodeMap[currentNode.key];

    if (currentNode.parentKey) {
      appendToChildrenOfParent(currentNode.parentKey, treeNode);
    } else {
      levelNodes.push(treeNode);
    }

    // Get children of the current node, sort them by position and recursively build the tree
    nodes.filter(child => child.parentKey === currentNode.key)
      .sort((a, b) => a.position - b.position)
      .forEach(childNode => buildTree(getChildren(treeNode), childNode));

    // If it's a chapter or has children, append the "ACTION-ADD" node
    if (currentNode.type === CourseNodeType.Chapter) {
      appendActionAddNode(getChildren(treeNode), currentNode);
    }
  };

  const tree: TreeNode<CourseDraftNode>[] = [];

  // Get root nodes, sort them by position and recursively build the tree
  nodes.filter(node => !node.parentKey)
    .sort((a, b) => a.position - b.position)
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

export function buildCurrentTreeNode(entities: Dictionary<CourseDraftNode>, selectedKey: string | null): TreeNode<CourseDraftNode> | null {
  if (!selectedKey) {
    return null;
  }

  const node = entities[selectedKey];

  if (!node) {
    return null;
  }

  return convertCourseDraftNodeToTreeNode(node);
}

function convertCourseDraftNodeToTreeNode(node: CourseDraftNode): TreeNode<CourseDraftNode> {
  return {
    key: node.key,
    label: node.title,
    icon: iconForCourseNodeType(node.type),
    data: node,
    selectable: true,
    draggable: true,
    leaf: node.type !== CourseNodeType.Chapter
  } as TreeNode<CourseDraftNode>;
}
