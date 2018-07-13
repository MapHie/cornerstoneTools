/* eslint no-loop-func: 0 */ // --> OFF
import external from './../externalModules.js';
import baseMouseDragTool from './../base/baseMouseDragTool.js';
// State
import { getToolState } from './../stateManagement/toolState.js';
import toolStyle from '../stateManagement/toolStyle.js';
import toolColors from '../stateManagement/toolColors.js';
// Manipulators
import drawHandles from './../manipulators/drawHandles.js';
// Drawing
import { getNewContext, draw, setShadow, drawLine } from './../util/drawing.js';
import drawLinkedTextBox from './../util/drawLinkedTextBox.js';
import lineSegDistance from './../util/lineSegDistance.js';
import isMouseButtonEnabled from "../util/isMouseButtonEnabled";
import EVENTS from "../events";
import {getToolOptions} from "../toolOptions";
import {wwwc} from "../imageTools/wwwc";

const cornerstone = external.cornerstone;

/**
 * Here we normalize the ww/wc adjustments so the same number of on screen pixels
 * adjusts the same percentage of the dynamic range of the image.  This is needed to
 * provide consistency for the ww/wc tool regardless of the dynamic range (e.g. an 8 bit
 * image will feel the same as a 16 bit image would)
 *
 * @param eventData
 */
function defaultStrategy (eventData) {
  const maxVOI = eventData.image.maxPixelValue * eventData.image.slope + eventData.image.intercept;
  const minVOI = eventData.image.minPixelValue * eventData.image.slope + eventData.image.intercept;
  const imageDynamicRange = maxVOI - minVOI;
  const multiplier = imageDynamicRange / 1024;

  const deltaX = eventData.deltaPoints.page.x * multiplier;
  const deltaY = eventData.deltaPoints.page.y * multiplier;

  eventData.viewport.voi.windowWidth += (deltaX);
  eventData.viewport.voi.windowCenter += (deltaY);
}

export default class extends baseMouseDragTool {
  constructor () {
    super('wwwcMouse');

    this.strategies = {
      default: defaultStrategy
    };

    this.strategy = defaultStrategy;

    this.isAwaitingMouseUp = false;
  }

  mouseDownActivate (evt) {
    console.log('wwwcMouse mouseDown');
    const eventData = evt.detail;
    const element = eventData.element;

    this.isAwaitingMouseUp = true;
  }

  mouseMove (evt) {
    console.log('wwwcMouse mouseMove');
    if (!this.isAwaitingMouseUp) {
      return;
    }

    const eventData = evt.detail;
    const element = eventData.element;

    this.strategy(eventData);
    external.cornerstone.setViewport(eventData.element, eventData.viewport);
  }

  mouseUp (evt) {
    this.isAwaitingMouseUp = false
  }
}
