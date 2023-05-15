import React from 'react';
import DefaultTooltip from 'rc-tooltip';
import { decode } from 'html-entities';
import 'rc-tooltip/assets/bootstrap.css';

type TriggerType = 'hover' | 'click' | 'focus';
type PlacementType =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';
type TooltipProps = {
  shape?: string;
  placement?: PlacementType;
  content: string;
  triggers?: TriggerType[];
};

function Tooltip({
  shape = decode('&#9432;'),
  placement = 'top',
  content,
  triggers = ['hover'],
}: TooltipProps) {
  return (
    <DefaultTooltip
      placement={placement}
      trigger={triggers}
      overlay={<span>{content}</span>}
    >
      <span>{shape}</span>
    </DefaultTooltip>
  );
}

export default Tooltip;
