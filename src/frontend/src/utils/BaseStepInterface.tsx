// This is the base interface defining all the parameters needed by a workflow step component of any type

interface BaseStepInterface {
  stepNumber: string;
  title: string;
  tooltipContent: string;
}

export default BaseStepInterface;
