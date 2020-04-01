import React from 'react';
import TreeSelect from "./TreeSelect";

export default class DagSelect extends TreeSelect {

  _processNewOptions(parentOption, newOptions) {
    const {valueKey, labelKey, childrenKey} = this.props;
    const pId = parentOption ? parentOption.value : "";

    return newOptions.map(opt => {
      const value = opt[valueKey];
      const label = opt[labelKey];
      const children = opt[childrenKey] || [];

      const nId = pId === "" ? value : pId + " " + value;
      return {
        value: nId,
        label: label,
        children: children ? children.map(s => nId + " " + s) : [],
        option: opt,
      };
    });
  }

}

