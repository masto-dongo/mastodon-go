//  <StatusContent>
//  ===============

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  CardContainer,
  ParseContainer,
  ReferenceContainer,
} from 'themes/mastodon-go/components';

import { CommonButton } from 'themes/mastodon-go/components';

// import StatusContentGallery from './gallery';
// import StatusContentUnknown from './unknown';
const StatusContentGallery = () => null;
const StatusContentUnknown = () => null;

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  show_more: {
    defaultMessage: 'Show more',
    id: 'status.show_more',
  },
  show_less: {
    defaultMessage: 'Show less',
    id: 'status.show_less',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class StatusContent extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    content: PropTypes.string,
    contentVisible: PropTypes.bool,
    detailed: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    media: ImmutablePropTypes.list,
    mentions: ImmutablePropTypes.list,
    onClick: PropTypes.func,
    sensitive: PropTypes.bool,
    setExpansion: PropTypes.func,
    spoiler: PropTypes.string,
    tags: ImmutablePropTypes.list,
  }

  //  Variables.
  startXY = null

  //  When the mouse is pressed down, we grab its position.
  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY];
  }

  //  When the mouse is raised, we handle the click if it wasn't a part
  //  of a drag.
  handleMouseUp = (e) => {
    const { startXY } = this;
    const { onClick } = this.props;
    const { button, clientX, clientY, target } = e;

    //  This gets the change in mouse position. If `startXY` isn't set,
    //  it means that the click originated elsewhere.
    if (!startXY) return;
    const [ deltaX, deltaY ] = [clientX - startXY[0], clientY - startXY[1]];

    //  This switch prevents an overly lengthy if.
    switch (true) {

    //  If the button being released isn't the main mouse button, or if
    //  we don't have a click parsing function, or if the mouse has
    //  moved more than 5px, OR if the target of the mouse event is a
    //  button or a link, we do nothing.
    case button !== 0:
    case !onClick:
    case Math.sqrt(deltaX ** 2 + deltaY ** 2) >= 5:
    case (
      target.matches || target.msMatchesSelector || target.webkitMatchesSelector || (() => void 0)
    ).call(target, 'button, button *, a, a *'):
      break;

    //  Otherwise, we parse the click.
    default:
      onClick(e);
      break;
    }

    //  This resets our mouse location.
    this.startXY = null;
  }

  //  This expands and collapses our spoiler.
  handleSpoilerClick = (e) => {
    const { setExpansion } = this.props;
    e.preventDefault();
    if (setExpansion) {
      setExpansion();  //  Calling with no argument toggles
    }
  }

  //  Renders our component.
  render () {
    const {
      handleMouseDown,
      handleMouseUp,
      handleSpoilerClick,
    } = this;
    const {
      card,
      className,
      content,
      contentVisible,
      detailed,
      handler,
      history,
      intl,
      media,
      mentions,
      onClick,
      sensitive,
      setExpansion,
      spoiler,
      tags,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--STATUS--CONTENT', {
      actionable: !detailed && onClick,
      spoilered: !contentVisible,
    });
    const mediaElement = function () {
      switch (true) {

      //  If there aren't any media attachments, we try showing a card.
      case (!media || !media.size) && card:
        return <CardContainer card={card.get('id')} />;

      //  Otherwise, if there is an unknown attachment, we show an
      //  attachment list.
      case (media && media.some(
        item => item.get('type') === 'unknown'
      )):
        return <StatusContentUnknown media={media} />;

      //  Otherwise, if there are attachments, we render them in a
      //  gallery.
      case !!media:
        return (
          <StatusContentGallery
            media={media}
            sensitive={sensitive}
          />
        );
      default:
        return null;
      }
    }();

    //  Spoiler stuff.
    if (spoiler.length > 0) {

      //  This gets our list of mentions.
      const mentionLinks = status.get('mentions').map(
        mention => (
          <ReferenceContainer
            mention={mention.get('id')}
            showAt
          />
        )
      ).reduce(
        (aggregate, item) => [...aggregate, ' ', item], []
      );

      //  Component rendering.
      return (
        <div
          className={computedClass}
          {...rest}
        >
          <div
            className='spoiler'
            {...(onClick ? {
              onMouseDown: handleMouseDown,
              onMouseUp: handleMouseUp,
            } : {})}
          >
            <p>
              <ParseContainer
                text={spoiler}
                type='emoji'
              />
              {' '}
              <CommonButton
                active={!!contentVisible}
                className='showmore'
                onClick={handleSpoilerClick}
                showTitle={!contentVisible}
                title={intl.formatMessage(messages.show_more)}
              >
                {contentVisible ? null : (
                  <FormattedMessage {...messages.show_less} />
                )}
              </CommonButton>
            </p>
          </div>
          {!contentVisible ? mentionLinks : null}
          <div className='contents' hidden={!contentVisible}>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ParseContainer
                text={content}
                type='status'
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );

    //  Non-spoiler statuses.
    } else {
      return (
        <div
          className={computedClass}
          {...rest}
        >
          <div className='contents'>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ParseContainer
                text={content}
                type='status'
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );
    }
  }

}
