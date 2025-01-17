'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _inputmaskCore = require('inputmask-core');

var _inputmaskCore2 = _interopRequireDefault(_inputmaskCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYCODE_Z = 90;
var KEYCODE_Y = 89;

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function getSelection(el) {
  var start = void 0,
      end = void 0;
  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      var rangeEl = el.createTextRange();
      var clone = rangeEl.duplicate();

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint('EndToStart', rangeEl);

      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {/* not focused or not visible */}
  }

  return { start: start, end: end };
}

function setSelection(el, selection) {
  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      var rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart('character', selection.start);
      rangeEl.moveEnd('character', selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {/* not focused or not visible */}
}

var MaskedInput = (_temp2 = _class = function (_React$Component) {
  _inherits(MaskedInput, _React$Component);

  function MaskedInput() {
    var _temp, _this, _ret;

    _classCallCheck(this, MaskedInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this._onChange = function (e) {
      // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)

      var maskValue = _this.mask.getValue();
      var incomingValue = e.target.value;
      if (incomingValue !== maskValue) {
        // only modify mask if form contents actually changed
        _this._updateMaskSelection();
        _this.mask.setValue(incomingValue); // write the whole updated value into the mask
        e.target.value = _this._getDisplayValue(); // update the form with pattern applied to the value
        _this._updateInputSelection();
      }

      if (_this.props.onChange) {
        _this.props.onChange(e);
      }
    }, _this._onKeyDown = function (e) {
      // console.log('onKeyDown', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

      if (isUndo(e)) {
        e.preventDefault();
        if (_this.mask.undo()) {
          e.target.value = _this._getDisplayValue();
          _this._updateInputSelection();
          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }
        return;
      } else if (isRedo(e)) {
        e.preventDefault();
        if (_this.mask.redo()) {
          e.target.value = _this._getDisplayValue();
          _this._updateInputSelection();
          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        _this._updateMaskSelection();
        if (_this.mask.backspace()) {
          var value = _this._getDisplayValue();
          e.target.value = value;
          if (value) {
            _this._updateInputSelection();
          }
          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }
      }
    }, _this._onKeyPress = function (e) {
      // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

      // Ignore modified key presses
      // Ignore enter key to allow form submission
      if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
        return;
      }

      e.preventDefault();
      _this._updateMaskSelection();
      if (_this.mask.input(e.key || e.data)) {
        e.target.value = _this.mask.getValue();
        _this._updateInputSelection();
        if (_this.props.onChange) {
          _this.props.onChange(e);
        }
      }
    }, _this._onPaste = function (e) {
      // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

      e.preventDefault();
      _this._updateMaskSelection();
      // getData value needed for IE also works in FF & Chrome
      if (_this.mask.paste(e.clipboardData.getData('Text'))) {
        e.target.value = _this.mask.getValue();
        // Timeout needed for IE
        setTimeout(function () {
          return _this._updateInputSelection();
        }, 0);
        if (_this.props.onChange) {
          _this.props.onChange(e);
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /* eslint-disable camelcase */
  MaskedInput.prototype.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    };
    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar;
    }
    this.mask = new _inputmaskCore2.default(options);
  };

  /* eslint-disable camelcase */


  MaskedInput.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.mask !== nextProps.mask && this.props.value !== nextProps.mask) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the nextProps value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(nextProps.mask, { value: nextProps.value });
      } else {
        this.mask.setPattern(nextProps.mask, { value: this.mask.getRawValue() });
      }
    } else if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, { value: this.mask.getRawValue() });
    } else if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value);
    }
  };

  /* eslint-disable camelcase */


  MaskedInput.prototype.UNSAFE_componentWillUpdate = function UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this._updatePattern(nextProps);
    }
  };

  MaskedInput.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this._updateInputSelection();
    }
  };

  MaskedInput.prototype._updatePattern = function _updatePattern(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this.input)
    });
  };

  MaskedInput.prototype._updateMaskSelection = function _updateMaskSelection() {
    this.mask.selection = getSelection(this.input);
  };

  MaskedInput.prototype._updateInputSelection = function _updateInputSelection() {
    setSelection(this.input, this.mask.selection);
  };

  MaskedInput.prototype._getDisplayValue = function _getDisplayValue() {
    var value = this.mask.getValue();
    return value === this.mask.emptyValue ? '' : value;
  };

  MaskedInput.prototype._keyPressPropName = function _keyPressPropName() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent.match(/Android/i) ? 'onBeforeInput' : 'onKeyPress';
    }
    return 'onKeyPress';
  };

  MaskedInput.prototype._getEventHandlers = function _getEventHandlers() {
    var _ref;

    return _ref = {
      onChange: this._onChange,
      onKeyDown: this._onKeyDown,
      onPaste: this._onPaste
    }, _ref[this._keyPressPropName()] = this._onKeyPress, _ref;
  };

  MaskedInput.prototype.focus = function focus() {
    this.input.focus();
  };

  MaskedInput.prototype.blur = function blur() {
    this.input.blur();
  };

  MaskedInput.prototype.render = function render() {
    var _this2 = this;

    var ref = function ref(r) {
      _this2.input = r;
    };
    var maxLength = this.mask.pattern.length;
    var value = this._getDisplayValue();
    var eventHandlers = this._getEventHandlers();
    var _props = this.props,
        _props$size = _props.size,
        size = _props$size === undefined ? maxLength : _props$size,
        _props$placeholder = _props.placeholder,
        placeholder = _props$placeholder === undefined ? this.mask.emptyValue : _props$placeholder;

    var _props2 = this.props,
        placeholderChar = _props2.placeholderChar,
        formatCharacters = _props2.formatCharacters,
        cleanedProps = _objectWithoutProperties(_props2, ['placeholderChar', 'formatCharacters']); // eslint-disable-line no-unused-vars


    var inputProps = _extends({}, cleanedProps, eventHandlers, { ref: ref, maxLength: maxLength, value: value, size: size, placeholder: placeholder });
    return _react2.default.createElement('input', inputProps);
  };

  return MaskedInput;
}(_react2.default.Component), _class.defaultProps = {
  value: '' }, _temp2);
MaskedInput.propTypes = process.env.NODE_ENV !== "production" ? {
  mask: _propTypes2.default.string.isRequired,

  formatCharacters: _propTypes2.default.object,
  placeholderChar: _propTypes2.default.string
} : {};
exports.default = MaskedInput;
module.exports = exports['default'];