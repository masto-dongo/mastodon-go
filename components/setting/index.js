//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Setting extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    global: PropTypes.bool,
    settingKey: PropTypes.oneOf([PropTypes.string, PropTypes.array]).isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['input', 'toggle']),
    '🛄': PropTypes.shape({}),
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({ value: PropTypes.oneOf([PropTypes.string, PropTypes.bool]) }).isRequired,
  };

  //  How we handle a change depends on the type of toggle we are
  //  using.
  handleChange = ({ target }) => {
    const {
      handler,
      type,
    } = this.props;
    switch (type) {
    case 'input':
      handler.change('' + target.value);
    case 'toggle':
      handler.change(!!target.value);
    }
  }

  //  Rendering.
  render () {
    const { handleChange } = this;
    const {
      children,
      className,
      disabled,
      key,
      global,
      title,
      type,
      '🛄': context,
      '💪': handler,
      '🏪': { value },
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--TOGGLE', {
      active: value,
      disabled,
    }, className, type);

    //  The type of component we render depends on our `type`.
    const component = function () {
      switch (type) {
      case 'input':
        return (
          <input
            disabled={disabled}
            onChange={handleChange}
            placeholder={title}
            title={title}
            type='text'
            value={value}
          />
        );
      case 'toggle':
        return (
          <Toggle
            checked={value}
            disabled={disabled}
            onChange={handleChange}
            title={title}
          />
        );
      default:
        return null;
      }
    }();

    //  If no component was generated, there's no sense in rendering.
    if (!component) {
      return null;
    }

    //  If we have children, we create a `<label>`. If not, we use
    //  `<span>`.
    return children ? (
      <label
        className={computedClass}
        {...rest}
      >
        {component}
        {children}
      </label>
    ) : (
      <span
        className={computedClass}
        {...rest}
      >{component}</span>
    );
  };

}