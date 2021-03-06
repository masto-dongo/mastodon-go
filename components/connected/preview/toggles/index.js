//  <ConnectedPreviewToggles>
//  =========================

//  This component holds the toggles for controlling status visibility.
//  This may change at some point in the future (see Issue #22).

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonToggle } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedPreviewToggles extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const {
      handleDirect,
      handleFederated,
      handleListed,
      handleRebloggable,
    } = Object.getPrototypeOf(this);
    this.handleDirect = handleDirect.bind(this);
    this.handleFederated = handleFederated.bind(this);
    this.handleListed = handleListed.bind(this);
    this.handleRebloggable = handleRebloggable.bind(this);
  }

  //  Here are our toggles.
  handleFederated (value) {
    const {
      onVisibility,
      visibility,
    } = this.props;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.FEDERATED : visibility & ~VISIBILITY.FEDERATED);
  }
  handleRebloggable (value) {
    const {
      onVisibility,
      visibility,
    } = this.props;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.NON_FOLLOWERS | VISIBILITY.REBLOGGABLE : visibility & ~VISIBILITY.REBLOGGABLE & ~VISIBILITY.LISTED);
  }
  handleListed (value) {
    const {
      onVisibility,
      visibility,
    } = this.props;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility | VISIBILITY.NON_FOLLOWERS | VISIBILITY.REBLOGGABLE | VISIBILITY.LISTED : visibility & ~VISIBILITY.LISTED);
  }
  handleDirect (value) {
    const {
      onVisibility,
      visibility,
    } = this.props;
    if (!onVisibility) {
      return;
    }
    onVisibility(value ? visibility & VISIBILITY.DIRECT : visibility | VISIBILITY.FOLLOWERS | VISIBILITY.PROFILE);
  }

  //  Rendering.
  render () {
    const {
      handleDirect,
      handleFederated,
      handleListed,
      handleRebloggable,
    } = this;
    const {
      className,
      disabled,
      visibility,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--TOGGLES', { disabled }, className);

    //  We just render our toggles in a `<div>`.
    return (
      <div className={computedClass}>
        <CommonToggle
          active={!!(visibility & VISIBILITY.FEDERATED)}
          activeIcon='globe'
          activeLabel={ℳ.federatedOn}
          disabled={disabled}
          inactiveIcon='users'
          inactiveLabel={ℳ.federatedOff}
          onChange={handleFederated}
        />
        <CommonToggle
          active={!!(visibility & VISIBILITY.REBLOGGABLE)}
          activeIcon='unlock'
          activeLabel={ℳ.rebloggableOn}
          disabled={disabled}
          inactiveIcon='lock'
          inactiveLabel={ℳ.rebloggableOff}
          onChange={handleRebloggable}
        />
        <CommonToggle
          active={!!(visibility & VISIBILITY.LISTED)}
          activeIcon='newspaper-o'
          activeLabel={ℳ.listedOn}
          disabled={disabled}
          inactiveIcon='microphone-slash'
          inactiveLabel={ℳ.listedOff}
          onChange={handleListed}
        />
        <CommonToggle
          active={!(visibility & ~VISIBILITY.DIRECT)}
          activeIcon='envelope'
          activeLabel={ℳ.directOn}
          disabled={disabled}
          inactiveIcon='envelope-open'
          inactiveLabel={ℳ.directOff}
          onChange={handleDirect}
        />
      </div>
    );
  }

}

//  Props.
ConnectedPreviewToggles.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled
  onVisibility: PropTypes.func,  //  A function to call when changing status visibility
  visibility: PropTypes.number,  //  The `VISIBILITY` of the status
  ℳ: PropTypes.func.isRequired,
};
