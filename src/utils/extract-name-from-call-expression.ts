import type { Optional } from '../types';

function extractNameFromCallExpression(callExpression: Optional<string>): Optional<string> {
  if (callExpression == null) return null;

  const isCallExpression = callExpression.includes('(');
  if (!isCallExpression) return callExpression;

  return callExpression.split('(')[0];
}

export default extractNameFromCallExpression;
