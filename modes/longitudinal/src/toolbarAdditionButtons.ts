// TODO: torn, can either bake this here; or have to create a whole new button type
// Only ways that you can pass in a custom React component for render :l
import type { Button } from '@ohif/core/types';
import { showAdditionToolbar } from './showAdditionToolbar';

const toolGroupIds = ['default', 'mpr', 'SRToolGroup'];

/**
 * Creates an array of 'setToolActive' commands for the given toolName - one for
 * each toolGroupId specified in toolGroupIds.
 * @param {string} toolName
 * @returns {Array} an array of 'setToolActive' commands
 */
function _createSetToolActiveCommands(toolName) {
  const temp = toolGroupIds.map(toolGroupId => ({
    commandName: 'setToolActive',
    commandOptions: {
      toolGroupId,
      toolName,
      additional: () => showAdditionToolbar(),
    },
    context: 'CORNERSTONE',
  }));
  return temp;
}

const toolbarAdditionButtons: Button[] = [
  // 移动
  {
    id: 'ScalePan',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-move',
      label: 'Pan',
      commands: _createSetToolActiveCommands('Pan'),
    },
  },
  {
    id: 'ScaleUp',
    type: 'ohif.action',
    props: {
      type: 'tool',
      icon: 'tool-zoom-up',
      label: 'Scale Up View',
      commands: [
        {
          commandName: 'scaleUpViewport',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
        ..._createSetToolActiveCommands('Zoom'),
      ],
    },
  },
  {
    id: 'scaleDown',
    type: 'ohif.action',
    props: {
      type: 'tool',
      icon: 'tool-zoom-down',
      label: 'Scale Down View',
      commands: [
        {
          commandName: 'scaleDownViewport',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
        ..._createSetToolActiveCommands('Zoom'),
      ],
    },
  },
  // 刷新
  {
    id: 'Reset',
    type: 'ohif.action',
    props: {
      type: 'action',
      icon: 'tool-reset',
      label: 'Reset View',
      commands: [
        {
          commandName: 'resetViewport',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
        {
          commandName: 'deleteMeasurement',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
        {
          commandName: 'cleanUpCrosshairs',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
      ],
    },
  },
];

export default toolbarAdditionButtons;
