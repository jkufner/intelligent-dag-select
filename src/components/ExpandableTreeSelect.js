import React, {Component} from 'react';
import {VirtualizedTreeSelect} from "./VirtualizedTreeSelect";
import PropTypes from "prop-types";
import {ToggleMinusIcon, TogglePlusIcon} from "./Icons";

export class ExpandableTreeSelect extends Component {

  onExpandButton(option) {
    // FIXME: This is very ugly; we should update the VirtualizedTreeSelect's state properly.
    if (option.expanded) {
      option.expanded = false;
    } else {
      option.expanded = true;
      if (this.props.onFirstExpand && !option.expandedPreviously) {
        const p = this.props.onFirstExpand(option);
        if (p instanceof Promise) {
          option.expanding = true;
          p.then(() => {
            option.expanding = false;
            option.expandedPreviously = true;
            this.forceUpdate();
          }, () => {
            option.expanding = false;
            this.forceUpdate();
          });
        } else {
          option.expandedPreviously = true;
        }
      }
    }
    this.forceUpdate();
  }

  _optionInnerRenderer(option, label, vtsOptionRendererArgs) {
    const widgets = this._optionWidgetsRenderer({label}, option);
    if (this.props.optionRenderer) {
      return this.props.optionRenderer(option, widgets, vtsOptionRendererArgs);
    } else {
      return this._optionDefaultInnerRenderer(option, widgets);
    }
  }

  _optionDefaultInnerRenderer(option, widgets) {
    return <React.Fragment>
      {widgets.expandButton}
      {widgets.label}
      {widgets.busyIndicator}
    </React.Fragment>;
  }

  _optionWidgetsRenderer(widgets, option) {
    if (option.children.length === 0) {
      widgets.expandButton = null;
    } else {
      widgets.expandButton = <button className="toggleButton" onClick={() => this.onExpandButton(option)}>
          {option.expanded ? <ToggleMinusIcon/> : <TogglePlusIcon/>}
        </button>;
    }

    if (option.expanding) {
      widgets.busyIndicator = <span className="Select-loading-zone" aria-hidden="true" style={{paddingLeft: '0.5em', width: '2em', display: 'inline'}}>
          <span className="Select-loading"/>
        </span>;
    } else {
      widgets.busyIndicator = null;
    }

    return widgets;
  }

  render() {
    return <VirtualizedTreeSelect
      optionInnerRenderer={(option, label, args) => this._optionInnerRenderer(option, label, args)}
      {...this.props}
    />
  }
}

ExpandableTreeSelect.propTypes = {
  ...VirtualizedTreeSelect.propTypes,
  onFirstExpand: PropTypes.func,  // May return a promise that will trigger a bussy indicator
  optionRenderer: PropTypes.func,
};

ExpandableTreeSelect.defaultProps = {
  ...VirtualizedTreeSelect.defaultProps,
  onFirstExpand: undefined,
  optionRenderer: undefined,
};
