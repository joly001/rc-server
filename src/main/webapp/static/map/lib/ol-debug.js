// OpenLayers. See https://openlayers.org/
// License: https://raw.githubusercontent.com/openlayers/openlayers/master/LICENSE.md
// Version: v4.6.5
;(function (root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root.ol = factory();
  }
}(this, function () {
  var OPENLAYERS = {};
  var goog = this.goog = {};
this.CLOSURE_NO_DEPS = true;
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will attempt to load Closure's deps file, unless
 * the global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects
 * to include their own deps file(s) from different locations.
 *
 * Avoid including base.js more than once. This is strictly discouraged and not
 * supported. goog.require(...) won't work properly in that case.
 *
 * @provideGoog
 */


/**
 * @define {boolean} Overridden to true by the compiler.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {};


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, {@code CLOSURE_UNCOMPILED_DEFINES} may be defined before
 * loading base.js.  If a key is defined in {@code CLOSURE_UNCOMPILED_DEFINES},
 * {@code goog.define} will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_UNCOMPILED_DEFINES;


/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_DEFINES;


/**
 * Returns true if the specified value is not undefined.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};

/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is `goog.global`.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part] && cur[part] !== Object.prototype[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Defines a named value. In uncompiled mode, the value is retrieved from
 * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
 * has the property specified, and otherwise used the defined defaultValue.
 * When compiled the default can be overridden using the compiler
 * options or the value set in the CLOSURE_DEFINES object.
 *
 * @param {string} name The distinguished name to provide.
 * @param {string|number|boolean} defaultValue
 */
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES &&
        // Anti DOM-clobbering runtime check (b/37736576).
        /** @type {?} */ (goog.global.CLOSURE_UNCOMPILED_DEFINES).nodeType ===
            undefined &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else if (
        goog.global.CLOSURE_DEFINES &&
        // Anti DOM-clobbering runtime check (b/37736576).
        /** @type {?} */ (goog.global.CLOSURE_DEFINES).nodeType === undefined &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_DEFINES, name)) {
      value = goog.global.CLOSURE_DEFINES[name];
    }
  }
  goog.exportPath_(name, value);
};


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production. It can be easily stripped
 * by specifying --define goog.DEBUG=false to the Closure Compiler aka
 * JSCompiler. For example, most toString() methods should be declared inside an
 * "if (goog.DEBUG)" conditional because they are generally used for debugging
 * purposes and it is difficult for the JSCompiler to statically determine
 * whether they are used.
 */
goog.define('goog.DEBUG', true);


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as a compiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he).
 *
 */
goog.define('goog.LOCALE', 'en');  // default to en


/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define goog.TRUSTED_SITE=false" to the compiler.
 */
goog.define('goog.TRUSTED_SITE', true);


/**
 * @define {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * @see https://goo.gl/PudQ4y
 *
 */
goog.define('goog.STRICT_MODE_COMPATIBLE', false);


/**
 * @define {boolean} Whether code that calls {@link goog.setTestOnly} should
 *     be disallowed in the compilation unit.
 */
goog.define('goog.DISALLOW_TEST_ONLY_CODE', COMPILED && !goog.DEBUG);


/**
 * @define {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */
goog.define('goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING', false);


/**
 * Defines a namespace in Closure.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * The presence of one or more goog.provide() calls in a file indicates
 * that the file defines the given objects/namespaces.
 * Provided symbols must not be null or undefined.
 *
 * In addition, goog.provide() creates the object stubs for a namespace
 * (for example, goog.provide("goog.foo.bar") will create the object
 * goog.foo.bar if it does not already exist).
 *
 * Build tools also scan for provide/require/module statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 *
 * @see goog.require
 * @see goog.module
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.provide can not be used within a goog.module.');
  }
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw new Error('Namespace "' + name + '" already declared.');
    }
  }

  goog.constructNamespace_(name);
};


/**
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 * @param {Object=} opt_obj The object to embed in the namespace.
 * @private
 */
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name, opt_obj);
};


/**
 * Module identifier validation regexp.
 * Note: This is a conservative check, it is very possible to be more lenient,
 *   the primary exclusion here is "/" and "\" and a leading ".", these
 *   restrictions are intended to leave the door open for using goog.require
 *   with relative file paths rather than module identifiers.
 * @private
 */
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;


/**
 * Defines a module in Closure.
 *
 * Marks that this file must be loaded as a module and claims the namespace.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * goog.module() has three requirements:
 * - goog.module may not be used in the same file as goog.provide.
 * - goog.module must be the first statement in the file.
 * - only one goog.module is allowed per file.
 *
 * When a goog.module annotated file is loaded, it is enclosed in
 * a strict function closure. This means that:
 * - any variables declared in a goog.module file are private to the file
 * (not global), though the compiler is expected to inline the module.
 * - The code must obey all the rules of "strict" JavaScript.
 * - the file will be marked as "use strict"
 *
 * NOTE: unlike goog.provide, goog.module does not declare any symbols by
 * itself. If declared symbols are desired, use
 * goog.module.declareLegacyNamespace().
 *
 *
 * See the public goog.module proposal: http://goo.gl/Va1hin
 *
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part", is expected but not required.
 * @return {void}
 */
goog.module = function(name) {
  if (!goog.isString(name) || !name ||
      name.search(goog.VALID_MODULE_RE_) == -1) {
    throw new Error('Invalid module identifier');
  }
  if (!goog.isInModuleLoader_()) {
    throw new Error(
        'Module ' + name + ' has been loaded incorrectly. Note, ' +
        'modules cannot be loaded as normal scripts. They require some kind of ' +
        'pre-processing step. You\'re likely trying to load a module via a ' +
        'script tag or as a part of a concatenated bundle without rewriting the ' +
        'module. For more info see: ' +
        'https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.');
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw new Error('goog.module may only be called once per module.');
  }

  // Store the module name for the loader.
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw new Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 *
 * Note: This is not an alternative to goog.require, it does not
 * indicate a hard dependency, instead it is used to indicate
 * an optional dependency or to access the exports of a module
 * that has already been loaded.
 * @suppress {missingProvide}
 */
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 * @private
 */
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (name in goog.loadedModules_) {
      return goog.loadedModules_[name];
    } else if (!goog.implicitNamespaces_[name]) {
      var ns = goog.getObjectByName(name);
      return ns != null ? ns : null;
    }
  }
  return null;
};


/**
 * @private {?{moduleName: (string|undefined), declareLegacyNamespace:boolean}}
 */
goog.moduleLoaderState_ = null;


/**
 * @private
 * @return {boolean} Whether a goog.module is currently being initialized.
 */
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};


/**
 * Provide the module's exports as a globally accessible object under the
 * module's declared name.  This is intended to ease migration to goog.module
 * for files that have existing usages.
 * @suppress {missingProvide}
 */
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error(
        'goog.module.declareLegacyNamespace must be called from ' +
        'within a goog.module');
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw new Error(
        'goog.module must be called prior to ' +
        'goog.module.declareLegacyNamespace.');
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || '';
    throw new Error(
        'Importing test-only code into non-debug environment' +
        (opt_message ? ': ' + opt_message : '.'));
  }
};


/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 * Before using goog.forwardDeclare, please read the documentation at
 * https://github.com/google/closure-compiler/wiki/Bad-Type-Annotation to
 * understand the options and tradeoffs when working with forward declarations.
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */
goog.forwardDeclare = function(name) {};


/**
 * Forward declare type information. Used to assign types to goog.global
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */
goog.forwardDeclare('Document');
goog.forwardDeclare('HTMLScriptElement');
goog.forwardDeclare('XMLHttpRequest');


if (!COMPILED) {
  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return (name in goog.loadedModules_) ||
        (!goog.implicitNamespaces_[name] &&
         goog.isDefAndNotNull(goog.getObjectByName(name)));
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares that 'goog' and
   * 'goog.events' must be namespaces.
   *
   * @type {!Object<string, (boolean|undefined)>}
   * @private
   */
  goog.implicitNamespaces_ = {'goog.module': true};

  // NOTE: We add goog.module as an implicit namespace as goog.module is defined
  // here and because the existing module package has not been moved yet out of
  // the goog.module namespace. This satisifies both the debug loader and
  // ahead-of-time dependency management.
}


/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var i = 0; i < parts.length; i++) {
    cur = cur[parts[i]];
    if (!goog.isDefAndNotNull(cur)) {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {!Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {!Array<string>} provides An array of strings with
 *     the names of the objects this file provides.
 * @param {!Array<string>} requires An array of strings with
 *     the names of the objects this file requires.
 * @param {boolean|!Object<string>=} opt_loadFlags Parameters indicating
 *     how the file must be loaded.  The boolean 'true' is equivalent
 *     to {'module': 'goog'} for backwards-compatibility.  Valid properties
 *     and values include {'module': 'goog'} and {'lang': 'es6'}.
 */
goog.addDependency = function(relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    if (!opt_loadFlags || typeof opt_loadFlags === 'boolean') {
      opt_loadFlags = opt_loadFlags ? {'module': 'goog'} : {};
    }
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(nnaze): The debug DOM loader was included in base.js as an original way
// to do "debug-mode" development.  The dependency system can sometimes be
// confusing, as can the debug DOM loader's asynchronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the script
// will not load until some point after the current script.  If a namespace is
// needed at runtime, it needs to be defined in a previous script, or loaded via
// require() with its registered dependencies.
//
// User-defined namespaces may need their own deps file. For a reference on
// creating a deps file, see:
// Externally: https://developers.google.com/closure/library/docs/depswriter
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work was done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.define('goog.ENABLE_DEBUG_LOADER', true);


/**
 * @param {string} msg
 * @private
 */
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg);
  }
};


/**
 * Implements a system for the dynamic resolution of dependencies that works in
 * parallel with the BUILD system. Note that all calls to goog.require will be
 * stripped by the compiler.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide()) in
 *     the form "goog.package.part".
 * @return {?} If called within a goog.module file, the associated namespace or
 *     module otherwise null.
 */
goog.require = function(name) {
  // If the object already exists we do not need to do anything.
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }

    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      }
    } else if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.writeScripts_(path);
      } else {
        var errorMessage = 'goog.require could not find: ' + name;
        goog.logToConsole_(errorMessage);

        throw new Error(errorMessage);
      }
    }

    return null;
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to attempt to load Closure's deps file. By default, when uncompiled,
 * deps files will attempt to be loaded.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 * @type {(function(string): boolean)|undefined}
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
goog.abstractMethod = function() {
  throw new Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  // instance_ is immediately set to prevent issues with sealed constructors
  // such as are encountered when a constructor is returned as the export object
  // of a goog.module in unoptimized code.
  ctor.instance_ = undefined;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the {@code goog.testing.singleton} module. The compiler
 * removes this variable if unused.
 * @type {!Array<!Function>}
 * @private
 */
goog.instantiatedSingletons_ = [];


/**
 * @define {boolean} Whether to load goog.modules using {@code eval} when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or similar.
 * However in some environments the use of {@code eval} is banned
 * so we provide an alternative.
 */
goog.define('goog.LOAD_MODULE_USING_EVAL', true);


/**
 * @define {boolean} Whether the exports of goog.modules should be sealed when
 * possible.
 */
goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG);


/**
 * The registry of initialized modules:
 * the module identifier to module exports map.
 * @private @const {!Object<string, ?>}
 */
goog.loadedModules_ = {};


/**
 * True if goog.dependencies_ is available.
 * @const {boolean}
 */
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;


/**
 * @define {string} How to decide whether to transpile.  Valid values
 * are 'always', 'never', and 'detect'.  The default ('detect') is to
 * use feature detection to determine which language levels need
 * transpilation.
 */
// NOTE(user): we could expand this to accept a language level to bypass
// detection: e.g. goog.TRANSPILE == 'es5' would transpile ES6 files but
// would leave ES3 and ES5 files alone.
goog.define('goog.TRANSPILE', 'detect');


/**
 * @define {string} Path to the transpiler.  Executing the script at this
 * path (relative to base.js) should define a function $jscomp.transpile.
 */
goog.define('goog.TRANSPILER', 'transpile.js');


if (goog.DEPENDENCIES_ENABLED) {
  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts.
   * @private
   * @type {{
   *   loadFlags: !Object<string, !Object<string, string>>,
   *   nameToPath: !Object<string, string>,
   *   requires: !Object<string, !Object<string, boolean>>,
   *   visited: !Object<string, boolean>,
   *   written: !Object<string, boolean>,
   *   deferred: !Object<string, string>
   * }}
   */
  goog.dependencies_ = {
    loadFlags: {},  // 1 to 1

    nameToPath: {},  // 1 to 1

    requires: {},  // 1 to many

    // Used when resolving dependencies to prevent us from visiting file twice.
    visited: {},

    written: {},  // Used to keep track of script files we have written.

    deferred: {}  // Used to track deferred module evaluations in old IEs
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    /** @type {Document} */
    var doc = goog.global.document;
    return doc != null && 'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of base.js script that bootstraps Closure.
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH) &&
        // Anti DOM-clobbering runtime check (b/37736576).
        goog.isString(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    /** @type {Document} */
    var doc = goog.global.document;
    // If we have a currentScript available, use it exclusively.
    var currentScript = doc.currentScript;
    if (currentScript) {
      var scripts = [currentScript];
    } else {
      var scripts = doc.getElementsByTagName('SCRIPT');
    }
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var script = /** @type {!HTMLScriptElement} */ (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @private
   */
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript =
        goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * Whether the browser is IE9 or earlier, which needs special handling
   * for deferred modules.
   * @const @private {boolean}
   */
  goog.IS_OLD_IE_ =
      !!(!goog.global.atob && goog.global.document && goog.global.document.all);


  /**
   * Whether IE9 or earlier is waiting on a dependency.  This ensures that
   * deferred modules that have no non-deferred dependencies actually get
   * loaded, since if we defer them and then never pull in a non-deferred
   * script, then `goog.loadQueuedModules_` will never be called.  Instead,
   * if not waiting on anything we simply don't defer in the first place.
   * @private {boolean}
   */
  goog.oldIeWaiting_ = false;


  /**
   * Given a URL initiate retrieval and execution of a script that needs
   * pre-processing.
   * @param {string} src Script source URL.
   * @param {boolean} isModule Whether this is a goog.module.
   * @param {boolean} needsTranspile Whether this source needs transpilation.
   * @private
   */
  goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
    // In an attempt to keep browsers from timing out loading scripts using
    // synchronous XHRs, put each load in its own script block.
    var bootstrap = 'goog.retrieveAndExec_("' + src + '", ' + isModule + ', ' +
        needsTranspile + ');';

    goog.importScript_('', bootstrap);
  };


  /** @private {!Array<string>} */
  goog.queuedModules_ = [];


  /**
   * Return an appropriate module text. Suitable to insert into
   * a script tag (that is unescaped).
   * @param {string} srcUrl
   * @param {string} scriptText
   * @return {string}
   * @private
   */
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return '' +
          'goog.loadModule(function(exports) {' +
          '"use strict";' + scriptText +
          '\n' +  // terminate any trailing single line comment.
          ';return exports' +
          '});' +
          '\n//# sourceURL=' + srcUrl + '\n';
    } else {
      return '' +
          'goog.loadModule(' +
          goog.global.JSON.stringify(
              scriptText + '\n//# sourceURL=' + srcUrl + '\n') +
          ');';
    }
  };

  // On IE9 and earlier, it is necessary to handle
  // deferred module loads. In later browsers, the
  // code to be evaluated is simply inserted as a script
  // block in the correct order. To eval deferred
  // code at the right time, we piggy back on goog.require to call
  // goog.maybeProcessDeferredDep_.
  //
  // The goog.requires are used both to bootstrap
  // the loading process (when no deps are available) and
  // declare that they should be available.
  //
  // Here we eval the sources, if all the deps are available
  // either already eval'd or goog.require'd.  This will
  // be the case when all the dependencies have already
  // been loaded, and the dependent module is loaded.
  //
  // But this alone isn't sufficient because it is also
  // necessary to handle the case where there is no root
  // that is not deferred.  For that there we register for an event
  // and trigger goog.loadQueuedModules_ handle any remaining deferred
  // evaluations.

  /**
   * Handle any remaining deferred goog.module evals.
   * @private
   */
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0; i < count; i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
    goog.oldIeWaiting_ = false;
  };


  /**
   * Eval the named module if its dependencies are
   * available.
   * @param {string} name The module to load.
   * @private
   */
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose evaluation has been deferred.
   * @private
   */
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    var loadFlags = path && goog.dependencies_.loadFlags[path] || {};
    var languageLevel = loadFlags['lang'] || 'es3';
    if (path && (loadFlags['module'] == 'goog' ||
                 goog.needsTranspile_(languageLevel))) {
      var abspath = goog.basePath + path;
      return (abspath) in goog.dependencies_.deferred;
    }
    return false;
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose declared dependencies have all been loaded
   *     (eval'd or a deferred module load)
   * @private
   */
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && (path in goog.dependencies_.requires)) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) &&
            !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };


  /**
   * @param {string} abspath
   * @private
   */
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };


  /**
   * Load a goog.module from the provided URL.  This is not a general purpose
   * code loader and does not support late loading code, that is it should only
   * be used during page load. This method exists to support unit tests and
   * "debug" loaders that would otherwise have inserted script tags. Under the
   * hood this needs to use a synchronous XHR and is not recommeneded for
   * production code.
   *
   * The module's goog.requires must have already been satisified; an exception
   * will be thrown if this is not the case. This assumption is that no
   * "deps.js" file exists, so there is no way to discover and locate the
   * module-to-be-loaded's dependencies and no attempt is made to do so.
   *
   * There should only be one attempt to load a module.  If
   * "goog.loadModuleFromUrl" is called for an already loaded module, an
   * exception will be throw.
   *
   * @param {string} url The URL from which to attempt to load the goog.module.
   */
  goog.loadModuleFromUrl = function(url) {
    // Because this executes synchronously, we don't need to do any additional
    // bookkeeping. When "goog.loadModule" the namespace will be marked as
    // having been provided which is sufficient.
    goog.retrieveAndExec_(url, true, false);
  };


  /**
   * Writes a new script pointing to {@code src} directly into the DOM.
   *
   * NOTE: This method is not CSP-compliant. @see goog.appendScriptSrcNode_ for
   * the fallback mechanism.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write(
        '<script type="text/javascript" src="' + src + '"></' +
        'script>');
  };


  /**
   * Appends a new script node to the DOM using a CSP-compliant mechanism. This
   * method exists as a fallback for document.write (which is not allowed in a
   * strict CSP context, e.g., Chrome apps).
   *
   * NOTE: This method is not analogous to using document.write to insert a
   * <script> tag; specifically, the user agent will execute a script added by
   * document.write immediately after the current script block finishes
   * executing, whereas the DOM-appended script node will not be executed until
   * the entire document is parsed and executed. That is to say, this script is
   * added to the end of the script execution queue.
   *
   * The page must not attempt to call goog.required entities until after the
   * document has loaded, e.g., in or after the window.onload callback.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.appendScriptSrcNode_ = function(src) {
    /** @type {Document} */
    var doc = goog.global.document;
    var scriptEl =
        /** @type {HTMLScriptElement} */ (doc.createElement('script'));
    scriptEl.type = 'text/javascript';
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script url.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      /** @type {!HTMLDocument} */
      var doc = goog.global.document;

      // If the user tries to require a new symbol after document load,
      // something has gone terribly wrong. Doing a document.write would
      // wipe out the page. This does not apply to the CSP-compliant method
      // of writing script tags.
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING &&
          doc.readyState == 'complete') {
        // Certain test frameworks load base.js multiple times, which tries
        // to write deps.js each time. If that happens, just fail silently.
        // These frameworks wipe the page between each load of base.js, so this
        // is OK.
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw new Error('Cannot write "' + src + '" after document load');
        }
      }

      if (opt_sourceText === undefined) {
        if (!goog.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          goog.oldIeWaiting_ = true;
          var state = ' onreadystatechange=\'goog.onScriptLoad_(this, ' +
              ++goog.lastNonModuleScriptIndex_ + ')\' ';
          doc.write(
              '<script type="text/javascript" src="' + src + '"' + state +
              '></' +
              'script>');
        }
      } else {
        doc.write(
            '<script type="text/javascript">' +
            goog.protectScriptTag_(opt_sourceText) + '</' +
            'script>');
      }
      return true;
    } else {
      return false;
    }
  };

  /**
   * Rewrites closing script tags in input to avoid ending an enclosing script
   * tag.
   *
   * @param {string} str
   * @return {string}
   * @private
   */
  goog.protectScriptTag_ = function(str) {
    return str.replace(/<\/(SCRIPT)/ig, '\\x3c/$1');
  };

  /**
   * Determines whether the given language needs to be transpiled.
   * @param {string} lang
   * @return {boolean}
   * @private
   */
  goog.needsTranspile_ = function(lang) {
    if (goog.TRANSPILE == 'always') {
      return true;
    } else if (goog.TRANSPILE == 'never') {
      return false;
    } else if (!goog.requiresTranspilation_) {
      goog.requiresTranspilation_ = goog.createRequiresTranspilation_();
    }
    if (lang in goog.requiresTranspilation_) {
      return goog.requiresTranspilation_[lang];
    } else {
      throw new Error('Unknown language mode: ' + lang);
    }
  };

  /** @private {?Object<string, boolean>} */
  goog.requiresTranspilation_ = null;


  /** @private {number} */
  goog.lastNonModuleScriptIndex_ = 0;


  /**
   * A readystatechange handler for legacy IE
   * @param {?} script
   * @param {number} scriptIndex
   * @return {boolean}
   * @private
   */
  goog.onScriptLoad_ = function(script, scriptIndex) {
    // for now load the modules when we reach the last script,
    // later allow more inter-mingling.
    if (script.readyState == 'complete' &&
        goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };

  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @param {string} pathToLoad The path from which to start discovering
   *     dependencies.
   * @private
   */
  goog.writeScripts_ = function(pathToLoad) {
    /** @type {!Array<string>} The scripts we need to write this time. */
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    /** @param {string} path */
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // We have already visited this one. We can get here if we have cyclic
      // dependencies.
      if (path in deps.visited) {
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw new Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    visitNode(pathToLoad);

    // record that we are going to load all these scripts.
    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }

    // If a module is loaded synchronously then we need to
    // clear the current inModuleLoader value, and restore it when we are
    // done loading the current "requires".
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;

    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      if (path) {
        var loadFlags = deps.loadFlags[path] || {};
        var languageLevel = loadFlags['lang'] || 'es3';
        var needsTranspile = goog.needsTranspile_(languageLevel);
        if (loadFlags['module'] == 'goog' || needsTranspile) {
          goog.importProcessedScript_(
              goog.basePath + path, loadFlags['module'] == 'goog',
              needsTranspile);
        } else {
          goog.importScript_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw new Error('Undefined script input');
      }
    }

    // restore the current "module loading state"
    goog.moduleLoaderState_ = moduleState;
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}


/**
 * @package {?boolean}
 * Visible for testing.
 */
goog.hasBadLetScoping = null;


/**
 * @return {boolean}
 * @package Visible for testing.
 */
goog.useSafari10Workaround = function() {
  if (goog.hasBadLetScoping == null) {
    var hasBadLetScoping;
    try {
      hasBadLetScoping = !eval(
          '"use strict";' +
          'let x = 1; function f() { return typeof x; };' +
          'f() == "number";');
    } catch (e) {
      // Assume that ES6 syntax isn't supported.
      hasBadLetScoping = false;
    }
    goog.hasBadLetScoping = hasBadLetScoping;
  }
  return goog.hasBadLetScoping;
};


/**
 * @param {string} moduleDef
 * @return {string}
 * @package Visible for testing.
 */
goog.workaroundSafari10EvalBug = function(moduleDef) {
  return '(function(){' + moduleDef +
      '\n' +  // Terminate any trailing single line comment.
      ';' +   // Terminate any trailing expression.
      '})();\n';
};


/**
 * @param {function(?):?|string} moduleDef The module definition.
 */
goog.loadModule = function(moduleDef) {
  // NOTE: we allow function definitions to be either in the from
  // of a string to eval (which keeps the original source intact) or
  // in a eval forbidden environment (CSP) we allow a function definition
  // which in its body must call {@code goog.module}, and return the exports
  // of the module.
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {
      moduleName: undefined,
      declareLegacyNamespace: false
    };
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else if (goog.isString(moduleDef)) {
      if (goog.useSafari10Workaround()) {
        moduleDef = goog.workaroundSafari10EvalBug(moduleDef);
      }

      exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
    } else {
      throw new Error('Invalid module definition');
    }

    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw new Error('Invalid module name \"' + moduleName + '\"');
    }

    // Don't seal legacy namespaces as they may be uses as a parent of
    // another namespace
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports);
    } else if (
        goog.SEAL_MODULE_EXPORTS && Object.seal && typeof exports == 'object' &&
        exports != null) {
      Object.seal(exports);
    }

    goog.loadedModules_[moduleName] = exports;
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};


/**
 * @private @const
 */
goog.loadModuleFromSource_ = /** @type {function(string):?} */ (function() {
  // NOTE: we avoid declaring parameters or local variables here to avoid
  // masking globals or leaking values into the module definition.
  'use strict';
  var exports = {};
  eval(arguments[0]);
  return exports;
});


/**
 * Normalize a file path by removing redundant ".." and extraneous "." file
 * path components.
 * @param {string} path
 * @return {string}
 * @private
 */
goog.normalizePath_ = function(path) {
  var components = path.split('/');
  var i = 0;
  while (i < components.length) {
    if (components[i] == '.') {
      components.splice(i, 1);
    } else if (
        i && components[i] == '..' && components[i - 1] &&
        components[i - 1] != '..') {
      components.splice(--i, 2);
    } else {
      i++;
    }
  }
  return components.join('/');
};


/**
 * Provides a hook for loading a file when using Closure's goog.require() API
 * with goog.modules.  In particular this hook is provided to support Node.js.
 *
 * @type {(function(string):string)|undefined}
 */
goog.global.CLOSURE_LOAD_FILE_SYNC;


/**
 * Loads file by synchronous XHR. Should not be used in production environments.
 * @param {string} src Source URL.
 * @return {?string} File contents, or null if load failed.
 * @private
 */
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      /** @type {XMLHttpRequest} */
      var xhr = new goog.global['XMLHttpRequest']();
      xhr.open('get', src, false);
      xhr.send();
      // NOTE: Successful http: requests have a status of 200, but successful
      // file: requests may have a status of zero.  Any other status, or a
      // thrown exception (particularly in case of file: requests) indicates
      // some sort of error, which we treat as a missing or unavailable file.
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      // No need to rethrow or log, since errors should show up on their own.
      return null;
    }
  }
};


/**
 * Retrieve and execute a script that needs some sort of wrapping.
 * @param {string} src Script source URL.
 * @param {boolean} isModule Whether to load as a module.
 * @param {boolean} needsTranspile Whether to transpile down to ES3.
 * @private
 */
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  if (!COMPILED) {
    // The full but non-canonicalized URL for later use.
    var originalPath = src;
    // Canonicalize the path, removing any /./ or /../ since Chrome's debugging
    // console doesn't auto-canonicalize XHR loads as it does <script> srcs.
    src = goog.normalizePath_(src);

    var importScript =
        goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;

    var scriptText = goog.loadFileSync_(src);
    if (scriptText == null) {
      throw new Error('Load of "' + src + '" failed');
    }

    if (needsTranspile) {
      scriptText = goog.transpile_.call(goog.global, scriptText, src);
    }

    if (isModule) {
      scriptText = goog.wrapModule_(src, scriptText);
    } else {
      scriptText += '\n//# sourceURL=' + src;
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (isOldIE && goog.oldIeWaiting_) {
      goog.dependencies_.deferred[originalPath] = scriptText;
      goog.queuedModules_.push(originalPath);
    } else {
      importScript(src, scriptText);
    }
  }
};


/**
 * Lazily retrieves the transpiler and applies it to the source.
 * @param {string} code JS code.
 * @param {string} path Path to the code.
 * @return {string} The transpiled code.
 * @private
 */
goog.transpile_ = function(code, path) {
  var jscomp = goog.global['$jscomp'];
  if (!jscomp) {
    goog.global['$jscomp'] = jscomp = {};
  }
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER;
    var transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      // This must be executed synchronously, since by the time we know we
      // need it, we're about to load and write the ES6 code synchronously,
      // so a normal script-tag load will be too slow.
      eval(transpilerCode + '\n//# sourceURL=' + transpilerPath);
      // Even though the transpiler is optional, if $gwtExport is found, it's
      // a sign the transpiler was loaded and the $jscomp.transpile *should*
      // be there.
      if (goog.global['$gwtExport'] && goog.global['$gwtExport']['$jscomp'] &&
          !goog.global['$gwtExport']['$jscomp']['transpile']) {
        throw new Error(
            'The transpiler did not properly export the "transpile" ' +
            'method. $gwtExport: ' + JSON.stringify(goog.global['$gwtExport']));
      }
      // transpile.js only exports a single $jscomp function, transpile. We
      // grab just that and add it to the existing definition of $jscomp which
      // contains the polyfills.
      goog.global['$jscomp'].transpile =
          goog.global['$gwtExport']['$jscomp']['transpile'];
      jscomp = goog.global['$jscomp'];
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    // The transpiler is an optional component.  If it's not available then
    // replace it with a pass-through function that simply logs.
    var suffix = ' requires transpilation but no transpiler was found.';
    transpile = jscomp.transpile = function(code, path) {
      // TODO(user): figure out some way to get this error to show up
      // in test results, noting that the failure may occur in many
      // different ways, including in loadModule() before the test
      // runner even comes up.
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  // Note: any transpilation errors/warnings will be logged to the console.
  return transpile(code, path);
};


//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {!Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case.
           typeof value.length == 'number' &&
               typeof value.splice != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('splice')

               )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
           typeof value.call != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('call'))) {
        return 'function';
      }

    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. As a special case, a function value is not array like, because its
 * length property is fixed to correspond to the number of expected arguments.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  // We do not use goog.isObject here in order to exclude function values.
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};


/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into {@code getUid}. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }

  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' + ((Math.random() * 1e9) >>> 0);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * A native implementation of goog.bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = goog.bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
      // extension environment. This means that for Chrome extensions, they get
      // the implementation of Function.prototype.bind that calls goog.bind
      // instead of the native one. Even worse, we don't want to introduce a
      // circular dependency between goog.bind and Function.prototype.bind, so
      // we have to hack this to make sure it works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like goog.bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = goog.partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function goog.partial()
 *     was invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = (goog.TRUSTED_SITE && Date.now) || (function() {
             // Unary plus operator converts its operand to a number which in
             // the case of
             // a date is done by calling getTime().
             return +new Date();
           });


/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _evalTest_ = 1;');
      if (typeof goog.global['_evalTest_'] != 'undefined') {
        try {
          delete goog.global['_evalTest_'];
        } catch (ignore) {
          // Microsoft edge fails the deletion above in strict mode.
        }
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      /** @type {Document} */
      var doc = goog.global.document;
      var scriptElt =
          /** @type {!HTMLScriptElement} */ (doc.createElement('SCRIPT'));
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw new Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @private {!Object<string, string>|undefined}
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;



/**
 * A hook for modifying the default behavior goog.getCssName. The function
 * if present, will recieve the standard output of the goog.getCssName as
 * its input.
 *
 * @type {(function(string):string)|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAP_FN;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  // String() is used for compatibility with compiled soy where the passed
  // className can be non-string objects.
  if (String(className).charAt(0) == '.') {
    throw new Error(
        'className passed in goog.getCssName must not start with ".".' +
        ' You passed: ' + className);
  }

  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename =
        goog.cssNameMappingStyle_ == 'BY_WHOLE' ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  var result =
      opt_modifier ? className + '-' + rename(opt_modifier) : rename(className);

  // The special CLOSURE_CSS_NAME_MAP_FN allows users to specify further
  // processing of the class name.
  if (goog.global.CLOSURE_CSS_NAME_MAP_FN) {
    return goog.global.CLOSURE_CSS_NAME_MAP_FN(result);
  }

  return result;
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {!Object<string, string>|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand goog.getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * This function produces a string which should be treated as plain text. Use
 * {@link goog.html.SafeHtmlFormatter} in conjunction with goog.getMsg to
 * produce SafeHtml.
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object<string, string>=} opt_values Maps place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return (opt_values != null && key in opt_values) ? opt_values[key] :
                                                         match;
    });
  }
  return str;
};


/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with goog.getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
goog.getMsgWithFallback = function(a, b) {
  return a;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or goog.exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is goog.global.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 * @deprecated goog.base is not strict mode compatible.  Prefer the static
 *     "base" method added to the constructor by goog.inherits
 *     or ES6 classes and the "super" keyword.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !caller)) {
    throw new Error(
        'arguments.caller not defined.  goog.base() cannot be used ' +
        'with strict mode code. See ' +
        'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

  if (caller.superClass_) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }

  // Copying using loop to avoid deop due to passing arguments object to
  // function. This is faster in many JS engines as of late 2014.
  var args = new Array(arguments.length - 2);
  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor; ctor;
       ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain, then one of two
  // things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw new Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 *
 *
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.scope is not supported within a goog.module.');
  }
  fn.call(goog.global);
};


/*
 * To support uncompiled, strict mode bundles that use eval to divide source
 * like so:
 *    eval('someSource;//# sourceUrl sourcefile.js');
 * We need to export the globally defined symbols "goog" and "COMPILED".
 * Exporting "goog" breaks the compiler optimizations, so we required that
 * be defined externally.
 * NOTE: We don't use goog.exportSymbol here because we don't want to trigger
 * extern generation when that compiler option is enabled.
 */
if (!COMPILED) {
  goog.global['COMPILED'] = COMPILED;
}


//==============================================================================
// goog.defineClass implementation
//==============================================================================


/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {goog.defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 */
goog.defineClass = function(superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics;
  // Wrap the constructor prior to setting up the prototype and static methods.
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw new Error(
          'cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }

  // Remove all the properties that should not be copied to the prototype.
  delete def.constructor;
  delete def.statics;

  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};


/**
 * @typedef {{
 *   constructor: (!Function|undefined),
 *   statics: (Object|undefined|function(Function):void)
 * }}
 */
goog.defineClass.ClassDescriptor;


/**
 * @define {boolean} Whether the instances returned by goog.defineClass should
 *     be sealed when possible.
 *
 * When sealing is disabled the constructor function will not be wrapped by
 * goog.defineClass, making it incompatible with ES6 class methods.
 */
goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG);


/**
 * If goog.defineClass.SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    // Do now wrap the constructor when sealing is disabled. Angular code
    // depends on this for injection to work properly.
    return ctr;
  }

  // Compute whether the constructor is sealable at definition time, rather
  // than when the instance is being constructed.
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass);

  /**
   * @this {Object}
   * @return {?}
   */
  var wrappedCtr = function() {
    // Don't seal an instance of a subclass when it calls the constructor of
    // its super class as there is most likely still setup to do.
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];

    if (this.constructor === wrappedCtr && superclassSealable &&
        Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };

  return wrappedCtr;
};


/**
 * @param {Function} ctr The constructor to test.
 * @return {boolean} Whether the constructor has been tagged as unsealable
 *     using goog.tagUnsealableClass.
 * @private
 */
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype &&
      ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};


// TODO(johnlenz): share these values with the goog.object
/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array<string>}
 * @private
 * @const
 */
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = [
  'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
  'toLocaleString', 'toString', 'valueOf'
];


// TODO(johnlenz): share this function with the goog.object
/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properties from.
 * @private
 */
goog.defineClass.applyProperties_ = function(target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters

  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};


/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor. As such, goog.defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};


/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';


/**
 * Returns a newly created map from language mode string to a boolean
 * indicating whether transpilation should be done for that mode.
 *
 * Guaranteed invariant:
 * For any two modes, l1 and l2 where l2 is a newer mode than l1,
 * `map[l1] == true` implies that `map[l2] == true`.
 * @private
 * @return {!Object<string, boolean>}
 */
goog.createRequiresTranspilation_ = function() {
  var /** !Object<string, boolean> */ requiresTranspilation = {'es3': false};
  var transpilationRequiredForAllLaterModes = false;

  /**
   * Adds an entry to requiresTranspliation for the given language mode.
   *
   * IMPORTANT: Calls must be made in order from oldest to newest language
   * mode.
   * @param {string} modeName
   * @param {function(): boolean} isSupported Returns true if the JS engine
   *     supports the given mode.
   */
  function addNewerLanguageTranspilationCheck(modeName, isSupported) {
    if (transpilationRequiredForAllLaterModes) {
      requiresTranspilation[modeName] = true;
    } else if (isSupported()) {
      requiresTranspilation[modeName] = false;
    } else {
      requiresTranspilation[modeName] = true;
      transpilationRequiredForAllLaterModes = true;
    }
  }

  /**
   * Does the given code evaluate without syntax errors and return a truthy
   * result?
   */
  function /** boolean */ evalCheck(/** string */ code) {
    try {
      return !!eval(code);
    } catch (ignored) {
      return false;
    }
  }

  var userAgent = goog.global.navigator && goog.global.navigator.userAgent ?
      goog.global.navigator.userAgent :
      '';

  // Identify ES3-only browsers by their incorrect treatment of commas.
  addNewerLanguageTranspilationCheck('es5', function() {
    return evalCheck('[1,].length==1');
  });
  addNewerLanguageTranspilationCheck('es6', function() {
    // Edge has a non-deterministic (i.e., not reproducible) bug with ES6:
    // https://github.com/Microsoft/ChakraCore/issues/1496.
    var re = /Edge\/(\d+)(\.\d)*/i;
    var edgeUserAgent = userAgent.match(re);
    if (edgeUserAgent && Number(edgeUserAgent[1]) < 15) {
      return false;
    }
    // Test es6: [FF50 (?), Edge 14 (?), Chrome 50]
    //   (a) default params (specifically shadowing locals),
    //   (b) destructuring, (c) block-scoped functions,
    //   (d) for-of (const), (e) new.target/Reflect.construct
    var es6fullTest =
        'class X{constructor(){if(new.target!=String)throw 1;this.x=42}}' +
        'let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof ' +
        'String))throw 1;for(const a of[2,3]){if(a==2)continue;function ' +
        'f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()' +
        '==3}';

    return evalCheck('(()=>{"use strict";' + es6fullTest + '})()');
  });
  // TODO(joeltine): Remove es6-impl references for b/31340605.
  // Consider es6-impl (widely-implemented es6 features) to be supported
  // whenever es6 is supported. Technically es6-impl is a lower level of
  // support than es6, but we don't have tests specifically for it.
  addNewerLanguageTranspilationCheck('es6-impl', function() {
    return true;
  });
  // ** and **= are the only new features in 'es7'
  addNewerLanguageTranspilationCheck('es7', function() {
    return evalCheck('2 ** 2 == 4');
  });
  // async functions are the only new features in 'es8'
  addNewerLanguageTranspilationCheck('es8', function() {
    return evalCheck('async () => 1, true');
  });
  return requiresTranspilation;
};

goog.provide('ol.array');


/**
 * Performs a binary search on the provided sorted list and returns the index of the item if found. If it can't be found it'll return -1.
 * https://github.com/darkskyapp/binary-search
 *
 * @param {Array.<*>} haystack Items to search through.
 * @param {*} needle The item to look for.
 * @param {Function=} opt_comparator Comparator function.
 * @return {number} The index of the item if found, -1 if not.
 */
ol.array.binarySearch = function(haystack, needle, opt_comparator) {
  var mid, cmp;
  var comparator = opt_comparator || ol.array.numberSafeCompareFunction;
  var low = 0;
  var high = haystack.length;
  var found = false;

  while (low < high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle);

    if (cmp < 0.0) { /* Too low. */
      low  = mid + 1;

    } else { /* Key found or too high */
      high = mid;
      found = !cmp;
    }
  }

  /* Key not found. */
  return found ? low : ~low;
};


/**
 * Compare function for array sort that is safe for numbers.
 * @param {*} a The first object to be compared.
 * @param {*} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second.
 */
ol.array.numberSafeCompareFunction = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};


/**
 * Whether the array contains the given object.
 * @param {Array.<*>} arr The array to test for the presence of the element.
 * @param {*} obj The object for which to test.
 * @return {boolean} The object is in the array.
 */
ol.array.includes = function(arr, obj) {
  return arr.indexOf(obj) >= 0;
};


/**
 * @param {Array.<number>} arr Array.
 * @param {number} target Target.
 * @param {number} direction 0 means return the nearest, > 0
 *    means return the largest nearest, < 0 means return the
 *    smallest nearest.
 * @return {number} Index.
 */
ol.array.linearFindNearest = function(arr, target, direction) {
  var n = arr.length;
  if (arr[0] <= target) {
    return 0;
  } else if (target <= arr[n - 1]) {
    return n - 1;
  } else {
    var i;
    if (direction > 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] < target) {
          return i - 1;
        }
      }
    } else if (direction < 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] <= target) {
          return i;
        }
      }
    } else {
      for (i = 1; i < n; ++i) {
        if (arr[i] == target) {
          return i;
        } else if (arr[i] < target) {
          if (arr[i - 1] - target < target - arr[i]) {
            return i - 1;
          } else {
            return i;
          }
        }
      }
    }
    return n - 1;
  }
};


/**
 * @param {Array.<*>} arr Array.
 * @param {number} begin Begin index.
 * @param {number} end End index.
 */
ol.array.reverseSubArray = function(arr, begin, end) {
  while (begin < end) {
    var tmp = arr[begin];
    arr[begin] = arr[end];
    arr[end] = tmp;
    ++begin;
    --end;
  }
};


/**
 * @param {Array.<VALUE>} arr The array to modify.
 * @param {Array.<VALUE>|VALUE} data The elements or arrays of elements
 *     to add to arr.
 * @template VALUE
 */
ol.array.extend = function(arr, data) {
  var i;
  var extension = Array.isArray(data) ? data : [data];
  var length = extension.length;
  for (i = 0; i < length; i++) {
    arr[arr.length] = extension[i];
  }
};


/**
 * @param {Array.<VALUE>} arr The array to modify.
 * @param {VALUE} obj The element to remove.
 * @template VALUE
 * @return {boolean} If the element was removed.
 */
ol.array.remove = function(arr, obj) {
  var i = arr.indexOf(obj);
  var found = i > -1;
  if (found) {
    arr.splice(i, 1);
  }
  return found;
};


/**
 * @param {Array.<VALUE>} arr The array to search in.
 * @param {function(VALUE, number, ?) : boolean} func The function to compare.
 * @template VALUE
 * @return {VALUE} The element found.
 */
ol.array.find = function(arr, func) {
  var length = arr.length >>> 0;
  var value;

  for (var i = 0; i < length; i++) {
    value = arr[i];
    if (func(value, i, arr)) {
      return value;
    }
  }
  return null;
};


/**
 * @param {Array|Uint8ClampedArray} arr1 The first array to compare.
 * @param {Array|Uint8ClampedArray} arr2 The second array to compare.
 * @return {boolean} Whether the two arrays are equal.
 */
ol.array.equals = function(arr1, arr2) {
  var len1 = arr1.length;
  if (len1 !== arr2.length) {
    return false;
  }
  for (var i = 0; i < len1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<*>} arr The array to sort (modifies original).
 * @param {Function} compareFnc Comparison function.
 */
ol.array.stableSort = function(arr, compareFnc) {
  var length = arr.length;
  var tmp = Array(arr.length);
  var i;
  for (i = 0; i < length; i++) {
    tmp[i] = {index: i, value: arr[i]};
  }
  tmp.sort(function(a, b) {
    return compareFnc(a.value, b.value) || a.index - b.index;
  });
  for (i = 0; i < arr.length; i++) {
    arr[i] = tmp[i].value;
  }
};


/**
 * @param {Array.<*>} arr The array to search in.
 * @param {Function} func Comparison function.
 * @return {number} Return index.
 */
ol.array.findIndex = function(arr, func) {
  var index;
  var found = !arr.every(function(el, idx) {
    index = idx;
    return !func(el, idx, arr);
  });
  return found ? index : -1;
};


/**
 * @param {Array.<*>} arr The array to test.
 * @param {Function=} opt_func Comparison function.
 * @param {boolean=} opt_strict Strictly sorted (default false).
 * @return {boolean} Return index.
 */
ol.array.isSorted = function(arr, opt_func, opt_strict) {
  var compare = opt_func || ol.array.numberSafeCompareFunction;
  return arr.every(function(currentVal, index) {
    if (index === 0) {
      return true;
    }
    var res = compare(arr[index - 1], currentVal);
    return !(res > 0 || opt_strict && res === 0);
  });
};

goog.provide('ol');


/**
 * Constants defined with the define tag cannot be changed in application
 * code, but can be set at compile time.
 * Some reduce the size of the build in advanced compile mode.
 */


/**
 * @define {boolean} Assume touch.  Default is `false`.
 */
ol.ASSUME_TOUCH = false;


/**
 * TODO: rename this to something having to do with tile grids
 * see https://github.com/openlayers/openlayers/issues/2076
 * @define {number} Default maximum zoom for default tile grids.
 */
ol.DEFAULT_MAX_ZOOM = 42;


/**
 * @define {number} Default min zoom level for the map view.  Default is `0`.
 */
ol.DEFAULT_MIN_ZOOM = 0;


/**
 * @define {number} Default maximum allowed threshold  (in pixels) for
 *     reprojection triangulation. Default is `0.5`.
 */
ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD = 0.5;


/**
 * @define {number} Default tile size.
 */
ol.DEFAULT_TILE_SIZE = 256;


/**
 * @define {string} Default WMS version.
 */
ol.DEFAULT_WMS_VERSION = '1.3.0';


/**
 * @define {boolean} Enable the Canvas renderer.  Default is `true`. Setting
 *     this to false at compile time in advanced mode removes all code
 *     supporting the Canvas renderer from the build.
 */
ol.ENABLE_CANVAS = true;


/**
 * @define {boolean} Enable integration with the Proj4js library.  Default is
 *     `true`.
 */
ol.ENABLE_PROJ4JS = true;


/**
 * @define {boolean} Enable automatic reprojection of raster sources. Default is
 *     `true`.
 */
ol.ENABLE_RASTER_REPROJECTION = true;


/**
 * @define {boolean} Enable the WebGL renderer.  Default is `true`. Setting
 *     this to false at compile time in advanced mode removes all code
 *     supporting the WebGL renderer from the build.
 */
ol.ENABLE_WEBGL = true;


/**
 * @define {boolean} Include debuggable shader sources.  Default is `true`.
 *     This should be set to `false` for production builds (if `ol.ENABLE_WEBGL`
 *     is `true`).
 */
ol.DEBUG_WEBGL = true;


/**
 * @define {number} The size in pixels of the first atlas image. Default is
 * `256`.
 */
ol.INITIAL_ATLAS_SIZE = 256;


/**
 * @define {number} The maximum size in pixels of atlas images. Default is
 * `-1`, meaning it is not used (and `ol.WEBGL_MAX_TEXTURE_SIZE` is
 * used instead).
 */
ol.MAX_ATLAS_SIZE = -1;


/**
 * @define {number} Maximum mouse wheel delta.
 */
ol.MOUSEWHEELZOOM_MAXDELTA = 1;


/**
 * @define {number} Maximum width and/or height extent ratio that determines
 * when the overview map should be zoomed out.
 */
ol.OVERVIEWMAP_MAX_RATIO = 0.75;


/**
 * @define {number} Minimum width and/or height extent ratio that determines
 * when the overview map should be zoomed in.
 */
ol.OVERVIEWMAP_MIN_RATIO = 0.1;


/**
 * @define {number} Maximum number of source tiles for raster reprojection of
 *     a single tile.
 *     If too many source tiles are determined to be loaded to create a single
 *     reprojected tile the browser can become unresponsive or even crash.
 *     This can happen if the developer defines projections improperly and/or
 *     with unlimited extents.
 *     If too many tiles are required, no tiles are loaded and
 *     `ol.TileState.ERROR` state is set. Default is `100`.
 */
ol.RASTER_REPROJECTION_MAX_SOURCE_TILES = 100;


/**
 * @define {number} Maximum number of subdivision steps during raster
 *     reprojection triangulation. Prevents high memory usage and large
 *     number of proj4 calls (for certain transformations and areas).
 *     At most `2*(2^this)` triangles are created for each triangulated
 *     extent (tile/image). Default is `10`.
 */
ol.RASTER_REPROJECTION_MAX_SUBDIVISION = 10;


/**
 * @define {number} Maximum allowed size of triangle relative to world width.
 *     When transforming corners of world extent between certain projections,
 *     the resulting triangulation seems to have zero error and no subdivision
 *     is performed.
 *     If the triangle width is more than this (relative to world width; 0-1),
 *     subdivison is forced (up to `ol.RASTER_REPROJECTION_MAX_SUBDIVISION`).
 *     Default is `0.25`.
 */
ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH = 0.25;


/**
 * @define {number} Tolerance for geometry simplification in device pixels.
 */
ol.SIMPLIFY_TOLERANCE = 0.5;


/**
 * @define {number} Texture cache high water mark.
 */
ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;


/**
 * @define {string} OpenLayers version.
 */
ol.VERSION = '';


/**
 * The maximum supported WebGL texture size in pixels. If WebGL is not
 * supported, the value is set to `undefined`.
 * @const
 * @type {number|undefined}
 */
ol.WEBGL_MAX_TEXTURE_SIZE; // value is set in `ol.has`


/**
 * List of supported WebGL extensions.
 * @const
 * @type {Array.<string>}
 */
ol.WEBGL_EXTENSIONS; // value is set in `ol.has`


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 *
 *     function ParentClass(a, b) { }
 *     ParentClass.prototype.foo = function(a) { }
 *
 *     function ChildClass(a, b, c) {
 *       // Call parent constructor
 *       ParentClass.call(this, a, b);
 *     }
 *     ol.inherits(ChildClass, ParentClass);
 *
 *     var child = new ChildClass('a', 'b', 'see');
 *     child.foo(); // This works.
 *
 * @param {!Function} childCtor Child constructor.
 * @param {!Function} parentCtor Parent constructor.
 * @function
 * @api
 */
ol.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
};


/**
 * A reusable function, used e.g. as a default for callbacks.
 *
 * @return {undefined} Nothing.
 */
ol.nullFunction = function() {};


/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
ol.getUid = function(obj) {
  return obj.ol_uid ||
      (obj.ol_uid = ++ol.uidCounter_);
};


/**
 * Counter for getUid.
 * @type {number}
 * @private
 */
ol.uidCounter_ = 0;

goog.provide('ol.AssertionError');

goog.require('ol');

/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 * @constructor
 * @extends {Error}
 * @implements {oli.AssertionError}
 * @param {number} code Error code.
 */
ol.AssertionError = function(code) {

  var path = ol.VERSION ? ol.VERSION.split('-')[0] : 'latest';

  /**
   * @type {string}
   */
  this.message = 'Assertion failed. See https://openlayers.org/en/' + path +
      '/doc/errors/#' + code + ' for details.';

  /**
   * Error code. The meaning of the code can be found on
   * {@link https://openlayers.org/en/latest/doc/errors/} (replace `latest` with
   * the version found in the OpenLayers script's header comment if a version
   * other than the latest is used).
   * @type {number}
   * @api
   */
  this.code = code;

  this.name = 'AssertionError';

};
ol.inherits(ol.AssertionError, Error);

goog.provide('ol.asserts');

goog.require('ol.AssertionError');


/**
 * @param {*} assertion Assertion we expected to be truthy.
 * @param {number} errorCode Error code.
 */
ol.asserts.assert = function(assertion, errorCode) {
  if (!assertion) {
    throw new ol.AssertionError(errorCode);
  }
};

goog.provide('ol.TileRange');


/**
 * A representation of a contiguous block of tiles.  A tile range is specified
 * by its min/max tile coordinates and is inclusive of coordinates.
 *
 * @constructor
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @struct
 */
ol.TileRange = function(minX, maxX, minY, maxY) {

  /**
   * @type {number}
   */
  this.minX = minX;

  /**
   * @type {number}
   */
  this.maxX = maxX;

  /**
   * @type {number}
   */
  this.minY = minY;

  /**
   * @type {number}
   */
  this.maxY = maxY;

};


/**
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @param {ol.TileRange|undefined} tileRange TileRange.
 * @return {ol.TileRange} Tile range.
 */
ol.TileRange.createOrUpdate = function(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== undefined) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  } else {
    return new ol.TileRange(minX, maxX, minY, maxY);
  }
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {boolean} Contains tile coordinate.
 */
ol.TileRange.prototype.contains = function(tileCoord) {
  return this.containsXY(tileCoord[1], tileCoord[2]);
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Contains.
 */
ol.TileRange.prototype.containsTileRange = function(tileRange) {
  return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX &&
      this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
};


/**
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @return {boolean} Contains coordinate.
 */
ol.TileRange.prototype.containsXY = function(x, y) {
  return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Equals.
 */
ol.TileRange.prototype.equals = function(tileRange) {
  return this.minX == tileRange.minX && this.minY == tileRange.minY &&
      this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 */
ol.TileRange.prototype.extend = function(tileRange) {
  if (tileRange.minX < this.minX) {
    this.minX = tileRange.minX;
  }
  if (tileRange.maxX > this.maxX) {
    this.maxX = tileRange.maxX;
  }
  if (tileRange.minY < this.minY) {
    this.minY = tileRange.minY;
  }
  if (tileRange.maxY > this.maxY) {
    this.maxY = tileRange.maxY;
  }
};


/**
 * @return {number} Height.
 */
ol.TileRange.prototype.getHeight = function() {
  return this.maxY - this.minY + 1;
};


/**
 * @return {ol.Size} Size.
 */
ol.TileRange.prototype.getSize = function() {
  return [this.getWidth(), this.getHeight()];
};


/**
 * @return {number} Width.
 */
ol.TileRange.prototype.getWidth = function() {
  return this.maxX - this.minX + 1;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Intersects.
 */
ol.TileRange.prototype.intersects = function(tileRange) {
  return this.minX <= tileRange.maxX &&
      this.maxX >= tileRange.minX &&
      this.minY <= tileRange.maxY &&
      this.maxY >= tileRange.minY;
};

goog.provide('ol.math');

goog.require('ol.asserts');


/**
 * Takes a number and clamps it to within the provided bounds.
 * @param {number} value The input number.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @return {number} The input number if it is within bounds, or the nearest
 *     number within the bounds.
 */
ol.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};


/**
 * Return the hyperbolic cosine of a given number. The method will use the
 * native `Math.cosh` function if it is available, otherwise the hyperbolic
 * cosine will be calculated via the reference implementation of the Mozilla
 * developer network.
 *
 * @param {number} x X.
 * @return {number} Hyperbolic cosine of x.
 */
ol.math.cosh = (function() {
  // Wrapped in a iife, to save the overhead of checking for the native
  // implementation on every invocation.
  var cosh;
  if ('cosh' in Math) {
    // The environment supports the native Math.cosh function, use it…
    cosh = Math.cosh;
  } else {
    // … else, use the reference implementation of MDN:
    cosh = function(x) {
      var y = Math.exp(x);
      return (y + 1 / y) / 2;
    };
  }
  return cosh;
}());


/**
 * @param {number} x X.
 * @return {number} The smallest power of two greater than or equal to x.
 */
ol.math.roundUpToPowerOfTwo = function(x) {
  ol.asserts.assert(0 < x, 29); // `x` must be greater than `0`
  return Math.pow(2, Math.ceil(Math.log(x) / Math.LN2));
};


/**
 * Returns the square of the closest distance between the point (x, y) and the
 * line segment (x1, y1) to (x2, y2).
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.math.squaredSegmentDistance = function(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  return ol.math.squaredDistance(x, y, x1, y1);
};


/**
 * Returns the square of the distance between the points (x1, y1) and (x2, y2).
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.math.squaredDistance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
};


/**
 * Solves system of linear equations using Gaussian elimination method.
 *
 * @param {Array.<Array.<number>>} mat Augmented matrix (n x n + 1 column)
 *                                     in row-major order.
 * @return {Array.<number>} The resulting vector.
 */
ol.math.solveLinearSystem = function(mat) {
  var n = mat.length;

  for (var i = 0; i < n; i++) {
    // Find max in the i-th column (ignoring i - 1 first rows)
    var maxRow = i;
    var maxEl = Math.abs(mat[i][i]);
    for (var r = i + 1; r < n; r++) {
      var absValue = Math.abs(mat[r][i]);
      if (absValue > maxEl) {
        maxEl = absValue;
        maxRow = r;
      }
    }

    if (maxEl === 0) {
      return null; // matrix is singular
    }

    // Swap max row with i-th (current) row
    var tmp = mat[maxRow];
    mat[maxRow] = mat[i];
    mat[i] = tmp;

    // Subtract the i-th row to make all the remaining rows 0 in the i-th column
    for (var j = i + 1; j < n; j++) {
      var coef = -mat[j][i] / mat[i][i];
      for (var k = i; k < n + 1; k++) {
        if (i == k) {
          mat[j][k] = 0;
        } else {
          mat[j][k] += coef * mat[i][k];
        }
      }
    }
  }

  // Solve Ax=b for upper triangular matrix A (mat)
  var x = new Array(n);
  for (var l = n - 1; l >= 0; l--) {
    x[l] = mat[l][n] / mat[l][l];
    for (var m = l - 1; m >= 0; m--) {
      mat[m][n] -= mat[m][l] * x[l];
    }
  }
  return x;
};


/**
 * Converts radians to to degrees.
 *
 * @param {number} angleInRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
ol.math.toDegrees = function(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
};


/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
ol.math.toRadians = function(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
};

/**
 * Returns the modulo of a / b, depending on the sign of b.
 *
 * @param {number} a Dividend.
 * @param {number} b Divisor.
 * @return {number} Modulo.
 */
ol.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};

/**
 * Calculates the linearly interpolated value of x between a and b.
 *
 * @param {number} a Number
 * @param {number} b Number
 * @param {number} x Value to be interpolated.
 * @return {number} Interpolated value.
 */
ol.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};

goog.provide('ol.size');


/**
 * Returns a buffered size.
 * @param {ol.Size} size Size.
 * @param {number} buffer Buffer.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size} The buffered size.
 */
ol.size.buffer = function(size, buffer, opt_size) {
  if (opt_size === undefined) {
    opt_size = [0, 0];
  }
  opt_size[0] = size[0] + 2 * buffer;
  opt_size[1] = size[1] + 2 * buffer;
  return opt_size;
};


/**
 * Determines if a size has a positive area.
 * @param {ol.Size} size The size to test.
 * @return {boolean} The size has a positive area.
 */
ol.size.hasArea = function(size) {
  return size[0] > 0 && size[1] > 0;
};


/**
 * Returns a size scaled by a ratio. The result will be an array of integers.
 * @param {ol.Size} size Size.
 * @param {number} ratio Ratio.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size} The scaled size.
 */
ol.size.scale = function(size, ratio, opt_size) {
  if (opt_size === undefined) {
    opt_size = [0, 0];
  }
  opt_size[0] = (size[0] * ratio + 0.5) | 0;
  opt_size[1] = (size[1] * ratio + 0.5) | 0;
  return opt_size;
};


/**
 * Returns an `ol.Size` array for the passed in number (meaning: square) or
 * `ol.Size` array.
 * (meaning: non-square),
 * @param {number|ol.Size} size Width and height.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size} Size.
 * @api
 */
ol.size.toSize = function(size, opt_size) {
  if (Array.isArray(size)) {
    return size;
  } else {
    if (opt_size === undefined) {
      opt_size = [size, size];
    } else {
      opt_size[0] = opt_size[1] = /** @type {number} */ (size);
    }
    return opt_size;
  }
};

goog.provide('ol.extent.Corner');

/**
 * Extent corner.
 * @enum {string}
 */
ol.extent.Corner = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
};

goog.provide('ol.extent.Relationship');


/**
 * Relationship to an extent.
 * @enum {number}
 */
ol.extent.Relationship = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};

goog.provide('ol.extent');

goog.require('ol.asserts');
goog.require('ol.extent.Corner');
goog.require('ol.extent.Relationship');


/**
 * Build an extent that includes all given coordinates.
 *
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @return {ol.Extent} Bounding extent.
 * @api
 */
ol.extent.boundingExtent = function(coordinates) {
  var extent = ol.extent.createEmpty();
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};


/**
 * @param {Array.<number>} xs Xs.
 * @param {Array.<number>} ys Ys.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @private
 * @return {ol.Extent} Extent.
 */
ol.extent.boundingExtentXYs_ = function(xs, ys, opt_extent) {
  var minX = Math.min.apply(null, xs);
  var minY = Math.min.apply(null, ys);
  var maxX = Math.max.apply(null, xs);
  var maxY = Math.max.apply(null, ys);
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};


/**
 * Return extent increased by the provided value.
 * @param {ol.Extent} extent Extent.
 * @param {number} value The amount by which the extent should be buffered.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.extent.buffer = function(extent, value, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0] - value;
    opt_extent[1] = extent[1] - value;
    opt_extent[2] = extent[2] + value;
    opt_extent[3] = extent[3] + value;
    return opt_extent;
  } else {
    return [
      extent[0] - value,
      extent[1] - value,
      extent[2] + value,
      extent[3] + value
    ];
  }
};


/**
 * Creates a clone of an extent.
 *
 * @param {ol.Extent} extent Extent to clone.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} The clone.
 */
ol.extent.clone = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent.slice();
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {number} Closest squared distance.
 */
ol.extent.closestSquaredDistanceXY = function(extent, x, y) {
  var dx, dy;
  if (x < extent[0]) {
    dx = extent[0] - x;
  } else if (extent[2] < x) {
    dx = x - extent[2];
  } else {
    dx = 0;
  }
  if (y < extent[1]) {
    dy = extent[1] - y;
  } else if (extent[3] < y) {
    dy = y - extent[3];
  } else {
    dy = 0;
  }
  return dx * dx + dy * dy;
};


/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {ol.Extent} extent Extent.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {boolean} The coordinate is contained in the extent.
 * @api
 */
ol.extent.containsCoordinate = function(extent, coordinate) {
  return ol.extent.containsXY(extent, coordinate[0], coordinate[1]);
};


/**
 * Check if one extent contains another.
 *
 * An extent is deemed contained if it lies completely within the other extent,
 * including if they share one or more edges.
 *
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {boolean} The second extent is contained by or on the edge of the
 *     first.
 * @api
 */
ol.extent.containsExtent = function(extent1, extent2) {
  return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
      extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
};


/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {ol.Extent} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 * @api
 */
ol.extent.containsXY = function(extent, x, y) {
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
};


/**
 * Get the relationship between a coordinate and extent.
 * @param {ol.Extent} extent The extent.
 * @param {ol.Coordinate} coordinate The coordinate.
 * @return {number} The relationship (bitwise compare with
 *     ol.extent.Relationship).
 */
ol.extent.coordinateRelationship = function(extent, coordinate) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var x = coordinate[0];
  var y = coordinate[1];
  var relationship = ol.extent.Relationship.UNKNOWN;
  if (x < minX) {
    relationship = relationship | ol.extent.Relationship.LEFT;
  } else if (x > maxX) {
    relationship = relationship | ol.extent.Relationship.RIGHT;
  }
  if (y < minY) {
    relationship = relationship | ol.extent.Relationship.BELOW;
  } else if (y > maxY) {
    relationship = relationship | ol.extent.Relationship.ABOVE;
  }
  if (relationship === ol.extent.Relationship.UNKNOWN) {
    relationship = ol.extent.Relationship.INTERSECTING;
  }
  return relationship;
};


/**
 * Create an empty extent.
 * @return {ol.Extent} Empty extent.
 * @api
 */
ol.extent.createEmpty = function() {
  return [Infinity, Infinity, -Infinity, -Infinity];
};


/**
 * Create a new extent or update the provided extent.
 * @param {number} minX Minimum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxX Maximum X.
 * @param {number} maxY Maximum Y.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = minX;
    opt_extent[1] = minY;
    opt_extent[2] = maxX;
    opt_extent[3] = maxY;
    return opt_extent;
  } else {
    return [minX, minY, maxX, maxY];
  }
};


/**
 * Create a new empty extent or make the provided one empty.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateEmpty = function(opt_extent) {
  return ol.extent.createOrUpdate(
      Infinity, Infinity, -Infinity, -Infinity, opt_extent);
};


/**
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromCoordinate = function(coordinate, opt_extent) {
  var x = coordinate[0];
  var y = coordinate[1];
  return ol.extent.createOrUpdate(x, y, x, y, opt_extent);
};


/**
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromCoordinates = function(coordinates, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendCoordinates(extent, coordinates);
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromFlatCoordinates = function(flatCoordinates, offset, end, stride, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendFlatCoordinates(
      extent, flatCoordinates, offset, end, stride);
};


/**
 * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromRings = function(rings, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendRings(extent, rings);
};


/**
 * Determine if two extents are equivalent.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {boolean} The two extents are equivalent.
 * @api
 */
ol.extent.equals = function(extent1, extent2) {
  return extent1[0] == extent2[0] && extent1[2] == extent2[2] &&
      extent1[1] == extent2[1] && extent1[3] == extent2[3];
};


/**
 * Modify an extent to include another extent.
 * @param {ol.Extent} extent1 The extent to be modified.
 * @param {ol.Extent} extent2 The extent that will be included in the first.
 * @return {ol.Extent} A reference to the first (extended) extent.
 * @api
 */
ol.extent.extend = function(extent1, extent2) {
  if (extent2[0] < extent1[0]) {
    extent1[0] = extent2[0];
  }
  if (extent2[2] > extent1[2]) {
    extent1[2] = extent2[2];
  }
  if (extent2[1] < extent1[1]) {
    extent1[1] = extent2[1];
  }
  if (extent2[3] > extent1[3]) {
    extent1[3] = extent2[3];
  }
  return extent1;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {ol.Coordinate} coordinate Coordinate.
 */
ol.extent.extendCoordinate = function(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0];
  }
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0];
  }
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1];
  }
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1];
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendCoordinates = function(extent, coordinates) {
  var i, ii;
  for (i = 0, ii = coordinates.length; i < ii; ++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendFlatCoordinates = function(extent, flatCoordinates, offset, end, stride) {
  for (; offset < end; offset += stride) {
    ol.extent.extendXY(
        extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendRings = function(extent, rings) {
  var i, ii;
  for (i = 0, ii = rings.length; i < ii; ++i) {
    ol.extent.extendCoordinates(extent, rings[i]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 */
ol.extent.extendXY = function(extent, x, y) {
  extent[0] = Math.min(extent[0], x);
  extent[1] = Math.min(extent[1], y);
  extent[2] = Math.max(extent[2], x);
  extent[3] = Math.max(extent[3], y);
};


/**
 * This function calls `callback` for each corner of the extent. If the
 * callback returns a truthy value the function returns that value
 * immediately. Otherwise the function returns `false`.
 * @param {ol.Extent} extent Extent.
 * @param {function(this:T, ol.Coordinate): S} callback Callback.
 * @param {T=} opt_this Value to use as `this` when executing `callback`.
 * @return {S|boolean} Value.
 * @template S, T
 */
ol.extent.forEachCorner = function(extent, callback, opt_this) {
  var val;
  val = callback.call(opt_this, ol.extent.getBottomLeft(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getBottomRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopLeft(extent));
  if (val) {
    return val;
  }
  return false;
};


/**
 * Get the size of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {number} Area.
 * @api
 */
ol.extent.getArea = function(extent) {
  var area = 0;
  if (!ol.extent.isEmpty(extent)) {
    area = ol.extent.getWidth(extent) * ol.extent.getHeight(extent);
  }
  return area;
};


/**
 * Get the bottom left coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Bottom left coordinate.
 * @api
 */
ol.extent.getBottomLeft = function(extent) {
  return [extent[0], extent[1]];
};


/**
 * Get the bottom right coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Bottom right coordinate.
 * @api
 */
ol.extent.getBottomRight = function(extent) {
  return [extent[2], extent[1]];
};


/**
 * Get the center coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Center.
 * @api
 */
ol.extent.getCenter = function(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
};


/**
 * Get a corner coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @param {ol.extent.Corner} corner Corner.
 * @return {ol.Coordinate} Corner coordinate.
 */
ol.extent.getCorner = function(extent, corner) {
  var coordinate;
  if (corner === ol.extent.Corner.BOTTOM_LEFT) {
    coordinate = ol.extent.getBottomLeft(extent);
  } else if (corner === ol.extent.Corner.BOTTOM_RIGHT) {
    coordinate = ol.extent.getBottomRight(extent);
  } else if (corner === ol.extent.Corner.TOP_LEFT) {
    coordinate = ol.extent.getTopLeft(extent);
  } else if (corner === ol.extent.Corner.TOP_RIGHT) {
    coordinate = ol.extent.getTopRight(extent);
  } else {
    ol.asserts.assert(false, 13); // Invalid corner
  }
  return /** @type {!ol.Coordinate} */ (coordinate);
};


/**
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {number} Enlarged area.
 */
ol.extent.getEnlargedArea = function(extent1, extent2) {
  var minX = Math.min(extent1[0], extent2[0]);
  var minY = Math.min(extent1[1], extent2[1]);
  var maxX = Math.max(extent1[2], extent2[2]);
  var maxY = Math.max(extent1[3], extent2[3]);
  return (maxX - minX) * (maxY - minY);
};


/**
 * @param {ol.Coordinate} center Center.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @param {ol.Size} size Size.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
  var dx = resolution * size[0] / 2;
  var dy = resolution * size[1] / 2;
  var cosRotation = Math.cos(rotation);
  var sinRotation = Math.sin(rotation);
  var xCos = dx * cosRotation;
  var xSin = dx * sinRotation;
  var yCos = dy * cosRotation;
  var ySin = dy * sinRotation;
  var x = center[0];
  var y = center[1];
  var x0 = x - xCos + ySin;
  var x1 = x - xCos - ySin;
  var x2 = x + xCos - ySin;
  var x3 = x + xCos + ySin;
  var y0 = y - xSin - yCos;
  var y1 = y - xSin + yCos;
  var y2 = y + xSin + yCos;
  var y3 = y + xSin - yCos;
  return ol.extent.createOrUpdate(
      Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3),
      Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3),
      opt_extent);
};


/**
 * Get the height of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {number} Height.
 * @api
 */
ol.extent.getHeight = function(extent) {
  return extent[3] - extent[1];
};


/**
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {number} Intersection area.
 */
ol.extent.getIntersectionArea = function(extent1, extent2) {
  var intersection = ol.extent.getIntersection(extent1, extent2);
  return ol.extent.getArea(intersection);
};


/**
 * Get the intersection of two extents.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @param {ol.Extent=} opt_extent Optional extent to populate with intersection.
 * @return {ol.Extent} Intersecting extent.
 * @api
 */
ol.extent.getIntersection = function(extent1, extent2, opt_extent) {
  var intersection = opt_extent ? opt_extent : ol.extent.createEmpty();
  if (ol.extent.intersects(extent1, extent2)) {
    if (extent1[0] > extent2[0]) {
      intersection[0] = extent1[0];
    } else {
      intersection[0] = extent2[0];
    }
    if (extent1[1] > extent2[1]) {
      intersection[1] = extent1[1];
    } else {
      intersection[1] = extent2[1];
    }
    if (extent1[2] < extent2[2]) {
      intersection[2] = extent1[2];
    } else {
      intersection[2] = extent2[2];
    }
    if (extent1[3] < extent2[3]) {
      intersection[3] = extent1[3];
    } else {
      intersection[3] = extent2[3];
    }
  }
  return intersection;
};


/**
 * @param {ol.Extent} extent Extent.
 * @return {number} Margin.
 */
ol.extent.getMargin = function(extent) {
  return ol.extent.getWidth(extent) + ol.extent.getHeight(extent);
};


/**
 * Get the size (width, height) of an extent.
 * @param {ol.Extent} extent The extent.
 * @return {ol.Size} The extent size.
 * @api
 */
ol.extent.getSize = function(extent) {
  return [extent[2] - extent[0], extent[3] - extent[1]];
};


/**
 * Get the top left coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Top left coordinate.
 * @api
 */
ol.extent.getTopLeft = function(extent) {
  return [extent[0], extent[3]];
};


/**
 * Get the top right coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Top right coordinate.
 * @api
 */
ol.extent.getTopRight = function(extent) {
  return [extent[2], extent[3]];
};


/**
 * Get the width of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {number} Width.
 * @api
 */
ol.extent.getWidth = function(extent) {
  return extent[2] - extent[0];
};


/**
 * Determine if one extent intersects another.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 * @api
 */
ol.extent.intersects = function(extent1, extent2) {
  return extent1[0] <= extent2[2] &&
      extent1[2] >= extent2[0] &&
      extent1[1] <= extent2[3] &&
      extent1[3] >= extent2[1];
};


/**
 * Determine if an extent is empty.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} Is empty.
 * @api
 */
ol.extent.isEmpty = function(extent) {
  return extent[2] < extent[0] || extent[3] < extent[1];
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.returnOrUpdate = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent;
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} value Value.
 */
ol.extent.scaleFromCenter = function(extent, value) {
  var deltaX = ((extent[2] - extent[0]) / 2) * (value - 1);
  var deltaY = ((extent[3] - extent[1]) / 2) * (value - 1);
  extent[0] -= deltaX;
  extent[2] += deltaX;
  extent[1] -= deltaY;
  extent[3] += deltaY;
};


/**
 * Determine if the segment between two coordinates intersects (crosses,
 * touches, or is contained by) the provided extent.
 * @param {ol.Extent} extent The extent.
 * @param {ol.Coordinate} start Segment start coordinate.
 * @param {ol.Coordinate} end Segment end coordinate.
 * @return {boolean} The segment intersects the extent.
 */
ol.extent.intersectsSegment = function(extent, start, end) {
  var intersects = false;
  var startRel = ol.extent.coordinateRelationship(extent, start);
  var endRel = ol.extent.coordinateRelationship(extent, end);
  if (startRel === ol.extent.Relationship.INTERSECTING ||
      endRel === ol.extent.Relationship.INTERSECTING) {
    intersects = true;
  } else {
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var startX = start[0];
    var startY = start[1];
    var endX = end[0];
    var endY = end[1];
    var slope = (endY - startY) / (endX - startX);
    var x, y;
    if (!!(endRel & ol.extent.Relationship.ABOVE) &&
        !(startRel & ol.extent.Relationship.ABOVE)) {
      // potentially intersects top
      x = endX - ((endY - maxY) / slope);
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.RIGHT) &&
        !(startRel & ol.extent.Relationship.RIGHT)) {
      // potentially intersects right
      y = endY - ((endX - maxX) * slope);
      intersects = y >= minY && y <= maxY;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.BELOW) &&
        !(startRel & ol.extent.Relationship.BELOW)) {
      // potentially intersects bottom
      x = endX - ((endY - minY) / slope);
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.LEFT) &&
        !(startRel & ol.extent.Relationship.LEFT)) {
      // potentially intersects left
      y = endY - ((endX - minX) * slope);
      intersects = y >= minY && y <= maxY;
    }

  }
  return intersects;
};


/**
 * Apply a transform function to the extent.
 * @param {ol.Extent} extent Extent.
 * @param {ol.TransformFunction} transformFn Transform function.  Called with
 * [minX, minY, maxX, maxY] extent coordinates.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.extent.applyTransform = function(extent, transformFn, opt_extent) {
  var coordinates = [
    extent[0], extent[1],
    extent[0], extent[3],
    extent[2], extent[1],
    extent[2], extent[3]
  ];
  transformFn(coordinates, coordinates, 2);
  var xs = [coordinates[0], coordinates[2], coordinates[4], coordinates[6]];
  var ys = [coordinates[1], coordinates[3], coordinates[5], coordinates[7]];
  return ol.extent.boundingExtentXYs_(xs, ys, opt_extent);
};

goog.provide('ol.obj');


/**
 * Polyfill for Object.assign().  Assigns enumerable and own properties from
 * one or more source objects to a target object.
 *
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param {!Object} target The target object.
 * @param {...Object} var_sources The source object(s).
 * @return {!Object} The modified target object.
 */
ol.obj.assign = (typeof Object.assign === 'function') ? Object.assign : function(target, var_sources) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var i = 1, ii = arguments.length; i < ii; ++i) {
    var source = arguments[i];
    if (source !== undefined && source !== null) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          output[key] = source[key];
        }
      }
    }
  }
  return output;
};


/**
 * Removes all properties from an object.
 * @param {Object} object The object to clear.
 */
ol.obj.clear = function(object) {
  for (var property in object) {
    delete object[property];
  }
};


/**
 * Get an array of property values from an object.
 * @param {Object<K,V>} object The object from which to get the values.
 * @return {!Array<V>} The property values.
 * @template K,V
 */
ol.obj.getValues = function(object) {
  var values = [];
  for (var property in object) {
    values.push(object[property]);
  }
  return values;
};


/**
 * Determine if an object has any properties.
 * @param {Object} object The object to check.
 * @return {boolean} The object is empty.
 */
ol.obj.isEmpty = function(object) {
  var property;
  for (property in object) {
    return false;
  }
  return !property;
};

goog.provide('ol.geom.GeometryType');


/**
 * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`,
 * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
 * `'GeometryCollection'`, `'Circle'`.
 * @enum {string}
 */
ol.geom.GeometryType = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  LINEAR_RING: 'LinearRing',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle'
};

/**
 * @license
 * Latitude/longitude spherical geodesy formulae taken from
 * http://www.movable-type.co.uk/scripts/latlong.html
 * Licensed under CC-BY-3.0.
 */

goog.provide('ol.Sphere');

goog.require('ol.math');
goog.require('ol.geom.GeometryType');


/**
 * @classdesc
 * Class to create objects that can be used with {@link
 * ol.geom.Polygon.circular}.
 *
 * For example to create a sphere whose radius is equal to the semi-major
 * axis of the WGS84 ellipsoid:
 *
 * ```js
 * var wgs84Sphere= new ol.Sphere(6378137);
 * ```
 *
 * @constructor
 * @param {number} radius Radius.
 * @api
 */
ol.Sphere = function(radius) {

  /**
   * @type {number}
   */
  this.radius = radius;

};


/**
 * Returns the geodesic area for a list of coordinates.
 *
 * [Reference](https://trs-new.jpl.nasa.gov/handle/2014/40409)
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 * Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007
 *
 * @param {Array.<ol.Coordinate>} coordinates List of coordinates of a linear
 * ring. If the ring is oriented clockwise, the area will be positive,
 * otherwise it will be negative.
 * @return {number} Area.
 * @api
 */
ol.Sphere.prototype.geodesicArea = function(coordinates) {
  return ol.Sphere.getArea_(coordinates, this.radius);
};


/**
 * Returns the distance from c1 to c2 using the haversine formula.
 *
 * @param {ol.Coordinate} c1 Coordinate 1.
 * @param {ol.Coordinate} c2 Coordinate 2.
 * @return {number} Haversine distance.
 * @api
 */
ol.Sphere.prototype.haversineDistance = function(c1, c2) {
  return ol.Sphere.getDistance_(c1, c2, this.radius);
};


/**
 * Returns the coordinate at the given distance and bearing from `c1`.
 *
 * @param {ol.Coordinate} c1 The origin point (`[lon, lat]` in degrees).
 * @param {number} distance The great-circle distance between the origin
 *     point and the target point.
 * @param {number} bearing The bearing (in radians).
 * @return {ol.Coordinate} The target point.
 */
ol.Sphere.prototype.offset = function(c1, distance, bearing) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lon1 = ol.math.toRadians(c1[0]);
  var dByR = distance / this.radius;
  var lat = Math.asin(
      Math.sin(lat1) * Math.cos(dByR) +
      Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
  var lon = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
  return [ol.math.toDegrees(lon), ol.math.toDegrees(lat)];
};


/**
 * The mean Earth radius (1/3 * (2a + b)) for the WGS84 ellipsoid.
 * https://en.wikipedia.org/wiki/Earth_radius#Mean_radius
 * @type {number}
 */
ol.Sphere.DEFAULT_RADIUS = 6371008.8;


/**
 * Get the spherical length of a geometry.  This length is the sum of the
 * great circle distances between coordinates.  For polygons, the length is
 * the sum of all rings.  For points, the length is zero.  For multi-part
 * geometries, the length is the sum of the length of each part.
 * @param {ol.geom.Geometry} geometry A geometry.
 * @param {olx.SphereMetricOptions=} opt_options Options for the length
 *     calculation.  By default, geometries are assumed to be in 'EPSG:3857'.
 *     You can change this by providing a `projection` option.
 * @return {number} The spherical length (in meters).
 * @api
 */
ol.Sphere.getLength = function(geometry, opt_options) {
  var options = opt_options || {};
  var radius = options.radius || ol.Sphere.DEFAULT_RADIUS;
  var projection = options.projection || 'EPSG:3857';
  geometry = geometry.clone().transform(projection, 'EPSG:4326');
  var type = geometry.getType();
  var length = 0;
  var coordinates, coords, i, ii, j, jj;
  switch (type) {
    case ol.geom.GeometryType.POINT:
    case ol.geom.GeometryType.MULTI_POINT: {
      break;
    }
    case ol.geom.GeometryType.LINE_STRING:
    case ol.geom.GeometryType.LINEAR_RING: {
      coordinates = /** @type {ol.geom.SimpleGeometry} */ (geometry).getCoordinates();
      length = ol.Sphere.getLength_(coordinates, radius);
      break;
    }
    case ol.geom.GeometryType.MULTI_LINE_STRING:
    case ol.geom.GeometryType.POLYGON: {
      coordinates = /** @type {ol.geom.SimpleGeometry} */ (geometry).getCoordinates();
      for (i = 0, ii = coordinates.length; i < ii; ++i) {
        length += ol.Sphere.getLength_(coordinates[i], radius);
      }
      break;
    }
    case ol.geom.GeometryType.MULTI_POLYGON: {
      coordinates = /** @type {ol.geom.SimpleGeometry} */ (geometry).getCoordinates();
      for (i = 0, ii = coordinates.length; i < ii; ++i) {
        coords = coordinates[i];
        for (j = 0, jj = coords.length; j < jj; ++j) {
          length += ol.Sphere.getLength_(coords[j], radius);
        }
      }
      break;
    }
    case ol.geom.GeometryType.GEOMETRY_COLLECTION: {
      var geometries = /** @type {ol.geom.GeometryCollection} */ (geometry).getGeometries();
      for (i = 0, ii = geometries.length; i < ii; ++i) {
        length += ol.Sphere.getLength(geometries[i], opt_options);
      }
      break;
    }
    default: {
      throw new Error('Unsupported geometry type: ' + type);
    }
  }
  return length;
};


/**
 * Get the cumulative great circle length of linestring coordinates (geographic).
 * @param {Array} coordinates Linestring coordinates.
 * @param {number} radius The sphere radius to use.
 * @return {number} The length (in meters).
 */
ol.Sphere.getLength_ = function(coordinates, radius) {
  var length = 0;
  for (var i = 0, ii = coordinates.length; i < ii - 1; ++i) {
    length += ol.Sphere.getDistance_(coordinates[i], coordinates[i + 1], radius);
  }
  return length;
};


/**
 * Get the great circle distance between two geographic coordinates.
 * @param {Array} c1 Starting coordinate.
 * @param {Array} c2 Ending coordinate.
 * @param {number} radius The sphere radius to use.
 * @return {number} The great circle distance between the points (in meters).
 */
ol.Sphere.getDistance_ = function(c1, c2, radius) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lat2 = ol.math.toRadians(c2[1]);
  var deltaLatBy2 = (lat2 - lat1) / 2;
  var deltaLonBy2 = ol.math.toRadians(c2[0] - c1[0]) / 2;
  var a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) +
      Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) *
      Math.cos(lat1) * Math.cos(lat2);
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


/**
 * Get the spherical area of a geometry.  This is the area (in meters) assuming
 * that polygon edges are segments of great circles on a sphere.
 * @param {ol.geom.Geometry} geometry A geometry.
 * @param {olx.SphereMetricOptions=} opt_options Options for the area
 *     calculation.  By default, geometries are assumed to be in 'EPSG:3857'.
 *     You can change this by providing a `projection` option.
 * @return {number} The spherical area (in square meters).
 * @api
 */
ol.Sphere.getArea = function(geometry, opt_options) {
  var options = opt_options || {};
  var radius = options.radius || ol.Sphere.DEFAULT_RADIUS;
  var projection = options.projection || 'EPSG:3857';
  geometry = geometry.clone().transform(projection, 'EPSG:4326');
  var type = geometry.getType();
  var area = 0;
  var coordinates, coords, i, ii, j, jj;
  switch (type) {
    case ol.geom.GeometryType.POINT:
    case ol.geom.GeometryType.MULTI_POINT:
    case ol.geom.GeometryType.LINE_STRING:
    case ol.geom.GeometryType.MULTI_LINE_STRING:
    case ol.geom.GeometryType.LINEAR_RING: {
      break;
    }
    case ol.geom.GeometryType.POLYGON: {
      coordinates = /** @type {ol.geom.Polygon} */ (geometry).getCoordinates();
      area = Math.abs(ol.Sphere.getArea_(coordinates[0], radius));
      for (i = 1, ii = coordinates.length; i < ii; ++i) {
        area -= Math.abs(ol.Sphere.getArea_(coordinates[i], radius));
      }
      break;
    }
    case ol.geom.GeometryType.MULTI_POLYGON: {
      coordinates = /** @type {ol.geom.SimpleGeometry} */ (geometry).getCoordinates();
      for (i = 0, ii = coordinates.length; i < ii; ++i) {
        coords = coordinates[i];
        area += Math.abs(ol.Sphere.getArea_(coords[0], radius));
        for (j = 1, jj = coords.length; j < jj; ++j) {
          area -= Math.abs(ol.Sphere.getArea_(coords[j], radius));
        }
      }
      break;
    }
    case ol.geom.GeometryType.GEOMETRY_COLLECTION: {
      var geometries = /** @type {ol.geom.GeometryCollection} */ (geometry).getGeometries();
      for (i = 0, ii = geometries.length; i < ii; ++i) {
        area += ol.Sphere.getArea(geometries[i], opt_options);
      }
      break;
    }
    default: {
      throw new Error('Unsupported geometry type: ' + type);
    }
  }
  return area;
};


/**
 * Returns the spherical area for a list of coordinates.
 *
 * [Reference](https://trs-new.jpl.nasa.gov/handle/2014/40409)
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 * Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007
 *
 * @param {Array.<ol.Coordinate>} coordinates List of coordinates of a linear
 * ring. If the ring is oriented clockwise, the area will be positive,
 * otherwise it will be negative.
 * @param {number} radius The sphere radius.
 * @return {number} Area (in square meters).
 */
ol.Sphere.getArea_ = function(coordinates, radius) {
  var area = 0, len = coordinates.length;
  var x1 = coordinates[len - 1][0];
  var y1 = coordinates[len - 1][1];
  for (var i = 0; i < len; i++) {
    var x2 = coordinates[i][0], y2 = coordinates[i][1];
    area += ol.math.toRadians(x2 - x1) *
        (2 + Math.sin(ol.math.toRadians(y1)) +
        Math.sin(ol.math.toRadians(y2)));
    x1 = x2;
    y1 = y2;
  }
  return area * radius * radius / 2.0;
};

goog.provide('ol.proj.Units');


/**
 * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
 * `'us-ft'`.
 * @enum {string}
 */
ol.proj.Units = {
  DEGREES: 'degrees',
  FEET: 'ft',
  METERS: 'm',
  PIXELS: 'pixels',
  TILE_PIXELS: 'tile-pixels',
  USFEET: 'us-ft'
};


/**
 * Meters per unit lookup table.
 * @const
 * @type {Object.<ol.proj.Units, number>}
 * @api
 */
ol.proj.Units.METERS_PER_UNIT = {};
// use the radius of the Normal sphere
ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.DEGREES] =
    2 * Math.PI * 6370997 / 360;
ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.FEET] = 0.3048;
ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.METERS] = 1;
ol.proj.Units.METERS_PER_UNIT[ol.proj.Units.USFEET] = 1200 / 3937;

goog.provide('ol.proj.proj4');


/**
 * @private
 * @type {Proj4}
 */
ol.proj.proj4.cache_ = null;


/**
 * Store the proj4 function.
 * @param {Proj4} proj4 The proj4 function.
 */
ol.proj.proj4.set = function(proj4) {
  ol.proj.proj4.cache_ = proj4;
};


/**
 * Get proj4.
 * @return {Proj4} The proj4 function set above or available globally.
 */
ol.proj.proj4.get = function() {
  return ol.proj.proj4.cache_ || window['proj4'];
};

goog.provide('ol.proj.Projection');

goog.require('ol');
goog.require('ol.proj.Units');
goog.require('ol.proj.proj4');


/**
 * @classdesc
 * Projection definition class. One of these is created for each projection
 * supported in the application and stored in the {@link ol.proj} namespace.
 * You can use these in applications, but this is not required, as API params
 * and options use {@link ol.ProjectionLike} which means the simple string
 * code will suffice.
 *
 * You can use {@link ol.proj.get} to retrieve the object for a particular
 * projection.
 *
 * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
 * with the following aliases:
 * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
 *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
 *     http://www.opengis.net/gml/srs/epsg.xml#4326,
 *     urn:x-ogc:def:crs:EPSG:4326
 * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
 *     urn:ogc:def:crs:EPSG:6.18:3:3857,
 *     http://www.opengis.net/gml/srs/epsg.xml#3857
 *
 * If you use proj4js, aliases can be added using `proj4.defs()`; see
 * [documentation](https://github.com/proj4js/proj4js). To set an alternative
 * namespace for proj4, use {@link ol.proj.setProj4}.
 *
 * @constructor
 * @param {olx.ProjectionOptions} options Projection options.
 * @struct
 * @api
 */
ol.proj.Projection = function(options) {
  /**
   * @private
   * @type {string}
   */
  this.code_ = options.code;

  /**
   * Units of projected coordinates. When set to `ol.proj.Units.TILE_PIXELS`, a
   * `this.extent_` and `this.worldExtent_` must be configured properly for each
   * tile.
   * @private
   * @type {ol.proj.Units}
   */
  this.units_ = /** @type {ol.proj.Units} */ (options.units);

  /**
   * Validity extent of the projection in projected coordinates. For projections
   * with `ol.proj.Units.TILE_PIXELS` units, this is the extent of the tile in
   * tile pixel space.
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = options.extent !== undefined ? options.extent : null;

  /**
   * Extent of the world in EPSG:4326. For projections with
   * `ol.proj.Units.TILE_PIXELS` units, this is the extent of the tile in
   * projected coordinate space.
   * @private
   * @type {ol.Extent}
   */
  this.worldExtent_ = options.worldExtent !== undefined ?
    options.worldExtent : null;

  /**
   * @private
   * @type {string}
   */
  this.axisOrientation_ = options.axisOrientation !== undefined ?
    options.axisOrientation : 'enu';

  /**
   * @private
   * @type {boolean}
   */
  this.global_ = options.global !== undefined ? options.global : false;

  /**
   * @private
   * @type {boolean}
   */
  this.canWrapX_ = !!(this.global_ && this.extent_);

  /**
   * @private
   * @type {function(number, ol.Coordinate):number|undefined}
   */
  this.getPointResolutionFunc_ = options.getPointResolution;

  /**
   * @private
   * @type {ol.tilegrid.TileGrid}
   */
  this.defaultTileGrid_ = null;

  /**
   * @private
   * @type {number|undefined}
   */
  this.metersPerUnit_ = options.metersPerUnit;

  var code = options.code;
  if (ol.ENABLE_PROJ4JS) {
    var proj4js = ol.proj.proj4.get();
    if (typeof proj4js == 'function') {
      var def = proj4js.defs(code);
      if (def !== undefined) {
        if (def.axis !== undefined && options.axisOrientation === undefined) {
          this.axisOrientation_ = def.axis;
        }
        if (options.metersPerUnit === undefined) {
          this.metersPerUnit_ = def.to_meter;
        }
        if (options.units === undefined) {
          this.units_ = def.units;
        }
      }
    }
  }
};


/**
 * @return {boolean} The projection is suitable for wrapping the x-axis
 */
ol.proj.Projection.prototype.canWrapX = function() {
  return this.canWrapX_;
};


/**
 * Get the code for this projection, e.g. 'EPSG:4326'.
 * @return {string} Code.
 * @api
 */
ol.proj.Projection.prototype.getCode = function() {
  return this.code_;
};


/**
 * Get the validity extent for this projection.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.proj.Projection.prototype.getExtent = function() {
  return this.extent_;
};


/**
 * Get the units of this projection.
 * @return {ol.proj.Units} Units.
 * @api
 */
ol.proj.Projection.prototype.getUnits = function() {
  return this.units_;
};


/**
 * Get the amount of meters per unit of this projection.  If the projection is
 * not configured with `metersPerUnit` or a units identifier, the return is
 * `undefined`.
 * @return {number|undefined} Meters.
 * @api
 */
ol.proj.Projection.prototype.getMetersPerUnit = function() {
  return this.metersPerUnit_ || ol.proj.Units.METERS_PER_UNIT[this.units_];
};


/**
 * Get the world extent for this projection.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.proj.Projection.prototype.getWorldExtent = function() {
  return this.worldExtent_;
};


/**
 * Get the axis orientation of this projection.
 * Example values are:
 * enu - the default easting, northing, elevation.
 * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
 *     or south orientated transverse mercator.
 * wnu - westing, northing, up - some planetary coordinate systems have
 *     "west positive" coordinate systems
 * @return {string} Axis orientation.
 * @api
 */
ol.proj.Projection.prototype.getAxisOrientation = function() {
  return this.axisOrientation_;
};


/**
 * Is this projection a global projection which spans the whole world?
 * @return {boolean} Whether the projection is global.
 * @api
 */
ol.proj.Projection.prototype.isGlobal = function() {
  return this.global_;
};


/**
* Set if the projection is a global projection which spans the whole world
* @param {boolean} global Whether the projection is global.
* @api
*/
ol.proj.Projection.prototype.setGlobal = function(global) {
  this.global_ = global;
  this.canWrapX_ = !!(global && this.extent_);
};


/**
 * @return {ol.tilegrid.TileGrid} The default tile grid.
 */
ol.proj.Projection.prototype.getDefaultTileGrid = function() {
  return this.defaultTileGrid_;
};


/**
 * @param {ol.tilegrid.TileGrid} tileGrid The default tile grid.
 */
ol.proj.Projection.prototype.setDefaultTileGrid = function(tileGrid) {
  this.defaultTileGrid_ = tileGrid;
};


/**
 * Set the validity extent for this projection.
 * @param {ol.Extent} extent Extent.
 * @api
 */
ol.proj.Projection.prototype.setExtent = function(extent) {
  this.extent_ = extent;
  this.canWrapX_ = !!(this.global_ && extent);
};


/**
 * Set the world extent for this projection.
 * @param {ol.Extent} worldExtent World extent
 *     [minlon, minlat, maxlon, maxlat].
 * @api
 */
ol.proj.Projection.prototype.setWorldExtent = function(worldExtent) {
  this.worldExtent_ = worldExtent;
};


/**
 * Set the getPointResolution function (see {@link ol.proj#getPointResolution}
 * for this projection.
 * @param {function(number, ol.Coordinate):number} func Function
 * @api
 */
ol.proj.Projection.prototype.setGetPointResolution = function(func) {
  this.getPointResolutionFunc_ = func;
};


/**
 * Get the custom point resolution function for this projection (if set).
 * @return {function(number, ol.Coordinate):number|undefined} The custom point
 * resolution function (if set).
 */
ol.proj.Projection.prototype.getPointResolutionFunc = function() {
  return this.getPointResolutionFunc_;
};

goog.provide('ol.proj.EPSG3857');

goog.require('ol');
goog.require('ol.math');
goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');


/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 *
 * @constructor
 * @extends {ol.proj.Projection}
 * @param {string} code Code.
 * @private
 */
ol.proj.EPSG3857.Projection_ = function(code) {
  ol.proj.Projection.call(this, {
    code: code,
    units: ol.proj.Units.METERS,
    extent: ol.proj.EPSG3857.EXTENT,
    global: true,
    worldExtent: ol.proj.EPSG3857.WORLD_EXTENT,
    getPointResolution: function(resolution, point) {
      return resolution / ol.math.cosh(point[1] / ol.proj.EPSG3857.RADIUS);
    }
  });
};
ol.inherits(ol.proj.EPSG3857.Projection_, ol.proj.Projection);


/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
ol.proj.EPSG3857.RADIUS = 6378137;


/**
 * @const
 * @type {number}
 */
ol.proj.EPSG3857.HALF_SIZE = Math.PI * ol.proj.EPSG3857.RADIUS;


/**
 * @const
 * @type {ol.Extent}
 */
ol.proj.EPSG3857.EXTENT = [
  -ol.proj.EPSG3857.HALF_SIZE, -ol.proj.EPSG3857.HALF_SIZE,
  ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE
];


/**
 * @const
 * @type {ol.Extent}
 */
ol.proj.EPSG3857.WORLD_EXTENT = [-180, -85, 180, 85];


/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array.<ol.proj.Projection>}
 */
ol.proj.EPSG3857.PROJECTIONS = [
  new ol.proj.EPSG3857.Projection_('EPSG:3857'),
  new ol.proj.EPSG3857.Projection_('EPSG:102100'),
  new ol.proj.EPSG3857.Projection_('EPSG:102113'),
  new ol.proj.EPSG3857.Projection_('EPSG:900913'),
  new ol.proj.EPSG3857.Projection_('urn:ogc:def:crs:EPSG:6.18:3:3857'),
  new ol.proj.EPSG3857.Projection_('urn:ogc:def:crs:EPSG::3857'),
  new ol.proj.EPSG3857.Projection_('http://www.opengis.net/gml/srs/epsg.xml#3857')
];


/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array.<number>} input Input array of coordinate values.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array.<number>} Output array of coordinate values.
 */
ol.proj.EPSG3857.fromEPSG4326 = function(input, opt_output, opt_dimension) {
  var length = input.length,
      dimension = opt_dimension > 1 ? opt_dimension : 2,
      output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  var halfSize = ol.proj.EPSG3857.HALF_SIZE;
  for (var i = 0; i < length; i += dimension) {
    output[i] = halfSize * input[i] / 180;
    var y = ol.proj.EPSG3857.RADIUS *
        Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
    if (y > halfSize) {
      y = halfSize;
    } else if (y < -halfSize) {
      y = -halfSize;
    }
    output[i + 1] = y;
  }
  return output;
};


/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array.<number>} input Input array of coordinate values.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array.<number>} Output array of coordinate values.
 */
ol.proj.EPSG3857.toEPSG4326 = function(input, opt_output, opt_dimension) {
  var length = input.length,
      dimension = opt_dimension > 1 ? opt_dimension : 2,
      output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (var i = 0; i < length; i += dimension) {
    output[i] = 180 * input[i] / ol.proj.EPSG3857.HALF_SIZE;
    output[i + 1] = 360 * Math.atan(
        Math.exp(input[i + 1] / ol.proj.EPSG3857.RADIUS)) / Math.PI - 90;
  }
  return output;
};

goog.provide('ol.proj.EPSG4326');

goog.require('ol');
goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');


/**
 * @classdesc
 * Projection object for WGS84 geographic coordinates (EPSG:4326).
 *
 * Note that OpenLayers does not strictly comply with the EPSG definition.
 * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
 * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
 *
 * @constructor
 * @extends {ol.proj.Projection}
 * @param {string} code Code.
 * @param {string=} opt_axisOrientation Axis orientation.
 * @private
 */
ol.proj.EPSG4326.Projection_ = function(code, opt_axisOrientation) {
  ol.proj.Projection.call(this, {
    code: code,
    units: ol.proj.Units.DEGREES,
    extent: ol.proj.EPSG4326.EXTENT,
    axisOrientation: opt_axisOrientation,
    global: true,
    metersPerUnit: ol.proj.EPSG4326.METERS_PER_UNIT,
    worldExtent: ol.proj.EPSG4326.EXTENT
  });
};
ol.inherits(ol.proj.EPSG4326.Projection_, ol.proj.Projection);


/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
ol.proj.EPSG4326.RADIUS = 6378137;


/**
 * Extent of the EPSG:4326 projection which is the whole world.
 *
 * @const
 * @type {ol.Extent}
 */
ol.proj.EPSG4326.EXTENT = [-180, -90, 180, 90];


/**
 * @const
 * @type {number}
 */
ol.proj.EPSG4326.METERS_PER_UNIT = Math.PI * ol.proj.EPSG4326.RADIUS / 180;


/**
 * Projections equal to EPSG:4326.
 *
 * @const
 * @type {Array.<ol.proj.Projection>}
 */
ol.proj.EPSG4326.PROJECTIONS = [
  new ol.proj.EPSG4326.Projection_('CRS:84'),
  new ol.proj.EPSG4326.Projection_('EPSG:4326', 'neu'),
  new ol.proj.EPSG4326.Projection_('urn:ogc:def:crs:EPSG::4326', 'neu'),
  new ol.proj.EPSG4326.Projection_('urn:ogc:def:crs:EPSG:6.6:4326', 'neu'),
  new ol.proj.EPSG4326.Projection_('urn:ogc:def:crs:OGC:1.3:CRS84'),
  new ol.proj.EPSG4326.Projection_('urn:ogc:def:crs:OGC:2:84'),
  new ol.proj.EPSG4326.Projection_('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
  new ol.proj.EPSG4326.Projection_('urn:x-ogc:def:crs:EPSG:4326', 'neu')
];

goog.provide('ol.proj.projections');


/**
 * @private
 * @type {Object.<string, ol.proj.Projection>}
 */
ol.proj.projections.cache_ = {};


/**
 * Clear the projections cache.
 */
ol.proj.projections.clear = function() {
  ol.proj.projections.cache_ = {};
};


/**
 * Get a cached projection by code.
 * @param {string} code The code for the projection.
 * @return {ol.proj.Projection} The projection (if cached).
 */
ol.proj.projections.get = function(code) {
  var projections = ol.proj.projections.cache_;
  return projections[code] || null;
};


/**
 * Add a projection to the cache.
 * @param {string} code The projection code.
 * @param {ol.proj.Projection} projection The projection to cache.
 */
ol.proj.projections.add = function(code, projection) {
  var projections = ol.proj.projections.cache_;
  projections[code] = projection;
};

goog.provide('ol.proj.transforms');

goog.require('ol.obj');


/**
 * @private
 * @type {Object.<string, Object.<string, ol.TransformFunction>>}
 */
ol.proj.transforms.cache_ = {};


/**
 * Clear the transform cache.
 */
ol.proj.transforms.clear = function() {
  ol.proj.transforms.cache_ = {};
};


/**
 * Registers a conversion function to convert coordinates from the source
 * projection to the destination projection.
 *
 * @param {ol.proj.Projection} source Source.
 * @param {ol.proj.Projection} destination Destination.
 * @param {ol.TransformFunction} transformFn Transform.
 */
ol.proj.transforms.add = function(source, destination, transformFn) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms.cache_;
  if (!(sourceCode in transforms)) {
    transforms[sourceCode] = {};
  }
  transforms[sourceCode][destinationCode] = transformFn;
};


/**
 * Unregisters the conversion function to convert coordinates from the source
 * projection to the destination projection.  This method is used to clean up
 * cached transforms during testing.
 *
 * @param {ol.proj.Projection} source Source projection.
 * @param {ol.proj.Projection} destination Destination projection.
 * @return {ol.TransformFunction} transformFn The unregistered transform.
 */
ol.proj.transforms.remove = function(source, destination) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms.cache_;
  var transform = transforms[sourceCode][destinationCode];
  delete transforms[sourceCode][destinationCode];
  if (ol.obj.isEmpty(transforms[sourceCode])) {
    delete transforms[sourceCode];
  }
  return transform;
};


/**
 * Get a transform given a source code and a destination code.
 * @param {string} sourceCode The code for the source projection.
 * @param {string} destinationCode The code for the destination projection.
 * @return {ol.TransformFunction|undefined} The transform function (if found).
 */
ol.proj.transforms.get = function(sourceCode, destinationCode) {
  var transform;
  var transforms = ol.proj.transforms.cache_;
  if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
    transform = transforms[sourceCode][destinationCode];
  }
  return transform;
};

goog.provide('ol.proj');

goog.require('ol');
goog.require('ol.Sphere');
goog.require('ol.extent');
goog.require('ol.math');
goog.require('ol.proj.EPSG3857');
goog.require('ol.proj.EPSG4326');
goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');
goog.require('ol.proj.proj4');
goog.require('ol.proj.projections');
goog.require('ol.proj.transforms');


/**
 * Meters per unit lookup table.
 * @const
 * @type {Object.<ol.proj.Units, number>}
 * @api
 */
ol.proj.METERS_PER_UNIT = ol.proj.Units.METERS_PER_UNIT;


/**
 * A place to store the mean radius of the Earth.
 * @private
 * @type {ol.Sphere}
 */
ol.proj.SPHERE_ = new ol.Sphere(ol.Sphere.DEFAULT_RADIUS);


if (ol.ENABLE_PROJ4JS) {
  /**
   * Register proj4. If not explicitly registered, it will be assumed that
   * proj4js will be loaded in the global namespace. For example in a
   * browserify ES6 environment you could use:
   *
   *     import ol from 'openlayers';
   *     import proj4 from 'proj4';
   *     ol.proj.setProj4(proj4);
   *
   * @param {Proj4} proj4 Proj4.
   * @api
   */
  ol.proj.setProj4 = function(proj4) {
    ol.proj.proj4.set(proj4);
  };
}


/**
 * Get the resolution of the point in degrees or distance units.
 * For projections with degrees as the unit this will simply return the
 * provided resolution. For other projections the point resolution is
 * by default estimated by transforming the 'point' pixel to EPSG:4326,
 * measuring its width and height on the normal sphere,
 * and taking the average of the width and height.
 * A custom function can be provided for a specific projection, either
 * by setting the `getPointResolution` option in the
 * {@link ol.proj.Projection} constructor or by using
 * {@link ol.proj.Projection#setGetPointResolution} to change an existing
 * projection object.
 * @param {ol.ProjectionLike} projection The projection.
 * @param {number} resolution Nominal resolution in projection units.
 * @param {ol.Coordinate} point Point to find adjusted resolution at.
 * @param {ol.proj.Units=} opt_units Units to get the point resolution in.
 * Default is the projection's units.
 * @return {number} Point resolution.
 * @api
 */
ol.proj.getPointResolution = function(projection, resolution, point, opt_units) {
  projection = ol.proj.get(projection);
  var pointResolution;
  var getter = projection.getPointResolutionFunc();
  if (getter) {
    pointResolution = getter(resolution, point);
  } else {
    var units = projection.getUnits();
    if (units == ol.proj.Units.DEGREES && !opt_units || opt_units == ol.proj.Units.DEGREES) {
      pointResolution = resolution;
    } else {
      // Estimate point resolution by transforming the center pixel to EPSG:4326,
      // measuring its width and height on the normal sphere, and taking the
      // average of the width and height.
      var toEPSG4326 = ol.proj.getTransformFromProjections(projection, ol.proj.get('EPSG:4326'));
      var vertices = [
        point[0] - resolution / 2, point[1],
        point[0] + resolution / 2, point[1],
        point[0], point[1] - resolution / 2,
        point[0], point[1] + resolution / 2
      ];
      vertices = toEPSG4326(vertices, vertices, 2);
      var width = ol.proj.SPHERE_.haversineDistance(
          vertices.slice(0, 2), vertices.slice(2, 4));
      var height = ol.proj.SPHERE_.haversineDistance(
          vertices.slice(4, 6), vertices.slice(6, 8));
      pointResolution = (width + height) / 2;
      var metersPerUnit = opt_units ?
        ol.proj.Units.METERS_PER_UNIT[opt_units] :
        projection.getMetersPerUnit();
      if (metersPerUnit !== undefined) {
        pointResolution /= metersPerUnit;
      }
    }
  }
  return pointResolution;
};


/**
 * Registers transformation functions that don't alter coordinates. Those allow
 * to transform between projections with equal meaning.
 *
 * @param {Array.<ol.proj.Projection>} projections Projections.
 * @api
 */
ol.proj.addEquivalentProjections = function(projections) {
  ol.proj.addProjections(projections);
  projections.forEach(function(source) {
    projections.forEach(function(destination) {
      if (source !== destination) {
        ol.proj.transforms.add(source, destination, ol.proj.cloneTransform);
      }
    });
  });
};


/**
 * Registers transformation functions to convert coordinates in any projection
 * in projection1 to any projection in projection2.
 *
 * @param {Array.<ol.proj.Projection>} projections1 Projections with equal
 *     meaning.
 * @param {Array.<ol.proj.Projection>} projections2 Projections with equal
 *     meaning.
 * @param {ol.TransformFunction} forwardTransform Transformation from any
 *   projection in projection1 to any projection in projection2.
 * @param {ol.TransformFunction} inverseTransform Transform from any projection
 *   in projection2 to any projection in projection1..
 */
ol.proj.addEquivalentTransforms = function(projections1, projections2, forwardTransform, inverseTransform) {
  projections1.forEach(function(projection1) {
    projections2.forEach(function(projection2) {
      ol.proj.transforms.add(projection1, projection2, forwardTransform);
      ol.proj.transforms.add(projection2, projection1, inverseTransform);
    });
  });
};


/**
 * Add a Projection object to the list of supported projections that can be
 * looked up by their code.
 *
 * @param {ol.proj.Projection} projection Projection instance.
 * @api
 */
ol.proj.addProjection = function(projection) {
  ol.proj.projections.add(projection.getCode(), projection);
  ol.proj.transforms.add(projection, projection, ol.proj.cloneTransform);
};


/**
 * @param {Array.<ol.proj.Projection>} projections Projections.
 */
ol.proj.addProjections = function(projections) {
  projections.forEach(ol.proj.addProjection);
};


/**
 * Clear all cached projections and transforms.
 */
ol.proj.clearAllProjections = function() {
  ol.proj.projections.clear();
  ol.proj.transforms.clear();
};


/**
 * @param {ol.proj.Projection|string|undefined} projection Projection.
 * @param {string} defaultCode Default code.
 * @return {ol.proj.Projection} Projection.
 */
ol.proj.createProjection = function(projection, defaultCode) {
  if (!projection) {
    return ol.proj.get(defaultCode);
  } else if (typeof projection === 'string') {
    return ol.proj.get(projection);
  } else {
    return /** @type {ol.proj.Projection} */ (projection);
  }
};


/**
 * Registers coordinate transform functions to convert coordinates between the
 * source projection and the destination projection.
 * The forward and inverse functions convert coordinate pairs; this function
 * converts these into the functions used internally which also handle
 * extents and coordinate arrays.
 *
 * @param {ol.ProjectionLike} source Source projection.
 * @param {ol.ProjectionLike} destination Destination projection.
 * @param {function(ol.Coordinate): ol.Coordinate} forward The forward transform
 *     function (that is, from the source projection to the destination
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @param {function(ol.Coordinate): ol.Coordinate} inverse The inverse transform
 *     function (that is, from the destination projection to the source
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @api
 */
ol.proj.addCoordinateTransforms = function(source, destination, forward, inverse) {
  var sourceProj = ol.proj.get(source);
  var destProj = ol.proj.get(destination);
  ol.proj.transforms.add(sourceProj, destProj,
      ol.proj.createTransformFromCoordinateTransform(forward));
  ol.proj.transforms.add(destProj, sourceProj,
      ol.proj.createTransformFromCoordinateTransform(inverse));
};


/**
 * Creates a {@link ol.TransformFunction} from a simple 2D coordinate transform
 * function.
 * @param {function(ol.Coordinate): ol.Coordinate} transform Coordinate
 *     transform.
 * @return {ol.TransformFunction} Transform function.
 */
ol.proj.createTransformFromCoordinateTransform = function(transform) {
  return (
    /**
     * @param {Array.<number>} input Input.
     * @param {Array.<number>=} opt_output Output.
     * @param {number=} opt_dimension Dimension.
     * @return {Array.<number>} Output.
     */
    function(input, opt_output, opt_dimension) {
      var length = input.length;
      var dimension = opt_dimension !== undefined ? opt_dimension : 2;
      var output = opt_output !== undefined ? opt_output : new Array(length);
      var point, i, j;
      for (i = 0; i < length; i += dimension) {
        point = transform([input[i], input[i + 1]]);
        output[i] = point[0];
        output[i + 1] = point[1];
        for (j = dimension - 1; j >= 2; --j) {
          output[i + j] = input[i + j];
        }
      }
      return output;
    });
};


/**
 * Transforms a coordinate from longitude/latitude to a different projection.
 * @param {ol.Coordinate} coordinate Coordinate as longitude and latitude, i.e.
 *     an array with longitude as 1st and latitude as 2nd element.
 * @param {ol.ProjectionLike=} opt_projection Target projection. The
 *     default is Web Mercator, i.e. 'EPSG:3857'.
 * @return {ol.Coordinate} Coordinate projected to the target projection.
 * @api
 */
ol.proj.fromLonLat = function(coordinate, opt_projection) {
  return ol.proj.transform(coordinate, 'EPSG:4326',
      opt_projection !== undefined ? opt_projection : 'EPSG:3857');
};


/**
 * Transforms a coordinate to longitude/latitude.
 * @param {ol.Coordinate} coordinate Projected coordinate.
 * @param {ol.ProjectionLike=} opt_projection Projection of the coordinate.
 *     The default is Web Mercator, i.e. 'EPSG:3857'.
 * @return {ol.Coordinate} Coordinate as longitude and latitude, i.e. an array
 *     with longitude as 1st and latitude as 2nd element.
 * @api
 */
ol.proj.toLonLat = function(coordinate, opt_projection) {
  var lonLat = ol.proj.transform(coordinate,
      opt_projection !== undefined ? opt_projection : 'EPSG:3857', 'EPSG:4326');
  var lon = lonLat[0];
  if (lon < -180 || lon > 180) {
    lonLat[0] = ol.math.modulo(lon + 180, 360) - 180;
  }
  return lonLat;
};


/**
 * Fetches a Projection object for the code specified.
 *
 * @param {ol.ProjectionLike} projectionLike Either a code string which is
 *     a combination of authority and identifier such as "EPSG:4326", or an
 *     existing projection object, or undefined.
 * @return {ol.proj.Projection} Projection object, or null if not in list.
 * @api
 */
ol.proj.get = function(projectionLike) {
  var projection = null;
  if (projectionLike instanceof ol.proj.Projection) {
    projection = projectionLike;
  } else if (typeof projectionLike === 'string') {
    var code = projectionLike;
    projection = ol.proj.projections.get(code);
    if (ol.ENABLE_PROJ4JS && !projection) {
      var proj4js = ol.proj.proj4.get();
      if (typeof proj4js == 'function' &&
          proj4js.defs(code) !== undefined) {
        projection = new ol.proj.Projection({code: code});
        ol.proj.addProjection(projection);
      }
    }
  }
  return projection;
};


/**
 * Checks if two projections are the same, that is every coordinate in one
 * projection does represent the same geographic point as the same coordinate in
 * the other projection.
 *
 * @param {ol.proj.Projection} projection1 Projection 1.
 * @param {ol.proj.Projection} projection2 Projection 2.
 * @return {boolean} Equivalent.
 * @api
 */
ol.proj.equivalent = function(projection1, projection2) {
  if (projection1 === projection2) {
    return true;
  }
  var equalUnits = projection1.getUnits() === projection2.getUnits();
  if (projection1.getCode() === projection2.getCode()) {
    return equalUnits;
  } else {
    var transformFn = ol.proj.getTransformFromProjections(
        projection1, projection2);
    return transformFn === ol.proj.cloneTransform && equalUnits;
  }
};


/**
 * Given the projection-like objects, searches for a transformation
 * function to convert a coordinates array from the source projection to the
 * destination projection.
 *
 * @param {ol.ProjectionLike} source Source.
 * @param {ol.ProjectionLike} destination Destination.
 * @return {ol.TransformFunction} Transform function.
 * @api
 */
ol.proj.getTransform = function(source, destination) {
  var sourceProjection = ol.proj.get(source);
  var destinationProjection = ol.proj.get(destination);
  return ol.proj.getTransformFromProjections(
      sourceProjection, destinationProjection);
};


/**
 * Searches in the list of transform functions for the function for converting
 * coordinates from the source projection to the destination projection.
 *
 * @param {ol.proj.Projection} sourceProjection Source Projection object.
 * @param {ol.proj.Projection} destinationProjection Destination Projection
 *     object.
 * @return {ol.TransformFunction} Transform function.
 */
ol.proj.getTransformFromProjections = function(sourceProjection, destinationProjection) {
  var sourceCode = sourceProjection.getCode();
  var destinationCode = destinationProjection.getCode();
  var transform = ol.proj.transforms.get(sourceCode, destinationCode);
  if (ol.ENABLE_PROJ4JS && !transform) {
    var proj4js = ol.proj.proj4.get();
    if (typeof proj4js == 'function') {
      var sourceDef = proj4js.defs(sourceCode);
      var destinationDef = proj4js.defs(destinationCode);

      if (sourceDef !== undefined && destinationDef !== undefined) {
        if (sourceDef === destinationDef) {
          ol.proj.addEquivalentProjections([destinationProjection, sourceProjection]);
        } else {
          var proj4Transform = proj4js(destinationCode, sourceCode);
          ol.proj.addCoordinateTransforms(destinationProjection, sourceProjection,
              proj4Transform.forward, proj4Transform.inverse);
        }
        transform = ol.proj.transforms.get(sourceCode, destinationCode);
      }
    }
  }
  if (!transform) {
    transform = ol.proj.identityTransform;
  }
  return transform;
};


/**
 * @param {Array.<number>} input Input coordinate array.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array.<number>} Input coordinate array (same array as input).
 */
ol.proj.identityTransform = function(input, opt_output, opt_dimension) {
  if (opt_output !== undefined && input !== opt_output) {
    for (var i = 0, ii = input.length; i < ii; ++i) {
      opt_output[i] = input[i];
    }
    input = opt_output;
  }
  return input;
};


/**
 * @param {Array.<number>} input Input coordinate array.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array.<number>} Output coordinate array (new array, same coordinate
 *     values).
 */
ol.proj.cloneTransform = function(input, opt_output, opt_dimension) {
  var output;
  if (opt_output !== undefined) {
    for (var i = 0, ii = input.length; i < ii; ++i) {
      opt_output[i] = input[i];
    }
    output = opt_output;
  } else {
    output = input.slice();
  }
  return output;
};


/**
 * Transforms a coordinate from source projection to destination projection.
 * This returns a new coordinate (and does not modify the original).
 *
 * See {@link ol.proj.transformExtent} for extent transformation.
 * See the transform method of {@link ol.geom.Geometry} and its subclasses for
 * geometry transforms.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.ProjectionLike} source Source projection-like.
 * @param {ol.ProjectionLike} destination Destination projection-like.
 * @return {ol.Coordinate} Coordinate.
 * @api
 */
ol.proj.transform = function(coordinate, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return transformFn(coordinate, undefined, coordinate.length);
};


/**
 * Transforms an extent from source projection to destination projection.  This
 * returns a new extent (and does not modify the original).
 *
 * @param {ol.Extent} extent The extent to transform.
 * @param {ol.ProjectionLike} source Source projection-like.
 * @param {ol.ProjectionLike} destination Destination projection-like.
 * @return {ol.Extent} The transformed extent.
 * @api
 */
ol.proj.transformExtent = function(extent, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return ol.extent.applyTransform(extent, transformFn);
};


/**
 * Transforms the given point to the destination projection.
 *
 * @param {ol.Coordinate} point Point.
 * @param {ol.proj.Projection} sourceProjection Source projection.
 * @param {ol.proj.Projection} destinationProjection Destination projection.
 * @return {ol.Coordinate} Point.
 */
ol.proj.transformWithProjections = function(point, sourceProjection, destinationProjection) {
  var transformFn = ol.proj.getTransformFromProjections(
      sourceProjection, destinationProjection);
  return transformFn(point);
};

/**
 * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
 * by when this module is executed and should only need to be called again after
 * `ol.proj.clearAllProjections()` is called (e.g. in tests).
 */
ol.proj.addCommon = function() {
  // Add transformations that don't alter coordinates to convert within set of
  // projections with equal meaning.
  ol.proj.addEquivalentProjections(ol.proj.EPSG3857.PROJECTIONS);
  ol.proj.addEquivalentProjections(ol.proj.EPSG4326.PROJECTIONS);
  // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
  // coordinates and back.
  ol.proj.addEquivalentTransforms(
      ol.proj.EPSG4326.PROJECTIONS,
      ol.proj.EPSG3857.PROJECTIONS,
      ol.proj.EPSG3857.fromEPSG4326,
      ol.proj.EPSG3857.toEPSG4326);
};

ol.proj.addCommon();

goog.provide('ol.tilecoord');


/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {ol.TileCoord=} opt_tileCoord Tile coordinate.
 * @return {ol.TileCoord} Tile coordinate.
 */
ol.tilecoord.createOrUpdate = function(z, x, y, opt_tileCoord) {
  if (opt_tileCoord !== undefined) {
    opt_tileCoord[0] = z;
    opt_tileCoord[1] = x;
    opt_tileCoord[2] = y;
    return opt_tileCoord;
  } else {
    return [z, x, y];
  }
};


/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {string} Key.
 */
ol.tilecoord.getKeyZXY = function(z, x, y) {
  return z + '/' + x + '/' + y;
};


/**
 * Get the key for a tile coord.
 * @param {ol.TileCoord} tileCoord The tile coord.
 * @return {string} Key.
 */
ol.tilecoord.getKey = function(tileCoord) {
  return ol.tilecoord.getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
};


/**
 * Get a tile coord given a key.
 * @param {string} key The tile coord key.
 * @return {ol.TileCoord} The tile coord.
 */
ol.tilecoord.fromKey = function(key) {
  return key.split('/').map(Number);
};


/**
 * @param {ol.TileCoord} tileCoord Tile coord.
 * @return {number} Hash.
 */
ol.tilecoord.hash = function(tileCoord) {
  return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
};


/**
 * @param {ol.TileCoord} tileCoord Tile coord.
 * @return {string} Quad key.
 */
ol.tilecoord.quadKey = function(tileCoord) {
  var z = tileCoord[0];
  var digits = new Array(z);
  var mask = 1 << (z - 1);
  var i, charCode;
  for (i = 0; i < z; ++i) {
    // 48 is charCode for 0 - '0'.charCodeAt(0)
    charCode = 48;
    if (tileCoord[1] & mask) {
      charCode += 1;
    }
    if (tileCoord[2] & mask) {
      charCode += 2;
    }
    digits[i] = String.fromCharCode(charCode);
    mask >>= 1;
  }
  return digits.join('');
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {!ol.tilegrid.TileGrid} tileGrid Tile grid.
 * @return {boolean} Tile coordinate is within extent and zoom level range.
 */
ol.tilecoord.withinExtentAndZ = function(tileCoord, tileGrid) {
  var z = tileCoord[0];
  var x = tileCoord[1];
  var y = tileCoord[2];

  if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
    return false;
  }
  var extent = tileGrid.getExtent();
  var tileRange;
  if (!extent) {
    tileRange = tileGrid.getFullTileRange(z);
  } else {
    tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
  }
  if (!tileRange) {
    return true;
  } else {
    return tileRange.containsXY(x, y);
  }
};

goog.provide('ol.tilegrid.TileGrid');

goog.require('ol');
goog.require('ol.asserts');
goog.require('ol.TileRange');
goog.require('ol.array');
goog.require('ol.extent');
goog.require('ol.math');
goog.require('ol.size');
goog.require('ol.tilecoord');


/**
 * @classdesc
 * Base class for setting the grid pattern for sources accessing tiled-image
 * servers.
 *
 * @constructor
 * @param {olx.tilegrid.TileGridOptions} options Tile grid options.
 * @struct
 * @api
 */
ol.tilegrid.TileGrid = function(options) {

  /**
   * @protected
   * @type {number}
   */
  this.minZoom = options.minZoom !== undefined ? options.minZoom : 0;

  /**
   * @private
   * @type {!Array.<number>}
   */
  this.resolutions_ = options.resolutions;
  ol.asserts.assert(ol.array.isSorted(this.resolutions_, function(a, b) {
    return b - a;
  }, true), 17); // `resolutions` must be sorted in descending order


  // check if we've got a consistent zoom factor and origin
  var zoomFactor;
  if (!options.origins) {
    for (var i = 0, ii = this.resolutions_.length - 1; i < ii; ++i) {
      if (!zoomFactor) {
        zoomFactor = this.resolutions_[i] / this.resolutions_[i + 1];
      } else {
        if (this.resolutions_[i] / this.resolutions_[i + 1] !== zoomFactor) {
          zoomFactor = undefined;
          break;
        }
      }
    }
  }


  /**
   * @private
   * @type {number|undefined}
   */
  this.zoomFactor_ = zoomFactor;


  /**
   * @protected
   * @type {number}
   */
  this.maxZoom = this.resolutions_.length - 1;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.origin_ = options.origin !== undefined ? options.origin : null;

  /**
   * @private
   * @type {Array.<ol.Coordinate>}
   */
  this.origins_ = null;
  if (options.origins !== undefined) {
    this.origins_ = options.origins;
    ol.asserts.assert(this.origins_.length == this.resolutions_.length,
        20); // Number of `origins` and `resolutions` must be equal
  }

  var extent = options.extent;

  if (extent !== undefined &&
      !this.origin_ && !this.origins_) {
    this.origin_ = ol.extent.getTopLeft(extent);
  }

  ol.asserts.assert(
      (!this.origin_ && this.origins_) || (this.origin_ && !this.origins_),
      18); // Either `origin` or `origins` must be configured, never both

  /**
   * @private
   * @type {Array.<number|ol.Size>}
   */
  this.tileSizes_ = null;
  if (options.tileSizes !== undefined) {
    this.tileSizes_ = options.tileSizes;
    ol.asserts.assert(this.tileSizes_.length == this.resolutions_.length,
        19); // Number of `tileSizes` and `resolutions` must be equal
  }

  /**
   * @private
   * @type {number|ol.Size}
   */
  this.tileSize_ = options.tileSize !== undefined ?
    options.tileSize :
    !this.tileSizes_ ? ol.DEFAULT_TILE_SIZE : null;
  ol.asserts.assert(
      (!this.tileSize_ && this.tileSizes_) ||
      (this.tileSize_ && !this.tileSizes_),
      22); // Either `tileSize` or `tileSizes` must be configured, never both

  /**
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = extent !== undefined ? extent : null;


  /**
   * @private
   * @type {Array.<ol.TileRange>}
   */
  this.fullTileRanges_ = null;

  /**
   * @private
   * @type {ol.Size}
   */
  this.tmpSize_ = [0, 0];

  if (options.sizes !== undefined) {
    this.fullTileRanges_ = options.sizes.map(function(size, z) {
      var tileRange = new ol.TileRange(
          Math.min(0, size[0]), Math.max(size[0] - 1, -1),
          Math.min(0, size[1]), Math.max(size[1] - 1, -1));
      return tileRange;
    }, this);
  } else if (extent) {
    this.calculateTileRanges_(extent);
  }

};


/**
 * @private
 * @type {ol.TileCoord}
 */
ol.tilegrid.TileGrid.tmpTileCoord_ = [0, 0, 0];


/**
 * Call a function with each tile coordinate for a given extent and zoom level.
 *
 * @param {ol.Extent} extent Extent.
 * @param {number} zoom Integer zoom level.
 * @param {function(ol.TileCoord)} callback Function called with each tile coordinate.
 * @api
 */
ol.tilegrid.TileGrid.prototype.forEachTileCoord = function(extent, zoom, callback) {
  var tileRange = this.getTileRangeForExtentAndZ(extent, zoom);
  for (var i = tileRange.minX, ii = tileRange.maxX; i <= ii; ++i) {
    for (var j = tileRange.minY, jj = tileRange.maxY; j <= jj; ++j) {
      callback([zoom, i, j]);
    }
  }
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {function(this: T, number, ol.TileRange): boolean} callback Callback.
 * @param {T=} opt_this The object to use as `this` in `callback`.
 * @param {ol.TileRange=} opt_tileRange Temporary ol.TileRange object.
 * @param {ol.Extent=} opt_extent Temporary ol.Extent object.
 * @return {boolean} Callback succeeded.
 * @template T
 */
ol.tilegrid.TileGrid.prototype.forEachTileCoordParentTileRange = function(tileCoord, callback, opt_this, opt_tileRange, opt_extent) {
  var tileRange, x, y;
  var tileCoordExtent = null;
  var z = tileCoord[0] - 1;
  if (this.zoomFactor_ === 2) {
    x = tileCoord[1];
    y = tileCoord[2];
  } else {
    tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
  }
  while (z >= this.minZoom) {
    if (this.zoomFactor_ === 2) {
      x = Math.floor(x / 2);
      y = Math.floor(y / 2);
      tileRange = ol.TileRange.createOrUpdate(x, x, y, y, opt_tileRange);
    } else {
      tileRange = this.getTileRangeForExtentAndZ(tileCoordExtent, z, opt_tileRange);
    }
    if (callback.call(opt_this, z, tileRange)) {
      return true;
    }
    --z;
  }
  return false;
};


/**
 * Get the extent for this tile grid, if it was configured.
 * @return {ol.Extent} Extent.
 */
ol.tilegrid.TileGrid.prototype.getExtent = function() {
  return this.extent_;
};


/**
 * Get the maximum zoom level for the grid.
 * @return {number} Max zoom.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getMaxZoom = function() {
  return this.maxZoom;
};


/**
 * Get the minimum zoom level for the grid.
 * @return {number} Min zoom.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getMinZoom = function() {
  return this.minZoom;
};


/**
 * Get the origin for the grid at the given zoom level.
 * @param {number} z Integer zoom level.
 * @return {ol.Coordinate} Origin.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getOrigin = function(z) {
  if (this.origin_) {
    return this.origin_;
  } else {
    return this.origins_[z];
  }
};


/**
 * Get the resolution for the given zoom level.
 * @param {number} z Integer zoom level.
 * @return {number} Resolution.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getResolution = function(z) {
  return this.resolutions_[z];
};


/**
 * Get the list of resolutions for the tile grid.
 * @return {Array.<number>} Resolutions.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getResolutions = function() {
  return this.resolutions_;
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {ol.TileRange=} opt_tileRange Temporary ol.TileRange object.
 * @param {ol.Extent=} opt_extent Temporary ol.Extent object.
 * @return {ol.TileRange} Tile range.
 */
ol.tilegrid.TileGrid.prototype.getTileCoordChildTileRange = function(tileCoord, opt_tileRange, opt_extent) {
  if (tileCoord[0] < this.maxZoom) {
    if (this.zoomFactor_ === 2) {
      var minX = tileCoord[1] * 2;
      var minY = tileCoord[2] * 2;
      return ol.TileRange.createOrUpdate(minX, minX + 1, minY, minY + 1, opt_tileRange);
    }
    var tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
    return this.getTileRangeForExtentAndZ(
        tileCoordExtent, tileCoord[0] + 1, opt_tileRange);
  }
  return null;
};


/**
 * Get the extent for a tile range.
 * @param {number} z Integer zoom level.
 * @param {ol.TileRange} tileRange Tile range.
 * @param {ol.Extent=} opt_extent Temporary ol.Extent object.
 * @return {ol.Extent} Extent.
 */
ol.tilegrid.TileGrid.prototype.getTileRangeExtent = function(z, tileRange, opt_extent) {
  var origin = this.getOrigin(z);
  var resolution = this.getResolution(z);
  var tileSize = ol.size.toSize(this.getTileSize(z), this.tmpSize_);
  var minX = origin[0] + tileRange.minX * tileSize[0] * resolution;
  var maxX = origin[0] + (tileRange.maxX + 1) * tileSize[0] * resolution;
  var minY = origin[1] + tileRange.minY * tileSize[1] * resolution;
  var maxY = origin[1] + (tileRange.maxY + 1) * tileSize[1] * resolution;
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};


/**
 * Get a tile range for the given extent and integer zoom level.
 * @param {ol.Extent} extent Extent.
 * @param {number} z Integer zoom level.
 * @param {ol.TileRange=} opt_tileRange Temporary tile range object.
 * @return {ol.TileRange} Tile range.
 */
ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndZ = function(extent, z, opt_tileRange) {
  var tileCoord = ol.tilegrid.TileGrid.tmpTileCoord_;
  this.getTileCoordForXYAndZ_(extent[0], extent[1], z, false, tileCoord);
  var minX = tileCoord[1];
  var minY = tileCoord[2];
  this.getTileCoordForXYAndZ_(extent[2], extent[3], z, true, tileCoord);
  return ol.TileRange.createOrUpdate(
      minX, tileCoord[1], minY, tileCoord[2], opt_tileRange);
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {ol.Coordinate} Tile center.
 */
ol.tilegrid.TileGrid.prototype.getTileCoordCenter = function(tileCoord) {
  var origin = this.getOrigin(tileCoord[0]);
  var resolution = this.getResolution(tileCoord[0]);
  var tileSize = ol.size.toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
  return [
    origin[0] + (tileCoord[1] + 0.5) * tileSize[0] * resolution,
    origin[1] + (tileCoord[2] + 0.5) * tileSize[1] * resolution
  ];
};


/**
 * Get the extent of a tile coordinate.
 *
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {ol.Extent=} opt_extent Temporary extent object.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getTileCoordExtent = function(tileCoord, opt_extent) {
  var origin = this.getOrigin(tileCoord[0]);
  var resolution = this.getResolution(tileCoord[0]);
  var tileSize = ol.size.toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
  var minX = origin[0] + tileCoord[1] * tileSize[0] * resolution;
  var minY = origin[1] + tileCoord[2] * tileSize[1] * resolution;
  var maxX = minX + tileSize[0] * resolution;
  var maxY = minY + tileSize[1] * resolution;
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};


/**
 * Get the tile coordinate for the given map coordinate and resolution.  This
 * method considers that coordinates that intersect tile boundaries should be
 * assigned the higher tile coordinate.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @param {ol.TileCoord=} opt_tileCoord Destination ol.TileCoord object.
 * @return {ol.TileCoord} Tile coordinate.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndResolution = function(coordinate, resolution, opt_tileCoord) {
  return this.getTileCoordForXYAndResolution_(
      coordinate[0], coordinate[1], resolution, false, opt_tileCoord);
};


/**
 * Note that this method should not be called for resolutions that correspond
 * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} resolution Resolution (for a non-integer zoom level).
 * @param {boolean} reverseIntersectionPolicy Instead of letting edge
 *     intersections go to the higher tile coordinate, let edge intersections
 *     go to the lower tile coordinate.
 * @param {ol.TileCoord=} opt_tileCoord Temporary ol.TileCoord object.
 * @return {ol.TileCoord} Tile coordinate.
 * @private
 */
ol.tilegrid.TileGrid.prototype.getTileCoordForXYAndResolution_ = function(
    x, y, resolution, reverseIntersectionPolicy, opt_tileCoord) {
  var z = this.getZForResolution(resolution);
  var scale = resolution / this.getResolution(z);
  var origin = this.getOrigin(z);
  var tileSize = ol.size.toSize(this.getTileSize(z), this.tmpSize_);

  var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
  var adjustY = reverseIntersectionPolicy ? 0 : 0.5;
  var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
  var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
  var tileCoordX = scale * xFromOrigin / tileSize[0];
  var tileCoordY = scale * yFromOrigin / tileSize[1];

  if (reverseIntersectionPolicy) {
    tileCoordX = Math.ceil(tileCoordX) - 1;
    tileCoordY = Math.ceil(tileCoordY) - 1;
  } else {
    tileCoordX = Math.floor(tileCoordX);
    tileCoordY = Math.floor(tileCoordY);
  }

  return ol.tilecoord.createOrUpdate(z, tileCoordX, tileCoordY, opt_tileCoord);
};


/**
 * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
 * they should have separate implementations.  This method is for integer zoom
 * levels.  The other method should only be called for resolutions corresponding
 * to non-integer zoom levels.
 * @param {number} x Map x coordinate.
 * @param {number} y Map y coordinate.
 * @param {number} z Integer zoom level.
 * @param {boolean} reverseIntersectionPolicy Instead of letting edge
 *     intersections go to the higher tile coordinate, let edge intersections
 *     go to the lower tile coordinate.
 * @param {ol.TileCoord=} opt_tileCoord Temporary ol.TileCoord object.
 * @return {ol.TileCoord} Tile coordinate.
 * @private
 */
ol.tilegrid.TileGrid.prototype.getTileCoordForXYAndZ_ = function(x, y, z, reverseIntersectionPolicy, opt_tileCoord) {
  var origin = this.getOrigin(z);
  var resolution = this.getResolution(z);
  var tileSize = ol.size.toSize(this.getTileSize(z), this.tmpSize_);

  var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
  var adjustY = reverseIntersectionPolicy ? 0 : 0.5;
  var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
  var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
  var tileCoordX = xFromOrigin / tileSize[0];
  var tileCoordY = yFromOrigin / tileSize[1];

  if (reverseIntersectionPolicy) {
    tileCoordX = Math.ceil(tileCoordX) - 1;
    tileCoordY = Math.ceil(tileCoordY) - 1;
  } else {
    tileCoordX = Math.floor(tileCoordX);
    tileCoordY = Math.floor(tileCoordY);
  }

  return ol.tilecoord.createOrUpdate(z, tileCoordX, tileCoordY, opt_tileCoord);
};


/**
 * Get a tile coordinate given a map coordinate and zoom level.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} z Zoom level.
 * @param {ol.TileCoord=} opt_tileCoord Destination ol.TileCoord object.
 * @return {ol.TileCoord} Tile coordinate.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndZ = function(coordinate, z, opt_tileCoord) {
  return this.getTileCoordForXYAndZ_(
      coordinate[0], coordinate[1], z, false, opt_tileCoord);
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {number} Tile resolution.
 */
ol.tilegrid.TileGrid.prototype.getTileCoordResolution = function(tileCoord) {
  return this.resolutions_[tileCoord[0]];
};


/**
 * Get the tile size for a zoom level. The type of the return value matches the
 * `tileSize` or `tileSizes` that the tile grid was configured with. To always
 * get an `ol.Size`, run the result through `ol.size.toSize()`.
 * @param {number} z Z.
 * @return {number|ol.Size} Tile size.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getTileSize = function(z) {
  if (this.tileSize_) {
    return this.tileSize_;
  } else {
    return this.tileSizes_[z];
  }
};


/**
 * @param {number} z Zoom level.
 * @return {ol.TileRange} Extent tile range for the specified zoom level.
 */
ol.tilegrid.TileGrid.prototype.getFullTileRange = function(z) {
  if (!this.fullTileRanges_) {
    return null;
  } else {
    return this.fullTileRanges_[z];
  }
};


/**
 * @param {number} resolution Resolution.
 * @param {number=} opt_direction If 0, the nearest resolution will be used.
 *     If 1, the nearest lower resolution will be used. If -1, the nearest
 *     higher resolution will be used. Default is 0.
 * @return {number} Z.
 * @api
 */
ol.tilegrid.TileGrid.prototype.getZForResolution = function(
    resolution, opt_direction) {
  var z = ol.array.linearFindNearest(this.resolutions_, resolution,
      opt_direction || 0);
  return ol.math.clamp(z, this.minZoom, this.maxZoom);
};


/**
 * @param {!ol.Extent} extent Extent for this tile grid.
 * @private
 */
ol.tilegrid.TileGrid.prototype.calculateTileRanges_ = function(extent) {
  var length = this.resolutions_.length;
  var fullTileRanges = new Array(length);
  for (var z = this.minZoom; z < length; ++z) {
    fullTileRanges[z] = this.getTileRangeForExtentAndZ(extent, z);
  }
  this.fullTileRanges_ = fullTileRanges;
};

goog.provide('ol.tilegrid');

goog.require('ol');
goog.require('ol.size');
goog.require('ol.extent');
goog.require('ol.extent.Corner');
goog.require('ol.obj');
goog.require('ol.proj');
goog.require('ol.proj.Units');
goog.require('ol.tilegrid.TileGrid');


/**
 * @param {ol.proj.Projection} projection Projection.
 * @return {!ol.tilegrid.TileGrid} Default tile grid for the passed projection.
 */
ol.tilegrid.getForProjection = function(projection) {
  var tileGrid = projection.getDefaultTileGrid();
  if (!tileGrid) {
    tileGrid = ol.tilegrid.createForProjection(projection);
    projection.setDefaultTileGrid(tileGrid);
  }
  return tileGrid;
};


/**
 * @param {ol.tilegrid.TileGrid} tileGrid Tile grid.
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {ol.proj.Projection} projection Projection.
 * @return {ol.TileCoord} Tile coordinate.
 */
ol.tilegrid.wrapX = function(tileGrid, tileCoord, projection) {
  var z = tileCoord[0];
  var center = tileGrid.getTileCoordCenter(tileCoord);
  var projectionExtent = ol.tilegrid.extentFromProjection(projection);
  if (!ol.extent.containsCoordinate(projectionExtent, center)) {
    var worldWidth = ol.extent.getWidth(projectionExtent);
    var worldsAway = Math.ceil((projectionExtent[0] - center[0]) / worldWidth);
    center[0] += worldWidth * worldsAway;
    return tileGrid.getTileCoordForCoordAndZ(center, z);
  } else {
    return tileCoord;
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     ol.DEFAULT_MAX_ZOOM).
 * @param {number|ol.Size=} opt_tileSize Tile size (default uses
 *     ol.DEFAULT_TILE_SIZE).
 * @param {ol.extent.Corner=} opt_corner Extent corner (default is
 *     ol.extent.Corner.TOP_LEFT).
 * @return {!ol.tilegrid.TileGrid} TileGrid instance.
 */
ol.tilegrid.createForExtent = function(extent, opt_maxZoom, opt_tileSize, opt_corner) {
  var corner = opt_corner !== undefined ?
    opt_corner : ol.extent.Corner.TOP_LEFT;

  var resolutions = ol.tilegrid.resolutionsFromExtent(
      extent, opt_maxZoom, opt_tileSize);

  return new ol.tilegrid.TileGrid({
    extent: extent,
    origin: ol.extent.getCorner(extent, corner),
    resolutions: resolutions,
    tileSize: opt_tileSize
  });
};


/**
 * Creates a tile grid with a standard XYZ tiling scheme.
 * @param {olx.tilegrid.XYZOptions=} opt_options Tile grid options.
 * @return {!ol.tilegrid.TileGrid} Tile grid instance.
 * @api
 */
ol.tilegrid.createXYZ = function(opt_options) {
  var options = /** @type {olx.tilegrid.TileGridOptions} */ ({});
  ol.obj.assign(options, opt_options !== undefined ?
    opt_options : /** @type {olx.tilegrid.XYZOptions} */ ({}));
  if (options.extent === undefined) {
    options.extent = ol.proj.get('EPSG:3857').getExtent();
  }
  options.resolutions = ol.tilegrid.resolutionsFromExtent(
      options.extent, options.maxZoom, options.tileSize);
  delete options.maxZoom;

  return new ol.tilegrid.TileGrid(options);
};


/**
 * Create a resolutions array from an extent.  A zoom factor of 2 is assumed.
 * @param {ol.Extent} extent Extent.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     ol.DEFAULT_MAX_ZOOM).
 * @param {number|ol.Size=} opt_tileSize Tile size (default uses
 *     ol.DEFAULT_TILE_SIZE).
 * @return {!Array.<number>} Resolutions array.
 */
ol.tilegrid.resolutionsFromExtent = function(extent, opt_maxZoom, opt_tileSize) {
  var maxZoom = opt_maxZoom !== undefined ?
    opt_maxZoom : ol.DEFAULT_MAX_ZOOM;

  var height = ol.extent.getHeight(extent);
  var width = ol.extent.getWidth(extent);

  var tileSize = ol.size.toSize(opt_tileSize !== undefined ?
    opt_tileSize : ol.DEFAULT_TILE_SIZE);
  var maxResolution = Math.max(
      width / tileSize[0], height / tileSize[1]);

  var length = maxZoom + 1;
  var resolutions = new Array(length);
  for (var z = 0; z < length; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }
  return resolutions;
};


/**
 * @param {ol.ProjectionLike} projection Projection.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     ol.DEFAULT_MAX_ZOOM).
 * @param {number|ol.Size=} opt_tileSize Tile size (default uses
 *     ol.DEFAULT_TILE_SIZE).
 * @param {ol.extent.Corner=} opt_corner Extent corner (default is
 *     ol.extent.Corner.BOTTOM_LEFT).
 * @return {!ol.tilegrid.TileGrid} TileGrid instance.
 */
ol.tilegrid.createForProjection = function(projection, opt_maxZoom, opt_tileSize, opt_corner) {
  var extent = ol.tilegrid.extentFromProjection(projection);
  return ol.tilegrid.createForExtent(
      extent, opt_maxZoom, opt_tileSize, opt_corner);
};


/**
 * Generate a tile grid extent from a projection.  If the projection has an
 * extent, it is used.  If not, a global extent is assumed.
 * @param {ol.ProjectionLike} projection Projection.
 * @return {ol.Extent} Extent.
 */
ol.tilegrid.extentFromProjection = function(projection) {
  projection = ol.proj.get(projection);
  var extent = projection.getExtent();
  if (!extent) {
    var half = 180 * ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] /
        projection.getMetersPerUnit();
    extent = ol.extent.createOrUpdate(-half, -half, half, half);
  }
  return extent;
};

goog.provide('ol.Attribution');

goog.require('ol.TileRange');
goog.require('ol.math');
goog.require('ol.tilegrid');


/**
 * @classdesc
 * An attribution for a layer source.
 *
 * Example:
 *
 *     source: new ol.source.OSM({
 *       attributions: [
 *         new ol.Attribution({
 *           html: 'All maps &copy; ' +
 *               '<a href="https://www.opencyclemap.org/">OpenCycleMap</a>'
 *         }),
 *         ol.source.OSM.ATTRIBUTION
 *       ],
 *     ..
 *
 * @constructor
 * @deprecated This class is deprecated and will removed in the next major release.
 * @param {olx.AttributionOptions} options Attribution options.
 * @struct
 * @api
 */
ol.Attribution = function(options) {

  /**
   * @private
   * @type {string}
   */
  this.html_ = options.html;

  /**
   * @private
   * @type {Object.<string, Array.<ol.TileRange>>}
   */
  this.tileRanges_ = options.tileRanges ? options.tileRanges : null;

};


/**
 * Get the attribution markup.
 * @return {string} The attribution HTML.
 * @api
 */
ol.Attribution.prototype.getHTML = function() {
  return this.html_;
};


/**
 * @param {Object.<string, ol.TileRange>} tileRanges Tile ranges.
 * @param {!ol.tilegrid.TileGrid} tileGrid Tile grid.
 * @param {!ol.proj.Projection} projection Projection.
 * @return {boolean} Intersects any tile range.
 */
ol.Attribution.prototype.intersectsAnyTileRange = function(tileRanges, tileGrid, projection) {
  if (!this.tileRanges_) {
    return true;
  }
  var i, ii, tileRange, zKey;
  for (zKey in tileRanges) {
    if (!(zKey in this.tileRanges_)) {
      continue;
    }
    tileRange = tileRanges[zKey];
    var testTileRange;
    for (i = 0, ii = this.tileRanges_[zKey].length; i < ii; ++i) {
      testTileRange = this.tileRanges_[zKey][i];
      if (testTileRange.intersects(tileRange)) {
        return true;
      }
      var extentTileRange = tileGrid.getTileRangeForExtentAndZ(
          ol.tilegrid.extentFromProjection(projection), parseInt(zKey, 10));
      var width = extentTileRange.getWidth();
      if (tileRange.minX < extentTileRange.minX ||
          tileRange.maxX > extentTileRange.maxX) {
        if (testTileRange.intersects(new ol.TileRange(
            ol.math.modulo(tileRange.minX, width),
            ol.math.modulo(tileRange.maxX, width),
            tileRange.minY, tileRange.maxY))) {
          return true;
        }
        if (tileRange.getWidth() > width &&
            testTileRange.intersects(extentTileRange)) {
          return true;
        }
      }
    }
  }
  return false;
};

goog.provide('ol.CollectionEventType');

/**
 * @enum {string}
 */
ol.CollectionEventType = {
  /**
   * Triggered when an item is added to the collection.
   * @event ol.Collection.Event#add
   * @api
   */
  ADD: 'add',
  /**
   * Triggered when an item is removed from the collection.
   * @event ol.Collection.Event#remove
   * @api
   */
  REMOVE: 'remove'
};

goog.provide('ol.ObjectEventType');

/**
 * @enum {string}
 */
ol.ObjectEventType = {
  /**
   * Triggered when a property is changed.
   * @event ol.Object.Event#propertychange
   * @api
   */
  PROPERTYCHANGE: 'propertychange'
};

goog.provide('ol.events');

goog.require('ol.obj');


/**
 * @param {ol.EventsKey} listenerObj Listener object.
 * @return {ol.EventsListenerFunctionType} Bound listener.
 */
ol.events.bindListener_ = function(listenerObj) {
  var boundListener = function(evt) {
    var listener = listenerObj.listener;
    var bindTo = listenerObj.bindTo || listenerObj.target;
    if (listenerObj.callOnce) {
      ol.events.unlistenByKey(listenerObj);
    }
    return listener.call(bindTo, evt);
  };
  listenerObj.boundListener = boundListener;
  return boundListener;
};


/**
 * Finds the matching {@link ol.EventsKey} in the given listener
 * array.
 *
 * @param {!Array<!ol.EventsKey>} listeners Array of listeners.
 * @param {!Function} listener The listener function.
 * @param {Object=} opt_this The `this` value inside the listener.
 * @param {boolean=} opt_setDeleteIndex Set the deleteIndex on the matching
 *     listener, for {@link ol.events.unlistenByKey}.
 * @return {ol.EventsKey|undefined} The matching listener object.
 * @private
 */
ol.events.findListener_ = function(listeners, listener, opt_this,
    opt_setDeleteIndex) {
  var listenerObj;
  for (var i = 0, ii = listeners.length; i < ii; ++i) {
    listenerObj = listeners[i];
    if (listenerObj.listener === listener &&
        listenerObj.bindTo === opt_this) {
      if (opt_setDeleteIndex) {
        listenerObj.deleteIndex = i;
      }
      return listenerObj;
    }
  }
  return undefined;
};


/**
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @return {Array.<ol.EventsKey>|undefined} Listeners.
 */
ol.events.getListeners = function(target, type) {
  var listenerMap = target.ol_lm;
  return listenerMap ? listenerMap[type] : undefined;
};


/**
 * Get the lookup of listeners.  If one does not exist on the target, it is
 * created.
 * @param {ol.EventTargetLike} target Target.
 * @return {!Object.<string, Array.<ol.EventsKey>>} Map of
 *     listeners by event type.
 * @private
 */
ol.events.getListenerMap_ = function(target) {
  var listenerMap = target.ol_lm;
  if (!listenerMap) {
    listenerMap = target.ol_lm = {};
  }
  return listenerMap;
};


/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @private
 */
ol.events.removeListeners_ = function(target, type) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    for (var i = 0, ii = listeners.length; i < ii; ++i) {
      target.removeEventListener(type, listeners[i].boundListener);
      ol.obj.clear(listeners[i]);
    }
    listeners.length = 0;
    var listenerMap = target.ol_lm;
    if (listenerMap) {
      delete listenerMap[type];
      if (Object.keys(listenerMap).length === 0) {
        delete target.ol_lm;
      }
    }
  }
};


/**
 * Registers an event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link ol.events.unlistenByKey}.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param {boolean=} opt_once If true, add the listener as one-off listener.
 * @return {ol.EventsKey} Unique key for the listener.
 */
ol.events.listen = function(target, type, listener, opt_this, opt_once) {
  var listenerMap = ol.events.getListenerMap_(target);
  var listeners = listenerMap[type];
  if (!listeners) {
    listeners = listenerMap[type] = [];
  }
  var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
      false);
  if (listenerObj) {
    if (!opt_once) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = /** @type {ol.EventsKey} */ ({
      bindTo: opt_this,
      callOnce: !!opt_once,
      listener: listener,
      target: target,
      type: type
    });
    target.addEventListener(type, ol.events.bindListener_(listenerObj));
    listeners.push(listenerObj);
  }

  return listenerObj;
};


/**
 * Registers a one-off event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * This function efficiently binds a `listener` as self-unregistering listener
 * to a `this` object, and returns a key for use with
 * {@link ol.events.unlistenByKey} in case the listener needs to be unregistered
 * before it is called.
 *
 * When {@link ol.events.listen} is called with the same arguments after this
 * function, the self-unregistering listener will be turned into a permanent
 * listener.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @return {ol.EventsKey} Key for unlistenByKey.
 */
ol.events.listenOnce = function(target, type, listener, opt_this) {
  return ol.events.listen(target, type, listener, opt_this, true);
};


/**
 * Unregisters an event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * To return a listener, this function needs to be called with the exact same
 * arguments that were used for a previous {@link ol.events.listen} call.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 */
ol.events.unlisten = function(target, type, listener, opt_this) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
        true);
    if (listenerObj) {
      ol.events.unlistenByKey(listenerObj);
    }
  }
};


/**
 * Unregisters event listeners on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * The argument passed to this function is the key returned from
 * {@link ol.events.listen} or {@link ol.events.listenOnce}.
 *
 * @param {ol.EventsKey} key The key.
 */
ol.events.unlistenByKey = function(key) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener);
    var listeners = ol.events.getListeners(key.target, key.type);
    if (listeners) {
      var i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
      if (i !== -1) {
        listeners.splice(i, 1);
      }
      if (listeners.length === 0) {
        ol.events.removeListeners_(key.target, key.type);
      }
    }
    ol.obj.clear(key);
  }
};


/**
 * Unregisters all event listeners on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * @param {ol.EventTargetLike} target Target.
 */
ol.events.unlistenAll = function(target) {
  var listenerMap = ol.events.getListenerMap_(target);
  for (var type in listenerMap) {
    ol.events.removeListeners_(target, type);
  }
};

goog.provide('ol.Disposable');

goog.require('ol');

/**
 * Objects that need to clean up after themselves.
 * @constructor
 */
ol.Disposable = function() {};

/**
 * The object has already been disposed.
 * @type {boolean}
 * @private
 */
ol.Disposable.prototype.disposed_ = false;

/**
 * Clean up.
 */
ol.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
  }
};

/**
 * Extension point for disposable objects.
 * @protected
 */
ol.Disposable.prototype.disposeInternal = ol.nullFunction;

goog.provide('ol.events.Event');


/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * @see {@link https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface}
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link ol.events.EventTarget}.
 *
 * @constructor
 * @implements {oli.events.Event}
 * @param {string} type Type.
 */
ol.events.Event = function(type) {

  /**
   * @type {boolean}
   */
  this.propagationStopped;

  /**
   * The event type.
   * @type {string}
   * @api
   */
  this.type = type;

  /**
   * The event target.
   * @type {Object}
   * @api
   */
  this.target = null;

};


/**
 * Stop event propagation.
 * @function
 * @override
 * @api
 */
ol.events.Event.prototype.preventDefault =

  /**
   * Stop event propagation.
   * @function
   * @override
   * @api
   */
  ol.events.Event.prototype.stopPropagation = function() {
    this.propagationStopped = true;
  };


/**
 * @param {Event|ol.events.Event} evt Event
 */
ol.events.Event.stopPropagation = function(evt) {
  evt.stopPropagation();
};


/**
 * @param {Event|ol.events.Event} evt Event
 */
ol.events.Event.preventDefault = function(evt) {
  evt.preventDefault();
};

goog.provide('ol.events.EventTarget');

goog.require('ol');
goog.require('ol.Disposable');
goog.require('ol.events');
goog.require('ol.events.Event');


/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * @see {@link https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget}
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 *
 * @constructor
 * @extends {ol.Disposable}
 */
ol.events.EventTarget = function() {

  ol.Disposable.call(this);

  /**
   * @private
   * @type {!Object.<string, number>}
   */
  this.pendingRemovals_ = {};

  /**
   * @private
   * @type {!Object.<string, number>}
   */
  this.dispatching_ = {};

  /**
   * @private
   * @type {!Object.<string, Array.<ol.EventsListenerFunctionType>>}
   */
  this.listeners_ = {};

};
ol.inherits(ol.events.EventTarget, ol.Disposable);


/**
 * @param {string} type Type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 */
ol.events.EventTarget.prototype.addEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (!listeners) {
    listeners = this.listeners_[type] = [];
  }
  if (listeners.indexOf(listener) === -1) {
    listeners.push(listener);
  }
};


/**
 * @param {{type: string,
 *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
 *     string} event Event or event type.
 * @return {boolean|undefined} `false` if anyone called preventDefault on the
 *     event object or if any of the listeners returned false.
 */
ol.events.EventTarget.prototype.dispatchEvent = function(event) {
  var evt = typeof event === 'string' ? new ol.events.Event(event) : event;
  var type = evt.type;
  evt.target = this;
  var listeners = this.listeners_[type];
  var propagate;
  if (listeners) {
    if (!(type in this.dispatching_)) {
      this.dispatching_[type] = 0;
      this.pendingRemovals_[type] = 0;
    }
    ++this.dispatching_[type];
    for (var i = 0, ii = listeners.length; i < ii; ++i) {
      if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
        propagate = false;
        break;
      }
    }
    --this.dispatching_[type];
    if (this.dispatching_[type] === 0) {
      var pendingRemovals = this.pendingRemovals_[type];
      delete this.pendingRemovals_[type];
      while (pendingRemovals--) {
        this.removeEventListener(type, ol.nullFunction);
      }
      delete this.dispatching_[type];
    }
    return propagate;
  }
};


/**
 * @inheritDoc
 */
ol.events.EventTarget.prototype.disposeInternal = function() {
  ol.events.unlistenAll(this);
};


/**
 * Get the listeners for a specified event type. Listeners are returned in the
 * order that they will be called in.
 *
 * @param {string} type Type.
 * @return {Array.<ol.EventsListenerFunctionType>} Listeners.
 */
ol.events.EventTarget.prototype.getListeners = function(type) {
  return this.listeners_[type];
};


/**
 * @param {string=} opt_type Type. If not provided,
 *     `true` will be returned if this EventTarget has any listeners.
 * @return {boolean} Has listeners.
 */
ol.events.EventTarget.prototype.hasListener = function(opt_type) {
  return opt_type ?
    opt_type in this.listeners_ :
    Object.keys(this.listeners_).length > 0;
};


/**
 * @param {string} type Type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 */
ol.events.EventTarget.prototype.removeEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (listeners) {
    var index = listeners.indexOf(listener);
    if (type in this.pendingRemovals_) {
      // make listener a no-op, and remove later in #dispatchEvent()
      listeners[index] = ol.nullFunction;
      ++this.pendingRemovals_[type];
    } else {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        delete this.listeners_[type];
      }
    }
  }
};

goog.provide('ol.events.EventType');

/**
 * @enum {string}
 * @const
 */
ol.events.EventType = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event ol.events.Event#change
   * @api
   */
  CHANGE: 'change',

  CLEAR: 'clear',
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  DRAGENTER: 'dragenter',
  DRAGOVER: 'dragover',
  DROP: 'drop',
  ERROR: 'error',
  KEYDOWN: 'keydown',
  KEYPRESS: 'keypress',
  LOAD: 'load',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  MOUSEOUT: 'mouseout',
  MOUSEUP: 'mouseup',
  MOUSEWHEEL: 'mousewheel',
  MSPOINTERDOWN: 'MSPointerDown',
  RESIZE: 'resize',
  TOUCHSTART: 'touchstart',
  TOUCHMOVE: 'touchmove',
  TOUCHEND: 'touchend',
  WHEEL: 'wheel'
};

goog.provide('ol.Observable');

goog.require('ol');
goog.require('ol.events');
goog.require('ol.events.EventTarget');
goog.require('ol.events.EventType');


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 * {@link ol.Observable#changed}.
 *
 * @constructor
 * @extends {ol.events.EventTarget}
 * @fires ol.events.Event
 * @struct
 * @api
 */
ol.Observable = function() {

  ol.events.EventTarget.call(this);

  /**
   * @private
   * @type {number}
   */
  this.revision_ = 0;

};
ol.inherits(ol.Observable, ol.events.EventTarget);


/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * @param {ol.EventsKey|Array.<ol.EventsKey>} key The key returned by `on()`
 *     or `once()` (or an array of keys).
 * @api
 */
ol.Observable.unByKey = function(key) {
  if (Array.isArray(key)) {
    for (var i = 0, ii = key.length; i < ii; ++i) {
      ol.events.unlistenByKey(key[i]);
    }
  } else {
    ol.events.unlistenByKey(/** @type {ol.EventsKey} */ (key));
  }
};


/**
 * Increases the revision counter and dispatches a 'change' event.
 * @api
 */
ol.Observable.prototype.changed = function() {
  ++this.revision_;
  this.dispatchEvent(ol.events.EventType.CHANGE);
};


/**
 * Dispatches an event and calls all listeners listening for events
 * of this type. The event parameter can either be a string or an
 * Object with a `type` property.
 *
 * @param {{type: string,
 *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
 *     string} event Event object.
 * @function
 * @api
 */
ol.Observable.prototype.dispatchEvent;


/**
 * Get the version number for this object.  Each time the object is modified,
 * its version number will be incremented.
 * @return {number} Revision.
 * @api
 */
ol.Observable.prototype.getRevision = function() {
  return this.revision_;
};


/**
 * Listen for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
 *     called with an array of event types as the first argument, the return
 *     will be an array of keys.
 * @api
 */
ol.Observable.prototype.on = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0; i < len; ++i) {
      keys[i] = ol.events.listen(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listen(
        this, /** @type {string} */ (type), listener, opt_this);
  }
};


/**
 * Listen once for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
 *     called with an array of event types as the first argument, the return
 *     will be an array of keys.
 * @api
 */
ol.Observable.prototype.once = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0; i < len; ++i) {
      keys[i] = ol.events.listenOnce(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listenOnce(
        this, /** @type {string} */ (type), listener, opt_this);
  }
};


/**
 * Unlisten for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object which was used as `this` by the
 * `listener`.
 * @api
 */
ol.Observable.prototype.un = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    for (var i = 0, ii = type.length; i < ii; ++i) {
      ol.events.unlisten(this, type[i], listener, opt_this);
    }
    return;
  } else {
    ol.events.unlisten(this, /** @type {string} */ (type), listener, opt_this);
  }
};

goog.provide('ol.Object');

goog.require('ol');
goog.require('ol.ObjectEventType');
goog.require('ol.Observable');
goog.require('ol.events.Event');
goog.require('ol.obj');


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Most non-trivial classes inherit from this.
 *
 * This extends {@link ol.Observable} with observable properties, where each
 * property is observable as well as the object as a whole.
 *
 * Classes that inherit from this have pre-defined properties, to which you can
 * add your owns. The pre-defined properties are listed in this documentation as
 * 'Observable Properties', and have their own accessors; for example,
 * {@link ol.Map} has a `target` property, accessed with `getTarget()`  and
 * changed with `setTarget()`. Not all properties are however settable. There
 * are also general-purpose accessors `get()` and `set()`. For example,
 * `get('target')` is equivalent to `getTarget()`.
 *
 * The `set` accessors trigger a change event, and you can monitor this by
 * registering a listener. For example, {@link ol.View} has a `center`
 * property, so `view.on('change:center', function(evt) {...});` would call the
 * function whenever the value of the center property changes. Within the
 * function, `evt.target` would be the view, so `evt.target.getCenter()` would
 * return the new center.
 *
 * You can add your own observable properties with
 * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
 * You can listen for changes on that property value with
 * `object.on('change:prop', listener)`. You can get a list of all
 * properties with {@link ol.Object#getProperties object.getProperties()}.
 *
 * Note that the observable properties are separate from standard JS properties.
 * You can, for example, give your map object a title with
 * `map.title='New title'` and with `map.set('title', 'Another title')`. The
 * first will be a `hasOwnProperty`; the second will appear in
 * `getProperties()`. Only the second is observable.
 *
 * Properties can be deleted by using the unset method. E.g.
 * object.unset('foo').
 *
 * @constructor
 * @extends {ol.Observable}
 * @param {Object.<string, *>=} opt_values An object with key-value pairs.
 * @fires ol.Object.Event
 * @api
 */
ol.Object = function(opt_values) {
  ol.Observable.call(this);

  // Call ol.getUid to ensure that the order of objects' ids is the same as
  // the order in which they were created.  This also helps to ensure that
  // object properties are always added in the same order, which helps many
  // JavaScript engines generate faster code.
  ol.getUid(this);

  /**
   * @private
   * @type {!Object.<string, *>}
   */
  this.values_ = {};

  if (opt_values !== undefined) {
    this.setProperties(opt_values);
  }
};
ol.inherits(ol.Object, ol.Observable);


/**
 * @private
 * @type {Object.<string, string>}
 */
ol.Object.changeEventTypeCache_ = {};


/**
 * @param {string} key Key name.
 * @return {string} Change name.
 */
ol.Object.getChangeEventType = function(key) {
  return ol.Object.changeEventTypeCache_.hasOwnProperty(key) ?
    ol.Object.changeEventTypeCache_[key] :
    (ol.Object.changeEventTypeCache_[key] = 'change:' + key);
};


/**
 * Gets a value.
 * @param {string} key Key name.
 * @return {*} Value.
 * @api
 */
ol.Object.prototype.get = function(key) {
  var value;
  if (this.values_.hasOwnProperty(key)) {
    value = this.values_[key];
  }
  return value;
};


/**
 * Get a list of object property names.
 * @return {Array.<string>} List of property names.
 * @api
 */
ol.Object.prototype.getKeys = function() {
  return Object.keys(this.values_);
};


/**
 * Get an object of all property names and values.
 * @return {Object.<string, *>} Object.
 * @api
 */
ol.Object.prototype.getProperties = function() {
  return ol.obj.assign({}, this.values_);
};


/**
 * @param {string} key Key name.
 * @param {*} oldValue Old value.
 */
ol.Object.prototype.notify = function(key, oldValue) {
  var eventType;
  eventType = ol.Object.getChangeEventType(key);
  this.dispatchEvent(new ol.Object.Event(eventType, key, oldValue));
  eventType = ol.ObjectEventType.PROPERTYCHANGE;
  this.dispatchEvent(new ol.Object.Event(eventType, key, oldValue));
};


/**
 * Sets a value.
 * @param {string} key Key name.
 * @param {*} value Value.
 * @param {boolean=} opt_silent Update without triggering an event.
 * @api
 */
ol.Object.prototype.set = function(key, value, opt_silent) {
  if (opt_silent) {
    this.values_[key] = value;
  } else {
    var oldValue = this.values_[key];
    this.values_[key] = value;
    if (oldValue !== value) {
      this.notify(key, oldValue);
    }
  }
};


/**
 * Sets a collection of key-value pairs.  Note that this changes any existing
 * properties and adds new ones (it does not remove any existing properties).
 * @param {Object.<string, *>} values Values.
 * @param {boolean=} opt_silent Update without triggering an event.
 * @api
 */
ol.Object.prototype.setProperties = function(values, opt_silent) {
  var key;
  for (key in values) {
    this.set(key, values[key], opt_silent);
  }
};


/**
 * Unsets a property.
 * @param {string} key Key name.
 * @param {boolean=} opt_silent Unset without triggering an event.
 * @api
 */
ol.Object.prototype.unset = function(key, opt_silent) {
  if (key in this.values_) {
    var oldValue = this.values_[key];
    delete this.values_[key];
    if (!opt_silent) {
      this.notify(key, oldValue);
    }
  }
};


/**
 * @classdesc
 * Events emitted by {@link ol.Object} instances are instances of this type.
 *
 * @param {string} type The event type.
 * @param {string} key The property name.
 * @param {*} oldValue The old value for `key`.
 * @extends {ol.events.Event}
 * @implements {oli.Object.Event}
 * @constructor
 */
ol.Object.Event = function(type, key, oldValue) {
  ol.events.Event.call(this, type);

  /**
   * The name of the property whose value is changing.
   * @type {string}
   * @api
   */
  this.key = key;

  /**
   * The old value. To get the new value use `e.target.get(e.key)` where
   * `e` is the event object.
   * @type {*}
   * @api
   */
  this.oldValue = oldValue;

};
ol.inherits(ol.Object.Event, ol.events.Event);

/**
 * An implementation of Google Maps' MVCArray.
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('ol.Collection');

goog.require('ol');
goog.require('ol.AssertionError');
goog.require('ol.CollectionEventType');
goog.require('ol.Object');
goog.require('ol.events.Event');


/**
 * @classdesc
 * An expanded version of standard JS Array, adding convenience methods for
 * manipulation. Add and remove changes to the Collection trigger a Collection
 * event. Note that this does not cover changes to the objects _within_ the
 * Collection; they trigger events on the appropriate object, not on the
 * Collection as a whole.
 *
 * @constructor
 * @extends {ol.Object}
 * @fires ol.Collection.Event
 * @param {Array.<T>=} opt_array Array.
 * @param {olx.CollectionOptions=} opt_options Collection options.
 * @template T
 * @api
 */
ol.Collection = function(opt_array, opt_options) {

  ol.Object.call(this);

  var options = opt_options || {};

  /**
   * @private
   * @type {boolean}
   */
  this.unique_ = !!options.unique;

  /**
   * @private
   * @type {!Array.<T>}
   */
  this.array_ = opt_array ? opt_array : [];

  if (this.unique_) {
    for (var i = 0, ii = this.array_.length; i < ii; ++i) {
      this.assertUnique_(this.array_[i], i);
    }
  }

  this.updateLength_();

};
ol.inherits(ol.Collection, ol.Object);


/**
 * Remove all elements from the collection.
 * @api
 */
ol.Collection.prototype.clear = function() {
  while (this.getLength() > 0) {
    this.pop();
  }
};


/**
 * Add elements to the collection.  This pushes each item in the provided array
 * to the end of the collection.
 * @param {!Array.<T>} arr Array.
 * @return {ol.Collection.<T>} This collection.
 * @api
 */
ol.Collection.prototype.extend = function(arr) {
  var i, ii;
  for (i = 0, ii = arr.length; i < ii; ++i) {
    this.push(arr[i]);
  }
  return this;
};


/**
 * Iterate over each element, calling the provided callback.
 * @param {function(this: S, T, number, Array.<T>): *} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array). The return value is ignored.
 * @param {S=} opt_this The object to use as `this` in `f`.
 * @template S
 * @api
 */
ol.Collection.prototype.forEach = function(f, opt_this) {
  var fn = (opt_this) ? f.bind(opt_this) : f;
  var array = this.array_;
  for (var i = 0, ii = array.length; i < ii; ++i) {
    fn(array[i], i, array);
  }
};


/**
 * Get a reference to the underlying Array object. Warning: if the array
 * is mutated, no events will be dispatched by the collection, and the
 * collection's "length" property won't be in sync with the actual length
 * of the array.
 * @return {!Array.<T>} Array.
 * @api
 */
ol.Collection.prototype.getArray = function() {
  return this.array_;
};


/**
 * Get the element at the provided index.
 * @param {number} index Index.
 * @return {T} Element.
 * @api
 */
ol.Collection.prototype.item = function(index) {
  return this.array_[index];
};


/**
 * Get the length of this collection.
 * @return {number} The length of the array.
 * @observable
 * @api
 */
ol.Collection.prototype.getLength = function() {
  return /** @type {number} */ (this.get(ol.Collection.Property_.LENGTH));
};


/**
 * Insert an element at the provided index.
 * @param {number} index Index.
 * @param {T} elem Element.
 * @api
 */
ol.Collection.prototype.insertAt = function(index, elem) {
  if (this.unique_) {
    this.assertUnique_(elem);
  }
  this.array_.splice(index, 0, elem);
  this.updateLength_();
  this.dispatchEvent(
      new ol.Collection.Event(ol.CollectionEventType.ADD, elem));
};


/**
 * Remove the last element of the collection and return it.
 * Return `undefined` if the collection is empty.
 * @return {T|undefined} Element.
 * @api
 */
ol.Collection.prototype.pop = function() {
  return this.removeAt(this.getLength() - 1);
};


/**
 * Insert the provided element at the end of the collection.
 * @param {T} elem Element.
 * @return {number} New length of the collection.
 * @api
 */
ol.Collection.prototype.push = function(elem) {
  if (this.unique_) {
    this.assertUnique_(elem);
  }
  var n = this.getLength();
  this.insertAt(n, elem);
  return this.getLength();
};


/**
 * Remove the first occurrence of an element from the collection.
 * @param {T} elem Element.
 * @return {T|undefined} The removed element or undefined if none found.
 * @api
 */
ol.Collection.prototype.remove = function(elem) {
  var arr = this.array_;
  var i, ii;
  for (i = 0, ii = arr.length; i < ii; ++i) {
    if (arr[i] === elem) {
      return this.removeAt(i);
    }
  }
  return undefined;
};


/**
 * Remove the element at the provided index and return it.
 * Return `undefined` if the collection does not contain this index.
 * @param {number} index Index.
 * @return {T|undefined} Value.
 * @api
 */
ol.Collection.prototype.removeAt = function(index) {
  var prev = this.array_[index];
  this.array_.splice(index, 1);
  this.updateLength_();
  this.dispatchEvent(
      new ol.Collection.Event(ol.CollectionEventType.REMOVE, prev));
  return prev;
};


/**
 * Set the element at the provided index.
 * @param {number} index Index.
 * @param {T} elem Element.
 * @api
 */
ol.Collection.prototype.setAt = function(index, elem) {
  var n = this.getLength();
  if (index < n) {
    if (this.unique_) {
      this.assertUnique_(elem, index);
    }
    var prev = this.array_[index];
    this.array_[index] = elem;
    this.dispatchEvent(
        new ol.Collection.Event(ol.CollectionEventType.REMOVE, prev));
    this.dispatchEvent(
        new ol.Collection.Event(ol.CollectionEventType.ADD, elem));
  } else {
    var j;
    for (j = n; j < index; ++j) {
      this.insertAt(j, undefined);
    }
    this.insertAt(index, elem);
  }
};


/**
 * @private
 */
ol.Collection.prototype.updateLength_ = function() {
  this.set(ol.Collection.Property_.LENGTH, this.array_.length);
};


/**
 * @private
 * @param {T} elem Element.
 * @param {number=} opt_except Optional index to ignore.
 */
ol.Collection.prototype.assertUnique_ = function(elem, opt_except) {
  for (var i = 0, ii = this.array_.length; i < ii; ++i) {
    if (this.array_[i] === elem && i !== opt_except) {
      throw new ol.AssertionError(58);
    }
  }
};


/**
 * @enum {string}
 * @private
 */
ol.Collection.Property_ = {
  LENGTH: 'length'
};


/**
 * @classdesc
 * Events emitted by {@link ol.Collection} instances are instances of this
 * type.
 *
 * @constructor
 * @extends {ol.events.Event}
 * @implements {oli.Collection.Event}
 * @param {ol.CollectionEventType} type Type.
 * @param {*=} opt_element Element.
 */
ol.Collection.Event = function(type, opt_element) {

  ol.events.Event.call(this, type);

  /**
   * The element that is added to or removed from the collection.
   * @type {*}
   * @api
   */
  this.element = opt_element;

};
ol.inherits(ol.Collection.Event, ol.events.Event);

goog.provide('ol.MapEvent');

goog.require('ol');
goog.require('ol.events.Event');


/**
 * @classdesc
 * Events emitted as map events are instances of this type.
 * See {@link ol.Map} for which events trigger a map event.
 *
 * @constructor
 * @extends {ol.events.Event}
 * @implements {oli.MapEvent}
 * @param {string} type Event type.
 * @param {ol.PluggableMap} map Map.
 * @param {?olx.FrameState=} opt_frameState Frame state.
 */
ol.MapEvent = function(type, map, opt_frameState) {

  ol.events.Event.call(this, type);

  /**
   * The map where the event occurred.
   * @type {ol.PluggableMap}
   * @api
   */
  this.map = map;

  /**
   * The frame state at the time of the event.
   * @type {?olx.FrameState}
   * @api
   */
  this.frameState = opt_frameState !== undefined ? opt_frameState : null;

};
ol.inherits(ol.MapEvent, ol.events.Event);

goog.provide('ol.MapBrowserEvent');

goog.require('ol');
goog.require('ol.MapEvent');


/**
 * @classdesc
 * Events emitted as map browser events are instances of this type.
 * See {@link ol.Map} for which events trigger a map browser event.
 *
 * @constructor
 * @extends {ol.MapEvent}
 * @implements {oli.MapBrowserEvent}
 * @param {string} type Event type.
 * @param {ol.PluggableMap} map Map.
 * @param {Event} browserEvent Browser event.
 * @param {boolean=} opt_dragging Is the map currently being dragged?
 * @param {?olx.FrameState=} opt_frameState Frame state.
 */
ol.MapBrowserEvent = function(type, map, browserEvent, opt_dragging,
    opt_frameState) {

  ol.MapEvent.call(this, type, map, opt_frameState);

  /**
   * The original browser event.
   * @const
   * @type {Event}
   * @api
   */
  this.originalEvent = browserEvent;

  /**
   * The map pixel relative to the viewport corresponding to the original browser event.
   * @type {ol.Pixel}
   * @api
   */
  this.pixel = map.getEventPixel(browserEvent);

  /**
   * The coordinate in view projection corresponding to the original browser event.
   * @type {ol.Coordinate}
   * @api
   */
  this.coordinate = map.getCoordinateFromPixel(this.pixel);

  /**
   * Indicates if the map is currently being dragged. Only set for
   * `POINTERDRAG` and `POINTERMOVE` events. Default is `false`.
   *
   * @type {boolean}
   * @api
   */
  this.dragging = opt_dragging !== undefined ? opt_dragging : false;

};
ol.inherits(ol.MapBrowserEvent, ol.MapEvent);


/**
 * Prevents the default browser action.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault
 * @override
 * @api
 */
ol.MapBrowserEvent.prototype.preventDefault = function() {
  ol.MapEvent.prototype.preventDefault.call(this);
  this.originalEvent.preventDefault();
};


/**
 * Prevents further propagation of the current event.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation
 * @override
 * @api
 */
ol.MapBrowserEvent.prototype.stopPropagation = function() {
  ol.MapEvent.prototype.stopPropagation.call(this);
  this.originalEvent.stopPropagation();
};

goog.provide('ol.webgl');

/**
 * Constants taken from goog.webgl
 */


/**
 * @const
 * @type {number}
 */
ol.webgl.ONE = 1;


/**
 * @const
 * @type {number}
 */
ol.webgl.SRC_ALPHA = 0x0302;


/**
 * @const
 * @type {number}
 */
ol.webgl.COLOR_ATTACHMENT0 = 0x8CE0;


/**
 * @const
 * @type {number}
 */
ol.webgl.COLOR_BUFFER_BIT = 0x00004000;


/**
 * @const
 * @type {number}
 */
ol.webgl.TRIANGLES = 0x0004;


/**
 * @const
 * @type {number}
 */
ol.webgl.TRIANGLE_STRIP = 0x0005;


/**
 * @const
 * @type {number}
 */
ol.webgl.ONE_MINUS_SRC_ALPHA = 0x0303;


/**
 * @const
 * @type {number}
 */
ol.webgl.ARRAY_BUFFER = 0x8892;


/**
 * @const
 * @type {number}
 */
ol.webgl.ELEMENT_ARRAY_BUFFER = 0x8893;


/**
 * @const
 * @type {number}
 */
ol.webgl.STREAM_DRAW = 0x88E0;


/**
 * @const
 * @type {number}
 */
ol.webgl.STATIC_DRAW = 0x88E4;


/**
 * @const
 * @type {number}
 */
ol.webgl.DYNAMIC_DRAW = 0x88E8;


/**
 * @const
 * @type {number}
 */
ol.webgl.CULL_FACE = 0x0B44;


/**
 * @const
 * @type {number}
 */
ol.webgl.BLEND = 0x0BE2;


/**
 * @const
 * @type {number}
 */
ol.webgl.STENCIL_TEST = 0x0B90;


/**
 * @const
 * @type {number}
 */
ol.webgl.DEPTH_TEST = 0x0B71;


/**
 * @const
 * @type {number}
 */
ol.webgl.SCISSOR_TEST = 0x0C11;


/**
 * @const
 * @type {number}
 */
ol.webgl.UNSIGNED_BYTE = 0x1401;


/**
 * @const
 * @type {number}
 */
ol.webgl.UNSIGNED_SHORT = 0x1403;


/**
 * @const
 * @type {number}
 */
ol.webgl.UNSIGNED_INT = 0x1405;


/**
 * @const
 * @type {number}
 */
ol.webgl.FLOAT = 0x1406;


/**
 * @const
 * @type {number}
 */
ol.webgl.RGBA = 0x1908;


/**
 * @const
 * @type {number}
 */
ol.webgl.FRAGMENT_SHADER = 0x8B30;


/**
 * @const
 * @type {number}
 */
ol.webgl.VERTEX_SHADER = 0x8B31;


/**
 * @const
 * @type {number}
 */
ol.webgl.LINK_STATUS = 0x8B82;


/**
 * @const
 * @type {number}
 */
ol.webgl.LINEAR = 0x2601;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE_MAG_FILTER = 0x2800;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE_MIN_FILTER = 0x2801;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE_WRAP_S = 0x2802;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE_WRAP_T = 0x2803;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE_2D = 0x0DE1;


/**
 * @const
 * @type {number}
 */
ol.webgl.TEXTURE0 = 0x84C0;


/**
 * @const
 * @type {number}
 */
ol.webgl.CLAMP_TO_EDGE = 0x812F;


/**
 * @const
 * @type {number}
 */
ol.webgl.COMPILE_STATUS = 0x8B81;


/**
 * @const
 * @type {number}
 */
ol.webgl.FRAMEBUFFER = 0x8D40;


/** end of goog.webgl constants
 */


/**
 * @const
 * @private
 * @type {Array.<string>}
 */
ol.webgl.CONTEXT_IDS_ = [
  'experimental-webgl',
  'webgl',
  'webkit-3d',
  'moz-webgl'
];


/**
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {Object=} opt_attributes Attributes.
 * @return {WebGLRenderingContext} WebGL rendering context.
 */
ol.webgl.getContext = function(canvas, opt_attributes) {
  var context, i, ii = ol.webgl.CONTEXT_IDS_.length;
  for (i = 0; i < ii; ++i) {
    try {
      context = canvas.getContext(ol.webgl.CONTEXT_IDS_[i], opt_attributes);
      if (context) {
        return /** @type {!WebGLRenderingContext} */ (context);
      }
    } catch (e) {
      // pass
    }
  }
  return null;
};

goog.provide('ol.has');

goog.require('ol');
goog.require('ol.webgl');

var ua = typeof navigator !== 'undefined' ?
  navigator.userAgent.toLowerCase() : '';

/**
 * User agent string says we are dealing with Firefox as browser.
 * @type {boolean}
 */
ol.has.FIREFOX = ua.indexOf('firefox') !== -1;

/**
 * User agent string says we are dealing with Safari as browser.
 * @type {boolean}
 */
ol.has.SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;

/**
 * User agent string says we are dealing with a WebKit engine.
 * @type {boolean}
 */
ol.has.WEBKIT = ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;

/**
 * User agent string says we are dealing with a Mac as platform.
 * @type {boolean}
 */
ol.has.MAC = ua.indexOf('macintosh') !== -1;


/**
 * The ratio between physical pixels and device-independent pixels
 * (dips) on the device (`window.devicePixelRatio`).
 * @const
 * @type {number}
 * @api
 */
ol.has.DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;


/**
 * True if the browser's Canvas implementation implements {get,set}LineDash.
 * @type {boolean}
 */
ol.has.CANVAS_LINE_DASH = false;


/**
 * True if both the library and browser support Canvas.  Always `false`
 * if `ol.ENABLE_CANVAS` is set to `false` at compile time.
 * @const
 * @type {boolean}
 * @api
 */
ol.has.CANVAS = ol.ENABLE_CANVAS && (
  /**
   * @return {boolean} Canvas supported.
   */
  function() {
    if (!('HTMLCanvasElement' in window)) {
      return false;
    }
    try {
      var context = document.createElement('CANVAS').getContext('2d');
      if (!context) {
        return false;
      } else {
        if (context.setLineDash !== undefined) {
          ol.has.CANVAS_LINE_DASH = true;
        }
        return true;
      }
    } catch (e) {
      return false;
    }
  })();


/**
 * Indicates if DeviceOrientation is supported in the user's browser.
 * @const
 * @type {boolean}
 * @api
 */
ol.has.DEVICE_ORIENTATION = 'DeviceOrientationEvent' in window;


/**
 * Is HTML5 geolocation supported in the current browser?
 * @const
 * @type {boolean}
 * @api
 */
ol.has.GEOLOCATION = 'geolocation' in navigator;


/**
 * True if browser supports touch events.
 * @const
 * @type {boolean}
 * @api
 */
ol.has.TOUCH = ol.ASSUME_TOUCH || 'ontouchstart' in window;


/**
 * True if browser supports pointer events.
 * @const
 * @type {boolean}
 */
ol.has.POINTER = 'PointerEvent' in window;


/**
 * True if browser supports ms pointer events (IE 10).
 * @const
 * @type {boolean}
 */
ol.has.MSPOINTER = !!(navigator.msPointerEnabled);


/**
 * True if both OpenLayers and browser support WebGL.  Always `false`
 * if `ol.ENABLE_WEBGL` is set to `false` at compile time.
 * @const
 * @type {boolean}
 * @api
 */
ol.has.WEBGL;


(function() {
  if (ol.ENABLE_WEBGL) {
    var hasWebGL = false;
    var textureSize;
    var /** @type {Array.<string>} */ extensions = [];

    if ('WebGLRenderingContext' in window) {
      try {
        var canvas = /** @type {HTMLCanvasElement} */
            (document.createElement('CANVAS'));
        var gl = ol.webgl.getContext(canvas, {
          failIfMajorPerformanceCaveat: true
        });
        if (gl) {
          hasWebGL = true;
          textureSize = /** @type {number} */
            (gl.getParameter(gl.MAX_TEXTURE_SIZE));
          extensions = gl.getSupportedExtensions();
        }
      } catch (e) {
        // pass
      }
    }
    ol.has.WEBGL = hasWebGL;
    ol.WEBGL_EXTENSIONS = extensions;
    ol.WEBGL_MAX_TEXTURE_SIZE = textureSize;
  }
})();

goog.provide('ol.MapBrowserEventType');

goog.require('ol.events.EventType');


/**
 * Constants for event names.
 * @enum {string}
 */
ol.MapBrowserEventType = {

  /**
   * A true single click with no dragging and no double click. Note that this
   * event is delayed by 250 ms to ensure that it is not a double click.
   * @event ol.MapBrowserEvent#singleclick
   * @api
   */
  SINGLECLICK: 'singleclick',

  /**
   * A click with no dragging. A double click will fire two of this.
   * @event ol.MapBrowserEvent#click
   * @api
   */
  CLICK: ol.events.EventType.CLICK,

  /**
   * A true double click, with no dragging.
   * @event ol.MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: ol.events.EventType.DBLCLICK,

  /**
   * Triggered when a pointer is dragged.
   * @event ol.MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: 'pointerdrag',

  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event ol.MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: 'pointermove',

  POINTERDOWN: 'pointerdown',
  POINTERUP: 'pointerup',
  POINTEROVER: 'pointerover',
  POINTEROUT: 'pointerout',
  POINTERENTER: 'pointerenter',
  POINTERLEAVE: 'pointerleave',
  POINTERCANCEL: 'pointercancel'
};

goog.provide('ol.MapBrowserPointerEvent');

goog.require('ol');
goog.require('ol.MapBrowserEvent');


/**
 * @constructor
 * @extends {ol.MapBrowserEvent}
 * @param {string} type Event type.
 * @param {ol.PluggableMap} map Map.
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @param {boolean=} opt_dragging Is the map currently being dragged?
 * @param {?olx.FrameState=} opt_frameState Frame state.
 */
ol.MapBrowserPointerEvent = function(type, map, pointerEvent, opt_dragging,
    opt_frameState) {

  ol.MapBrowserEvent.call(this, type, map, pointerEvent.originalEvent, opt_dragging,
      opt_frameState);

  /**
   * @const
   * @type {ol.pointer.PointerEvent}
   */
  this.pointerEvent = pointerEvent;

};
ol.inherits(ol.MapBrowserPointerEvent, ol.MapBrowserEvent);

goog.provide('ol.pointer.EventType');


/**
 * Constants for event names.
 * @enum {string}
 */
ol.pointer.EventType = {
  POINTERMOVE: 'pointermove',
  POINTERDOWN: 'pointerdown',
  POINTERUP: 'pointerup',
  POINTEROVER: 'pointerover',
  POINTEROUT: 'pointerout',
  POINTERENTER: 'pointerenter',
  POINTERLEAVE: 'pointerleave',
  POINTERCANCEL: 'pointercancel'
};

goog.provide('ol.pointer.EventSource');


/**
 * @param {ol.pointer.PointerEventHandler} dispatcher Event handler.
 * @param {!Object.<string, function(Event)>} mapping Event
 *     mapping.
 * @constructor
 */
ol.pointer.EventSource = function(dispatcher, mapping) {
  /**
   * @type {ol.pointer.PointerEventHandler}
   */
  this.dispatcher = dispatcher;

  /**
   * @private
   * @const
   * @type {!Object.<string, function(Event)>}
   */
  this.mapping_ = mapping;
};


/**
 * List of events supported by this source.
 * @return {Array.<string>} Event names
 */
ol.pointer.EventSource.prototype.getEvents = function() {
  return Object.keys(this.mapping_);
};


/**
 * Returns the handler that should handle a given event type.
 * @param {string} eventType The event type.
 * @return {function(Event)} Handler
 */
ol.pointer.EventSource.prototype.getHandlerForEvent = function(eventType) {
  return this.mapping_[eventType];
};

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.MouseSource');

goog.require('ol');
goog.require('ol.pointer.EventSource');


/**
 * @param {ol.pointer.PointerEventHandler} dispatcher Event handler.
 * @constructor
 * @extends {ol.pointer.EventSource}
 */
ol.pointer.MouseSource = function(dispatcher) {
  var mapping = {
    'mousedown': this.mousedown,
    'mousemove': this.mousemove,
    'mouseup': this.mouseup,
    'mouseover': this.mouseover,
    'mouseout': this.mouseout
  };
  ol.pointer.EventSource.call(this, dispatcher, mapping);

  /**
   * @const
   * @type {!Object.<string, Event|Object>}
   */
  this.pointerMap = dispatcher.pointerMap;

  /**
   * @const
   * @type {Array.<ol.Pixel>}
   */
  this.lastTouches = [];
};
ol.inherits(ol.pointer.MouseSource, ol.pointer.EventSource);


/**
 * @const
 * @type {number}
 */
ol.pointer.MouseSource.POINTER_ID = 1;


/**
 * @const
 * @type {string}
 */
ol.pointer.MouseSource.POINTER_TYPE = 'mouse';


/**
 * Radius around touchend that swallows mouse events.
 *
 * @const
 * @type {number}
 */
ol.pointer.MouseSource.DEDUP_DIST = 25;


/**
 * Detect if a mouse event was simulated from a touch by
 * checking if previously there was a touch event at the
 * same position.
 *
 * FIXME - Known problem with the native Android browser on
 * Samsung GT-I9100 (Android 4.1.2):
 * In case the page is scrolled, this function does not work
 * correctly when a canvas is used (WebGL or canvas renderer).
 * Mouse listeners on canvas elements (for this browser), create
 * two mouse events: One 'good' and one 'bad' one (on other browsers or
 * when a div is used, there is only one event). For the 'bad' one,
 * clientX/clientY and also pageX/pageY are wrong when the page
 * is scrolled. Because of that, this function can not detect if
 * the events were simulated from a touch event. As result, a
 * pointer event at a wrong position is dispatched, which confuses
 * the map interactions.
 * It is unclear, how one can get the correct position for the event
 * or detect that the positions are invalid.
 *
 * @private
 * @param {Event} inEvent The in event.
 * @return {boolean} True, if the event was generated by a touch.
 */
ol.pointer.MouseSource.prototype.isEventSimulatedFromTouch_ = function(inEvent) {
  var lts = this.lastTouches;
  var x = inEvent.clientX, y = inEvent.clientY;
  for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
    // simulated mouse events will be swallowed near a primary touchend
    var dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]);
    if (dx <= ol.pointer.MouseSource.DEDUP_DIST &&
        dy <= ol.pointer.MouseSource.DEDUP_DIST) {
      return true;
    }
  }
  return false;
};


/**
 * Creates a copy of the original event that will be used
 * for the fake pointer event.
 *
 * @param {Event} inEvent The in event.
 * @param {ol.pointer.PointerEventHandler} dispatcher Event handler.
 * @return {Object} The copied event.
 */
ol.pointer.MouseSource.prepareEvent = function(inEvent, dispatcher) {
  var e = dispatcher.cloneEvent(inEvent, inEvent);

  // forward mouse preventDefault
  var pd = e.preventDefault;
  e.preventDefault = function() {
    inEvent.preventDefault();
    pd();
  };

  e.pointerId = ol.pointer.MouseSource.POINTER_ID;
  e.isPrimary = true;
  e.pointerType = ol.pointer.MouseSource.POINTER_TYPE;

  return e;
};


/**
 * Handler for `mousedown`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.mousedown = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    // TODO(dfreedman) workaround for some elements not sending mouseup
    // http://crbug/149091
    if (ol.pointer.MouseSource.POINTER_ID.toString() in this.pointerMap) {
      this.cancel(inEvent);
    }
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()] = inEvent;
    this.dispatcher.down(e, inEvent);
  }
};


/**
 * Handler for `mousemove`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.mousemove = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.move(e, inEvent);
  }
};


/**
 * Handler for `mouseup`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.mouseup = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var p = this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()];

    if (p && p.button === inEvent.button) {
      var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
      this.dispatcher.up(e, inEvent);
      this.cleanupMouse();
    }
  }
};


/**
 * Handler for `mouseover`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.mouseover = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.enterOver(e, inEvent);
  }
};


/**
 * Handler for `mouseout`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.mouseout = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.leaveOut(e, inEvent);
  }
};


/**
 * Dispatches a `pointercancel` event.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MouseSource.prototype.cancel = function(inEvent) {
  var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
  this.dispatcher.cancel(e, inEvent);
  this.cleanupMouse();
};


/**
 * Remove the mouse from the list of active pointers.
 */
ol.pointer.MouseSource.prototype.cleanupMouse = function() {
  delete this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()];
};

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.MsSource');

goog.require('ol');
goog.require('ol.pointer.EventSource');


/**
 * @param {ol.pointer.PointerEventHandler} dispatcher Event handler.
 * @constructor
 * @extends {ol.pointer.EventSource}
 */
ol.pointer.MsSource = function(dispatcher) {
  var mapping = {
    'MSPointerDown': this.msPointerDown,
    'MSPointerMove': this.msPointerMove,
    'MSPointerUp': this.msPointerUp,
    'MSPointerOut': this.msPointerOut,
    'MSPointerOver': this.msPointerOver,
    'MSPointerCancel': this.msPointerCancel,
    'MSGotPointerCapture': this.msGotPointerCapture,
    'MSLostPointerCapture': this.msLostPointerCapture
  };
  ol.pointer.EventSource.call(this, dispatcher, mapping);

  /**
   * @const
   * @type {!Object.<string, Event|Object>}
   */
  this.pointerMap = dispatcher.pointerMap;

  /**
   * @const
   * @type {Array.<string>}
   */
  this.POINTER_TYPES = [
    '',
    'unavailable',
    'touch',
    'pen',
    'mouse'
  ];
};
ol.inherits(ol.pointer.MsSource, ol.pointer.EventSource);


/**
 * Creates a copy of the original event that will be used
 * for the fake pointer event.
 *
 * @private
 * @param {Event} inEvent The in event.
 * @return {Object} The copied event.
 */
ol.pointer.MsSource.prototype.prepareEvent_ = function(inEvent) {
  var e = inEvent;
  if (typeof inEvent.pointerType === 'number') {
    e = this.dispatcher.cloneEvent(inEvent, inEvent);
    e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
  }

  return e;
};


/**
 * Remove this pointer from the list of active pointers.
 * @param {number} pointerId Pointer identifier.
 */
ol.pointer.MsSource.prototype.cleanup = function(pointerId) {
  delete this.pointerMap[pointerId.toString()];
};


/**
 * Handler for `msPointerDown`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerDown = function(inEvent) {
  this.pointerMap[inEvent.pointerId.toString()] = inEvent;
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.down(e, inEvent);
};


/**
 * Handler for `msPointerMove`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerMove = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.move(e, inEvent);
};


/**
 * Handler for `msPointerUp`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerUp = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.up(e, inEvent);
  this.cleanup(inEvent.pointerId);
};


/**
 * Handler for `msPointerOut`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerOut = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.leaveOut(e, inEvent);
};


/**
 * Handler for `msPointerOver`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerOver = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.enterOver(e, inEvent);
};


/**
 * Handler for `msPointerCancel`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msPointerCancel = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.cancel(e, inEvent);
  this.cleanup(inEvent.pointerId);
};


/**
 * Handler for `msLostPointerCapture`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msLostPointerCapture = function(inEvent) {
  var e = this.dispatcher.makeEvent('lostpointercapture',
      inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
};


/**
 * Handler for `msGotPointerCapture`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.MsSource.prototype.msGotPointerCapture = function(inEvent) {
  var e = this.dispatcher.makeEvent('gotpointercapture',
      inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
};

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.NativeSource');

goog.require('ol');
goog.require('ol.pointer.EventSource');


/**
 * @param {ol.pointer.PointerEventHandler} dispatcher Event handler.
 * @constructor
 * @extends {ol.pointer.EventSource}
 */
ol.pointer.NativeSource = function(dispatcher) {
  var mapping = {
    'pointerdown': this.pointerDown,
    'pointermove': this.pointerMove,
    'pointerup': this.pointerUp,
    'pointerout': this.pointerOut,
    'pointerover': this.pointerOver,
    'pointercancel': this.pointerCancel,
    'gotpointercapture': this.gotPointerCapture,
    'lostpointercapture': this.lostPointerCapture
  };
  ol.pointer.EventSource.call(this, dispatcher, mapping);
};
ol.inherits(ol.pointer.NativeSource, ol.pointer.EventSource);


/**
 * Handler for `pointerdown`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerDown = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `pointermove`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerMove = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `pointerup`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerUp = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `pointerout`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerOut = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `pointerover`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerOver = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `pointercancel`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.pointerCancel = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `lostpointercapture`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.lostPointerCapture = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};


/**
 * Handler for `gotpointercapture`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.NativeSource.prototype.gotPointerCapture = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.PointerEvent');


goog.require('ol');
goog.require('ol.events.Event');


/**
 * A class for pointer events.
 *
 * This class is used as an abstraction for mouse events,
 * touch events and even native pointer events.
 *
 * @constructor
 * @extends {ol.events.Event}
 * @param {string} type The type of the event to create.
 * @param {Event} originalEvent The event.
 * @param {Object.<string, ?>=} opt_eventDict An optional dictionary of
 *    initial event properties.
 */
ol.pointer.PointerEvent = function(type, originalEvent, opt_eventDict) {
  ol.events.Event.call(this, type);

  /**
   * @const
   * @type {Event}
   */
  this.originalEvent = originalEvent;

  var eventDict = opt_eventDict ? opt_eventDict : {};

  /**
   * @type {number}
   */
  this.buttons = this.getButtons_(eventDict);

  /**
   * @type {number}
   */
  this.pressure = this.getPressure_(eventDict, this.buttons);

  // MouseEvent related properties

  /**
   * @type {boolean}
   */
  this.bubbles = 'bubbles' in eventDict ? eventDict['bubbles'] : false;

  /**
   * @type {boolean}
   */
  this.cancelable = 'cancelable' in eventDict ? eventDict['cancelable'] : false;

  /**
   * @type {Object}
   */
  this.view = 'view' in eventDict ? eventDict['view'] : null;

  /**
   * @type {number}
   */
  this.detail = 'detail' in eventDict ? eventDict['detail'] : null;

  /**
   * @type {number}
   */
  this.screenX = 'screenX' in eventDict ? eventDict['screenX'] : 0;

  /**
   * @type {number}
   */
  this.screenY = 'screenY' in eventDict ? eventDict['screenY'] : 0;

  /**
   * @type {number}
   */
  this.clientX = 'clientX' in eventDict ? eventDict['clientX'] : 0;

  /**
   * @type {number}
   */
  this.clientY = 'clientY' in eventDict ? eventDict['clientY'] : 0;

  /**
   * @type {boolean}
   */
  this.ctrlKey = 'ctrlKey' in eventDict ? eventDict['ctrlKey'] : false;

  /**
   * @type {boolean}
   */
  this.altKey = 'altKey' in eventDict ? eventDict['altKey'] : false;

  /**
   * @type {boolean}
   */
  this.shiftKey = 'shiftKey' in eventDict ? eventDict['shiftKey'] : false;

  /**
   * @type {boolean}
   */
  this.metaKey = 'metaKey' in eventDict ? eventDict['metaKey'] : false;

  /**
   * @type {number}
   */
  this.button = 'button' in eventDict ? eventDict['button'] : 0;

  /**
   * @type {Node}
   */
  this.relatedTarget = 'relatedTarget' in eventDict ?
    eventDict['relatedTarget'] : null;

  // PointerEvent related properties

  /**
   * @const
   * @type {number}
   */
  this.pointerId = 'pointerId' in eventDict ? eventDict['pointerId'] : 0;

  /**
   * @type {number}
   */
  this.width = 'width' in eventDict ? eventDict['width'] : 0;

  /**
   * @type {number}
   */
  this.height = 'height' in eventDict ? eventDict['height'] : 0;

  /**
   * @type {number}
   */
  this.tiltX = 'tiltX' in eventDict ? eventDict['tiltX'] : 0;

  /**
   * @type {number}
   */
  this.tiltY = 'tiltY' in eventDict ? eventDict['tiltY'] : 0;

  /**
   * @type {string}
   */
  this.pointerType = 'pointerType' in eventDict ? eventDict['pointerType'] : '';

  /**
   * @type {number}
   */
  this.hwTimestamp = 'hwTimestamp' in eventDict ? eventDict['hwTimestamp'] : 0;

  /**
   * @type {boolean}
   */
  this.isPrimary = 'isPrimary' in eventDict ? eventDict['isPrimary'] : false;

  // keep the semantics of preventDefault
  if (originalEvent.preventDefault) {
    this.preventDefault = function() {
      originalEvent.preventDefault();
    };
  }
};
ol.inherits(ol.pointer.PointerEvent, ol.events.Event);


/**
 * @private
 * @param {Object.<string, ?>} eventDict The event dictionary.
 * @return {number} Button indicator.
 */
ol.pointer.PointerEvent.prototype.getButtons_ = function(eventDict) {
  // According to the w3c spec,
  // http://www.w3.org/TR/DOM-Level-3-Events/#events-MouseEvent-button
  // MouseEvent.button == 0 can mean either no mouse button depressed, or the
  // left mouse button depressed.
  //
  // As of now, the only way to distinguish between the two states of
  // MouseEvent.button is by using the deprecated MouseEvent.which property, as
  // this maps mouse buttons to positive integers > 0, and uses 0 to mean that
  // no mouse button is held.
  //
  // MouseEvent.which is derived from MouseEvent.button at MouseEvent creation,
  // but initMouseEvent does not expose an argument with which to set
  // MouseEvent.which. Calling initMouseEvent with a buttonArg of 0 will set
  // MouseEvent.button == 0 and MouseEvent.which == 1, breaking the expectations
  // of app developers.
  //
  // The only way to propagate the correct state of MouseEvent.which and
  // MouseEvent.button to a new MouseEvent.button == 0 and MouseEvent.which == 0
  // is to call initMouseEvent with a buttonArg value of -1.
  //
  // This is fixed with DOM Level 4's use of buttons
  var buttons;
  if (eventDict.buttons || ol.pointer.PointerEvent.HAS_BUTTONS) {
    buttons = eventDict.buttons;
  } else {
    switch (eventDict.which) {
      case 1: buttons = 1; break;
      case 2: buttons = 4; break;
      case 3: buttons = 2; break;
      default: buttons = 0;
    }
  }
  return buttons;
};


/**
 * @private
 * @param {Object.<string, ?>} eventDict The event dictionary.
 * @param {number} buttons Button indicator.
 * @return {number} The pressure.
 */
ol.pointer.PointerEvent.prototype.getPressure_ = function(eventDict, buttons) {
  // Spec requires that pointers without pressure specified use 0.5 for down
  // state and 0 for up state.
  var pressure = 0;
  if (eventDict.pressure) {
    pressure = eventDict.pressure;
  } else {
    pressure = buttons ? 0.5 : 0;
  }
  return pressure;
};


/**
 * Is the `buttons` property supported?
 * @type {boolean}
 */
ol.pointer.PointerEvent.HAS_BUTTONS = false;


/**
 * Checks if the `buttons` property is supported.
 */
(function() {
  try {
    var ev = new MouseEvent('click', {buttons: 1});
    ol.pointer.PointerEvent.HAS_BUTTONS = ev.buttons === 1;
  } catch (e) {
    // pass
  }
})();

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.TouchSource');

goog.require('ol');
goog.require('ol.array');
goog.require('ol.pointer.EventSource');
goog.require('ol.pointer.MouseSource');


/**
 * @constructor
 * @param {ol.pointer.PointerEventHandler} dispatcher The event handler.
 * @param {ol.pointer.MouseSource} mouseSource Mouse source.
 * @extends {ol.pointer.EventSource}
 */
ol.pointer.TouchSource = function(dispatcher, mouseSource) {
  var mapping = {
    'touchstart': this.touchstart,
    'touchmove': this.touchmove,
    'touchend': this.touchend,
    'touchcancel': this.touchcancel
  };
  ol.pointer.EventSource.call(this, dispatcher, mapping);

  /**
   * @const
   * @type {!Object.<string, Event|Object>}
   */
  this.pointerMap = dispatcher.pointerMap;

  /**
   * @const
   * @type {ol.pointer.MouseSource}
   */
  this.mouseSource = mouseSource;

  /**
   * @private
   * @type {number|undefined}
   */
  this.firstTouchId_ = undefined;

  /**
   * @private
   * @type {number}
   */
  this.clickCount_ = 0;

  /**
   * @private
   * @type {number|undefined}
   */
  this.resetId_ = undefined;
};
ol.inherits(ol.pointer.TouchSource, ol.pointer.EventSource);


/**
 * Mouse event timeout: This should be long enough to
 * ignore compat mouse events made by touch.
 * @const
 * @type {number}
 */
ol.pointer.TouchSource.DEDUP_TIMEOUT = 2500;


/**
 * @const
 * @type {number}
 */
ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT = 200;


/**
 * @const
 * @type {string}
 */
ol.pointer.TouchSource.POINTER_TYPE = 'touch';


/**
 * @private
 * @param {Touch} inTouch The in touch.
 * @return {boolean} True, if this is the primary touch.
 */
ol.pointer.TouchSource.prototype.isPrimaryTouch_ = function(inTouch) {
  return this.firstTouchId_ === inTouch.identifier;
};


/**
 * Set primary touch if there are no pointers, or the only pointer is the mouse.
 * @param {Touch} inTouch The in touch.
 * @private
 */
ol.pointer.TouchSource.prototype.setPrimaryTouch_ = function(inTouch) {
  var count = Object.keys(this.pointerMap).length;
  if (count === 0 || (count === 1 &&
      ol.pointer.MouseSource.POINTER_ID.toString() in this.pointerMap)) {
    this.firstTouchId_ = inTouch.identifier;
    this.cancelResetClickCount_();
  }
};


/**
 * @private
 * @param {Object} inPointer The in pointer object.
 */
ol.pointer.TouchSource.prototype.removePrimaryPointer_ = function(inPointer) {
  if (inPointer.isPrimary) {
    this.firstTouchId_ = undefined;
    this.resetClickCount_();
  }
};


/**
 * @private
 */
ol.pointer.TouchSource.prototype.resetClickCount_ = function() {
  this.resetId_ = setTimeout(
      this.resetClickCountHandler_.bind(this),
      ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT);
};


/**
 * @private
 */
ol.pointer.TouchSource.prototype.resetClickCountHandler_ = function() {
  this.clickCount_ = 0;
  this.resetId_ = undefined;
};


/**
 * @private
 */
ol.pointer.TouchSource.prototype.cancelResetClickCount_ = function() {
  if (this.resetId_ !== undefined) {
    clearTimeout(this.resetId_);
  }
};


/**
 * @private
 * @param {Event} browserEvent Browser event
 * @param {Touch} inTouch Touch event
 * @return {Object} A pointer object.
 */
ol.pointer.TouchSource.prototype.touchToPointer_ = function(browserEvent, inTouch) {
  var e = this.dispatcher.cloneEvent(browserEvent, inTouch);
  // Spec specifies that pointerId 1 is reserved for Mouse.
  // Touch identifiers can start at 0.
  // Add 2 to the touch identifier for compatibility.
  e.pointerId = inTouch.identifier + 2;
  // TODO: check if this is necessary?
  //e.target = findTarget(e);
  e.bubbles = true;
  e.cancelable = true;
  e.detail = this.clickCount_;
  e.button = 0;
  e.buttons = 1;
  e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
  e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
  e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
  e.isPrimary = this.isPrimaryTouch_(inTouch);
  e.pointerType = ol.pointer.TouchSource.POINTER_TYPE;

  // make sure that the properties that are different for
  // each `Touch` object are not copied from the BrowserEvent object
  e.clientX = inTouch.clientX;
  e.clientY = inTouch.clientY;
  e.screenX = inTouch.screenX;
  e.screenY = inTouch.screenY;

  return e;
};


/**
 * @private
 * @param {Event} inEvent Touch event
 * @param {function(Event, Object)} inFunction In function.
 */
ol.pointer.TouchSource.prototype.processTouches_ = function(inEvent, inFunction) {
  var touches = Array.prototype.slice.call(
      inEvent.changedTouches);
  var count = touches.length;
  function preventDefault() {
    inEvent.preventDefault();
  }
  var i, pointer;
  for (i = 0; i < count; ++i) {
    pointer = this.touchToPointer_(inEvent, touches[i]);
    // forward touch preventDefaults
    pointer.preventDefault = preventDefault;
    inFunction.call(this, inEvent, pointer);
  }
};


/**
 * @private
 * @param {TouchList} touchList The touch list.
 * @param {number} searchId Search identifier.
 * @return {boolean} True, if the `Touch` with the given id is in the list.
 */
ol.pointer.TouchSource.prototype.findTouch_ = function(touchList, searchId) {
  var l = touchList.length;
  var touch;
  for (var i = 0; i < l; i++) {
    touch = touchList[i];
    if (touch.identifier === searchId) {
      return true;
    }
  }
  return false;
};


/**
 * In some instances, a touchstart can happen without a touchend. This
 * leaves the pointermap in a broken state.
 * Therefore, on every touchstart, we remove the touches that did not fire a
 * touchend event.
 * To keep state globally consistent, we fire a pointercancel for
 * this "abandoned" touch
 *
 * @private
 * @param {Event} inEvent The in event.
 */
ol.pointer.TouchSource.prototype.vacuumTouches_ = function(inEvent) {
  var touchList = inEvent.touches;
  // pointerMap.getCount() should be < touchList.length here,
  // as the touchstart has not been processed yet.
  var keys = Object.keys(this.pointerMap);
  var count = keys.length;
  if (count >= touchList.length) {
    var d = [];
    var i, key, value;
    for (i = 0; i < count; ++i) {
      key = keys[i];
      value = this.pointerMap[key];
      // Never remove pointerId == 1, which is mouse.
      // Touch identifiers are 2 smaller than their pointerId, which is the
      // index in pointermap.
      if (key != ol.pointer.MouseSource.POINTER_ID &&
          !this.findTouch_(touchList, key - 2)) {
        d.push(value.out);
      }
    }
    for (i = 0; i < d.length; ++i) {
      this.cancelOut_(inEvent, d[i]);
    }
  }
};


/**
 * Handler for `touchstart`, triggers `pointerover`,
 * `pointerenter` and `pointerdown` events.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.TouchSource.prototype.touchstart = function(inEvent) {
  this.vacuumTouches_(inEvent);
  this.setPrimaryTouch_(inEvent.changedTouches[0]);
  this.dedupSynthMouse_(inEvent);
  this.clickCount_++;
  this.processTouches_(inEvent, this.overDown_);
};


/**
 * @private
 * @param {Event} browserEvent The event.
 * @param {Object} inPointer The in pointer object.
 */
ol.pointer.TouchSource.prototype.overDown_ = function(browserEvent, inPointer) {
  this.pointerMap[inPointer.pointerId] = {
    target: inPointer.target,
    out: inPointer,
    outTarget: inPointer.target
  };
  this.dispatcher.over(inPointer, browserEvent);
  this.dispatcher.enter(inPointer, browserEvent);
  this.dispatcher.down(inPointer, browserEvent);
};


/**
 * Handler for `touchmove`.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.TouchSource.prototype.touchmove = function(inEvent) {
  inEvent.preventDefault();
  this.processTouches_(inEvent, this.moveOverOut_);
};


/**
 * @private
 * @param {Event} browserEvent The event.
 * @param {Object} inPointer The in pointer.
 */
ol.pointer.TouchSource.prototype.moveOverOut_ = function(browserEvent, inPointer) {
  var event = inPointer;
  var pointer = this.pointerMap[event.pointerId];
  // a finger drifted off the screen, ignore it
  if (!pointer) {
    return;
  }
  var outEvent = pointer.out;
  var outTarget = pointer.outTarget;
  this.dispatcher.move(event, browserEvent);
  if (outEvent && outTarget !== event.target) {
    outEvent.relatedTarget = event.target;
    event.relatedTarget = outTarget;
    // recover from retargeting by shadow
    outEvent.target = outTarget;
    if (event.target) {
      this.dispatcher.leaveOut(outEvent, browserEvent);
      this.dispatcher.enterOver(event, browserEvent);
    } else {
      // clean up case when finger leaves the screen
      event.target = outTarget;
      event.relatedTarget = null;
      this.cancelOut_(browserEvent, event);
    }
  }
  pointer.out = event;
  pointer.outTarget = event.target;
};


/**
 * Handler for `touchend`, triggers `pointerup`,
 * `pointerout` and `pointerleave` events.
 *
 * @param {Event} inEvent The event.
 */
ol.pointer.TouchSource.prototype.touchend = function(inEvent) {
  this.dedupSynthMouse_(inEvent);
  this.processTouches_(inEvent, this.upOut_);
};


/**
 * @private
 * @param {Event} browserEvent An event.
 * @param {Object} inPointer The inPointer object.
 */
ol.pointer.TouchSource.prototype.upOut_ = function(browserEvent, inPointer) {
  this.dispatcher.up(inPointer, browserEvent);
  this.dispatcher.out(inPointer, browserEvent);
  this.dispatcher.leave(inPointer, browserEvent);
  this.cleanUpPointer_(inPointer);
};


/**
 * Handler for `touchcancel`, triggers `pointercancel`,
 * `pointerout` and `pointerleave` events.
 *
 * @param {Event} inEvent The in event.
 */
ol.pointer.TouchSource.prototype.touchcancel = function(inEvent) {
  this.processTouches_(inEvent, this.cancelOut_);
};


/**
 * @private
 * @param {Event} browserEvent The event.
 * @param {Object} inPointer The in pointer.
 */
ol.pointer.TouchSource.prototype.cancelOut_ = function(browserEvent, inPointer) {
  this.dispatcher.cancel(inPointer, browserEvent);
  this.dispatcher.out(inPointer, browserEvent);
  this.dispatcher.leave(inPointer, browserEvent);
  this.cleanUpPointer_(inPointer);
};


/**
 * @private
 * @param {Object} inPointer The inPointer object.
 */
ol.pointer.TouchSource.prototype.cleanUpPointer_ = function(inPointer) {
  delete this.pointerMap[inPointer.pointerId];
  this.removePrimaryPointer_(inPointer);
};


/**
 * Prevent synth mouse events from creating pointer events.
 *
 * @private
 * @param {Event} inEvent The in event.
 */
ol.pointer.TouchSource.prototype.dedupSynthMouse_ = function(inEvent) {
  var lts = this.mouseSource.lastTouches;
  var t = inEvent.changedTouches[0];
  // only the primary finger will synth mouse events
  if (this.isPrimaryTouch_(t)) {
    // remember x/y of last touch
    var lt = [t.clientX, t.clientY];
    lts.push(lt);

    setTimeout(function() {
      // remove touch after timeout
      ol.array.remove(lts, lt);
    }, ol.pointer.TouchSource.DEDUP_TIMEOUT);
  }
};

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.pointer.PointerEventHandler');

goog.require('ol');
goog.require('ol.events');
goog.require('ol.events.EventTarget');

goog.require('ol.has');
goog.require('ol.pointer.EventType');
goog.require('ol.pointer.MouseSource');
goog.require('ol.pointer.MsSource');
goog.require('ol.pointer.NativeSource');
goog.require('ol.pointer.PointerEvent');
goog.require('ol.pointer.TouchSource');


/**
 * @constructor
 * @extends {ol.events.EventTarget}
 * @param {Element|HTMLDocument} element Viewport element.
 */
ol.pointer.PointerEventHandler = function(element) {
  ol.events.EventTarget.call(this);

  /**
   * @const
   * @private
   * @type {Element|HTMLDocument}
   */
  this.element_ = element;

  /**
   * @const
   * @type {!Object.<string, Event|Object>}
   */
  this.pointerMap = {};

  /**
   * @type {Object.<string, function(Event)>}
   * @private
   */
  this.eventMap_ = {};

  /**
   * @type {Array.<ol.pointer.EventSource>}
   * @private
   */
  this.eventSourceList_ = [];

  this.registerSources();
};
ol.inherits(ol.pointer.PointerEventHandler, ol.events.EventTarget);


/**
 * Set up the event sources (mouse, touch and native pointers)
 * that generate pointer events.
 */
ol.pointer.PointerEventHandler.prototype.registerSources = function() {
  if (ol.has.POINTER) {
    this.registerSource('native', new ol.pointer.NativeSource(this));
  } else if (ol.has.MSPOINTER) {
    this.registerSource('ms', new ol.pointer.MsSource(this));
  } else {
    var mouseSource = new ol.pointer.MouseSource(this);
    this.registerSource('mouse', mouseSource);

    if (ol.has.TOUCH) {
      this.registerSource('touch',
          new ol.pointer.TouchSource(this, mouseSource));
    }
  }

  // register events on the viewport element
  this.register_();
};


/**
 * Add a new event source that will generate pointer events.
 *
 * @param {string} name A name for the event source
 * @param {ol.pointer.EventSource} source The source event.
 */
ol.pointer.PointerEventHandler.prototype.registerSource = function(name, source) {
  var s = source;
  var newEvents = s.getEvents();

  if (newEvents) {
    newEvents.forEach(function(e) {
      var handler = s.getHandlerForEvent(e);

      if (handler) {
        this.eventMap_[e] = handler.bind(s);
      }
    }, this);
    this.eventSourceList_.push(s);
  }
};


/**
 * Set up the events for all registered event sources.
 * @private
 */
ol.pointer.PointerEventHandler.prototype.register_ = function() {
  var l = this.eventSourceList_.length;
  var eventSource;
  for (var i = 0; i < l; i++) {
    eventSource = this.eventSourceList_[i];
    this.addEvents_(eventSource.getEvents());
  }
};


/**
 * Remove all registered events.
 * @private
 */
ol.pointer.PointerEventHandler.prototype.unregister_ = function() {
  var l = this.eventSourceList_.length;
  var eventSource;
  for (var i = 0; i < l; i++) {
    eventSource = this.eventSourceList_[i];
    this.removeEvents_(eventSource.getEvents());
  }
};


/**
 * Calls the right handler for a new event.
 * @private
 * @param {Event} inEvent Browser event.
 */
ol.pointer.PointerEventHandler.prototype.eventHandler_ = function(inEvent) {
  var type = inEvent.type;
  var handler = this.eventMap_[type];
  if (handler) {
    handler(inEvent);
  }
};


/**
 * Setup listeners for the given events.
 * @private
 * @param {Array.<string>} events List of events.
 */
ol.pointer.PointerEventHandler.prototype.addEvents_ = function(events) {
  events.forEach(function(eventName) {
    ol.events.listen(this.element_, eventName, this.eventHandler_, this);
  }, this);
};


/**
 * Unregister listeners for the given events.
 * @private
 * @param {Array.<string>} events List of events.
 */
ol.pointer.PointerEventHandler.prototype.removeEvents_ = function(events) {
  events.forEach(function(e) {
    ol.events.unlisten(this.element_, e, this.eventHandler_, this);
  }, this);
};


/**
 * Returns a snapshot of inEvent, with writable properties.
 *
 * @param {Event} event Browser event.
 * @param {Event|Touch} inEvent An event that contains
 *    properties to copy.
 * @return {Object} An object containing shallow copies of
 *    `inEvent`'s properties.
 */
ol.pointer.PointerEventHandler.prototype.cloneEvent = function(event, inEvent) {
  var eventCopy = {}, p;
  for (var i = 0, ii = ol.pointer.PointerEventHandler.CLONE_PROPS.length; i < ii; i++) {
    p = ol.pointer.PointerEventHandler.CLONE_PROPS[i][0];
    eventCopy[p] = event[p] || inEvent[p] || ol.pointer.PointerEventHandler.CLONE_PROPS[i][1];
  }

  return eventCopy;
};


// EVENTS


/**
 * Triggers a 'pointerdown' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.down = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERDOWN, data, event);
};


/**
 * Triggers a 'pointermove' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.move = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERMOVE, data, event);
};


/**
 * Triggers a 'pointerup' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.up = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERUP, data, event);
};


/**
 * Triggers a 'pointerenter' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.enter = function(data, event) {
  data.bubbles = false;
  this.fireEvent(ol.pointer.EventType.POINTERENTER, data, event);
};


/**
 * Triggers a 'pointerleave' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.leave = function(data, event) {
  data.bubbles = false;
  this.fireEvent(ol.pointer.EventType.POINTERLEAVE, data, event);
};


/**
 * Triggers a 'pointerover' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.over = function(data, event) {
  data.bubbles = true;
  this.fireEvent(ol.pointer.EventType.POINTEROVER, data, event);
};


/**
 * Triggers a 'pointerout' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.out = function(data, event) {
  data.bubbles = true;
  this.fireEvent(ol.pointer.EventType.POINTEROUT, data, event);
};


/**
 * Triggers a 'pointercancel' event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.cancel = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERCANCEL, data, event);
};


/**
 * Triggers a combination of 'pointerout' and 'pointerleave' events.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.leaveOut = function(data, event) {
  this.out(data, event);
  if (!this.contains_(data.target, data.relatedTarget)) {
    this.leave(data, event);
  }
};


/**
 * Triggers a combination of 'pointerover' and 'pointerevents' events.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.enterOver = function(data, event) {
  this.over(data, event);
  if (!this.contains_(data.target, data.relatedTarget)) {
    this.enter(data, event);
  }
};


/**
 * @private
 * @param {Element} container The container element.
 * @param {Element} contained The contained element.
 * @return {boolean} Returns true if the container element
 *   contains the other element.
 */
ol.pointer.PointerEventHandler.prototype.contains_ = function(container, contained) {
  if (!container || !contained) {
    return false;
  }
  return container.contains(contained);
};


// EVENT CREATION AND TRACKING
/**
 * Creates a new Event of type `inType`, based on the information in
 * `data`.
 *
 * @param {string} inType A string representing the type of event to create.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 * @return {ol.pointer.PointerEvent} A PointerEvent of type `inType`.
 */
ol.pointer.PointerEventHandler.prototype.makeEvent = function(inType, data, event) {
  return new ol.pointer.PointerEvent(inType, event, data);
};


/**
 * Make and dispatch an event in one call.
 * @param {string} inType A string representing the type of event.
 * @param {Object} data Pointer event data.
 * @param {Event} event The event.
 */
ol.pointer.PointerEventHandler.prototype.fireEvent = function(inType, data, event) {
  var e = this.makeEvent(inType, data, event);
  this.dispatchEvent(e);
};


/**
 * Creates a pointer event from a native pointer event
 * and dispatches this event.
 * @param {Event} event A platform event with a target.
 */
ol.pointer.PointerEventHandler.prototype.fireNativeEvent = function(event) {
  var e = this.makeEvent(event.type, event, event);
  this.dispatchEvent(e);
};


/**
 * Wrap a native mouse event into a pointer event.
 * This proxy method is required for the legacy IE support.
 * @param {string} eventType The pointer event type.
 * @param {Event} event The event.
 * @return {ol.pointer.PointerEvent} The wrapped event.
 */
ol.pointer.PointerEventHandler.prototype.wrapMouseEvent = function(eventType, event) {
  var pointerEvent = this.makeEvent(
      eventType, ol.pointer.MouseSource.prepareEvent(event, this), event);
  return pointerEvent;
};


/**
 * @inheritDoc
 */
ol.pointer.PointerEventHandler.prototype.disposeInternal = function() {
  this.unregister_();
  ol.events.EventTarget.prototype.disposeInternal.call(this);
};


/**
 * Properties to copy when cloning an event, with default values.
 * @type {Array.<Array>}
 */
ol.pointer.PointerEventHandler.CLONE_PROPS = [
  // MouseEvent
  ['bubbles', false],
  ['cancelable', false],
  ['view', null],
  ['detail', null],
  ['screenX', 0],
  ['screenY', 0],
  ['clientX', 0],
  ['clientY', 0],
  ['ctrlKey', false],
  ['altKey', false],
  ['shiftKey', false],
  ['metaKey', false],
  ['button', 0],
  ['relatedTarget', null],
  // DOM Level 3
  ['buttons', 0],
  // PointerEvent
  ['pointerId', 0],
  ['width', 0],
  ['height', 0],
  ['pressure', 0],
  ['tiltX', 0],
  ['tiltY', 0],
  ['pointerType', ''],
  ['hwTimestamp', 0],
  ['isPrimary', false],
  // event instance
  ['type', ''],
  ['target', null],
  ['currentTarget', null],
  ['which', 0]
];

goog.provide('ol.MapBrowserEventHandler');

goog.require('ol');
goog.require('ol.has');
goog.require('ol.MapBrowserEventType');
goog.require('ol.MapBrowserPointerEvent');
goog.require('ol.events');
goog.require('ol.events.EventTarget');
goog.require('ol.pointer.EventType');
goog.require('ol.pointer.PointerEventHandler');


/**
 * @param {ol.PluggableMap} map The map with the viewport to listen to events on.
 * @param {number|undefined} moveTolerance The minimal distance the pointer must travel to trigger a move.
 * @constructor
 * @extends {ol.events.EventTarget}
 */
ol.MapBrowserEventHandler = function(map, moveTolerance) {

  ol.events.EventTarget.call(this);

  /**
   * This is the element that we will listen to the real events on.
   * @type {ol.PluggableMap}
   * @private
   */
  this.map_ = map;

  /**
   * @type {number}
   * @private
   */
  this.clickTimeoutId_ = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.dragging_ = false;

  /**
   * @type {!Array.<ol.EventsKey>}
   * @private
   */
  this.dragListenerKeys_ = [];

  /**
   * @type {number}
   * @private
   */
  this.moveTolerance_ = moveTolerance ?
    moveTolerance * ol.has.DEVICE_PIXEL_RATIO : ol.has.DEVICE_PIXEL_RATIO;

  /**
   * The most recent "down" type event (or null if none have occurred).
   * Set on pointerdown.
   * @type {ol.pointer.PointerEvent}
   * @private
   */
  this.down_ = null;

  var element = this.map_.getViewport();

  /**
   * @type {number}
   * @private
   */
  this.activePointers_ = 0;

  /**
   * @type {!Object.<number, boolean>}
   * @private
   */
  this.trackedTouches_ = {};

  /**
   * Event handler which generates pointer events for
   * the viewport element.
   *
   * @type {ol.pointer.PointerEventHandler}
   * @private
   */
  this.pointerEventHandler_ = new ol.pointer.PointerEventHandler(element);

  /**
   * Event handler which generates pointer events for
   * the document (used when dragging).
   *
   * @type {ol.pointer.PointerEventHandler}
   * @private
   */
  this.documentPointerEventHandler_ = null;

  /**
   * @type {?ol.EventsKey}
   * @private
   */
  this.pointerdownListenerKey_ = ol.events.listen(this.pointerEventHandler_,
      ol.pointer.EventType.POINTERDOWN,
      this.handlePointerDown_, this);

  /**
   * @type {?ol.EventsKey}
   * @private
   */
  this.relayedListenerKey_ = ol.events.listen(this.pointerEventHandler_,
      ol.pointer.EventType.POINTERMOVE,
      this.relayEvent_, this);

};
ol.inherits(ol.MapBrowserEventHandler, ol.events.EventTarget);


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.emulateClick_ = function(pointerEvent) {
  var newEvent = new ol.MapBrowserPointerEvent(
      ol.MapBrowserEventType.CLICK, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);
  if (this.clickTimeoutId_ !== 0) {
    // double-click
    clearTimeout(this.clickTimeoutId_);
    this.clickTimeoutId_ = 0;
    newEvent = new ol.MapBrowserPointerEvent(
        ol.MapBrowserEventType.DBLCLICK, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);
  } else {
    // click
    this.clickTimeoutId_ = setTimeout(function() {
      this.clickTimeoutId_ = 0;
      var newEvent = new ol.MapBrowserPointerEvent(
          ol.MapBrowserEventType.SINGLECLICK, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);
    }.bind(this), 250);
  }
};


/**
 * Keeps track on how many pointers are currently active.
 *
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.updateActivePointers_ = function(pointerEvent) {
  var event = pointerEvent;

  if (event.type == ol.MapBrowserEventType.POINTERUP ||
      event.type == ol.MapBrowserEventType.POINTERCANCEL) {
    delete this.trackedTouches_[event.pointerId];
  } else if (event.type == ol.MapBrowserEventType.POINTERDOWN) {
    this.trackedTouches_[event.pointerId] = true;
  }
  this.activePointers_ = Object.keys(this.trackedTouches_).length;
};


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handlePointerUp_ = function(pointerEvent) {
  this.updateActivePointers_(pointerEvent);
  var newEvent = new ol.MapBrowserPointerEvent(
      ol.MapBrowserEventType.POINTERUP, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);

  // We emulate click events on left mouse button click, touch contact, and pen
  // contact. isMouseActionButton returns true in these cases (evt.button is set
  // to 0).
  // See http://www.w3.org/TR/pointerevents/#button-states
  // We only fire click, singleclick, and doubleclick if nobody has called
  // event.stopPropagation() or event.preventDefault().
  if (!newEvent.propagationStopped && !this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
    this.emulateClick_(this.down_);
  }

  if (this.activePointers_ === 0) {
    this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
    this.dragListenerKeys_.length = 0;
    this.dragging_ = false;
    this.down_ = null;
    this.documentPointerEventHandler_.dispose();
    this.documentPointerEventHandler_ = null;
  }
};


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @return {boolean} If the left mouse button was pressed.
 * @private
 */
ol.MapBrowserEventHandler.prototype.isMouseActionButton_ = function(pointerEvent) {
  return pointerEvent.button === 0;
};


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handlePointerDown_ = function(pointerEvent) {
  this.updateActivePointers_(pointerEvent);
  var newEvent = new ol.MapBrowserPointerEvent(
      ol.MapBrowserEventType.POINTERDOWN, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);

  this.down_ = pointerEvent;

  if (this.dragListenerKeys_.length === 0) {
    /* Set up a pointer event handler on the `document`,
     * which is required when the pointer is moved outside
     * the viewport when dragging.
     */
    this.documentPointerEventHandler_ =
        new ol.pointer.PointerEventHandler(document);

    this.dragListenerKeys_.push(
        ol.events.listen(this.documentPointerEventHandler_,
            ol.MapBrowserEventType.POINTERMOVE,
            this.handlePointerMove_, this),
        ol.events.listen(this.documentPointerEventHandler_,
            ol.MapBrowserEventType.POINTERUP,
            this.handlePointerUp_, this),
        /* Note that the listener for `pointercancel is set up on
       * `pointerEventHandler_` and not `documentPointerEventHandler_` like
       * the `pointerup` and `pointermove` listeners.
       *
       * The reason for this is the following: `TouchSource.vacuumTouches_()`
       * issues `pointercancel` events, when there was no `touchend` for a
       * `touchstart`. Now, let's say a first `touchstart` is registered on
       * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
       * But `documentPointerEventHandler_` doesn't know about the first
       * `touchstart`. If there is no `touchend` for the `touchstart`, we can
       * only receive a `touchcancel` from `pointerEventHandler_`, because it is
       * only registered there.
       */
        ol.events.listen(this.pointerEventHandler_,
            ol.MapBrowserEventType.POINTERCANCEL,
            this.handlePointerUp_, this)
    );
  }
};


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handlePointerMove_ = function(pointerEvent) {
  // Between pointerdown and pointerup, pointermove events are triggered.
  // To avoid a 'false' touchmove event to be dispatched, we test if the pointer
  // moved a significant distance.
  if (this.isMoving_(pointerEvent)) {
    this.dragging_ = true;
    var newEvent = new ol.MapBrowserPointerEvent(
        ol.MapBrowserEventType.POINTERDRAG, this.map_, pointerEvent,
        this.dragging_);
    this.dispatchEvent(newEvent);
  }

  // Some native android browser triggers mousemove events during small period
  // of time. See: https://code.google.com/p/android/issues/detail?id=5491 or
  // https://code.google.com/p/android/issues/detail?id=19827
  // ex: Galaxy Tab P3110 + Android 4.1.1
  pointerEvent.preventDefault();
};


/**
 * Wrap and relay a pointer event.  Note that this requires that the type
 * string for the MapBrowserPointerEvent matches the PointerEvent type.
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.relayEvent_ = function(pointerEvent) {
  var dragging = !!(this.down_ && this.isMoving_(pointerEvent));
  this.dispatchEvent(new ol.MapBrowserPointerEvent(
      pointerEvent.type, this.map_, pointerEvent, dragging));
};


/**
 * @param {ol.pointer.PointerEvent} pointerEvent Pointer event.
 * @return {boolean} Is moving.
 * @private
 */
ol.MapBrowserEventHandler.prototype.isMoving_ = function(pointerEvent) {
  return Math.abs(pointerEvent.clientX - this.down_.clientX) > this.moveTolerance_ ||
      Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_;
};


/**
 * @inheritDoc
 */
ol.MapBrowserEventHandler.prototype.disposeInternal = function() {
  if (this.relayedListenerKey_) {
    ol.events.unlistenByKey(this.relayedListenerKey_);
    this.relayedListenerKey_ = null;
  }
  if (this.pointerdownListenerKey_) {
    ol.events.unlistenByKey(this.pointerdownListenerKey_);
    this.pointerdownListenerKey_ = null;
  }

  this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
  this.dragListenerKeys_.length = 0;

  if (this.documentPointerEventHandler_) {
    this.documentPointerEventHandler_.dispose();
    this.documentPointerEventHandler_ = null;
  }
  if (this.pointerEventHandler_) {
    this.pointerEventHandler_.dispose();
    this.pointerEventHandler_ = null;
  }
  ol.events.EventTarget.prototype.disposeInternal.call(this);
};

goog.provide('ol.MapEventType');

/**
 * @enum {string}
 */
ol.MapEventType = {

  /**
   * Triggered after a map frame is rendered.
   * @event ol.MapEvent#postrender
   * @api
   */
  POSTRENDER: 'postrender',

  /**
   * Triggered when the map starts moving.
   * @event ol.MapEvent#movestart
   * @api
   */
  MOVESTART: 'movestart',

  /**
   * Triggered after the map is moved.
   * @event ol.MapEvent#moveend
   * @api
   */
  MOVEEND: 'moveend'

};

goog.provide('ol.MapProperty');

/**
 * @enum {string}
 */
ol.MapProperty = {
  LAYERGROUP: 'layergroup',
  SIZE: 'size',
  TARGET: 'target',
  VIEW: 'view'
};

goog.provide('ol.TileState');

/**
 * @enum {number}
 */
ol.TileState = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3,
  EMPTY: 4,
  ABORT: 5
};

goog.provide('ol.structs.PriorityQueue');

goog.require('ol.asserts');
goog.require('ol.obj');


/**
 * Priority queue.
 *
 * The implementation is inspired from the Closure Library's Heap class and
 * Python's heapq module.
 *
 * @see http://closure-library.googlecode.com/svn/docs/closure_goog_structs_heap.js.source.html
 * @see http://hg.python.org/cpython/file/2.7/Lib/heapq.py
 *
 * @constructor
 * @param {function(T): number} priorityFunction Priority function.
 * @param {function(T): string} keyFunction Key function.
 * @struct
 * @template T
 */
ol.structs.PriorityQueue = function(priorityFunction, keyFunction) {

  /**
   * @type {function(T): number}
   * @private
   */
  this.priorityFunction_ = priorityFunction;

  /**
   * @type {function(T): string}
   * @private
   */
  this.keyFunction_ = keyFunction;

  /**
   * @type {Array.<T>}
   * @private
   */
  this.elements_ = [];

  /**
   * @type {Array.<number>}
   * @private
   */
  this.priorities_ = [];

  /**
   * @type {Object.<string, boolean>}
   * @private
   */
  this.queuedElements_ = {};

};


/**
 * @const
 * @type {number}
 */
ol.structs.PriorityQueue.DROP = Infinity;


/**
 * FIXME empty description for jsdoc
 */
ol.structs.PriorityQueue.prototype.clear = function() {
  this.elements_.length = 0;
  this.priorities_.length = 0;
  ol.obj.clear(this.queuedElements_);
};


/**
 * Remove and return the highest-priority element. O(log N).
 * @return {T} Element.
 */
ol.structs.PriorityQueue.prototype.dequeue = function() {
  var elements = this.elements_;
  var priorities = this.priorities_;
  var element = elements[0];
  if (elements.length == 1) {
    elements.length = 0;
    priorities.length = 0;
  } else {
    elements[0] = elements.pop();
    priorities[0] = priorities.pop();
    this.siftUp_(0);
  }
  var elementKey = this.keyFunction_(element);
  delete this.queuedElements_[elementKey];
  return element;
};


/**
 * Enqueue an element. O(log N).
 * @param {T} element Element.
 * @return {boolean} The element was added to the queue.
 */
ol.structs.PriorityQueue.prototype.enqueue = function(element) {
  ol.asserts.assert(!(this.keyFunction_(element) in this.queuedElements_),
      31); // Tried to enqueue an `element` that was already added to the queue
  var priority = this.priorityFunction_(element);
  if (priority != ol.structs.PriorityQueue.DROP) {
    this.elements_.push(element);
    this.priorities_.push(priority);
    this.queuedElements_[this.keyFunction_(element)] = true;
    this.siftDown_(0, this.elements_.length - 1);
    return true;
  }
  return false;
};


/**
 * @return {number} Count.
 */
ol.structs.PriorityQueue.prototype.getCount = function() {
  return this.elements_.length;
};


/**
 * Gets the index of the left child of the node at the given index.
 * @param {number} index The index of the node to get the left child for.
 * @return {number} The index of the left child.
 * @private
 */
ol.structs.PriorityQueue.prototype.getLeftChildIndex_ = function(index) {
  return index * 2 + 1;
};


/**
 * Gets the index of the right child of the node at the given index.
 * @param {number} index The index of the node to get the right child for.
 * @return {number} The index of the right child.
 * @private
 */
ol.structs.PriorityQueue.prototype.getRightChildIndex_ = function(index) {
  return index * 2 + 2;
};


/**
 * Gets the index of the parent of the node at the given index.
 * @param {number} index The index of the node to get the parent for.
 * @return {number} The index of the parent.
 * @private
 */
ol.structs.PriorityQueue.prototype.getParentIndex_ = function(index) {
  return (index - 1) >> 1;
};


/**
 * Make this a heap. O(N).
 * @private
 */
ol.structs.PriorityQueue.prototype.heapify_ = function() {
  var i;
  for (i = (this.elements_.length >> 1) - 1; i >= 0; i--) {
    this.siftUp_(i);
  }
};


/**
 * @return {boolean} Is empty.
 */
ol.structs.PriorityQueue.prototype.isEmpty = function() {
  return this.elements_.length === 0;
};


/**
 * @param {string} key Key.
 * @return {boolean} Is key queued.
 */
ol.structs.PriorityQueue.prototype.isKeyQueued = function(key) {
  return key in this.queuedElements_;
};


/**
 * @param {T} element Element.
 * @return {boolean} Is queued.
 */
ol.structs.PriorityQueue.prototype.isQueued = function(element) {
  return this.isKeyQueued(this.keyFunction_(element));
};


/**
 * @param {number} index The index of the node to move down.
 * @private
 */
ol.structs.PriorityQueue.prototype.siftUp_ = function(index) {
  var elements = this.elements_;
  var priorities = this.priorities_;
  var count = elements.length;
  var element = elements[index];
  var priority = priorities[index];
  var startIndex = index;

  while (index < (count >> 1)) {
    var lIndex = this.getLeftChildIndex_(index);
    var rIndex = this.getRightChildIndex_(index);

    var smallerChildIndex = rIndex < count &&
        priorities[rIndex] < priorities[lIndex] ?
      rIndex : lIndex;

    elements[index] = elements[smallerChildIndex];
    priorities[index] = priorities[smallerChildIndex];
    index = smallerChildIndex;
  }

  elements[index] = element;
  priorities[index] = priority;
  this.siftDown_(startIndex, index);
};


/**
 * @param {number} startIndex The index of the root.
 * @param {number} index The index of the node to move up.
 * @private
 */
ol.structs.PriorityQueue.prototype.siftDown_ = function(startIndex, index) {
  var elements = this.elements_;
  var priorities = this.priorities_;
  var element = elements[index];
  var priority = priorities[index];

  while (index > startIndex) {
    var parentIndex = this.getParentIndex_(index);
    if (priorities[parentIndex] > priority) {
      elements[index] = elements[parentIndex];
      priorities[index] = priorities[parentIndex];
      index = parentIndex;
    } else {
      break;
    }
  }
  elements[index] = element;
  priorities[index] = priority;
};


/**
 * FIXME empty description for jsdoc
 */
ol.structs.PriorityQueue.prototype.reprioritize = function() {
  var priorityFunction = this.priorityFunction_;
  var elements = this.elements_;
  var priorities = this.priorities_;
  var index = 0;
  var n = elements.length;
  var element, i, priority;
  for (i = 0; i < n; ++i) {
    element = elements[i];
    priority = priorityFunction(element);
    if (priority == ol.structs.PriorityQueue.DROP) {
      delete this.queuedElements_[this.keyFunction_(element)];
    } else {
      priorities[index] = priority;
      elements[index++] = element;
    }
  }
  elements.length = index;
  priorities.length = index;
  this.heapify_();
};

goog.provide('ol.TileQueue');

goog.require('ol');
goog.require('ol.TileState');
goog.require('ol.events');
goog.require('ol.events.EventType');
goog.require('ol.structs.PriorityQueue');


/**
 * @constructor
 * @extends {ol.structs.PriorityQueue.<Array>}
 * @param {ol.TilePriorityFunction} tilePriorityFunction
 *     Tile priority function.
 * @param {function(): ?} tileChangeCallback
 *     Function called on each tile change event.
 * @struct
 */
ol.TileQueue = function(tilePriorityFunction, tileChangeCallback) {

  ol.structs.PriorityQueue.call(
      this,
      /**
       * @param {Array} element Element.
       * @return {number} Priority.
       */
      function(element) {
        return tilePriorityFunction.apply(null, element);
      },
      /**
       * @param {Array} element Element.
       * @return {string} Key.
       */
      function(element) {
        return /** @type {ol.Tile} */ (element[0]).getKey();
      });

  /**
   * @private
   * @type {function(): ?}
   */
  this.tileChangeCallback_ = tileChangeCallback;

  /**
   * @private
   * @type {number}
   */
  this.tilesLoading_ = 0;

  /**
   * @private
   * @type {!Object.<string,boolean>}
   */
  this.tilesLoadingKeys_ = {};

};
ol.inherits(ol.TileQueue, ol.structs.PriorityQueue);


/**
 * @inheritDoc
 */
ol.TileQueue.prototype.enqueue = function(element) {
  var added = ol.structs.PriorityQueue.prototype.enqueue.call(this, element);
  if (added) {
    var tile = element[0];
    ol.events.listen(tile, ol.events.EventType.CHANGE,
        this.handleTileChange, this);
  }
  return added;
};


/**
 * @return {number} Number of tiles loading.
 */
ol.TileQueue.prototype.getTilesLoading = function() {
  return this.tilesLoading_;
};


/**
 * @param {ol.events.Event} event Event.
 * @protected
 */
ol.TileQueue.prototype.handleTileChange = function(event) {
  var tile = /** @type {ol.Tile} */ (event.target);
  var state = tile.getState();
  if (state === ol.TileState.LOADED || state === ol.TileState.ERROR ||
      state === ol.TileState.EMPTY || state === ol.TileState.ABORT) {
    ol.events.unlisten(tile, ol.events.EventType.CHANGE,
        this.handleTileChange, this);
    var tileKey = tile.getKey();
    if (tileKey in this.tilesLoadingKeys_) {
      delete this.tilesLoadingKeys_[tileKey];
      --this.tilesLoading_;
    }
    this.tileChangeCallback_();
  }
};


/**
 * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
 * @param {number} maxNewLoads Maximum number of new tiles to load.
 */
ol.TileQueue.prototype.loadMoreTiles = function(maxTotalLoading, maxNewLoads) {
  var newLoads = 0;
  var abortedTiles = false;
  var state, tile, tileKey;
  while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads &&
         this.getCount() > 0) {
    tile = /** @type {ol.Tile} */ (this.dequeue()[0]);
    tileKey = tile.getKey();
    state = tile.getState();
    if (state === ol.TileState.ABORT) {
      abortedTiles = true;
    } else if (state === ol.TileState.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
      this.tilesLoadingKeys_[tileKey] = true;
      ++this.tilesLoading_;
      ++newLoads;
      tile.load();
    }
  }
  if (newLoads === 0 && abortedTiles) {
    // Do not stop the render loop when all wanted tiles were aborted due to
    // a small, saturated tile cache.
    this.tileChangeCallback_();
  }
};

goog.provide('ol.CenterConstraint');

goog.require('ol.math');


/**
 * @param {ol.Extent} extent Extent.
 * @return {ol.CenterConstraintType} The constraint.
 */
ol.CenterConstraint.createExtent = function(extent) {
  return (
    /**
     * @param {ol.Coordinate|undefined} center Center.
     * @return {ol.Coordinate|undefined} Center.
     */
    function(center) {
      if (center) {
        return [
          ol.math.clamp(center[0], extent[0], extent[2]),
          ol.math.clamp(center[1], extent[1], extent[3])
        ];
      } else {
        return undefined;
      }
    });
};


/**
 * @param {ol.Coordinate|undefined} center Center.
 * @return {ol.Coordinate|undefined} Center.
 */
ol.CenterConstraint.none = function(center) {
  return center;
};

goog.provide('ol.ResolutionConstraint');

goog.require('ol.array');
goog.require('ol.math');


/**
 * @param {Array.<number>} resolutions Resolutions.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToResolutions = function(resolutions) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @return {number|undefined} Resolution.
     */
    function(resolution, delta, direction) {
      if (resolution !== undefined) {
        var z =
              ol.array.linearFindNearest(resolutions, resolution, direction);
        z = ol.math.clamp(z + delta, 0, resolutions.length - 1);
        var index = Math.floor(z);
        if (z != index && index < resolutions.length - 1) {
          var power = resolutions[index] / resolutions[index + 1];
          return resolutions[index] / Math.pow(power, z - index);
        } else {
          return resolutions[index];
        }
      } else {
        return undefined;
      }
    });
};


/**
 * @param {number} power Power.
 * @param {number} maxResolution Maximum resolution.
 * @param {number=} opt_maxLevel Maximum level.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToPower = function(power, maxResolution, opt_maxLevel) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @return {number|undefined} Resolution.
     */
    function(resolution, delta, direction) {
      if (resolution !== undefined) {
        var offset = -direction / 2 + 0.5;
        var oldLevel = Math.floor(
            Math.log(maxResolution / resolution) / Math.log(power) + offset);
        var newLevel = Math.max(oldLevel + delta, 0);
        if (opt_maxLevel !== undefined) {
          newLevel = Math.min(newLevel, opt_maxLevel);
        }
        return maxResolution / Math.pow(power, newLevel);
      } else {
        return undefined;
      }
    });
};

goog.provide('ol.RotationConstraint');

goog.require('ol.math');


/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
ol.RotationConstraint.disable = function(rotation, delta) {
  if (rotation !== undefined) {
    return 0;
  } else {
    return undefined;
  }
};


/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
ol.RotationConstraint.none = function(rotation, delta) {
  if (rotation !== undefined) {
    return rotation + delta;
  } else {
    return undefined;
  }
};


/**
 * @param {number} n N.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.RotationConstraint.createSnapToN = function(n) {
  var theta = 2 * Math.PI / n;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {number} delta Delta.
     * @return {number|undefined} Rotation.
     */
    function(rotation, delta) {
      if (rotation !== undefined) {
        rotation = Math.floor((rotation + delta) / theta + 0.5) * theta;
        return rotation;
      } else {
        return undefined;
      }
    });
};


/**
 * @param {number=} opt_tolerance Tolerance.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.RotationConstraint.createSnapToZero = function(opt_tolerance) {
  var tolerance = opt_tolerance || ol.math.toRadians(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {number} delta Delta.
     * @return {number|undefined} Rotation.
     */
    function(rotation, delta) {
      if (rotation !== undefined) {
        if (Math.abs(rotation + delta) <= tolerance) {
          return 0;
        } else {
          return rotation + delta;
        }
      } else {
        return undefined;
      }
    });
};

goog.provide('ol.ViewHint');

/**
 * @enum {number}
 */
ol.ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

goog.provide('ol.ViewProperty');

/**
 * @enum {string}
 */
ol.ViewProperty = {
  CENTER: 'center',
  RESOLUTION: 'resolution',
  ROTATION: 'rotation'
};

goog.provide('ol.string');

/**
 * @param {number} number Number to be formatted
 * @param {number} width The desired width
 * @param {number=} opt_precision Precision of the output string (i.e. number of decimal places)
 * @returns {string} Formatted string
*/
ol.string.padNumber = function(number, width, opt_precision) {
  var numberString = opt_precision !== undefined ? number.toFixed(opt_precision) : '' + number;
  var decimal = numberString.indexOf('.');
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : new Array(1 + width - decimal).join('0') + numberString;
};

/**
 * Adapted from https://github.com/omichelsen/compare-versions/blob/master/index.js
 * @param {string|number} v1 First version
 * @param {string|number} v2 Second version
 * @returns {number} Value
 */
ol.string.compareVersions = function(v1, v2) {
  var s1 = ('' + v1).split('.');
  var s2 = ('' + v2).split('.');

  for (var i = 0; i < Math.max(s1.length, s2.length); i++) {
    var n1 = parseInt(s1[i] || '0', 10);
    var n2 = parseInt(s2[i] || '0', 10);

    if (n1 > n2) {
      return 1;
    }
    if (n2 > n1) {
      return -1;
    }
  }

  return 0;
};

goog.provide('ol.coordinate');

goog.require('ol.math');
goog.require('ol.string');


/**
 * Add `delta` to `coordinate`. `coordinate` is modified in place and returned
 * by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     ol.coordinate.add(coord, [-2, 4]);
 *     // coord is now [5.85, 51.983333]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Coordinate} delta Delta.
 * @return {ol.Coordinate} The input coordinate adjusted by the given delta.
 * @api
 */
ol.coordinate.add = function(coordinate, delta) {
  coordinate[0] += delta[0];
  coordinate[1] += delta[1];
  return coordinate;
};


/**
 * Calculates the point closest to the passed coordinate on the passed circle.
 *
 * @param {ol.Coordinate} coordinate The coordinate.
 * @param {ol.geom.Circle} circle The circle.
 * @return {ol.Coordinate} Closest point on the circumference
 */
ol.coordinate.closestOnCircle = function(coordinate, circle) {
  var r = circle.getRadius();
  var center = circle.getCenter();
  var x0 = center[0];
  var y0 = center[1];
  var x1 = coordinate[0];
  var y1 = coordinate[1];

  var dx = x1 - x0;
  var dy = y1 - y0;
  if (dx === 0 && dy === 0) {
    dx = 1;
  }
  var d = Math.sqrt(dx * dx + dy * dy);

  var x, y;

  x = x0 + r * dx / d;
  y = y0 + r * dy / d;

  return [x, y];
};


/**
 * Calculates the point closest to the passed coordinate on the passed segment.
 * This is the foot of the perpendicular of the coordinate to the segment when
 * the foot is on the segment, or the closest segment coordinate when the foot
 * is outside the segment.
 *
 * @param {ol.Coordinate} coordinate The coordinate.
 * @param {Array.<ol.Coordinate>} segment The two coordinates of the segment.
 * @return {ol.Coordinate} The foot of the perpendicular of the coordinate to
 *     the segment.
 */
ol.coordinate.closestOnSegment = function(coordinate, segment) {
  var x0 = coordinate[0];
  var y0 = coordinate[1];
  var start = segment[0];
  var end = segment[1];
  var x1 = start[0];
  var y1 = start[1];
  var x2 = end[0];
  var y2 = end[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var along = (dx === 0 && dy === 0) ? 0 :
    ((dx * (x0 - x1)) + (dy * (y0 - y1))) / ((dx * dx + dy * dy) || 0);
  var x, y;
  if (along <= 0) {
    x = x1;
    y = y1;
  } else if (along >= 1) {
    x = x2;
    y = y2;
  } else {
    x = x1 + along * dx;
    y = y1 + along * dy;
  }
  return [x, y];
};


/**
 * Returns a {@link ol.CoordinateFormatType} function that can be used to format
 * a {ol.Coordinate} to a string.
 *
 * Example without specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var stringifyFunc = ol.coordinate.createStringXY();
 *     var out = stringifyFunc(coord);
 *     // out is now '8, 48'
 *
 * Example with explicitly specifying 2 fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var stringifyFunc = ol.coordinate.createStringXY(2);
 *     var out = stringifyFunc(coord);
 *     // out is now '7.85, 47.98'
 *
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {ol.CoordinateFormatType} Coordinate format.
 * @api
 */
ol.coordinate.createStringXY = function(opt_fractionDigits) {
  return (
    /**
     * @param {ol.Coordinate|undefined} coordinate Coordinate.
     * @return {string} String XY.
     */
    function(coordinate) {
      return ol.coordinate.toStringXY(coordinate, opt_fractionDigits);
    });
};


/**
 * @param {string} hemispheres Hemispheres.
 * @param {number} degrees Degrees.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} String.
 */
ol.coordinate.degreesToStringHDMS = function(hemispheres, degrees, opt_fractionDigits) {
  var normalizedDegrees = ol.math.modulo(degrees + 180, 360) - 180;
  var x = Math.abs(3600 * normalizedDegrees);
  var dflPrecision = opt_fractionDigits || 0;
  var precision = Math.pow(10, dflPrecision);

  var deg = Math.floor(x / 3600);
  var min = Math.floor((x - deg * 3600) / 60);
  var sec = x - (deg * 3600) - (min * 60);
  sec = Math.ceil(sec * precision) / precision;

  if (sec >= 60) {
    sec = 0;
    min += 1;
  }

  if (min >= 60) {
    min = 0;
    deg += 1;
  }

  return deg + '\u00b0 ' + ol.string.padNumber(min, 2) + '\u2032 ' +
    ol.string.padNumber(sec, 2, dflPrecision) + '\u2033' +
    (normalizedDegrees == 0 ? '' : ' ' + hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0));
};


/**
 * Transforms the given {@link ol.Coordinate} to a string using the given string
 * template. The strings `{x}` and `{y}` in the template will be replaced with
 * the first and second coordinate values respectively.
 *
 * Example without specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var template = 'Coordinate is ({x}|{y}).';
 *     var out = ol.coordinate.format(coord, template);
 *     // out is now 'Coordinate is (8|48).'
 *
 * Example explicitly specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var template = 'Coordinate is ({x}|{y}).';
 *     var out = ol.coordinate.format(coord, template, 2);
 *     // out is now 'Coordinate is (7.85|47.98).'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {string} template A template string with `{x}` and `{y}` placeholders
 *     that will be replaced by first and second coordinate values.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} Formatted coordinate.
 * @api
 */
ol.coordinate.format = function(coordinate, template, opt_fractionDigits) {
  if (coordinate) {
    return template
        .replace('{x}', coordinate[0].toFixed(opt_fractionDigits))
        .replace('{y}', coordinate[1].toFixed(opt_fractionDigits));
  } else {
    return '';
  }
};


/**
 * @param {ol.Coordinate} coordinate1 First coordinate.
 * @param {ol.Coordinate} coordinate2 Second coordinate.
 * @return {boolean} Whether the passed coordinates are equal.
 */
ol.coordinate.equals = function(coordinate1, coordinate2) {
  var equals = true;
  for (var i = coordinate1.length - 1; i >= 0; --i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals = false;
      break;
    }
  }
  return equals;
};


/**
 * Rotate `coordinate` by `angle`. `coordinate` is modified in place and
 * returned by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     var rotateRadians = Math.PI / 2; // 90 degrees
 *     ol.coordinate.rotate(coord, rotateRadians);
 *     // coord is now [-47.983333, 7.85]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} angle Angle in radian.
 * @return {ol.Coordinate} Coordinate.
 * @api
 */
ol.coordinate.rotate = function(coordinate, angle) {
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var x = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var y = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  coordinate[0] = x;
  coordinate[1] = y;
  return coordinate;
};


/**
 * Scale `coordinate` by `scale`. `coordinate` is modified in place and returned
 * by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     var scale = 1.2;
 *     ol.coordinate.scale(coord, scale);
 *     // coord is now [9.42, 57.5799996]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} scale Scale factor.
 * @return {ol.Coordinate} Coordinate.
 */
ol.coordinate.scale = function(coordinate, scale) {
  coordinate[0] *= scale;
  coordinate[1] *= scale;
  return coordinate;
};


/**
 * Subtract `delta` to `coordinate`. `coordinate` is modified in place and
 * returned by the function.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Coordinate} delta Delta.
 * @return {ol.Coordinate} Coordinate.
 */
ol.coordinate.sub = function(coordinate, delta) {
  coordinate[0] -= delta[0];
  coordinate[1] -= delta[1];
  return coordinate;
};


/**
 * @param {ol.Coordinate} coord1 First coordinate.
 * @param {ol.Coordinate} coord2 Second coordinate.
 * @return {number} Squared distance between coord1 and coord2.
 */
ol.coordinate.squaredDistance = function(coord1, coord2) {
  var dx = coord1[0] - coord2[0];
  var dy = coord1[1] - coord2[1];
  return dx * dx + dy * dy;
};


/**
 * @param {ol.Coordinate} coord1 First coordinate.
 * @param {ol.Coordinate} coord2 Second coordinate.
 * @return {number} Distance between coord1 and coord2.
 */
ol.coordinate.distance = function(coord1, coord2) {
  return Math.sqrt(ol.coordinate.squaredDistance(coord1, coord2));
};


/**
 * Calculate the squared distance from a coordinate to a line segment.
 *
 * @param {ol.Coordinate} coordinate Coordinate of the point.
 * @param {Array.<ol.Coordinate>} segment Line segment (2 coordinates).
 * @return {number} Squared distance from the point to the line segment.
 */
ol.coordinate.squaredDistanceToSegment = function(coordinate, segment) {
  return ol.coordinate.squaredDistance(coordinate,
      ol.coordinate.closestOnSegment(coordinate, segment));
};


/**
 * Format a geographic coordinate with the hemisphere, degrees, minutes, and
 * seconds.
 *
 * Example without specifying fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringHDMS(coord);
 *     // out is now '47° 58′ 60″ N 7° 50′ 60″ E'
 *
 * Example explicitly specifying 1 fractional digit:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringHDMS(coord, 1);
 *     // out is now '47° 58′ 60.0″ N 7° 50′ 60.0″ E'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} Hemisphere, degrees, minutes and seconds.
 * @api
 */
ol.coordinate.toStringHDMS = function(coordinate, opt_fractionDigits) {
  if (coordinate) {
    return ol.coordinate.degreesToStringHDMS('NS', coordinate[1], opt_fractionDigits) + ' ' +
        ol.coordinate.degreesToStringHDMS('EW', coordinate[0], opt_fractionDigits);
  } else {
    return '';
  }
};


/**
 * Format a coordinate as a comma delimited string.
 *
 * Example without specifying fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringXY(coord);
 *     // out is now '8, 48'
 *
 * Example explicitly specifying 1 fractional digit:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringXY(coord, 1);
 *     // out is now '7.8, 48.0'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} XY.
 * @api
 */
ol.coordinate.toStringXY = function(coordinate, opt_fractionDigits) {
  return ol.coordinate.format(coordinate, '{x}, {y}', opt_fractionDigits);
};

goog.provide('ol.easing');


/**
 * Start slow and speed up.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.easeIn = function(t) {
  return Math.pow(t, 3);
};


/**
 * Start fast and slow down.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.easeOut = function(t) {
  return 1 - ol.easing.easeIn(1 - t);
};


/**
 * Start slow, speed up, and then slow down again.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.inAndOut = function(t) {
  return 3 * t * t - 2 * t * t * t;
};


/**
 * Maintain a constant speed over time.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.linear = function(t) {
  return t;
};


/**
 * Start slow, speed up, and at the very end slow down again.  This has the
 * same general behavior as {@link ol.easing.inAndOut}, but the final slowdown
 * is delayed.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.upAndDown = function(t) {
  if (t < 0.5) {
    return ol.easing.inAndOut(2 * t);
  } else {
    return 1 - ol.easing.inAndOut(2 * (t - 0.5));
  }
};

goog.provide('ol.geom.GeometryLayout');


/**
 * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
 * or measure ('M') coordinate is available. Supported values are `'XY'`,
 * `'XYZ'`, `'XYM'`, `'XYZM'`.
 * @enum {string}
 */
ol.geom.GeometryLayout = {
  XY: 'XY',
  XYZ: 'XYZ',
  XYM: 'XYM',
  XYZM: 'XYZM'
};

goog.provide('ol.functions');

/**
 * Always returns true.
 * @returns {boolean} true.
 */
ol.functions.TRUE = function() {
  return true;
};

/**
 * Always returns false.
 * @returns {boolean} false.
 */
ol.functions.FALSE = function() {
  return false;
};

goog.provide('ol.geom.flat.transform');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Transform} transform Transform.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.transform2D = function(flatCoordinates, offset, end, stride, transform, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j;
  for (j = offset; j < end; j += stride) {
    var x = flatCoordinates[j];
    var y = flatCoordinates[j + 1];
    dest[i++] = transform[0] * x + transform[2] * y + transform[4];
    dest[i++] = transform[1] * x + transform[3] * y + transform[5];
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} angle Angle.
 * @param {Array.<number>} anchor Rotation anchor point.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.rotate = function(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var anchorX = anchor[0];
  var anchorY = anchor[1];
  var i = 0;
  for (var j = offset; j < end; j += stride) {
    var deltaX = flatCoordinates[j] - anchorX;
    var deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + deltaX * cos - deltaY * sin;
    dest[i++] = anchorY + deltaX * sin + deltaY * cos;
    for (var k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};


/**
 * Scale the coordinates.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} sx Scale factor in the x-direction.
 * @param {number} sy Scale factor in the y-direction.
 * @param {Array.<number>} anchor Scale anchor point.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.scale = function(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var anchorX = anchor[0];
  var anchorY = anchor[1];
  var i = 0;
  for (var j = offset; j < end; j += stride) {
    var deltaX = flatCoordinates[j] - anchorX;
    var deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + sx * deltaX;
    dest[i++] = anchorY + sy * deltaY;
    for (var k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} deltaX Delta X.
 * @param {number} deltaY Delta Y.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.translate = function(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j, k;
  for (j = offset; j < end; j += stride) {
    dest[i++] = flatCoordinates[j] + deltaX;
    dest[i++] = flatCoordinates[j + 1] + deltaY;
    for (k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};

goog.provide('ol.transform');

goog.require('ol.asserts');


/**
 * Collection of affine 2d transformation functions. The functions work on an
 * array of 6 elements. The element order is compatible with the [SVGMatrix
 * interface](https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix) and is
 * a subset (elements a to f) of a 3x3 martrix:
 * ```
 * [ a c e ]
 * [ b d f ]
 * [ 0 0 1 ]
 * ```
 */


/**
 * @private
 * @type {ol.Transform}
 */
ol.transform.tmp_ = new Array(6);


/**
 * Create an identity transform.
 * @return {!ol.Transform} Identity transform.
 */
ol.transform.create = function() {
  return [1, 0, 0, 1, 0, 0];
};


/**
 * Resets the given transform to an identity transform.
 * @param {!ol.Transform} transform Transform.
 * @return {!ol.Transform} Transform.
 */
ol.transform.reset = function(transform) {
  return ol.transform.set(transform, 1, 0, 0, 1, 0, 0);
};


/**
 * Multiply the underlying matrices of two transforms and return the result in
 * the first transform.
 * @param {!ol.Transform} transform1 Transform parameters of matrix 1.
 * @param {!ol.Transform} transform2 Transform parameters of matrix 2.
 * @return {!ol.Transform} transform1 multiplied with transform2.
 */
ol.transform.multiply = function(transform1, transform2) {
  var a1 = transform1[0];
  var b1 = transform1[1];
  var c1 = transform1[2];
  var d1 = transform1[3];
  var e1 = transform1[4];
  var f1 = transform1[5];
  var a2 = transform2[0];
  var b2 = transform2[1];
  var c2 = transform2[2];
  var d2 = transform2[3];
  var e2 = transform2[4];
  var f2 = transform2[5];

  transform1[0] = a1 * a2 + c1 * b2;
  transform1[1] = b1 * a2 + d1 * b2;
  transform1[2] = a1 * c2 + c1 * d2;
  transform1[3] = b1 * c2 + d1 * d2;
  transform1[4] = a1 * e2 + c1 * f2 + e1;
  transform1[5] = b1 * e2 + d1 * f2 + f1;

  return transform1;
};

/**
 * Set the transform components a-f on a given transform.
 * @param {!ol.Transform} transform Transform.
 * @param {number} a The a component of the transform.
 * @param {number} b The b component of the transform.
 * @param {number} c The c component of the transform.
 * @param {number} d The d component of the transform.
 * @param {number} e The e component of the transform.
 * @param {number} f The f component of the transform.
 * @return {!ol.Transform} Matrix with transform applied.
 */
ol.transform.set = function(transform, a, b, c, d, e, f) {
  transform[0] = a;
  transform[1] = b;
  transform[2] = c;
  transform[3] = d;
  transform[4] = e;
  transform[5] = f;
  return transform;
};


/**
 * Set transform on one matrix from another matrix.
 * @param {!ol.Transform} transform1 Matrix to set transform to.
 * @param {!ol.Transform} transform2 Matrix to set transform from.
 * @return {!ol.Transform} transform1 with transform from transform2 applied.
 */
ol.transform.setFromArray = function(transform1, transform2) {
  transform1[0] = transform2[0];
  transform1[1] = transform2[1];
  transform1[2] = transform2[2];
  transform1[3] = transform2[3];
  transform1[4] = transform2[4];
  transform1[5] = transform2[5];
  return transform1;
};


/**
 * Transforms the given coordinate with the given transform returning the
 * resulting, transformed coordinate. The coordinate will be modified in-place.
 *
 * @param {ol.Transform} transform The transformation.
 * @param {ol.Coordinate|ol.Pixel} coordinate The coordinate to transform.
 * @return {ol.Coordinate|ol.Pixel} return coordinate so that operations can be
 *     chained together.
 */
ol.transform.apply = function(transform, coordinate) {
  var x = coordinate[0], y = coordinate[1];
  coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
  coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
  return coordinate;
};


/**
 * Applies rotation to the given transform.
 * @param {!ol.Transform} transform Transform.
 * @param {number} angle Angle in radians.
 * @return {!ol.Transform} The rotated transform.
 */
ol.transform.rotate = function(transform, angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return ol.transform.multiply(transform,
      ol.transform.set(ol.transform.tmp_, cos, sin, -sin, cos, 0, 0));
};


/**
 * Applies scale to a given transform.
 * @param {!ol.Transform} transform Transform.
 * @param {number} x Scale factor x.
 * @param {number} y Scale factor y.
 * @return {!ol.Transform} The scaled transform.
 */
ol.transform.scale = function(transform, x, y) {
  return ol.transform.multiply(transform,
      ol.transform.set(ol.transform.tmp_, x, 0, 0, y, 0, 0));
};


/**
 * Applies translation to the given transform.
 * @param {!ol.Transform} transform Transform.
 * @param {number} dx Translation x.
 * @param {number} dy Translation y.
 * @return {!ol.Transform} The translated transform.
 */
ol.transform.translate = function(transform, dx, dy) {
  return ol.transform.multiply(transform,
      ol.transform.set(ol.transform.tmp_, 1, 0, 0, 1, dx, dy));
};


/**
 * Creates a composite transform given an initial translation, scale, rotation, and
 * final translation (in that order only, not commutative).
 * @param {!ol.Transform} transform The transform (will be modified in place).
 * @param {number} dx1 Initial translation x.
 * @param {number} dy1 Initial translation y.
 * @param {number} sx Scale factor x.
 * @param {number} sy Scale factor y.
 * @param {number} angle Rotation (in counter-clockwise radians).
 * @param {number} dx2 Final translation x.
 * @param {number} dy2 Final translation y.
 * @return {!ol.Transform} The composite transform.
 */
ol.transform.compose = function(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  transform[0] = sx * cos;
  transform[1] = sy * sin;
  transform[2] = -sx * sin;
  transform[3] = sy * cos;
  transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
  transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
  return transform;
};


/**
 * Invert the given transform.
 * @param {!ol.Transform} transform Transform.
 * @return {!ol.Transform} Inverse of the transform.
 */
ol.transform.invert = function(transform) {
  var det = ol.transform.determinant(transform);
  ol.asserts.assert(det !== 0, 32); // Transformation matrix cannot be inverted

  var a = transform[0];
  var b = transform[1];
  var c = transform[2];
  var d = transform[3];
  var e = transform[4];
  var f = transform[5];

  transform[0] = d / det;
  transform[1] = -b / det;
  transform[2] = -c / det;
  transform[3] = a / det;
  transform[4] = (c * f - d * e) / det;
  transform[5] = -(a * f - b * e) / det;

  return transform;
};


/**
 * Returns the determinant of the given matrix.
 * @param {!ol.Transform} mat Matrix.
 * @return {number} Determinant.
 */
ol.transform.determinant = function(mat) {
  return mat[0] * mat[3] - mat[1] * mat[2];
};

goog.provide('ol.geom.Geometry');

goog.require('ol');
goog.require('ol.Object');
goog.require('ol.extent');
goog.require('ol.functions');
goog.require('ol.geom.flat.transform');
goog.require('ol.proj');
goog.require('ol.proj.Units');
goog.require('ol.transform');


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for vector geometries.
 *
 * To get notified of changes to the geometry, register a listener for the
 * generic `change` event on your geometry instance.
 *
 * @constructor
 * @abstract
 * @extends {ol.Object}
 * @api
 */
ol.geom.Geometry = function() {

  ol.Object.call(this);

  /**
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = ol.extent.createEmpty();

  /**
   * @private
   * @type {number}
   */
  this.extentRevision_ = -1;

  /**
   * @protected
   * @type {Object.<string, ol.geom.Geometry>}
   */
  this.simplifiedGeometryCache = {};

  /**
   * @protected
   * @type {number}
   */
  this.simplifiedGeometryMaxMinSquaredTolerance = 0;

  /**
   * @protected
   * @type {number}
   */
  this.simplifiedGeometryRevision = 0;

  /**
   * @private
   * @type {ol.Transform}
   */
  this.tmpTransform_ = ol.transform.create();

};
ol.inherits(ol.geom.Geometry, ol.Object);


/**
 * Make a complete copy of the geometry.
 * @abstract
 * @return {!ol.geom.Geometry} Clone.
 */
ol.geom.Geometry.prototype.clone = function() {};


/**
 * @abstract
 * @param {number} x X.
 * @param {number} y Y.
 * @param {ol.Coordinate} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @return {number} Minimum squared distance.
 */
ol.geom.Geometry.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {};


/**
 * Return the closest point of the geometry to the passed point as
 * {@link ol.Coordinate coordinate}.
 * @param {ol.Coordinate} point Point.
 * @param {ol.Coordinate=} opt_closestPoint Closest point.
 * @return {ol.Coordinate} Closest point.
 * @api
 */
ol.geom.Geometry.prototype.getClosestPoint = function(point, opt_closestPoint) {
  var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
  this.closestPointXY(point[0], point[1], closestPoint, Infinity);
  return closestPoint;
};


/**
 * Returns true if this geometry includes the specified coordinate. If the
 * coordinate is on the boundary of the geometry, returns false.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {boolean} Contains coordinate.
 * @api
 */
ol.geom.Geometry.prototype.intersectsCoordinate = function(coordinate) {
  return this.containsXY(coordinate[0], coordinate[1]);
};


/**
 * @abstract
 * @param {ol.Extent} extent Extent.
 * @protected
 * @return {ol.Extent} extent Extent.
 */
ol.geom.Geometry.prototype.computeExtent = function(extent) {};


/**
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.Geometry.prototype.containsXY = ol.functions.FALSE;


/**
 * Get the extent of the geometry.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} extent Extent.
 * @api
 */
ol.geom.Geometry.prototype.getExtent = function(opt_extent) {
  if (this.extentRevision_ != this.getRevision()) {
    this.extent_ = this.computeExtent(this.extent_);
    this.extentRevision_ = this.getRevision();
  }
  return ol.extent.returnOrUpdate(this.extent_, opt_extent);
};


/**
 * Rotate the geometry around a given coordinate. This modifies the geometry
 * coordinates in place.
 * @abstract
 * @param {number} angle Rotation angle in radians.
 * @param {ol.Coordinate} anchor The rotation center.
 * @api
 */
ol.geom.Geometry.prototype.rotate = function(angle, anchor) {};


/**
 * Scale the geometry (with an optional origin).  This modifies the geometry
 * coordinates in place.
 * @abstract
 * @param {number} sx The scaling factor in the x-direction.
 * @param {number=} opt_sy The scaling factor in the y-direction (defaults to
 *     sx).
 * @param {ol.Coordinate=} opt_anchor The scale origin (defaults to the center
 *     of the geometry extent).
 * @api
 */
ol.geom.Geometry.prototype.scale = function(sx, opt_sy, opt_anchor) {};


/**
 * Create a simplified version of this geometry.  For linestrings, this uses
 * the the {@link
 * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
 * Douglas Peucker} algorithm.  For polygons, a quantization-based
 * simplification is used to preserve topology.
 * @function
 * @param {number} tolerance The tolerance distance for simplification.
 * @return {ol.geom.Geometry} A new, simplified version of the original
 *     geometry.
 * @api
 */
ol.geom.Geometry.prototype.simplify = function(tolerance) {
  return this.getSimplifiedGeometry(tolerance * tolerance);
};


/**
 * Create a simplified version of this geometry using the Douglas Peucker
 * algorithm.
 * @see https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
 * @abstract
 * @param {number} squaredTolerance Squared tolerance.
 * @return {ol.geom.Geometry} Simplified geometry.
 */
ol.geom.Geometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {};


/**
 * Get the type of this geometry.
 * @abstract
 * @return {ol.geom.GeometryType} Geometry type.
 */
ol.geom.Geometry.prototype.getType = function() {};


/**
 * Apply a transform function to each coordinate of the geometry.
 * The geometry is modified in place.
 * If you do not want the geometry modified in place, first `clone()` it and
 * then use this function on the clone.
 * @abstract
 * @param {ol.TransformFunction} transformFn Transform.
 */
ol.geom.Geometry.prototype.applyTransform = function(transformFn) {};


/**
 * Test if the geometry and the passed extent intersect.
 * @abstract
 * @param {ol.Extent} extent Extent.
 * @return {boolean} `true` if the geometry and the extent intersect.
 */
ol.geom.Geometry.prototype.intersectsExtent = function(extent) {};


/**
 * Translate the geometry.  This modifies the geometry coordinates in place.  If
 * instead you want a new geometry, first `clone()` this geometry.
 * @abstract
 * @param {number} deltaX Delta X.
 * @param {number} deltaY Delta Y.
 */
ol.geom.Geometry.prototype.translate = function(deltaX, deltaY) {};


/**
 * Transform each coordinate of the geometry from one coordinate reference
 * system to another. The geometry is modified in place.
 * For example, a line will be transformed to a line and a circle to a circle.
 * If you do not want the geometry modified in place, first `clone()` it and
 * then use this function on the clone.
 *
 * @param {ol.ProjectionLike} source The current projection.  Can be a
 *     string identifier or a {@link ol.proj.Projection} object.
 * @param {ol.ProjectionLike} destination The desired projection.  Can be a
 *     string identifier or a {@link ol.proj.Projection} object.
 * @return {ol.geom.Geometry} This geometry.  Note that original geometry is
 *     modified in place.
 * @api
 */
ol.geom.Geometry.prototype.transform = function(source, destination) {
  var tmpTransform = this.tmpTransform_;
  source = ol.proj.get(source);
  var transformFn = source.getUnits() == ol.proj.Units.TILE_PIXELS ?
    function(inCoordinates, outCoordinates, stride) {
      var pixelExtent = source.getExtent();
      var projectedExtent = source.getWorldExtent();
      var scale = ol.extent.getHeight(projectedExtent) / ol.extent.getHeight(pixelExtent);
      ol.transform.compose(tmpTransform,
          projectedExtent[0], projectedExtent[3],
          scale, -scale, 0,
          0, 0);
      ol.geom.flat.transform.transform2D(inCoordinates, 0, inCoordinates.length, stride,
          tmpTransform, outCoordinates);
      return ol.proj.getTransform(source, destination)(inCoordinates, outCoordinates, stride);
    } :
    ol.proj.getTransform(source, destination);
  this.applyTransform(transformFn);
  return this;
};

goog.provide('ol.geom.SimpleGeometry');

goog.require('ol');
goog.require('ol.functions');
goog.require('ol.extent');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.flat.transform');
goog.require('ol.obj');


/**
 * @classdesc
 * Abstract base class; only used for creating subclasses; do not instantiate
 * in apps, as cannot be rendered.
 *
 * @constructor
 * @abstract
 * @extends {ol.geom.Geometry}
 * @api
 */
ol.geom.SimpleGeometry = function() {

  ol.geom.Geometry.call(this);

  /**
   * @protected
   * @type {ol.geom.GeometryLayout}
   */
  this.layout = ol.geom.GeometryLayout.XY;

  /**
   * @protected
   * @type {number}
   */
  this.stride = 2;

  /**
   * @protected
   * @type {Array.<number>}
   */
  this.flatCoordinates = null;

};
ol.inherits(ol.geom.SimpleGeometry, ol.geom.Geometry);


/**
 * @param {number} stride Stride.
 * @private
 * @return {ol.geom.GeometryLayout} layout Layout.
 */
ol.geom.SimpleGeometry.getLayoutForStride_ = function(stride) {
  var layout;
  if (stride == 2) {
    layout = ol.geom.GeometryLayout.XY;
  } else if (stride == 3) {
    layout = ol.geom.GeometryLayout.XYZ;
  } else if (stride == 4) {
    layout = ol.geom.GeometryLayout.XYZM;
  }
  return /** @type {ol.geom.GeometryLayout} */ (layout);
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @return {number} Stride.
 */
ol.geom.SimpleGeometry.getStrideForLayout = function(layout) {
  var stride;
  if (layout == ol.geom.GeometryLayout.XY) {
    stride = 2;
  } else if (layout == ol.geom.GeometryLayout.XYZ || layout == ol.geom.GeometryLayout.XYM) {
    stride = 3;
  } else if (layout == ol.geom.GeometryLayout.XYZM) {
    stride = 4;
  }
  return /** @type {number} */ (stride);
};


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.containsXY = ol.functions.FALSE;


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromFlatCoordinates(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      extent);
};


/**
 * @abstract
 * @return {Array} Coordinates.
 */
ol.geom.SimpleGeometry.prototype.getCoordinates = function() {};


/**
 * Return the first coordinate of the geometry.
 * @return {ol.Coordinate} First coordinate.
 * @api
 */
ol.geom.SimpleGeometry.prototype.getFirstCoordinate = function() {
  return this.flatCoordinates.slice(0, this.stride);
};


/**
 * @return {Array.<number>} Flat coordinates.
 */
ol.geom.SimpleGeometry.prototype.getFlatCoordinates = function() {
  return this.flatCoordinates;
};


/**
 * Return the last coordinate of the geometry.
 * @return {ol.Coordinate} Last point.
 * @api
 */
ol.geom.SimpleGeometry.prototype.getLastCoordinate = function() {
  return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
};


/**
 * Return the {@link ol.geom.GeometryLayout layout} of the geometry.
 * @return {ol.geom.GeometryLayout} Layout.
 * @api
 */
ol.geom.SimpleGeometry.prototype.getLayout = function() {
  return this.layout;
};


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {
  if (this.simplifiedGeometryRevision != this.getRevision()) {
    ol.obj.clear(this.simplifiedGeometryCache);
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;
    this.simplifiedGeometryRevision = this.getRevision();
  }
  // If squaredTolerance is negative or if we know that simplification will not
  // have any effect then just return this.
  if (squaredTolerance < 0 ||
      (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
       squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
    return this;
  }
  var key = squaredTolerance.toString();
  if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
    return this.simplifiedGeometryCache[key];
  } else {
    var simplifiedGeometry =
        this.getSimplifiedGeometryInternal(squaredTolerance);
    var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
    if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
      this.simplifiedGeometryCache[key] = simplifiedGeometry;
      return simplifiedGeometry;
    } else {
      // Simplification did not actually remove any coordinates.  We now know
      // that any calls to getSimplifiedGeometry with a squaredTolerance less
      // than or equal to the current squaredTolerance will also not have any
      // effect.  This allows us to short circuit simplification (saving CPU
      // cycles) and prevents the cache of simplified geometries from filling
      // up with useless identical copies of this geometry (saving memory).
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
};


/**
 * @param {number} squaredTolerance Squared tolerance.
 * @return {ol.geom.SimpleGeometry} Simplified geometry.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  return this;
};


/**
 * @return {number} Stride.
 */
ol.geom.SimpleGeometry.prototype.getStride = function() {
  return this.stride;
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.setFlatCoordinatesInternal = function(layout, flatCoordinates) {
  this.stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  this.layout = layout;
  this.flatCoordinates = flatCoordinates;
};


/**
 * @abstract
 * @param {Array} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 */
ol.geom.SimpleGeometry.prototype.setCoordinates = function(coordinates, opt_layout) {};


/**
 * @param {ol.geom.GeometryLayout|undefined} layout Layout.
 * @param {Array} coordinates Coordinates.
 * @param {number} nesting Nesting.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.setLayout = function(layout, coordinates, nesting) {
  /** @type {number} */
  var stride;
  if (layout) {
    stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  } else {
    var i;
    for (i = 0; i < nesting; ++i) {
      if (coordinates.length === 0) {
        this.layout = ol.geom.GeometryLayout.XY;
        this.stride = 2;
        return;
      } else {
        coordinates = /** @type {Array} */ (coordinates[0]);
      }
    }
    stride = coordinates.length;
    layout = ol.geom.SimpleGeometry.getLayoutForStride_(stride);
  }
  this.layout = layout;
  this.stride = stride;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.SimpleGeometry.prototype.applyTransform = function(transformFn) {
  if (this.flatCoordinates) {
    transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
    this.changed();
  }
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.SimpleGeometry.prototype.rotate = function(angle, anchor) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.rotate(
        flatCoordinates, 0, flatCoordinates.length,
        stride, angle, anchor, flatCoordinates);
    this.changed();
  }
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.SimpleGeometry.prototype.scale = function(sx, opt_sy, opt_anchor) {
  var sy = opt_sy;
  if (sy === undefined) {
    sy = sx;
  }
  var anchor = opt_anchor;
  if (!anchor) {
    anchor = ol.extent.getCenter(this.getExtent());
  }
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.scale(
        flatCoordinates, 0, flatCoordinates.length,
        stride, sx, sy, anchor, flatCoordinates);
    this.changed();
  }
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.SimpleGeometry.prototype.translate = function(deltaX, deltaY) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.translate(
        flatCoordinates, 0, flatCoordinates.length, stride,
        deltaX, deltaY, flatCoordinates);
    this.changed();
  }
};


/**
 * @param {ol.geom.SimpleGeometry} simpleGeometry Simple geometry.
 * @param {ol.Transform} transform Transform.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed flat coordinates.
 */
ol.geom.SimpleGeometry.transform2D = function(simpleGeometry, transform, opt_dest) {
  var flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    var stride = simpleGeometry.getStride();
    return ol.geom.flat.transform.transform2D(
        flatCoordinates, 0, flatCoordinates.length, stride,
        transform, opt_dest);
  }
};

goog.provide('ol.geom.flat.area');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRing = function(flatCoordinates, offset, end, stride) {
  var twiceArea = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    twiceArea += y1 * x2 - x1 * y2;
    x1 = x2;
    y1 = y2;
  }
  return twiceArea / 2;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRings = function(flatCoordinates, offset, ends, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    area += ol.geom.flat.area.linearRing(flatCoordinates, offset, end, stride);
    offset = end;
  }
  return area;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRingss = function(flatCoordinates, offset, endss, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    area +=
        ol.geom.flat.area.linearRings(flatCoordinates, offset, ends, stride);
    offset = ends[ends.length - 1];
  }
  return area;
};

goog.provide('ol.geom.flat.closest');

goog.require('ol.math');


/**
 * Returns the point on the 2D line segment flatCoordinates[offset1] to
 * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
 * dimensions are linearly interpolated.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset1 Offset 1.
 * @param {number} offset2 Offset 2.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 */
ol.geom.flat.closest.point = function(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
  var x1 = flatCoordinates[offset1];
  var y1 = flatCoordinates[offset1 + 1];
  var dx = flatCoordinates[offset2] - x1;
  var dy = flatCoordinates[offset2 + 1] - y1;
  var i, offset;
  if (dx === 0 && dy === 0) {
    offset = offset1;
  } else {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      offset = offset2;
    } else if (t > 0) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = ol.math.lerp(flatCoordinates[offset1 + i],
            flatCoordinates[offset2 + i], t);
      }
      closestPoint.length = stride;
      return;
    } else {
      offset = offset1;
    }
  }
  for (i = 0; i < stride; ++i) {
    closestPoint[i] = flatCoordinates[offset + i];
  }
  closestPoint.length = stride;
};


/**
 * Return the squared of the largest distance between any pair of consecutive
 * coordinates.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getMaxSquaredDelta = function(flatCoordinates, offset, end, stride, maxSquaredDelta) {
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  for (offset += stride; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var squaredDelta = ol.math.squaredDistance(x1, y1, x2, y2);
    if (squaredDelta > maxSquaredDelta) {
      maxSquaredDelta = squaredDelta;
    }
    x1 = x2;
    y1 = y2;
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getsMaxSquaredDelta = function(flatCoordinates, offset, ends, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    maxSquaredDelta = ol.geom.flat.closest.getMaxSquaredDelta(
        flatCoordinates, offset, end, stride, maxSquaredDelta);
    offset = end;
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getssMaxSquaredDelta = function(flatCoordinates, offset, endss, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    maxSquaredDelta = ol.geom.flat.closest.getsMaxSquaredDelta(
        flatCoordinates, offset, ends, stride, maxSquaredDelta);
    offset = ends[ends.length - 1];
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getClosestPoint = function(flatCoordinates, offset, end,
    stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  if (offset == end) {
    return minSquaredDistance;
  }
  var i, squaredDistance;
  if (maxDelta === 0) {
    // All points are identical, so just test the first point.
    squaredDistance = ol.math.squaredDistance(
        x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
    if (squaredDistance < minSquaredDistance) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[offset + i];
      }
      closestPoint.length = stride;
      return squaredDistance;
    } else {
      return minSquaredDistance;
    }
  }
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var index = offset + stride;
  while (index < end) {
    ol.geom.flat.closest.point(
        flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
      index += stride;
    } else {
      // Skip ahead multiple points, because we know that all the skipped
      // points cannot be any closer than the closest point we have found so
      // far.  We know this because we know how close the current point is, how
      // close the closest point we have found so far is, and the maximum
      // distance between consecutive points.  For example, if we're currently
      // at distance 10, the best we've found so far is 3, and that the maximum
      // distance between consecutive points is 2, then we'll need to skip at
      // least (10 - 3) / 2 == 3 (rounded down) points to have any chance of
      // finding a closer point.  We use Math.max(..., 1) to ensure that we
      // always advance at least one point, to avoid an infinite loop.
      index += stride * Math.max(
          ((Math.sqrt(squaredDistance) -
            Math.sqrt(minSquaredDistance)) / maxDelta) | 0, 1);
    }
  }
  if (isRing) {
    // Check the closing segment.
    ol.geom.flat.closest.point(
        flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
    }
  }
  return minSquaredDistance;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getsClosestPoint = function(flatCoordinates, offset, ends,
    stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    minSquaredDistance = ol.geom.flat.closest.getClosestPoint(
        flatCoordinates, offset, end, stride,
        maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = end;
  }
  return minSquaredDistance;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getssClosestPoint = function(flatCoordinates, offset,
    endss, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    minSquaredDistance = ol.geom.flat.closest.getsClosestPoint(
        flatCoordinates, offset, ends, stride,
        maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = ends[ends.length - 1];
  }
  return minSquaredDistance;
};

goog.provide('ol.geom.flat.deflate');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflate.coordinate = function(flatCoordinates, offset, coordinate, stride) {
  var i, ii;
  for (i = 0, ii = coordinate.length; i < ii; ++i) {
    flatCoordinates[offset++] = coordinate[i];
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflate.coordinates = function(flatCoordinates, offset, coordinates, stride) {
  var i, ii;
  for (i = 0, ii = coordinates.length; i < ii; ++i) {
    var coordinate = coordinates[i];
    var j;
    for (j = 0; j < stride; ++j) {
      flatCoordinates[offset++] = coordinate[j];
    }
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<ol.Coordinate>>} coordinatess Coordinatess.
 * @param {number} stride Stride.
 * @param {Array.<number>=} opt_ends Ends.
 * @return {Array.<number>} Ends.
 */
ol.geom.flat.deflate.coordinatess = function(flatCoordinates, offset, coordinatess, stride, opt_ends) {
  var ends = opt_ends ? opt_ends : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatess.length; j < jj; ++j) {
    var end = ol.geom.flat.deflate.coordinates(
        flatCoordinates, offset, coordinatess[j], stride);
    ends[i++] = end;
    offset = end;
  }
  ends.length = i;
  return ends;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>} coordinatesss Coordinatesss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<number>>=} opt_endss Endss.
 * @return {Array.<Array.<number>>} Endss.
 */
ol.geom.flat.deflate.coordinatesss = function(flatCoordinates, offset, coordinatesss, stride, opt_endss) {
  var endss = opt_endss ? opt_endss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatesss.length; j < jj; ++j) {
    var ends = ol.geom.flat.deflate.coordinatess(
        flatCoordinates, offset, coordinatesss[j], stride, endss[i]);
    endss[i++] = ends;
    offset = ends[ends.length - 1];
  }
  endss.length = i;
  return endss;
};

goog.provide('ol.geom.flat.inflate');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {Array.<ol.Coordinate>=} opt_coordinates Coordinates.
 * @return {Array.<ol.Coordinate>} Coordinates.
 */
ol.geom.flat.inflate.coordinates = function(flatCoordinates, offset, end, stride, opt_coordinates) {
  var coordinates = opt_coordinates !== undefined ? opt_coordinates : [];
  var i = 0;
  var j;
  for (j = offset; j < end; j += stride) {
    coordinates[i++] = flatCoordinates.slice(j, j + stride);
  }
  coordinates.length = i;
  return coordinates;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<Array.<ol.Coordinate>>=} opt_coordinatess Coordinatess.
 * @return {Array.<Array.<ol.Coordinate>>} Coordinatess.
 */
ol.geom.flat.inflate.coordinatess = function(flatCoordinates, offset, ends, stride, opt_coordinatess) {
  var coordinatess = opt_coordinatess !== undefined ? opt_coordinatess : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = ends.length; j < jj; ++j) {
    var end = ends[j];
    coordinatess[i++] = ol.geom.flat.inflate.coordinates(
        flatCoordinates, offset, end, stride, coordinatess[i]);
    offset = end;
  }
  coordinatess.length = i;
  return coordinatess;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>=} opt_coordinatesss
 *     Coordinatesss.
 * @return {Array.<Array.<Array.<ol.Coordinate>>>} Coordinatesss.
 */
ol.geom.flat.inflate.coordinatesss = function(flatCoordinates, offset, endss, stride, opt_coordinatesss) {
  var coordinatesss = opt_coordinatesss !== undefined ? opt_coordinatesss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = endss.length; j < jj; ++j) {
    var ends = endss[j];
    coordinatesss[i++] = ol.geom.flat.inflate.coordinatess(
        flatCoordinates, offset, ends, stride, coordinatesss[i]);
    offset = ends[ends.length - 1];
  }
  coordinatesss.length = i;
  return coordinatesss;
};

// Based on simplify-js https://github.com/mourner/simplify-js
// Copyright (c) 2012, Vladimir Agafonkin
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//    1. Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//
//    2. Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.geom.flat.simplify');

goog.require('ol.math');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {boolean} highQuality Highest quality.
 * @param {Array.<number>=} opt_simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @return {Array.<number>} Simplified line string.
 */
ol.geom.flat.simplify.lineString = function(flatCoordinates, offset, end,
    stride, squaredTolerance, highQuality, opt_simplifiedFlatCoordinates) {
  var simplifiedFlatCoordinates = opt_simplifiedFlatCoordinates !== undefined ?
    opt_simplifiedFlatCoordinates : [];
  if (!highQuality) {
    end = ol.geom.flat.simplify.radialDistance(flatCoordinates, offset, end,
        stride, squaredTolerance,
        simplifiedFlatCoordinates, 0);
    flatCoordinates = simplifiedFlatCoordinates;
    offset = 0;
    stride = 2;
  }
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
      flatCoordinates, offset, end, stride, squaredTolerance,
      simplifiedFlatCoordinates, 0);
  return simplifiedFlatCoordinates;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeucker = function(flatCoordinates, offset, end,
    stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  var n = (end - offset) / stride;
  if (n < 3) {
    for (; offset < end; offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  /** @type {Array.<number>} */
  var markers = new Array(n);
  markers[0] = 1;
  markers[n - 1] = 1;
  /** @type {Array.<number>} */
  var stack = [offset, end - stride];
  var index = 0;
  var i;
  while (stack.length > 0) {
    var last = stack.pop();
    var first = stack.pop();
    var maxSquaredDistance = 0;
    var x1 = flatCoordinates[first];
    var y1 = flatCoordinates[first + 1];
    var x2 = flatCoordinates[last];
    var y2 = flatCoordinates[last + 1];
    for (i = first + stride; i < last; i += stride) {
      var x = flatCoordinates[i];
      var y = flatCoordinates[i + 1];
      var squaredDistance = ol.math.squaredSegmentDistance(
          x, y, x1, y1, x2, y2);
      if (squaredDistance > maxSquaredDistance) {
        index = i;
        maxSquaredDistance = squaredDistance;
      }
    }
    if (maxSquaredDistance > squaredTolerance) {
      markers[(index - offset) / stride] = 1;
      if (first + stride < index) {
        stack.push(first, index);
      }
      if (index + stride < last) {
        stack.push(index, last);
      }
    }
  }
  for (i = 0; i < n; ++i) {
    if (markers[i]) {
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + i * stride];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + i * stride + 1];
    }
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<number>} simplifiedEnds Simplified ends.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeuckers = function(flatCoordinates, offset,
    ends, stride, squaredTolerance, simplifiedFlatCoordinates,
    simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeucker(
        flatCoordinates, offset, end, stride, squaredTolerance,
        simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeuckerss = function(
    flatCoordinates, offset, endss, stride, squaredTolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeuckers(
        flatCoordinates, offset, ends, stride, squaredTolerance,
        simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.radialDistance = function(flatCoordinates, offset, end,
    stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  if (end <= offset + stride) {
    // zero or one point, no simplification possible, so copy and return
    for (; offset < end; offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  // copy first point
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  var x2 = x1;
  var y2 = y1;
  for (offset += stride; offset < end; offset += stride) {
    x2 = flatCoordinates[offset];
    y2 = flatCoordinates[offset + 1];
    if (ol.math.squaredDistance(x1, y1, x2, y2) > squaredTolerance) {
      // copy point at offset
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      x1 = x2;
      y1 = y2;
    }
  }
  if (x2 != x1 || y2 != y1) {
    // copy last point
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  }
  return simplifiedOffset;
};


/**
 * @param {number} value Value.
 * @param {number} tolerance Tolerance.
 * @return {number} Rounded value.
 */
ol.geom.flat.simplify.snap = function(value, tolerance) {
  return tolerance * Math.round(value / tolerance);
};


/**
 * Simplifies a line string using an algorithm designed by Tim Schaub.
 * Coordinates are snapped to the nearest value in a virtual grid and
 * consecutive duplicate coordinates are discarded.  This effectively preserves
 * topology as the simplification of any subsection of a line string is
 * independent of the rest of the line string.  This means that, for examples,
 * the common edge between two polygons will be simplified to the same line
 * string independently in both polygons.  This implementation uses a single
 * pass over the coordinates and eliminates intermediate collinear points.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantize = function(flatCoordinates, offset, end, stride,
    tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  // do nothing if the line is empty
  if (offset == end) {
    return simplifiedOffset;
  }
  // snap the first coordinate (P1)
  var x1 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
  var y1 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
  offset += stride;
  // add the first coordinate to the output
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  // find the next coordinate that does not snap to the same value as the first
  // coordinate (P2)
  var x2, y2;
  do {
    x2 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y2 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (offset == end) {
      // all coordinates snap to the same value, the line collapses to a point
      // push the last snapped value anyway to ensure that the output contains
      // at least two points
      // FIXME should we really return at least two points anyway?
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      return simplifiedOffset;
    }
  } while (x2 == x1 && y2 == y1);
  while (offset < end) {
    var x3, y3;
    // snap the next coordinate (P3)
    x3 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y3 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    // skip P3 if it is equal to P2
    if (x3 == x2 && y3 == y2) {
      continue;
    }
    // calculate the delta between P1 and P2
    var dx1 = x2 - x1;
    var dy1 = y2 - y1;
    // calculate the delta between P3 and P1
    var dx2 = x3 - x1;
    var dy2 = y3 - y1;
    // if P1, P2, and P3 are colinear and P3 is further from P1 than P2 is from
    // P1 in the same direction then P2 is on the straight line between P1 and
    // P3
    if ((dx1 * dy2 == dy1 * dx2) &&
        ((dx1 < 0 && dx2 < dx1) || dx1 == dx2 || (dx1 > 0 && dx2 > dx1)) &&
        ((dy1 < 0 && dy2 < dy1) || dy1 == dy2 || (dy1 > 0 && dy2 > dy1))) {
      // discard P2 and set P2 = P3
      x2 = x3;
      y2 = y3;
      continue;
    }
    // either P1, P2, and P3 are not colinear, or they are colinear but P3 is
    // between P3 and P1 or on the opposite half of the line to P2.  add P2,
    // and continue with P1 = P2 and P2 = P3
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
    x1 = x2;
    y1 = y2;
    x2 = x3;
    y2 = y3;
  }
  // add the last point (P2)
  simplifiedFlatCoordinates[simplifiedOffset++] = x2;
  simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<number>} simplifiedEnds Simplified ends.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantizes = function(
    flatCoordinates, offset, ends, stride,
    tolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.quantize(
        flatCoordinates, offset, end, stride,
        tolerance,
        simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantizess = function(
    flatCoordinates, offset, endss, stride,
    tolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.quantizes(
        flatCoordinates, offset, ends, stride,
        tolerance,
        simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};

goog.provide('ol.geom.LinearRing');

goog.require('ol');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.area');
goog.require('ol.geom.flat.closest');
goog.require('ol.geom.flat.deflate');
goog.require('ol.geom.flat.inflate');
goog.require('ol.geom.flat.simplify');


/**
 * @classdesc
 * Linear ring geometry. Only used as part of polygon; cannot be rendered
 * on its own.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.LinearRing = function(coordinates, opt_layout) {

  ol.geom.SimpleGeometry.call(this);

  /**
   * @private
   * @type {number}
   */
  this.maxDelta_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDeltaRevision_ = -1;

  this.setCoordinates(coordinates, opt_layout);

};
ol.inherits(ol.geom.LinearRing, ol.geom.SimpleGeometry);


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.LinearRing} Clone.
 * @override
 * @api
 */
ol.geom.LinearRing.prototype.clone = function() {
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return linearRing;
};


/**
 * @inheritDoc
 */
ol.geom.LinearRing.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance <
      ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(
        this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getClosestPoint(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};


/**
 * Return the area of the linear ring on projected plane.
 * @return {number} Area (on projected plane).
 * @api
 */
ol.geom.LinearRing.prototype.getArea = function() {
  return ol.geom.flat.area.linearRing(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * Return the coordinates of the linear ring.
 * @return {Array.<ol.Coordinate>} Coordinates.
 * @override
 * @api
 */
ol.geom.LinearRing.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * @inheritDoc
 */
ol.geom.LinearRing.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      squaredTolerance, simplifiedFlatCoordinates, 0);
  var simplifiedLinearRing = new ol.geom.LinearRing(null);
  simplifiedLinearRing.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
  return simplifiedLinearRing;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.LinearRing.prototype.getType = function() {
  return ol.geom.GeometryType.LINEAR_RING;
};


/**
 * @inheritDoc
 */
ol.geom.LinearRing.prototype.intersectsExtent = function(extent) {};


/**
 * Set the coordinates of the linear ring.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @override
 * @api
 */
ol.geom.LinearRing.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(
        this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.LinearRing.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};

goog.provide('ol.geom.Point');

goog.require('ol');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.deflate');
goog.require('ol.math');


/**
 * @classdesc
 * Point geometry.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {ol.Coordinate} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.Point = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.Point, ol.geom.SimpleGeometry);


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.Point} Clone.
 * @override
 * @api
 */
ol.geom.Point.prototype.clone = function() {
  var point = new ol.geom.Point(null);
  point.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return point;
};


/**
 * @inheritDoc
 */
ol.geom.Point.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  var flatCoordinates = this.flatCoordinates;
  var squaredDistance = ol.math.squaredDistance(
      x, y, flatCoordinates[0], flatCoordinates[1]);
  if (squaredDistance < minSquaredDistance) {
    var stride = this.stride;
    var i;
    for (i = 0; i < stride; ++i) {
      closestPoint[i] = flatCoordinates[i];
    }
    closestPoint.length = stride;
    return squaredDistance;
  } else {
    return minSquaredDistance;
  }
};


/**
 * Return the coordinate of the point.
 * @return {ol.Coordinate} Coordinates.
 * @override
 * @api
 */
ol.geom.Point.prototype.getCoordinates = function() {
  return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
};


/**
 * @inheritDoc
 */
ol.geom.Point.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromCoordinate(this.flatCoordinates, extent);
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Point.prototype.getType = function() {
  return ol.geom.GeometryType.POINT;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Point.prototype.intersectsExtent = function(extent) {
  return ol.extent.containsXY(extent,
      this.flatCoordinates[0], this.flatCoordinates[1]);
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Point.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinate(
        this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.Point.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};

goog.provide('ol.geom.flat.contains');

goog.require('ol.extent');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} Contains extent.
 */
ol.geom.flat.contains.linearRingContainsExtent = function(flatCoordinates, offset, end, stride, extent) {
  var outside = ol.extent.forEachCorner(extent,
      /**
       * @param {ol.Coordinate} coordinate Coordinate.
       * @return {boolean} Contains (x, y).
       */
      function(coordinate) {
        return !ol.geom.flat.contains.linearRingContainsXY(flatCoordinates,
            offset, end, stride, coordinate[0], coordinate[1]);
      });
  return !outside;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingContainsXY = function(flatCoordinates, offset, end, stride, x, y) {
  // http://geomalgorithms.com/a03-_inclusion.html
  // Copyright 2000 softSurfer, 2012 Dan Sunday
  // This code may be freely used and modified for any purpose
  // providing that this copyright notice is included with it.
  // SoftSurfer makes no warranty for this code, and cannot be held
  // liable for any real or imagined damage resulting from its use.
  // Users of this code must verify correctness for their application.
  var wn = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    if (y1 <= y) {
      if (y2 > y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) > 0) {
        wn++;
      }
    } else if (y2 <= y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) < 0) {
      wn--;
    }
    x1 = x2;
    y1 = y2;
  }
  return wn !== 0;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingsContainsXY = function(flatCoordinates, offset, ends, stride, x, y) {
  if (ends.length === 0) {
    return false;
  }
  if (!ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, ends[0], stride, x, y)) {
    return false;
  }
  var i, ii;
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.contains.linearRingContainsXY(
        flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingssContainsXY = function(flatCoordinates, offset, endss, stride, x, y) {
  if (endss.length === 0) {
    return false;
  }
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (ol.geom.flat.contains.linearRingsContainsXY(
        flatCoordinates, offset, ends, stride, x, y)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};

goog.provide('ol.geom.flat.interiorpoint');

goog.require('ol.array');
goog.require('ol.geom.flat.contains');


/**
 * Calculates a point that is likely to lie in the interior of the linear rings.
 * Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @param {number} flatCentersOffset Flat center offset.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Destination point as XYM coordinate, where M is the
 * length of the horizontal intersection that the point belongs to.
 */
ol.geom.flat.interiorpoint.linearRings = function(flatCoordinates, offset,
    ends, stride, flatCenters, flatCentersOffset, opt_dest) {
  var i, ii, x, x1, x2, y1, y2;
  var y = flatCenters[flatCentersOffset + 1];
  /** @type {Array.<number>} */
  var intersections = [];
  // Calculate intersections with the horizontal line
  for (var r = 0, rr = ends.length; r < rr; ++r) {
    var end = ends[r];
    x1 = flatCoordinates[end - stride];
    y1 = flatCoordinates[end - stride + 1];
    for (i = offset; i < end; i += stride) {
      x2 = flatCoordinates[i];
      y2 = flatCoordinates[i + 1];
      if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
        x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
        intersections.push(x);
      }
      x1 = x2;
      y1 = y2;
    }
  }
  // Find the longest segment of the horizontal line that has its center point
  // inside the linear ring.
  var pointX = NaN;
  var maxSegmentLength = -Infinity;
  intersections.sort(ol.array.numberSafeCompareFunction);
  x1 = intersections[0];
  for (i = 1, ii = intersections.length; i < ii; ++i) {
    x2 = intersections[i];
    var segmentLength = Math.abs(x2 - x1);
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2;
      if (ol.geom.flat.contains.linearRingsContainsXY(
          flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x;
        maxSegmentLength = segmentLength;
      }
    }
    x1 = x2;
  }
  if (isNaN(pointX)) {
    // There is no horizontal line that has its center point inside the linear
    // ring.  Use the center of the the linear ring's extent.
    pointX = flatCenters[flatCentersOffset];
  }
  if (opt_dest) {
    opt_dest.push(pointX, y, maxSegmentLength);
    return opt_dest;
  } else {
    return [pointX, y, maxSegmentLength];
  }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @return {Array.<number>} Interior points as XYM coordinates, where M is the
 * length of the horizontal intersection that the point belongs to.
 */
ol.geom.flat.interiorpoint.linearRingss = function(flatCoordinates, offset, endss, stride, flatCenters) {
  var interiorPoints = [];
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    interiorPoints = ol.geom.flat.interiorpoint.linearRings(flatCoordinates,
        offset, ends, stride, flatCenters, 2 * i, interiorPoints);
    offset = ends[ends.length - 1];
  }
  return interiorPoints;
};

goog.provide('ol.geom.flat.segments');


/**
 * This function calls `callback` for each segment of the flat coordinates
 * array. If the callback returns a truthy value the function returns that
 * value immediately. Otherwise the function returns `false`.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {function(this: S, ol.Coordinate, ol.Coordinate): T} callback Function
 *     called for each segment.
 * @param {S=} opt_this The object to be used as the value of 'this'
 *     within callback.
 * @return {T|boolean} Value.
 * @template T,S
 */
ol.geom.flat.segments.forEach = function(flatCoordinates, offset, end, stride, callback, opt_this) {
  var point1 = [flatCoordinates[offset], flatCoordinates[offset + 1]];
  var point2 = [];
  var ret;
  for (; (offset + stride) < end; offset += stride) {
    point2[0] = flatCoordinates[offset + stride];
    point2[1] = flatCoordinates[offset + stride + 1];
    ret = callback.call(opt_this, point1, point2);
    if (ret) {
      return ret;
    }
    point1[0] = point2[0];
    point1[1] = point2[1];
  }
  return false;
};

goog.provide('ol.geom.flat.intersectsextent');

goog.require('ol.extent');
goog.require('ol.geom.flat.contains');
goog.require('ol.geom.flat.segments');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.lineString = function(flatCoordinates, offset, end, stride, extent) {
  var coordinatesExtent = ol.extent.extendFlatCoordinates(
      ol.extent.createEmpty(), flatCoordinates, offset, end, stride);
  if (!ol.extent.intersects(extent, coordinatesExtent)) {
    return false;
  }
  if (ol.extent.containsExtent(extent, coordinatesExtent)) {
    return true;
  }
  if (coordinatesExtent[0] >= extent[0] &&
      coordinatesExtent[2] <= extent[2]) {
    return true;
  }
  if (coordinatesExtent[1] >= extent[1] &&
      coordinatesExtent[3] <= extent[3]) {
    return true;
  }
  return ol.geom.flat.segments.forEach(flatCoordinates, offset, end, stride,
      /**
       * @param {ol.Coordinate} point1 Start point.
       * @param {ol.Coordinate} point2 End point.
       * @return {boolean} `true` if the segment and the extent intersect,
       *     `false` otherwise.
       */
      function(point1, point2) {
        return ol.extent.intersectsSegment(extent, point1, point2);
      });
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.lineStrings = function(flatCoordinates, offset, ends, stride, extent) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.intersectsextent.lineString(
        flatCoordinates, offset, ends[i], stride, extent)) {
      return true;
    }
    offset = ends[i];
  }
  return false;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRing = function(flatCoordinates, offset, end, stride, extent) {
  if (ol.geom.flat.intersectsextent.lineString(
      flatCoordinates, offset, end, stride, extent)) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[0], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[0], extent[3])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[2], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[2], extent[3])) {
    return true;
  }
  return false;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRings = function(flatCoordinates, offset, ends, stride, extent) {
  if (!ol.geom.flat.intersectsextent.linearRing(
      flatCoordinates, offset, ends[0], stride, extent)) {
    return false;
  }
  if (ends.length === 1) {
    return true;
  }
  var i, ii;
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.contains.linearRingContainsExtent(
        flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRingss = function(flatCoordinates, offset, endss, stride, extent) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (ol.geom.flat.intersectsextent.linearRings(
        flatCoordinates, offset, ends, stride, extent)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};

goog.provide('ol.geom.flat.reverse');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 */
ol.geom.flat.reverse.coordinates = function(flatCoordinates, offset, end, stride) {
  while (offset < end - stride) {
    var i;
    for (i = 0; i < stride; ++i) {
      var tmp = flatCoordinates[offset + i];
      flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
      flatCoordinates[end - stride + i] = tmp;
    }
    offset += stride;
    end -= stride;
  }
};

goog.provide('ol.geom.flat.orient');

goog.require('ol.geom.flat.reverse');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {boolean} Is clockwise.
 */
ol.geom.flat.orient.linearRingIsClockwise = function(flatCoordinates, offset, end, stride) {
  // http://tinyurl.com/clockwise-method
  // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
  var edge = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    edge += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  return edge > 0;
};


/**
 * Determines if linear rings are oriented.  By default, left-hand orientation
 * is tested (first ring must be clockwise, remaining rings counter-clockwise).
 * To test for right-hand orientation, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Test for right-hand orientation
 *     (counter-clockwise exterior ring and clockwise interior rings).
 * @return {boolean} Rings are correctly oriented.
 */
ol.geom.flat.orient.linearRingsAreOriented = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    if (i === 0) {
      if ((right && isClockwise) || (!right && !isClockwise)) {
        return false;
      }
    } else {
      if ((right && !isClockwise) || (!right && isClockwise)) {
        return false;
      }
    }
    offset = end;
  }
  return true;
};


/**
 * Determines if linear rings are oriented.  By default, left-hand orientation
 * is tested (first ring must be clockwise, remaining rings counter-clockwise).
 * To test for right-hand orientation, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Array of array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Test for right-hand orientation
 *     (counter-clockwise exterior ring and clockwise interior rings).
 * @return {boolean} Rings are correctly oriented.
 */
ol.geom.flat.orient.linearRingssAreOriented = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    if (!ol.geom.flat.orient.linearRingsAreOriented(
        flatCoordinates, offset, endss[i], stride, opt_right)) {
      return false;
    }
  }
  return true;
};


/**
 * Orient coordinates in a flat array of linear rings.  By default, rings
 * are oriented following the left-hand rule (clockwise for exterior and
 * counter-clockwise for interior rings).  To orient according to the
 * right-hand rule, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Follow the right-hand rule for orientation.
 * @return {number} End.
 */
ol.geom.flat.orient.orientLinearRings = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    var reverse = i === 0 ?
      (right && isClockwise) || (!right && !isClockwise) :
      (right && !isClockwise) || (!right && isClockwise);
    if (reverse) {
      ol.geom.flat.reverse.coordinates(flatCoordinates, offset, end, stride);
    }
    offset = end;
  }
  return offset;
};


/**
 * Orient coordinates in a flat array of linear rings.  By default, rings
 * are oriented following the left-hand rule (clockwise for exterior and
 * counter-clockwise for interior rings).  To orient according to the
 * right-hand rule, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Array of array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Follow the right-hand rule for orientation.
 * @return {number} End.
 */
ol.geom.flat.orient.orientLinearRingss = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    offset = ol.geom.flat.orient.orientLinearRings(
        flatCoordinates, offset, endss[i], stride, opt_right);
  }
  return offset;
};

goog.provide('ol.geom.Polygon');

goog.require('ol');
goog.require('ol.array');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.LinearRing');
goog.require('ol.geom.Point');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.area');
goog.require('ol.geom.flat.closest');
goog.require('ol.geom.flat.contains');
goog.require('ol.geom.flat.deflate');
goog.require('ol.geom.flat.inflate');
goog.require('ol.geom.flat.interiorpoint');
goog.require('ol.geom.flat.intersectsextent');
goog.require('ol.geom.flat.orient');
goog.require('ol.geom.flat.simplify');
goog.require('ol.math');


/**
 * @classdesc
 * Polygon geometry.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {Array.<Array.<ol.Coordinate>>} coordinates Array of linear
 *     rings that define the polygon. The first linear ring of the array
 *     defines the outer-boundary or surface of the polygon. Each subsequent
 *     linear ring defines a hole in the surface of the polygon. A linear ring
 *     is an array of vertices' coordinates where the first coordinate and the
 *     last are equivalent.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api
 */
ol.geom.Polygon = function(coordinates, opt_layout) {

  ol.geom.SimpleGeometry.call(this);

  /**
   * @type {Array.<number>}
   * @private
   */
  this.ends_ = [];

  /**
   * @private
   * @type {number}
   */
  this.flatInteriorPointRevision_ = -1;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.flatInteriorPoint_ = null;

  /**
   * @private
   * @type {number}
   */
  this.maxDelta_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDeltaRevision_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.orientedRevision_ = -1;

  /**
   * @private
   * @type {Array.<number>}
   */
  this.orientedFlatCoordinates_ = null;

  this.setCoordinates(coordinates, opt_layout);

};
ol.inherits(ol.geom.Polygon, ol.geom.SimpleGeometry);


/**
 * Append the passed linear ring to this polygon.
 * @param {ol.geom.LinearRing} linearRing Linear ring.
 * @api
 */
ol.geom.Polygon.prototype.appendLinearRing = function(linearRing) {
  if (!this.flatCoordinates) {
    this.flatCoordinates = linearRing.getFlatCoordinates().slice();
  } else {
    ol.array.extend(this.flatCoordinates, linearRing.getFlatCoordinates());
  }
  this.ends_.push(this.flatCoordinates.length);
  this.changed();
};


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.Polygon} Clone.
 * @override
 * @api
 */
ol.geom.Polygon.prototype.clone = function() {
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      this.layout, this.flatCoordinates.slice(), this.ends_.slice());
  return polygon;
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance <
      ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(
        this.flatCoordinates, 0, this.ends_, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getsClosestPoint(
      this.flatCoordinates, 0, this.ends_, this.stride,
      this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.containsXY = function(x, y) {
  return ol.geom.flat.contains.linearRingsContainsXY(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
};


/**
 * Return the area of the polygon on projected plane.
 * @return {number} Area (on projected plane).
 * @api
 */
ol.geom.Polygon.prototype.getArea = function() {
  return ol.geom.flat.area.linearRings(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
};


/**
 * Get the coordinate array for this geometry.  This array has the structure
 * of a GeoJSON coordinate array for polygons.
 *
 * @param {boolean=} opt_right Orient coordinates according to the right-hand
 *     rule (counter-clockwise for exterior and clockwise for interior rings).
 *     If `false`, coordinates will be oriented according to the left-hand rule
 *     (clockwise for exterior and counter-clockwise for interior rings).
 *     By default, coordinate orientation will depend on how the geometry was
 *     constructed.
 * @return {Array.<Array.<ol.Coordinate>>} Coordinates.
 * @override
 * @api
 */
ol.geom.Polygon.prototype.getCoordinates = function(opt_right) {
  var flatCoordinates;
  if (opt_right !== undefined) {
    flatCoordinates = this.getOrientedFlatCoordinates().slice();
    ol.geom.flat.orient.orientLinearRings(
        flatCoordinates, 0, this.ends_, this.stride, opt_right);
  } else {
    flatCoordinates = this.flatCoordinates;
  }

  return ol.geom.flat.inflate.coordinatess(
      flatCoordinates, 0, this.ends_, this.stride);
};


/**
 * @return {Array.<number>} Ends.
 */
ol.geom.Polygon.prototype.getEnds = function() {
  return this.ends_;
};


/**
 * @return {Array.<number>} Interior point.
 */
ol.geom.Polygon.prototype.getFlatInteriorPoint = function() {
  if (this.flatInteriorPointRevision_ != this.getRevision()) {
    var flatCenter = ol.extent.getCenter(this.getExtent());
    this.flatInteriorPoint_ = ol.geom.flat.interiorpoint.linearRings(
        this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride,
        flatCenter, 0);
    this.flatInteriorPointRevision_ = this.getRevision();
  }
  return this.flatInteriorPoint_;
};


/**
 * Return an interior point of the polygon.
 * @return {ol.geom.Point} Interior point as XYM coordinate, where M is the
 * length of the horizontal intersection that the point belongs to.
 * @api
 */
ol.geom.Polygon.prototype.getInteriorPoint = function() {
  return new ol.geom.Point(this.getFlatInteriorPoint(), ol.geom.GeometryLayout.XYM);
};


/**
 * Return the number of rings of the polygon,  this includes the exterior
 * ring and any interior rings.
 *
 * @return {number} Number of rings.
 * @api
 */
ol.geom.Polygon.prototype.getLinearRingCount = function() {
  return this.ends_.length;
};


/**
 * Return the Nth linear ring of the polygon geometry. Return `null` if the
 * given index is out of range.
 * The exterior linear ring is available at index `0` and the interior rings
 * at index `1` and beyond.
 *
 * @param {number} index Index.
 * @return {ol.geom.LinearRing} Linear ring.
 * @api
 */
ol.geom.Polygon.prototype.getLinearRing = function(index) {
  if (index < 0 || this.ends_.length <= index) {
    return null;
  }
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice(
      index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
  return linearRing;
};


/**
 * Return the linear rings of the polygon.
 * @return {Array.<ol.geom.LinearRing>} Linear rings.
 * @api
 */
ol.geom.Polygon.prototype.getLinearRings = function() {
  var layout = this.layout;
  var flatCoordinates = this.flatCoordinates;
  var ends = this.ends_;
  var linearRings = [];
  var offset = 0;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var linearRing = new ol.geom.LinearRing(null);
    linearRing.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
    linearRings.push(linearRing);
    offset = end;
  }
  return linearRings;
};


/**
 * @return {Array.<number>} Oriented flat coordinates.
 */
ol.geom.Polygon.prototype.getOrientedFlatCoordinates = function() {
  if (this.orientedRevision_ != this.getRevision()) {
    var flatCoordinates = this.flatCoordinates;
    if (ol.geom.flat.orient.linearRingsAreOriented(
        flatCoordinates, 0, this.ends_, this.stride)) {
      this.orientedFlatCoordinates_ = flatCoordinates;
    } else {
      this.orientedFlatCoordinates_ = flatCoordinates.slice();
      this.orientedFlatCoordinates_.length =
          ol.geom.flat.orient.orientLinearRings(
              this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
    }
    this.orientedRevision_ = this.getRevision();
  }
  return this.orientedFlatCoordinates_;
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  var simplifiedEnds = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizes(
      this.flatCoordinates, 0, this.ends_, this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates, 0, simplifiedEnds);
  var simplifiedPolygon = new ol.geom.Polygon(null);
  simplifiedPolygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
  return simplifiedPolygon;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Polygon.prototype.getType = function() {
  return ol.geom.GeometryType.POLYGON;
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.Polygon.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.linearRings(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
};


/**
 * Set the coordinates of the polygon.
 * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @override
 * @api
 */
ol.geom.Polygon.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
  } else {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = ol.geom.flat.deflate.coordinatess(
        this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {Array.<number>} ends Ends.
 */
ol.geom.Polygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.ends_ = ends;
  this.changed();
};


/**
 * Create an approximation of a circle on the surface of a sphere.
 * @param {ol.Sphere} sphere The sphere.
 * @param {ol.Coordinate} center Center (`[lon, lat]` in degrees).
 * @param {number} radius The great-circle distance from the center to
 *     the polygon vertices.
 * @param {number=} opt_n Optional number of vertices for the resulting
 *     polygon. Default is `32`.
 * @return {ol.geom.Polygon} The "circular" polygon.
 * @api
 */
ol.geom.Polygon.circular = function(sphere, center, radius, opt_n) {
  var n = opt_n ? opt_n : 32;
  /** @type {Array.<number>} */
  var flatCoordinates = [];
  var i;
  for (i = 0; i < n; ++i) {
    ol.array.extend(
        flatCoordinates, sphere.offset(center, radius, 2 * Math.PI * i / n));
  }
  flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};


/**
 * Create a polygon from an extent. The layout used is `XY`.
 * @param {ol.Extent} extent The extent.
 * @return {ol.geom.Polygon} The polygon.
 * @api
 */
ol.geom.Polygon.fromExtent = function(extent) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var flatCoordinates =
      [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY];
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};


/**
 * Create a regular polygon from a circle.
 * @param {ol.geom.Circle} circle Circle geometry.
 * @param {number=} opt_sides Number of sides of the polygon. Default is 32.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 * @return {ol.geom.Polygon} Polygon geometry.
 * @api
 */
ol.geom.Polygon.fromCircle = function(circle, opt_sides, opt_angle) {
  var sides = opt_sides ? opt_sides : 32;
  var stride = circle.getStride();
  var layout = circle.getLayout();
  var polygon = new ol.geom.Polygon(null, layout);
  var arrayLength = stride * (sides + 1);
  var flatCoordinates = new Array(arrayLength);
  for (var i = 0; i < arrayLength; i++) {
    flatCoordinates[i] = 0;
  }
  var ends = [flatCoordinates.length];
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
  ol.geom.Polygon.makeRegular(
      polygon, circle.getCenter(), circle.getRadius(), opt_angle);
  return polygon;
};


/**
 * Modify the coordinates of a polygon to make it a regular polygon.
 * @param {ol.geom.Polygon} polygon Polygon geometry.
 * @param {ol.Coordinate} center Center of the regular polygon.
 * @param {number} radius Radius of the regular polygon.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 */
ol.geom.Polygon.makeRegular = function(polygon, center, radius, opt_angle) {
  var flatCoordinates = polygon.getFlatCoordinates();
  var layout = polygon.getLayout();
  var stride = polygon.getStride();
  var ends = polygon.getEnds();
  var sides = flatCoordinates.length / stride - 1;
  var startAngle = opt_angle ? opt_angle : 0;
  var angle, offset;
  for (var i = 0; i <= sides; ++i) {
    offset = i * stride;
    angle = startAngle + (ol.math.modulo(i, sides) * 2 * Math.PI / sides);
    flatCoordinates[offset] = center[0] + (radius * Math.cos(angle));
    flatCoordinates[offset + 1] = center[1] + (radius * Math.sin(angle));
  }
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
};

goog.provide('ol.View');

goog.require('ol');
goog.require('ol.CenterConstraint');
goog.require('ol.Object');
goog.require('ol.ResolutionConstraint');
goog.require('ol.RotationConstraint');
goog.require('ol.ViewHint');
goog.require('ol.ViewProperty');
goog.require('ol.array');
goog.require('ol.asserts');
goog.require('ol.coordinate');
goog.require('ol.easing');
goog.require('ol.extent');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.math');
goog.require('ol.obj');
goog.require('ol.proj');
goog.require('ol.proj.Units');


/**
 * @classdesc
 * An ol.View object represents a simple 2D view of the map.
 *
 * This is the object to act upon to change the center, resolution,
 * and rotation of the map.
 *
 * ### The view states
 *
 * An `ol.View` is determined by three states: `center`, `resolution`,
 * and `rotation`. Each state has a corresponding getter and setter, e.g.
 * `getCenter` and `setCenter` for the `center` state.
 *
 * An `ol.View` has a `projection`. The projection determines the
 * coordinate system of the center, and its units determine the units of the
 * resolution (projection units per pixel). The default projection is
 * Spherical Mercator (EPSG:3857).
 *
 * ### The constraints
 *
 * `setCenter`, `setResolution` and `setRotation` can be used to change the
 * states of the view. Any value can be passed to the setters. And the value
 * that is passed to a setter will effectively be the value set in the view,
 * and returned by the corresponding getter.
 *
 * But an `ol.View` object also has a *resolution constraint*, a
 * *rotation constraint* and a *center constraint*.
 *
 * As said above, no constraints are applied when the setters are used to set
 * new states for the view. Applying constraints is done explicitly through
 * the use of the `constrain*` functions (`constrainResolution` and
 * `constrainRotation` and `constrainCenter`).
 *
 * The main users of the constraints are the interactions and the
 * controls. For example, double-clicking on the map changes the view to
 * the "next" resolution. And releasing the fingers after pinch-zooming
 * snaps to the closest resolution (with an animation).
 *
 * The *resolution constraint* snaps to specific resolutions. It is
 * determined by the following options: `resolutions`, `maxResolution`,
 * `maxZoom`, and `zoomFactor`. If `resolutions` is set, the other three
 * options are ignored. See documentation for each option for more
 * information.
 *
 * The *rotation constraint* snaps to specific angles. It is determined
 * by the following options: `enableRotation` and `constrainRotation`.
 * By default the rotation value is snapped to zero when approaching the
 * horizontal.
 *
 * The *center constraint* is determined by the `extent` option. By
 * default the center is not constrained at all.
 *
 * @constructor
 * @extends {ol.Object}
 * @param {olx.ViewOptions=} opt_options View options.
 * @api
 */
ol.View = function(opt_options) {
  ol.Object.call(this);

  var options = ol.obj.assign({}, opt_options);

  /**
   * @private
   * @type {Array.<number>}
   */
  this.hints_ = [0, 0];

  /**
   * @private
   * @type {Array.<Array.<ol.ViewAnimation>>}
   */
  this.animations_ = [];

  /**
   * @private
   * @type {number|undefined}
   */
  this.updateAnimationKey_;

  this.updateAnimations_ = this.updateAnimations_.bind(this);

  /**
   * @private
   * @const
   * @type {ol.proj.Projection}
   */
  this.projection_ = ol.proj.createProjection(options.projection, 'EPSG:3857');

  this.applyOptions_(options);
};
ol.inherits(ol.View, ol.Object);


/**
 * Set up the view with the given options.
 * @param {olx.ViewOptions} options View options.
 */
ol.View.prototype.applyOptions_ = function(options) {

  /**
   * @type {Object.<string, *>}
   */
  var properties = {};
  properties[ol.ViewProperty.CENTER] = options.center !== undefined ?
    options.center : null;

  var resolutionConstraintInfo = ol.View.createResolutionConstraint_(
      options);

  /**
   * @private
   * @type {number}
   */
  this.maxResolution_ = resolutionConstraintInfo.maxResolution;

  /**
   * @private
   * @type {number}
   */
  this.minResolution_ = resolutionConstraintInfo.minResolution;

  /**
   * @private
   * @type {number}
   */
  this.zoomFactor_ = resolutionConstraintInfo.zoomFactor;

  /**
   * @private
   * @type {Array.<number>|undefined}
   */
  this.resolutions_ = options.resolutions;

  /**
   * @private
   * @type {number}
   */
  this.minZoom_ = resolutionConstraintInfo.minZoom;

  var centerConstraint = ol.View.createCenterConstraint_(options);
  var resolutionConstraint = resolutionConstraintInfo.constraint;
  var rotationConstraint = ol.View.createRotationConstraint_(options);

  /**
   * @private
   * @type {ol.Constraints}
   */
  this.constraints_ = {
    center: centerConstraint,
    resolution: resolutionConstraint,
    rotation: rotationConstraint
  };

  if (options.resolution !== undefined) {
    properties[ol.ViewProperty.RESOLUTION] = options.resolution;
  } else if (options.zoom !== undefined) {
    properties[ol.ViewProperty.RESOLUTION] = this.constrainResolution(
        this.maxResolution_, options.zoom - this.minZoom_);

    if (this.resolutions_) { // in case map zoom is out of min/max zoom range
      properties[ol.ViewProperty.RESOLUTION] = ol.math.clamp(
          Number(this.getResolution() || properties[ol.ViewProperty.RESOLUTION]),
          this.minResolution_, this.maxResolution_);
    }
  }
  properties[ol.ViewProperty.ROTATION] =
      options.rotation !== undefined ? options.rotation : 0;
  this.setProperties(properties);

  /**
   * @private
   * @type {olx.ViewOptions}
   */
  this.options_ = options;

};

/**
 * Get an updated version of the view options used to construct the view.  The
 * current resolution (or zoom), center, and rotation are applied to any stored
 * options.  The provided options can be uesd to apply new min/max zoom or
 * resolution limits.
 * @param {olx.ViewOptions} newOptions New options to be applied.
 * @return {olx.ViewOptions} New options updated with the current view state.
 */
ol.View.prototype.getUpdatedOptions_ = function(newOptions) {
  var options = ol.obj.assign({}, this.options_);

  // preserve resolution (or zoom)
  if (options.resolution !== undefined) {
    options.resolution = this.getResolution();
  } else {
    options.zoom = this.getZoom();
  }

  // preserve center
  options.center = this.getCenter();

  // preserve rotation
  options.rotation = this.getRotation();

  return ol.obj.assign({}, options, newOptions);
};


/**
 * Animate the view.  The view's center, zoom (or resolution), and rotation
 * can be animated for smooth transitions between view states.  For example,
 * to animate the view to a new zoom level:
 *
 *     view.animate({zoom: view.getZoom() + 1});
 *
 * By default, the animation lasts one second and uses in-and-out easing.  You
 * can customize this behavior by including `duration` (in milliseconds) and
 * `easing` options (see {@link ol.easing}).
 *
 * To chain together multiple animations, call the method with multiple
 * animation objects.  For example, to first zoom and then pan:
 *
 *     view.animate({zoom: 10}, {center: [0, 0]});
 *
 * If you provide a function as the last argument to the animate method, it
 * will get called at the end of an animation series.  The callback will be
 * called with `true` if the animation series completed on its own or `false`
 * if it was cancelled.
 *
 * Animations are cancelled by user interactions (e.g. dragging the map) or by
 * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
 * (or another method that calls one of these).
 *
 * @param {...(olx.AnimationOptions|function(boolean))} var_args Animation
 *     options.  Multiple animations can be run in series by passing multiple
 *     options objects.  To run multiple animations in parallel, call the method
 *     multiple times.  An optional callback can be provided as a final
 *     argument.  The callback will be called with a boolean indicating whether
 *     the animation completed without being cancelled.
 * @api
 */
ol.View.prototype.animate = function(var_args) {
  var animationCount = arguments.length;
  var callback;
  if (animationCount > 1 && typeof arguments[animationCount - 1] === 'function') {
    callback = arguments[animationCount - 1];
    --animationCount;
  }
  if (!this.isDef()) {
    // if view properties are not yet set, shortcut to the final state
    var state = arguments[animationCount - 1];
    if (state.center) {
      this.setCenter(state.center);
    }
    if (state.zoom !== undefined) {
      this.setZoom(state.zoom);
    }
    if (state.rotation !== undefined) {
      this.setRotation(state.rotation);
    }
    if (callback) {
      callback(true);
    }
    return;
  }
  var start = Date.now();
  var center = this.getCenter().slice();
  var resolution = this.getResolution();
  var rotation = this.getRotation();
  var series = [];
  for (var i = 0; i < animationCount; ++i) {
    var options = /** @type {olx.AnimationOptions} */ (arguments[i]);

    var animation = /** @type {ol.ViewAnimation} */ ({
      start: start,
      complete: false,
      anchor: options.anchor,
      duration: options.duration !== undefined ? options.duration : 1000,
      easing: options.easing || ol.easing.inAndOut
    });

    if (options.center) {
      animation.sourceCenter = center;
      animation.targetCenter = options.center;
      center = animation.targetCenter;
    }

    if (options.zoom !== undefined) {
      animation.sourceResolution = resolution;
      animation.targetResolution = this.constrainResolution(
          this.maxResolution_, options.zoom - this.minZoom_, 0);
      resolution = animation.targetResolution;
    } else if (options.resolution) {
      animation.sourceResolution = resolution;
      animation.targetResolution = options.resolution;
      resolution = animation.targetResolution;
    }

    if (options.rotation !== undefined) {
      animation.sourceRotation = rotation;
      var delta = ol.math.modulo(options.rotation - rotation + Math.PI, 2 * Math.PI) - Math.PI;
      animation.targetRotation = rotation + delta;
      rotation = animation.targetRotation;
    }

    animation.callback = callback;

    // check if animation is a no-op
    if (ol.View.isNoopAnimation(animation)) {
      animation.complete = true;
      // we still push it onto the series for callback handling
    } else {
      start += animation.duration;
    }
    series.push(animation);
  }
  this.animations_.push(series);
  this.setHint(ol.ViewHint.ANIMATING, 1);
  this.updateAnimations_();
};


/**
 * Determine if the view is being animated.
 * @return {boolean} The view is being animated.
 * @api
 */
ol.View.prototype.getAnimating = function() {
  return this.hints_[ol.ViewHint.ANIMATING] > 0;
};


/**
 * Determine if the user is interacting with the view, such as panning or zooming.
 * @return {boolean} The view is being interacted with.
 * @api
 */
ol.View.prototype.getInteracting = function() {
  return this.hints_[ol.ViewHint.INTERACTING] > 0;
};


/**
 * Cancel any ongoing animations.
 * @api
 */
ol.View.prototype.cancelAnimations = function() {
  this.setHint(ol.ViewHint.ANIMATING, -this.hints_[ol.ViewHint.ANIMATING]);
  for (var i = 0, ii = this.animations_.length; i < ii; ++i) {
    var series = this.animations_[i];
    if (series[0].callback) {
      series[0].callback(false);
    }
  }
  this.animations_.length = 0;
};

/**
 * Update all animations.
 */
ol.View.prototype.updateAnimations_ = function() {
  if (this.updateAnimationKey_ !== undefined) {
    cancelAnimationFrame(this.updateAnimationKey_);
    this.updateAnimationKey_ = undefined;
  }
  if (!this.getAnimating()) {
    return;
  }
  var now = Date.now();
  var more = false;
  for (var i = this.animations_.length - 1; i >= 0; --i) {
    var series = this.animations_[i];
    var seriesComplete = true;
    for (var j = 0, jj = series.length; j < jj; ++j) {
      var animation = series[j];
      if (animation.complete) {
        continue;
      }
      var elapsed = now - animation.start;
      var fraction = animation.duration > 0 ? elapsed / animation.duration : 1;
      if (fraction >= 1) {
        animation.complete = true;
        fraction = 1;
      } else {
        seriesComplete = false;
      }
      var progress = animation.easing(fraction);
      if (animation.sourceCenter) {
        var x0 = animation.sourceCenter[0];
        var y0 = animation.sourceCenter[1];
        var x1 = animation.targetCenter[0];
        var y1 = animation.targetCenter[1];
        var x = x0 + progress * (x1 - x0);
        var y = y0 + progress * (y1 - y0);
        this.set(ol.ViewProperty.CENTER, [x, y]);
      }
      if (animation.sourceResolution && animation.targetResolution) {
        var resolution = progress === 1 ?
          animation.targetResolution :
          animation.sourceResolution + progress * (animation.targetResolution - animation.sourceResolution);
        if (animation.anchor) {
          this.set(ol.ViewProperty.CENTER,
              this.calculateCenterZoom(resolution, animation.anchor));
        }
        this.set(ol.ViewProperty.RESOLUTION, resolution);
      }
      if (animation.sourceRotation !== undefined && animation.targetRotation !== undefined) {
        var rotation = progress === 1 ?
          ol.math.modulo(animation.targetRotation + Math.PI, 2 * Math.PI) - Math.PI :
          animation.sourceRotation + progress * (animation.targetRotation - animation.sourceRotation);
        if (animation.anchor) {
          this.set(ol.ViewProperty.CENTER,
              this.calculateCenterRotate(rotation, animation.anchor));
        }
        this.set(ol.ViewProperty.ROTATION, rotation);
      }
      more = true;
      if (!animation.complete) {
        break;
      }
    }
    if (seriesComplete) {
      this.animations_[i] = null;
      this.setHint(ol.ViewHint.ANIMATING, -1);
      var callback = series[0].callback;
      if (callback) {
        callback(true);
      }
    }
  }
  // prune completed series
  this.animations_ = this.animations_.filter(Boolean);
  if (more && this.updateAnimationKey_ === undefined) {
    this.updateAnimationKey_ = requestAnimationFrame(this.updateAnimations_);
  }
};

/**
 * @param {number} rotation Target rotation.
 * @param {ol.Coordinate} anchor Rotation anchor.
 * @return {ol.Coordinate|undefined} Center for rotation and anchor.
 */
ol.View.prototype.calculateCenterRotate = function(rotation, anchor) {
  var center;
  var currentCenter = this.getCenter();
  if (currentCenter !== undefined) {
    center = [currentCenter[0] - anchor[0], currentCenter[1] - anchor[1]];
    ol.coordinate.rotate(center, rotation - this.getRotation());
    ol.coordinate.add(center, anchor);
  }
  return center;
};


/**
 * @param {number} resolution Target resolution.
 * @param {ol.Coordinate} anchor Zoom anchor.
 * @return {ol.Coordinate|undefined} Center for resolution and anchor.
 */
ol.View.prototype.calculateCenterZoom = function(resolution, anchor) {
  var center;
  var currentCenter = this.getCenter();
  var currentResolution = this.getResolution();
  if (currentCenter !== undefined && currentResolution !== undefined) {
    var x = anchor[0] -
        resolution * (anchor[0] - currentCenter[0]) / currentResolution;
    var y = anchor[1] -
        resolution * (anchor[1] - currentCenter[1]) / currentResolution;
    center = [x, y];
  }
  return center;
};


/**
 * @private
 * @return {ol.Size} Viewport size or `[100, 100]` when no viewport is found.
 */
ol.View.prototype.getSizeFromViewport_ = function() {
  var size = [100, 100];
  var selector = '.ol-viewport[data-view="' + ol.getUid(this) + '"]';
  var element = document.querySelector(selector);
  if (element) {
    var metrics = getComputedStyle(element);
    size[0] = parseInt(metrics.width, 10);
    size[1] = parseInt(metrics.height, 10);
  }
  return size;
};


/**
 * Get the constrained center of this view.
 * @param {ol.Coordinate|undefined} center Center.
 * @return {ol.Coordinate|undefined} Constrained center.
 * @api
 */
ol.View.prototype.constrainCenter = function(center) {
  return this.constraints_.center(center);
};


/**
 * Get the constrained resolution of this view.
 * @param {number|undefined} resolution Resolution.
 * @param {number=} opt_delta Delta. Default is `0`.
 * @param {number=} opt_direction Direction. Default is `0`.
 * @return {number|undefined} Constrained resolution.
 * @api
 */
ol.View.prototype.constrainResolution = function(
    resolution, opt_delta, opt_direction) {
  var delta = opt_delta || 0;
  var direction = opt_direction || 0;
  return this.constraints_.resolution(resolution, delta, direction);
};


/**
 * Get the constrained rotation of this view.
 * @param {number|undefined} rotation Rotation.
 * @param {number=} opt_delta Delta. Default is `0`.
 * @return {number|undefined} Constrained rotation.
 * @api
 */
ol.View.prototype.constrainRotation = function(rotation, opt_delta) {
  var delta = opt_delta || 0;
  return this.constraints_.rotation(rotation, delta);
};


/**
 * Get the view center.
 * @return {ol.Coordinate|undefined} The center of the view.
 * @observable
 * @api
 */
ol.View.prototype.getCenter = function() {
  return /** @type {ol.Coordinate|undefined} */ (
    this.get(ol.ViewProperty.CENTER));
};


/**
 * @return {ol.Constraints} Constraints.
 */
ol.View.prototype.getConstraints = function() {
  return this.constraints_;
};


/**
 * @param {Array.<number>=} opt_hints Destination array.
 * @return {Array.<number>} Hint.
 */
ol.View.prototype.getHints = function(opt_hints) {
  if (opt_hints !== undefined) {
    opt_hints[0] = this.hints_[0];
    opt_hints[1] = this.hints_[1];
    return opt_hints;
  } else {
    return this.hints_.slice();
  }
};


/**
 * Calculate the extent for the current view state and the passed size.
 * The size is the pixel dimensions of the box into which the calculated extent
 * should fit. In most cases you want to get the extent of the entire map,
 * that is `map.getSize()`.
 * @param {ol.Size=} opt_size Box pixel size. If not provided, the size of the
 * first map that uses this view will be used.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.View.prototype.calculateExtent = function(opt_size) {
  var size = opt_size || this.getSizeFromViewport_();
  var center = /** @type {!ol.Coordinate} */ (this.getCenter());
  ol.asserts.assert(center, 1); // The view center is not defined
  var resolution = /** @type {!number} */ (this.getResolution());
  ol.asserts.assert(resolution !== undefined, 2); // The view resolution is not defined
  var rotation = /** @type {!number} */ (this.getRotation());
  ol.asserts.assert(rotation !== undefined, 3); // The view rotation is not defined

  return ol.extent.getForViewAndSize(center, resolution, rotation, size);
};


/**
 * Get the maximum resolution of the view.
 * @return {number} The maximum resolution of the view.
 * @api
 */
ol.View.prototype.getMaxResolution = function() {
  return this.maxResolution_;
};


/**
 * Get the minimum resolution of the view.
 * @return {number} The minimum resolution of the view.
 * @api
 */
ol.View.prototype.getMinResolution = function() {
  return this.minResolution_;
};


/**
 * Get the maximum zoom level for the view.
 * @return {number} The maximum zoom level.
 * @api
 */
ol.View.prototype.getMaxZoom = function() {
  return /** @type {number} */ (this.getZoomForResolution(this.minResolution_));
};


/**
 * Set a new maximum zoom level for the view.
 * @param {number} zoom The maximum zoom level.
 * @api
 */
ol.View.prototype.setMaxZoom = function(zoom) {
  this.applyOptions_(this.getUpdatedOptions_({maxZoom: zoom}));
};


/**
 * Get the minimum zoom level for the view.
 * @return {number} The minimum zoom level.
 * @api
 */
ol.View.prototype.getMinZoom = function() {
  return /** @type {number} */ (this.getZoomForResolution(this.maxResolution_));
};


/**
 * Set a new minimum zoom level for the view.
 * @param {number} zoom The minimum zoom level.
 * @api
 */
ol.View.prototype.setMinZoom = function(zoom) {
  this.applyOptions_(this.getUpdatedOptions_({minZoom: zoom}));
};


/**
 * Get the view projection.
 * @return {ol.proj.Projection} The projection of the view.
 * @api
 */
ol.View.prototype.getProjection = function() {
  return this.projection_;
};


/**
 * Get the view resolution.
 * @return {number|undefined} The resolution of the view.
 * @observable
 * @api
 */
ol.View.prototype.getResolution = function() {
  return /** @type {number|undefined} */ (
    this.get(ol.ViewProperty.RESOLUTION));
};


/**
 * Get the resolutions for the view. This returns the array of resolutions
 * passed to the constructor of the {ol.View}, or undefined if none were given.
 * @return {Array.<number>|undefined} The resolutions of the view.
 * @api
 */
ol.View.prototype.getResolutions = function() {
  return this.resolutions_;
};


/**
 * Get the resolution for a provided extent (in map units) and size (in pixels).
 * @param {ol.Extent} extent Extent.
 * @param {ol.Size=} opt_size Box pixel size.
 * @return {number} The resolution at which the provided extent will render at
 *     the given size.
 * @api
 */
ol.View.prototype.getResolutionForExtent = function(extent, opt_size) {
  var size = opt_size || this.getSizeFromViewport_();
  var xResolution = ol.extent.getWidth(extent) / size[0];
  var yResolution = ol.extent.getHeight(extent) / size[1];
  return Math.max(xResolution, yResolution);
};


/**
 * Return a function that returns a value between 0 and 1 for a
 * resolution. Exponential scaling is assumed.
 * @param {number=} opt_power Power.
 * @return {function(number): number} Resolution for value function.
 */
ol.View.prototype.getResolutionForValueFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return (
    /**
     * @param {number} value Value.
     * @return {number} Resolution.
     */
    function(value) {
      var resolution = maxResolution / Math.pow(power, value * max);
      return resolution;
    });
};


/**
 * Get the view rotation.
 * @return {number} The rotation of the view in radians.
 * @observable
 * @api
 */
ol.View.prototype.getRotation = function() {
  return /** @type {number} */ (this.get(ol.ViewProperty.ROTATION));
};


/**
 * Return a function that returns a resolution for a value between
 * 0 and 1. Exponential scaling is assumed.
 * @param {number=} opt_power Power.
 * @return {function(number): number} Value for resolution function.
 */
ol.View.prototype.getValueForResolutionFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return (
    /**
     * @param {number} resolution Resolution.
     * @return {number} Value.
     */
    function(resolution) {
      var value =
            (Math.log(maxResolution / resolution) / Math.log(power)) / max;
      return value;
    });
};


/**
 * @return {olx.ViewState} View state.
 */
ol.View.prototype.getState = function() {
  var center = /** @type {ol.Coordinate} */ (this.getCenter());
  var projection = this.getProjection();
  var resolution = /** @type {number} */ (this.getResolution());
  var rotation = this.getRotation();
  return /** @type {olx.ViewState} */ ({
    center: center.slice(),
    projection: projection !== undefined ? projection : null,
    resolution: resolution,
    rotation: rotation,
    zoom: this.getZoom()
  });
};


/**
 * Get the current zoom level.  If you configured your view with a resolutions
 * array (this is rare), this method may return non-integer zoom levels (so
 * the zoom level is not safe to use as an index into a resolutions array).
 * @return {number|undefined} Zoom.
 * @api
 */
ol.View.prototype.getZoom = function() {
  var zoom;
  var resolution = this.getResolution();
  if (resolution !== undefined) {
    zoom = this.getZoomForResolution(resolution);
  }
  return zoom;
};


/**
 * Get the zoom level for a resolution.
 * @param {number} resolution The resolution.
 * @return {number|undefined} The zoom level for the provided resolution.
 * @api
 */
ol.View.prototype.getZoomForResolution = function(resolution) {
  var offset = this.minZoom_ || 0;
  var max, zoomFactor;
  if (this.resolutions_) {
    var nearest = ol.array.linearFindNearest(this.resolutions_, resolution, 1);
    offset = nearest;
    max = this.resolutions_[nearest];
    if (nearest == this.resolutions_.length - 1) {
      zoomFactor = 2;
    } else {
      zoomFactor = max / this.resolutions_[nearest + 1];
    }
  } else {
    max = this.maxResolution_;
    zoomFactor = this.zoomFactor_;
  }
  return offset + Math.log(max / resolution) / Math.log(zoomFactor);
};


/**
 * Get the resolution for a zoom level.
 * @param {number} zoom Zoom level.
 * @return {number} The view resolution for the provided zoom level.
 * @api
 */
ol.View.prototype.getResolutionForZoom = function(zoom) {
  return /** @type {number} */ (this.constrainResolution(
      this.maxResolution_, zoom - this.minZoom_, 0));
};


/**
 * Fit the given geometry or extent based on the given map size and border.
 * The size is pixel dimensions of the box to fit the extent into.
 * In most cases you will want to use the map size, that is `map.getSize()`.
 * Takes care of the map angle.
 * @param {ol.geom.SimpleGeometry|ol.Extent} geometryOrExtent The geometry or
 *     extent to fit the view to.
 * @param {olx.view.FitOptions=} opt_options Options.
 * @api
 */
ol.View.prototype.fit = function(geometryOrExtent, opt_options) {
  var options = opt_options || {};
  var size = options.size;
  if (!size) {
    size = this.getSizeFromViewport_();
  }
  /** @type {ol.geom.SimpleGeometry} */
  var geometry;
  if (!(geometryOrExtent instanceof ol.geom.SimpleGeometry)) {
    ol.asserts.assert(Array.isArray(geometryOrExtent),
        24); // Invalid extent or geometry provided as `geometry`
    ol.asserts.assert(!ol.extent.isEmpty(geometryOrExtent),
        25); // Cannot fit empty extent provided as `geometry`
    geometry = ol.geom.Polygon.fromExtent(geometryOrExtent);
  } else if (geometryOrExtent.getType() === ol.geom.GeometryType.CIRCLE) {
    geometryOrExtent = geometryOrExtent.getExtent();
    geometry = ol.geom.Polygon.fromExtent(geometryOrExtent);
    geometry.rotate(this.getRotation(), ol.extent.getCenter(geometryOrExtent));
  } else {
    geometry = geometryOrExtent;
  }

  var padding = options.padding !== undefined ? options.padding : [0, 0, 0, 0];
  var constrainResolution = options.constrainResolution !== undefined ?
    options.constrainResolution : true;
  var nearest = options.nearest !== undefined ? options.nearest : false;
  var minResolution;
  if (options.minResolution !== undefined) {
    minResolution = options.minResolution;
  } else if (options.maxZoom !== undefined) {
    minResolution = this.constrainResolution(
        this.maxResolution_, options.maxZoom - this.minZoom_, 0);
  } else {
    minResolution = 0;
  }
  var coords = geometry.getFlatCoordinates();

  // calculate rotated extent
  var rotation = this.getRotation();
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var minRotX = +Infinity;
  var minRotY = +Infinity;
  var maxRotX = -Infinity;
  var maxRotY = -Infinity;
  var stride = geometry.getStride();
  for (var i = 0, ii = coords.length; i < ii; i += stride) {
    var rotX = coords[i] * cosAngle - coords[i + 1] * sinAngle;
    var rotY = coords[i] * sinAngle + coords[i + 1] * cosAngle;
    minRotX = Math.min(minRotX, rotX);
    minRotY = Math.min(minRotY, rotY);
    maxRotX = Math.max(maxRotX, rotX);
    maxRotY = Math.max(maxRotY, rotY);
  }

  // calculate resolution
  var resolution = this.getResolutionForExtent(
      [minRotX, minRotY, maxRotX, maxRotY],
      [size[0] - padding[1] - padding[3], size[1] - padding[0] - padding[2]]);
  resolution = isNaN(resolution) ? minResolution :
    Math.max(resolution, minResolution);
  if (constrainResolution) {
    var constrainedResolution = this.constrainResolution(resolution, 0, 0);
    if (!nearest && constrainedResolution < resolution) {
      constrainedResolution = this.constrainResolution(
          constrainedResolution, -1, 0);
    }
    resolution = constrainedResolution;
  }

  // calculate center
  sinAngle = -sinAngle; // go back to original rotation
  var centerRotX = (minRotX + maxRotX) / 2;
  var centerRotY = (minRotY + maxRotY) / 2;
  centerRotX += (padding[1] - padding[3]) / 2 * resolution;
  centerRotY += (padding[0] - padding[2]) / 2 * resolution;
  var centerX = centerRotX * cosAngle - centerRotY * sinAngle;
  var centerY = centerRotY * cosAngle + centerRotX * sinAngle;
  var center = [centerX, centerY];
  var callback = options.callback ? options.callback : ol.nullFunction;

  if (options.duration !== undefined) {
    this.animate({
      resolution: resolution,
      center: center,
      duration: options.duration,
      easing: options.easing
    }, callback);
  } else {
    this.setResolution(resolution);
    this.setCenter(center);
    setTimeout(callback.bind(undefined, true), 0);
  }
};


/**
 * Center on coordinate and view position.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Size} size Box pixel size.
 * @param {ol.Pixel} position Position on the view to center on.
 * @api
 */
ol.View.prototype.centerOn = function(coordinate, size, position) {
  // calculate rotated position
  var rotation = this.getRotation();
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  var resolution = this.getResolution();
  rotX += (size[0] / 2 - position[0]) * resolution;
  rotY += (position[1] - size[1] / 2) * resolution;

  // go back to original angle
  sinAngle = -sinAngle; // go back to original rotation
  var centerX = rotX * cosAngle - rotY * sinAngle;
  var centerY = rotY * cosAngle + rotX * sinAngle;

  this.setCenter([centerX, centerY]);
};


/**
 * @return {boolean} Is defined.
 */
ol.View.prototype.isDef = function() {
  return !!this.getCenter() && this.getResolution() !== undefined;
};


/**
 * Rotate the view around a given coordinate.
 * @param {number} rotation New rotation value for the view.
 * @param {ol.Coordinate=} opt_anchor The rotation center.
 * @api
 */
ol.View.prototype.rotate = function(rotation, opt_anchor) {
  if (opt_anchor !== undefined) {
    var center = this.calculateCenterRotate(rotation, opt_anchor);
    this.setCenter(center);
  }
  this.setRotation(rotation);
};


/**
 * Set the center of the current view.
 * @param {ol.Coordinate|undefined} center The center of the view.
 * @observable
 * @api
 */
ol.View.prototype.setCenter = function(center) {
  this.set(ol.ViewProperty.CENTER, center);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};


/**
 * @param {ol.ViewHint} hint Hint.
 * @param {number} delta Delta.
 * @return {number} New value.
 */
ol.View.prototype.setHint = function(hint, delta) {
  this.hints_[hint] += delta;
  this.changed();
  return this.hints_[hint];
};


/**
 * Set the resolution for this view.
 * @param {number|undefined} resolution The resolution of the view.
 * @observable
 * @api
 */
ol.View.prototype.setResolution = function(resolution) {
  this.set(ol.ViewProperty.RESOLUTION, resolution);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};


/**
 * Set the rotation for this view.
 * @param {number} rotation The rotation of the view in radians.
 * @observable
 * @api
 */
ol.View.prototype.setRotation = function(rotation) {
  this.set(ol.ViewProperty.ROTATION, rotation);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};


/**
 * Zoom to a specific zoom level.
 * @param {number} zoom Zoom level.
 * @api
 */
ol.View.prototype.setZoom = function(zoom) {
  this.setResolution(this.getResolutionForZoom(zoom));
};


/**
 * @param {olx.ViewOptions} options View options.
 * @private
 * @return {ol.CenterConstraintType} The constraint.
 */
ol.View.createCenterConstraint_ = function(options) {
  if (options.extent !== undefined) {
    return ol.CenterConstraint.createExtent(options.extent);
  } else {
    return ol.CenterConstraint.none;
  }
};


/**
 * @private
 * @param {olx.ViewOptions} options View options.
 * @return {{constraint: ol.ResolutionConstraintType, maxResolution: number,
 *     minResolution: number, zoomFactor: number}} The constraint.
 */
ol.View.createResolutionConstraint_ = function(options) {
  var resolutionConstraint;
  var maxResolution;
  var minResolution;

  // TODO: move these to be ol constants
  // see https://github.com/openlayers/openlayers/issues/2076
  var defaultMaxZoom = 28;
  var defaultZoomFactor = 2;

  var minZoom = options.minZoom !== undefined ?
    options.minZoom : ol.DEFAULT_MIN_ZOOM;

  var maxZoom = options.maxZoom !== undefined ?
    options.maxZoom : defaultMaxZoom;

  var zoomFactor = options.zoomFactor !== undefined ?
    options.zoomFactor : defaultZoomFactor;

  if (options.resolutions !== undefined) {
    var resolutions = options.resolutions;
    maxResolution = resolutions[minZoom];
    minResolution = resolutions[maxZoom] !== undefined ?
      resolutions[maxZoom] : resolutions[resolutions.length - 1];
    resolutionConstraint = ol.ResolutionConstraint.createSnapToResolutions(
        resolutions);
  } else {
    // calculate the default min and max resolution
    var projection = ol.proj.createProjection(options.projection, 'EPSG:3857');
    var extent = projection.getExtent();
    var size = !extent ?
      // use an extent that can fit the whole world if need be
      360 * ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] /
            projection.getMetersPerUnit() :
      Math.max(ol.extent.getWidth(extent), ol.extent.getHeight(extent));

    var defaultMaxResolution = size / ol.DEFAULT_TILE_SIZE / Math.pow(
        defaultZoomFactor, ol.DEFAULT_MIN_ZOOM);

    var defaultMinResolution = defaultMaxResolution / Math.pow(
        defaultZoomFactor, defaultMaxZoom - ol.DEFAULT_MIN_ZOOM);

    // user provided maxResolution takes precedence
    maxResolution = options.maxResolution;
    if (maxResolution !== undefined) {
      minZoom = 0;
    } else {
      maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom);
    }

    // user provided minResolution takes precedence
    minResolution = options.minResolution;
    if (minResolution === undefined) {
      if (options.maxZoom !== undefined) {
        if (options.maxResolution !== undefined) {
          minResolution = maxResolution / Math.pow(zoomFactor, maxZoom);
        } else {
          minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom);
        }
      } else {
        minResolution = defaultMinResolution;
      }
    }

    // given discrete zoom levels, minResolution may be different than provided
    maxZoom = minZoom + Math.floor(
        Math.log(maxResolution / minResolution) / Math.log(zoomFactor));
    minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom);

    resolutionConstraint = ol.ResolutionConstraint.createSnapToPower(
        zoomFactor, maxResolution, maxZoom - minZoom);
  }
  return {constraint: resolutionConstraint, maxResolution: maxResolution,
    minResolution: minResolution, minZoom: minZoom, zoomFactor: zoomFactor};
};


/**
 * @private
 * @param {olx.ViewOptions} options View options.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.View.createRotationConstraint_ = function(options) {
  var enableRotation = options.enableRotation !== undefined ?
    options.enableRotation : true;
  if (enableRotation) {
    var constrainRotation = options.constrainRotation;
    if (constrainRotation === undefined || constrainRotation === true) {
      return ol.RotationConstraint.createSnapToZero();
    } else if (constrainRotation === false) {
      return ol.RotationConstraint.none;
    } else if (typeof constrainRotation === 'number') {
      return ol.RotationConstraint.createSnapToN(constrainRotation);
    } else {
      return ol.RotationConstraint.none;
    }
  } else {
    return ol.RotationConstraint.disable;
  }
};


/**
 * Determine if an animation involves no view change.
 * @param {ol.ViewAnimation} animation The animation.
 * @return {boolean} The animation involves no view change.
 */
ol.View.isNoopAnimation = function(animation) {
  if (animation.sourceCenter && animation.targetCenter) {
    if (!ol.coordinate.equals(animation.sourceCenter, animation.targetCenter)) {
      return false;
    }
  }
  if (animation.sourceResolution !== animation.targetResolution) {
    return false;
  }
  if (animation.sourceRotation !== animation.targetRotation) {
    return false;
  }
  return true;
};

goog.provide('ol.dom');


/**
 * Create an html canvas element and returns its 2d context.
 * @param {number=} opt_width Canvas width.
 * @param {number=} opt_height Canvas height.
 * @return {CanvasRenderingContext2D} The context.
 */
ol.dom.createCanvasContext2D = function(opt_width, opt_height) {
  var canvas = document.createElement('CANVAS');
  if (opt_width) {
    canvas.width = opt_width;
  }
  if (opt_height) {
    canvas.height = opt_height;
  }
  return canvas.getContext('2d');
};


/**
 * Get the current computed width for the given element including margin,
 * padding and border.
 * Equivalent to jQuery's `$(el).outerWidth(true)`.
 * @param {!Element} element Element.
 * @return {number} The width.
 */
ol.dom.outerWidth = function(element) {
  var width = element.offsetWidth;
  var style = getComputedStyle(element);
  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);

  return width;
};


/**
 * Get the current computed height for the given element including margin,
 * padding and border.
 * Equivalent to jQuery's `$(el).outerHeight(true)`.
 * @param {!Element} element Element.
 * @return {number} The height.
 */
ol.dom.outerHeight = function(element) {
  var height = element.offsetHeight;
  var style = getComputedStyle(element);
  height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);

  return height;
};

/**
 * @param {Node} newNode Node to replace old node
 * @param {Node} oldNode The node to be replaced
 */
ol.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};

/**
 * @param {Node} node The node to remove.
 * @returns {Node} The node that was removed or null.
 */
ol.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};

/**
 * @param {Node} node The node to remove the children from.
 */
ol.dom.removeChildren = function(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
};

goog.provide('ol.layer.Property');

/**
 * @enum {string}
 */
ol.layer.Property = {
  OPACITY: 'opacity',
  VISIBLE: 'visible',
  EXTENT: 'extent',
  Z_INDEX: 'zIndex',
  MAX_RESOLUTION: 'maxResolution',
  MIN_RESOLUTION: 'minResolution',
  SOURCE: 'source'
};

goog.provide('ol.layer.Base');

goog.require('ol');
goog.require('ol.Object');
goog.require('ol.layer.Property');
goog.require('ol.math');
goog.require('ol.obj');


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Note that with `ol.layer.Base` and all its subclasses, any property set in
 * the options is set as a {@link ol.Object} property on the layer object, so
 * is observable, and has get/set accessors.
 *
 * @constructor
 * @abstract
 * @extends {ol.Object}
 * @param {olx.layer.BaseOptions} options Layer options.
 * @api
 */
ol.layer.Base = function(options) {

  ol.Object.call(this);

  /**
   * @type {Object.<string, *>}
   */
  var properties = ol.obj.assign({}, options);
  properties[ol.layer.Property.OPACITY] =
      options.opacity !== undefined ? options.opacity : 1;
  properties[ol.layer.Property.VISIBLE] =
      options.visible !== undefined ? options.visible : true;
  properties[ol.layer.Property.Z_INDEX] =
      options.zIndex !== undefined ? options.zIndex : 0;
  properties[ol.layer.Property.MAX_RESOLUTION] =
      options.maxResolution !== undefined ? options.maxResolution : Infinity;
  properties[ol.layer.Property.MIN_RESOLUTION] =
      options.minResolution !== undefined ? options.minResolution : 0;

  this.setProperties(properties);

  /**
   * @type {ol.LayerState}
   * @private
   */
  this.state_ = /** @type {ol.LayerState} */ ({
    layer: /** @type {ol.layer.Layer} */ (this),
    managed: true
  });

  /**
   * The layer type.
   * @type {ol.LayerType}
   * @protected;
   */
  this.type;

};
ol.inherits(ol.layer.Base, ol.Object);


/**
 * Get the layer type (used when creating a layer renderer).
 * @return {ol.LayerType} The layer type.
 */
ol.layer.Base.prototype.getType = function() {
  return this.type;
};


/**
 * @return {ol.LayerState} Layer state.
 */
ol.layer.Base.prototype.getLayerState = function() {
  this.state_.opacity = ol.math.clamp(this.getOpacity(), 0, 1);
  this.state_.sourceState = this.getSourceState();
  this.state_.visible = this.getVisible();
  this.state_.extent = this.getExtent();
  this.state_.zIndex = this.getZIndex();
  this.state_.maxResolution = this.getMaxResolution();
  this.state_.minResolution = Math.max(this.getMinResolution(), 0);

  return this.state_;
};


/**
 * @abstract
 * @param {Array.<ol.layer.Layer>=} opt_array Array of layers (to be
 *     modified in place).
 * @return {Array.<ol.layer.Layer>} Array of layers.
 */
ol.layer.Base.prototype.getLayersArray = function(opt_array) {};


/**
 * @abstract
 * @param {Array.<ol.LayerState>=} opt_states Optional list of layer
 *     states (to be modified in place).
 * @return {Array.<ol.LayerState>} List of layer states.
 */
ol.layer.Base.prototype.getLayerStatesArray = function(opt_states) {};


/**
 * Return the {@link ol.Extent extent} of the layer or `undefined` if it
 * will be visible regardless of extent.
 * @return {ol.Extent|undefined} The layer extent.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getExtent = function() {
  return /** @type {ol.Extent|undefined} */ (
    this.get(ol.layer.Property.EXTENT));
};


/**
 * Return the maximum resolution of the layer.
 * @return {number} The maximum resolution of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getMaxResolution = function() {
  return /** @type {number} */ (
    this.get(ol.layer.Property.MAX_RESOLUTION));
};


/**
 * Return the minimum resolution of the layer.
 * @return {number} The minimum resolution of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getMinResolution = function() {
  return /** @type {number} */ (
    this.get(ol.layer.Property.MIN_RESOLUTION));
};


/**
 * Return the opacity of the layer (between 0 and 1).
 * @return {number} The opacity of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getOpacity = function() {
  return /** @type {number} */ (this.get(ol.layer.Property.OPACITY));
};


/**
 * @abstract
 * @return {ol.source.State} Source state.
 */
ol.layer.Base.prototype.getSourceState = function() {};


/**
 * Return the visibility of the layer (`true` or `false`).
 * @return {boolean} The visibility of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getVisible = function() {
  return /** @type {boolean} */ (this.get(ol.layer.Property.VISIBLE));
};


/**
 * Return the Z-index of the layer, which is used to order layers before
 * rendering. The default Z-index is 0.
 * @return {number} The Z-index of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.getZIndex = function() {
  return /** @type {number} */ (this.get(ol.layer.Property.Z_INDEX));
};


/**
 * Set the extent at which the layer is visible.  If `undefined`, the layer
 * will be visible at all extents.
 * @param {ol.Extent|undefined} extent The extent of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setExtent = function(extent) {
  this.set(ol.layer.Property.EXTENT, extent);
};


/**
 * Set the maximum resolution at which the layer is visible.
 * @param {number} maxResolution The maximum resolution of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setMaxResolution = function(maxResolution) {
  this.set(ol.layer.Property.MAX_RESOLUTION, maxResolution);
};


/**
 * Set the minimum resolution at which the layer is visible.
 * @param {number} minResolution The minimum resolution of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setMinResolution = function(minResolution) {
  this.set(ol.layer.Property.MIN_RESOLUTION, minResolution);
};


/**
 * Set the opacity of the layer, allowed values range from 0 to 1.
 * @param {number} opacity The opacity of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setOpacity = function(opacity) {
  this.set(ol.layer.Property.OPACITY, opacity);
};


/**
 * Set the visibility of the layer (`true` or `false`).
 * @param {boolean} visible The visibility of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setVisible = function(visible) {
  this.set(ol.layer.Property.VISIBLE, visible);
};


/**
 * Set Z-index of the layer, which is used to order layers before rendering.
 * The default Z-index is 0.
 * @param {number} zindex The z-index of the layer.
 * @observable
 * @api
 */
ol.layer.Base.prototype.setZIndex = function(zindex) {
  this.set(ol.layer.Property.Z_INDEX, zindex);
};

goog.provide('ol.source.State');


/**
 * State of the source, one of 'undefined', 'loading', 'ready' or 'error'.
 * @enum {string}
 */
ol.source.State = {
  UNDEFINED: 'undefined',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error'
};


goog.provide('ol.layer.Group');

goog.require('ol');
goog.require('ol.Collection');
goog.require('ol.CollectionEventType');
goog.require('ol.Object');
goog.require('ol.ObjectEventType');
goog.require('ol.asserts');
goog.require('ol.events');
goog.require('ol.events.EventType');
goog.require('ol.extent');
goog.require('ol.layer.Base');
goog.require('ol.obj');
goog.require('ol.source.State');


/**
 * @classdesc
 * A {@link ol.Collection} of layers that are handled together.
 *
 * A generic `change` event is triggered when the group/Collection changes.
 *
 * @constructor
 * @extends {ol.layer.Base}
 * @param {olx.layer.GroupOptions=} opt_options Layer options.
 * @api
 */
ol.layer.Group = function(opt_options) {

  var options = opt_options || {};
  var baseOptions = /** @type {olx.layer.GroupOptions} */
      (ol.obj.assign({}, options));
  delete baseOptions.layers;

  var layers = options.layers;

  ol.layer.Base.call(this, baseOptions);

  /**
   * @private
   * @type {Array.<ol.EventsKey>}
   */
  this.layersListenerKeys_ = [];

  /**
   * @private
   * @type {Object.<string, Array.<ol.EventsKey>>}
   */
  this.listenerKeys_ = {};

  ol.events.listen(this,
      ol.Object.getChangeEventType(ol.layer.Group.Property_.LAYERS),
      this.handleLayersChanged_, this);

  if (layers) {
    if (Array.isArray(layers)) {
      layers = new ol.Collection(layers.slice(), {unique: true});
    } else {
      ol.asserts.assert(layers instanceof ol.Collection,
          43); // Expected `layers` to be an array or an `ol.Collection`
      layers = layers;
    }
  } else {
    layers = new ol.Collection(undefined, {unique: true});
  }

  this.setLayers(layers);

};
ol.inherits(ol.layer.Group, ol.layer.Base);


/**
 * @private
 */
ol.layer.Group.prototype.handleLayerChange_ = function() {
  this.changed();
};


/**
 * @param {ol.events.Event} event Event.
 * @private
 */
ol.layer.Group.prototype.handleLayersChanged_ = function(event) {
  this.layersListenerKeys_.forEach(ol.events.unlistenByKey);
  this.layersListenerKeys_.length = 0;

  var layers = this.getLayers();
  this.layersListenerKeys_.push(
      ol.events.listen(layers, ol.CollectionEventType.ADD,
          this.handleLayersAdd_, this),
      ol.events.listen(layers, ol.CollectionEventType.REMOVE,
          this.handleLayersRemove_, this));

  for (var id in this.listenerKeys_) {
    this.listenerKeys_[id].forEach(ol.events.unlistenByKey);
  }
  ol.obj.clear(this.listenerKeys_);

  var layersArray = layers.getArray();
  var i, ii, layer;
  for (i = 0, ii = layersArray.length; i < ii; i++) {
    layer = layersArray[i];
    this.listenerKeys_[ol.getUid(layer).toString()] = [
      ol.events.listen(layer, ol.ObjectEventType.PROPERTYCHANGE,
          this.handleLayerChange_, this),
      ol.events.listen(layer, ol.events.EventType.CHANGE,
          this.handleLayerChange_, this)
    ];
  }

  this.changed();
};


/**
 * @param {ol.Collection.Event} collectionEvent Collection event.
 * @private
 */
ol.layer.Group.prototype.handleLayersAdd_ = function(collectionEvent) {
  var layer = /** @type {ol.layer.Base} */ (collectionEvent.element);
  var key = ol.getUid(layer).toString();
  this.listenerKeys_[key] = [
    ol.events.listen(layer, ol.ObjectEventType.PROPERTYCHANGE,
        this.handleLayerChange_, this),
    ol.events.listen(layer, ol.events.EventType.CHANGE,
        this.handleLayerChange_, this)
  ];
  this.changed();
};


/**
 * @param {ol.Collection.Event} collectionEvent Collection event.
 * @private
 */
ol.layer.Group.prototype.handleLayersRemove_ = function(collectionEvent) {
  var layer = /** @type {ol.layer.Base} */ (collectionEvent.element);
  var key = ol.getUid(layer).toString();
  this.listenerKeys_[key].forEach(ol.events.unlistenByKey);
  delete this.listenerKeys_[key];
  this.changed();
};


/**
 * Returns the {@link ol.Collection collection} of {@link ol.layer.Layer layers}
 * in this group.
 * @return {!ol.Collection.<ol.layer.Base>} Collection of
 *   {@link ol.layer.Base layers} that are part of this group.
 * @observable
 * @api
 */
ol.layer.Group.prototype.getLayers = function() {
  return /** @type {!ol.Collection.<ol.layer.Base>} */ (this.get(
      ol.layer.Group.Property_.LAYERS));
};


/**
 * Set the {@link ol.Collection collection} of {@link ol.layer.Layer layers}
 * in this group.
 * @param {!ol.Collection.<ol.layer.Base>} layers Collection of
 *   {@link ol.layer.Base layers} that are part of this group.
 * @observable
 * @api
 */
ol.layer.Group.prototype.setLayers = function(layers) {
  this.set(ol.layer.Group.Property_.LAYERS, layers);
};


/**
 * @inheritDoc
 */
ol.layer.Group.prototype.getLayersArray = function(opt_array) {
  var array = opt_array !== undefined ? opt_array : [];
  this.getLayers().forEach(function(layer) {
    layer.getLayersArray(array);
  });
  return array;
};


/**
 * @inheritDoc
 */
ol.layer.Group.prototype.getLayerStatesArray = function(opt_states) {
  var states = opt_states !== undefined ? opt_states : [];

  var pos = states.length;

  this.getLayers().forEach(function(layer) {
    layer.getLayerStatesArray(states);
  });

  var ownLayerState = this.getLayerState();
  var i, ii, layerState;
  for (i = pos, ii = states.length; i < ii; i++) {
    layerState = states[i];
    layerState.opacity *= ownLayerState.opacity;
    layerState.visible = layerState.visible && ownLayerState.visible;
    layerState.maxResolution = Math.min(
        layerState.maxResolution, ownLayerState.maxResolution);
    layerState.minResolution = Math.max(
        layerState.minResolution, ownLayerState.minResolution);
    if (ownLayerState.extent !== undefined) {
      if (layerState.extent !== undefined) {
        layerState.extent = ol.extent.getIntersection(
            layerState.extent, ownLayerState.extent);
      } else {
        layerState.extent = ownLayerState.extent;
      }
    }
  }

  return states;
};


/**
 * @inheritDoc
 */
ol.layer.Group.prototype.getSourceState = function() {
  return ol.source.State.READY;
};

/**
 * @enum {string}
 * @private
 */
ol.layer.Group.Property_ = {
  LAYERS: 'layers'
};

goog.provide('ol.PluginType');

/**
 * A plugin type used when registering a plugin.  The supported plugin types are
 * 'MAP_RENDERER', and 'LAYER_RENDERER'.
 * @enum {string}
 */
ol.PluginType = {
  MAP_RENDERER: 'MAP_RENDERER',
  LAYER_RENDERER: 'LAYER_RENDERER'
};

goog.provide('ol.plugins');

goog.require('ol.PluginType');

/**
 * The registry of map renderer plugins.
 * @type {Array<olx.MapRendererPlugin>}
 * @private
 */
ol.plugins.mapRendererPlugins_ = [];


/**
 * Get all registered map renderer plugins.
 * @return {Array<olx.MapRendererPlugin>} The registered map renderer plugins.
 */
ol.plugins.getMapRendererPlugins = function() {
  return ol.plugins.mapRendererPlugins_;
};


/**
 * The registry of layer renderer plugins.
 * @type {Array<olx.LayerRendererPlugin>}
 * @private
 */
ol.plugins.layerRendererPlugins_ = [];


/**
 * Get all registered layer renderer plugins.
 * @return {Array<olx.LayerRendererPlugin>} The registered layer renderer plugins.
 */
ol.plugins.getLayerRendererPlugins = function() {
  return ol.plugins.layerRendererPlugins_;
};


/**
 * Register a plugin.
 * @param {ol.PluginType} type The plugin type.
 * @param {*} plugin The plugin.
 */
ol.plugins.register = function(type, plugin) {
  var plugins;
  switch (type) {
    case ol.PluginType.MAP_RENDERER: {
      plugins = ol.plugins.mapRendererPlugins_;
      plugins.push(/** @type {olx.MapRendererPlugin} */ (plugin));
      break;
    }
    case ol.PluginType.LAYER_RENDERER: {
      plugins = ol.plugins.layerRendererPlugins_;
      plugins.push(/** @type {olx.LayerRendererPlugin} */ (plugin));
      break;
    }
    default: {
      throw new Error('Unsupported plugin type: ' + type);
    }
  }
};


/**
 * Register multiple plugins.
 * @param {ol.PluginType} type The plugin type.
 * @param {Array} plugins The plugins.
 */
ol.plugins.registerMultiple = function(type, plugins) {
  for (var i = 0, ii = plugins.length; i < ii; ++i) {
    ol.plugins.register(type, plugins