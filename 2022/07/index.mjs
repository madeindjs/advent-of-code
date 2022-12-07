import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef Node
 * @property {string} name
 * @property {number} size
 * @property {Record<string, Node>} children
 */

/**
 * @param {string[]} lines
 * @return {Node}
 */
function buildTree(lines) {
  const tree = { name: "/", size: 0, children: {} };
  const currentPath = [];

  for (const line of lines) {
    if (line.startsWith("$ cd ")) {
      const directory = line.replace("$ cd ", "");
      if (directory === "..") {
        currentPath.pop();
      } else {
        addTreeItem(tree, currentPath, { name: directory, size: 0, children: {} });
        currentPath.push(directory);
      }
    } else if (line === "$ ls") {
      continue;
    } else {
      // it's ls output
      const [sizeStr, name] = line.split(" ");
      const size = sizeStr === "dir" ? 0 : Number(sizeStr);

      addTreeItem(tree, currentPath, { name, size, children: {} });
    }
  }
  return tree;
}

/**
 * @param {Node} tree
 * @param {string[]} path
 * @returns {Record<string, Node>}
 */
const getChildrenFromPath = (tree, path) => path.reduce((children, dir) => children[dir].children, tree.children);

/**
 * @param {Node} tree
 * @param {string[]} path
 * @param {Node} node
 */
const addTreeItem = (tree, path, node) => (getChildrenFromPath(tree, path)[node.name] = node);

/**
 * @param {Node} tree
 * @return {Generator<{path: string[], node: Node}, void>}
 */
function* walk(tree, path = []) {
  for (const child of Object.values(tree.children)) {
    const currentPath = [...path, child.name];
    const currentNode = tree.children[child.name];

    yield { path: currentPath, node: currentNode };

    if (Object.values(child.children).length !== 0) {
      yield* walk(tree.children[child.name], currentPath);
    }
  }
}

/**
 * @param {Node} tree
 * @returns {number}
 */
function getSize(tree) {
  let size = 0;

  for (const { node } of walk(tree)) {
    size += node.size;
  }

  return size;
}

/**
 * @param {string} file
 */
function mainA(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");
  const tree = buildTree(lines);

  const sizes = [];

  for (const { node } of walk(tree)) {
    const size = getSize(node);
    sizes.push(size);
  }

  sizes.shift();

  return sizes.filter((size) => size <= 100000).reduce((acc, v) => acc + v, 0);
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");
  const tree = buildTree(lines);

  const totalSpace = 70000000;
  const targetUnusedSpace = 30000000;

  const sizes = [];

  for (const { node } of walk(tree)) {
    const size = getSize(node);
    sizes.push(size);
  }

  const currentUsed = Number(sizes.shift());
  const sizeToFree = targetUnusedSpace - (totalSpace - currentUsed);

  return sizes.filter((size) => size >= sizeToFree).sort((a, b) => a - b)[0];
}

assert.strictEqual(mainA("spec.txt"), 95437);
const partA = mainA("input.txt");

console.log("part A", partA);
assert.strictEqual(partA, 1770595);

assert.strictEqual(mainB("spec.txt"), 24933642);
const partB = mainB("input.txt");

assert.strictEqual(partB, 2195372);
console.log("part B", partB);
