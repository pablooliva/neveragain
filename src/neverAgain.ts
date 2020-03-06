import Mark from 'mark.js';
import { createPopper } from '@popperjs/core';

interface MarkElement {
    elem: HTMLElement,
    popperRef: any
}

interface MarkElementsArray {
    [index: string]: MarkElement
}

window.onload = function() {
    const bd = document.getElementsByTagName('body');
    const markInstance = new Mark(bd[0]);
    const markElements: MarkElementsArray = {};
    let elemIdCount = 0;

    const eachMark = function eachHighlight(elem: HTMLElement) {
        const elemId ='na-highlight-' + elemIdCount;
        elem.id = elemId;
        markElements[elemId] = {elem: elem, popperRef: null};
        elemIdCount++;
    };

    const afterMark = function afterMark() {
        // Add tooltip element
        const tooltipElem = document.createElement('div');
        tooltipElem.appendChild(document.createTextNode('Siemens contributes to climate change.'));
        tooltipElem.classList.add('na-tooltip');
        document.body.appendChild(tooltipElem);
        const link = document.createElement('a');
        link.setAttribute('href','https://never-aga.in/route.php?climate_criminal=Siemens');
        link.innerText = 'Siemens supports the Adani coalmine.';
        link.classList.add('a-block');
        tooltipElem.appendChild(link);
        // Add arrow to tooltip element
        const tooltipArrowElem = document.createElement('div');
        tooltipArrowElem.id = 'na-arrow';
        tooltipArrowElem.setAttribute('data-popper-arrow', '');
        tooltipElem.appendChild(tooltipArrowElem);

        let tooltipInFocus = false;

        const showEvents = ['mouseenter', 'focus'];
        const hideEvents = ['mouseleave', 'blur'];

        function create(elemId: string) {
            tooltipElem.setAttribute('data-na-show', '');
            tooltipElem.setAttribute('data-na-referrer', elemId);
            markElements[elemId].popperRef = createPopper(markElements[elemId].elem, tooltipElem, {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
            });

        }

        function destroy(elemId: string, fromTooltip: boolean = false) {
            if (fromTooltip) {
                destroyCore(elemId);
            } else {
                setTimeout(() => {
                    if (!tooltipInFocus && markElements[elemId].popperRef) {
                        destroyCore(elemId);
                    }
                }, 500);
            }
        }

        function destroyCore(elemId: string) {
            tooltipInFocus = false;
            tooltipElem.removeAttribute('data-na-show');
            tooltipElem.removeAttribute('data-na-referrer');
            markElements[elemId].popperRef.destroy();
            markElements[elemId].popperRef = null;
        }

        showEvents.forEach(showEvent => {
            Object.keys(markElements).forEach(mElemId => {
                markElements[mElemId].elem.addEventListener(showEvent, () => {
                    create(mElemId);
                });
            });

            tooltipElem.addEventListener(showEvent, () => {
                tooltipInFocus = true;
            });

        });

        hideEvents.forEach(hideEvent => {
            Object.keys(markElements).forEach(mElemId => {
                markElements[mElemId].elem.addEventListener(hideEvent, () => {
                    destroy(mElemId);
                });
            });

            tooltipElem.addEventListener(hideEvent, () => {
                destroy(<string>tooltipElem.getAttribute('data-na-referrer'), true);
            });
        });
    };

    markInstance.mark('Siemens', {className: 'na-highlight', each: eachMark, done: afterMark });
};
