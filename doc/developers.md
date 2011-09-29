# Developers, developers, developers!!!

Welcome onboard! It's so great to hear that you want to help us!

## Tools

Before you start hacking, you'll need few things:

  * [node.js](https://github.com/joyent/node)
  * [npm](https://github.com/isaacs/npm)
  * [CouchDB](http://couchdb.apache.org/)
  * [Riak](http://wiki.basho.com/)
  * [git](http://git-scm.com/) (optional)
  * your favorite code editor

### [node.js](https://github.com/joyent/node)
node.js is an evented I/O framework built on top of V8 JavaScript. This is
what gets Relief1 going. [Installing it is very easy](https://github.com/joyent/node/wiki/Installation).

For Relief1 development, make sure you're using stable version (v0.4.x).

### [npm](https://github.com/isaacs/npm)
npm is a node.js package manager. [Installation is even easier.](http://npmjs.org/).

### [CouchDB](http://couchdb.apache.org/)
CouchDB is a document-oriented database with awesomeness integrated. We're using
it, because it's very safe - shutting down a CouchDB server by taking out the
power cord is perfectly valid and doesn't harm the data.

#### Installation
Most Linux distributions have CouchDB in it's repositories, so installing it
should be pretty straightforward.

Debian/Ubuntu: `sudo apt-get install couchdb`
Fedora: `sudo yum install couchdb`

On Mac OS X you can follow [this instructions](http://guide.couchdb.org/draft/mac.html).

CouchDB has detailed installation instructions in it's [wiki](http://wiki.apache.org/couchdb/Installation).

### [Riak](http://wiki.basho.com/)
Riak is our secondary database, we use it for sessions.

#### Installation
On Mac OS X, with brew: `sudo brew install riak`

Unfortunately, neither Debian nor Fedora have Riak in it's repositories, but
thankfully, Riak provides various binaries. Please, refer to
[Riak wiki](http://wiki.basho.com/Installation.html) for further instructions.

### git
This one is optional - you can download source tarball from GitHub.

You can use it to clone our git repository to start working with our codebase: `git clone git://github.com/Relief-1/Relief1.git`.

Workflow we're using is described in our README. It basically boils down to using
topic branches.

#### Installation
Almost all Linux distributions have git in their repositories:

Debian/Ubuntu: `sudo apt-get install git`
Fedora: `sudo yum install git`

brew: `sudo brew install git`

### What OS should I use?
At the moment, Windows isn't the best OS to work with node.js. You should be
perfectly fine with Mac OS X, but most of us use Linux (Fedora and Debian).

### Code editor
Use whatever you're comfortable with. Some nice editors are:

## node modules we're using

  * [Hook.io](https://github.com/hookio)
  * [Cradle](https://github.com/cloudhead/cradle)
  * [node-static](https://github.com/Marak/node-static)
  * [settings](https://github.com/mgutz/node-settings)

Please note that you don't need to care about installing them. Just
run `npm install` in main repo directory and npm will take care about that.

### [Hook.io](https://github.com/hookio)
It's an awesome library which basically drives whole our architecture. It can
be described as a full featured I/O framework.

If you're wondering, how it works, this
[series of videos by Marak Squires](http://www.youtube.com/user/MarakSquires)
is a great resource.

