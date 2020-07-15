/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { changeView, changeSlider } from '../actions/actions';

/**
 * @template ActionProps Props for the action component
 */

interface ActionProps {
  key: string;
  selected: boolean;
  last: boolean;
  index: number;
  sliderIndex: number;
  dispatch: (a:any) => void;
  displayName: string;
  componentName: string;
  componentData: {actualDuration: number}|undefined;
  state?: Record<string, unknown>;
  viewIndex: number;
  handleOnkeyDown: (e: any, i: number) => void;
}

/**
 * @function Action
 * @param selected : The selected action in the array of state changes
 * @param displayName : Label showing sequence number of state change, reflects changes in Chart.tsx
 * @param componentName : Displays the name of compenent's state being changed
 * @param last : The last index in the array
 * @param sliderIndex: Index of the slider in the array of state changes
 * (clicking the block changes the slider, related to MainSlider.tsx slider)
 * @param componentData: Displays react fiber data
 * @param viewIndex:  Index of the tab in the array when timejump is made
 * @method dispatch Executes actions that changes state in reactime
 * @method handleOnkeyDown Executes key commands
 *
 */
// index and delta props were removed from Action.jsx  */
// viewIndex and handleonkeyDown added to props
const Action = (props: ActionProps): unknown => {
  const {
    selected, last, index, sliderIndex, dispatch, displayName, componentName,
    componentData, viewIndex, handleOnkeyDown,
  } = props;

  /**
   * @function cleanTime: Displays render times for state changes
   * @returns render display time in seconds in miliseconds
   */
  const cleanTime = () => {
    if (!componentData || !componentData.actualDuration) {
      return 'NO TIME';
    }
    let seconds:number| string;
    let miliseconds: any = componentData.actualDuration;
    if (Math.floor(componentData.actualDuration) > 60) {
      seconds = Math.floor(componentData.actualDuration / 60);
      seconds = JSON.stringify(seconds);
      if (seconds.length < 2) {
        seconds = '0'.concat(seconds);
      }
      miliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      seconds = '00';
    }
    miliseconds = Number.parseFloat(miliseconds).toFixed(2);
    const arrayMiliseconds = miliseconds.split('.');
    if (arrayMiliseconds[0].length < 2) {
      arrayMiliseconds[0] = '0'.concat(arrayMiliseconds[0]);
    }
    if (index === 0) {
      return `${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
    }
    return `+${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
  };
  const displayTime = cleanTime();

  return (
    <div
      // Invoking keyboard functionality; functionality is in ActionContainer;
      onKeyDown={(e:string) => handleOnkeyDown(e, viewIndex)}
      className={selected || last ? 'action-component selected' : 'action-component'}
      onClick={() => {
        dispatch(changeView(index));
      }}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
      tabIndex={index}
    >
      <div className="action-component-text">
        {`${displayName}:  ${componentName !== 'nameless' ? componentName : ''} `}
      </div>
      <button
        className="time-button"
        type="button"
      >
        {displayTime}
      </button>
      <button
        className="jump-button"
        onClick={(e: any): void => {
          e.stopPropagation();
          dispatch(changeSlider(index));
          dispatch(changeView(index));
        }}
        tabIndex={index}
        type="button"
      >
        Jump
      </button>
    </div>
  );
};

export default Action;
