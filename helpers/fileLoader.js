export function document (metadata) {
  return metadata.contents
}

export function botnetdefinition (metadata) {
  return `Burned nodes: ${metadata.burnedNodes}
Nodes: ${metadata.nodes.length}
---
${metadata.nodes.join('\n')}`
}