export const html = (s: TemplateStringsArray, ...args: any[]) => s.map((ss, i) => `${ss}${args[i] || ''}`).join('');
