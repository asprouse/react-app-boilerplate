import config from 'config/server';

const base = config.meta.base;

export default (props) => {
  const pageMeta = config.meta[props.route] || {};
  const meta = {
    ...props,
    ...base,
    ...pageMeta,
    url: props.appHost + props.fullPath,
    image: props.appHost + '/images/cover.png'
  };


  if (meta.title !== base.title) {
    meta.title += ` | ${base.title}`;
  }

  return meta;
};
