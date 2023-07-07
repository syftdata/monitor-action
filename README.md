# Syft Monitor Action

The Syft Monitor Action is a GitHub action designed to analyze a codebase and extract event schemas from existing instrumentation. This action automates the process of extracting schemas and updating the events.yaml file. You can leverage this file to monitor changes, set up alerts, or require special approvals. For more information on code owners, refer to the [codeowners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Getting Started

To get started, create a Github workflow file with the following contents, commit and push to the main branch:

```yaml
on: [pull_request]

jobs:
  syft-analysis:
    permissions: write-all
    runs-on: ubuntu-latest
    name: Syft Event Analysis.
    steps:
      - uses: actions/checkout@v3
        with:
          repository: ${{ github.event.pull_request.head.repo.full_name }}
          ref: ${{ github.event.pull_request.head.ref }}
      - uses: actions/setup-node@v3
        with:
          node-version: "18.x"

      - name: Extract Schema
        uses: syftdata/monitor-action@v0.0.1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Create commit with Schema file
        uses: EndBug/add-and-commit@v9
        with:
          author_name: Syft Analysis Bot
          author_email: syft-analysis@syftdata.com
          message: "Observed changes to the Event schema."
          add: "events.yaml"
```

## Customization

The action provides two optional parameters: `project_directory` and `output_directory`. By default, both parameters point to the root of your project folder.

#### Project Directory

If your project resides in a subfolder within the repository, you can customize the action using the `project_directory` parameter. For example, if your project is located under `packages/todo-app`, use the following code:

```yaml
---
- name: Extract Schema
  uses: syftdata/monitor-action@v0.0.1
  with:
    project_directory: packages/todo-app
```

#### Output Directory

If you prefer to generate the YAML file under a custom artifact folder or a folder that you are already monitoring, you can customize the action using the `output_directory` parameter.

For instance, If you want the artifact to be placed under `artifacts/schemas/`, use the following code:

```yaml
---
- name: Extract Schema
  uses: syftdata/monitor-action@v0.0.1
  with:
    output_directory: artifacts/schemas/
```

## Monitoring

To monitor the events.yaml file generated under the output_directory (by default, it is generated in the top folder), add a CODEOWNERS file.

## Supported

Syft Monitor Action supports the following libraries:

- Amplitude
- Segment
- Mixpanel
- Google Analytics

## Contributing

To contribute to Syft Monitor Action, follow the steps below:

### Install Dependencies

`npm i -g @vercel/ncc`
`npm i`

### Build

`ncc build index.js --license licenses.txt`

### Release

create a new branch and push.
