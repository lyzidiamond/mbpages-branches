var GitHubApi = require("github");

var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: false,
  protocol: "https",
  timeout: 5000,
  headers: {
    "user-agent": "github-support"
  }
});

var username = process.argv[2]
var githubKey = process.argv[3];
var orgName = process.argv[4];
var branchName = process.argv[5];
var orgRepos = [];
var orgBranchRepos = [];

github.authenticate({
  type: "basic",
  username: username,
  password: githubKey
});

function getOrgRepos(page, orgName, callback) {
  console.log("getting " + orgName + " repos page " + page);
  github.orgs.getForOrg({
    org: orgName,
    page: page,
    per_page: 100
  }, function(err, res) {
    if (err) {
      console.log(err);
    }
    for (var i = 0; i < res.length; i++) {
      if (res[i].name) {
        orgRepos.push(res[i].name);
      }
    }
    var linkString = res.meta.link;
    var linksArray = linkString.split(',');
    var nextPage;
    var lastPage;
    for (var i = 0; i < linksArray.length; i++) {
      if (linksArray[i].match(/rel="next"/)) {
        nextPage = parseInt(linksArray[i].match(/page=\d+/)[0].match(/\d+/)[0]);
      } else if (linksArray[i].match(/rel="last"/)) {
        lastPage = parseInt(linksArray[i].match(/page=\d+/)[0].match(/\d+/)[0]);
      }
    }
    if (nextPage <= lastPage) {
      getOrgRepos(parseInt(nextPage), callback);
    } else {
      callback();
    }
  });
}

function hasBranch(orgName, repo, branchName, callback) {
  console.log('checking ' + repo + ' for ' + branchName + ' branch');
  github.repos.getBranch({
    user: orgName,
    repo: repo,
    branch: branchName,
    page: page,
    per_page: 100
  }, function (err, res) {
    if (err) {
      return callback(err);
    }
    var orgRepo;
    if (res.name && res.name === branchName) {
      orgBranchRepos = repo;
    }
    callback(null, orgRepo);
  });
}

getOrgRepos(1, orgName, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  for (var i = 0; i < orgRepos.length; i++) {
    hasBranch(orgName, orgRepos[i], branchName, function(err, orgRepo) {
      if (err) {
        return;
      }
      orgRepos.push(orgRepo);
      console.log(orgRepos);
      console.log(orgRepos.length);
    });
  }
});
