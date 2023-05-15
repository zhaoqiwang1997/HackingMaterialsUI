# Guide: Managing Workflow Steps & Stages

## Managing Workflow Stages
- Required steps and execution endpoints for each stage are defined in the `STAGES_DATA` object in the file `src/sections/appBody/inputPanel/data.tsx`.
- If you update the stage numbers or names, don't forget to update the stage tracker in `src/components/stageProgressTracker/index.tsx`.
- The `currentStage` state is managed in `src/sections/appBody/index.tsx` and is handed in to the inputPanel and outputWindow.

## Managing Workflow Steps
### Adding a new workflow step
1. Add a new entry with a unique key to the `STEPS_DATA` object in `src/steps/data.tsx`. The `number` field should also be unique, and the first digit refers to the Stage in which this step will be shown.
2. Create a new folder under the `src/steps/` directory with the files for your new step.
3. Create your new step in the `index.tsx` file inside your new directory, keeping in mind the following notes:
   - The step should be of one of the reusable step type components (`DropdownSelectStepType`, `ButtonStepType`, etc). This means that the return of your new step component should be an instance of one of those types, with their props configured to reflect your requirements. 
   - The step type component accepts a `stepKey` prop, which should be the step number from the `STEPS_DATA` object. E.g.:
       ```
       const stepKey = STEPS_DATA.YourUniqueStepKeyHere.number;
       ...
       return (
         <DropdownSelectStepType
           stepNumber={stepKey}
           ...
         />
       );
       ```]
   - The `stepKey` const should also be used when adding output items so that the output is shown under the correct heading.
   - You can user the existing step components inside the `src/steps/` directory as examples.
4. Export your step component in the `src/steps/index.tsx` file.
5. Under the directory `src/sections/appBody/inputPanel/workflowStages`, find the stage in which you want to show your new step and in the approperiate file, import your new step from `'../../../../steps'` and add it in the correct placement.


### Reordering workflow steps
1. Update the `number` fields or the affected steps in the `STEPS_DATA` object in the `src/sections/appBody/inputPanel/data.tsx` file.
2. Under the directory `src/sections/appBody/inputPanel/workflowStages`, find the affected stage file and reorder the step components as required.

### Deleting a workflow step
1. Under the directory `src/sections/appBody/inputPanel/workflowStages`, find the correct stage file and remove the required step component from the as well as its import.
2. Delete the step component export from the `src/steps/index.tsx` file.
3. Delete the step entry from the `STEPS_DATA` object in `src/steps/data.tsx`.
4. Delete the step directory from the `src/steps/` directory. 
