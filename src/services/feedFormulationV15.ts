import { FeedFormulaProfileV15, FeedIngredientV15 } from '../types';

export function recalculateFeedFormulaV15(formula: FeedFormulaProfileV15, ingredients: FeedIngredientV15[]): FeedFormulaProfileV15 {
  const map = new Map(ingredients.map((x) => [x.id, x]));
  const total = formula.lines.reduce((sum, line) => sum + Number(line.inclusion_percent || 0), 0);
  const weighted = (selector: (x: FeedIngredientV15) => number) =>
    formula.lines.reduce((sum, line) => {
      const ingredient = map.get(line.ingredient_id);
      return sum + (ingredient ? selector(ingredient) * Number(line.inclusion_percent || 0) / 100 : 0);
    }, 0);

  const cp = weighted((x) => x.crude_protein_percent);
  const me = weighted((x) => x.metabolizable_energy_kcal_kg);
  const lys = weighted((x) => x.digestible_lysine_percent);
  const ca = weighted((x) => x.calcium_percent);
  const p = weighted((x) => x.available_phosphorus_percent);
  const cost = weighted((x) => x.price_per_kg_yer);

  const within = (value: number, target: number, tolerance: number) => Math.abs(value - target) <= tolerance;
  const boundsValid = formula.lines.every((line) => {
    const ingredient = map.get(line.ingredient_id);
    return !ingredient || (line.inclusion_percent >= ingredient.min_inclusion_percent && line.inclusion_percent <= ingredient.max_inclusion_percent);
  });
  const balanced = Math.abs(total - 100) < 0.05 && boundsValid && within(cp, formula.target_protein_percent, 0.7) && within(me, formula.target_energy_kcal_kg, 90) && within(lys, formula.target_digestible_lysine_percent, 0.12);

  return {
    ...formula,
    calculated_protein_percent: Number(cp.toFixed(3)),
    calculated_energy_kcal_kg: Number(me.toFixed(1)),
    calculated_digestible_lysine_percent: Number(lys.toFixed(3)),
    calculated_calcium_percent: Number(ca.toFixed(3)),
    calculated_available_phosphorus_percent: Number(p.toFixed(3)),
    calculated_cost_per_kg_yer: Number(cost.toFixed(2)),
    status: balanced ? 'balanced' : 'needs_adjustment'
  };
}
