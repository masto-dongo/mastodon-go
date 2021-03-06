//  ACCOUNT
//  =======

//  Upstream Mastodon splits out some of its account information
//  (namely, the various counts for followers, etc.), but we leave them
//  all packaged together. Good selector design should overcome any
//  problems that this might otherwise cause.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  List as ImmutableList,
  Map as ImmutableMap,
} from 'immutable';

//  Request imports.
import fetchAccount from './fetch';
import updateAccount from './update';
import verifyAccount from './verify';

//  Action types.
import { ACCOUNT_FETCH_SUCCESS } from 'themes/mastodon-go/redux/account/fetch';
import { ACCOUNT_UPDATE_SUCCESS } from 'themes/mastodon-go/redux/account/update';
import { ACCOUNT_VERIFY_SUCCESS } from 'themes/mastodon-go/redux/account/verify';
import { CATALOGUE_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/catalogue/expand';
import { CATALOGUE_FETCH_SUCCESS } from 'themes/mastodon-go/redux/catalogue/fetch';
import { CATALOGUE_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/catalogue/refresh';
import { CONVERSATION_FETCH_SUCCESS } from 'themes/mastodon-go/redux/conversation/fetch';
import { COURIER_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/courier/expand';
import { COURIER_FETCH_SUCCESS } from 'themes/mastodon-go/redux/courier/fetch';
import { COURIER_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/courier/refresh';
import { COURIER_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/courier/update';
import { META_LOAD_COMPLETE } from 'themes/mastodon-go/redux/meta/load';
import { NOTIFICATION_FETCH_SUCCESS } from 'themes/mastodon-go/redux/notification/fetch';
import { TIMELINE_EXPAND_SUCCESS } from 'themes/mastodon-go/redux/timeline/expand';
import { TIMELINE_FETCH_SUCCESS } from 'themes/mastodon-go/redux/timeline/fetch';
import { TIMELINE_REFRESH_SUCCESS } from 'themes/mastodon-go/redux/timeline/refresh';
import { TIMELINE_UPDATE_RECEIVE } from 'themes/mastodon-go/redux/timeline/update';
import { STATUS_FAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/favourite';
import { STATUS_FETCH_SUCCESS } from 'themes/mastodon-go/redux/status/fetch';
import { STATUS_MUTE_SUCCESS } from 'themes/mastodon-go/redux/status/mute';
import { STATUS_PIN_SUCCESS } from 'themes/mastodon-go/redux/status/pin';
import { STATUS_REBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/reblog';
import { STATUS_UNFAVOURITE_SUCCESS } from 'themes/mastodon-go/redux/status/unfavourite';
import { STATUS_UNMUTE_SUCCESS } from 'themes/mastodon-go/redux/status/unmute';
import { STATUS_UNPIN_SUCCESS } from 'themes/mastodon-go/redux/status/unpin';
import { STATUS_UNREBLOG_SUCCESS } from 'themes/mastodon-go/redux/status/unreblog';

//  Other imports.
import deHTMLify from 'themes/mastodon-go/util/deHTMLify';
import rainbow from 'themes/mastodon-go/util/rainbow';
import { readƔaml } from 'themes/mastodon-go/util/ɣaml';

//  * * * * * * *  //

//  Setup
//  -----

//  `normalize()` normalizes our account into an Immutable map.
const normalize = (account, oldBio) => {
  const plainBio = oldBio && oldBio.get('html') === '' + account.note ? oldBio.get('plain') : deHTMLify(account.note);
  const ɣamlBio = oldBio && oldBio.get('html') === '' + account.note ? oldBio.get('ɣaml') : function (ɣaml) {
    return ImmutableMap({
      metadata: ImmutableList((ɣaml.metadata || []).map(
        keyVal => ImmutableList(keyVal),
      )),
      text: '' + ɣaml.text,
    });
  }(readƔaml(plainBio));
  return ImmutableMap({
    at: '' + account.acct,
    avatar: ImmutableMap({
      original: '' + account.avatar,
      static: '' + account.avatar_static,
    }),
    bio: ImmutableMap({
      html: '' + account.note,
      plain: '' + plainBio,
      ɣaml: ɣamlBio,
    }),
    counts: ImmutableMap({
      followers: +account.followers_count,
      following: +account.following_count,
      statuses: +account.statuses_count,
    }),
    datetime: new Date(account.created_at),
    displayName: '' + (account.display_name || account.username),
    domain: '' + (account.acct.split('@')[1] || ''),
    header: ImmutableMap({
      original: '' + account.header,
      static: '' + account.header_static,
    }),
    href: '' + account.url,
    id: '' + account.id,
    locked: !!account.locked,
    rainbow: ImmutableMap({
      1: rainbow(account.acct),
      3: ImmutableList(rainbow(account.acct, 3)),
      7: ImmutableList(rainbow(account.acct, 7)),
      15: ImmutableList(rainbow(account.acct, 15)),
    }),
    username: '' + account.username,
  });
};

//  * * * * * * *  //

//  State
//  -----

//  Our `initialState` is an empty map. Our accounts will be added to
//  this by `id`.
const initialState = ImmutableMap();

//  `set()` just sets the Immutable map at each `account`'s `id` to be
//  a newly normalized account.
const set = (state, accounts) => state.withMutations(
  map => [].concat(accounts).forEach(
    account => map.set('' + account.id, normalize(account, state.getIn(['' + account.id, 'bio'])))
  )
);

//  * * * * * * *  //

//  Reducer
//  -------

//  Action reducing.
export default function account (state = initialState, action) {
  switch (action.type) {
  case ACCOUNT_FETCH_SUCCESS:
  case ACCOUNT_UPDATE_SUCCESS:
  case ACCOUNT_VERIFY_SUCCESS:
    return set(state, action.account);
  case CATALOGUE_EXPAND_SUCCESS:
  case CATALOGUE_FETCH_SUCCESS:
  case CATALOGUE_REFRESH_SUCCESS:
    return set(state, action.accounts);
  case CONVERSATION_FETCH_SUCCESS:
    return set(state, [].concat(action.ancestors.map(
      status => status.account
    ), action.descendants.map(
      status => status.account
    )));
  case COURIER_EXPAND_SUCCESS:
  case COURIER_FETCH_SUCCESS:
  case COURIER_REFRESH_SUCCESS:
    return set(state, [].concat(...action.notifications.map(
      notification => [
        notification.account,
        notification.status.account,
      ]
    )));
  case COURIER_UPDATE_RECEIVE:
    return set(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case META_LOAD_COMPLETE:
    if (action.meta.hasOwnProperty('accounts')) {
      return set(state, function (accounts) {
        const list = [];
        for (account in accounts) {
          list.push(accounts[account]);
        }
        return list;
      }(action.meta.accounts));
    }
    return state;
  case NOTIFICATION_FETCH_SUCCESS:
    return set(state, [
      action.notification.account,
      action.notification.status.account,
    ]);
  case STATUS_FAVOURITE_SUCCESS:
  case STATUS_FETCH_SUCCESS:
  case STATUS_MUTE_SUCCESS:
  case STATUS_PIN_SUCCESS:
  case STATUS_REBLOG_SUCCESS:
  case STATUS_UNFAVOURITE_SUCCESS:
  case STATUS_UNMUTE_SUCCESS:
  case STATUS_UNPIN_SUCCESS:
  case STATUS_UNREBLOG_SUCCESS:
    return set(state, action.status.account);
  case TIMELINE_EXPAND_SUCCESS:
  case TIMELINE_FETCH_SUCCESS:
  case TIMELINE_REFRESH_SUCCESS:
    return set(state, action.statuses.map(
      status => status.account
    ));
  case TIMELINE_UPDATE_RECEIVE:
    return set(state, action.status.account);
  default:
    return state;
  }
}

//  * * * * * * *  //

//  Named exports
//  -------------

//  Our requests.
export {
  fetchAccount,
  updateAccount,
  verifyAccount,
};
