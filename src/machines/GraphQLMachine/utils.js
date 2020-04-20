export function getOperationDefinition(ast) {
  const def = ast.definitions.find(def => def.kind === 'OperationDefinition');
  const name = def.name.value;
  const type = def.operation;

  return { name, type };
}