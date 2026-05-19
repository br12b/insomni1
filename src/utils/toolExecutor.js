import { simulateExpenseRemoval, calculateGoalTimeline } from '../lib/financialTools';

export function executeTool(call, financialData) {
  const { name, args } = call;
  switch (name) {
    case 'simulateExpenseRemoval':
      return simulateExpenseRemoval(financialData, args.expense_name);
    case 'calculateGoalTimeline':
      return calculateGoalTimeline(financialData, args.goal_amount, args.current_saved || 0);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
