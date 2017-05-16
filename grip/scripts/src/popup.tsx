
import "jquery";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import "../../styles/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Popup } from "./components/popup/popup";


ReactDOM.render(
	<Popup />,
	document.getElementById("app")
);
