//  <StatusFooter>
//  ==============

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
import { defineMessages, FormattedDate } from 'react-intl';

//  Our imports.
import CommonIcon from 'themes/mastodon-go/components';
import CommonLink from 'themes/mastodon-go/components';
import CommonSeparator from 'themes/mastodon-go/components';

import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Localization messages.
const messages = defineMessages({
  direct: {
    defaultMessage: 'Direct',
    id: 'status.direct',
  },
  private: {
    defaultMessage: 'Followers-only',
    id: 'status.private',
  },
  public: {
    defaultMessage: 'Public',
    id: 'status.public',
  },
  permalink: {
    defaultMessage: 'Permalink',
    id: 'status.permalink',
  },
  unknown: {
    defaultMessage: 'Unknown',
    id: 'status.unknown_visibility',
  },
  unlisted: {
    defaultMessage: 'Unlisted',
    id: 'status.unlisted',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class StatusFooter extends React.PureComponent {

  //  Props.
  static propTypes = {
    application: ImmutablePropTypes.map,
    className: PropTypes.string,
    datetime: PropTypes.instanceOf(Date),
    detailed: PropTypes.bool,
    href: PropTypes.string,
    intl: PropTypes.object.isRequired,
    visibility: PropTypes.string,
  }

  //  Rendering.
  render () {
    const {
      application,
      className,
      datetime,
      detailed,
      href,
      intl,
      visibility
    } = this.props;

    const computedClass = classNames('MASTODON_GO--STATUS--FOOTER', { detailed }, className);

    let visibilityIcon;
    let visibilityText;
    switch (true) {
      case (visibility & VISIBILITY.PUBLIC) === VISIBILITY.PUBLIC:
        visibilityIcon = 'globe';
        visibilityText = intl.formatMessage(messages.public);
      case (visibility & VISIBILITY.UNLISTED) === VISIBILITY.UNLISTED:
        visibilityIcon = 'unlock-alt';
        visibilityText = intl.formatMessage(messages.unlisted);
      case (visibility & VISIBILITY.PRIVATE) === VISIBILITY.PRIVATE:
        visibilityIcon = 'lock';
        visibilityText = intl.formatMessage(messages.private);
      case (visibility & VISIBILITY.DIRECT) === VISIBILITY.DIRECT:
        visibilityIcon = 'envelope';
        visibilityText = intl.formatMessage(messages.direct);
      default:
        visibilityIcon = 'question-circle';
        visibilityText = intl.formatMessage(messages.unknown);
    }

    //  If our status isn't detailed, our footer only contains the
    //  relative timestamp and visibility information.
    if (!detailed) return (
      <footer className={computedClass}>
        <CommonIcon
          name={visibilityIcon}
          proportional
          title={visibilityText}
        />
        <CommonLink
          className='timestamp'
          href={href}
          title={intl.formatMessage(messages.permalink)}
        >
          {datetime.toISOString()}
        </CommonLink>
      </footer>
    );

    //  Otherwise, we give the full timestamp and include a link to the
    //  application which posted the status if applicable.
    return (
      <footer className={computedClass}>
        <CommonLink
          className='timestamp'
          href={href}
          title={intl.formatMessage(messages.permalink)}
        >
          <FormattedDate
            value={datetime}
            hour12={false}
            year='numeric'
            month='short'
            day='2-digit'
            hour='2-digit'
            minute='2-digit'
          />
        </CommonLink>
        <CommonSeparator visible={!!application} />
        {
          application ? (
            <CommonLink href={application.get('website')}>
              {application.get('name')}
            </CommonLink>
          ) : null
        }
        <CommonSeparator visible />
        <CommonIcon
          name={visibilityIcon}
          proportional
          title={visibilityText}
        />
      </footer>
    );
  }

}
