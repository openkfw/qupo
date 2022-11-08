# User Guide

The QuPO application calculates a portfolio of a given set of stocks with the two constraints `risk` and `sustainability` using five different kinds of algorithms and makes them comparable with one another.

Links to other docs:

- [QuPO Architecture](./arch/README.md)
- [Database Structure](./db/README.md)
- [Use Case: Portfolio Optimization](./portfolio_optimization/README.md)

# How to use the application

The initial start page of the application shows an overview of stock collections grouped by their index, country or industry. To choose a whole set of stocks, pick a collection and `Continue with these symbols`. Or choose the symbols individually by changing to the `SYMBOLS` tab.

![First Page](./screenshots/QuPO_App_first_page.png)

Then the process is started and the application leads you to a page asking you questions about your risk and sustainability affinity. By answering these questions weights are set which are the base to calculate a more/less risky or sustainable portfolio depending on your answers.

For each of the weights a scenario is created and several options are given. The scale varies from very affine to very averse. Depending on your personal preferences for each scenario an option is chosen and a value is set.

**Risk Weight**

Risk is an important factor in investing. A portfolio should yield the maximum possible return while maintaining a certain amount of risk. A risk affine person likes to take high risks, while someone that is risk averse wants to avoid taking risks.

**Sustainability Weight**

The sustainability of the portfolio is based on ESG values of the individual stocks. ESG is a rating for companies that measures non-financial factors. It stands for Environment, Social and Governance (see also [ESG in Portfolio Optimization](./portfolio_optimization/README.md#esg)). It weights the portfolio according to your individual preferences on how much you want sustainability to be a factor in your investment decisions.

![Questions Page](./screenshots/QuPO_App_questions.png)

Before calculating the portfolio, adjustments can be made. Select or delete symbols from the set of symbols. The check mark next to the symbol signals that it is included in the portfolio. Currently a maximum of 10 symbols can be selected.

Also, the weights for the risk and the sustainability can be adjusted. The values shown are based on the answers in the previous step but can be set in steps of 10. The higher the value the more affine.

Then select the models that you want the portfolio to be calculated with. There are five to choose from: OSQP, Qio, PyPo, Qiskit and IonQ (for further information on each model refer to the [docs](./portfolio_optimization/README.md#algorithms)).

Last, the timeframe in which the prices of the stocks are considered can be set. As default the last 30 days are taken.

![Process Overview Page](./screenshots/QuPO_App_process_overview.jpg)

Once the calculations are started, it may take some time to show the results. If you have the database set in place, the prices of the selected stocks are fetched only initially and then saved to the database. If you request a portfolio with one or more of these stocks again, the prices are taken from the database and is therefore faster. When choosing new stocks, their prices are fetched too. Anyways, the more stocks that are selected, the larger the timeframe and the more models that are selected, the longer the loading time.

![Portfolio Page](./screenshots/QuPO_App_graph.png)

The chart shows the suggested weights of stocks in the portfolio based on the results of each algorithm which can vary more or less.

With the panel on the left, the input parameters can be adjusted and the portfolio can be calculated again. Beneath the chart the results of each model are evaluated and made comparable with each other. The `PERFORMANCE` hereby is the objective value, the `RISK` shows the overall vulnerability of the portfolio, the `SUSTAINABILITY` value shows how sustainable the overall portfolio is and the `RETURN` value is the expected return over time (for better understanding refer to the [docs](./portfolio_optimization/README.md#result)).

Last, different portfolios can be compared with each other or the process can be restarted again.
