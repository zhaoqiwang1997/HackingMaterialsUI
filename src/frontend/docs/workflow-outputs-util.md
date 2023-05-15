# Guide: Workflow Outputs Util

## Background
The workflow outputs util refers to the `WorkflowOutputsContext`, along with its provider and hook, defined in the `src\frontend\src\utils\WorkflowOutputsContext\index.tsx` file. 

The context is essentially a state that is saved independantly, so multiple components can access the stored values in real-time without having to pass props from parents. For more information on React Contexts, see the official [guide](https://reactjs.org/docs/hooks-reference.html#usecontext).

For `WorkflowOutputsContext`, the object stored in the context is in the following format:
```
{
  'globalOutputs': {
    [output_key]: <some output items>,
    ...repeat for each output item
  },
  [step_number]: {
    [output_key]: <some output items>,
    ...repeat for each output item
  },
  ...repeat for each step
}
```

The purpose of this context is to have all the outputs saved in one place and under unique keys so that each component can add a new output item without changing the outputs of other components.

---

## Using WorkflowOutputsContext
To use the context values or functions, use the hook as follows:
``` 
const { workflowOutputs, addCustomOutput, ... } = useWorkflowOutputs();
```

The context provider currently wraps all the contents of the `Homepage` component (`src\frontend\src\pages\homepage\index.tsx`), so all components inside `Homepage` or its children have access to the context functions listed below. If a different component outside this tree needs to access the values in the future, move the context provider to the closest shared parent.

### `workflowOutputs` object
This is a read-only object in the shape defined above. To get the outputs for a specific step, you can do `workflowOutputs.<step_number>`. This will return an object with unique keys mapped to the output items for that step. To get outputs not specific to a step, replace the step_number with the string 'globalOutputs'.

Currently, the `outputWindow` component automatically renders the stored output items on each update. It will also automatically print global items at the top of the page and step output items in the correct order.

### `addTextOutput` function
This function adds a `TextWorkflowOutput` component with the provided text or ReactNode content as an output in the group specified by the `stepKey` parameter (To see what the `TextWorkflowOutput` component looks like you can run the storybook). If no `stepKey` is provided, it adds the content to the global outputs group by default. To add new items, use a new unique `outputKey`. To override or update an existing item, add new content with the same `outputKey`.


### `addCustomOutput` function
Similar to `addTextOutput` but does not wrap the output with the `TextWorkflowOutput` component.

### `removeOutputItem` function
This function clears a single output item specified by an `outputKey` and `stepKey`. If no `stepKey` is provided, it looks for the `ouputKey` in the global outputs group by default.

### `clearOutputsGroup` function
This function clears all the outputs for the step specified by the `stepKey`. If no `stepKey` is provided, it clears all the global outputs by default.

### `clearAllOutputs` function
This function removes all the outputs from the output window.
