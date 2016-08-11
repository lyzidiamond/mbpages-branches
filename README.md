# mbpages-branches

A script that traverses your GitHub organization and lists which repos have the specified branch.

## Setup

- In your GitHub settings, go to the **Personal access tokens** page and generate a new token with `repo`, `admin:org`, and `gist` scopes
- Copy the token once it's created -- you won't be able to see it again once you leave the page
- Clone this repo
- Navigate to this repo in Terminal and install the `github` node module
  `npm install github`

## Running the script

`node branches.js <github-username> <github-key> <organization-name> <branchName>`

This will create a list of repos in an array and print it to the console.

## Todo

Ways I'd like to improve this:

- tests
- write to a gist
- figure out how to only write the list when it's done instead of after every addition to the list
