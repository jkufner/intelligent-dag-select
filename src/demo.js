import React from 'react'
import ReactDOM from 'react-dom'

import {DagSelect} from "./components/DagSelect";
import {TreeSelect} from "./components/TreeSelect";

import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';


function generateItem(optionID, label, childrenSuffixes) {
  let children = childrenSuffixes.map((suffix) => optionID + suffix);
  // Non-tree extras
  children.push("/a/a/a");
  children.push("/b/b/b");
  return {
    "@id": optionID,
    "#label": label,
    "subTerm": children,
  };
}

function generateItems(optionID) {
  const childrenSuffixes = [
    "a/",
    "b/",
    "c/",
    "d/",
    "e/",
    "f/",
  ];
  return childrenSuffixes.map((ch) => generateItem(optionID + ch, optionID + ch, childrenSuffixes));
}

function generateFlatItems(optionID) {
  const children = ["a", "b", "c", "d", "e", "f"];
  return children.map((ch) => ({
    "@id": ch,
    "#label": ch,
    "subTerm": children,
  }));
}

// Highly sophisticated communication interface
function echo(value, delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayTime)
  });
}

function dumpItems(parentID, parentOption, items) {
  console.groupCollapsed("Loading options for option %o", parentID);
  console.log("Parent option:", parentOption);
  console.log("Loaded items and their children:\n" + items.map(i => " » " + i["@id"] + "\n"
    + i.subTerm.map(s => "    → " + s).join("\n") + "\n").join("\n"));
  console.groupEnd();
}

function loadTreeOptions(parentOption) {
  const parentID = parentOption ? parentOption['@id'] : "/";
  let items = generateItems(parentID);
  dumpItems(parentID, parentOption, items);
  return echo(items, parentOption ? 250 : 100); // Do AJAX here
}

function loadFlatOptions(parentOption) {
  const parentID = parentOption ? parentOption['@id'] : "/";
  let items = generateFlatItems(parentID);
  dumpItems(parentID, parentOption, items);
  return echo(items, parentOption ? 250 : 100); // Do AJAX here
}


class TreeDemo extends React.Component {
  render() {
    const selectedOption = this.state && this.state.selectedOption;
    return <section>
      <h2>Tree Select</h2>
      <p>Each node has children of unique IDs.</p>
      <TreeSelect
        valueKey={"@id"}
        labelKey={"#label"}
        childrenKey={"subTerm"}
        isMenuOpen={true}
        expanded={false}
        maxHeight={0.6 * window.screen.height}
        fetchOptions={loadTreeOptions}
        onChange={opt => {
          console.log("Selected option:", opt);
          this.setState({selectedOption: opt["@id"]})
        }}
      />
      <p>Selected option: <code>{selectedOption}</code></p>
    </section>;
  }
}


class DagDemo extends React.Component {
  render() {
    const selectedOption = this.state && this.state.selectedOption;
    return <section>
      <h2>DAG Select</h2>
      <p>The nodes have identical sets of children.</p>
      <DagSelect
        valueKey={"@id"}
        labelKey={"#label"}
        childrenKey={"subTerm"}
        isMenuOpen={true}
        expanded={false}
        maxHeight={0.6 * window.screen.height}
        fetchOptions={loadFlatOptions}
        onChange={opt => {
          console.log("Selected option:", opt);
          this.setState({selectedOption: opt["@id"]})
        }}
      />
      <p>Selected option: <code>{selectedOption}</code></p>
    </section>;
  }
}

ReactDOM.render(
  <React.Fragment>
    <main>
      <TreeDemo/>
      <DagDemo/>
    </main>
    <footer><b>Tip:</b> Check the console.</footer>
  </React.Fragment>
  ,
  document.getElementById('app')
)
;


