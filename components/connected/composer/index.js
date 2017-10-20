//  `<DrawerComposer>`
//  ==================

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Container imports.
import {
  CommonInput,
  ConnectedAccount,
  ConnectedStatus,
} from 'themes/mastodon-go/components';
import ConnectedComposerControls from './controls';
import ConnectedComposerInput from './input';
import ConnectedComposerTextArea from './text_area';

//  Stylesheet imports.
import './style';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { Emojifier } from 'themes/mastodon-go/util/emojify';

class Composer extends React.PureComponent {

  constructor (props) {
    super(props);

    const { '🏪': { emojos } } = this.props;
    this.emoji = (new Emojifier(emojos && emojos.toJS() || [])).emoji;
  }

  //  If our `emojos` change, then we need to create new `Emoji`.
  componentWillReceiveProps (nextProps) {
    const { '🏪': { emojos } } = this.props;
    if (emojos !== nextProps['🏪'].emojos) {
      this.emoji = (new Emojifier(nextProps['🏪'].emojos && nextProps['🏪'].emojos.toJS() || [])).emoji;
    }
  }

  render () {
    const { emoji } = this;
    const {
      activeRoute,
      className,
      disabled,
      history,
      inReplyTo,
      media,
      onClear,
      onMediaRemove,
      onSensitive,
      onSpoiler,
      onSubmit,
      onText,
      onUpload,
      onVisibility,
      path,
      rehash,
      sensitive,
      spoiler,
      text,
      visibility,
      ℳ,
      '🏪': { me },
      '💪': handler,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--DRAWER--COMPOSER', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <ConnectedAccount
          history={history}
          id={me}
          small
        />
        <CommonInput
          disabled={disabled}
          onChange={onSpoiler}
          title={ℳ.spoiler}
          value={spoiler}
        />
        <ConnectedStatus
          id={inReplyTo}
          small
        />
        <ConnectedComposerTextArea
          disabled={disabled}
          emoji={emoji}
          onChange={onText}
          value={text}
          ℳ={ℳ}
        />
        <ConnectedComposerInput
          attachments={media}
          sensitive={sensitive}
          onRemove={onMediaRemove}
          onSensitive={onSensitive}
          onUpload={onUpload}
          ℳ={ℳ}
        />
        <ConnectedComposerControls
          activeRoute={activeRoute}
          attached={media.length}
          history={history}
          onSubmit={onSubmit}
          rehash={rehash}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
Composer.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  history: PropTypes.object,
  inReplyTo: PropTypes.string,
  media: PropTypes.array,
  onClear: PropTypes.func,
  onMediaRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onSpoiler: PropTypes.func,
  onSubmit: PropTypes.func,
  onText: PropTypes.func,
  onUpload: PropTypes.func,
  onVisibility: PropTypes.func,
  path: PropTypes.string.isRequired,
  rehash: PropTypes.func,
  sensitive: PropTypes.bool,
  spoiler: PropTypes.string,
  text: PropTypes.string.isRequired,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    emojos: ImmutablePropTypes.list,
    me: PropTypes.string,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(

  //  Component
  Composer,

  //  Store
  createStructuredSelector({
    emojos: state => state.get('emoji'),
    me: state => state.getIn(['meta', 'me']),
  }),

  //  Messages
  defineMessages({
    attach: {
      defaultMessage: 'Upload media',
      description: 'Used to label the media input button',
      id: 'composer.attach',
    },
    close: {
      defaultMessage: 'Close',
      description: 'Used to label the close button on the composer input section',
      id: 'composer.close',
    },
    emoji: {
      defaultMessage: 'Insert emoji',
      description: 'Used to label the emoji input button',
      id: 'composer.emoji',
    },
    label: {
      defaultMessage: 'What\'s new?',
      description: 'Label used for the composer text area',
      id: 'composer.label',
    },
    publish: {
      defaultMessage: 'Toot',
      description: 'Used to label the toot button',
      id: 'composer.publish',
    },
    quick: {
      defaultMessage: 'Quick toot',
      description: 'Used to label the toot button when quick tooting',
      id: 'composer.quick',
    },
    spoiler: {
      defaultMessage: 'Subject…',
      description: 'Used as the placeholder for a spoiler',
      id: 'composer.spoiler',
    },
  }),
);