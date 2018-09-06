warmd
=====

[![Build Status](https://travis-ci.org/wrct883/warmd.svg?branch=master)](https://travis-ci.org/wrct883/warmd)

WRCT: A Radio Music Database


Overview
--------
The current database system at WRCT is a collection of perl scripts held together by duct tape, shoelaces, and the prayers of tiny children.
We aim to fix that.


Installation
------------

To get started developing, do these things

1. Get [node.js](http://nodejs.org/)
2. Get [n](https://github.com/tj/n) and use it to switch to Node version 6.x
3. Get [MongoDB](https://www.mongodb.com/)
4. Clone the repo: ```git clone https://github.com/wrct883/warmd.git```
5. ```npm install``` to install node dependencies

Workflow
--------

The [development guide](https://paper.dropbox.com/doc/WRCT-A-Radio-Music-Database-Development-Guide--ALy4LlsC_G99jZT_lQVTDxD~AQ-FfIvW2bQsLwXXFv1uGk5s) will have more detail on this, but here's an abridged version of the process you should follow:

1. Choose an Issue from the [list of 'Todo' issues](https://github.com/wrct883/warmd/projects/1) that you want to work on
2. Create a branch with the number of that Issue. For example, if you're trying to solve Issue #42, make your branch name "WARMD-42"
  * Don't forget to [assign the Issue that you're working on to yourself](https://help.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users/)!
3. Develop! Push all changes to your branch
4. Once you're done, open a Pull Request against master and tag someone to review (when in doubt, you can always tag 'malexandert')
5. Once your PR is approved, it'll be merged into master, and then you can start work on another Issue


Testing
-------
You can run the test suite using `npm test`. The testing framework that we use is [Mocha](https://mochajs.org/), and by default, this will run all of the tests in `tests/integration` and `tests/unit`. If you want to run a single test or a single test suite, or maybe you want to run everything _except_ a few tests, you can [include](https://mochajs.org/#inclusive-tests) or [exclude](https://mochajs.org/#exclusive-tests) tests using Mocha.
