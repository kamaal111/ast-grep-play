import type { Optional } from '../types';

function extractArgsFromCallExpression(callExpression: string): Optional<string> {
  const isCallExpression = callExpression.includes('(');
  if (!isCallExpression) return null;

  return callExpression.split('(').slice(1).join('(').slice(undefined, -1);
}

export default extractArgsFromCallExpression;
