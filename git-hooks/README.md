# What Are These?

Git "hooks" are a way to execute a script when some event happens in a Git repository.

Examples of when you might want to do this include:

- Running a code formatter when code is being committed
- Running unit tests before commits are pushed
- Enforcing a particular format for commit messages
- (et cetera)

# How do I use them?

Git hooks are not committed into the repository by default - they are distributed separately and then used by copying or
linking them into the `.git/hooks` directory.

(incidentally, if you look at that directory you can find a lot of good examples of git hooks).

This directory is a distribution method for git hooks. For the hooks to actually be run though, you'll need to create
a symbolic link from the hooks into the `.git/hooks` directory.

For example, to install the pre-commit hook:

`ln -s ../../git-hooks/pre-commit .git/hooks/pre-commit`
