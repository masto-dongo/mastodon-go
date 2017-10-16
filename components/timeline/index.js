import classNames from 'classnames'
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

import { StatusContainer } from 'themes/mastodon-go/components';

import {
  CommonHeader,
  CommonList,
  CommonLoadbar,
} from 'themes/mastodon-go/components';

import TimelineMenu from './menu';
import TimelinePane from './pane';

import './style';

import { POST_TYPE } from 'themes/mastodon-go/util/constants';

const messages = defineMessages({
  timeline: {
    defaultMessage: "Timeline",
    id: "timeline.timeline",
  }
})

export default class Timeline extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    column: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    path: PropTypes.string.isRequired,
    title: PropTypes.node,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      isLoading: PropTypes.bool,
      rainbow: ImmutablePropTypes.map,
      settings: ImmutablePropTypes.map,
      statuses: ImmutablePropTypes.list,
    }).isRequired,
  };
  state = {
    currentDetail: null,
    storedHash: '#',
  };

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  handleLoadMore = () => {
    const { '💪': { expand } } = this.props;
    expand();
  }

  handleSetDetail = id => this.setState({ currentDetail: id });
  handleSetHash = hash => this.setState({ storedHash: hash });

  render () {
    const {
      handleSetDetail,
      handleSetHash,
    } = this;
    const {
      activeRoute,
      className,
      column,
      hash,
      history,
      icon,
      path,
      title,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        isLoading,
        rainbow,
        settings,
        statuses,
      },
      ...rest
    } = this.props;
    const {
      currentDetail,
      storedHash,
    } = this.state;

    const computedClass = classNames('MASTODON_GO--TIMELINE', className);
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <div
        className={computedClass}
        {...rest}
      >
        {
          column ? (
            <TimelineMenu
              activeRoute={activeRoute}
              hash={computedHash}
              history={history}
              icon={icon}
              intl={intl}
              onSetHash={handleSetHash}
              title={intl.formatMessage(messages.timeline)}
            />
          ) : null
        }
        {column ? <CommonHeader title={title} /> : null}
        <CommonList>
          {statuses ? statuses.reduce(
            (items, id) => items.push(
              <StatusContainer
                detailed={currentDetail === id}
                filterRegex={settings.getIn(['regex', 'body'])}
                hideIf={(settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'reply']) && POST_TYPE.IS_MENTION)}
                id={id}
                key={id}
                setDetail={handleSetDetail}
              />
            ),
            []
          ) : null}
        </CommonList>
        {
          column ? (
            <TimelinePane
              hash={computedHash}
              intl={intl}
              path={path}
            />
          )
        }
        {isLoading ? (
          <CommonLoadbar backgroundImage:={`linear-gradient(90deg, ${rainbow.get('15').join(', ')}, ${rainbow.getIn(['15', 0])})`} />
        ) : null}
      </div>
    );
  }

}
