import React from 'react'
import ReactDOM from 'react-dom'

import {IntelligentTreeSelect} from './components/IntelligentTreeSelect';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.css';

function generateItem(optionID, label, childrenSuffixes) {
  let children = childrenSuffixes.map((suffix) => optionID + suffix);
  // Non-tree extras
  children.push("http://example.com/a/a/a");
  children.push("http://example.com/b/b/b");
  return {
    "@id": optionID,
    "#label": label + " (" + optionID + ")",
    "subTerm": children,
  };
}

function dataGenerator({searchString, optionID, limit, offset}) {
  console.group("Data Generator:", {searchString, optionID, limit, offset});
  if (!optionID) {
    optionID = "http://example.com/";
  }
  return new Promise((resolve) => {
    const childrenSuffixes = [
      "/a",
      "/b",
      "/c",
      "/d",
      "/e",
      "/f",
    ];
    let items = childrenSuffixes.map((ch) => generateItem(optionID.replace(/\/$/, '') + ch, optionID.replace(/^([^/]*\/){3}/, '') + ch, childrenSuffixes));
    console.log("Items: ", items);
    console.groupEnd();
    resolve(items);
  });
}

ReactDOM.render(
  <IntelligentTreeSelect
        fetchOptions={dataGenerator}
        valueKey={"@id"}
        labelKey={"#label"}
        childrenKey={"subTerm"}
        simpleTreeData={true}
        isMenuOpen={true}
        options={[]}
        displayInfoOnHover={true}
        onOptionCreate={(option) => {console.log('created', option)}}
        maxHeight={0.66 * window.screen.height}
  />,
  document.getElementById('app')
);


