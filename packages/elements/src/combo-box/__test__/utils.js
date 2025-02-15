import { elementUpdated, nextFrame } from '@refinitiv-ui/test-helpers';

export const snapshotIgnore = {
  ignoreAttributes: ['style', 'class']
};

/**
 * Cross browser function to wait while select element becomes opened/closed and resized
 * @param {Select} el Select
 * @returns {void}
 */
export const openedUpdated = async (el) => {
  await elementUpdated(el);
  await nextFrame();
  await nextFrame(); // IE11 needs a second iframe, otherwise resize observer is not run;
};

export const data = [{
  type: 'header', /* 0 */
  label: 'Countries'
}, {
  value: 'AF', /* 1 */
  label: 'Afghanistan'
}, {
  value: 'AX', /* 2 */
  label: 'Aland Islands'
}, {
  value: 'AL', /* 3 */
  label: 'Albania'
}];

export const getData = (selected = [], disabled = [], readonly = []) => {
  return data.map((item, idx) => Object.assign({}, item, {
    selected: selected.indexOf(idx) !== -1,
    disabled: disabled.indexOf(idx) !== -1,
    readonly: readonly.indexOf(idx) !== -1
  }));
};
