import * as Mark from 'mark.js';

window.onload = function() {
    window.alert('loaded');
    let markInstance = new Mark(document.body);

    markInstance.mark('Using');
};
