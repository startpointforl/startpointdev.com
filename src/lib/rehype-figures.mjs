// Картинка в Markdown оказывается внутри <p>. Делаем из неё <figure>, а курсивный абзац
// сразу после картинки — <figcaption>. Так правильнее семантически, и Instant View
// в Telegram не поддерживает <img> внутри <p>.
const isWhitespace = (n) => n.type === 'text' && !n.value.trim();
const onlyChild = (node, tag) => {
  const kids = (node.children || []).filter((c) => !isWhitespace(c));
  return kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === tag ? kids[0] : null;
};

export default function rehypeFigures() {
  return (tree) => {
    const walk = (parent) => {
      const kids = parent.children || [];
      for (let i = 0; i < kids.length; i++) {
        const node = kids[i];
        if (node.type !== 'element') continue;
        const img = node.tagName === 'p' && onlyChild(node, 'img');
        if (!img) {
          walk(node);
          continue;
        }
        const figure = { type: 'element', tagName: 'figure', properties: {}, children: [img] };
        let j = i + 1;
        while (j < kids.length && isWhitespace(kids[j])) j++;
        const next = kids[j];
        const em = next && next.type === 'element' && next.tagName === 'p' && onlyChild(next, 'em');
        if (em) {
          figure.children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: em.children });
          kids.splice(i + 1, j - i);
        }
        kids[i] = figure;
      }
    };
    walk(tree);
  };
}
