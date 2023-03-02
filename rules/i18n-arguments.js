module.exports = (context) => ({
    CallExpression: (node) => {
      if (node.callee.name === 'i18n') {
        const args = node.arguments;
        if (args.length >= 1) {
          const firstArg = args[0];
          if (firstArg.type === 'TemplateLiteral')
            context.report({
              node,
              message:
                  'i18n called with a template literal as argument, use the i18n tagged template instead'
            });
          else if (firstArg.type !== 'Literal') {
            context.report(
                node,
                'i18n called with non-string literal, use i18nDefine to ensure these translations are picked up'
            );
          }
        }
      }
      else if (node.callee.name === 'i18nDefine') {
        const args = node.arguments;
        if (args.length === 1) {
          const firstArg = args[0];
          if (firstArg.type === 'ArrayExpression') {
            if (firstArg.elements.some(element => element.type !== 'Literal')) {
              context.report(
                  node,
                  'i18nDefine should be called with an array of string literals'
              )
            }
          }
          else {
            context.report(
                node,
                'i18nDefine should be called with an array of string literals'
            )
          }
        } else {
          context.report(
              node,
              'i18nDefine called with more than one argument')
        }
      }
    }
  })
