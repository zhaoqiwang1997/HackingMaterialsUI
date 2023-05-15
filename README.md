# Hacking Materials UI

This is the development space for the Hacking Materials UI project, which is an industry partnership project being conducted by three student teams as part of COMP90082 Software Project at the University of Melbourne.

For details on the project and design documentation, please refer to our Confluence pages of the three teams at:

  - [Team RedBack](https://confluence.cis.unimelb.edu.au:8443/display/COMP900822022SM2HARedBack/Home)
  - [Team BoxJelly](https://confluence.cis.unimelb.edu.au:8443/display/COMP900822022SM2HABoxJelly/Home)
  - [Team BlueRing](https://confluence.cis.unimelb.edu.au:8443/display/COMP900822022SM2HABlueRing/Home)

## Repository Structure

If you are a new developer trying to understand the project, we recommend starting by reading the handover documentation under `docs/HA-2022-handover.pdf`.

| Folder       | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| data-samples | Sample data to use in developing and testing the application    |
| docs         | Documentation of the project requirements and design            |
| prototypes   | Low- and High- fidelity prototypes of the user interface design |
| src          | Source code                                                     |
| tests        | Unit, Functional, and Integration tests                         |
| ui           | Resources required by the user interface and prototypes         |


## Development Practices

All three teams have agreed to a set of common development practices, which are documented on their Confluence pages.

In brief:

- User stories are primarily documented in Confluence. As part of sprint kickoff, they will be divided into discrete tasks and entered into the team's Trello board.
  - Story acceptance criteria, priority, and size estimate to be reviewed as part of this

- All changes to the GitHub project must go through code review (using GitHub pull requests)
  - All (automated) tests must pass before the PR may be merged
  - At least one representative from each team must approve the PR before it is merged.
  - All test cases and acceptance criteria identified in user story kickoff must be satisfied (and addressed in the PR description)

- We have selected `black` as an auto-formatter for Python source code, and enforce its use using a pre-commit hook.

- Branching structure:
  - In general, we will follow the [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching structure
  - Branches will usually be named `feature/t-<ticket>` for features, where `ticket` is the related Trello card number
  - Scratch or experimental branches will be named `<username>/idea`
  - The main branch is `main`.
- While not enforced, we recommend using a [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) style for authoring commit messages.

- Release management: Releases may be deployed as needed, but binary releases will be generated at the end of each sprint (roughly every four weeks).

## Core technologies

This project mainly uses the following technologies:

- Python + Flask for the back-end of the system
  - Key packages: SQLAlchemy, MatMiner, Pytest
- React for the front-end, with storybooks for UI prototyping and demonstration
- Postgres as a database layer
