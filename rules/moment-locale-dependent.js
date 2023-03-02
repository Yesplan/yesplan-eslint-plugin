const violations = [
  ['startOf', 'week'],
  ['endOf', 'week'],
  ['weekYear', null],
  ['weekday', null],
  ['week', null],
  ['weeksInYear', null],
  ['format', 'L'],
  ['format', 'LL'],
  ['format', 'LLL'],
  ['format', 'LLLL'],
  ['format', 'l'],
  ['format', 'll'],
  ['format', 'lll'],
  ['format', 'llll']
];

const isViolation = (node) =>
  violations.some(([violationProperty, ...violationArguments]) => {
    const literalValues = node.arguments
      .filter((arg) => arg.type === 'Literal')
      .map((literal) => literal.value);
    if (
      literalValues.length === violationArguments.length ||
      violationArguments[0] === null
    ) {
      return (
        node.callee.property.name === violationProperty &&
        literalValues.every(
          (literalValue, idx) => literalValue === violationArguments[idx]
        )
      );
    }
    return false;
  });


module.exports = (context) => ({
    CallExpression: (node) => {
      if (node.callee.type === 'MemberExpression' && isViolation(node)) {
        context.report(
          node,
          `Calls to ${node.callee.property.name}(${node.arguments
            .map((arg) => arg.value)
            .join(',')}) on moment objects are disallowed`
        );
      }
    }
  })
