// This object is the source of truth for all step keys and the default initial values for each step.
// Do not define these values anywhere else, but instead define them below then import this object
//  wherever you need to use the data.

export const STEPS_DATA = {
  DatasetSelection: {
    number: '1.1',
    initialValue: '',
  },
  ColumnSelection: {
    number: '1.2',
    initialValue: '',
  },
  FeaturizerSelection: {
    number: '1.3',
    initialValue: '',
  },
  MLModelSelction: {
    number: '2.1',
    initialValue: '',
  },
  PredictingColumnSelection: {
    number: '2.2',
    initialValue: '',
  },
  XAxisSelection: {
    number: '3.1',
    initialValue: '',
  },
  YAxisSelection: {
    number: '3.2',
    initialValue: '',
  },
  ScatterPlot: {
    number: '3.3',
    initialValue: '',
  },
  RegLineType: {
    number: '3.4',
    initialValue: '',
  },
  RegLinePlot: {
    number: '3.5',
    initialValue: '',
  },
  HistPlot: {
    number: '3.6',
    initialValue: '',
  },
};
