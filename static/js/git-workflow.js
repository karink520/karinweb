var bFlagExplanation = "-b is a flag that indicates that git should make new branch if a branch with this name does not already exist";
var mFlagExplanation = "-m is a flag for attaching a message to your commit.  Always include a message.";
var masterExplanation = "master is the name of a branch.  We assume that it is the branch that contains the best and most stable version of the code.\
We want to avoid changing the master branch until we have something worthwhile to add, which is why we check out a separate branch to work on, and combine that work back in later. \
Master is the default name, but you might have changed the name of this special branch to something else.";
var originExplanation = "origin is the short name for the remote repository.  \
The name of origin is conventional and so it is what we'll use as an example throughout. We'll also assume you only have one remote repository for the code at hand. \
However, you could name the remote repository something besides origin, or have more than one remote repository, each with a different name. \
To see the short names for all of your remote repositories and the repositories to which they correspond, type 'git remote -v'";
var  mybranchnameExplanation = "Choose a short name that is descriptive enough to give some indication of what feature you are working on."
var commitMessageExplanation = "Write a message describing the changes you made."

var gitCommitExplanation = "`git commit` is used to save a set of changes you have made.  Before you commit, you'll need to use `git add` to \
add each file whose changes you want to save with a commit.  Using `git commit` commits to the branch you are on. It is also a local - it does not change anything in your remote repository.";

var gitStatusExplanation = "`git status` shows helpful information such as what branch you are on, and the status of each file as staged (has changes that will be included in the next commit), unstaged (has changes that are so far not set to be included in the next commit) and untracked (not included in the repository). \
Since `git status` does not change anything about your repository, it is very safe, and you may use it often, especially as you prepare to commit.";

var gitFetchExplanation = "`git fetch` retrieves any updates from the remote repository for your consideration and downloads them.\
It will not change your local repository, so it is a safe command to use.  Contrast `git fetch` with the `git pull`, which combines `git fetch` and `git merge`\
and thus will try to merge any new remote content into your local repository right away, which could cause merge conflicts.";
var gitCheckoutExplanation = "You can `git checkout` files, commits, and branches, but here we're just checking out a branch.  Checking out a branch \
moves you to the branch you checkout so that you can work there.  For example, when creating a new features, rather than working directly on the master branch \
it is a good idea to work on a branch specific to that feature.  So we'll checkout a feature-specific branch before we get to work.";
var gitAddExplanation = "`git add <filename>` stages a file for commit.  If git status shows you unstaged files that you have updated, and you want to\
save those updates with a commit, you should `git add` all of the unstaged files.  You can also `git add` untracked files, if you want to start including them in \
your repository.";
var gitPushExplanation = "`git push` uploads local repository content and changes to the remote repository.";
var gitMergeExplanation = "`git merge <branch>` merges <branch> into the current branch, so that for example `git merge origin/master' \
will add any updates from the master branch from the remote repository origin into your local repository.  If there are conflicts when you merge, you will \
need to resolve them.";


$('.bflag').attr('title', bFlagExplanation);
$('.mflag').attr('title', mFlagExplanation);
$('.master').attr('title', masterExplanation);
$('.origin').attr('title', originExplanation);
$('.mybranchname').attr('title', mybranchnameExplanation);
$('.commit-message').attr('title', commitMessageExplanation)

$('.git-status').attr('title', gitStatusExplanation);
$('.git-commit').attr('title', gitCommitExplanation);
$('.git-add').attr('title', gitAddExplanation);
$('.git-fetch').attr('title', gitFetchExplanation);
$('.git-checkout').attr('title', gitCheckoutExplanation);
$('.git-merge').attr('title', gitMergeExplanation);
$('.git-push').attr('title', gitPushExplanation);

$( document ).tooltip();

