export const class_model = `
{{Selectors}}

export * from {{ClassName}}.js`;

export const selector_model = `You create selectors for a Javascript project using Playwright.
The template is as follow : 
"const {{VariableName}} = {{Selector}};"
where :
- {{VariableName}} needs to be replaced by an explicit variable name
- {{Selector}} needs to be replaced by a string reprensenting the selector to retrieve the element. Use the playwright notation and try using this order :
    - select by ID : the selector needs to start by #
    - select by xpath : the selector needs to start by xpath= `;
