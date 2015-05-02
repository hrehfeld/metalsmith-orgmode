

var basename = require('path').basename;
//var debug = require('debug')('metalsmith-markdown');
var dirname = require('path').dirname;
var extname = require('path').extname;
var org = require("org");

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 {
 headerOffset: 1,
 exportFromLineNumber: false,
 suppressSubScriptHandling: false,
 suppressAutoLink: false
 }
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  var orgoptions = {
	headerOffset: 1,
	exportFromLineNumber: false,
	suppressSubScriptHandling: false,
	suppressAutoLink: false,
    htmlClassPrefix: 'org-',
    htmlIdPrefix: 'org-'
  };

  options = options || {
    frontMatter: true
  };
  if (!options['org']) {
    options.org = orgoptions;
  }
  console.log(options);
  var keys = options.keys || [];

  function trimSafe(tag) {
    return tag.trim().replace(/ /g,'-');
  }

  return function(files, metalsmith, done){
    setImmediate(done);
    var re = /([^:]+)/i;
    Object.keys(files).forEach(function(file){
      //debug('checking file: %s', file);
      if (!isOrgmode(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      if (options.frontMatter) {
        //debug('converting file: %s', file);

        var orgText = data.contents.toString();
        var parser = new org.Parser();
	    var orgdoc = parser.parse(orgText);
        data.orgdoc = orgdoc;
        var directives = orgdoc.directiveValues;
        //      console.log(orgdoc.directiveValues);
        //      console.log(data);

        [ 'title', 'author', 'email']
          .forEach(function (field) {
            if (orgdoc[field]) {
              data[field] = orgdoc[field];
            }
          });

        if (directives) {
          for (var dire in directives) {
            //console.log(dire + directives[dire]);
            var found = dire.match(re);
            var directive = found[0];
            directive = directive.toLowerCase();
            
            if (directives[dire]) {
              data[directive] = directives[dire];
            }
          }
        }
      }
      else {
	    var orgHTMLDocument = data.orgdoc.convert(org.ConverterHTML, options.org);
        delete data['orgdoc'];
	    
	    //console.dir(orgHTMLDocument); // => { title, contentHTML, tocHTML, toc }
        data.contents = new Buffer(orgHTMLDocument.contentHTML);
        keys.forEach(function(key) {
          //console.log(key);
          //console.log(data[key]);
          //        data[key] = marked(data[key], options);
        });

        delete files[file];
        files[html] = data;
      }
    });
  };
}

/**
 * Check if a `file` is org-mode.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isOrgmode(file){
  return /\.org/.test(extname(file));
}
