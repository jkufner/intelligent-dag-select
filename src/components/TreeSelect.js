import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import ExpandableTreeSelect from "./ExpandableTreeSelect";
import {VirtualizedTreeSelect} from "./VirtualizedTreeSelect";

export default class TreeSelect extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      options: this.props.options,
      update: 0,
    }
  }

  _loadOptions(parentOption) {
    if (!this.props.loadOptions) {
      return;
    }
    const newOpts = this.props.loadOptions(parentOption ? parentOption.option : undefined);
    if (newOpts instanceof Promise) {
      newOpts.then(no => this._addNewOptions(this._processNewOptions(parentOption, no)));
    } else {
      this._addNewOptions(this._processNewOptions(parentOption, newOpts));
    }
    return newOpts;
  }

  _processNewOptions(parentOption, newOptions) {
    const {valueKey, labelKey, childrenKey} = this.props;
    return newOptions.map(opt => ({
      value: opt[valueKey],
      label: opt[labelKey],
      children: opt[childrenKey],
      option: opt,
    }));
  }

  _addNewOptions(newOptions) {
    this.setState({
      options: this.state.options ? [...this.state.options, ...newOptions] : newOptions,
      update: this.state.update + 1,
    });
  }

  componentDidMount() {
    this._loadOptions(undefined);
  }

  _onChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value.option);
    }
  }

  render() {
    return <ExpandableTreeSelect
      {...this.props}
      onFirstExpand={(parentOption) => this._loadOptions(parentOption)}
      options={this.state.options}
      update={this.state.update}
      valueKey="value"
      labelKey="label"
      childrenKey="children"
      onChange={v => this._onChange(v)}
    />
  }
}

TreeSelect.propTypes = {
  ...VirtualizedTreeSelect.propTypes, // We don't want to export the expand mechanism of ExpandableTreeSelect.
  loadOptions: PropTypes.func,  // Returns list of new options or a Promise of the new options
};

TreeSelect.defaultProps = {
  ...VirtualizedTreeSelect.defaultProps,
  loadOptions: undefined,
};
