//  ACCOUNT:FETCH
//  =============

//  Imported requests.
import { fetchRelationship } from 'mastodon-go/redux';

//  Action types.
export const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST';
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS';
export const ACCOUNT_FETCH_FAILURE = 'ACCOUNT_FETCH_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_FETCH_REQUEST,
});
const success = account => ({
  account,
  type: ACCOUNT_FETCH_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_FETCH_FAILURE,
});

//  Request.
export const fetchAccount = (id, go, state, api) => {

  //  Whether we have the account or not, we fetch updated relationship
  //  information.
  go(fetchRelationship, id);

  //  If we already have the account data, we don't bother fetching it.
  if (state.getIn(['accounts', id])) {
    return;
  }

  //  The request.
  go(request, id);
  api.get(
    `/api/v1/accounts/${id}`
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error => go(failure, id, error)
  );
};