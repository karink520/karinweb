var bFlagExplanation = "-b is a flag that makes git construct a new branch.  Omit it if a branch with this name already exists.";
var mFlagExplanation = "-m is a flag for attaching a message to your commit.  Always include a message.";
var uFlagExplanation = "-u is a flag that adds the branch as a remote tracking branch, so that the remote repository has \
a branch connected with your branch.  This is called setting the upstream remote branch. You only need to use `-u` once, and the association will be set up for future uses of `git push` and `git pull` without parameters."
var masterExplanation = "`master` is the name of a branch.  We assume that it is the branch that contains the best and most stable version of the code. \
We want to avoid changing the master branch until we have something worthwhile to add, which is why we check out a separate branch to work on, and combine that work back in later. \
Master is the default name, but you might have changed the name of this special branch to something else.";
var originExplanation = "`origin` is the short name for the remote repository.  \
The name `origin` is conventional and so it is what we'll use as an example throughout. We'll also assume you only have one remote repository for the code at hand. \
However, you could name the remote repository something besides `origin`, or have more than one remote repository, each with a different name. \
To see the short names for all of your remote repositories and the repositories to which they correspond, type `git remote -v`.";
var  mybranchnameExplanation = "Choose a short name that is descriptive enough to give some indication of what feature you are working on."
var commitMessageExplanation = "Write a message describing the changes you made since the last commit.  If you find yourself trying to describe tons of \
disparate changes, consider that you may want to commit more often. Note that if you type `git commit` by itself, you will access an editor; you may \
appreciate this option if you want to write a longer commit message."

var gitCheckoutBranchExplanation = "Use this version if you have already created the branch you want to use.";

var gitCommitExplanation = "`git commit` is used to save a set of changes you have made.  Before you commit, you'll need to use `git add` to \
add each file whose changes you want to save with a commit.  A `git commit` applies to the specific branch you are on. It is also a local operation; it does not change anything in your remote repository.";

var gitStatusExplanation = "`git status` shows helpful information such as what branch you are on, and the status of each file as staged (has changes that will be included in the next commit), unstaged (has changes that are not yet set to be included in the next commit) and untracked (not included in the repository). \
Since `git status` does not change anything about your repository, it is very safe, and you may use it often, especially as you prepare to commit.";

var gitFetchExplanation = "`git fetch` retrieves any updates from the remote repository and downloads them for your consideration and future use. \
It will not change your local repository, so it is a safe command to use.  Contrast `git fetch` with `git pull`; `git pull` combines `git fetch` and `git merge`\
and thus will try to merge any new remote content into your local repository right away, which could cause merge conflicts.";
var gitCheckoutExplanation = "You can `git checkout` files, commits, or branches, but here we're just checking out a branch.  Checking out a branch \
moves you to the branch so that you can work on that branch.  For example, when creating a new features, rather than working directly on the master branch \
it is a good idea to work on a branch specific to the new feature.  So we'll checkout a feature-specific branch before we get to work.";
var gitAddExplanation = "`git add <filename>` stages a file for commit.  If `git status` shows you unstaged files that you have updated, and you want to \
save those updates with a commit, you should `git add` all of the unstaged files.  You can also `git add` untracked files, if you want to start including them in \
your repository.";
var gitPushExplanation = "`git push` uploads local repository content and changes to the remote repository. We use in in the context `git push <remote-name> <current-branch-name>";
var gitMergeExplanation = "`git merge <branch>` merges <branch> into the current branch, so that for example `git merge origin/master' \
will add any updates from the master branch from the remote repository origin into your local repository.  If there are conflicts when you merge, you will \
need to resolve them.";

var rebaseWithGitPullExplanation = "Usually, `git pull` combines `git fetch` and `git merge`.  However, when we use `git pull --rebase` instead of just `git pull`, \
it replaces the merge part of the `git pull` with rebasing. \
A `merge` combines histories together, while `rebase` puts one on top of \
the other sequentially and maintains a linear history for your repository. Depending on the context, a `merge` may also create an additional new commit - a merge commit - while rebasing will not. \
Both merging and rebasing can lead to conflicts that need to be resolved.";
var gitPullExplanation ="`git pull` gets any changes from a remote repository and incorporates them into your local repository.  Generally, it is equivalent to \
`git fetch` followed by `git merge.`";
var gitRebaseExplanation = "`git rebase` can be used as an alternative to `git merge.` A `merge` combines histories together, while `rebase` puts one on top of \
the other sequentially and maintains a linear history for your repository. Depending on the context, a `merge` may also create an additional new commit - a merge commit - while rebasing will not. \
Both merging and rebasing can lead to conflicts that need to be resolved.";
var gitStashExplanation = "`git stash` tucks away any changes since your last commit for future use.  It is a local operation that does not interact with \
the remote repository.  It is useful if you want to temporarily save your changes, do a few git operations, and then add your changes back in.";
var gitStashPopExplanation = "`git stash pop` retrieves the most recent set of changes that you stashed and applies them to whatever branch you are currently \
working on locally.";

$('.git-stash-pop').attr('title', gitStashPopExplanation);
$('.git-stash').attr('title', gitStashExplanation);
$('.git-rebase').attr('title',gitRebaseExplanation);
$('.git-pull').attr('title', gitPullExplanation);
$('.rebase-with-git-pull').attr('title', rebaseWithGitPullExplanation)

$('.bflag').attr('title', bFlagExplanation);
$('.mflag').attr('title', mFlagExplanation);
$('.uflag').attr('title', uFlagExplanation);
$('.master').attr('title', masterExplanation);
$('.origin').attr('title', originExplanation);
$('.mybranchname').attr('title', mybranchnameExplanation);
$('.commit-message').attr('title', commitMessageExplanation);

$('.git-checkout-branch').attr('title',gitCheckoutBranchExplanation);
$('.git-status').attr('title', gitStatusExplanation);
$('.git-commit').attr('title', gitCommitExplanation);
$('.git-add').attr('title', gitAddExplanation);
$('.git-fetch').attr('title', gitFetchExplanation);
$('.git-checkout').attr('title', gitCheckoutExplanation);
$('.git-merge').attr('title', gitMergeExplanation);
$('.git-push').attr('title', gitPushExplanation);

$( document ).tooltip();
