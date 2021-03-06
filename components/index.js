//  <MastodonGO>
//  ============

//  See the subfolders for various components.  Here we just provide
//  the necessary provider components for routing our `<RoutedUI>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';
import { RoutedUI } from './routed';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class MastodonGO extends React.Component {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = { konamiActive: false };

    //  Function binding.
    const { handleKeyDown } = Object.getPrototypeOf(this);
    this.handleKeyDown = handleKeyDown.bind(this);
    this.konami = 0;
  }

  //  We set up keydown listeners on the body when mounting and remove
  //  them when unmounting.
  componentWillMount () {
    const { handleKeyDown } = this;
    document.body.addEventListener('keydown', handleKeyDown, true);
  }
  componentWillUnmount () {
    const { handleKeyDown } = this;
    document.body.removeEventListener('keydown', handleKeyDown, true);
  }

  //  Big professional companies aren't allowed to have code like this.
  //  So we will in their stead.
  handleKeyDown (e) {
    const { konami } = this;
    const { konamiActive } = this.state;
    if (e.key.toUpperCase() === [
      'ARROWUP',
      'ARROWUP',
      'ARROWDOWN',
      'ARROWDOWN',
      'ARROWLEFT',
      'ARROWRIGHT',
      'ARROWLEFT',
      'ARROWRIGHT',
      'B',
      'A',
    ][konami] || e.key.toUpperCase() === [
      'I',
      'I',
      'K',
      'K',
      'J',
      'L',
      'J',
      'L',
      'Z',
      'X',
    ][konami]) {
      if (++this.konami >= 10) {
        this.setState({ konamiActive: !konamiActive });
        this.konami = 0;
      }
    } else {
      this.konami = 0;
    }
  }

  //  Rendering.
  render () {
    const {
      className,
      locale,
      messages,
      store,
      ...rest
    } = this.props;
    const { konamiActive } = this.state;
    const computedClass = classNames('MASTODON_GO', { konami: konamiActive }, className);

    //  We just render a bunch of providers and our `<RoutedUI>` inside
    //  a `<div>`.
    return (
      <div
        className={computedClass}
        {...rest}
      >
        <IntlProvider
          locale={locale}
          messages={messages}
        >
          <Provider store={store}>
            <BrowserRouter basename='/web'>
              <Route
                component={RoutedUI}
                path='/'
              />
            </BrowserRouter>
          </Provider>
        </IntlProvider>
      </div>
    );
  }

}

MastodonGO.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string.isRequired,  //  The locale to use with our frontend
  messages: PropTypes.object.isRequired,  //  Locale messages for our frontend
  store: PropTypes.object.isRequired,  //  Our redux store
};

//  * * * * * * *  //

//  Exports
//  -------

//  Named exports.
export * from './common';
export * from './connected';
export * from './panelled';
export * from './raw';
export * from './routed';
