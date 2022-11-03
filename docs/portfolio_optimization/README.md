# Quantum Sustainable Portfolio Optimization

> **What is Portfolio Optimization?**
>
> Portfolio Optimization is the process of finding the best solution from a set of possible options, given its desired outcome and constraints.

A portfolio evaluates the volatility and the return of certain stocks in combination. The underlying theory on the portfolio optimisation concepts used in the scope of this project goes back to Harry Markowitz’s work on portfolio selection in 1952. Instead of focusing on the risk of each individual asset, Markowitz demonstrated that a diversified portfolio is less volatile than the total sum of its individual parts. While each asset itself could be quite volatile, the volatility of the entire portfolio can be quite low.

The aim is to build a portfolio that yields the maximum possible return while maintaining a certain amount of risk that the user is willing to take and taking in consideration a sustainability measurement. In accordance with the 17 Sustainable Development Goals of the United Nations’ Agenda for the year 2030 this project allows to calculate not only an optimal portfolio but a sustainable portfolio. The users thereby can define themselves their sustainability preferences.

## ESG

To allow the calculation of a **sustainable** portfolio the ESG values of each company are taken as sustainability measure. ESG stands for _Environmental, Social and Governance_. Companies are rated in these three areas, so that their sustainability can be compared. Part of ESG is for example:

- **Environmental**: Climate change and carbon emissions, air and water pollution, energy efficiency, waste management, etc.
- **Social**: Customer satisfaction, data protection and privacy, gender and diversity, labor standards, etc.
- **Governance**: Bribery and corruption, lobbying, whistleblower schemes, etc.

These non-financial factors become increasingly important when making investment decisions. Investors apply them as part of their analysis process to identify material risks and growth opportunities.

## Algorithms

In the scope of this project there are five algorithms of which each calculates the portfolio. The results can be compared with each other in the user interface. Two algorithms are classical well-known approaches for portfolio optimization. The other three are quantum based. So, they use quantum computing simulators to solve the problem. Therefore they either call the API of Azure Quantum or IBM Qiskit.

### Classic Algorithms

Following are short descriptions of the classical solvers.

**OSQP**

Provider: University of Oxford;
The Operator Splitting Quadratic Program (OSQP) solver is an operator for solving convex quadratic programs. Quadratic Programming (QP) is used to optimize mathematical problems that involve quadratic objective functions.

**PyPo**

Provider: PyPortfolioOpt;
PyPortfolioOpt is a library that provides algorithms to implement portfolio optimization methods, like classical efficient frontier techniques.

### Quantum or Quantum-based Algorithms

Following are short descriptions of the three quantum solvers.

**QIO**

Provider: Microsoft Azure Quantum;
Quantum-Inspired Optimization algorithms simulate the effects of quantum computing on classical computers, providing a speedup over classical solutions.

**Qiskit**

Provider: IBM;
Qiskit is an open-source library that provides tools to work with quantum computers. It includes a set of quantum gates and pre-built circuits. By obtaining a key for the IBM Qiskit API, requests are made.

**IonQ**

Provider: IonQ with Microsoft Azure;
IonQ's cloud-based implementation of performing calculations on an idealized quantum computer simulator.

## Result

To evaluate the results of each algorithm with each other, certain metrices are calculated:

- **Rate of Return**: Portfolio result; list of stocks and their portfolio weights.
- **ESG Rating**: ESG values of each stock in the portfolio.
- **ESG Value**: Overall sustainability value of the portfolio. Evaluated based on the portfolio weights:

  ```python
  relative_weights = [weight / 100 for weight in stock_weights]
  esg_value = np.dot(relative_weights, stocks_esg_data)
  ```

- **Risk**: Overall risk of the portfolio. After evaluating the portfolio variance, its square root represents the volatility and therefore taken as risk metrics:

  ```python
  length = len(stock_weights)
  variance = np.dot(stock_weights, np.diagonal(portfolio_model_df.iloc[:length, -length:].to_numpy()))
  volatility = np.sqrt(variance * 100)
  ```

- **Objective Value**: The performance of the portfolio over time.
- **Rate of Return Value**: The expected return of the portfolio based on the historical stock data.
