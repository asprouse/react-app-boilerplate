/*
 * ===== Meta
 *
 * title
 * description
 * keywords
 * type
 * url
 * image
 * siteName
 * facebookAppId
 * appHost
 * cssAsset
 *
 */

export default (props) => {
  const base = {
    title: 'Isomorphic Comments',
    description: 'Comments made isomorphic!',
    keywords: 'flux react redux rails',
    type: 'website',
    siteName: 'Isomorphic Comments'
  };

  const meta = {
    ...props,
    ...base,
    url: props.appHost + props.fullPath,
    image: props.appHost + '/images/cover.png'
  };

  switch (props.route) {

    case 'login':
      meta.title = 'Login';
      break;

    case 'not-found':
      meta.title = `Oops! Nothing here.`;
      meta.description = '404';
      break;
    default:
  }

  if (meta.title !== base.title) {
    meta.title += ` | ${base.title}`;
  }

  return meta;
};
