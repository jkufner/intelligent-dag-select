import React, {Component} from 'react';
import {VirtualizedTreeSelect} from "./VirtualizedTreeSelect";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {ToggleMinusIcon, TogglePlusIcon} from "./Icons";

export default class ExpandableTreeSelect extends Component {

  onExpandButton(option, addOptions) {
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

  optionInnerRenderer(option, label, args, props, addOptions) {
    if (option[props.childrenKey].length === 0) {
      return label;
    } else {
      return <React.Fragment>
        <button className="toggleButton" onClick={() => this.onExpandButton(option, addOptions)}>
          {option.expanded ? <ToggleMinusIcon/> : <TogglePlusIcon/>}
        </button>
        {label}
        {option.expanding ?
          <span className="Select-loading-zone" aria-hidden="true"
                style={{paddingLeft: '0.5em', width: '2em', display: 'inline'}}>
            <span className="Select-loading"/>
          </span> : undefined}
      </React.Fragment>;
    }
  }

  render() {
    return <VirtualizedTreeSelect
      optionInnerRenderer={(...args) => this.optionInnerRenderer(...args)}
      {...this.props}
    />
  }
}

ExpandableTreeSelect.propTypes = {
  ...VirtualizedTreeSelect.propTypes,
  onFirstExpand: PropTypes.func,  // May return a promise that will trigger a bussy indicator
};

ExpandableTreeSelect.defaultProps = {
  ...VirtualizedTreeSelect.defaultProps,
  onFirstExpand: undefined,
};
