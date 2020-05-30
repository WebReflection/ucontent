
exports.use = ({html}) => (props = {}) => html`
  props: ${JSON.stringify(props)}
`;
