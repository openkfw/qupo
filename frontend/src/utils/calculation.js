import dayjs from 'dayjs';
import store from 'store-js';

import { getModelCalculations } from '../api';

export const constructCalculation = (data) => {
    return {
        timestamp: dayjs(),
        models: data.map((model) => model.Calculation.model).join(", "),
        companies: data[0].Calculation.symbol_names.join(", "),
        symbols: data[0].Calculation.symbols.join(", "),
        risk_weight: data[0].Calculation.risk_weight,
        esg_weight: data[0].Calculation.esg_weight,
        start: data[0].Calculation.start,
        end: data[0].Calculation.end,
        portfolio: data,
    };
};

export const calculateModels = async (addNotification, weights, timeframe) => {
    const symbols = store.get("selected_symbols");
    const models = store.get("selected_models");
    const firstTenSymbols = symbols.slice(0, 10).map((symbol) => symbol.symbol);

        const data = await getModelCalculations(
            models,
            firstTenSymbols,
            weights,
            timeframe
        );

        const rates = data[0]?.Result?.rate_of_return;
        if (rates) {
            const notReturnedSymbols = firstTenSymbols.filter(
                (symbol) => rates[symbol] === undefined
            );
            if (notReturnedSymbols.length) {
                addNotification({
                    severity: "warning",
                    message: `Symbols not available: ${notReturnedSymbols.join(", ")}`,
                });
            }
        }
        const newCalculation = constructCalculation(data);
        const calculations = store.get("calculations")
            ? store.get("calculations")
            : [];

        store.set("calculations", [newCalculation, ...calculations]);
        return newCalculation;
};