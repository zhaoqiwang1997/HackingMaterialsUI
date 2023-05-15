# Guide: Workflow Inputs Util

## Background
The workflow inputs util refers to the `WorkflowInputsContext`, along with its provider and hook, defined in the `src/utils/WorkflowInputsContext.tsx` file. 

The context is essentially a state that is saved independantly, so multiple components can access the stored values in real-time without having to pass props from parents. For more information on React Contexts, see the official [guide](https://reactjs.org/docs/hooks-reference.html#usecontext).

For `WorkflowInputsContext`, the object stored in the context is in the following format:
```
{
  [step_number]: {
    value: <saved or initial value>,
    outdatedStatus: <true if the value was changed without clicking Save, false otherwise>
  },
  ...repeat for each step
}
```
The object is initiated automatically based on the step numbers and initial values in the `STEPS_DATA` object in the `src/steps/data.tsx` file.

The purpose of this context is to have all the user workflow inputs saved in one place, which allows us the following benefits:
- Step components and other components (e.g. Stage Execution button) with dependencies on the inputs of other steps can access those values with needing props handed down from the parents.
- Because the selections of each step are not saved inside the step component itself, the inputted values can still be displayed correctly when the step component is re-rendered (result: if the user saved inputs then navigates to the next stage then navigates back, the inputs are not deleted).
- While loading saved workflows is not currently supported, in the future, adding this feature would be much easier because all the frontend has to do is initiate this context with the saved `inputValues` instead of empty initial values. 

---

## Using WorkflowInputsContext
To use the context values or functions, use the hook as follows:
``` 
const { inputValues, setStepInputValue, ... } = useWorkflowInputs();
```

The context provider currently wraps all the contents of the `inputPanel` component (`src/sections/appBody/inputPanel/index.tsx`), so all components inside `inputPanel` or its children have access to the context functions listed below. If a different component outside this tree needs to access the values in the future, move the context provider to the closest shared parent.

### `inputValues` object
This is a read-only object in the shape defined above. To get the stored value for a specific step, you can do `inputValues.<step_number>.value`.

### `setStepInputValue` function
This is a helper function to update the value of any specific step. This should only be called when the user clicks Save for a the step, and not on every input change. The function can be used like `setStepInputValue(stepNumber, newValue)`. Note that the `DropdownStepType` component automatically does this for all steps that use it. 

### `setStepOutdatedStatus` function
This is a helper function to update the outdatedStatus field of any specific step. This should be called with `true` whenever the user clicks updates a step's input, and with `false` whenever the user saves the changes for that step. The function can be used like `setStepOutdatedStatus(stepNumber, newBoolean)`. Note that the `DropdownStepType` component automatically does this for all steps that use it. 