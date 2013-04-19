// Generated by CoffeeScript 1.6.1
/*
	This is the CLI interface for using git-server.
*/

var CLI, GITCLI, GitServer, Table, async, fs, mkdirp, path, repoDB, repoLocation, repoPort, repos, _c, _g,
  _this = this;

CLI = require('../Node-CLI/cli.js');

GitServer = require('./host.js');

mkdirp = require('mkdirp');

fs = require('fs');

async = require('async');

path = require('path');

Table = require('cli-table');

repoPort = 7000;

repoLocation = path.resolve('../repos/');

repoDB = path.resolve('../repos.db');

mkdirp.sync(repos);

if (fs.existsSync(repoDB)) {
  repos = JSON.parse(fs.readFileSync(repoDB));
} else {
  repos = {
    repos: [],
    users: []
  };
}

console.log(repos);

GITCLI = (function() {

  function GITCLI(gitServer, users) {
    var availableCalls, welcomeMessage,
      _this = this;
    this.gitServer = gitServer;
    this.users = users != null ? users : [];
    this.saveConfig = function() {
      return GITCLI.prototype.saveConfig.apply(_this, arguments);
    };
    this.listRepos = function(callback) {
      return GITCLI.prototype.listRepos.apply(_this, arguments);
    };
    this.listUsers = function() {
      return GITCLI.prototype.listUsers.apply(_this, arguments);
    };
    this.createRepo = function(callback) {
      return GITCLI.prototype.createRepo.apply(_this, arguments);
    };
    availableCalls = {
      'create repo': this.createRepo,
      'list repos': this.listRepos,
      'list users': this.listUsers
    };
    welcomeMessage = "Welcome to Git Server - Powered by NodeJS\n - Repo Location: 	" + repoLocation + "\n - Listening Port: 	" + repoPort;
    this.cli = new CLI('git-server', welcomeMessage, availableCalls);
  }

  GITCLI.prototype.createRepo = function(callback) {
    var _this = this;
    return async.series({
      name: function(cb) {
        return _this.cli.question('Repo Name:', function(r) {
          return cb(null, r);
        });
      },
      anonRead: function(cb) {
        return _this.cli.question('Anonymous Access? [y,N] :', function(r) {
          return cb(null, r);
        });
      }
    }, function(err, results) {
      var anon, name;
      name = results.name.toLowerCase();
      anon = results.anonRead.toLowerCase();
      if (anon === 'y') {
        anon = true;
      } else {
        anon = false;
      }
      console.log('Create Repo: ', name, ' with Anonymous access: ', anon);
      _this.gitServer.createRepo({
        name: name,
        anonRead: anon,
        users: []
      });
      _this.saveConfig();
      return callback();
    });
  };

  GITCLI.prototype.listUsers = function() {
    return console.log('List Users');
  };

  GITCLI.prototype.listRepos = function(callback) {
    var repo, table, _i, _len;
    repos = this.gitServer.repos;
    table = new Table({
      head: ['name', 'anon', 'users'],
      colWidths: [30, 10, 50]
    });
    for (_i = 0, _len = repos.length; _i < _len; _i++) {
      repo = repos[_i];
      table.push([repo.name, repo.anonRead, repo.users]);
    }
    console.log(table.toString());
    return callback();
  };

  GITCLI.prototype.saveConfig = function() {
    var config;
    config = JSON.stringify({
      repos: this.gitServer.repos,
      users: this.users
    });
    return fs.writeFileSync(repoDB, config);
  };

  return GITCLI;

})();

_g = new GitServer(repos.repos, false, repoLocation, repoPort);

_c = new GITCLI(_g, repos.users);
