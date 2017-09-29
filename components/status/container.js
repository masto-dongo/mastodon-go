//  <StatusContainer>
//  ==================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import {
  createSelector,
  createStructuredSelector,
} from 'reselect';

//  Component imports.
import Status from '.';

//  Request imports.
import {
  deleteStatus,
  favouriteStatus,
  fetchCard,
  fetchStatus,
  muteStatus,
  pinStatus,
  reblogStatus,
  submitStatus,
  unfavouriteStatus,
  unmuteStatus,
  unpinStatus,
  unreblogStatus,
} from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Setup
//  -----

const getInStatus = (state, id, key) => {
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['status', id, key]);
}
const getCard = (state, id) => {
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['card', id]);
}

//  * * * * * * *  //

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      account: (state, { id }) => getInStatus(state, id, 'account'),
      application: (state, { id }) => getInStatus(state, id, 'application'),
      card: (state, { id }) => getCard(state, id),
      comrade: (state, {
        comrade,
        id,
      }) => {
        if (!comrade && state.getIn(['status', id, 'reblog'])) {
          comrade = state.getIn(['status', id, 'account']);
        }
        return comrade || null;
      },
      content: (state, { id }) => getInStatus(state, id, 'content'),
      datetime: (state, { id }) => getInStatus(state, id, 'datetime'),
      href: (state, { id }) => getInStatus(state, id, 'href'),
      inReplyTo: (state, { id }) => getInStatus(state, id, 'inReplyTo'),
      is: (state, { id }) => getInStatus(state, id, 'is'),
      media: (state, { id }) => getInStatus(state, id, 'media'),
      mentions: (state, { id }) => getInStatus(state, id, 'mentions'),
      sensitive: (state, { id }) => getInStatus(state, id, 'sensitive'),
      spoiler: (state, { id }) => getInStatus(state, id, 'spoiler'),
      tags: (state, { id }) => getInStatus(state, id, 'tags'),
      visibility: (state, { id }) => getInStatus(state, id, 'visibility'),
    }),

    //  Inputs.
    (state, ownProps) => ownProps,

    //  Result.
    (props, ownProps) => ({
      handler: {
        card: () => go(fetchCard, ownProps.id),
        delete: () => go(deleteStatus, ownProps.id),
        favourite: () => go(favouriteStatus, ownProps.id),
        fetch: () => go(fetchStatus, ownProps.id),
        mute: () => go(muteStatus, ownProps.id),
        pin: () => go(pinStatus, ownProps.id),
        reblog: () => go(reblogStatus, ownProps.id),
        unmute: () => go(unmuteStatus, ownProps.id),
        unpin: () => go(unpinStatus, ownProps.id),
        unreblog: () => go(unreblogStatus, ownProps.id),
      },
      ...ownProps,
      ...props,
    })
  )
)(Status);
