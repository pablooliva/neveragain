"use strict";
window.alert('hola');
Object.defineProperty(exports, "__esModule", { value: true });
var Mark = require("mark.js");
window.onload = function () {
    window.alert('loaded');
    var markInstance = new Mark(document.body);
    markInstance.mark('Using');
};
