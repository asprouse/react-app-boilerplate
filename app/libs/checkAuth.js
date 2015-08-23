import { getUser } from 'app/actions/AuthActions';
import Api from 'app/libs/Api';

export default function checkAuth(req, dispatch) {
  if (req.cookies.session) {
    Api.setCookie(req.cookies);
    return dispatch(getUser());
  }
  return Promise.resolve();
}
