import Mark from 'mark.js';
import { createPopper } from '@popperjs/core';

interface MarkElement {
    elem: HTMLElement,
    popperRef: any
}

interface MarkElementsArray {
    [index: string]: MarkElement
}

class NeverAgain {
    private markInstance: Mark;
    public static markElements: MarkElementsArray;
    public static tooltipInFocus: boolean;
    public static elemIdCount: number;

    constructor() {
        const bd: HTMLCollectionOf<HTMLElementTagNameMap['body']> = document.getElementsByTagName('body');
        this.markInstance = new Mark(bd[0]);
        NeverAgain.markElements = {};
        NeverAgain.elemIdCount = 0;
        NeverAgain.tooltipInFocus = false;
    }

    public markAll(): void {
        this.markInstance.mark('Siemens', {className: 'na-highlight', each: NeverAgain.eachMark, done: NeverAgain.afterMark });
    }

    public static eachMark(elem: HTMLElement): void {
        const elemId ='na-highlight-' + NeverAgain.elemIdCount;
        elem.id = elemId;
        NeverAgain.markElements[elemId] = {elem: elem, popperRef: null};
        NeverAgain.elemIdCount++;
    };

    public static afterMark(): void {
        // Add tooltip element
        const tooltipElem: HTMLElement = document.createElement('div');
        tooltipElem.appendChild(document.createTextNode('Siemens contributes to climate change.'));
        tooltipElem.classList.add('na-tooltip');
        document.body.appendChild(tooltipElem);
        const link: HTMLElement = document.createElement('a');
        link.setAttribute('href','https://never-aga.in/route.php?climate_criminal=Siemens');
        link.innerText = 'Siemens supports the Adani coalmine.';
        link.classList.add('a-block');
        tooltipElem.appendChild(link);
        // Add arrow to tooltip element
        const tooltipArrowElem: HTMLElement = document.createElement('div');
        tooltipArrowElem.id = 'na-arrow';
        tooltipArrowElem.setAttribute('data-popper-arrow', '');
        tooltipElem.appendChild(tooltipArrowElem);

        NeverAgain.tooltipInFocus = false;

        const showEvents: string[] = ['mouseenter', 'focus'];
        const hideEvents: string[] = ['mouseleave', 'blur'];

        showEvents.forEach(showEvent => {
            Object.keys(NeverAgain.markElements).forEach(mElemId => {
                NeverAgain.markElements[mElemId].elem.addEventListener(showEvent, () => {
                    NeverAgain.create(mElemId, tooltipElem);
                });
            });

            tooltipElem.addEventListener(showEvent, () => {
                NeverAgain.tooltipInFocus = true;
            });

        });

        hideEvents.forEach(hideEvent => {
            Object.keys(NeverAgain.markElements).forEach(mElemId => {
                NeverAgain.markElements[mElemId].elem.addEventListener(hideEvent, () => {
                    NeverAgain.destroy(mElemId, tooltipElem);
                });
            });

            tooltipElem.addEventListener(hideEvent, () => {
                NeverAgain.destroy(<string>tooltipElem.getAttribute('data-na-referrer'), tooltipElem, true);
            });
        });
    };

    public static create(elemId: string, tooltipElem: HTMLElement) {
        tooltipElem.setAttribute('data-na-show', '');
        tooltipElem.setAttribute('data-na-referrer', elemId);
        NeverAgain.markElements[elemId].popperRef = createPopper(NeverAgain.markElements[elemId].elem, tooltipElem, {
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

    public static destroy(elemId: string, tooltipElem: HTMLElement, fromTooltip: boolean = false) {
        if (fromTooltip) {
            NeverAgain.destroyCore(elemId, tooltipElem);
        } else {
            setTimeout(() => {
                if (!NeverAgain.tooltipInFocus && NeverAgain.markElements[elemId].popperRef) {
                    NeverAgain.destroyCore(elemId, tooltipElem);
                }
            }, 500);
        }
    }

    public static destroyCore(elemId: string, tooltipElem: HTMLElement) {
        NeverAgain.tooltipInFocus = false;
        tooltipElem.removeAttribute('data-na-show');
        tooltipElem.removeAttribute('data-na-referrer');
        NeverAgain.markElements[elemId].popperRef.destroy();
        NeverAgain.markElements[elemId].popperRef = null;
    }
}

window.onload = function() {
    const neverAgain = new NeverAgain();
    neverAgain.markAll();
};
