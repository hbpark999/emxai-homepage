/**
 * BrandScope v1.9.1 - Copyright (c) imweb, Inc, 2026 (https://imweb.me)
 * Built at: 2026-07-21T17:30:58+09:00
 * All rights reserved.
 *
 * This software and associated documentation files (the "Software") are the proprietary property of imweb, Inc.
 * The Software may only be used by imweb, Inc. and its authorized affiliates.
 * Any unauthorized use, reproduction, or distribution of the Software or any portion of it is strictly prohibited.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Brandscope = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var _Reflect = {};

	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	var hasRequired_Reflect;

	function require_Reflect () {
		if (hasRequired_Reflect) return _Reflect;
		hasRequired_Reflect = 1;
		var Reflect;
		(function (Reflect) {
		    // Metadata Proposal
		    // https://rbuckton.github.io/reflect-metadata/
		    (function (factory) {
		        var root = typeof globalThis === "object" ? globalThis :
		            typeof commonjsGlobal === "object" ? commonjsGlobal :
		                typeof self === "object" ? self :
		                    typeof this === "object" ? this :
		                        sloppyModeThis();
		        var exporter = makeExporter(Reflect);
		        if (typeof root.Reflect !== "undefined") {
		            exporter = makeExporter(root.Reflect, exporter);
		        }
		        factory(exporter, root);
		        if (typeof root.Reflect === "undefined") {
		            root.Reflect = Reflect;
		        }
		        function makeExporter(target, previous) {
		            return function (key, value) {
		                Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
		                if (previous)
		                    previous(key, value);
		            };
		        }
		        function functionThis() {
		            try {
		                return Function("return this;")();
		            }
		            catch (_) { }
		        }
		        function indirectEvalThis() {
		            try {
		                return (void 0, eval)("(function() { return this; })()");
		            }
		            catch (_) { }
		        }
		        function sloppyModeThis() {
		            return functionThis() || indirectEvalThis();
		        }
		    })(function (exporter, root) {
		        var hasOwn = Object.prototype.hasOwnProperty;
		        // feature test for Symbol support
		        var supportsSymbol = typeof Symbol === "function";
		        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
		        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
		        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
		        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
		        var downLevel = !supportsCreate && !supportsProto;
		        var HashMap = {
		            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
		            create: supportsCreate
		                ? function () { return MakeDictionary(Object.create(null)); }
		                : supportsProto
		                    ? function () { return MakeDictionary({ __proto__: null }); }
		                    : function () { return MakeDictionary({}); },
		            has: downLevel
		                ? function (map, key) { return hasOwn.call(map, key); }
		                : function (map, key) { return key in map; },
		            get: downLevel
		                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
		                : function (map, key) { return map[key]; },
		        };
		        // Load global or shim versions of Map, Set, and WeakMap
		        var functionPrototype = Object.getPrototypeOf(Function);
		        var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
		        var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
		        var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
		        var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : undefined;
		        var metadataRegistry = GetOrCreateMetadataRegistry();
		        var metadataProvider = CreateMetadataProvider(metadataRegistry);
		        /**
		         * Applies a set of decorators to a property of a target object.
		         * @param decorators An array of decorators.
		         * @param target The target object.
		         * @param propertyKey (Optional) The property key to decorate.
		         * @param attributes (Optional) The property descriptor for the target key.
		         * @remarks Decorators are applied in reverse order.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     Example = Reflect.decorate(decoratorsArray, Example);
		         *
		         *     // property (on constructor)
		         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     Object.defineProperty(Example, "staticMethod",
		         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
		         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
		         *
		         *     // method (on prototype)
		         *     Object.defineProperty(Example.prototype, "method",
		         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
		         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
		         *
		         */
		        function decorate(decorators, target, propertyKey, attributes) {
		            if (!IsUndefined(propertyKey)) {
		                if (!IsArray(decorators))
		                    throw new TypeError();
		                if (!IsObject(target))
		                    throw new TypeError();
		                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
		                    throw new TypeError();
		                if (IsNull(attributes))
		                    attributes = undefined;
		                propertyKey = ToPropertyKey(propertyKey);
		                return DecorateProperty(decorators, target, propertyKey, attributes);
		            }
		            else {
		                if (!IsArray(decorators))
		                    throw new TypeError();
		                if (!IsConstructor(target))
		                    throw new TypeError();
		                return DecorateConstructor(decorators, target);
		            }
		        }
		        exporter("decorate", decorate);
		        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
		        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
		        /**
		         * A default metadata decorator factory that can be used on a class, class member, or parameter.
		         * @param metadataKey The key for the metadata entry.
		         * @param metadataValue The value for the metadata entry.
		         * @returns A decorator function.
		         * @remarks
		         * If `metadataKey` is already defined for the target and target key, the
		         * metadataValue for that key will be overwritten.
		         * @example
		         *
		         *     // constructor
		         *     @Reflect.metadata(key, value)
		         *     class Example {
		         *     }
		         *
		         *     // property (on constructor, TypeScript only)
		         *     class Example {
		         *         @Reflect.metadata(key, value)
		         *         static staticProperty;
		         *     }
		         *
		         *     // property (on prototype, TypeScript only)
		         *     class Example {
		         *         @Reflect.metadata(key, value)
		         *         property;
		         *     }
		         *
		         *     // method (on constructor)
		         *     class Example {
		         *         @Reflect.metadata(key, value)
		         *         static staticMethod() { }
		         *     }
		         *
		         *     // method (on prototype)
		         *     class Example {
		         *         @Reflect.metadata(key, value)
		         *         method() { }
		         *     }
		         *
		         */
		        function metadata(metadataKey, metadataValue) {
		            function decorator(target, propertyKey) {
		                if (!IsObject(target))
		                    throw new TypeError();
		                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
		                    throw new TypeError();
		                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
		            }
		            return decorator;
		        }
		        exporter("metadata", metadata);
		        /**
		         * Define a unique metadata entry on the target.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param metadataValue A value that contains attached metadata.
		         * @param target The target object on which to define metadata.
		         * @param propertyKey (Optional) The property key for the target.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     Reflect.defineMetadata("custom:annotation", options, Example);
		         *
		         *     // property (on constructor)
		         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
		         *
		         *     // decorator factory as metadata-producing annotation.
		         *     function MyAnnotation(options): Decorator {
		         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
		         *     }
		         *
		         */
		        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
		        }
		        exporter("defineMetadata", defineMetadata);
		        /**
		         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.hasMetadata("custom:annotation", Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
		         *
		         */
		        function hasMetadata(metadataKey, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
		        }
		        exporter("hasMetadata", hasMetadata);
		        /**
		         * Gets a value indicating whether the target object has the provided metadata key defined.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
		         *
		         */
		        function hasOwnMetadata(metadataKey, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
		        }
		        exporter("hasOwnMetadata", hasOwnMetadata);
		        /**
		         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.getMetadata("custom:annotation", Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
		         *
		         */
		        function getMetadata(metadataKey, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
		        }
		        exporter("getMetadata", getMetadata);
		        /**
		         * Gets the metadata value for the provided metadata key on the target object.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
		         *
		         */
		        function getOwnMetadata(metadataKey, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
		        }
		        exporter("getOwnMetadata", getOwnMetadata);
		        /**
		         * Gets the metadata keys defined on the target object or its prototype chain.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns An array of unique metadata keys.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.getMetadataKeys(Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
		         *
		         */
		        function getMetadataKeys(target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryMetadataKeys(target, propertyKey);
		        }
		        exporter("getMetadataKeys", getMetadataKeys);
		        /**
		         * Gets the unique metadata keys defined on the target object.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns An array of unique metadata keys.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.getOwnMetadataKeys(Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
		         *
		         */
		        function getOwnMetadataKeys(target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            return OrdinaryOwnMetadataKeys(target, propertyKey);
		        }
		        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
		        /**
		         * Deletes the metadata entry from the target object with the provided key.
		         * @param metadataKey A key used to store and retrieve metadata.
		         * @param target The target object on which the metadata is defined.
		         * @param propertyKey (Optional) The property key for the target.
		         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
		         * @example
		         *
		         *     class Example {
		         *         // property declarations are not part of ES6, though they are valid in TypeScript:
		         *         // static staticProperty;
		         *         // property;
		         *
		         *         constructor(p) { }
		         *         static staticMethod(p) { }
		         *         method(p) { }
		         *     }
		         *
		         *     // constructor
		         *     result = Reflect.deleteMetadata("custom:annotation", Example);
		         *
		         *     // property (on constructor)
		         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
		         *
		         *     // property (on prototype)
		         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
		         *
		         *     // method (on constructor)
		         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
		         *
		         *     // method (on prototype)
		         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
		         *
		         */
		        function deleteMetadata(metadataKey, target, propertyKey) {
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            if (!IsObject(target))
		                throw new TypeError();
		            if (!IsUndefined(propertyKey))
		                propertyKey = ToPropertyKey(propertyKey);
		            var provider = GetMetadataProvider(target, propertyKey, /*Create*/ false);
		            if (IsUndefined(provider))
		                return false;
		            return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
		        }
		        exporter("deleteMetadata", deleteMetadata);
		        function DecorateConstructor(decorators, target) {
		            for (var i = decorators.length - 1; i >= 0; --i) {
		                var decorator = decorators[i];
		                var decorated = decorator(target);
		                if (!IsUndefined(decorated) && !IsNull(decorated)) {
		                    if (!IsConstructor(decorated))
		                        throw new TypeError();
		                    target = decorated;
		                }
		            }
		            return target;
		        }
		        function DecorateProperty(decorators, target, propertyKey, descriptor) {
		            for (var i = decorators.length - 1; i >= 0; --i) {
		                var decorator = decorators[i];
		                var decorated = decorator(target, propertyKey, descriptor);
		                if (!IsUndefined(decorated) && !IsNull(decorated)) {
		                    if (!IsObject(decorated))
		                        throw new TypeError();
		                    descriptor = decorated;
		                }
		            }
		            return descriptor;
		        }
		        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
		        function OrdinaryHasMetadata(MetadataKey, O, P) {
		            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
		            if (hasOwn)
		                return true;
		            var parent = OrdinaryGetPrototypeOf(O);
		            if (!IsNull(parent))
		                return OrdinaryHasMetadata(MetadataKey, parent, P);
		            return false;
		        }
		        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
		        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
		            var provider = GetMetadataProvider(O, P, /*Create*/ false);
		            if (IsUndefined(provider))
		                return false;
		            return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
		        }
		        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
		        function OrdinaryGetMetadata(MetadataKey, O, P) {
		            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
		            if (hasOwn)
		                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
		            var parent = OrdinaryGetPrototypeOf(O);
		            if (!IsNull(parent))
		                return OrdinaryGetMetadata(MetadataKey, parent, P);
		            return undefined;
		        }
		        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
		        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
		            var provider = GetMetadataProvider(O, P, /*Create*/ false);
		            if (IsUndefined(provider))
		                return;
		            return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
		        }
		        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
		        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
		            var provider = GetMetadataProvider(O, P, /*Create*/ true);
		            provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
		        }
		        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
		        function OrdinaryMetadataKeys(O, P) {
		            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
		            var parent = OrdinaryGetPrototypeOf(O);
		            if (parent === null)
		                return ownKeys;
		            var parentKeys = OrdinaryMetadataKeys(parent, P);
		            if (parentKeys.length <= 0)
		                return ownKeys;
		            if (ownKeys.length <= 0)
		                return parentKeys;
		            var set = new _Set();
		            var keys = [];
		            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
		                var key = ownKeys_1[_i];
		                var hasKey = set.has(key);
		                if (!hasKey) {
		                    set.add(key);
		                    keys.push(key);
		                }
		            }
		            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
		                var key = parentKeys_1[_a];
		                var hasKey = set.has(key);
		                if (!hasKey) {
		                    set.add(key);
		                    keys.push(key);
		                }
		            }
		            return keys;
		        }
		        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
		        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
		        function OrdinaryOwnMetadataKeys(O, P) {
		            var provider = GetMetadataProvider(O, P, /*create*/ false);
		            if (!provider) {
		                return [];
		            }
		            return provider.OrdinaryOwnMetadataKeys(O, P);
		        }
		        // 6 ECMAScript Data Types and Values
		        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
		        function Type(x) {
		            if (x === null)
		                return 1 /* Null */;
		            switch (typeof x) {
		                case "undefined": return 0 /* Undefined */;
		                case "boolean": return 2 /* Boolean */;
		                case "string": return 3 /* String */;
		                case "symbol": return 4 /* Symbol */;
		                case "number": return 5 /* Number */;
		                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
		                default: return 6 /* Object */;
		            }
		        }
		        // 6.1.1 The Undefined Type
		        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
		        function IsUndefined(x) {
		            return x === undefined;
		        }
		        // 6.1.2 The Null Type
		        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
		        function IsNull(x) {
		            return x === null;
		        }
		        // 6.1.5 The Symbol Type
		        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
		        function IsSymbol(x) {
		            return typeof x === "symbol";
		        }
		        // 6.1.7 The Object Type
		        // https://tc39.github.io/ecma262/#sec-object-type
		        function IsObject(x) {
		            return typeof x === "object" ? x !== null : typeof x === "function";
		        }
		        // 7.1 Type Conversion
		        // https://tc39.github.io/ecma262/#sec-type-conversion
		        // 7.1.1 ToPrimitive(input [, PreferredType])
		        // https://tc39.github.io/ecma262/#sec-toprimitive
		        function ToPrimitive(input, PreferredType) {
		            switch (Type(input)) {
		                case 0 /* Undefined */: return input;
		                case 1 /* Null */: return input;
		                case 2 /* Boolean */: return input;
		                case 3 /* String */: return input;
		                case 4 /* Symbol */: return input;
		                case 5 /* Number */: return input;
		            }
		            var hint = "string" ;
		            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
		            if (exoticToPrim !== undefined) {
		                var result = exoticToPrim.call(input, hint);
		                if (IsObject(result))
		                    throw new TypeError();
		                return result;
		            }
		            return OrdinaryToPrimitive(input);
		        }
		        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
		        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
		        function OrdinaryToPrimitive(O, hint) {
		            var valueOf, result; {
		                var toString_1 = O.toString;
		                if (IsCallable(toString_1)) {
		                    var result = toString_1.call(O);
		                    if (!IsObject(result))
		                        return result;
		                }
		                var valueOf = O.valueOf;
		                if (IsCallable(valueOf)) {
		                    var result = valueOf.call(O);
		                    if (!IsObject(result))
		                        return result;
		                }
		            }
		            throw new TypeError();
		        }
		        // 7.1.2 ToBoolean(argument)
		        // https://tc39.github.io/ecma262/2016/#sec-toboolean
		        function ToBoolean(argument) {
		            return !!argument;
		        }
		        // 7.1.12 ToString(argument)
		        // https://tc39.github.io/ecma262/#sec-tostring
		        function ToString(argument) {
		            return "" + argument;
		        }
		        // 7.1.14 ToPropertyKey(argument)
		        // https://tc39.github.io/ecma262/#sec-topropertykey
		        function ToPropertyKey(argument) {
		            var key = ToPrimitive(argument);
		            if (IsSymbol(key))
		                return key;
		            return ToString(key);
		        }
		        // 7.2 Testing and Comparison Operations
		        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
		        // 7.2.2 IsArray(argument)
		        // https://tc39.github.io/ecma262/#sec-isarray
		        function IsArray(argument) {
		            return Array.isArray
		                ? Array.isArray(argument)
		                : argument instanceof Object
		                    ? argument instanceof Array
		                    : Object.prototype.toString.call(argument) === "[object Array]";
		        }
		        // 7.2.3 IsCallable(argument)
		        // https://tc39.github.io/ecma262/#sec-iscallable
		        function IsCallable(argument) {
		            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
		            return typeof argument === "function";
		        }
		        // 7.2.4 IsConstructor(argument)
		        // https://tc39.github.io/ecma262/#sec-isconstructor
		        function IsConstructor(argument) {
		            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
		            return typeof argument === "function";
		        }
		        // 7.2.7 IsPropertyKey(argument)
		        // https://tc39.github.io/ecma262/#sec-ispropertykey
		        function IsPropertyKey(argument) {
		            switch (Type(argument)) {
		                case 3 /* String */: return true;
		                case 4 /* Symbol */: return true;
		                default: return false;
		            }
		        }
		        function SameValueZero(x, y) {
		            return x === y || x !== x && y !== y;
		        }
		        // 7.3 Operations on Objects
		        // https://tc39.github.io/ecma262/#sec-operations-on-objects
		        // 7.3.9 GetMethod(V, P)
		        // https://tc39.github.io/ecma262/#sec-getmethod
		        function GetMethod(V, P) {
		            var func = V[P];
		            if (func === undefined || func === null)
		                return undefined;
		            if (!IsCallable(func))
		                throw new TypeError();
		            return func;
		        }
		        // 7.4 Operations on Iterator Objects
		        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
		        function GetIterator(obj) {
		            var method = GetMethod(obj, iteratorSymbol);
		            if (!IsCallable(method))
		                throw new TypeError(); // from Call
		            var iterator = method.call(obj);
		            if (!IsObject(iterator))
		                throw new TypeError();
		            return iterator;
		        }
		        // 7.4.4 IteratorValue(iterResult)
		        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
		        function IteratorValue(iterResult) {
		            return iterResult.value;
		        }
		        // 7.4.5 IteratorStep(iterator)
		        // https://tc39.github.io/ecma262/#sec-iteratorstep
		        function IteratorStep(iterator) {
		            var result = iterator.next();
		            return result.done ? false : result;
		        }
		        // 7.4.6 IteratorClose(iterator, completion)
		        // https://tc39.github.io/ecma262/#sec-iteratorclose
		        function IteratorClose(iterator) {
		            var f = iterator["return"];
		            if (f)
		                f.call(iterator);
		        }
		        // 9.1 Ordinary Object Internal Methods and Internal Slots
		        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
		        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
		        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
		        function OrdinaryGetPrototypeOf(O) {
		            var proto = Object.getPrototypeOf(O);
		            if (typeof O !== "function" || O === functionPrototype)
		                return proto;
		            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
		            // Try to determine the superclass constructor. Compatible implementations
		            // must either set __proto__ on a subclass constructor to the superclass constructor,
		            // or ensure each class has a valid `constructor` property on its prototype that
		            // points back to the constructor.
		            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
		            // This is the case when in ES6 or when using __proto__ in a compatible browser.
		            if (proto !== functionPrototype)
		                return proto;
		            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
		            var prototype = O.prototype;
		            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
		            if (prototypeProto == null || prototypeProto === Object.prototype)
		                return proto;
		            // If the constructor was not a function, then we cannot determine the heritage.
		            var constructor = prototypeProto.constructor;
		            if (typeof constructor !== "function")
		                return proto;
		            // If we have some kind of self-reference, then we cannot determine the heritage.
		            if (constructor === O)
		                return proto;
		            // we have a pretty good guess at the heritage.
		            return constructor;
		        }
		        // Global metadata registry
		        // - Allows `import "reflect-metadata"` and `import "reflect-metadata/no-conflict"` to interoperate.
		        // - Uses isolated metadata if `Reflect` is frozen before the registry can be installed.
		        /**
		         * Creates a registry used to allow multiple `reflect-metadata` providers.
		         */
		        function CreateMetadataRegistry() {
		            var fallback;
		            if (!IsUndefined(registrySymbol) &&
		                typeof root.Reflect !== "undefined" &&
		                !(registrySymbol in root.Reflect) &&
		                typeof root.Reflect.defineMetadata === "function") {
		                // interoperate with older version of `reflect-metadata` that did not support a registry.
		                fallback = CreateFallbackProvider(root.Reflect);
		            }
		            var first;
		            var second;
		            var rest;
		            var targetProviderMap = new _WeakMap();
		            var registry = {
		                registerProvider: registerProvider,
		                getProvider: getProvider,
		                setProvider: setProvider,
		            };
		            return registry;
		            function registerProvider(provider) {
		                if (!Object.isExtensible(registry)) {
		                    throw new Error("Cannot add provider to a frozen registry.");
		                }
		                switch (true) {
		                    case fallback === provider: break;
		                    case IsUndefined(first):
		                        first = provider;
		                        break;
		                    case first === provider: break;
		                    case IsUndefined(second):
		                        second = provider;
		                        break;
		                    case second === provider: break;
		                    default:
		                        if (rest === undefined)
		                            rest = new _Set();
		                        rest.add(provider);
		                        break;
		                }
		            }
		            function getProviderNoCache(O, P) {
		                if (!IsUndefined(first)) {
		                    if (first.isProviderFor(O, P))
		                        return first;
		                    if (!IsUndefined(second)) {
		                        if (second.isProviderFor(O, P))
		                            return first;
		                        if (!IsUndefined(rest)) {
		                            var iterator = GetIterator(rest);
		                            while (true) {
		                                var next = IteratorStep(iterator);
		                                if (!next) {
		                                    return undefined;
		                                }
		                                var provider = IteratorValue(next);
		                                if (provider.isProviderFor(O, P)) {
		                                    IteratorClose(iterator);
		                                    return provider;
		                                }
		                            }
		                        }
		                    }
		                }
		                if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
		                    return fallback;
		                }
		                return undefined;
		            }
		            function getProvider(O, P) {
		                var providerMap = targetProviderMap.get(O);
		                var provider;
		                if (!IsUndefined(providerMap)) {
		                    provider = providerMap.get(P);
		                }
		                if (!IsUndefined(provider)) {
		                    return provider;
		                }
		                provider = getProviderNoCache(O, P);
		                if (!IsUndefined(provider)) {
		                    if (IsUndefined(providerMap)) {
		                        providerMap = new _Map();
		                        targetProviderMap.set(O, providerMap);
		                    }
		                    providerMap.set(P, provider);
		                }
		                return provider;
		            }
		            function hasProvider(provider) {
		                if (IsUndefined(provider))
		                    throw new TypeError();
		                return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
		            }
		            function setProvider(O, P, provider) {
		                if (!hasProvider(provider)) {
		                    throw new Error("Metadata provider not registered.");
		                }
		                var existingProvider = getProvider(O, P);
		                if (existingProvider !== provider) {
		                    if (!IsUndefined(existingProvider)) {
		                        return false;
		                    }
		                    var providerMap = targetProviderMap.get(O);
		                    if (IsUndefined(providerMap)) {
		                        providerMap = new _Map();
		                        targetProviderMap.set(O, providerMap);
		                    }
		                    providerMap.set(P, provider);
		                }
		                return true;
		            }
		        }
		        /**
		         * Gets or creates the shared registry of metadata providers.
		         */
		        function GetOrCreateMetadataRegistry() {
		            var metadataRegistry;
		            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
		                metadataRegistry = root.Reflect[registrySymbol];
		            }
		            if (IsUndefined(metadataRegistry)) {
		                metadataRegistry = CreateMetadataRegistry();
		            }
		            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
		                Object.defineProperty(root.Reflect, registrySymbol, {
		                    enumerable: false,
		                    configurable: false,
		                    writable: false,
		                    value: metadataRegistry
		                });
		            }
		            return metadataRegistry;
		        }
		        function CreateMetadataProvider(registry) {
		            // [[Metadata]] internal slot
		            // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
		            var metadata = new _WeakMap();
		            var provider = {
		                isProviderFor: function (O, P) {
		                    var targetMetadata = metadata.get(O);
		                    if (IsUndefined(targetMetadata))
		                        return false;
		                    return targetMetadata.has(P);
		                },
		                OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata,
		                OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata,
		                OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata,
		                OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys,
		                OrdinaryDeleteMetadata: OrdinaryDeleteMetadata,
		            };
		            metadataRegistry.registerProvider(provider);
		            return provider;
		            function GetOrCreateMetadataMap(O, P, Create) {
		                var targetMetadata = metadata.get(O);
		                var createdTargetMetadata = false;
		                if (IsUndefined(targetMetadata)) {
		                    if (!Create)
		                        return undefined;
		                    targetMetadata = new _Map();
		                    metadata.set(O, targetMetadata);
		                    createdTargetMetadata = true;
		                }
		                var metadataMap = targetMetadata.get(P);
		                if (IsUndefined(metadataMap)) {
		                    if (!Create)
		                        return undefined;
		                    metadataMap = new _Map();
		                    targetMetadata.set(P, metadataMap);
		                    if (!registry.setProvider(O, P, provider)) {
		                        targetMetadata.delete(P);
		                        if (createdTargetMetadata) {
		                            metadata.delete(O);
		                        }
		                        throw new Error("Wrong provider for target.");
		                    }
		                }
		                return metadataMap;
		            }
		            // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
		            // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
		            function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
		                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
		                if (IsUndefined(metadataMap))
		                    return false;
		                return ToBoolean(metadataMap.has(MetadataKey));
		            }
		            // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
		            // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
		            function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
		                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
		                if (IsUndefined(metadataMap))
		                    return undefined;
		                return metadataMap.get(MetadataKey);
		            }
		            // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
		            // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
		            function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
		                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
		                metadataMap.set(MetadataKey, MetadataValue);
		            }
		            // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
		            // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
		            function OrdinaryOwnMetadataKeys(O, P) {
		                var keys = [];
		                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
		                if (IsUndefined(metadataMap))
		                    return keys;
		                var keysObj = metadataMap.keys();
		                var iterator = GetIterator(keysObj);
		                var k = 0;
		                while (true) {
		                    var next = IteratorStep(iterator);
		                    if (!next) {
		                        keys.length = k;
		                        return keys;
		                    }
		                    var nextValue = IteratorValue(next);
		                    try {
		                        keys[k] = nextValue;
		                    }
		                    catch (e) {
		                        try {
		                            IteratorClose(iterator);
		                        }
		                        finally {
		                            throw e;
		                        }
		                    }
		                    k++;
		                }
		            }
		            function OrdinaryDeleteMetadata(MetadataKey, O, P) {
		                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
		                if (IsUndefined(metadataMap))
		                    return false;
		                if (!metadataMap.delete(MetadataKey))
		                    return false;
		                if (metadataMap.size === 0) {
		                    var targetMetadata = metadata.get(O);
		                    if (!IsUndefined(targetMetadata)) {
		                        targetMetadata.delete(P);
		                        if (targetMetadata.size === 0) {
		                            metadata.delete(targetMetadata);
		                        }
		                    }
		                }
		                return true;
		            }
		        }
		        function CreateFallbackProvider(reflect) {
		            var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
		            var metadataOwner = new _WeakMap();
		            var provider = {
		                isProviderFor: function (O, P) {
		                    var metadataPropertySet = metadataOwner.get(O);
		                    if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
		                        return true;
		                    }
		                    if (getOwnMetadataKeys(O, P).length) {
		                        if (IsUndefined(metadataPropertySet)) {
		                            metadataPropertySet = new _Set();
		                            metadataOwner.set(O, metadataPropertySet);
		                        }
		                        metadataPropertySet.add(P);
		                        return true;
		                    }
		                    return false;
		                },
		                OrdinaryDefineOwnMetadata: defineMetadata,
		                OrdinaryHasOwnMetadata: hasOwnMetadata,
		                OrdinaryGetOwnMetadata: getOwnMetadata,
		                OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
		                OrdinaryDeleteMetadata: deleteMetadata,
		            };
		            return provider;
		        }
		        /**
		         * Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
		         * then this module's metadata provider is assigned to the object.
		         */
		        function GetMetadataProvider(O, P, Create) {
		            var registeredProvider = metadataRegistry.getProvider(O, P);
		            if (!IsUndefined(registeredProvider)) {
		                return registeredProvider;
		            }
		            if (Create) {
		                if (metadataRegistry.setProvider(O, P, metadataProvider)) {
		                    return metadataProvider;
		                }
		                throw new Error("Illegal state.");
		            }
		            return undefined;
		        }
		        // naive Map shim
		        function CreateMapPolyfill() {
		            var cacheSentinel = {};
		            var arraySentinel = [];
		            var MapIterator = /** @class */ (function () {
		                function MapIterator(keys, values, selector) {
		                    this._index = 0;
		                    this._keys = keys;
		                    this._values = values;
		                    this._selector = selector;
		                }
		                MapIterator.prototype["@@iterator"] = function () { return this; };
		                MapIterator.prototype[iteratorSymbol] = function () { return this; };
		                MapIterator.prototype.next = function () {
		                    var index = this._index;
		                    if (index >= 0 && index < this._keys.length) {
		                        var result = this._selector(this._keys[index], this._values[index]);
		                        if (index + 1 >= this._keys.length) {
		                            this._index = -1;
		                            this._keys = arraySentinel;
		                            this._values = arraySentinel;
		                        }
		                        else {
		                            this._index++;
		                        }
		                        return { value: result, done: false };
		                    }
		                    return { value: undefined, done: true };
		                };
		                MapIterator.prototype.throw = function (error) {
		                    if (this._index >= 0) {
		                        this._index = -1;
		                        this._keys = arraySentinel;
		                        this._values = arraySentinel;
		                    }
		                    throw error;
		                };
		                MapIterator.prototype.return = function (value) {
		                    if (this._index >= 0) {
		                        this._index = -1;
		                        this._keys = arraySentinel;
		                        this._values = arraySentinel;
		                    }
		                    return { value: value, done: true };
		                };
		                return MapIterator;
		            }());
		            var Map = /** @class */ (function () {
		                function Map() {
		                    this._keys = [];
		                    this._values = [];
		                    this._cacheKey = cacheSentinel;
		                    this._cacheIndex = -2;
		                }
		                Object.defineProperty(Map.prototype, "size", {
		                    get: function () { return this._keys.length; },
		                    enumerable: true,
		                    configurable: true
		                });
		                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
		                Map.prototype.get = function (key) {
		                    var index = this._find(key, /*insert*/ false);
		                    return index >= 0 ? this._values[index] : undefined;
		                };
		                Map.prototype.set = function (key, value) {
		                    var index = this._find(key, /*insert*/ true);
		                    this._values[index] = value;
		                    return this;
		                };
		                Map.prototype.delete = function (key) {
		                    var index = this._find(key, /*insert*/ false);
		                    if (index >= 0) {
		                        var size = this._keys.length;
		                        for (var i = index + 1; i < size; i++) {
		                            this._keys[i - 1] = this._keys[i];
		                            this._values[i - 1] = this._values[i];
		                        }
		                        this._keys.length--;
		                        this._values.length--;
		                        if (SameValueZero(key, this._cacheKey)) {
		                            this._cacheKey = cacheSentinel;
		                            this._cacheIndex = -2;
		                        }
		                        return true;
		                    }
		                    return false;
		                };
		                Map.prototype.clear = function () {
		                    this._keys.length = 0;
		                    this._values.length = 0;
		                    this._cacheKey = cacheSentinel;
		                    this._cacheIndex = -2;
		                };
		                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
		                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
		                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
		                Map.prototype["@@iterator"] = function () { return this.entries(); };
		                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
		                Map.prototype._find = function (key, insert) {
		                    if (!SameValueZero(this._cacheKey, key)) {
		                        this._cacheIndex = -1;
		                        for (var i = 0; i < this._keys.length; i++) {
		                            if (SameValueZero(this._keys[i], key)) {
		                                this._cacheIndex = i;
		                                break;
		                            }
		                        }
		                    }
		                    if (this._cacheIndex < 0 && insert) {
		                        this._cacheIndex = this._keys.length;
		                        this._keys.push(key);
		                        this._values.push(undefined);
		                    }
		                    return this._cacheIndex;
		                };
		                return Map;
		            }());
		            return Map;
		            function getKey(key, _) {
		                return key;
		            }
		            function getValue(_, value) {
		                return value;
		            }
		            function getEntry(key, value) {
		                return [key, value];
		            }
		        }
		        // naive Set shim
		        function CreateSetPolyfill() {
		            var Set = /** @class */ (function () {
		                function Set() {
		                    this._map = new _Map();
		                }
		                Object.defineProperty(Set.prototype, "size", {
		                    get: function () { return this._map.size; },
		                    enumerable: true,
		                    configurable: true
		                });
		                Set.prototype.has = function (value) { return this._map.has(value); };
		                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
		                Set.prototype.delete = function (value) { return this._map.delete(value); };
		                Set.prototype.clear = function () { this._map.clear(); };
		                Set.prototype.keys = function () { return this._map.keys(); };
		                Set.prototype.values = function () { return this._map.keys(); };
		                Set.prototype.entries = function () { return this._map.entries(); };
		                Set.prototype["@@iterator"] = function () { return this.keys(); };
		                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
		                return Set;
		            }());
		            return Set;
		        }
		        // naive WeakMap shim
		        function CreateWeakMapPolyfill() {
		            var UUID_SIZE = 16;
		            var keys = HashMap.create();
		            var rootKey = CreateUniqueKey();
		            return /** @class */ (function () {
		                function WeakMap() {
		                    this._key = CreateUniqueKey();
		                }
		                WeakMap.prototype.has = function (target) {
		                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
		                    return table !== undefined ? HashMap.has(table, this._key) : false;
		                };
		                WeakMap.prototype.get = function (target) {
		                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
		                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
		                };
		                WeakMap.prototype.set = function (target, value) {
		                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
		                    table[this._key] = value;
		                    return this;
		                };
		                WeakMap.prototype.delete = function (target) {
		                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
		                    return table !== undefined ? delete table[this._key] : false;
		                };
		                WeakMap.prototype.clear = function () {
		                    // NOTE: not a real clear, just makes the previous data unreachable
		                    this._key = CreateUniqueKey();
		                };
		                return WeakMap;
		            }());
		            function CreateUniqueKey() {
		                var key;
		                do
		                    key = "@@WeakMap@@" + CreateUUID();
		                while (HashMap.has(keys, key));
		                keys[key] = true;
		                return key;
		            }
		            function GetOrCreateWeakMapTable(target, create) {
		                if (!hasOwn.call(target, rootKey)) {
		                    if (!create)
		                        return undefined;
		                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
		                }
		                return target[rootKey];
		            }
		            function FillRandomBytes(buffer, size) {
		                for (var i = 0; i < size; ++i)
		                    buffer[i] = Math.random() * 0xff | 0;
		                return buffer;
		            }
		            function GenRandomBytes(size) {
		                if (typeof Uint8Array === "function") {
		                    var array = new Uint8Array(size);
		                    if (typeof crypto !== "undefined") {
		                        crypto.getRandomValues(array);
		                    }
		                    else if (typeof msCrypto !== "undefined") {
		                        msCrypto.getRandomValues(array);
		                    }
		                    else {
		                        FillRandomBytes(array, size);
		                    }
		                    return array;
		                }
		                return FillRandomBytes(new Array(size), size);
		            }
		            function CreateUUID() {
		                var data = GenRandomBytes(UUID_SIZE);
		                // mark as random - RFC 4122 § 4.4
		                data[6] = data[6] & 0x4f | 0x40;
		                data[8] = data[8] & 0xbf | 0x80;
		                var result = "";
		                for (var offset = 0; offset < UUID_SIZE; ++offset) {
		                    var byte = data[offset];
		                    if (offset === 4 || offset === 6 || offset === 8)
		                        result += "-";
		                    if (byte < 16)
		                        result += "0";
		                    result += byte.toString(16).toLowerCase();
		                }
		                return result;
		            }
		        }
		        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
		        function MakeDictionary(obj) {
		            obj.__ = undefined;
		            delete obj.__;
		            return obj;
		        }
		    });
		})(Reflect || (Reflect = {}));
		return _Reflect;
	}

	require_Reflect();

	/******************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


	var __assign$1 = function() {
	    __assign$1 = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$1.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
	    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __spreadArray$1(to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	}

	typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
	    var e = new Error(message);
	    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};

	var dist = {};

	var constants = {};

	var paymentMethod = {};

	var hasRequiredPaymentMethod;

	function requirePaymentMethod () {
		if (hasRequiredPaymentMethod) return paymentMethod;
		hasRequiredPaymentMethod = 1;
		Object.defineProperty(paymentMethod, "__esModule", { value: true });
		paymentMethod.PaymentMethod = void 0;
		paymentMethod.PaymentMethod = {
		    BANK_TRANSFER: "OPM01",
		    CARD: "OPM02",
		    VIRTUAL_ACCOUNT: "OPM03",
		    REAL_TIME_TRANSFER: "OPM04",
		    PHONE_PAY: "OPM05",
		    FREE: "OPM06",
		    KAKAO_PAY: "OPM07",
		    NAVER_PAY: "OPM08",
		    TOSS_PAY: "OPM09",
		    SUBSCRIBE: "OPM10",
		    PAYCO: "OPM20",
		    SAMSUNG_PAY: "OPM21",
		    SANSUNG_PAY_CHECK: "OPM22",
		    SSG_PAY: "OPM23",
		    L_PAY: "OPM24",
		    KB_APP_CARD: "OPM25",
		    CHI_PAY: "OPM26",
		    T_MONEY_PAY: "OPM27",
		    PIN_PAY: "OPM28",
		    APPLE_PAY: "OPM29",
		    NAVER_PAY_ORDER: "OPM30",
		    PAYPAL: "OPM31",
		    EXIM_BAY: "OPM32",
		    JAPANESES_CONVENIENCE_STORE_PAY: "OPM34",
		    TALK_CHECK_OUT: "OPM33",
		    ETC: "OPM99",
		    PAYVERSE: "OPM35",
		    KAKAO_PAY_DIRECT: "OPM36",
		};
		return paymentMethod;
	}

	var cartAction = {};

	var hasRequiredCartAction;

	function requireCartAction () {
		if (hasRequiredCartAction) return cartAction;
		hasRequiredCartAction = 1;
		Object.defineProperty(cartAction, "__esModule", { value: true });
		cartAction.CartAction = void 0;
		cartAction.CartAction = {
		    ADD: "ADD",
		    DELETE: "DELETE",
		    UPDATE: "UPDATE",
		};
		return cartAction;
	}

	var currency = {};

	var hasRequiredCurrency;

	function requireCurrency () {
		if (hasRequiredCurrency) return currency;
		hasRequiredCurrency = 1;
		Object.defineProperty(currency, "__esModule", { value: true });
		currency.Currency = void 0;
		currency.Currency = {
		    KRW: "KRW",
		    USD: "USD",
		    AED: "AED",
		    AUD: "AUD",
		    CAD: "CAD",
		    CHF: "CHF",
		    CNY: "CNY",
		    CZK: "CZK",
		    DKK: "DKK",
		    EUR: "EUR",
		    GBP: "GBP",
		    HKD: "HKD",
		    HUF: "HUF",
		    ILS: "ILS",
		    JPY: "JPY",
		    MXN: "MXN",
		    MYR: "MYR",
		    NOK: "NOK",
		    NZD: "NZD",
		    PHP: "PHP",
		    PLN: "PLN",
		    RUB: "RUB",
		    SEK: "SEK",
		    SGD: "SGD",
		    THB: "THB",
		    TWD: "TWD",
		    VND: "VND",
		};
		return currency;
	}

	var eventCode = {};

	var hasRequiredEventCode;

	function requireEventCode () {
		if (hasRequiredEventCode) return eventCode;
		hasRequiredEventCode = 1;
		(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.eventTypeMap = exports.EventCode = void 0;
			exports.EventCode = {
			    PageView: "B0001",
			    Click: "B0002",
			    UtmInflow: "B0004",
			    Impression: "B0005",
			    Select: "B0006",
			    ProductImpression: "B0105",
			    LifecycleEvent: "B0010",
			    LifecycleOrder: "B0011",
			    LifecycleEventSessionStart: "B0012",
			    LifecycleEventSessionEnd: "B0013",
			    LifecycleEventScrollTop: "B0014",
			    LifecycleEventScrollBottom: "B0015",
			    LifecycleEventVisibilitychangeVisible: "B0016",
			    LifecycleEventVisibilitychangeHidden: "B0017",
			    LifecycleEventBeforunload: "B0018",
			    LifecycleEventPageHide: "B0019",
			    LifecycleEventSessionTimeout: "B0020",
			    LifecycleEventSeemoreClick: "B0021",
			    Signup: "B1001",
			    Login: "B1002",
			    UpdateCart: "B2001",
			    Order: "B2002",
			    CreateOrder: "B2003",
			    Payment: "B2004",
			    BoPageView: "B8001",
			    BoSignUp: "B8101",
			    BoUpdateUser: "B8102",
			    BoSignOut: "B8103",
			    AppActive: "B9501",
			    AppBoAccess: "B9701",
			};
			exports.eventTypeMap = Object.values(exports.EventCode).reduce((map, value) => {
			    map[value] = value;
			    return map;
			}, {}); 
		} (eventCode));
		return eventCode;
	}

	var operationSystem = {};

	var hasRequiredOperationSystem;

	function requireOperationSystem () {
		if (hasRequiredOperationSystem) return operationSystem;
		hasRequiredOperationSystem = 1;
		Object.defineProperty(operationSystem, "__esModule", { value: true });
		operationSystem.OperationSystem = void 0;
		operationSystem.OperationSystem = {
		    WINDOWS: "WINDOWS",
		    MACOS: "MACOS",
		    ANDROID: "ANDROID",
		    IOS: "IOS",
		    ETC: "ETC",
		};
		return operationSystem;
	}

	var orderStatus = {};

	var hasRequiredOrderStatus;

	function requireOrderStatus () {
		if (hasRequiredOrderStatus) return orderStatus;
		hasRequiredOrderStatus = 1;
		Object.defineProperty(orderStatus, "__esModule", { value: true });
		orderStatus.OrderStatus = void 0;
		orderStatus.OrderStatus = {
		    COMPLETED: "COMPLETED",
		    PENDING: "PENDING",
		};
		return orderStatus;
	}

	var platform = {};

	var hasRequiredPlatform;

	function requirePlatform () {
		if (hasRequiredPlatform) return platform;
		hasRequiredPlatform = 1;
		Object.defineProperty(platform, "__esModule", { value: true });
		platform.Platform = void 0;
		platform.Platform = {
		    DESKTOP: "DESKTOP",
		    MOBILE: "MOBILE",
		    TABLET: "TABLET",
		    BOT: "BOT",
		    ETC: "ETC",
		};
		return platform;
	}

	var socialSource = {};

	var hasRequiredSocialSource;

	function requireSocialSource () {
		if (hasRequiredSocialSource) return socialSource;
		hasRequiredSocialSource = 1;
		Object.defineProperty(socialSource, "__esModule", { value: true });
		socialSource.SocialSource = void 0;
		socialSource.SocialSource = {
		    KAKAO: "KAKAO",
		    NAVER: "NAVER",
		    FACEBOOK: "FACEBOOK",
		    GOOGLE: "GOOGLE",
		    EMAIL: "EMAIL",
		    LINE: "LINE",
		    INSTA: "INSTA",
		    APPLE: "APPLE",
		    LOCAL: "LOCAL",
		    ETC: "ETC",
		};
		return socialSource;
	}

	var hasRequiredConstants;

	function requireConstants () {
		if (hasRequiredConstants) return constants;
		hasRequiredConstants = 1;
		(function (exports) {
			var __createBinding = (constants && constants.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (constants && constants.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requirePaymentMethod(), exports);
			__exportStar(requireCartAction(), exports);
			__exportStar(requireCurrency(), exports);
			__exportStar(requireEventCode(), exports);
			__exportStar(requireOperationSystem(), exports);
			__exportStar(requireOrderStatus(), exports);
			__exportStar(requirePlatform(), exports);
			__exportStar(requireSocialSource(), exports); 
		} (constants));
		return constants;
	}

	var domains = {};

	var frontend = {};

	var clickEvent_dto = {};

	/**
	 * This metadata contains validation rules.
	 */
	var ValidationMetadata = /** @class */ (function () {
	    // -------------------------------------------------------------------------
	    // Constructor
	    // -------------------------------------------------------------------------
	    function ValidationMetadata(args) {
	        /**
	         * Validation groups used for this validation.
	         */
	        this.groups = [];
	        /**
	         * Specifies if validated value is an array and each of its item must be validated.
	         */
	        this.each = false;
	        /*
	         * A transient set of data passed through to the validation result for response mapping
	         */
	        this.context = undefined;
	        this.type = args.type;
	        this.name = args.name;
	        this.target = args.target;
	        this.propertyName = args.propertyName;
	        this.constraints = args === null || args === void 0 ? void 0 : args.constraints;
	        this.constraintCls = args.constraintCls;
	        this.validationTypeOptions = args.validationTypeOptions;
	        if (args.validationOptions) {
	            this.message = args.validationOptions.message;
	            this.groups = args.validationOptions.groups;
	            this.always = args.validationOptions.always;
	            this.each = args.validationOptions.each;
	            this.context = args.validationOptions.context;
	        }
	    }
	    return ValidationMetadata;
	}());

	/**
	 * Used to transform validation schemas to validation metadatas.
	 */
	var ValidationSchemaToMetadataTransformer = /** @class */ (function () {
	    function ValidationSchemaToMetadataTransformer() {
	    }
	    ValidationSchemaToMetadataTransformer.prototype.transform = function (schema) {
	        var metadatas = [];
	        Object.keys(schema.properties).forEach(function (property) {
	            schema.properties[property].forEach(function (validation) {
	                var validationOptions = {
	                    message: validation.message,
	                    groups: validation.groups,
	                    always: validation.always,
	                    each: validation.each,
	                };
	                var args = {
	                    type: validation.type,
	                    name: validation.name,
	                    target: schema.name,
	                    propertyName: property,
	                    constraints: validation.constraints,
	                    validationTypeOptions: validation.options,
	                    validationOptions: validationOptions,
	                };
	                metadatas.push(new ValidationMetadata(args));
	            });
	        });
	        return metadatas;
	    };
	    return ValidationSchemaToMetadataTransformer;
	}());

	/**
	 * This function returns the global object across Node and browsers.
	 *
	 * Note: `globalThis` is the standardized approach however it has been added to
	 * Node.js in version 12. We need to include this snippet until Node 12 EOL.
	 */
	function getGlobal() {
	    if (typeof globalThis !== 'undefined') {
	        return globalThis;
	    }
	    if (typeof global !== 'undefined') {
	        return global;
	    }
	    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	    // @ts-ignore: Cannot find name 'window'.
	    if (typeof window !== 'undefined') {
	        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	        // @ts-ignore: Cannot find name 'window'.
	        return window;
	    }
	    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	    // @ts-ignore: Cannot find name 'self'.
	    if (typeof self !== 'undefined') {
	        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	        // @ts-ignore: Cannot find name 'self'.
	        return self;
	    }
	}

	var __values = (window && window.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read$1 = (window && window.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (window && window.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	/**
	 * Storage all metadatas.
	 */
	var MetadataStorage$1 = /** @class */ (function () {
	    function MetadataStorage() {
	        // -------------------------------------------------------------------------
	        // Private properties
	        // -------------------------------------------------------------------------
	        this.validationMetadatas = new Map();
	        this.constraintMetadatas = new Map();
	    }
	    Object.defineProperty(MetadataStorage.prototype, "hasValidationMetaData", {
	        get: function () {
	            return !!this.validationMetadatas.size;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    // -------------------------------------------------------------------------
	    // Public Methods
	    // -------------------------------------------------------------------------
	    /**
	     * Adds a new validation metadata.
	     */
	    MetadataStorage.prototype.addValidationSchema = function (schema) {
	        var _this = this;
	        var validationMetadatas = new ValidationSchemaToMetadataTransformer().transform(schema);
	        validationMetadatas.forEach(function (validationMetadata) { return _this.addValidationMetadata(validationMetadata); });
	    };
	    /**
	     * Adds a new validation metadata.
	     */
	    MetadataStorage.prototype.addValidationMetadata = function (metadata) {
	        var existingMetadata = this.validationMetadatas.get(metadata.target);
	        if (existingMetadata) {
	            existingMetadata.push(metadata);
	        }
	        else {
	            this.validationMetadatas.set(metadata.target, [metadata]);
	        }
	    };
	    /**
	     * Adds a new constraint metadata.
	     */
	    MetadataStorage.prototype.addConstraintMetadata = function (metadata) {
	        var existingMetadata = this.constraintMetadatas.get(metadata.target);
	        if (existingMetadata) {
	            existingMetadata.push(metadata);
	        }
	        else {
	            this.constraintMetadatas.set(metadata.target, [metadata]);
	        }
	    };
	    /**
	     * Groups metadata by their property names.
	     */
	    MetadataStorage.prototype.groupByPropertyName = function (metadata) {
	        var grouped = {};
	        metadata.forEach(function (metadata) {
	            if (!grouped[metadata.propertyName])
	                grouped[metadata.propertyName] = [];
	            grouped[metadata.propertyName].push(metadata);
	        });
	        return grouped;
	    };
	    /**
	     * Gets all validation metadatas for the given object with the given groups.
	     */
	    MetadataStorage.prototype.getTargetValidationMetadatas = function (targetConstructor, targetSchema, always, strictGroups, groups) {
	        var e_1, _a;
	        var includeMetadataBecauseOfAlwaysOption = function (metadata) {
	            // `metadata.always` overrides global default.
	            if (typeof metadata.always !== 'undefined')
	                return metadata.always;
	            // `metadata.groups` overrides global default.
	            if (metadata.groups && metadata.groups.length)
	                return false;
	            // Use global default.
	            return always;
	        };
	        var excludeMetadataBecauseOfStrictGroupsOption = function (metadata) {
	            if (strictGroups) {
	                // Validation is not using groups.
	                if (!groups || !groups.length) {
	                    // `metadata.groups` has at least one group.
	                    if (metadata.groups && metadata.groups.length)
	                        return true;
	                }
	            }
	            return false;
	        };
	        // get directly related to a target metadatas
	        var filteredForOriginalMetadatasSearch = this.validationMetadatas.get(targetConstructor) || [];
	        var originalMetadatas = filteredForOriginalMetadatasSearch.filter(function (metadata) {
	            if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
	                return false;
	            if (includeMetadataBecauseOfAlwaysOption(metadata))
	                return true;
	            if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
	                return false;
	            if (groups && groups.length > 0)
	                return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
	            return true;
	        });
	        // get metadatas for inherited classes
	        var filteredForInheritedMetadatasSearch = [];
	        try {
	            for (var _b = __values(this.validationMetadatas.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var _d = __read$1(_c.value, 2), key = _d[0], value = _d[1];
	                if (targetConstructor.prototype instanceof key) {
	                    filteredForInheritedMetadatasSearch.push.apply(filteredForInheritedMetadatasSearch, __spreadArray([], __read$1(value), false));
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        var inheritedMetadatas = filteredForInheritedMetadatasSearch.filter(function (metadata) {
	            // if target is a string it's means we validate against a schema, and there is no inheritance support for schemas
	            if (typeof metadata.target === 'string')
	                return false;
	            if (metadata.target === targetConstructor)
	                return false;
	            if (metadata.target instanceof Function && !(targetConstructor.prototype instanceof metadata.target))
	                return false;
	            if (includeMetadataBecauseOfAlwaysOption(metadata))
	                return true;
	            if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
	                return false;
	            if (groups && groups.length > 0)
	                return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
	            return true;
	        });
	        // filter out duplicate metadatas, prefer original metadatas instead of inherited metadatas
	        var uniqueInheritedMetadatas = inheritedMetadatas.filter(function (inheritedMetadata) {
	            return !originalMetadatas.find(function (originalMetadata) {
	                return (originalMetadata.propertyName === inheritedMetadata.propertyName &&
	                    originalMetadata.type === inheritedMetadata.type);
	            });
	        });
	        return originalMetadatas.concat(uniqueInheritedMetadatas);
	    };
	    /**
	     * Gets all validator constraints for the given object.
	     */
	    MetadataStorage.prototype.getTargetValidatorConstraints = function (target) {
	        return this.constraintMetadatas.get(target) || [];
	    };
	    return MetadataStorage;
	}());
	/**
	 * Gets metadata storage.
	 * Metadata storage follows the best practices and stores metadata in a global variable.
	 */
	function getMetadataStorage() {
	    var global = getGlobal();
	    if (!global.classValidatorMetadataStorage) {
	        global.classValidatorMetadataStorage = new MetadataStorage$1();
	    }
	    return global.classValidatorMetadataStorage;
	}

	/**
	 * Validation types.
	 */
	var ValidationTypes = /** @class */ (function () {
	    function ValidationTypes() {
	    }
	    /**
	     * Checks if validation type is valid.
	     */
	    ValidationTypes.isValid = function (type) {
	        var _this = this;
	        return (type !== 'isValid' &&
	            type !== 'getMessage' &&
	            Object.keys(this)
	                .map(function (key) { return _this[key]; })
	                .indexOf(type) !== -1);
	    };
	    /* system */
	    ValidationTypes.CUSTOM_VALIDATION = 'customValidation'; // done
	    ValidationTypes.NESTED_VALIDATION = 'nestedValidation'; // done
	    ValidationTypes.PROMISE_VALIDATION = 'promiseValidation'; // done
	    ValidationTypes.CONDITIONAL_VALIDATION = 'conditionalValidation'; // done
	    ValidationTypes.WHITELIST = 'whitelistValidation'; // done
	    ValidationTypes.IS_DEFINED = 'isDefined'; // done
	    return ValidationTypes;
	}());

	/**
	 * Container to be used by this library for inversion control. If container was not implicitly set then by default
	 * container simply creates a new instance of the given class.
	 */
	var defaultContainer = new (/** @class */ (function () {
	    function class_1() {
	        this.instances = [];
	    }
	    class_1.prototype.get = function (someClass) {
	        var instance = this.instances.find(function (instance) { return instance.type === someClass; });
	        if (!instance) {
	            instance = { type: someClass, object: new someClass() };
	            this.instances.push(instance);
	        }
	        return instance.object;
	    };
	    return class_1;
	}()))();
	/**
	 * Gets the IOC container used by this library.
	 */
	function getFromContainer(someClass) {
	    return defaultContainer.get(someClass);
	}

	/**
	 * This metadata interface contains information for custom validators.
	 */
	var ConstraintMetadata = /** @class */ (function () {
	    // -------------------------------------------------------------------------
	    // Constructor
	    // -------------------------------------------------------------------------
	    function ConstraintMetadata(target, name, async) {
	        if (async === void 0) { async = false; }
	        this.target = target;
	        this.name = name;
	        this.async = async;
	    }
	    Object.defineProperty(ConstraintMetadata.prototype, "instance", {
	        // -------------------------------------------------------------------------
	        // Accessors
	        // -------------------------------------------------------------------------
	        /**
	         * Instance of the target custom validation class which performs validation.
	         */
	        get: function () {
	            return getFromContainer(this.target);
	        },
	        enumerable: false,
	        configurable: true
	    });
	    return ConstraintMetadata;
	}());

	/**
	 * Registers a custom validation decorator.
	 */
	function registerDecorator(options) {
	    var constraintCls;
	    if (options.validator instanceof Function) {
	        constraintCls = options.validator;
	        var constraintClasses = getFromContainer(MetadataStorage$1).getTargetValidatorConstraints(options.validator);
	        if (constraintClasses.length > 1) {
	            throw "More than one implementation of ValidatorConstraintInterface found for validator on: ".concat(options.target.name, ":").concat(options.propertyName);
	        }
	    }
	    else {
	        var validator_1 = options.validator;
	        constraintCls = /** @class */ (function () {
	            function CustomConstraint() {
	            }
	            CustomConstraint.prototype.validate = function (value, validationArguments) {
	                return validator_1.validate(value, validationArguments);
	            };
	            CustomConstraint.prototype.defaultMessage = function (validationArguments) {
	                if (validator_1.defaultMessage) {
	                    return validator_1.defaultMessage(validationArguments);
	                }
	                return '';
	            };
	            return CustomConstraint;
	        }());
	        getMetadataStorage().addConstraintMetadata(new ConstraintMetadata(constraintCls, options.name, options.async));
	    }
	    var validationMetadataArgs = {
	        type: options.name && ValidationTypes.isValid(options.name) ? options.name : ValidationTypes.CUSTOM_VALIDATION,
	        name: options.name,
	        target: options.target,
	        propertyName: options.propertyName,
	        validationOptions: options.options,
	        constraintCls: constraintCls,
	        constraints: options.constraints,
	    };
	    getMetadataStorage().addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
	}

	function buildMessage(impl, validationOptions) {
	    return function (validationArguments) {
	        var eachPrefix = validationOptions && validationOptions.each ? 'each value in ' : '';
	        return impl(eachPrefix, validationArguments);
	    };
	}
	function ValidateBy(options, validationOptions) {
	    return function (object, propertyName) {
	        registerDecorator({
	            name: options.name,
	            target: object.constructor,
	            propertyName: propertyName,
	            options: validationOptions,
	            constraints: options.constraints,
	            validator: options.validator,
	        });
	    };
	}

	var IS_OPTIONAL = 'isOptional';
	/**
	 * Checks if value is missing and if so, ignores all validators.
	 */
	function IsOptional(validationOptions) {
	    return function (object, propertyName) {
	        var args = {
	            type: ValidationTypes.CONDITIONAL_VALIDATION,
	            name: IS_OPTIONAL,
	            target: object.constructor,
	            propertyName: propertyName,
	            constraints: [
	                function (object, value) {
	                    return object[propertyName] !== null && object[propertyName] !== undefined;
	                },
	            ],
	            validationOptions: validationOptions,
	        };
	        getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
	    };
	}

	/**
	 * Ignores the other validators on a property when the provided condition function returns false.
	 */
	function ValidateIf(condition, validationOptions) {
	    return function (object, propertyName) {
	        var args = {
	            type: ValidationTypes.CONDITIONAL_VALIDATION,
	            target: object.constructor,
	            propertyName: propertyName,
	            constraints: [condition],
	            validationOptions: validationOptions,
	        };
	        getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
	    };
	}

	var __assign = (window && window.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	/**
	 * Objects / object arrays marked with this decorator will also be validated.
	 */
	function ValidateNested(validationOptions) {
	    var opts = __assign({}, validationOptions);
	    var eachPrefix = opts.each ? 'each value in ' : '';
	    opts.message = opts.message || eachPrefix + 'nested property $property must be either object or array';
	    return function (object, propertyName) {
	        var args = {
	            type: ValidationTypes.NESTED_VALIDATION,
	            target: object.constructor,
	            propertyName: propertyName,
	            validationOptions: opts,
	        };
	        getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
	    };
	}

	var IS_NOT_EMPTY = 'isNotEmpty';
	/**
	 * Checks if given value is not empty (!== '', !== null, !== undefined).
	 */
	function isNotEmpty(value) {
	    return value !== '' && value !== null && value !== undefined;
	}
	/**
	 * Checks if given value is not empty (!== '', !== null, !== undefined).
	 */
	function IsNotEmpty(validationOptions) {
	    return ValidateBy({
	        name: IS_NOT_EMPTY,
	        validator: {
	            validate: function (value, args) { return isNotEmpty(value); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property should not be empty'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var MIN = 'min';
	/**
	 * Checks if the first number is greater than or equal to the second.
	 */
	function min(num, min) {
	    return typeof num === 'number' && typeof min === 'number' && num >= min;
	}
	/**
	 * Checks if the value is greater than or equal to the allowed minimum value.
	 */
	function Min(minValue, validationOptions) {
	    return ValidateBy({
	        name: MIN,
	        constraints: [minValue],
	        validator: {
	            validate: function (value, args) { return min(value, args === null || args === void 0 ? void 0 : args.constraints[0]); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must not be less than $constraint1'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var IS_BOOLEAN = 'isBoolean';
	/**
	 * Checks if a given value is a boolean.
	 */
	function isBoolean(value) {
	    return value instanceof Boolean || typeof value === 'boolean';
	}
	/**
	 * Checks if a value is a boolean.
	 */
	function IsBoolean(validationOptions) {
	    return ValidateBy({
	        name: IS_BOOLEAN,
	        validator: {
	            validate: function (value, args) { return isBoolean(value); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a boolean value'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var IS_DATE = 'isDate';
	/**
	 * Checks if a given value is a date.
	 */
	function isDate(value) {
	    return value instanceof Date && !isNaN(value.getTime());
	}
	/**
	 * Checks if a value is a date.
	 */
	function IsDate(validationOptions) {
	    return ValidateBy({
	        name: IS_DATE,
	        validator: {
	            validate: function (value, args) { return isDate(value); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a Date instance'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var IS_NUMBER = 'isNumber';
	/**
	 * Checks if a given value is a number.
	 */
	function isNumber(value, options) {
	    if (options === void 0) { options = {}; }
	    if (typeof value !== 'number') {
	        return false;
	    }
	    if (value === Infinity || value === -Infinity) {
	        return !!options.allowInfinity;
	    }
	    if (Number.isNaN(value)) {
	        return !!options.allowNaN;
	    }
	    if (options.maxDecimalPlaces !== undefined) {
	        var decimalPlaces = 0;
	        if (value % 1 !== 0) {
	            decimalPlaces = value.toString().split('.')[1].length;
	        }
	        if (decimalPlaces > options.maxDecimalPlaces) {
	            return false;
	        }
	    }
	    return Number.isFinite(value);
	}
	/**
	 * Checks if a value is a number.
	 */
	function IsNumber(options, validationOptions) {
	    if (options === void 0) { options = {}; }
	    return ValidateBy({
	        name: IS_NUMBER,
	        constraints: [options],
	        validator: {
	            validate: function (value, args) { return isNumber(value, args === null || args === void 0 ? void 0 : args.constraints[0]); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a number conforming to the specified constraints'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var __read = (window && window.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var IS_ENUM = 'isEnum';
	/**
	 * Checks if a given value is the member of the provided enum.
	 */
	function isEnum(value, entity) {
	    var enumValues = Object.keys(entity).map(function (k) { return entity[k]; });
	    return enumValues.includes(value);
	}
	/**
	 * Returns the possible values from an enum (both simple number indexed and string indexed enums).
	 */
	function validEnumValues(entity) {
	    return Object.entries(entity)
	        .filter(function (_a) {
	        var _b = __read(_a, 2), key = _b[0]; _b[1];
	        return isNaN(parseInt(key));
	    })
	        .map(function (_a) {
	        var _b = __read(_a, 2); _b[0]; var value = _b[1];
	        return value;
	    });
	}
	/**
	 * Checks if a given value is the member of the provided enum.
	 */
	function IsEnum(entity, validationOptions) {
	    return ValidateBy({
	        name: IS_ENUM,
	        constraints: [entity, validEnumValues(entity)],
	        validator: {
	            validate: function (value, args) { return isEnum(value, args === null || args === void 0 ? void 0 : args.constraints[0]); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be one of the following values: $constraint2'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var IS_STRING = 'isString';
	/**
	 * Checks if a given value is a real string.
	 */
	function isString(value) {
	    return value instanceof String || typeof value === 'string';
	}
	/**
	 * Checks if a given value is a real string.
	 */
	function IsString(validationOptions) {
	    return ValidateBy({
	        name: IS_STRING,
	        validator: {
	            validate: function (value, args) { return isString(value); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a string'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var IS_ARRAY = 'isArray';
	/**
	 * Checks if a given value is an array
	 */
	function isArray(value) {
	    return Array.isArray(value);
	}
	/**
	 * Checks if a given value is an array
	 */
	function IsArray(validationOptions) {
	    return ValidateBy({
	        name: IS_ARRAY,
	        validator: {
	            validate: function (value, args) { return isArray(value); },
	            defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be an array'; }, validationOptions),
	        },
	    }, validationOptions);
	}

	var esm5$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		IS_ARRAY: IS_ARRAY,
		IS_BOOLEAN: IS_BOOLEAN,
		IS_DATE: IS_DATE,
		IS_ENUM: IS_ENUM,
		IS_NOT_EMPTY: IS_NOT_EMPTY,
		IS_NUMBER: IS_NUMBER,
		IS_OPTIONAL: IS_OPTIONAL,
		IS_STRING: IS_STRING,
		IsArray: IsArray,
		IsBoolean: IsBoolean,
		IsDate: IsDate,
		IsEnum: IsEnum,
		IsNotEmpty: IsNotEmpty,
		IsNumber: IsNumber,
		IsOptional: IsOptional,
		IsString: IsString,
		MIN: MIN,
		MetadataStorage: MetadataStorage$1,
		Min: Min,
		ValidateBy: ValidateBy,
		ValidateIf: ValidateIf,
		ValidateNested: ValidateNested,
		ValidationTypes: ValidationTypes,
		buildMessage: buildMessage,
		getFromContainer: getFromContainer,
		getMetadataStorage: getMetadataStorage,
		isArray: isArray,
		isBoolean: isBoolean,
		isDate: isDate,
		isEnum: isEnum,
		isNotEmpty: isNotEmpty,
		isNumber: isNumber,
		isString: isString,
		min: min,
		registerDecorator: registerDecorator
	});

	var frontendBaseEvent_dto = {};

	var TransformationType;
	(function (TransformationType) {
	    TransformationType[TransformationType["PLAIN_TO_CLASS"] = 0] = "PLAIN_TO_CLASS";
	    TransformationType[TransformationType["CLASS_TO_PLAIN"] = 1] = "CLASS_TO_PLAIN";
	    TransformationType[TransformationType["CLASS_TO_CLASS"] = 2] = "CLASS_TO_CLASS";
	})(TransformationType || (TransformationType = {}));

	/**
	 * Storage all library metadata.
	 */
	var MetadataStorage = /** @class */ (function () {
	    function MetadataStorage() {
	        // -------------------------------------------------------------------------
	        // Properties
	        // -------------------------------------------------------------------------
	        this._typeMetadatas = new Map();
	        this._transformMetadatas = new Map();
	        this._exposeMetadatas = new Map();
	        this._excludeMetadatas = new Map();
	        this._ancestorsMap = new Map();
	    }
	    // -------------------------------------------------------------------------
	    // Adder Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.addTypeMetadata = function (metadata) {
	        if (!this._typeMetadatas.has(metadata.target)) {
	            this._typeMetadatas.set(metadata.target, new Map());
	        }
	        this._typeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    MetadataStorage.prototype.addTransformMetadata = function (metadata) {
	        if (!this._transformMetadatas.has(metadata.target)) {
	            this._transformMetadatas.set(metadata.target, new Map());
	        }
	        if (!this._transformMetadatas.get(metadata.target).has(metadata.propertyName)) {
	            this._transformMetadatas.get(metadata.target).set(metadata.propertyName, []);
	        }
	        this._transformMetadatas.get(metadata.target).get(metadata.propertyName).push(metadata);
	    };
	    MetadataStorage.prototype.addExposeMetadata = function (metadata) {
	        if (!this._exposeMetadatas.has(metadata.target)) {
	            this._exposeMetadatas.set(metadata.target, new Map());
	        }
	        this._exposeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    MetadataStorage.prototype.addExcludeMetadata = function (metadata) {
	        if (!this._excludeMetadatas.has(metadata.target)) {
	            this._excludeMetadatas.set(metadata.target, new Map());
	        }
	        this._excludeMetadatas.get(metadata.target).set(metadata.propertyName, metadata);
	    };
	    // -------------------------------------------------------------------------
	    // Public Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.findTransformMetadatas = function (target, propertyName, transformationType) {
	        return this.findMetadatas(this._transformMetadatas, target, propertyName).filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        });
	    };
	    MetadataStorage.prototype.findExcludeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._excludeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.findExposeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._exposeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.findExposeMetadataByCustomName = function (target, name) {
	        return this.getExposedMetadatas(target).find(function (metadata) {
	            return metadata.options && metadata.options.name === name;
	        });
	    };
	    MetadataStorage.prototype.findTypeMetadata = function (target, propertyName) {
	        return this.findMetadata(this._typeMetadatas, target, propertyName);
	    };
	    MetadataStorage.prototype.getStrategy = function (target) {
	        var excludeMap = this._excludeMetadatas.get(target);
	        var exclude = excludeMap && excludeMap.get(undefined);
	        var exposeMap = this._exposeMetadatas.get(target);
	        var expose = exposeMap && exposeMap.get(undefined);
	        if ((exclude && expose) || (!exclude && !expose))
	            return 'none';
	        return exclude ? 'excludeAll' : 'exposeAll';
	    };
	    MetadataStorage.prototype.getExposedMetadatas = function (target) {
	        return this.getMetadata(this._exposeMetadatas, target);
	    };
	    MetadataStorage.prototype.getExcludedMetadatas = function (target) {
	        return this.getMetadata(this._excludeMetadatas, target);
	    };
	    MetadataStorage.prototype.getExposedProperties = function (target, transformationType) {
	        return this.getExposedMetadatas(target)
	            .filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        })
	            .map(function (metadata) { return metadata.propertyName; });
	    };
	    MetadataStorage.prototype.getExcludedProperties = function (target, transformationType) {
	        return this.getExcludedMetadatas(target)
	            .filter(function (metadata) {
	            if (!metadata.options)
	                return true;
	            if (metadata.options.toClassOnly === true && metadata.options.toPlainOnly === true)
	                return true;
	            if (metadata.options.toClassOnly === true) {
	                return (transformationType === TransformationType.CLASS_TO_CLASS ||
	                    transformationType === TransformationType.PLAIN_TO_CLASS);
	            }
	            if (metadata.options.toPlainOnly === true) {
	                return transformationType === TransformationType.CLASS_TO_PLAIN;
	            }
	            return true;
	        })
	            .map(function (metadata) { return metadata.propertyName; });
	    };
	    MetadataStorage.prototype.clear = function () {
	        this._typeMetadatas.clear();
	        this._exposeMetadatas.clear();
	        this._excludeMetadatas.clear();
	        this._ancestorsMap.clear();
	    };
	    // -------------------------------------------------------------------------
	    // Private Methods
	    // -------------------------------------------------------------------------
	    MetadataStorage.prototype.getMetadata = function (metadatas, target) {
	        var metadataFromTargetMap = metadatas.get(target);
	        var metadataFromTarget;
	        if (metadataFromTargetMap) {
	            metadataFromTarget = Array.from(metadataFromTargetMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
	        }
	        var metadataFromAncestors = [];
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                var metadataFromAncestor = Array.from(ancestorMetadataMap.values()).filter(function (meta) { return meta.propertyName !== undefined; });
	                metadataFromAncestors.push.apply(metadataFromAncestors, metadataFromAncestor);
	            }
	        }
	        return metadataFromAncestors.concat(metadataFromTarget || []);
	    };
	    MetadataStorage.prototype.findMetadata = function (metadatas, target, propertyName) {
	        var metadataFromTargetMap = metadatas.get(target);
	        if (metadataFromTargetMap) {
	            var metadataFromTarget = metadataFromTargetMap.get(propertyName);
	            if (metadataFromTarget) {
	                return metadataFromTarget;
	            }
	        }
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                var ancestorResult = ancestorMetadataMap.get(propertyName);
	                if (ancestorResult) {
	                    return ancestorResult;
	                }
	            }
	        }
	        return undefined;
	    };
	    MetadataStorage.prototype.findMetadatas = function (metadatas, target, propertyName) {
	        var metadataFromTargetMap = metadatas.get(target);
	        var metadataFromTarget;
	        if (metadataFromTargetMap) {
	            metadataFromTarget = metadataFromTargetMap.get(propertyName);
	        }
	        var metadataFromAncestorsTarget = [];
	        for (var _i = 0, _a = this.getAncestors(target); _i < _a.length; _i++) {
	            var ancestor = _a[_i];
	            var ancestorMetadataMap = metadatas.get(ancestor);
	            if (ancestorMetadataMap) {
	                if (ancestorMetadataMap.has(propertyName)) {
	                    metadataFromAncestorsTarget.push.apply(metadataFromAncestorsTarget, ancestorMetadataMap.get(propertyName));
	                }
	            }
	        }
	        return metadataFromAncestorsTarget
	            .slice()
	            .reverse()
	            .concat((metadataFromTarget || []).slice().reverse());
	    };
	    MetadataStorage.prototype.getAncestors = function (target) {
	        if (!target)
	            return [];
	        if (!this._ancestorsMap.has(target)) {
	            var ancestors = [];
	            for (var baseClass = Object.getPrototypeOf(target.prototype.constructor); typeof baseClass.prototype !== 'undefined'; baseClass = Object.getPrototypeOf(baseClass.prototype.constructor)) {
	                ancestors.push(baseClass);
	            }
	            this._ancestorsMap.set(target, ancestors);
	        }
	        return this._ancestorsMap.get(target);
	    };
	    return MetadataStorage;
	}());

	/**
	 * Default metadata storage is used as singleton and can be used to storage all metadatas.
	 */
	var defaultMetadataStorage = new MetadataStorage();

	/**
	 * Marks the given class or property as included. By default the property is included in both
	 * constructorToPlain and plainToConstructor transformations. It can be limited to only one direction
	 * via using the `toPlainOnly` or `toClassOnly` option.
	 *
	 * Can be applied to class definitions and properties.
	 */
	function Expose(options) {
	    if (options === void 0) { options = {}; }
	    /**
	     * NOTE: The `propertyName` property must be marked as optional because
	     * this decorator used both as a class and a property decorator and the
	     * Typescript compiler will freak out if we make it mandatory as a class
	     * decorator only receives one parameter.
	     */
	    return function (object, propertyName) {
	        defaultMetadataStorage.addExposeMetadata({
	            target: object instanceof Function ? object : object.constructor,
	            propertyName: propertyName,
	            options: options,
	        });
	    };
	}

	/**
	 * Specifies a type of the property.
	 * The given TypeFunction can return a constructor. A discriminator can be given in the options.
	 *
	 * Can be applied to properties only.
	 */
	function Type(typeFunction, options) {
	    if (options === void 0) { options = {}; }
	    return function (target, propertyName) {
	        var reflectedType = Reflect.getMetadata('design:type', target, propertyName);
	        defaultMetadataStorage.addTypeMetadata({
	            target: target.constructor,
	            propertyName: propertyName,
	            reflectedType: reflectedType,
	            typeFunction: typeFunction,
	            options: options,
	        });
	    };
	}

	var esm5 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Expose: Expose,
		get TransformationType () { return TransformationType; },
		Type: Type
	});

	var baseEvent_dto = {};

	var hasRequiredBaseEvent_dto;

	function requireBaseEvent_dto () {
		if (hasRequiredBaseEvent_dto) return baseEvent_dto;
		hasRequiredBaseEvent_dto = 1;
		var __decorate = (baseEvent_dto && baseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (baseEvent_dto && baseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(baseEvent_dto, "__esModule", { value: true });
		baseEvent_dto.BaseEvent = void 0;
		const class_transformer_1 = esm5;
		const event_code_1 = requireEventCode();
		const class_validator_1 = esm5$1;
		const constants_1 = requireConstants();
		class BaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 sessionId 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "sessionId", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 siteCode 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "siteCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 unitCode 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "unitCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(event_code_1.EventCode, { message: "적절하지 않은 eventType 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "eventType", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 trigger 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "trigger", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 ownership 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "ownership", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 memberCode 입니다." }),
		    (0, class_validator_1.IsOptional)(),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "memberCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 deviceId 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "deviceId", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    __metadata("design:type", Date)
		], BaseEvent.prototype, "timestamp", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "properties", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmLandingUrl 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmLandingUrl", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmCampaign 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmCampaign", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmContent 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmContent", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmMedium 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmMedium", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmSource 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmSource", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 utmTerm 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    __metadata("design:type", Object)
		], BaseEvent.prototype, "utmTerm", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsDate)({ message: "적절하지 않은 utmUpdatedTime 입니다." }),
		    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
		    (0, class_transformer_1.Type)(() => Date),
		    __metadata("design:type", Date)
		], BaseEvent.prototype, "utmUpdatedTime", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 initialReferrer 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "initialReferrer", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 initialReferrerDomain 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "initialReferrerDomain", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsEnum)(constants_1.Platform, { message: "적절하지 않은 platform 입니다." }),
		    __metadata("design:type", String)
		], BaseEvent.prototype, "platform", void 0);
		baseEvent_dto.BaseEvent = BaseEvent;
		return baseEvent_dto;
	}

	var hasRequiredFrontendBaseEvent_dto;

	function requireFrontendBaseEvent_dto () {
		if (hasRequiredFrontendBaseEvent_dto) return frontendBaseEvent_dto;
		hasRequiredFrontendBaseEvent_dto = 1;
		var __decorate = (frontendBaseEvent_dto && frontendBaseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (frontendBaseEvent_dto && frontendBaseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(frontendBaseEvent_dto, "__esModule", { value: true });
		frontendBaseEvent_dto.FrontendBaseEvent = void 0;
		const class_validator_1 = esm5$1;
		const class_transformer_1 = esm5;
		const base_event_dto_1 = requireBaseEvent_dto();
		const constants_1 = requireConstants();
		class FrontendBaseEvent extends base_event_dto_1.BaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 ip 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "ip", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsEnum)(constants_1.OperationSystem, { message: "적절하지 않은 os 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "os", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 browserVersion 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "browserVersion", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 browserName 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "browserName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 userAgent 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "userAgent", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 language 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "language", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 eventId 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "eventId", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 currentUrl 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "currentUrl", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 path 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "path", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 pageTitle 입니다." }),
		    __metadata("design:type", String)
		], FrontendBaseEvent.prototype, "pageTitle", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_transformer_1.Type)(() => Date),
		    __metadata("design:type", Date)
		], FrontendBaseEvent.prototype, "clientTimestamp", void 0);
		frontendBaseEvent_dto.FrontendBaseEvent = FrontendBaseEvent;
		return frontendBaseEvent_dto;
	}

	var hasRequiredClickEvent_dto;

	function requireClickEvent_dto () {
		if (hasRequiredClickEvent_dto) return clickEvent_dto;
		hasRequiredClickEvent_dto = 1;
		var __decorate = (clickEvent_dto && clickEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (clickEvent_dto && clickEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(clickEvent_dto, "__esModule", { value: true });
		clickEvent_dto.ClickEvent = void 0;
		const class_validator_1 = esm5$1;
		const frontend_base_event_dto_1 = requireFrontendBaseEvent_dto();
		const class_transformer_1 = esm5;
		class ClickEvent extends frontend_base_event_dto_1.FrontendBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 ClickedTarget 입니다." }),
		    __metadata("design:type", String)
		], ClickEvent.prototype, "clickedTarget", void 0);
		clickEvent_dto.ClickEvent = ClickEvent;
		return clickEvent_dto;
	}

	var pageviewEvent_dto = {};

	var productBaseEvent_dto = {};

	var hasRequiredProductBaseEvent_dto;

	function requireProductBaseEvent_dto () {
		if (hasRequiredProductBaseEvent_dto) return productBaseEvent_dto;
		hasRequiredProductBaseEvent_dto = 1;
		var __decorate = (productBaseEvent_dto && productBaseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (productBaseEvent_dto && productBaseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(productBaseEvent_dto, "__esModule", { value: true });
		productBaseEvent_dto.ProductBaseEvent = void 0;
		const class_transformer_1 = esm5;
		const class_validator_1 = esm5$1;
		class ProductBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 productCode 입니다." }),
		    __metadata("design:type", String)
		], ProductBaseEvent.prototype, "productCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productNo 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "productNo는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], ProductBaseEvent.prototype, "productNo", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 productName 입니다." }),
		    __metadata("design:type", String)
		], ProductBaseEvent.prototype, "productName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 productImageUrl 입니다." }),
		    __metadata("design:type", String)
		], ProductBaseEvent.prototype, "productImageUrl", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productPrice 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "productPrice 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], ProductBaseEvent.prototype, "productPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productOriginPrice 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "productOriginPrice는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], ProductBaseEvent.prototype, "productOriginPrice", void 0);
		productBaseEvent_dto.ProductBaseEvent = ProductBaseEvent;
		return productBaseEvent_dto;
	}

	var hasRequiredPageviewEvent_dto;

	function requirePageviewEvent_dto () {
		if (hasRequiredPageviewEvent_dto) return pageviewEvent_dto;
		hasRequiredPageviewEvent_dto = 1;
		var __decorate = (pageviewEvent_dto && pageviewEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (pageviewEvent_dto && pageviewEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(pageviewEvent_dto, "__esModule", { value: true });
		pageviewEvent_dto.PageviewEvent = void 0;
		const class_validator_1 = esm5$1;
		const product_base_event_dto_1 = requireProductBaseEvent_dto();
		const frontend_base_event_dto_1 = requireFrontendBaseEvent_dto();
		const class_transformer_1 = esm5;
		class PageviewEvent extends frontend_base_event_dto_1.FrontendBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.ValidateNested)(),
		    (0, class_transformer_1.Type)(() => product_base_event_dto_1.ProductBaseEvent),
		    __metadata("design:type", product_base_event_dto_1.ProductBaseEvent)
		], PageviewEvent.prototype, "product", void 0);
		pageviewEvent_dto.PageviewEvent = PageviewEvent;
		return pageviewEvent_dto;
	}

	var utmInflowEvent_dto = {};

	var hasRequiredUtmInflowEvent_dto;

	function requireUtmInflowEvent_dto () {
		if (hasRequiredUtmInflowEvent_dto) return utmInflowEvent_dto;
		hasRequiredUtmInflowEvent_dto = 1;
		var __decorate = (utmInflowEvent_dto && utmInflowEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (utmInflowEvent_dto && utmInflowEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(utmInflowEvent_dto, "__esModule", { value: true });
		utmInflowEvent_dto.UtmInflowEvent = void 0;
		const class_validator_1 = esm5$1;
		const frontend_base_event_dto_1 = requireFrontendBaseEvent_dto();
		const class_transformer_1 = esm5;
		class UtmInflowEvent extends frontend_base_event_dto_1.FrontendBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 screenHeight 입니다." }),
		    __metadata("design:type", Number)
		], UtmInflowEvent.prototype, "screenHeight", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 screenWidth 입니다." }),
		    __metadata("design:type", Number)
		], UtmInflowEvent.prototype, "screenWidth", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 previousURL 입니다." }),
		    __metadata("design:type", String)
		], UtmInflowEvent.prototype, "previousURL", void 0);
		utmInflowEvent_dto.UtmInflowEvent = UtmInflowEvent;
		return utmInflowEvent_dto;
	}

	var impressionEvent_dto = {};

	var impression_type = {};

	var hasRequiredImpression_type;

	function requireImpression_type () {
		if (hasRequiredImpression_type) return impression_type;
		hasRequiredImpression_type = 1;
		Object.defineProperty(impression_type, "__esModule", { value: true });
		impression_type.ImpressionType = void 0;
		impression_type.ImpressionType = {
		    Image: "IMAGE",
		    Product: "PRODUCT",
		    ProductDetail: "PRODUCT_DETAIL",
		    Review: "REVIEW",
		    Chart: "CHART",
		    Button: "BUTTON",
		    Input: "INPUT",
		    Modal: "MODAL",
		    Popup: "POPUP",
		    Banner: "BANNER",
		    Video: "VIDEO",
		    Text: "TEXT",
		    Table: "TABLE",
		    Dropdown: "DROPDOWN",
		    Tooltip: "TOOLTIP",
		    Alert: "ALERT",
		    Toast: "TOAST",
		};
		return impression_type;
	}

	var hasRequiredImpressionEvent_dto;

	function requireImpressionEvent_dto () {
		if (hasRequiredImpressionEvent_dto) return impressionEvent_dto;
		hasRequiredImpressionEvent_dto = 1;
		var __decorate = (impressionEvent_dto && impressionEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (impressionEvent_dto && impressionEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(impressionEvent_dto, "__esModule", { value: true });
		impressionEvent_dto.ImpressionEvent = void 0;
		const class_validator_1 = esm5$1;
		const frontend_base_event_dto_1 = requireFrontendBaseEvent_dto();
		const impression_type_1 = requireImpression_type();
		const class_transformer_1 = esm5;
		class ImpressionEvent extends frontend_base_event_dto_1.FrontendBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 impressedTarget 입니다." }),
		    __metadata("design:type", String)
		], ImpressionEvent.prototype, "impressedTarget", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(impression_type_1.ImpressionType),
		    __metadata("design:type", String)
		], ImpressionEvent.prototype, "impressionType", void 0);
		impressionEvent_dto.ImpressionEvent = ImpressionEvent;
		return impressionEvent_dto;
	}

	var selectEvent_dto = {};

	var selectEvent_type = {};

	var hasRequiredSelectEvent_type;

	function requireSelectEvent_type () {
		if (hasRequiredSelectEvent_type) return selectEvent_type;
		hasRequiredSelectEvent_type = 1;
		Object.defineProperty(selectEvent_type, "__esModule", { value: true });
		selectEvent_type.SelectEventType = void 0;
		selectEvent_type.SelectEventType = {
		    Product: "PRODUCT",
		    Board: "BOARD",
		};
		return selectEvent_type;
	}

	var hasRequiredSelectEvent_dto;

	function requireSelectEvent_dto () {
		if (hasRequiredSelectEvent_dto) return selectEvent_dto;
		hasRequiredSelectEvent_dto = 1;
		var __decorate = (selectEvent_dto && selectEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (selectEvent_dto && selectEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(selectEvent_dto, "__esModule", { value: true });
		selectEvent_dto.SelectEvent = void 0;
		const class_validator_1 = esm5$1;
		const frontend_base_event_dto_1 = requireFrontendBaseEvent_dto();
		const select_event_type_1 = requireSelectEvent_type();
		const class_transformer_1 = esm5;
		class SelectEvent extends frontend_base_event_dto_1.FrontendBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(select_event_type_1.SelectEventType),
		    __metadata("design:type", String)
		], SelectEvent.prototype, "selectedType", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 selectedIdx 입니다." }),
		    __metadata("design:type", Number)
		], SelectEvent.prototype, "selectedIdx", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 selectedCode 입니다." }),
		    __metadata("design:type", String)
		], SelectEvent.prototype, "selectedCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 selectedNo 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "selectedNo는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], SelectEvent.prototype, "selectedNo", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 selectedName 입니다." }),
		    __metadata("design:type", String)
		], SelectEvent.prototype, "selectedName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 selectedImageUrl 입니다." }),
		    __metadata("design:type", String)
		], SelectEvent.prototype, "selectedImageUrl", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productPrice 입니다." }),
		    __metadata("design:type", Number)
		], SelectEvent.prototype, "productPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productOriginPrice 입니다." }),
		    __metadata("design:type", Number)
		], SelectEvent.prototype, "productOriginPrice", void 0);
		selectEvent_dto.SelectEvent = SelectEvent;
		return selectEvent_dto;
	}

	var product = {};

	var productImpressionEvent_dto = {};

	var hasRequiredProductImpressionEvent_dto;

	function requireProductImpressionEvent_dto () {
		if (hasRequiredProductImpressionEvent_dto) return productImpressionEvent_dto;
		hasRequiredProductImpressionEvent_dto = 1;
		var __decorate = (productImpressionEvent_dto && productImpressionEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (productImpressionEvent_dto && productImpressionEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(productImpressionEvent_dto, "__esModule", { value: true });
		productImpressionEvent_dto.ProductImpressionEvent = void 0;
		const class_validator_1 = esm5$1;
		const impression_event_dto_1 = requireImpressionEvent_dto();
		const class_transformer_1 = esm5;
		const product_base_event_dto_1 = requireProductBaseEvent_dto();
		class ProductImpressionEvent extends impression_event_dto_1.ImpressionEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsArray)({ message: "적절하지 않은 배열입니다." }),
		    (0, class_validator_1.ValidateNested)({ each: true, message: "적절하지 않은 products 입니다." }),
		    (0, class_transformer_1.Type)(() => product_base_event_dto_1.ProductBaseEvent),
		    __metadata("design:type", Array)
		], ProductImpressionEvent.prototype, "products", void 0);
		productImpressionEvent_dto.ProductImpressionEvent = ProductImpressionEvent;
		return productImpressionEvent_dto;
	}

	var hasRequiredProduct;

	function requireProduct () {
		if (hasRequiredProduct) return product;
		hasRequiredProduct = 1;
		(function (exports) {
			var __createBinding = (product && product.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (product && product.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireProductImpressionEvent_dto(), exports); 
		} (product));
		return product;
	}

	var hasRequiredFrontend;

	function requireFrontend () {
		if (hasRequiredFrontend) return frontend;
		hasRequiredFrontend = 1;
		(function (exports) {
			var __createBinding = (frontend && frontend.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (frontend && frontend.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireClickEvent_dto(), exports);
			__exportStar(requirePageviewEvent_dto(), exports);
			__exportStar(requireUtmInflowEvent_dto(), exports);
			__exportStar(requireImpressionEvent_dto(), exports);
			__exportStar(requireSelectEvent_dto(), exports);
			__exportStar(requireProduct(), exports); 
		} (frontend));
		return frontend;
	}

	var backend = {};

	var authEvent_dto = {};

	var hasRequiredAuthEvent_dto;

	function requireAuthEvent_dto () {
		if (hasRequiredAuthEvent_dto) return authEvent_dto;
		hasRequiredAuthEvent_dto = 1;
		var __decorate = (authEvent_dto && authEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (authEvent_dto && authEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(authEvent_dto, "__esModule", { value: true });
		authEvent_dto.AuthEvent = void 0;
		const class_validator_1 = esm5$1;
		const base_event_dto_1 = requireBaseEvent_dto();
		const constants_1 = requireConstants();
		const class_transformer_1 = esm5;
		class AuthEvent extends base_event_dto_1.BaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(constants_1.SocialSource, { message: "적절하지 않은 socialSource 입니다." }),
		    __metadata("design:type", String)
		], AuthEvent.prototype, "socialSource", void 0);
		authEvent_dto.AuthEvent = AuthEvent;
		return authEvent_dto;
	}

	var cartEvent_dto = {};

	var hasRequiredCartEvent_dto;

	function requireCartEvent_dto () {
		if (hasRequiredCartEvent_dto) return cartEvent_dto;
		hasRequiredCartEvent_dto = 1;
		var __decorate = (cartEvent_dto && cartEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (cartEvent_dto && cartEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(cartEvent_dto, "__esModule", { value: true });
		cartEvent_dto.CartEvent = cartEvent_dto.UpdateCartItem = void 0;
		const class_validator_1 = esm5$1;
		const class_transformer_1 = esm5;
		const class_validator_2 = esm5$1;
		const constants_1 = requireConstants();
		class UpdateCartItem {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_2.IsNumber)({}, { message: "적절하지 않은 quantity 입니다." }),
		    __metadata("design:type", Number)
		], UpdateCartItem.prototype, "quantity", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_2.IsNumber)({}, { message: "적절하지 않은 totalPrice 입니다." }),
		    __metadata("design:type", Number)
		], UpdateCartItem.prototype, "totalPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_2.IsEnum)(constants_1.CartAction, { message: "적절하지 않은 actionType 입니다." }),
		    __metadata("design:type", String)
		], UpdateCartItem.prototype, "actionType", void 0);
		cartEvent_dto.UpdateCartItem = UpdateCartItem;
		class CartEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsArray)({ message: "적절하지 않은 배열입니다." }),
		    (0, class_validator_1.Min)(1),
		    (0, class_validator_1.ValidateNested)({ each: true, message: "적절하지 않은 updatedItem 입니다." }),
		    (0, class_transformer_1.Type)(() => UpdateCartItem),
		    __metadata("design:type", Array)
		], CartEvent.prototype, "updatedItems", void 0);
		cartEvent_dto.CartEvent = CartEvent;
		return cartEvent_dto;
	}

	var orderEvent_dto = {};

	var purchaseBaseEvent_dto = {};

	var hasRequiredPurchaseBaseEvent_dto;

	function requirePurchaseBaseEvent_dto () {
		if (hasRequiredPurchaseBaseEvent_dto) return purchaseBaseEvent_dto;
		hasRequiredPurchaseBaseEvent_dto = 1;
		var __decorate = (purchaseBaseEvent_dto && purchaseBaseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (purchaseBaseEvent_dto && purchaseBaseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(purchaseBaseEvent_dto, "__esModule", { value: true });
		purchaseBaseEvent_dto.PurchaseBaseEvent = void 0;
		const class_validator_1 = esm5$1;
		const base_event_dto_1 = requireBaseEvent_dto();
		const constants_1 = requireConstants();
		const class_transformer_1 = esm5;
		class PurchaseBaseEvent extends base_event_dto_1.BaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsEnum)(constants_1.Currency, { message: "적절하지 않은 currency 입니다." }),
		    __metadata("design:type", String)
		], PurchaseBaseEvent.prototype, "currency", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 orderIdx 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "orderIdx는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], PurchaseBaseEvent.prototype, "orderIdx", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 orderCode 입니다." }),
		    __metadata("design:type", String)
		], PurchaseBaseEvent.prototype, "orderCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 orderNo 입니다." }),
		    __metadata("design:type", String)
		], PurchaseBaseEvent.prototype, "orderNo", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 totalPaymentPrice 입니다." }),
		    __metadata("design:type", Number)
		], PurchaseBaseEvent.prototype, "totalPaymentPrice", void 0);
		__decorate([
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 totalQuantity 입니다." }),
		    (0, class_transformer_1.Expose)(),
		    __metadata("design:type", Number)
		], PurchaseBaseEvent.prototype, "totalQuantity", void 0);
		purchaseBaseEvent_dto.PurchaseBaseEvent = PurchaseBaseEvent;
		return purchaseBaseEvent_dto;
	}

	var hasRequiredOrderEvent_dto;

	function requireOrderEvent_dto () {
		if (hasRequiredOrderEvent_dto) return orderEvent_dto;
		hasRequiredOrderEvent_dto = 1;
		var __decorate = (orderEvent_dto && orderEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (orderEvent_dto && orderEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(orderEvent_dto, "__esModule", { value: true });
		orderEvent_dto.OrderEvent = void 0;
		const class_validator_1 = esm5$1;
		const class_transformer_1 = esm5;
		const purchase_base_event_dto_1 = requirePurchaseBaseEvent_dto();
		const constants_1 = requireConstants();
		class OrderEvent extends purchase_base_event_dto_1.PurchaseBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 ordererCall 입니다." }),
		    __metadata("design:type", String)
		], OrderEvent.prototype, "ordererCall", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(constants_1.OrderStatus, { message: "적절하지 않은 orderStatus 입니다." }),
		    __metadata("design:type", String)
		], OrderEvent.prototype, "orderStatus", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsArray)({ message: "적절하지 않은 배열입니다." }),
		    (0, class_validator_1.ValidateNested)({ each: true, message: "적절하지 않은 Product 입니다." }),
		    (0, class_transformer_1.Type)(() => Product),
		    __metadata("design:type", Array)
		], OrderEvent.prototype, "products", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 totalPeriodDiscountPrice 입니다." }),
		    __metadata("design:type", Number)
		], OrderEvent.prototype, "totalPeriodDiscountPrice", void 0);
		orderEvent_dto.OrderEvent = OrderEvent;
		class Product {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 prodCode 입니다." }),
		    __metadata("design:type", String)
		], Product.prototype, "prodCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 prodNo 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "prodNo는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], Product.prototype, "prodNo", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 prodName 입니다." }),
		    __metadata("design:type", String)
		], Product.prototype, "prodName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsArray)({ message: "적절하지 않은 형태입니다." }),
		    (0, class_validator_1.ValidateNested)({ each: true, message: "적절하지 않은 option 입니다." }),
		    (0, class_transformer_1.Type)(() => ProductOptions),
		    __metadata("design:type", Array)
		], Product.prototype, "options", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 optionDetailCode 입니다." }),
		    __metadata("design:type", String)
		], Product.prototype, "optionDetailCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 periodDiscountPrice 입니다." }),
		    __metadata("design:type", Number)
		], Product.prototype, "periodDiscountPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productPrice 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "productPrice는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], Product.prototype, "productPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 productQuantity 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "productQuantity는 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], Product.prototype, "productQuantity", void 0);
		class ProductOptions {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 optionKeyName 입니다." }),
		    __metadata("design:type", String)
		], ProductOptions.prototype, "optionKeyName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 optionKeyCode 입니다." }),
		    __metadata("design:type", String)
		], ProductOptions.prototype, "optionKeyCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 optionValueName 입니다." }),
		    __metadata("design:type", String)
		], ProductOptions.prototype, "optionValueName", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 optionValueCode 입니다." }),
		    __metadata("design:type", String)
		], ProductOptions.prototype, "optionValueCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 quantity 입니다." }),
		    __metadata("design:type", Number)
		], ProductOptions.prototype, "quantity", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 price 입니다." }),
		    (0, class_validator_1.Min)(0, { message: "price 0보다 작을 수 없습니다." }),
		    __metadata("design:type", Number)
		], ProductOptions.prototype, "price", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 sku 입니다." }),
		    __metadata("design:type", String)
		], ProductOptions.prototype, "sku", void 0);
		return orderEvent_dto;
	}

	var paymentEvent_dto = {};

	var hasRequiredPaymentEvent_dto;

	function requirePaymentEvent_dto () {
		if (hasRequiredPaymentEvent_dto) return paymentEvent_dto;
		hasRequiredPaymentEvent_dto = 1;
		var __decorate = (paymentEvent_dto && paymentEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (paymentEvent_dto && paymentEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(paymentEvent_dto, "__esModule", { value: true });
		paymentEvent_dto.PaymentEvent = void 0;
		const class_validator_1 = esm5$1;
		const purchase_base_event_dto_1 = requirePurchaseBaseEvent_dto();
		const constants_1 = requireConstants();
		const class_transformer_1 = esm5;
		class PaymentEvent extends purchase_base_event_dto_1.PurchaseBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 paymentCode 입니다." }),
		    __metadata("design:type", String)
		], PaymentEvent.prototype, "paymentCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(constants_1.PaymentMethod, { message: "적절하지 않은 paymentMethod 입니다." }),
		    __metadata("design:type", String)
		], PaymentEvent.prototype, "paymentMethod", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 taxPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "taxPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 deliveryPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "deliveryPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 islandDeliveryPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "islandDeliveryPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 extraDeliveryPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "extraDeliveryPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 gradePrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "gradePrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 couponPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "couponPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 pointPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "pointPrice", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsNumber)({}, { message: "적절하지 않은 totalPeriodDiscountPrice 입니다." }),
		    __metadata("design:type", Number)
		], PaymentEvent.prototype, "totalPeriodDiscountPrice", void 0);
		paymentEvent_dto.PaymentEvent = PaymentEvent;
		return paymentEvent_dto;
	}

	var hasRequiredBackend;

	function requireBackend () {
		if (hasRequiredBackend) return backend;
		hasRequiredBackend = 1;
		(function (exports) {
			var __createBinding = (backend && backend.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (backend && backend.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireAuthEvent_dto(), exports);
			__exportStar(requireCartEvent_dto(), exports);
			__exportStar(requireOrderEvent_dto(), exports);
			__exportStar(requirePaymentEvent_dto(), exports); 
		} (backend));
		return backend;
	}

	var bo = {};

	var boSignupEvent_dto = {};

	var boAuthBaseEvent_dto = {};

	var hasRequiredBoAuthBaseEvent_dto;

	function requireBoAuthBaseEvent_dto () {
		if (hasRequiredBoAuthBaseEvent_dto) return boAuthBaseEvent_dto;
		hasRequiredBoAuthBaseEvent_dto = 1;
		var __decorate = (boAuthBaseEvent_dto && boAuthBaseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (boAuthBaseEvent_dto && boAuthBaseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(boAuthBaseEvent_dto, "__esModule", { value: true });
		boAuthBaseEvent_dto.BoAuthBaseEvent = void 0;
		const class_transformer_1 = esm5;
		const class_validator_1 = esm5$1;
		class BoAuthBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 userCode 입니다." }),
		    __metadata("design:type", String)
		], BoAuthBaseEvent.prototype, "userCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 email 입니다." }),
		    __metadata("design:type", String)
		], BoAuthBaseEvent.prototype, "email", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsArray)({ message: "적절하지 않은 배열입니다." }),
		    (0, class_validator_1.IsString)({ each: true, message: "적절하지 않은 listId 입니다." }),
		    __metadata("design:type", Array)
		], BoAuthBaseEvent.prototype, "listIds", void 0);
		boAuthBaseEvent_dto.BoAuthBaseEvent = BoAuthBaseEvent;
		return boAuthBaseEvent_dto;
	}

	var hasRequiredBoSignupEvent_dto;

	function requireBoSignupEvent_dto () {
		if (hasRequiredBoSignupEvent_dto) return boSignupEvent_dto;
		hasRequiredBoSignupEvent_dto = 1;
		var __decorate = (boSignupEvent_dto && boSignupEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (boSignupEvent_dto && boSignupEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(boSignupEvent_dto, "__esModule", { value: true });
		boSignupEvent_dto.BoSignupEvent = void 0;
		const class_validator_1 = esm5$1;
		const bo_auth_base_event_dto_1 = requireBoAuthBaseEvent_dto();
		const class_transformer_1 = esm5;
		class BoSignupEvent extends bo_auth_base_event_dto_1.BoAuthBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 name 입니다." }),
		    __metadata("design:type", String)
		], BoSignupEvent.prototype, "name", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 phone 입니다." }),
		    __metadata("design:type", String)
		], BoSignupEvent.prototype, "phone", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsBoolean)({ message: "적절하지 않은 isAgreeEmailMarketing 입니다." }),
		    __metadata("design:type", Boolean)
		], BoSignupEvent.prototype, "isAgreeEmailMarketing", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsBoolean)({ message: "적절하지 않은 isAgreeSmsMarketing 입니다." }),
		    __metadata("design:type", Boolean)
		], BoSignupEvent.prototype, "isAgreeSmsMarketing", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsArray)(),
		    (0, class_validator_1.IsString)({ each: true, message: "적절하지 않은 groupdIds 입니다." }),
		    __metadata("design:type", Array)
		], BoSignupEvent.prototype, "groupdIds", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_transformer_1.Type)(() => Date),
		    (0, class_validator_1.IsDate)({ message: "적절하지 않은 joinTime 입니다." }),
		    __metadata("design:type", Date)
		], BoSignupEvent.prototype, "joinTime", void 0);
		boSignupEvent_dto.BoSignupEvent = BoSignupEvent;
		return boSignupEvent_dto;
	}

	var boSignoutEvent_dto = {};

	var hasRequiredBoSignoutEvent_dto;

	function requireBoSignoutEvent_dto () {
		if (hasRequiredBoSignoutEvent_dto) return boSignoutEvent_dto;
		hasRequiredBoSignoutEvent_dto = 1;
		Object.defineProperty(boSignoutEvent_dto, "__esModule", { value: true });
		boSignoutEvent_dto.BoSignoutEvent = void 0;
		const bo_auth_base_event_dto_1 = requireBoAuthBaseEvent_dto();
		class BoSignoutEvent extends bo_auth_base_event_dto_1.BoAuthBaseEvent {
		}
		boSignoutEvent_dto.BoSignoutEvent = BoSignoutEvent;
		return boSignoutEvent_dto;
	}

	var boUpdateUserEvent_dto = {};

	var hasRequiredBoUpdateUserEvent_dto;

	function requireBoUpdateUserEvent_dto () {
		if (hasRequiredBoUpdateUserEvent_dto) return boUpdateUserEvent_dto;
		hasRequiredBoUpdateUserEvent_dto = 1;
		var __decorate = (boUpdateUserEvent_dto && boUpdateUserEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (boUpdateUserEvent_dto && boUpdateUserEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(boUpdateUserEvent_dto, "__esModule", { value: true });
		boUpdateUserEvent_dto.BoUpdateUserEvent = void 0;
		const class_validator_1 = esm5$1;
		const bo_auth_base_event_dto_1 = requireBoAuthBaseEvent_dto();
		const class_transformer_1 = esm5;
		class BoUpdateUserEvent extends bo_auth_base_event_dto_1.BoAuthBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsBoolean)({ message: "적절하지 않은 isAgreeEmailMarketing 입니다." }),
		    __metadata("design:type", Boolean)
		], BoUpdateUserEvent.prototype, "isAgreeEmailMarketing", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    (0, class_validator_1.IsBoolean)({ message: "적절하지 않은 isAgreeSmsMarketing 입니다." }),
		    __metadata("design:type", Boolean)
		], BoUpdateUserEvent.prototype, "isAgreeSmsMarketing", void 0);
		boUpdateUserEvent_dto.BoUpdateUserEvent = BoUpdateUserEvent;
		return boUpdateUserEvent_dto;
	}

	var hasRequiredBo;

	function requireBo () {
		if (hasRequiredBo) return bo;
		hasRequiredBo = 1;
		(function (exports) {
			var __createBinding = (bo && bo.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (bo && bo.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireBoSignupEvent_dto(), exports);
			__exportStar(requireBoSignoutEvent_dto(), exports);
			__exportStar(requireBoUpdateUserEvent_dto(), exports); 
		} (bo));
		return bo;
	}

	var app = {};

	var activeEvent_dto = {};

	var appBaseEvent_dto = {};

	var hasRequiredAppBaseEvent_dto;

	function requireAppBaseEvent_dto () {
		if (hasRequiredAppBaseEvent_dto) return appBaseEvent_dto;
		hasRequiredAppBaseEvent_dto = 1;
		var __decorate = (appBaseEvent_dto && appBaseEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (appBaseEvent_dto && appBaseEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(appBaseEvent_dto, "__esModule", { value: true });
		appBaseEvent_dto.AppBaseEvent = void 0;
		const class_transformer_1 = esm5;
		const constants_1 = requireConstants();
		const class_validator_1 = esm5$1;
		class AppBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 token 입니다." }),
		    (0, class_validator_1.IsNotEmpty)({ message: "token은 필수입니다." }),
		    __metadata("design:type", String)
		], AppBaseEvent.prototype, "token", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsEnum)(constants_1.EventCode, { message: "적절하지 않은 eventType 입니다." }),
		    (0, class_validator_1.IsNotEmpty)({ message: "eventType은 필수입니다." }),
		    __metadata("design:type", String)
		], AppBaseEvent.prototype, "eventType", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 siteCode 입니다." }),
		    __metadata("design:type", String)
		], AppBaseEvent.prototype, "siteCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 unitCode 입니다." }),
		    __metadata("design:type", String)
		], AppBaseEvent.prototype, "unitCode", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsOptional)(),
		    __metadata("design:type", Date)
		], AppBaseEvent.prototype, "timestamp", void 0);
		appBaseEvent_dto.AppBaseEvent = AppBaseEvent;
		return appBaseEvent_dto;
	}

	var hasRequiredActiveEvent_dto;

	function requireActiveEvent_dto () {
		if (hasRequiredActiveEvent_dto) return activeEvent_dto;
		hasRequiredActiveEvent_dto = 1;
		Object.defineProperty(activeEvent_dto, "__esModule", { value: true });
		activeEvent_dto.AppActiveEvent = void 0;
		const app_base_event_dto_1 = requireAppBaseEvent_dto();
		class AppActiveEvent extends app_base_event_dto_1.AppBaseEvent {
		}
		activeEvent_dto.AppActiveEvent = AppActiveEvent;
		return activeEvent_dto;
	}

	var boAccessEvent_dto = {};

	var hasRequiredBoAccessEvent_dto;

	function requireBoAccessEvent_dto () {
		if (hasRequiredBoAccessEvent_dto) return boAccessEvent_dto;
		hasRequiredBoAccessEvent_dto = 1;
		var __decorate = (boAccessEvent_dto && boAccessEvent_dto.__decorate) || function (decorators, target, key, desc) {
		    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		    return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
		var __metadata = (boAccessEvent_dto && boAccessEvent_dto.__metadata) || function (k, v) {
		    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
		};
		Object.defineProperty(boAccessEvent_dto, "__esModule", { value: true });
		boAccessEvent_dto.AppBoAccessEvent = void 0;
		const class_transformer_1 = esm5;
		const class_validator_1 = esm5$1;
		const app_base_event_dto_1 = requireAppBaseEvent_dto();
		class AppBoAccessEvent extends app_base_event_dto_1.AppBaseEvent {
		}
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 destinationPath 입니다." }),
		    __metadata("design:type", String)
		], AppBoAccessEvent.prototype, "destinationPath", void 0);
		__decorate([
		    (0, class_transformer_1.Expose)(),
		    (0, class_validator_1.IsString)({ message: "적절하지 않은 method 입니다." }),
		    __metadata("design:type", String)
		], AppBoAccessEvent.prototype, "method", void 0);
		boAccessEvent_dto.AppBoAccessEvent = AppBoAccessEvent;
		return boAccessEvent_dto;
	}

	var hasRequiredApp;

	function requireApp () {
		if (hasRequiredApp) return app;
		hasRequiredApp = 1;
		(function (exports) {
			var __createBinding = (app && app.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (app && app.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireActiveEvent_dto(), exports);
			__exportStar(requireBoAccessEvent_dto(), exports); 
		} (app));
		return app;
	}

	var hasRequiredDomains;

	function requireDomains () {
		if (hasRequiredDomains) return domains;
		hasRequiredDomains = 1;
		(function (exports) {
			var __createBinding = (domains && domains.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (domains && domains.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireFrontend(), exports);
			__exportStar(requireBackend(), exports);
			__exportStar(requireBo(), exports);
			__exportStar(requireApp(), exports); 
		} (domains));
		return domains;
	}

	var utils = {};

	var validateEventType = {};

	var hasRequiredValidateEventType;

	function requireValidateEventType () {
		if (hasRequiredValidateEventType) return validateEventType;
		hasRequiredValidateEventType = 1;
		Object.defineProperty(validateEventType, "__esModule", { value: true });
		validateEventType.isValidEventType = void 0;
		const event_code_1 = requireEventCode();
		function isValidEventType(eventType) {
		    return eventType in event_code_1.eventTypeMap;
		}
		validateEventType.isValidEventType = isValidEventType;
		return validateEventType;
	}

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		(function (exports) {
			var __createBinding = (utils && utils.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (utils && utils.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireValidateEventType(), exports); 
		} (utils));
		return utils;
	}

	var hasRequiredDist;

	function requireDist () {
		if (hasRequiredDist) return dist;
		hasRequiredDist = 1;
		(function (exports) {
			var __createBinding = (dist && dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (dist && dist.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireConstants(), exports);
			__exportStar(requireDomains(), exports);
			__exportStar(requireUtils(), exports); 
		} (dist));
		return dist;
	}

	var distExports = requireDist();

	/**
	 * uuidv7: A JavaScript implementation of UUID version 7
	 *
	 * Copyright 2021-2026 LiosK
	 *
	 * @license Apache-2.0
	 * @packageDocumentation
	 */
	const DIGITS = "0123456789abcdef";
	/** Represents a UUID as a 16-byte byte array. */
	class UUID {
	    /** @param bytes - The 16-byte byte array representation. */
	    constructor(bytes) {
	        this.bytes = bytes;
	    }
	    /**
	     * Creates an object from the internal representation, a 16-byte byte array
	     * containing the binary UUID representation in the big-endian byte order.
	     *
	     * This method does NOT shallow-copy the argument, and thus the created object
	     * holds the reference to the underlying buffer.
	     *
	     * @throws TypeError if the length of the argument is not 16.
	     */
	    static ofInner(bytes) {
	        if (bytes.length !== 16) {
	            throw new TypeError("not 128-bit length");
	        }
	        else {
	            return new UUID(bytes);
	        }
	    }
	    /**
	     * Builds a byte array from UUIDv7 field values.
	     *
	     * @param unixTsMs - A 48-bit `unix_ts_ms` field value.
	     * @param randA - A 12-bit `rand_a` field value.
	     * @param randBHi - The higher 30 bits of 62-bit `rand_b` field value.
	     * @param randBLo - The lower 32 bits of 62-bit `rand_b` field value.
	     * @throws RangeError if any field value is out of the specified range.
	     */
	    static fromFieldsV7(unixTsMs, randA, randBHi, randBLo) {
	        if (!Number.isInteger(unixTsMs) ||
	            !Number.isInteger(randA) ||
	            !Number.isInteger(randBHi) ||
	            !Number.isInteger(randBLo) ||
	            unixTsMs < 0 ||
	            randA < 0 ||
	            randBHi < 0 ||
	            randBLo < 0 ||
	            unixTsMs > 281474976710655 ||
	            randA > 0xfff ||
	            randBHi > 1073741823 ||
	            randBLo > 4294967295) {
	            throw new RangeError("invalid field value");
	        }
	        const bytes = new Uint8Array(16);
	        bytes[0] = unixTsMs / 2 ** 40;
	        bytes[1] = unixTsMs / 2 ** 32;
	        bytes[2] = unixTsMs / 2 ** 24;
	        bytes[3] = unixTsMs / 2 ** 16;
	        bytes[4] = unixTsMs / 2 ** 8;
	        bytes[5] = unixTsMs;
	        bytes[6] = 0x70 | (randA >>> 8);
	        bytes[7] = randA;
	        bytes[8] = 0x80 | (randBHi >>> 24);
	        bytes[9] = randBHi >>> 16;
	        bytes[10] = randBHi >>> 8;
	        bytes[11] = randBHi;
	        bytes[12] = randBLo >>> 24;
	        bytes[13] = randBLo >>> 16;
	        bytes[14] = randBLo >>> 8;
	        bytes[15] = randBLo;
	        return new UUID(bytes);
	    }
	    /**
	     * Builds a byte array from a string representation.
	     *
	     * This method accepts the following formats:
	     *
	     * - 32-digit hexadecimal format without hyphens: `0189dcd553117d408db09496a2eef37b`
	     * - 8-4-4-4-12 hyphenated format: `0189dcd5-5311-7d40-8db0-9496a2eef37b`
	     * - Hyphenated format with surrounding braces: `{0189dcd5-5311-7d40-8db0-9496a2eef37b}`
	     * - RFC 9562 URN format: `urn:uuid:0189dcd5-5311-7d40-8db0-9496a2eef37b`
	     *
	     * Leading and trailing whitespaces represents an error.
	     *
	     * @throws SyntaxError if the argument could not parse as a valid UUID string.
	     */
	    static parse(uuid) {
	        var _a, _b, _c, _d;
	        let hex = undefined;
	        switch (uuid.length) {
	            case 32:
	                hex = (_a = /^[0-9a-f]{32}$/i.exec(uuid)) === null || _a === void 0 ? void 0 : _a[0];
	                break;
	            case 36:
	                hex =
	                    (_b = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
	                        .exec(uuid)) === null || _b === void 0 ? void 0 : _b.slice(1, 6).join("");
	                break;
	            case 38:
	                hex =
	                    (_c = /^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i
	                        .exec(uuid)) === null || _c === void 0 ? void 0 : _c.slice(1, 6).join("");
	                break;
	            case 45:
	                hex =
	                    (_d = /^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
	                        .exec(uuid)) === null || _d === void 0 ? void 0 : _d.slice(1, 6).join("");
	                break;
	        }
	        if (hex) {
	            const inner = new Uint8Array(16);
	            for (let i = 0; i < 16; i += 4) {
	                const n = parseInt(hex.substring(2 * i, 2 * i + 8), 16);
	                inner[i + 0] = n >>> 24;
	                inner[i + 1] = n >>> 16;
	                inner[i + 2] = n >>> 8;
	                inner[i + 3] = n;
	            }
	            return new UUID(inner);
	        }
	        else {
	            throw new SyntaxError("could not parse UUID string");
	        }
	    }
	    /**
	     * @returns The 8-4-4-4-12 canonical hexadecimal string representation
	     * (`0189dcd5-5311-7d40-8db0-9496a2eef37b`).
	     */
	    toString() {
	        let text = "";
	        for (let i = 0; i < this.bytes.length; i++) {
	            text += DIGITS.charAt(this.bytes[i] >>> 4);
	            text += DIGITS.charAt(this.bytes[i] & 0xf);
	            if (i === 3 || i === 5 || i === 7 || i === 9) {
	                text += "-";
	            }
	        }
	        return text;
	    }
	    /**
	     * @returns The 32-digit hexadecimal representation without hyphens
	     * (`0189dcd553117d408db09496a2eef37b`).
	     */
	    toHex() {
	        let text = "";
	        for (let i = 0; i < this.bytes.length; i++) {
	            text += DIGITS.charAt(this.bytes[i] >>> 4);
	            text += DIGITS.charAt(this.bytes[i] & 0xf);
	        }
	        return text;
	    }
	    /** @returns The 8-4-4-4-12 canonical hexadecimal string representation. */
	    toJSON() {
	        return this.toString();
	    }
	    /**
	     * Reports the variant field value of the UUID or, if appropriate, "NIL" or
	     * "MAX".
	     *
	     * For convenience, this method reports "NIL" or "MAX" if `this` represents
	     * the Nil or Max UUID, although the Nil and Max UUIDs are technically
	     * subsumed under the variants `0b0` and `0b111`, respectively.
	     */
	    getVariant() {
	        const n = this.bytes[8] >>> 4;
	        if (n < 0) {
	            throw new Error("unreachable");
	        }
	        else if (n <= 0b0111) {
	            return this.isNil() ? "NIL" : "VAR_0";
	        }
	        else if (n <= 0b1011) {
	            return "VAR_10";
	        }
	        else if (n <= 0b1101) {
	            return "VAR_110";
	        }
	        else if (n <= 0b1111) {
	            return this.isMax() ? "MAX" : "VAR_RESERVED";
	        }
	        else {
	            throw new Error("unreachable");
	        }
	    }
	    /**
	     * Returns the version field value of the UUID or `undefined` if the UUID does
	     * not have the variant field value of `0b10`.
	     */
	    getVersion() {
	        return this.getVariant() === "VAR_10" ? this.bytes[6] >>> 4 : undefined;
	    }
	    /** Returns `true` if `this` is the Nil UUID. */
	    isNil() {
	        return this.bytes.every((e) => e === 0);
	    }
	    /** Returns `true` if `this` is the Max UUID. */
	    isMax() {
	        return this.bytes.every((e) => e === 0xff);
	    }
	    /** Creates an object from `this`. */
	    clone() {
	        return new UUID(this.bytes.slice(0));
	    }
	    /** Returns true if `this` is equivalent to `other`. */
	    equals(other) {
	        return this.compareTo(other) === 0;
	    }
	    /**
	     * Returns a negative integer, zero, or positive integer if `this` is less
	     * than, equal to, or greater than `other`, respectively.
	     */
	    compareTo(other) {
	        for (let i = 0; i < 16; i++) {
	            const diff = this.bytes[i] - other.bytes[i];
	            if (diff !== 0) {
	                return Math.sign(diff);
	            }
	        }
	        return 0;
	    }
	}
	/**
	 * Encapsulates the monotonic counter state.
	 *
	 * This class provides APIs to utilize a separate counter state from that of the
	 * global generator used by {@link uuidv7} and {@link uuidv7obj}. In addition to
	 * the default {@link generate} method, this class has {@link generateOrAbort}
	 * that is useful to absolutely guarantee the monotonically increasing order of
	 * generated UUIDs. See their respective documentation for details.
	 */
	class V7Generator {
	    /**
	     * Creates a generator object with the default random number generator, or
	     * with the specified one if passed as an argument. The specified random
	     * number generator should be cryptographically strong and securely seeded.
	     */
	    constructor(randomNumberGenerator) {
	        /**
	         * Biased by one to distinguish zero (uninitialized) and zero (UNIX epoch).
	         */
	        this.timestampBiased = 0;
	        this.counter = 0;
	        this.rollbackAllowance = 10000; // 10 seconds in milliseconds
	        this.random = randomNumberGenerator !== null && randomNumberGenerator !== void 0 ? randomNumberGenerator : getDefaultRandom();
	    }
	    /**
	     * Sets the `rollbackAllowance` parameter of the generator.
	     *
	     * The `rollbackAllowance` parameter specifies the amount of `unixTsMs`
	     * rollback that is considered significant. The default value is `10_000`
	     * (milliseconds). See the {@link generate} or {@link generateOrAbort}
	     * documentation for the treatment of the significant rollback.
	     *
	     */
	    setRollbackAllowance(rollbackAllowance) {
	        if (rollbackAllowance < 0 || rollbackAllowance > 281474976710655) {
	            throw new RangeError("`rollbackAllowance` out of reasonable range");
	        }
	        this.rollbackAllowance = rollbackAllowance;
	    }
	    /**
	     * Generates a new UUIDv7 object from the current timestamp, or resets the
	     * generator upon significant timestamp rollback.
	     *
	     * This method returns a monotonically increasing UUID by reusing the previous
	     * timestamp even if the up-to-date timestamp is smaller than the immediately
	     * preceding UUID's. However, when such a clock rollback is considered
	     * significant (by default, more than ten seconds), this method resets the
	     * generator and returns a new UUID based on the given timestamp, breaking the
	     * increasing order of UUIDs.
	     *
	     * See {@link generateOrAbort} for the other mode of generation and
	     * {@link generateOrResetWithTs} for the variant accepting a custom timestamp.
	     */
	    generate() {
	        return this.generateOrResetWithTs(Date.now());
	    }
	    /**
	     * Generates a new UUIDv7 object from the current timestamp, or returns
	     * `undefined` upon significant timestamp rollback.
	     *
	     * This method returns a monotonically increasing UUID by reusing the previous
	     * timestamp even if the up-to-date timestamp is smaller than the immediately
	     * preceding UUID's. However, when such a clock rollback is considered
	     * significant (by default, more than ten seconds), this method aborts and
	     * returns `undefined` immediately.
	     *
	     * See {@link generate} for the other mode of generation and
	     * {@link generateOrAbortWithTs} for the variant accepting a custom timestamp.
	     */
	    generateOrAbort() {
	        return this.generateOrAbortWithTs(Date.now());
	    }
	    /**
	     * Generates a new UUIDv7 object from the `unixTsMs` passed, or resets the
	     * generator upon significant timestamp rollback.
	     *
	     * This method is equivalent to {@link generate} except that it takes a custom
	     * timestamp.
	     *
	     * @throws RangeError if `unixTsMs` is not a 48-bit unsigned integer.
	     */
	    generateOrResetWithTs(unixTsMs) {
	        let value = this.generateOrAbortWithTs(unixTsMs);
	        if (value === undefined) {
	            // reset state and resume
	            this.timestampBiased = 0;
	            value = this.generateOrAbortWithTs(unixTsMs);
	        }
	        return value;
	    }
	    /**
	     * Generates a new UUIDv7 object from the `unixTsMs` passed, or returns
	     * `undefined` upon significant timestamp rollback.
	     *
	     * This method is equivalent to {@link generateOrAbort} except that it takes a
	     * custom timestamp.
	     *
	     * @throws RangeError if `unixTsMs` is not a 48-bit unsigned integer.
	     */
	    generateOrAbortWithTs(unixTsMs) {
	        const MAX_COUNTER = 4398046511103;
	        if (!Number.isInteger(unixTsMs) ||
	            unixTsMs < 0 ||
	            unixTsMs > 281474976710655) {
	            throw new RangeError("`unixTsMs` must be a 48-bit unsigned integer");
	        }
	        unixTsMs++;
	        if (unixTsMs > this.timestampBiased) {
	            this.timestampBiased = unixTsMs;
	            this.resetCounter();
	        }
	        else if (unixTsMs + this.rollbackAllowance >= this.timestampBiased) {
	            // go on with previous timestamp if new one is not much smaller
	            this.counter++;
	            if (this.counter > MAX_COUNTER) {
	                // increment timestamp at counter overflow
	                this.timestampBiased++;
	                this.resetCounter();
	            }
	        }
	        else {
	            // abort if clock went backwards to unbearable extent
	            return undefined;
	        }
	        return UUID.fromFieldsV7(this.timestampBiased - 1, Math.trunc(this.counter / 2 ** 30), this.counter & (2 ** 30 - 1), this.random.nextUint32());
	    }
	    /**
	     * Generates a new UUIDv7 object from the `unixTsMs` passed, or resets the
	     * generator upon significant timestamp rollback.
	     *
	     * This method is a deprecated version of {@link generateOrResetWithTs} that
	     * accepts the `rollbackAllowance` parameter as an argument, rather than using
	     * the generator-level parameter.
	     *
	     * @param rollbackAllowance - The amount of `unixTsMs` rollback that is
	     * considered significant. A suggested value is `10_000` (milliseconds).
	     * @throws RangeError if `unixTsMs` is not a 48-bit unsigned integer.
	     * @deprecated Since v1.2.0. Use {@link generateOrResetWithTs} instead.
	     */
	    generateOrResetCore(unixTsMs, rollbackAllowance) {
	        const origRollbackAllowance = this.rollbackAllowance;
	        try {
	            this.setRollbackAllowance(rollbackAllowance);
	            return this.generateOrResetWithTs(unixTsMs);
	        }
	        catch (e) {
	            throw e;
	        }
	        finally {
	            this.rollbackAllowance = origRollbackAllowance;
	        }
	    }
	    /**
	     * Generates a new UUIDv7 object from the `unixTsMs` passed, or returns
	     * `undefined` upon significant timestamp rollback.
	     *
	     * This method is a deprecated version of {@link generateOrAbortWithTs} that
	     * accepts the `rollbackAllowance` parameter as an argument, rather than using
	     * the generator-level parameter.
	     *
	     * @param rollbackAllowance - The amount of `unixTsMs` rollback that is
	     * considered significant. A suggested value is `10_000` (milliseconds).
	     * @throws RangeError if `unixTsMs` is not a 48-bit unsigned integer.
	     * @deprecated Since v1.2.0. Use {@link generateOrAbortWithTs} instead.
	     */
	    generateOrAbortCore(unixTsMs, rollbackAllowance) {
	        const origRollbackAllowance = this.rollbackAllowance;
	        try {
	            this.setRollbackAllowance(rollbackAllowance);
	            return this.generateOrAbortWithTs(unixTsMs);
	        }
	        catch (e) {
	            throw e;
	        }
	        finally {
	            this.rollbackAllowance = origRollbackAllowance;
	        }
	    }
	    /** Initializes the counter at a 42-bit random integer. */
	    resetCounter() {
	        this.counter =
	            this.random.nextUint32() * 0x400 + (this.random.nextUint32() & 0x3ff);
	    }
	    /**
	     * Generates a new UUIDv4 object utilizing the random number generator inside.
	     *
	     * @internal
	     */
	    generateV4() {
	        const bytes = new Uint8Array(Uint32Array.of(this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32()).buffer);
	        bytes[6] = 0x40 | (bytes[6] >>> 4);
	        bytes[8] = 0x80 | (bytes[8] >>> 2);
	        return UUID.ofInner(bytes);
	    }
	}
	/** Returns the default random number generator available in the environment. */
	const getDefaultRandom = () => {
	    // detect Web Crypto API
	    if (typeof crypto !== "undefined" &&
	        typeof crypto.getRandomValues !== "undefined") {
	        return new BufferedCryptoRandom();
	    }
	    else {
	        // fall back on Math.random() unless the flag is set to true
	        if (typeof UUIDV7_DENY_WEAK_RNG !== "undefined" && UUIDV7_DENY_WEAK_RNG) {
	            throw new Error("no cryptographically strong RNG available");
	        }
	        return {
	            nextUint32: () => Math.trunc(Math.random() * 65536) * 65536 +
	                Math.trunc(Math.random() * 65536),
	        };
	    }
	};
	/**
	 * Wraps `crypto.getRandomValues()` to enable buffering; this uses a small
	 * buffer by default to avoid both unbearable throughput decline in some
	 * environments and the waste of time and space for unused values.
	 */
	class BufferedCryptoRandom {
	    constructor() {
	        this.buffer = new Uint32Array(8);
	        this.cursor = 0xffff;
	    }
	    nextUint32() {
	        if (this.cursor >= this.buffer.length) {
	            crypto.getRandomValues(this.buffer);
	            this.cursor = 0;
	        }
	        return this.buffer[this.cursor++];
	    }
	}
	let defaultGenerator;
	/**
	 * Generates a UUIDv7 string.
	 *
	 * @returns The 8-4-4-4-12 canonical hexadecimal string representation
	 * ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
	 */
	const uuidv7 = () => uuidv7obj().toString();
	/** Generates a UUIDv7 object. */
	const uuidv7obj = () => (defaultGenerator || (defaultGenerator = new V7Generator())).generate();

	function sanitizeValue(value) {
	    if (value === null || value === undefined) {
	        return null;
	    }
	    if (typeof value === 'string') {
	        return value
	            // 백슬래시 제거
	            .replace(/\\/g, '')
	            // 제어문자 제거 (쿠키 헤더에 문제를 일으킬 수 있는 문자들)
	            // eslint-disable-next-line no-control-regex
	            .replace(/[\x00-\x1F\x7F]/g, '');
	    }
	    if (typeof value === 'object') {
	        if (Array.isArray(value)) {
	            return value.map(function (item) { return sanitizeValue(item); });
	        }
	        var sanitizedObj = {};
	        for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
	            var _b = _a[_i], key = _b[0], val = _b[1];
	            sanitizedObj[key] = sanitizeValue(val);
	        }
	        return sanitizedObj;
	    }
	    return value;
	}

	/**
	 * 디버그 로그 출력
	 * 개발 환경(IS_DEV)에서 debug 모드가 활성화되어 있을 때만 출력
	 * 프로덕션에서는 debug: true를 설정해도 출력되지 않음
	 */
	function logDebug() {
	}

	var UTM_EXPIRED_DAYS = 7;
	function getPathAndQueryWithoutUTM(urlString) {
	    try {
	        var url = new URL(urlString);
	        var searchParams_1 = new URLSearchParams(url.search);
	        Array.from(searchParams_1.keys()).forEach(function (key) {
	            if (key.toLowerCase().startsWith('utm_')) {
	                searchParams_1.delete(key);
	            }
	        });
	        var baseUrl = "".concat(url.protocol, "//").concat(url.host);
	        return "".concat(baseUrl).concat(url.pathname).concat(searchParams_1.toString() ? '?' + searchParams_1.toString() : '');
	    }
	    catch (_a) {
	        return "".concat(window.location.protocol, "//").concat(window.location.host).concat(window.location.pathname);
	    }
	}
	function isUTMExpired(utmUpdatedTime) {
	    if (!utmUpdatedTime) {
	        return false;
	    }
	    try {
	        var utmUpdatedTimeDate = new Date(utmUpdatedTime);
	        var now = new Date();
	        var diffTime = Math.abs(now.getTime() - utmUpdatedTimeDate.getTime());
	        var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	        return diffDays >= UTM_EXPIRED_DAYS;
	    }
	    catch (_a) {
	        return true;
	    }
	}
	function updateDataWithUTM(data, utmParams) {
	    var sanitizedData = sanitizeValue(data);
	    // UTM 파라미터가 하나라도 있는지 확인
	    var hasUtmParams = Object.keys(utmParams).some(function (key) { return utmParams[key]; });
	    if (hasUtmParams) {
	        var sanitizedUtmParams = sanitizeValue(utmParams);
	        // UTM 파라미터가 있을 때만 UTM 관련 데이터, utmLandingUrl, 시간 업데이트
	        var currentPathAndQuery = getPathAndQueryWithoutUTM(window.location.href);
	        return __assign$1(__assign$1({}, sanitizedData), { utmSource: sanitizedUtmParams.utmSource || null, utmMedium: sanitizedUtmParams.utmMedium || null, utmCampaign: sanitizedUtmParams.utmCampaign || null, utmTerm: sanitizedUtmParams.utmTerm || null, utmContent: sanitizedUtmParams.utmContent || null, utmLandingUrl: currentPathAndQuery, utmUpdatedTime: new Date().toISOString() });
	    }
	    if (isUTMExpired(sanitizedData.utmUpdatedTime)) {
	        return __assign$1(__assign$1({}, sanitizedData), { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null, utmLandingUrl: null, utmUpdatedTime: null });
	    }
	    return sanitizedData;
	}
	function toCamelCase(snake) {
	    if (!snake.includes('_')) {
	        return snake;
	    }
	    return snake
	        .toLowerCase()
	        .split('_')
	        .map(function (word, index) { return (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)); })
	        .join('');
	}
	function parseUTMParams() {
	    var urlParams = new URLSearchParams(window.location.search);
	    var utmParams = {};
	    // UTM 파라미터가 하나라도 있는지 확인
	    var hasAnyUtmParam = false;
	    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (param) {
	        var value = urlParams.get(param);
	        if (value) {
	            hasAnyUtmParam = true;
	            try {
	                var decodedValue = decodeURIComponent(value);
	                utmParams[toCamelCase(param)] = sanitizeValue(decodedValue);
	            }
	            catch (_error) {
	                utmParams[toCamelCase(param)] = sanitizeValue(value);
	            }
	        }
	    });
	    // UTM 파라미터가 하나도 없으면 빈 객체 반환
	    if (!hasAnyUtmParam) {
	        return {};
	    }
	    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (param) {
	        if (!utmParams[toCamelCase(param)]) {
	            utmParams[toCamelCase(param)] = null;
	        }
	    });
	    return utmParams;
	}

	function getSafeLocalStorage$1() {
	    if (typeof window === 'undefined') {
	        return null;
	    }
	    try {
	        return window.localStorage;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	function getLocalStorage(key) {
	    var storage = getSafeLocalStorage$1();
	    if (!storage) {
	        return null;
	    }
	    try {
	        var item = storage.getItem(key);
	        return item ? JSON.parse(item) : null;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	function setLocalStorage(key, value) {
	    var storage = getSafeLocalStorage$1();
	    if (!storage) {
	        return;
	    }
	    var sanitizedValue = sanitizeValue(value);
	    try {
	        storage.setItem(key, JSON.stringify(sanitizedValue));
	    }
	    catch (_a) {
	        // Ignore storage errors (quota, blocked storage, private mode restrictions)
	    }
	}

	//** Generate a random event id UUID */
	function generateEventId() {
	    var eventId = uuidv7().replace(/-/g, '');
	    return eventId;
	}
	///**  Generate a random device ID // */
	function generateDeviceId() {
	    var deviceId = uuidv7().replace(/-/g, '');
	    return deviceId;
	}

	var REFERER_EXPIRED_HOURS = 2;
	function getReferrer() {
	    var referrer = document.referrer.trim();
	    return referrer === '' ? '@direct' : referrer;
	}
	var Referrer = /** @class */ (function () {
	    function Referrer(_a) {
	        var hostname = _a.hostname, oldReferrer = _a.oldReferrer, updatedAt = _a.updatedAt;
	        this.hostname = hostname !== null && hostname !== void 0 ? hostname : location.hostname;
	        this.oldReferrer = oldReferrer !== null && oldReferrer !== void 0 ? oldReferrer : getReferrer();
	        this.updatedAt = updatedAt !== null && updatedAt !== void 0 ? updatedAt : new Date().toISOString();
	    }
	    Referrer.prototype.isInternal = function () {
	        var referrer = getReferrer();
	        if (referrer === '@direct') {
	            return false;
	        }
	        var referrerHostname = new URL(referrer).hostname;
	        return this.hostname === referrerHostname;
	    };
	    Referrer.prototype.isExpired = function () {
	        var updatedAt = new Date(this.updatedAt);
	        var now = new Date();
	        var diffTime = Math.abs(now.getTime() - updatedAt.getTime());
	        var diffHours = Math.floor(diffTime / (1000 * 60 * 60));
	        return diffHours >= REFERER_EXPIRED_HOURS;
	    };
	    Referrer.prototype.getInitialReferrer = function () {
	        if (!this.isExpired() || this.isInternal()) {
	            return this.oldReferrer;
	        }
	        return getReferrer();
	    };
	    Referrer.prototype.getInitialReferrerDomain = function () {
	        var referrer = this.getInitialReferrer();
	        if (referrer === '@direct') {
	            return '@direct';
	        }
	        return new URL(referrer).hostname;
	    };
	    return Referrer;
	}());

	function setCookie(name, data) {
	    // 쿠키 헤더에서 문제가 일어 날 수도있는 데이터 제거
	    var sanitizedData = sanitizeValue(data);
	    // JSON 데이터를 문자열로 변환
	    var jsonString = JSON.stringify(sanitizedData);
	    // 쿠키 값을 인코딩
	    var encodedValue = encodeURIComponent(jsonString);
	    // 만료일 365 고정
	    var expirationDate = new Date();
	    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000);
	    var isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
	    var sameSite = isSecureContext ? 'None' : 'Lax';
	    var secureFlag = isSecureContext ? ';Secure' : '';
	    // 쿠키 문자열 생성
	    var cookieString = "".concat(name, "=").concat(encodedValue, ";expires=").concat(expirationDate.toUTCString(), ";path=/;SameSite=").concat(sameSite).concat(secureFlag);
	    // 쿠키 설정
	    document.cookie = cookieString;
	}
	function getCookie(name) {
	    var cookies = document.cookie.split(';');
	    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
	        var cookie = cookies_1[_i];
	        var _a = cookie.split('=').map(function (c) { return c.trim(); }), cookieName = _a[0], cookieValue = _a[1];
	        if (cookieName === name) {
	            try {
	                // URL 디코딩 후 JSON 파싱
	                var decodedValue = decodeURIComponent(cookieValue);
	                return JSON.parse(decodedValue);
	            }
	            catch (error) {
	                return null;
	            }
	        }
	    }
	    return null; // 쿠키를 찾지 못한 경우
	}
	/**
	 * 기존 쿠키에 보안 옵션을 적용합니다
	 */
	function upgradeCookieSecurity(cookieName) {
	    var existingData = getCookie(cookieName);
	    if (existingData) {
	        // 기존 데이터를 그대로 사용하여 쿠키를 다시 설정 (새 보안 옵션 적용)
	        setCookie(cookieName, existingData);
	    }
	}

	var COOKIE_NAMES = {
	    USER_INFO: '__bs_imweb',
	};
	var LOCAL_STORAGE_KEYS = {
	    USER_INFO: '__bs_imweb',
	    SUPER_PROPERTIES: '__bs_super_props',
	    CUSTOM_SESSION_TIMEOUT: '__bs_custom_session_timeout',
	};
	var SESSION_STORAGE_KEYS = {
	    USER_INFO: '__bs_imweb_session',
	    USER_INFO_HISTORY: '__bs_imweb_session_history',
	    BROWSER_SESSION_ID: '__bs_browser_session_id',
	    TIMED_EVENTS: '__bs_timed_events',
	};
	var SESSION_TIMEOUT = {
	    COMMON_SESSION_EXPIRED_MS: 30 * 60 * 1000, // 30분 (고정, Cross-SDK 공유)
	    DEFAULT_CUSTOM_SESSION_MS: 30 * 60 * 1000, // 기본값 30분 (사용자 설정 가능)
	};
	/**
	 * Cross-SDK 통신을 위한 CustomEvent 이름
	 * 다른 SDK (analytics-sdk, crm-onsite-sdk)에서 세션 갱신 요청 시 사용
	 */
	var CROSS_SDK_EVENTS = {
	    /** 다른 SDK가 세션 갱신을 요청할 때 발행하는 이벤트 */
	    SESSION_ACTIVITY: 'brandscope:session-activity',
	    /** brandscope-sdk가 세션 갱신 결과를 응답할 때 발행하는 이벤트 */
	    SESSION_RESPONSE: 'brandscope:session-response',
	};
	/**
	 * 외부 사이트 (카페24 등) 전용 API 엔드포인트
	 * projectToken이 bs-im-* 이 아닌 외부 토큰인 경우 사용됩니다.
	 */
	var EXTERNAL_ALB_ENDPOINT = {
	    PRODUCTION: 'https://behavior-tracking-event-gateway.imweb.me/api/v1/event/external'};
	/**
	 * 아임웹 내부 스쿼드 전용 API 엔드포인트
	 * projectToken이 bs-im-* prefix인 경우 사용됩니다.
	 */
	var INTERNAL_ALB_ENDPOINT = {
	    PRODUCTION: 'https://behavior-tracking-event-gateway.imweb.me/api/v1/event/internal'};
	/**
	 * Project Token 설정
	 * 포맷: {prefix}{uuid-v7}
	 * - 아임웹 내부: bs-im-019d09a9-3c73-78ec-94f0-ea2f7af2ffa1
	 * - 외부 (카페24 등): bs-ext-019d09a9-3c73-78ec-94f0-ea2f7af2ffa1
	 */
	var PROJECT_TOKEN_CONFIG = {
	    /** 허용되는 프리픽스 목록 */
	    VALID_PREFIXES: ['bs-im-', 'bs-ext-'],
	    /** UUID v7 본문 정규식 (8-4-4-4-12 hex) */
	    UUID_V7_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
	    /**
	     * 전체 토큰 포맷 정규식
	     * bs-im-{uuid-v7} 또는 bs-ext-{uuid-v7}
	     */
	    FORMAT_REGEX: /^bs-(im|ext)-[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
	};

	function getSafeSessionStorage() {
	    if (typeof window === 'undefined') {
	        return null;
	    }
	    try {
	        return window.sessionStorage;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	/**
	 * `sessionStorage`에서 값을 가져옵니다.
	 * - 값이 없으면 `null`을 반환합니다.
	 * - 저장 형식은 JSON 문자열을 가정합니다.
	 */
	function getSessionStorage(key) {
	    var storage = getSafeSessionStorage();
	    if (!storage) {
	        return null;
	    }
	    try {
	        var item = storage.getItem(key);
	        return item ? JSON.parse(item) : null;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	/**
	 * `sessionStorage`에 값을 저장합니다.
	 * - 저장 전 `sanitizeValue`를 적용합니다.
	 * - 저장 형식은 JSON 문자열입니다.
	 */
	function setSessionStorage(key, value) {
	    var storage = getSafeSessionStorage();
	    if (!storage) {
	        return;
	    }
	    var sanitizedValue = sanitizeValue(value);
	    try {
	        storage.setItem(key, JSON.stringify(sanitizedValue));
	    }
	    catch (_a) {
	        // Ignore storage errors (quota, blocked storage, private mode restrictions)
	    }
	}

	var COMMON_SESSION_EXPIRED_MS = SESSION_TIMEOUT.COMMON_SESSION_EXPIRED_MS;
	/**
	 * 30분 세션 만료 여부를 확인합니다.
	 * @param updatedAt ISO 8601 형식의 마지막 업데이트 시간
	 * @returns 만료되었으면 true, 유효하면 false
	 */
	function isCommonSessionExpired(updatedAt) {
	    if (!updatedAt)
	        return true;
	    try {
	        var timestamp = new Date(updatedAt).getTime();
	        if (isNaN(timestamp))
	            return true;
	        var elapsed = Date.now() - timestamp;
	        return elapsed >= COMMON_SESSION_EXPIRED_MS;
	    }
	    catch (_a) {
	        return true;
	    }
	}
	/**
	 * Cookie와 localStorage에서 commonSession 데이터를 조회합니다.
	 * Cookie 우선, localStorage fallback.
	 */
	function getCommonSessionData() {
	    var _a, _b, _c;
	    // 1. Cookie에서 먼저 조회
	    var cookieData = getCookie(COOKIE_NAMES.USER_INFO);
	    if (cookieData === null || cookieData === void 0 ? void 0 : cookieData.commonSessionId) {
	        return {
	            id: cookieData.commonSessionId,
	            updatedAt: (_a = cookieData.commonSessionUpdatedAt) !== null && _a !== void 0 ? _a : null,
	        };
	    }
	    // 2. localStorage fallback
	    var localData = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	    return {
	        id: (_b = localData === null || localData === void 0 ? void 0 : localData.commonSessionId) !== null && _b !== void 0 ? _b : null,
	        updatedAt: (_c = localData === null || localData === void 0 ? void 0 : localData.commonSessionUpdatedAt) !== null && _c !== void 0 ? _c : null,
	    };
	}
	/**
	 * commonSessionId를 검증하고 필요시 갱신합니다.
	 * - Cookie + localStorage 둘 다에서 읽기 (fallback)
	 * - 만료되었으면 새 ID 생성
	 * - 유효하면 updatedAt만 갱신 (타이머 리셋)
	 * - Cookie와 localStorage 모두 업데이트
	 * @returns 현재 유효한 commonSessionId
	 */
	function refreshCommonSession() {
	    var _a, _b, _c;
	    var _d = getCommonSessionData(), existingId = _d.id, updatedAt = _d.updatedAt;
	    var now = new Date().toISOString();
	    var newSessionId;
	    if (!existingId || isCommonSessionExpired(updatedAt)) {
	        // 만료 또는 신규 - 새 ID 생성 (sc_ prefix로 Common Session임을 명시)
	        newSessionId = "sc_".concat(generateEventId());
	    }
	    else {
	        // 유효 - 기존 ID 유지, 타이머만 리셋
	        newSessionId = existingId;
	    }
	    // Cookie 업데이트 (landingUrl은 건드리지 않음 — agent.ts의 initialize()에서 관리)
	    var cookieData = (_a = getCookie(COOKIE_NAMES.USER_INFO)) !== null && _a !== void 0 ? _a : {};
	    setCookie(COOKIE_NAMES.USER_INFO, __assign$1(__assign$1({}, cookieData), { commonSessionId: newSessionId, commonSessionUpdatedAt: now }));
	    // localStorage 업데이트 (동일하게 유지)
	    var localData = (_b = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)) !== null && _b !== void 0 ? _b : {};
	    setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, localData), { commonSessionId: newSessionId, commonSessionUpdatedAt: now }));
	    // sessionStorage 업데이트 (syncStorageData에서 덮어쓰기 방지)
	    var sessionData = (_c = getSessionStorage(SESSION_STORAGE_KEYS.USER_INFO)) !== null && _c !== void 0 ? _c : {};
	    setSessionStorage(SESSION_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, sessionData), { commonSessionId: newSessionId, commonSessionUpdatedAt: now }));
	    return newSessionId;
	}
	/**
	 * 현재 유효한 commonSessionId를 반환합니다 (타이머 리셋 없이).
	 * @returns 유효한 세션 ID 또는 만료/없음 시 null
	 */
	function getCurrentCommonSessionId() {
	    var _a = getCommonSessionData(), id = _a.id, updatedAt = _a.updatedAt;
	    if (!id || isCommonSessionExpired(updatedAt)) {
	        return null;
	    }
	    return id;
	}
	/**
	 * 저장소에서 landingUrl을 조회합니다.
	 * localStorage 전용 (cookie 크기 절약을 위해 cookie에 URL을 저장하지 않음).
	 */
	function getLandingUrl() {
	    var _a;
	    var localData = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	    return (_a = localData === null || localData === void 0 ? void 0 : localData.landingUrl) !== null && _a !== void 0 ? _a : null;
	}
	/**
	 * landingUrl을 localStorage에 저장합니다.
	 * cookie: URL이 길면 4KB 초과 위험 → 저장하지 않음
	 * sessionStorage: syncStorageData가 전체 교체하면서 소실됨 → 저장하지 않음
	 * localStorage만 source of truth로 사용.
	 */
	function setLandingUrl(url) {
	    var _a;
	    var localData = (_a = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)) !== null && _a !== void 0 ? _a : {};
	    setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, localData), { landingUrl: url }));
	}

	var DEFAULT_CUSTOM_SESSION_MS = SESSION_TIMEOUT.DEFAULT_CUSTOM_SESSION_MS;
	/**
	 * 모듈 레벨 설정 변수 - 커스텀 세션 타임아웃 (ms)
	 * 기본값: 30분 (사용자가 변경 가능)
	 *
	 * 이 값은 SDK 로드 시 localStorage에서 복원됩니다.
	 * setCustomSessionTimeout() 호출 시 localStorage에도 저장되어
	 * 새로고침/탭 간에도 설정값이 유지됩니다.
	 */
	var customSessionTimeoutMs = DEFAULT_CUSTOM_SESSION_MS;
	/**
	 * localStorage에서 저장된 세션 타임아웃을 복원합니다.
	 * SDK 초기화 시 자동으로 호출됩니다.
	 */
	function restoreCustomSessionTimeout() {
	    try {
	        var stored = getLocalStorage(LOCAL_STORAGE_KEYS.CUSTOM_SESSION_TIMEOUT);
	        if (stored && typeof stored === 'number' && stored > 0) {
	            customSessionTimeoutMs = stored * 60 * 1000;
	            logDebug('[CustomSession] Timeout restored from storage:', stored, 'minutes');
	        }
	    }
	    catch (_a) {
	    }
	}
	// 모듈 로드 시 저장된 타임아웃 복원
	restoreCustomSessionTimeout();
	/**
	 * 커스텀 세션 타임아웃을 분 단위로 설정합니다.
	 * 설정값은 localStorage에 저장되어 새로고침/탭 간에도 유지됩니다.
	 * @param minutes 타임아웃 시간 (분)
	 */
	function setCustomSessionTimeout(minutes) {
	    if (minutes <= 0) {
	        return;
	    }
	    customSessionTimeoutMs = minutes * 60 * 1000;
	    // localStorage에 저장하여 새로고침/탭 간 유지
	    try {
	        setLocalStorage(LOCAL_STORAGE_KEYS.CUSTOM_SESSION_TIMEOUT, minutes);
	        logDebug('[CustomSession] Timeout set and persisted:', minutes, 'minutes');
	    }
	    catch (_a) {
	    }
	}
	/**
	 * 현재 설정된 커스텀 세션 타임아웃을 분 단위로 반환합니다.
	 * @returns 타임아웃 시간 (분)
	 */
	function getCustomSessionTimeout() {
	    return customSessionTimeoutMs / (60 * 1000);
	}
	/**
	 * 커스텀 세션 만료 여부를 확인합니다.
	 * @param updatedAt ISO 8601 형식의 마지막 업데이트 시간
	 * @returns 만료되었으면 true, 유효하면 false
	 */
	function isCustomSessionExpired(updatedAt) {
	    if (!updatedAt)
	        return true;
	    try {
	        var timestamp = new Date(updatedAt).getTime();
	        if (isNaN(timestamp))
	            return true;
	        var elapsed = Date.now() - timestamp;
	        return elapsed >= customSessionTimeoutMs;
	    }
	    catch (_a) {
	        return true;
	    }
	}
	/**
	 * Cookie와 localStorage에서 customSession 데이터를 조회합니다.
	 * Cookie 우선, localStorage fallback.
	 */
	function getCustomSessionData() {
	    var _a, _b, _c;
	    // 1. Cookie에서 먼저 조회
	    var cookieData = getCookie(COOKIE_NAMES.USER_INFO);
	    if (cookieData === null || cookieData === void 0 ? void 0 : cookieData.customSessionId) {
	        return {
	            id: cookieData.customSessionId,
	            updatedAt: (_a = cookieData.customSessionUpdatedAt) !== null && _a !== void 0 ? _a : null,
	        };
	    }
	    // 2. localStorage fallback
	    var localData = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	    return {
	        id: (_b = localData === null || localData === void 0 ? void 0 : localData.customSessionId) !== null && _b !== void 0 ? _b : null,
	        updatedAt: (_c = localData === null || localData === void 0 ? void 0 : localData.customSessionUpdatedAt) !== null && _c !== void 0 ? _c : null,
	    };
	}
	/**
	 * customSessionId를 검증하고 필요시 갱신합니다.
	 * - Cookie + localStorage 둘 다에서 읽기 (fallback)
	 * - 만료되었으면 새 ID 생성
	 * - 유효하면 updatedAt만 갱신 (타이머 리셋)
	 * - Cookie와 localStorage 모두 업데이트
	 * @returns 현재 유효한 customSessionId
	 */
	function refreshCustomSession() {
	    var _a, _b, _c;
	    var _d = getCustomSessionData(), existingId = _d.id, updatedAt = _d.updatedAt;
	    var now = new Date().toISOString();
	    var newSessionId;
	    if (!existingId || isCustomSessionExpired(updatedAt)) {
	        // 만료 또는 신규 - 새 ID 생성 (cs_ prefix로 Custom Session임을 명시)
	        newSessionId = "cs_".concat(generateEventId());
	    }
	    else {
	        // 유효 - 기존 ID 유지, 타이머만 리셋
	        newSessionId = existingId;
	    }
	    // Cookie 업데이트
	    var cookieData = (_a = getCookie(COOKIE_NAMES.USER_INFO)) !== null && _a !== void 0 ? _a : {};
	    setCookie(COOKIE_NAMES.USER_INFO, __assign$1(__assign$1({}, cookieData), { customSessionId: newSessionId, customSessionUpdatedAt: now }));
	    // localStorage 업데이트 (동일하게 유지)
	    var localData = (_b = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)) !== null && _b !== void 0 ? _b : {};
	    setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, localData), { customSessionId: newSessionId, customSessionUpdatedAt: now }));
	    // sessionStorage 업데이트 (syncStorageData에서 덮어쓰기 방지)
	    var sessionData = (_c = getSessionStorage(SESSION_STORAGE_KEYS.USER_INFO)) !== null && _c !== void 0 ? _c : {};
	    setSessionStorage(SESSION_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, sessionData), { customSessionId: newSessionId, customSessionUpdatedAt: now }));
	    return newSessionId;
	}
	/**
	 * 현재 유효한 customSessionId를 반환합니다 (타이머 리셋 없이).
	 * @returns 유효한 세션 ID 또는 만료/없음 시 null
	 */
	function getCurrentCustomSessionId() {
	    var _a = getCustomSessionData(), id = _a.id, updatedAt = _a.updatedAt;
	    if (!id || isCustomSessionExpired(updatedAt)) {
	        return null;
	    }
	    return id;
	}

	/**
	 * 문자열이나 다른 타입의 값을 정수로 변환
	 */
	function toInt(value) {
	    if (typeof value === 'number') {
	        return Math.round(value);
	    }
	    if (typeof value === 'string') {
	        return parseInt(value, 10);
	    }
	    return NaN;
	}
	/**
	 * NaN 값을 대체값으로 변환
	 */
	function replaceNaN(value, fallback) {
	    return isNaN(value) ? fallback : value;
	}

	/**
	 * 화면 해상도를 가져오는 함수
	 *
	 * @returns `[width, height]` — screen.width / screen.height 를 그대로 반환한다.
	 *          값을 얻을 수 없는 항목은 null.
	 *
	 * 주의: 예전에는 내림차순 정렬로 항상 [장변, 단변]을 반환했다. FingerprintJS
	 * 계열에서 기기 회전과 무관하게 지문을 안정시키려고 쓰는 정규화인데, 이 SDK는
	 * 그 값을 분석용 screenWidth/screenHeight로 전송하므로 세로 모드 기기의
	 * 가로·세로가 뒤바뀐 채 수집됐다(예: iPhone 390x844 → width=844, height=390).
	 */
	function getScreenResolution() {
	    try {
	        var s = window.screen;
	        if (!s) {
	            return [null, null];
	        }
	        // 브라우저 플러그인에 의해 문자열로 반환되거나
	        // 핑거프린팅 방지를 위해 변조된 값일 수 있으므로 안전하게 파싱
	        var parseDimension = function (value) { return replaceNaN(toInt(value), null); };
	        // 정렬하지 않는다 — 세로 모드 기기의 가로/세로가 뒤바뀌면 안 된다.
	        return [parseDimension(s.width), parseDimension(s.height)];
	    }
	    catch (error) {
	        return [null, null];
	    }
	}

	function nullifyEmptyValue(value) {
	    return value === undefined || value === '' ? null : value;
	}

	function getEventCodeBook(evenType) {
	    var code = distExports.EventCode[evenType];
	    if (!code) {
	        throw new Error("Invalid event type: ".concat(evenType));
	    }
	    return code;
	}

	// NOTE: this list must be up-to-date with browsers listed in
	// test/acceptance/useragentstrings.yml
	var BROWSER_ALIASES_MAP = {
	    'Amazon Silk': 'amazon_silk',
	    'Android Browser': 'android',
	    Bada: 'bada',
	    BlackBerry: 'blackberry',
	    Chrome: 'chrome',
	    Chromium: 'chromium',
	    Electron: 'electron',
	    Epiphany: 'epiphany',
	    Firefox: 'firefox',
	    Focus: 'focus',
	    Generic: 'generic',
	    'Google Search': 'google_search',
	    Googlebot: 'googlebot',
	    'Internet Explorer': 'ie',
	    'K-Meleon': 'k_meleon',
	    Maxthon: 'maxthon',
	    'Microsoft Edge': 'edge',
	    'MZ Browser': 'mz',
	    'NAVER Whale Browser': 'naver',
	    Opera: 'opera',
	    'Opera Coast': 'opera_coast',
	    'Pale Moon': 'pale_moon',
	    PhantomJS: 'phantomjs',
	    Puffin: 'puffin',
	    QupZilla: 'qupzilla',
	    QQ: 'qq',
	    QQLite: 'qqlite',
	    Safari: 'safari',
	    Sailfish: 'sailfish',
	    'Samsung Internet for Android': 'samsung_internet',
	    SeaMonkey: 'seamonkey',
	    Sleipnir: 'sleipnir',
	    Swing: 'swing',
	    Tizen: 'tizen',
	    'UC Browser': 'uc',
	    Vivaldi: 'vivaldi',
	    'WebOS Browser': 'webos',
	    WeChat: 'wechat',
	    'Yandex Browser': 'yandex',
	    Roku: 'roku',
	};
	var BROWSER_MAP = {
	    amazon_silk: 'Amazon Silk',
	    android: 'Android Browser',
	    bada: 'Bada',
	    blackberry: 'BlackBerry',
	    chrome: 'Chrome',
	    chromium: 'Chromium',
	    electron: 'Electron',
	    epiphany: 'Epiphany',
	    firefox: 'Firefox',
	    focus: 'Focus',
	    generic: 'Generic',
	    googlebot: 'Googlebot',
	    google_search: 'Google Search',
	    ie: 'Internet Explorer',
	    k_meleon: 'K-Meleon',
	    maxthon: 'Maxthon',
	    edge: 'Microsoft Edge',
	    mz: 'MZ Browser',
	    naver: 'NAVER Whale Browser',
	    opera: 'Opera',
	    opera_coast: 'Opera Coast',
	    pale_moon: 'Pale Moon',
	    phantomjs: 'PhantomJS',
	    puffin: 'Puffin',
	    qupzilla: 'QupZilla',
	    qq: 'QQ Browser',
	    qqlite: 'QQ Browser Lite',
	    safari: 'Safari',
	    sailfish: 'Sailfish',
	    samsung_internet: 'Samsung Internet for Android',
	    seamonkey: 'SeaMonkey',
	    sleipnir: 'Sleipnir',
	    swing: 'Swing',
	    tizen: 'Tizen',
	    uc: 'UC Browser',
	    vivaldi: 'Vivaldi',
	    webos: 'WebOS Browser',
	    wechat: 'WeChat',
	    yandex: 'Yandex Browser',
	};
	var PLATFORMS_MAP = {
	    tablet: 'tablet',
	    mobile: 'mobile',
	    desktop: 'desktop',
	    tv: 'tv',
	    bot: 'bot',
	    etc: 'etc',
	};
	var OS_MAP = {
	    WindowsPhone: 'Windows Phone',
	    Windows: 'Windows',
	    MacOS: 'macOS',
	    iOS: 'iOS',
	    Android: 'Android',
	    WebOS: 'WebOS',
	    BlackBerry: 'BlackBerry',
	    Bada: 'Bada',
	    Tizen: 'Tizen',
	    Linux: 'Linux',
	    ChromeOS: 'Chrome OS',
	    PlayStation4: 'PlayStation 4',
	    Roku: 'Roku',
	};
	var ENGINE_MAP = {
	    EdgeHTML: 'EdgeHTML',
	    Blink: 'Blink',
	    Trident: 'Trident',
	    Presto: 'Presto',
	    Gecko: 'Gecko',
	    WebKit: 'WebKit',
	};

	var Utils = /** @class */ (function () {
	    function Utils() {
	    }
	    /**
	     * Get first matched item for a string
	     * @param {RegExp} regexp
	     * @param {string} ua
	     * @return {string}
	     */
	    Utils.getFirstMatch = function (regexp, ua) {
	        var match = ua.match(regexp);
	        return (match && match.length > 0 && match[1]) || '';
	    };
	    /**
	     * Get second matched item for a string
	     * @param regexp
	     * @param {string} ua
	     * @return {string}
	     */
	    Utils.getSecondMatch = function (regexp, ua) {
	        var match = ua.match(regexp);
	        return (match && match.length > 1 && match[2]) || '';
	    };
	    /**
	     * Match a regexp and return a constant or undefined
	     * @param {RegExp} regexp
	     * @param {string} ua
	     * @param {T} _const Any const that will be returned if regexp matches the string
	     * @return {T | undefined}
	     */
	    Utils.matchAndReturnConst = function (regexp, ua, _const) {
	        if (regexp.test(ua)) {
	            return _const;
	        }
	        return undefined;
	    };
	    Utils.getWindowsVersionName = function (version) {
	        switch (version) {
	            case 'NT':
	                return 'NT';
	            case 'XP':
	                return 'XP';
	            case 'NT 5.0':
	                return '2000';
	            case 'NT 5.1':
	                return 'XP';
	            case 'NT 5.2':
	                return '2003';
	            case 'NT 6.0':
	                return 'Vista';
	            case 'NT 6.1':
	                return '7';
	            case 'NT 6.2':
	                return '8';
	            case 'NT 6.3':
	                return '8.1';
	            case 'NT 10.0':
	                return '10';
	            default:
	                return undefined;
	        }
	    };
	    /**
	     * Get macOS version name
	     *    10.5 - Leopard
	     *    10.6 - Snow Leopard
	     *    10.7 - Lion
	     *    10.8 - Mountain Lion
	     *    10.9 - Mavericks
	     *    10.10 - Yosemite
	     *    10.11 - El Capitan
	     *    10.12 - Sierra
	     *    10.13 - High Sierra
	     *    10.14 - Mojave
	     *    10.15 - Catalina
	     *
	     * @example
	     *   getMacOSVersionName("10.14") // 'Mojave'
	     *
	     * @param  {string} version
	     * @return {string | undefined} versionName
	     */
	    Utils.getMacOSVersionName = function (version) {
	        var v = version
	            .split('.')
	            .splice(0, 2)
	            .map(function (s) { return parseInt(s, 10) || 0; });
	        v.push(0);
	        if (v[0] !== 10)
	            return undefined;
	        switch (v[1]) {
	            case 5:
	                return 'Leopard';
	            case 6:
	                return 'Snow Leopard';
	            case 7:
	                return 'Lion';
	            case 8:
	                return 'Mountain Lion';
	            case 9:
	                return 'Mavericks';
	            case 10:
	                return 'Yosemite';
	            case 11:
	                return 'El Capitan';
	            case 12:
	                return 'Sierra';
	            case 13:
	                return 'High Sierra';
	            case 14:
	                return 'Mojave';
	            case 15:
	                return 'Catalina';
	            default:
	                return undefined;
	        }
	    };
	    /**
	     * Get Android version name
	     *    1.5 - Cupcake
	     *    1.6 - Donut
	     *    2.0 - Eclair
	     *    2.1 - Eclair
	     *    2.2 - Froyo
	     *    2.x - Gingerbread
	     *    3.x - Honeycomb
	     *    4.0 - Ice Cream Sandwich
	     *    4.1 - Jelly Bean
	     *    4.4 - KitKat
	     *    5.x - Lollipop
	     *    6.x - Marshmallow
	     *    7.x - Nougat
	     *    8.x - Oreo
	     *    9.x - Pie
	     *
	     * @example
	     *   getAndroidVersionName("7.0") // 'Nougat'
	     *
	     * @param  {string} version
	     * @return {string | undefined} versionName
	     */
	    Utils.getAndroidVersionName = function (version) {
	        var v = version
	            .split('.')
	            .splice(0, 2)
	            .map(function (s) { return parseInt(s, 10) || 0; });
	        v.push(0);
	        if (v[0] === 1 && v[1] < 5)
	            return undefined;
	        if (v[0] === 1 && v[1] < 6)
	            return 'Cupcake';
	        if (v[0] === 1 && v[1] >= 6)
	            return 'Donut';
	        if (v[0] === 2 && v[1] < 2)
	            return 'Eclair';
	        if (v[0] === 2 && v[1] === 2)
	            return 'Froyo';
	        if (v[0] === 2 && v[1] > 2)
	            return 'Gingerbread';
	        if (v[0] === 3)
	            return 'Honeycomb';
	        if (v[0] === 4 && v[1] < 1)
	            return 'Ice Cream Sandwich';
	        if (v[0] === 4 && v[1] < 4)
	            return 'Jelly Bean';
	        if (v[0] === 4 && v[1] >= 4)
	            return 'KitKat';
	        if (v[0] === 5)
	            return 'Lollipop';
	        if (v[0] === 6)
	            return 'Marshmallow';
	        if (v[0] === 7)
	            return 'Nougat';
	        if (v[0] === 8)
	            return 'Oreo';
	        if (v[0] === 9)
	            return 'Pie';
	        return undefined;
	    };
	    /**
	     * Get version precisions count
	     *
	     * @example
	     *   getVersionPrecision("1.10.3") // 3
	     *
	     * @param  {string} version
	     * @return {number}
	     */
	    Utils.getVersionPrecision = function (version) {
	        return version.split('.').length;
	    };
	    /**
	     * Calculate browser version weight
	     *
	     * @example
	     *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
	     *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
	     *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
	     *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
	     *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
	     *
	     * @param {string} versionA versions versions to compare
	     * @param {string} versionB versions versions to compare
	     * @param {boolean} [isLoose] enable loose comparison
	     * @return {number} comparison result: -1 when versionA is lower,
	     * 1 when versionA is bigger, 0 when both equal
	     */
	    Utils.compareVersions = function (versionA, versionB, isLoose) {
	        if (isLoose === void 0) { isLoose = false; }
	        // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
	        var versionAPrecision = Utils.getVersionPrecision(versionA);
	        var versionBPrecision = Utils.getVersionPrecision(versionB);
	        var precision = Math.max(versionAPrecision, versionBPrecision);
	        var lastPrecision = 0;
	        var chunks = Utils.map([versionA, versionB], function (version) {
	            var delta = precision - Utils.getVersionPrecision(version);
	            // 2) "9" -> "9.0" (for precision = 2)
	            var _version = version + new Array(delta + 1).join('.0');
	            // 3) "9.0" -> ["000000000"", "000000009"]
	            return Utils.map(_version.split('.'), function (chunk) { return new Array(20 - chunk.length).join('0') + chunk; }).reverse();
	        });
	        // adjust precision for loose comparison
	        if (isLoose) {
	            lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
	        }
	        // iterate in reverse order by reversed chunks array
	        precision -= 1;
	        while (precision >= lastPrecision) {
	            // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
	            if (chunks[0][precision] > chunks[1][precision]) {
	                return 1;
	            }
	            if (chunks[0][precision] === chunks[1][precision]) {
	                if (precision === lastPrecision) {
	                    // all version chunks are same
	                    return 0;
	                }
	                precision -= 1;
	            }
	            else if (chunks[0][precision] < chunks[1][precision]) {
	                return -1;
	            }
	        }
	        return 0;
	    };
	    /**
	     * Array::map polyfill
	     *
	     * @param  {T[]} arr
	     * @param  {(item: T, index: number, array: T[]) => U} iterator
	     * @return {U[]}
	     */
	    Utils.map = function (arr, iterator) {
	        var result = [];
	        var i;
	        if (Array.prototype.map) {
	            return Array.prototype.map.call(arr, iterator);
	        }
	        for (i = 0; i < arr.length; i += 1) {
	            result.push(iterator(arr[i], i, arr));
	        }
	        return result;
	    };
	    /**
	     * Array::find polyfill
	     *
	     * @param  {T[]} arr
	     * @param  {(value: T, index: number, obj: T[]) => boolean} predicate
	     * @return {T | undefined}
	     */
	    Utils.find = function (arr, predicate) {
	        var i;
	        var l;
	        if (Array.prototype.find) {
	            return Array.prototype.find.call(arr, predicate);
	        }
	        for (i = 0, l = arr.length; i < l; i += 1) {
	            var value = arr[i];
	            if (predicate(value, i, arr)) {
	                return value;
	            }
	        }
	        return undefined;
	    };
	    /**
	     * Object::assign polyfill
	     *
	     * @param  {T} obj
	     * @param  {...U[]} assigners
	     * @return {T & U[number]}
	     */
	    Utils.assign = function (obj) {
	        var assigners = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            assigners[_i - 1] = arguments[_i];
	        }
	        if (Object.assign) {
	            return Object.assign.apply(Object, __spreadArray$1([obj], assigners, false));
	        }
	        var result = __assign$1({}, obj);
	        var _loop_1 = function (i) {
	            var assigner = assigners[i];
	            if (typeof assigner === 'object' && assigner !== null) {
	                Object.keys(assigner).forEach(function (key) {
	                    result[key] = assigner[key];
	                });
	            }
	        };
	        for (var i = 0; i < assigners.length; i++) {
	            _loop_1(i);
	        }
	        return result;
	    };
	    /**
	     * Get short version/alias for a browser name
	     *
	     * @example
	     *   getBrowserAlias('Microsoft Edge') // edge
	     *
	     * @param  {string} browserName
	     * @return {string}
	     */
	    Utils.getBrowserAlias = function (browserName) {
	        return BROWSER_ALIASES_MAP[browserName] || '';
	    };
	    /**
	     * Get browser name for a short version/alias
	     *
	     * @example
	     *   getBrowserTypeByAlias('edge') // Microsoft Edge
	     *
	     * @param  {string} browserAlias
	     * @return {string}
	     */
	    Utils.getBrowserTypeByAlias = function (browserAlias) {
	        return BROWSER_MAP[browserAlias] || '';
	    };
	    return Utils;
	}());

	/**
	 * Browsers' descriptors
	 *
	 * The idea of descriptors is simple. You should know about them two simple things:
	 * 1. Every descriptor has a method or property called `test` and a `describe` method.
	 * 2. Order of descriptors is important.
	 *
	 * More details:
	 * 1. Method or property `test` serves as a way to detect whether the UA string
	 * matches some certain browser or not. The `describe` method helps to make a result
	 * object with params that show some browser-specific things: name, version, etc.
	 * 2. Order of descriptors is important because a Parser goes through them one by one
	 * in course. For example, if you insert Chrome's descriptor as the first one,
	 * more then a half of browsers will be described as Chrome, because they will pass
	 * the Chrome descriptor's test.
	 *
	 * Descriptor's `test` could be a property with an array of RegExps, where every RegExp
	 * will be applied to a UA string to test it whether it matches or not.
	 * If a descriptor has two or more regexps in the `test` array it tests them one by one
	 * with a logical sum operation. Parser stops if it has found any RegExp that matches the UA.
	 *
	 * Or `test` could be a method. In that case it gets a Parser instance and should
	 * return true/false to get the Parser know if this browser descriptor matches the UA or not.
	 */
	var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
	var browsersList = [
	    /* ==================== IN-APP BROWSER DETECTION ==================== */
	    /* Facebook In-App Browser (FBAN format: [FBAN/FB4A;FBAV/543.0.0...]) */
	    {
	        test: [/\[fban\//i, /fbav\//i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Facebook In-App Browser',
	            };
	            // Extract version from FBAV/xxx.x.x.x format
	            var version = Utils.getFirstMatch(/fbav\/(\d+(?:\.\d+)*)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* ==================== BOT DETECTION ==================== */
	    /* Googlebot (includes Googlebot-Image, Googlebot-Video, Googlebot-News) */
	    {
	        test: [/googlebot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Googlebot',
	            };
	            var version = Utils.getFirstMatch(/googlebot(?:-(?:image|video|news))?\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Storebot-Google (Google Shopping) */
	    {
	        test: [/storebot-google/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Storebot-Google',
	            };
	            var version = Utils.getFirstMatch(/storebot-google\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Google-InspectionTool (Google Search Console) */
	    {
	        test: [/google-inspectiontool/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google-InspectionTool',
	            };
	            var version = Utils.getFirstMatch(/google-inspectiontool\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* GoogleOther (Google R&D) */
	    {
	        test: [/googleother/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'GoogleOther',
	            };
	            var version = Utils.getFirstMatch(/googleother(?:-(?:image|video))?\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Google-CloudVertexBot (Google Vertex AI) */
	    {
	        test: [/google-cloudvertexbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google-CloudVertexBot',
	            };
	            var version = Utils.getFirstMatch(/google-cloudvertexbot\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* AdsBot-Google (Google Ads quality check) */
	    {
	        test: [/adsbot-google/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'AdsBot-Google',
	            };
	            var version = Utils.getFirstMatch(/adsbot-google(?:-mobile)?\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Mediapartners-Google (Google AdSense) */
	    {
	        test: [/mediapartners-google/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Mediapartners-Google',
	            };
	            var version = Utils.getFirstMatch(/mediapartners-google\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Gemini-Deep-Research (Google Gemini AI) */
	    {
	        test: [/gemini-deep-research/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Gemini-Deep-Research',
	            };
	            var version = Utils.getFirstMatch(/gemini-deep-research\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Google-Extended (Google AI training control) */
	    {
	        test: [/google-extended/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google-Extended',
	            };
	            var version = Utils.getFirstMatch(/google-extended\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Google-NotebookLM - User-triggered fetcher: 사용자가 소스로 추가한 URL fetch */
	    {
	        test: [/google-notebooklm/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google-NotebookLM',
	            };
	            var version = Utils.getFirstMatch(/google-notebooklm\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* GoogleAgent-Mariner (Google Mariner) */
	    {
	        test: [/googleagent-mariner/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'GoogleAgent-Mariner',
	            };
	            var version = Utils.getFirstMatch(/googleagent-mariner\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Google-Pinpoint - User-triggered fetcher: Pinpoint 사용자가 선택한 소스 fetch */
	    {
	        test: [/google-pinpoint/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google-Pinpoint',
	            };
	            var version = Utils.getFirstMatch(/google-pinpoint\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Applebot-Extended (Apple AI training) */
	    {
	        test: [/applebot-extended/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Applebot-Extended',
	            };
	            var version = Utils.getFirstMatch(/applebot-extended\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Applebot */
	    {
	        test: [/applebot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Applebot',
	            };
	            var version = Utils.getFirstMatch(/applebot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* GPTBot (OpenAI) */
	    {
	        test: [/gptbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'GPTBot',
	            };
	            var version = Utils.getFirstMatch(/gptbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* ChatGPT-User (OpenAI) - User-triggered fetcher: 사용자가 URL 읽기 요청 시 작동 */
	    {
	        test: [/chatgpt-user/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'ChatGPT-User',
	            };
	            var version = Utils.getFirstMatch(/chatgpt-user\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* OAI-SearchBot (OpenAI) */
	    {
	        test: [/oai-searchbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'OAI-SearchBot',
	            };
	            var version = Utils.getFirstMatch(/oai-searchbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* ClaudeBot (Anthropic) - Crawler */
	    {
	        test: [/claudebot/i, /claude-web/i, /claude-searchbot/i, /anthropic-ai/i, /anthropic-claude/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'ClaudeBot',
	            };
	            var version = Utils.getFirstMatch(/(?:claudebot|claude-web|claude-searchbot|anthropic-ai|anthropic-claude)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Claude-User (Anthropic) - User-triggered fetcher: 사용자가 URL 읽기 요청 시 작동 */
	    {
	        test: [/claude-user/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Claude-User',
	            };
	            var version = Utils.getFirstMatch(/claude-user\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* AmazonBot */
	    {
	        test: [/amazonbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'AmazonBot',
	            };
	            var version = Utils.getFirstMatch(/amazonbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Amzn-SearchBot (Amazon Search) */
	    {
	        test: [/amzn-searchbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Amzn-SearchBot',
	            };
	            var version = Utils.getFirstMatch(/amzn-searchbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* BingBot (Microsoft) */
	    {
	        test: [/bingbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'BingBot',
	            };
	            var version = Utils.getFirstMatch(/bingbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* BingPreview (Microsoft) */
	    {
	        test: [/bingpreview/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'BingPreview',
	            };
	            var version = Utils.getFirstMatch(/bingpreview\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Yahoo Slurp */
	    {
	        test: [/slurp/i, /yahoo!\s*slurp/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Yahoo-Slurp',
	            };
	            var version = Utils.getFirstMatch(/slurp\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* SeznamBot (Czech search engine) */
	    {
	        test: [/seznambot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SeznamBot',
	            };
	            var version = Utils.getFirstMatch(/seznambot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Exabot (Exalead) */
	    {
	        test: [/exabot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Exabot',
	            };
	            var version = Utils.getFirstMatch(/exabot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Qwant */
	    {
	        test: [/qwantify/i, /qwantbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Qwant',
	            };
	            var version = Utils.getFirstMatch(/(?:qwantify|qwantbot)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Yeti (Naver - Korean search engine) */
	    {
	        test: [/\byeti\b/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Yeti',
	            };
	            var version = Utils.getFirstMatch(/yeti\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Daum (Korean search engine) */
	    {
	        test: [/\bdaum\b/i, /daumoa/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Daum',
	            };
	            var version = Utils.getFirstMatch(/(?:daum|daumoa)\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* PerplexityBot */
	    {
	        test: [/perplexitybot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'PerplexityBot',
	            };
	            var version = Utils.getFirstMatch(/perplexitybot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Perplexity-User - User-triggered fetcher: 사용자 질문 답변용 페이지 fetch (robots.txt 무시 가능) */
	    {
	        test: [/perplexity-user/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Perplexity-User',
	            };
	            var version = Utils.getFirstMatch(/perplexity-user\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Bytespider (ByteDance/TikTok) */
	    {
	        test: [/bytespider/i, /bytedance/i, /tiktokspider/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Bytespider',
	            };
	            var version = Utils.getFirstMatch(/(?:bytespider|bytedance|tiktokspider)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Meta External Agent (Facebook/Meta) */
	    {
	        test: [/meta-externalagent/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Meta-ExternalAgent',
	            };
	            var version = Utils.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Meta-WebIndexer (Meta AI training/search) */
	    {
	        test: [/meta-webindexer/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Meta-WebIndexer',
	            };
	            var version = Utils.getFirstMatch(/meta-webindexer\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* CCBot (Common Crawl) */
	    {
	        test: [/ccbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'CCBot',
	            };
	            var version = Utils.getFirstMatch(/ccbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DeepseekBot */
	    {
	        test: [/deepseekbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DeepseekBot',
	            };
	            var version = Utils.getFirstMatch(/deepseekbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* MistralAI-User (Mistral) - User-triggered fetcher: Le Chat 사용자 요청 기반 웹 fetch */
	    {
	        test: [/mistralai-user/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'MistralAI-User',
	            };
	            var version = Utils.getFirstMatch(/mistralai-user\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Diffbot (Data extraction service) */
	    {
	        test: [/diffbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Diffbot',
	            };
	            var version = Utils.getFirstMatch(/diffbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Webzio (Data extraction service) */
	    {
	        test: [/webzio/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Webzio',
	            };
	            var version = Utils.getFirstMatch(/webzio\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* ICC-Crawler (Data extraction service) */
	    {
	        test: [/icc-crawler/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'ICC-Crawler',
	            };
	            var version = Utils.getFirstMatch(/icc-crawler\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Cohere-AI (Cohere AI) */
	    {
	        test: [/cohere-ai/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Cohere-AI',
	            };
	            var version = Utils.getFirstMatch(/cohere-ai\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* YouBot (You.com) */
	    {
	        test: [/youbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'YouBot',
	            };
	            var version = Utils.getFirstMatch(/youbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* xAI-Bot (xAI/Grok) */
	    {
	        test: [/xai-bot/i, /xai\.bot/i, /grokbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'xAI-Bot',
	            };
	            var version = Utils.getFirstMatch(/(?:xai-bot|xai\.bot|grokbot)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Groq-Bot (Groq) */
	    {
	        test: [/groq-bot/i, /groqbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Groq-Bot',
	            };
	            var version = Utils.getFirstMatch(/(?:groq-bot|groqbot)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* AI2Bot (Allen Institute for AI) */
	    {
	        test: [/ai2bot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'AI2Bot',
	            };
	            var version = Utils.getFirstMatch(/ai2bot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* HuggingFace-Bot (HuggingFace) */
	    {
	        test: [/huggingface/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'HuggingFace-Bot',
	            };
	            var version = Utils.getFirstMatch(/huggingface\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* FirecrawlAgent (Firecrawl) */
	    {
	        test: [/firecrawl/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'FirecrawlAgent',
	            };
	            var version = Utils.getFirstMatch(/firecrawl\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Andibot (Andi Search) */
	    {
	        test: [/andibot/i, /andisearch/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Andibot',
	            };
	            var version = Utils.getFirstMatch(/(?:andibot|andisearch)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Character-AI (Character.AI) */
	    {
	        test: [/character\.ai/i, /characterai/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Character-AI',
	            };
	            var version = Utils.getFirstMatch(/(?:character\.ai|characterai)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Devin (Cognition Labs) - AI software engineer agent */
	    {
	        test: [/cognition-ai/i, /devin-ai/i, /\bdevin\b.*(?:bot|crawl|agent)/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Devin',
	            };
	            var version = Utils.getFirstMatch(/(?:devin|cognition-ai)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Together-Bot (Together AI) */
	    {
	        test: [/together-ai/i, /togetherbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Together-Bot',
	            };
	            var version = Utils.getFirstMatch(/(?:together-ai|togetherbot)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Replicate-Bot (Replicate) - AI model hosting platform */
	    {
	        test: [/replicate-bot/i, /replicate\.com/i, /replicatebot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Replicate-Bot',
	            };
	            var version = Utils.getFirstMatch(/replicate\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Brightbot (Bright Data) */
	    {
	        test: [/brightbot/i, /brightdata/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Brightbot',
	            };
	            var version = Utils.getFirstMatch(/(?:brightbot|brightdata)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Crawlspace (AI data extraction) */
	    {
	        test: [/crawlspace/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Crawlspace',
	            };
	            var version = Utils.getFirstMatch(/crawlspace\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* MSNBot (Microsoft) */
	    {
	        test: [/msnbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'MSNBot',
	            };
	            var version = Utils.getFirstMatch(/msnbot(?:-media)?\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* LinkedInBot */
	    {
	        test: [/linkedinbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'LinkedInBot',
	            };
	            var version = Utils.getFirstMatch(/linkedinbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DuckDuckBot */
	    {
	        test: [/duckduckbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DuckDuckBot',
	            };
	            var version = Utils.getFirstMatch(/duckduckbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DuckAssistBot (DuckDuckGo) - User-triggered fetcher: DuckAssist 요약/답변용 */
	    {
	        test: [/duckassistbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DuckAssistBot',
	            };
	            var version = Utils.getFirstMatch(/duckassistbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* YandexBot */
	    {
	        test: [/yandexbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'YandexBot',
	            };
	            var version = Utils.getFirstMatch(/yandexbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Baiduspider (Baidu) */
	    {
	        test: [/baiduspider/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Baiduspider',
	            };
	            var version = Utils.getFirstMatch(/baiduspider\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Sogou Spider */
	    {
	        test: [/sogou\s?(web\s?)?spider/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SogouSpider',
	            };
	            var version = Utils.getFirstMatch(/sogou\s?(?:web\s?)?spider\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Facebook External Hit */
	    {
	        test: [/facebookexternalhit/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'FacebookExternalHit',
	            };
	            var version = Utils.getFirstMatch(/facebookexternalhit\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Twitterbot */
	    {
	        test: [/twitterbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Twitterbot',
	            };
	            var version = Utils.getFirstMatch(/twitterbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Slackbot */
	    {
	        test: [/slackbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Slackbot',
	            };
	            var version = Utils.getFirstMatch(/slackbot(?:-linkexpanding)?\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Discordbot */
	    {
	        test: [/discordbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Discordbot',
	            };
	            var version = Utils.getFirstMatch(/discordbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Telegrambot */
	    {
	        test: [/telegrambot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'TelegramBot',
	            };
	            var version = Utils.getFirstMatch(/telegrambot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* WhatsApp - Link Preview Bot: 메시지 내 URL 미리보기 생성용
	     * Bot UA: "WhatsApp/2.23.20.0 A" (starts with WhatsApp)
	     * In-app browser UA: "Mozilla/5.0 ... WhatsApp/2.21.4.22" (should be detected as Chrome/Safari)
	     */
	    {
	        test: function (parser) {
	            // Only match if UA starts with WhatsApp (bot), not in-app browser
	            var hasWhatsApp = parser.test(/whatsapp/i);
	            var startsWithMozilla = parser.test(/^mozilla/i);
	            return hasWhatsApp && !startsWithMozilla;
	        },
	        describe: function (ua) {
	            var browser = {
	                name: 'WhatsApp',
	            };
	            var version = Utils.getFirstMatch(/whatsapp\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DingTalkBot */
	    {
	        test: [/dingtalkbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DingTalkBot',
	            };
	            var version = Utils.getFirstMatch(/dingtalkbot(?:-linkservice)?\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* PinterestBot */
	    {
	        test: [/pinterestbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'PinterestBot',
	            };
	            var version = Utils.getFirstMatch(/pinterestbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* SkypeURIPreview (Microsoft Teams/Skype) */
	    {
	        test: [/skypeuripreview/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SkypeURIPreview',
	            };
	            var version = Utils.getFirstMatch(/skypeuripreview\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* KakaoStory OG Reader (Kakao - Korean) */
	    {
	        test: [/kakaostory-og-reader/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'KakaoStory-OG-Reader',
	            };
	            var version = Utils.getFirstMatch(/kakaostory-og-reader\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* UptimeRobot (Monitoring) */
	    {
	        test: [/uptimerobot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'UptimeRobot',
	            };
	            var version = Utils.getFirstMatch(/uptimerobot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* StatusCake (Monitoring) */
	    {
	        test: [/statuscake/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'StatusCake',
	            };
	            var version = Utils.getFirstMatch(/statuscake\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Pingdom (Monitoring) */
	    {
	        test: [/pingdom/i, /pingdomtms/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Pingdom',
	            };
	            var version = Utils.getFirstMatch(/(?:pingdom|pingdomtms)\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Semrush Bot */
	    {
	        test: [/semrushbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SemrushBot',
	            };
	            var version = Utils.getFirstMatch(/semrushbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Ahrefs Bot */
	    {
	        test: [/ahrefsbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'AhrefsBot',
	            };
	            var version = Utils.getFirstMatch(/ahrefsbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* MJ12bot (Majestic) */
	    {
	        test: [/mj12bot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'MJ12Bot',
	            };
	            var version = Utils.getFirstMatch(/mj12bot\/v?(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DotBot (Moz) */
	    {
	        test: [/dotbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DotBot',
	            };
	            var version = Utils.getFirstMatch(/dotbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* PetalBot (Huawei) */
	    {
	        test: [/petalbot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'PetalBot',
	            };
	            var version = Utils.getFirstMatch(/petalbot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* DataForSeoBot */
	    {
	        test: [/dataforseobot/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'DataForSeoBot',
	            };
	            var version = Utils.getFirstMatch(/dataforseobot\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Generic Bot Detection - catches bots with common patterns */
	    {
	        test: [
	            /bot(?:[\s\-_\/;@()]|$)/i,
	            /crawler/i,
	            /spider/i,
	            /scraper/i,
	            /headless/i,
	            /playwright/i,
	            /puppeteer/i,
	            /selenium/i,
	        ],
	        describe: function (ua) {
	            var browser = {
	                name: 'Bot',
	            };
	            // Try to extract bot name from common patterns
	            var botName = Utils.getFirstMatch(/([a-z0-9\-_]+)(?:bot|crawler|spider|scraper)/i, ua) ||
	                Utils.getFirstMatch(/([a-z0-9\-_]+)[\s\-_\/](\d+(\.\d+)*)/i, ua);
	            if (botName && botName.length > 1) {
	                browser.name = botName.charAt(0).toUpperCase() + botName.slice(1) + 'Bot';
	            }
	            var version = Utils.getFirstMatch(/\/(\d+(\.\d+)*)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Opera < 13.0 */
	    {
	        test: [/opera/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Opera',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Opera > 13.0 */
	    {
	        test: [/opr\/|opios/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Opera',
	            };
	            var version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/SamsungBrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Samsung Internet for Android',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/Whale/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'NAVER Whale Browser',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/PaleMoon/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Pale Moon',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:PaleMoon)[\s/](\d+(?:\.\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/MZBrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'MZ Browser',
	            };
	            var version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/focus/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Focus',
	            };
	            var version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/swing/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Swing',
	            };
	            var version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/coast/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Opera Coast',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/opt\/\d+(?:.?_?\d+)+/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Opera Touch',
	            };
	            var version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/yabrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Yandex Browser',
	            };
	            var version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/ucbrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'UC Browser',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/Maxthon|mxios/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Maxthon',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/epiphany/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Epiphany',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/puffin/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Puffin',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/sleipnir/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Sleipnir',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/k-meleon/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'K-Meleon',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/micromessenger/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'WeChat',
	            };
	            var version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/qqbrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: /qqbrowserlite/i.test(ua) ? 'QQ Browser Lite' : 'QQ Browser',
	            };
	            var version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/msie|trident/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Internet Explorer',
	            };
	            var version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/\sedg\//i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Microsoft Edge',
	            };
	            var version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/edg([ea]|ios)/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Microsoft Edge',
	            };
	            var version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/vivaldi/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Vivaldi',
	            };
	            var version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/seamonkey/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SeaMonkey',
	            };
	            var version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/sailfish/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Sailfish',
	            };
	            var version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/silk/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Amazon Silk',
	            };
	            var version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/phantom/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'PhantomJS',
	            };
	            var version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/slimerjs/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'SlimerJS',
	            };
	            var version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'BlackBerry',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/(web|hpw)[o0]s/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'WebOS Browser',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua) ||
	                Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/bada/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Bada',
	            };
	            var version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/tizen/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Tizen',
	            };
	            var version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/qupzilla/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'QupZilla',
	            };
	            var version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/firefox|iceweasel|fxios/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Firefox',
	            };
	            var version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/electron/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Electron',
	            };
	            var version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/MiuiBrowser/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Miui',
	            };
	            var version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/chromium/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Chromium',
	            };
	            var version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/chrome|crios|crmo/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Chrome',
	            };
	            var version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    {
	        test: [/GSA/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Google Search',
	            };
	            var version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Android Browser */
	    {
	        test: function (parser) {
	            var notLikeAndroid = !parser.test(/like android/i);
	            var butAndroid = parser.test(/android/i);
	            return notLikeAndroid && butAndroid;
	        },
	        describe: function (ua) {
	            var browser = {
	                name: 'Android Browser',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* PlayStation 4 */
	    {
	        test: [/playstation 4/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'PlayStation 4',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Safari */
	    {
	        test: [/safari|applewebkit/i],
	        describe: function (ua) {
	            var browser = {
	                name: 'Safari',
	            };
	            var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
	            if (version) {
	                browser.version = version;
	            }
	            return browser;
	        },
	    },
	    /* Something else */
	    {
	        test: [/.*/i],
	        describe: function (ua) {
	            /* Here we try to make sure that there are explicit details about the device
	             * in order to decide what regexp exactly we want to apply
	             * (as there is a specific decision based on that conclusion)
	             */
	            var regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
	            var regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
	            var hasDeviceSpec = ua.search('\\(') !== -1;
	            var regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
	            return {
	                name: Utils.getFirstMatch(regexp, ua),
	                version: Utils.getSecondMatch(regexp, ua),
	            };
	        },
	    },
	];

	function mapToStandardOS(osName, version) {
	    // osName이 undefined일 경우 기본값 반환
	    if (!osName) {
	        return { name: distExports.OperationSystem.ETC, version: version };
	    }
	    var osNameLower = osName.toLowerCase();
	    // Windows
	    if (osNameLower.includes('windows')) {
	        return { name: distExports.OperationSystem.WINDOWS, version: version };
	    }
	    // macOS
	    if (osNameLower.includes('mac') || osNameLower.includes('darwin')) {
	        return { name: distExports.OperationSystem.MACOS, version: version };
	    }
	    // iOS
	    if (osNameLower.includes('ios') ||
	        osNameLower.includes('iphone') ||
	        osNameLower.includes('ipad') ||
	        osNameLower.includes('ipod')) {
	        return { name: distExports.OperationSystem.IOS, version: version };
	    }
	    // Android
	    if (osNameLower.includes('android')) {
	        return { name: distExports.OperationSystem.ANDROID, version: version };
	    }
	    // Everything else maps to ETC
	    return { name: distExports.OperationSystem.ETC, version: version };
	}

	var osParsersList = [
	    /* Windows */
	    {
	        test: [/windows /i],
	        describe: function (ua) {
	            var version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
	            return mapToStandardOS(OS_MAP.Windows, version);
	        },
	    },
	    /* macOS */
	    {
	        test: [/macintosh/i],
	        describe: function (ua) {
	            var version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, '.');
	            return mapToStandardOS(OS_MAP.MacOS, version);
	        },
	    },
	    /* iOS */
	    {
	        test: [/(ipod|iphone|ipad)/i],
	        describe: function (ua) {
	            var version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, '.');
	            return mapToStandardOS(OS_MAP.iOS, version);
	        },
	    },
	    /* Android */
	    {
	        test: function (parser) {
	            var notLikeAndroid = !parser.test(/like android/i);
	            var butAndroid = parser.test(/android/i);
	            return notLikeAndroid && butAndroid;
	        },
	        describe: function (ua) {
	            var version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
	            return mapToStandardOS(OS_MAP.Android, version);
	        },
	    },
	    /* All other OS */
	    {
	        test: [
	            /roku\/dvp/i,
	            /windows phone/i,
	            /firefox.+? os/i,
	            /(web|hpw)[o0]s/i,
	            /blackberry|\bbb\d+/i,
	            /rim\stablet/i,
	            /bada/i,
	            /tizen/i,
	            /linux/i,
	            /cros/i,
	            /playstation 4/i,
	        ],
	        describe: function () {
	            return mapToStandardOS(OS_MAP.ETC);
	        },
	    },
	];

	var mapInternalToSDKPlatform = function (type) {
	    switch (type.toLowerCase()) {
	        case 'desktop':
	            return distExports.Platform.DESKTOP;
	        case 'mobile':
	            return distExports.Platform.MOBILE;
	        case 'tablet':
	            return distExports.Platform.TABLET;
	        case 'bot':
	            return distExports.Platform.BOT;
	        case 'tv':
	            return distExports.Platform.ETC;
	        case 'etc':
	            return distExports.Platform.ETC;
	        default:
	            return distExports.Platform.ETC;
	    }
	};

	/*
	 * Bots go first since they should be detected before other platforms.
	 * Then tablets since usually they have more specific signs to detect.
	 */
	var platformRules = [
	    /* ==================== BOT DETECTION ==================== */
	    /* Googlebot (includes Googlebot-Image, Googlebot-Video, Googlebot-News) */
	    {
	        test: [/googlebot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Storebot-Google (Google Shopping) */
	    {
	        test: [/storebot-google/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Google-InspectionTool */
	    {
	        test: [/google-inspectiontool/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* GoogleOther */
	    {
	        test: [/googleother/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Google-CloudVertexBot */
	    {
	        test: [/google-cloudvertexbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* AdsBot-Google (Google Ads quality check) */
	    {
	        test: [/adsbot-google/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Mediapartners-Google (Google AdSense) */
	    {
	        test: [/mediapartners-google/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Gemini-Deep-Research (Google Gemini AI) */
	    {
	        test: [/gemini-deep-research/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Google-Pinpoint - User-triggered fetcher: Pinpoint 사용자가 선택한 소스 fetch */
	    {
	        test: [/google-pinpoint/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Google-Extended (Google AI training control) */
	    {
	        test: [/google-extended/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Google-NotebookLM - User-triggered fetcher: 사용자가 소스로 추가한 URL fetch */
	    {
	        test: [/google-notebooklm/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* GoogleAgent-Mariner (Google Mariner AI agent) */
	    {
	        test: [/googleagent-mariner/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* BingBot (Microsoft) */
	    {
	        test: [/bingbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Microsoft',
	            };
	        },
	    },
	    /* BingPreview (Microsoft) */
	    {
	        test: [/bingpreview/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Microsoft',
	            };
	        },
	    },
	    /* MSNBot (Microsoft) */
	    {
	        test: [/msnbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Microsoft',
	            };
	        },
	    },
	    /* Applebot-Extended (Apple AI training) */
	    {
	        test: [/applebot-extended/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Apple',
	            };
	        },
	    },
	    /* Applebot */
	    {
	        test: [/applebot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Apple',
	            };
	        },
	    },
	    /* Yahoo Slurp */
	    {
	        test: [/slurp/i, /yahoo!\s*slurp/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Yahoo',
	            };
	        },
	    },
	    /* SeznamBot (Czech search engine) */
	    {
	        test: [/seznambot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Seznam',
	            };
	        },
	    },
	    /* Exabot (Exalead) */
	    {
	        test: [/exabot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Exalead',
	            };
	        },
	    },
	    /* Qwant */
	    {
	        test: [/qwantify/i, /qwantbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Qwant',
	            };
	        },
	    },
	    /* Yeti (Naver - Korean search engine) */
	    {
	        test: [/\byeti\b/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Naver',
	            };
	        },
	    },
	    /* Daum (Korean search engine) */
	    {
	        test: [/\bdaum\b/i, /daumoa/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Daum',
	            };
	        },
	    },
	    /* GPTBot (OpenAI) */
	    {
	        test: [/gptbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'OpenAI',
	            };
	        },
	    },
	    /* ChatGPT-User (OpenAI) - User-triggered fetcher: 사용자가 URL 읽기 요청 시 작동 */
	    {
	        test: [/chatgpt-user/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'OpenAI',
	            };
	        },
	    },
	    /* OAI-SearchBot (OpenAI) */
	    {
	        test: [/oai-searchbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'OpenAI',
	            };
	        },
	    },
	    /* ClaudeBot (Anthropic) - Crawler */
	    {
	        test: [/claudebot/i, /claude-web/i, /claude-searchbot/i, /anthropic-ai/i, /anthropic-claude/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Anthropic',
	            };
	        },
	    },
	    /* Claude-User (Anthropic) - User-triggered fetcher: 사용자가 URL 읽기 요청 시 작동 */
	    {
	        test: [/claude-user/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Anthropic',
	            };
	        },
	    },
	    /* AmazonBot */
	    {
	        test: [/amazonbot/i, /amzn-searchbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Amazon',
	            };
	        },
	    },
	    /* PerplexityBot */
	    {
	        test: [/perplexitybot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Perplexity',
	            };
	        },
	    },
	    /* Perplexity-User - User-triggered fetcher: 사용자 질문 답변용 페이지 fetch (robots.txt 무시 가능) */
	    {
	        test: [/perplexity-user/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Perplexity',
	            };
	        },
	    },
	    /* Bytespider (ByteDance/TikTok) */
	    {
	        test: [/bytespider/i, /bytedance/i, /tiktokspider/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'ByteDance',
	            };
	        },
	    },
	    /* Meta-ExternalAgent (Facebook/Meta) */
	    {
	        test: [/meta-externalagent/i, /facebookexternalhit/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Meta',
	            };
	        },
	    },
	    /* Meta-WebIndexer (Meta AI training/search) */
	    {
	        test: [/meta-webindexer/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Meta',
	            };
	        },
	    },
	    /* CCBot (Common Crawl) */
	    {
	        test: [/ccbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Common Crawl',
	            };
	        },
	    },
	    /* DeepseekBot */
	    {
	        test: [/deepseekbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Deepseek',
	            };
	        },
	    },
	    /* MistralAI-User (Mistral) - User-triggered fetcher: Le Chat 사용자 요청 기반 웹 fetch */
	    {
	        test: [/mistralai-user/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Mistral',
	            };
	        },
	    },
	    /* Diffbot (Data extraction service) */
	    {
	        test: [/diffbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Diffbot',
	            };
	        },
	    },
	    /* Webzio (Data extraction service) */
	    {
	        test: [/webzio/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Webzio',
	            };
	        },
	    },
	    /* ICC-Crawler (Data extraction service) */
	    {
	        test: [/icc-crawler/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'ICC',
	            };
	        },
	    },
	    /* Cohere-AI (Cohere AI) */
	    {
	        test: [/cohere-ai/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Cohere',
	            };
	        },
	    },
	    /* YouBot (You.com) */
	    {
	        test: [/youbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'You.com',
	            };
	        },
	    },
	    /* xAI-Bot (xAI/Grok) */
	    {
	        test: [/xai-bot/i, /xai\.bot/i, /grokbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'xAI',
	            };
	        },
	    },
	    /* Groq-Bot (Groq) */
	    {
	        test: [/groq-bot/i, /groqbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Groq',
	            };
	        },
	    },
	    /* AI2Bot (Allen Institute for AI) */
	    {
	        test: [/ai2bot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Allen Institute',
	            };
	        },
	    },
	    /* HuggingFace-Bot (HuggingFace) */
	    {
	        test: [/huggingface/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'HuggingFace',
	            };
	        },
	    },
	    /* FirecrawlAgent (Firecrawl) */
	    {
	        test: [/firecrawl/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Firecrawl',
	            };
	        },
	    },
	    /* Andibot (Andi Search) */
	    {
	        test: [/andibot/i, /andisearch/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Andi',
	            };
	        },
	    },
	    /* Character-AI (Character.AI) */
	    {
	        test: [/character\.ai/i, /characterai/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Character.AI',
	            };
	        },
	    },
	    /* Devin (Cognition Labs) - AI software engineer agent */
	    {
	        test: [/cognition-ai/i, /devin-ai/i, /\bdevin\b.*(?:bot|crawl|agent)/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Cognition Labs',
	            };
	        },
	    },
	    /* Together-Bot (Together AI) */
	    {
	        test: [/together-ai/i, /togetherbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Together AI',
	            };
	        },
	    },
	    /* Replicate-Bot (Replicate) - AI model hosting platform */
	    {
	        test: [/replicate-bot/i, /replicate\.com/i, /replicatebot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Replicate',
	            };
	        },
	    },
	    /* Brightbot (Bright Data) */
	    {
	        test: [/brightbot/i, /brightdata/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Bright Data',
	            };
	        },
	    },
	    /* Crawlspace (AI data extraction) */
	    {
	        test: [/crawlspace/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Crawlspace',
	            };
	        },
	    },
	    /* LinkedInBot */
	    {
	        test: [/linkedinbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'LinkedIn',
	            };
	        },
	    },
	    /* DuckDuckBot */
	    {
	        test: [/duckduckbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'DuckDuckGo',
	            };
	        },
	    },
	    /* DuckAssistBot (DuckDuckGo) - User-triggered fetcher: DuckAssist 요약/답변용 */
	    {
	        test: [/duckassistbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'DuckDuckGo',
	            };
	        },
	    },
	    /* YandexBot */
	    {
	        test: [/yandexbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Yandex',
	            };
	        },
	    },
	    /* Baiduspider (Baidu) */
	    {
	        test: [/baiduspider/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Baidu',
	            };
	        },
	    },
	    /* SogouSpider */
	    {
	        test: [/sogou\s?(web\s?)?spider/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Sogou',
	            };
	        },
	    },
	    /* Twitterbot */
	    {
	        test: [/twitterbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Twitter',
	            };
	        },
	    },
	    /* Slackbot */
	    {
	        test: [/slackbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Slack',
	            };
	        },
	    },
	    /* Discordbot */
	    {
	        test: [/discordbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Discord',
	            };
	        },
	    },
	    /* TelegramBot */
	    {
	        test: [/telegrambot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Telegram',
	            };
	        },
	    },
	    /* WhatsApp - Link Preview Bot: 메시지 내 URL 미리보기 생성용
	     * Bot UA: "WhatsApp/2.23.20.0 A" (starts with WhatsApp)
	     * In-app browser UA: "Mozilla/5.0 ... WhatsApp/2.21.4.22" (should be detected as mobile)
	     */
	    {
	        test: function (parser) {
	            // Only match if UA contains WhatsApp but doesn't start with Mozilla (bot, not in-app browser)
	            var hasWhatsApp = parser.test(/whatsapp/i);
	            var startsWithMozilla = parser.test(/^mozilla/i);
	            return hasWhatsApp && !startsWithMozilla;
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'WhatsApp',
	            };
	        },
	    },
	    /* DingTalkBot */
	    {
	        test: [/dingtalkbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'DingTalk',
	            };
	        },
	    },
	    /* PinterestBot */
	    {
	        test: [/pinterestbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Pinterest',
	            };
	        },
	    },
	    /* SkypeURIPreview (Microsoft Teams/Skype) */
	    {
	        test: [/skypeuripreview/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Microsoft',
	            };
	        },
	    },
	    /* KakaoStory OG Reader (Kakao - Korean) */
	    {
	        test: [/kakaostory-og-reader/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Kakao',
	            };
	        },
	    },
	    /* UptimeRobot (Monitoring) */
	    {
	        test: [/uptimerobot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'UptimeRobot',
	            };
	        },
	    },
	    /* StatusCake (Monitoring) */
	    {
	        test: [/statuscake/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'StatusCake',
	            };
	        },
	    },
	    /* Pingdom (Monitoring) */
	    {
	        test: [/pingdom/i, /pingdomtms/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Pingdom',
	            };
	        },
	    },
	    /* SEO Bots (Semrush, Ahrefs, Moz, Majestic, DataForSeo) */
	    {
	        test: [/semrushbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Semrush',
	            };
	        },
	    },
	    {
	        test: [/ahrefsbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Ahrefs',
	            };
	        },
	    },
	    {
	        test: [/mj12bot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Majestic',
	            };
	        },
	    },
	    {
	        test: [/dotbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Moz',
	            };
	        },
	    },
	    {
	        test: [/dataforseobot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'DataForSeo',
	            };
	        },
	    },
	    /* PetalBot (Huawei) */
	    {
	        test: [/petalbot/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Huawei',
	            };
	        },
	    },
	    /* Meltwater (Media monitoring) */
	    {
	        test: [/meltwater/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Meltwater',
	            };
	        },
	    },
	    /* Marginalia (Search engine) */
	    {
	        test: [/marginalia/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Marginalia',
	            };
	        },
	    },
	    /* Bitdiscovery (Security scanner) */
	    {
	        test: [/bitdiscovery/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Bitdiscovery',
	            };
	        },
	    },
	    /* Amazon Kendra (AWS search service) */
	    {
	        test: [/amazon-kendra/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Amazon',
	            };
	        },
	    },
	    /* Dataprovider */
	    {
	        test: [/dataprovider/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Dataprovider',
	            };
	        },
	    },
	    /* Kagi (Search engine) */
	    {
	        test: [/kagi-fetcher/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Kagi',
	            };
	        },
	    },
	    /* Outbrain (Content discovery) */
	    {
	        test: [/outbrain/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Outbrain',
	            };
	        },
	    },
	    /* FalconTag */
	    {
	        test: [/falcontag/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'FalconTag',
	            };
	        },
	    },
	    /* AdFit SDK (Kakao) */
	    {
	        test: [/adfitsdk/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Kakao',
	            };
	        },
	    },
	    /* FeedFetcher-Google */
	    {
	        test: [/feedfetcher-google/i, /feedfetcher/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* YaDirectFetcher (Yandex Direct) */
	    {
	        test: [/yadirectfetcher/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Yandex',
	            };
	        },
	    },
	    /* Datadog Synthetics (Monitoring) */
	    {
	        test: [/datadogsynthetics/i, /datadog/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Datadog',
	            };
	        },
	    },
	    /* Scope3 (Carbon measurement) */
	    {
	        test: [/scope3/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Scope3',
	            };
	        },
	    },
	    /* Hey application */
	    {
	        test: [/hey_application/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Hey',
	            };
	        },
	    },
	    /* EXO g-network */
	    {
	        test: [/g-network_security/i, /g-exo/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'EXO',
	            };
	        },
	    },
	    /* W3C Validator */
	    {
	        test: [/w3c_css_validator/i, /jigsaw/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'W3C',
	            };
	        },
	    },
	    /* Nook Browser */
	    {
	        test: [/nook browser/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	                vendor: 'Barnes & Noble',
	            };
	        },
	    },
	    /* Generic Bot Detection - catches bots with common patterns
	     * This should be the LAST bot rule before device detection
	     * Matches: bot, crawler, spider, scraper, headless, fetch, http
	     */
	    {
	        test: [
	            /bot(?:[\s\-_\/;@()]|$)/i,
	            /crawler/i,
	            /spider/i,
	            /scraper/i,
	            /headless/i,
	            /wget/i,
	            /curl/i,
	            /python-requests/i,
	            /python-urllib/i,
	            /java\//i,
	            /libwww/i,
	            /httpunit/i,
	            /nutch/i,
	            /biglotron/i,
	            /teoma/i,
	            /convera/i,
	            /gigablast/i,
	            /ia_archiver/i,
	            /webmon/i,
	            /httrack/i,
	            /grub\.org/i,
	            /netresearchserver/i,
	            /speedy/i,
	            /fluffy/i,
	            /findlink/i,
	            /panscient/i,
	            /ips-agent/i,
	            /yanga/i,
	            /cyberpatrol/i,
	            /postrank/i,
	            /scoutjet/i,
	            /playwright/i,
	            /puppeteer/i,
	            /selenium/i,
	            /elinks/i,
	            /links\s/i,
	        ],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.bot),
	            };
	        },
	    },
	    /* ==================== DEVICE DETECTION ==================== */
	    /* Huawei */
	    {
	        test: [/huawei/i],
	        describe: function (ua) {
	            var model = Utils.getFirstMatch(/(can-l01)/i, ua) && 'Nova';
	            var platform = {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Huawei',
	            };
	            if (model) {
	                platform.model = model;
	            }
	            return platform;
	        },
	    },
	    /* Nexus Tablet */
	    {
	        test: [/nexus\s*(?:7|8|9|10).*/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Nexus',
	            };
	        },
	    },
	    /* iPad */
	    {
	        test: [/ipad/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Apple',
	                model: 'iPad',
	            };
	        },
	    },
	    /* Firefox on iPad */
	    {
	        test: [/Macintosh(.*?) FxiOS(.*?)\//],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Apple',
	                model: 'iPad',
	            };
	        },
	    },
	    /* Amazon Kindle Fire */
	    {
	        test: [/kftt build/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Amazon',
	                model: 'Kindle Fire HD 7',
	            };
	        },
	    },
	    /* Another Amazon Tablet with Silk */
	    {
	        test: [/silk/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Amazon',
	            };
	        },
	    },
	    /* Tablet */
	    {
	        test: [/tablet(?! pc)/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	            };
	        },
	    },
	    /* iPod/iPhone */
	    {
	        test: function (parser) {
	            var iDevice = parser.test(/ipod|iphone/i);
	            var likeIDevice = parser.test(/like (ipod|iphone)/i);
	            return iDevice && !likeIDevice;
	        },
	        describe: function (ua) {
	            var model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Apple',
	                model: model,
	            };
	        },
	    },
	    /* Nexus Mobile */
	    {
	        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Nexus',
	            };
	        },
	    },
	    /* Nokia */
	    {
	        test: [/Nokia/i],
	        describe: function (ua) {
	            var model = Utils.getFirstMatch(/Nokia\s+([0-9]+(\.[0-9]+)?)/i, ua);
	            var platform = {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Nokia',
	            };
	            if (model) {
	                platform.model = model;
	            }
	            return platform;
	        },
	    },
	    /* Mobile */
	    {
	        test: [/[^-]mobi/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	            };
	        },
	    },
	    /* BlackBerry */
	    {
	        test: function (parser) {
	            return parser.getBrowserName(true) === 'blackberry';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'BlackBerry',
	            };
	        },
	    },
	    /* Bada */
	    {
	        test: function (parser) {
	            return parser.getBrowserName(true) === 'bada';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	            };
	        },
	    },
	    /* Windows Phone */
	    {
	        test: function (parser) {
	            return parser.getBrowserName() === 'windows phone';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Microsoft',
	            };
	        },
	    },
	    /* ==================== SMART TV DETECTION ==================== */
	    /* Must be BEFORE Android detection - Android TV devices have Android in UA */
	    /* LG Smart TV (NetCast/WebOS) - must be before generic Smart TV detection */
	    {
	        test: [/netcast/i, /webos/i, /web0s/i, /hpwos/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'LG',
	            };
	        },
	    },
	    /* Sony BRAVIA TV - must be before Android (BRAVIA runs on Android) */
	    {
	        test: [/bravia/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Sony',
	            };
	        },
	    },
	    /* Samsung Smart TV (Smart-TV keyword) */
	    {
	        test: [/smart-tv/i, /smarttv/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Samsung',
	            };
	        },
	    },
	    /* Tizen TV */
	    {
	        test: [/tizen/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Samsung',
	            };
	        },
	    },
	    /* HbbTV (Hybrid Broadcast Broadband TV) */
	    {
	        test: [/hbbtv/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	            };
	        },
	    },
	    /* VIDAA (Hisense) */
	    {
	        test: [/vidaa/i, /hisense/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Hisense',
	            };
	        },
	    },
	    /* Philips TV */
	    {
	        test: [/philips/i],
	        describe: function (ua) {
	            // Check if it's a TV context
	            if (/tv/i.test(ua) || /hbbtv/i.test(ua)) {
	                return {
	                    type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                    vendor: 'Philips',
	                };
	            }
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	                vendor: 'Philips',
	            };
	        },
	    },
	    /* Google Chromecast / Fuchsia */
	    {
	        test: [/crkey/i, /fuchsia/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Tesla Browser */
	    {
	        test: [/teslamusic/i, /\btesla\b/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Tesla',
	            };
	        },
	    },
	    /* PlayStation */
	    {
	        test: [/playstation/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Sony',
	            };
	        },
	    },
	    /* Roku */
	    {
	        test: [/roku/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tv),
	                vendor: 'Roku',
	            };
	        },
	    },
	    /* Steam Deck / Valve */
	    {
	        test: [/steam deck/i, /valve steam/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	                vendor: 'Valve',
	            };
	        },
	    },
	    /* Meta Quest VR */
	    {
	        test: [/\bquest\b/i, /oculusbrowser/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	                vendor: 'Meta',
	            };
	        },
	    },
	    /* ==================== ANDROID DETECTION ==================== */
	    /* Must be AFTER Smart TV detection */
	    /* Android Tablet */
	    {
	        test: function (parser) {
	            var osMajorVersion = Number(String(parser.getOSVersion()).split('.')[0]);
	            return parser.getOSName(true) === 'android' && osMajorVersion >= 3;
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	            };
	        },
	    },
	    /* Android Mobile */
	    {
	        test: function (parser) {
	            return parser.getOSName(true) === 'android';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	            };
	        },
	    },
	    /* ==================== DESKTOP OS DETECTION ==================== */
	    /* macOS Desktop */
	    {
	        test: function (parser) {
	            return parser.getOSName(true) === 'macos';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	                vendor: 'Apple',
	            };
	        },
	    },
	    /* Windows Desktop */
	    {
	        test: function (parser) {
	            return parser.getOSName(true) === 'windows';
	        },
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	            };
	        },
	    },
	    /* ==================== OS-BASED DETECTION ==================== */
	    /* Chrome OS - before Linux check (CrOS contains "Linux" in some UAs) */
	    {
	        test: [/cros/i, /chromeos/i, /chrome os/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	                vendor: 'Google',
	            };
	        },
	    },
	    /* Linux Desktop - UA pattern matching (not OS name check) */
	    {
	        test: [/\blinux\b/i, /x11/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	            };
	        },
	    },
	    /* ==================== IN-APP BROWSER DETECTION ==================== */
	    /* Facebook In-App Browser (FBAN format) */
	    {
	        test: [/\[fban\//i, /fbav\//i, /fbbv\//i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	                vendor: 'Meta',
	            };
	        },
	    },
	    /* Kindle */
	    {
	        test: [/kindle/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.tablet),
	                vendor: 'Amazon',
	            };
	        },
	    },
	    /* ==================== LEGACY DEVICE DETECTION ==================== */
	    /* Sony Ericsson */
	    {
	        test: [/sonyericsson/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Sony Ericsson',
	            };
	        },
	    },
	    /* Symbian */
	    {
	        test: [/symbianos/i, /symbian/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Nokia',
	            };
	        },
	    },
	    /* PSP */
	    {
	        test: [/psp/i, /playstation portable/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	                vendor: 'Sony',
	            };
	        },
	    },
	    /* FreeBSD / OpenBSD */
	    {
	        test: [/freebsd/i, /openbsd/i, /netbsd/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	            };
	        },
	    },
	    /* IRIX (SGI) */
	    {
	        test: [/irix/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	                vendor: 'SGI',
	            };
	        },
	    },
	    /* OS/2 */
	    {
	        test: [/os\/2/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.desktop),
	                vendor: 'IBM',
	            };
	        },
	    },
	    /* ==================== FALLBACK ==================== */
	    /* MobileSafari/CFNetwork (iOS without full UA) */
	    {
	        test: [/mobilesafari/i, /cfnetwork/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.mobile),
	                vendor: 'Apple',
	            };
	        },
	    },
	    /* Generic Safari fallback */
	    {
	        test: [/safari/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	            };
	        },
	    },
	    /* Generic Chrome fallback */
	    {
	        test: [/chrome/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	            };
	        },
	    },
	    /* Generic Mozilla fallback */
	    {
	        test: [/mozilla/i],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	            };
	        },
	    },
	    /* Ultimate fallback - catch anything */
	    {
	        test: [/.*/],
	        describe: function () {
	            return {
	                type: mapInternalToSDKPlatform(PLATFORMS_MAP.etc),
	            };
	        },
	    },
	];

	/*
	 * More specific goes first
	 */
	var enginesParsersList = [
	    /* EdgeHTML */
	    {
	        test: function (parser) {
	            return parser.getBrowserName(true) === 'microsoft edge';
	        },
	        describe: function (ua) {
	            var isBlinkBased = /\sedg\//i.test(ua);
	            // return blink if it's blink-based one
	            if (isBlinkBased) {
	                return {
	                    name: ENGINE_MAP.Blink,
	                };
	            }
	            // otherwise match the version and return EdgeHTML
	            var version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
	            return {
	                name: ENGINE_MAP.EdgeHTML,
	                version: version,
	            };
	        },
	    },
	    /* Trident */
	    {
	        test: [/trident/i],
	        describe: function (ua) {
	            var engine = {
	                name: ENGINE_MAP.Trident,
	            };
	            var version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                engine.version = version;
	            }
	            return engine;
	        },
	    },
	    /* Presto */
	    {
	        test: function (parser) {
	            return parser.test(/presto/i);
	        },
	        describe: function (ua) {
	            var engine = {
	                name: ENGINE_MAP.Presto,
	            };
	            var version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                engine.version = version;
	            }
	            return engine;
	        },
	    },
	    /* Gecko */
	    {
	        test: function (parser) {
	            var isGecko = parser.test(/gecko/i);
	            var likeGecko = parser.test(/like gecko/i);
	            return isGecko && !likeGecko;
	        },
	        describe: function (ua) {
	            var engine = {
	                name: ENGINE_MAP.Gecko,
	            };
	            var version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                engine.version = version;
	            }
	            return engine;
	        },
	    },
	    /* Blink */
	    {
	        test: [/(apple)?webkit\/537\.36/i],
	        describe: function () {
	            return {
	                name: ENGINE_MAP.Blink,
	            };
	        },
	    },
	    /* WebKit */
	    {
	        test: [/(apple)?webkit/i],
	        describe: function (ua) {
	            var engine = {
	                name: ENGINE_MAP.WebKit,
	            };
	            var version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
	            if (version) {
	                engine.version = version;
	            }
	            return engine;
	        },
	    },
	];

	/**
	 * The main class that arranges the whole parsing process.
	 */
	var Parser = /** @class */ (function () {
	    /**
	     * Create instance of Parser
	     *
	     * @param {String} UA User-Agent string
	     * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
	     * improvements if you need to make a more particular parsing
	     * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
	     *
	     * @throw {Error} in case of empty UA String
	     *
	     * @constructor
	     */
	    function Parser(UA, skipParsing) {
	        if (skipParsing === void 0) { skipParsing = false; }
	        if (UA === undefined || UA === null || UA === '') {
	            throw new Error("UserAgent parameter can't be empty");
	        }
	        this._ua = UA;
	        this.parsedResult = {};
	        if (skipParsing !== true) {
	            this.parse();
	        }
	    }
	    /**
	     * Get UserAgent string of current Parser instance
	     * @return {String} User-Agent String of the current <Parser> object
	     *
	     * @public
	     */
	    Parser.prototype.getUA = function () {
	        return this._ua;
	    };
	    /**
	     * Test a UA string for a regexp
	     * @param {RegExp} regex
	     * @return {Boolean}
	     */
	    Parser.prototype.test = function (regex) {
	        return regex.test(this._ua);
	    };
	    /**
	     * Get parsed browser object
	     * @return {Object}
	     */
	    Parser.prototype.parseBrowser = function () {
	        var _this = this;
	        this.parsedResult.browser = {};
	        var browserDescriptor = Utils.find(browsersList, function (_browser) {
	            if (typeof _browser.test === 'function') {
	                return _browser.test(_this);
	            }
	            if (Array.isArray(_browser.test)) {
	                return _browser.test.some(function (condition) { return _this.test(condition); });
	            }
	            throw new Error("Browser's test function is not valid");
	        });
	        if (browserDescriptor) {
	            this.parsedResult.browser = browserDescriptor.describe(this.getUA());
	        }
	        return this.parsedResult.browser;
	    };
	    /**
	     * Get parsed browser object
	     * @return {Object}
	     *
	     * @public
	     */
	    Parser.prototype.getBrowser = function () {
	        if (this.parsedResult.browser) {
	            return this.parsedResult.browser;
	        }
	        return this.parseBrowser();
	    };
	    /**
	     * Get browser's name
	     * @param {Boolean} [toLowerCase]
	     * @return {String} Browser's name or an empty string
	     *
	     * @public
	     */
	    Parser.prototype.getBrowserName = function (toLowerCase) {
	        if (toLowerCase) {
	            return String(this.getBrowser().name).toLowerCase() || '';
	        }
	        return this.getBrowser().name || '';
	    };
	    /**
	     * Get browser's version
	     * @return {String} version of browser
	     *
	     * @public
	     */
	    Parser.prototype.getBrowserVersion = function () {
	        return this.getBrowser().version;
	    };
	    /**
	     * Get OS
	     * @return {Object}
	     *
	     * @example
	     * this.getOS();
	     * {
	     *   name: 'macOS',
	     *   version: '10.11.12'
	     * }
	     */
	    Parser.prototype.getOS = function () {
	        if (this.parsedResult.os) {
	            return this.parsedResult.os;
	        }
	        return this.parseOS();
	    };
	    /**
	     * Parse OS and save it to this.parsedResult.os
	     * @return {*|{}}
	     */
	    Parser.prototype.parseOS = function () {
	        var _this = this;
	        this.parsedResult.os = {};
	        var os = Utils.find(osParsersList, function (_os) {
	            if (typeof _os.test === 'function') {
	                return _os.test(_this);
	            }
	            if (Array.isArray(_os.test)) {
	                return _os.test.some(function (condition) { return _this.test(condition); });
	            }
	            throw new Error("Browser's test function is not valid");
	        });
	        if (os) {
	            this.parsedResult.os = os.describe(this.getUA());
	        }
	        return this.parsedResult.os;
	    };
	    /**
	     * Get OS name
	     * @param {Boolean} [toLowerCase] return lower-cased value
	     * @return {String} name of the OS — macOS, Windows, Linux, etc.
	     */
	    Parser.prototype.getOSName = function (toLowerCase) {
	        var name = this.getOS().name;
	        if (toLowerCase) {
	            return String(name).toLowerCase() || '';
	        }
	        return name || '';
	    };
	    /**
	     * Get OS version
	     * @return {String} full version with dots ('10.11.12', '5.6', etc)
	     */
	    Parser.prototype.getOSVersion = function () {
	        return this.getOS().version;
	    };
	    /**
	     * Get parsed platform
	     * @return {{}}
	     */
	    Parser.prototype.getPlatform = function () {
	        if (this.parsedResult.platform) {
	            return this.parsedResult.platform;
	        }
	        return this.parsePlatform();
	    };
	    /**
	     * Get platform name
	     * @param {Boolean} [toLowerCase=false]
	     * @return {*}
	     */
	    Parser.prototype.getPlatformType = function (toLowerCase) {
	        if (toLowerCase === void 0) { toLowerCase = false; }
	        var type = this.getPlatform().type;
	        if (toLowerCase) {
	            return String(type).toLowerCase() || '';
	        }
	        return type || '';
	    };
	    /**
	     * Get parsed platform
	     * @return {{}}
	     */
	    Parser.prototype.parsePlatform = function () {
	        var _this = this;
	        this.parsedResult.platform = {};
	        var platform = Utils.find(platformRules, function (_platform) {
	            if (typeof _platform.test === 'function') {
	                return _platform.test(_this);
	            }
	            if (Array.isArray(_platform.test)) {
	                return _platform.test.some(function (condition) { return _this.test(condition); });
	            }
	            throw new Error("Browser's test function is not valid");
	        });
	        if (platform) {
	            this.parsedResult.platform = platform.describe(this.getUA());
	        }
	        return this.parsedResult.platform;
	    };
	    /**
	     * Get parsed engine
	     * @return {{}}
	     */
	    Parser.prototype.getEngine = function () {
	        if (this.parsedResult.engine) {
	            return this.parsedResult.engine;
	        }
	        return this.parseEngine();
	    };
	    /**
	     * Get engines's name
	     * @param {Boolean} [toLowerCase]
	     * @return {String} Engines's name or an empty string
	     *
	     * @public
	     */
	    Parser.prototype.getEngineName = function (toLowerCase) {
	        if (toLowerCase) {
	            return String(this.getEngine().name).toLowerCase() || '';
	        }
	        return this.getEngine().name || '';
	    };
	    /**
	     * Get parsed platform
	     * @return {{}}
	     */
	    Parser.prototype.parseEngine = function () {
	        var _this = this;
	        this.parsedResult.engine = {};
	        var engine = Utils.find(enginesParsersList, function (_engine) {
	            if (typeof _engine.test === 'function') {
	                return _engine.test(_this);
	            }
	            if (Array.isArray(_engine.test)) {
	                return _engine.test.some(function (condition) { return _this.test(condition); });
	            }
	            throw new Error("Browser's test function is not valid");
	        });
	        if (engine) {
	            this.parsedResult.engine = engine.describe(this.getUA());
	        }
	        return this.parsedResult.engine;
	    };
	    /**
	     * Parse full information about the browser
	     * @returns {Parser}
	     */
	    Parser.prototype.parse = function () {
	        this.parseBrowser();
	        this.parseOS();
	        this.parsePlatform();
	        this.parseEngine();
	        return this;
	    };
	    /**
	     * Get parsed result
	     * @return {ParsedResult}
	     */
	    Parser.prototype.getResult = function () {
	        return Utils.assign({}, this.parsedResult);
	    };
	    /**
	     * Check if parsed browser matches certain conditions
	     *
	     * @param {Object} checkTree It's one or two layered object,
	     * which can include a platform or an OS on the first layer
	     * and should have browsers specs on the bottom-laying layer
	     *
	     * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
	     * Returns `undefined` when the browser is no described in the checkTree object.
	     *
	     * @example
	     * const browser = Bowser.getParser(window.navigator.userAgent);
	     * if (browser.satisfies({chrome: '>118.01.1322' }))
	     * // or with os
	     * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
	     * // or with platforms
	     * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
	     */
	    Parser.prototype.satisfies = function (checkTree) {
	        var _this = this;
	        var platformsAndOSes = {};
	        var platformsAndOSCounter = 0;
	        var browsers = {};
	        var browsersCounter = 0;
	        var allDefinitions = Object.keys(checkTree);
	        allDefinitions.forEach(function (key) {
	            var currentDefinition = checkTree[key];
	            if (typeof currentDefinition === 'string') {
	                browsers[key] = currentDefinition;
	                browsersCounter += 1;
	            }
	            else if (typeof currentDefinition === 'object') {
	                platformsAndOSes[key] = currentDefinition;
	                platformsAndOSCounter += 1;
	            }
	        });
	        if (platformsAndOSCounter > 0) {
	            var platformsAndOSNames = Object.keys(platformsAndOSes);
	            var OSMatchingDefinition = Utils.find(platformsAndOSNames, function (name) { return _this.isOS(name); });
	            if (OSMatchingDefinition) {
	                var osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
	                if (osResult !== undefined) {
	                    return osResult;
	                }
	            }
	            var platformMatchingDefinition = Utils.find(platformsAndOSNames, function (name) { return _this.isPlatform(name); });
	            if (platformMatchingDefinition) {
	                var platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
	                if (platformResult !== undefined) {
	                    return platformResult;
	                }
	            }
	        }
	        if (browsersCounter > 0) {
	            var browserNames = Object.keys(browsers);
	            var matchingDefinition = Utils.find(browserNames, function (name) { return _this.isBrowser(name, true); });
	            if (matchingDefinition !== undefined) {
	                return this.compareVersion(browsers[matchingDefinition]);
	            }
	        }
	        return undefined;
	    };
	    /**
	     * Check if the browser name equals the passed string
	     * @param {string} browserName The string to compare with the browser name
	     * @param {boolean} [includingAlias=false] The flag showing whether alias will be included into comparison
	     * @returns {boolean}
	     */
	    Parser.prototype.isBrowser = function (browserName, includingAlias) {
	        if (includingAlias === void 0) { includingAlias = false; }
	        var defaultBrowserName = this.getBrowserName().toLowerCase();
	        var browserNameLower = browserName.toLowerCase();
	        var alias = Utils.getBrowserTypeByAlias(browserNameLower);
	        if (includingAlias && alias) {
	            browserNameLower = alias.toLowerCase();
	        }
	        return browserNameLower === defaultBrowserName;
	    };
	    Parser.prototype.compareVersion = function (version) {
	        var expectedResults = [0];
	        var comparableVersion = version;
	        var isLoose = false;
	        var currentBrowserVersion = this.getBrowserVersion();
	        if (typeof currentBrowserVersion !== 'string') {
	            return undefined;
	        }
	        if (version[0] === '>' || version[0] === '<') {
	            comparableVersion = version.substr(1);
	            if (version[1] === '=') {
	                isLoose = true;
	                comparableVersion = version.substr(2);
	            }
	            else {
	                expectedResults = [];
	            }
	            if (version[0] === '>') {
	                expectedResults.push(1);
	            }
	            else {
	                expectedResults.push(-1);
	            }
	        }
	        else if (version[0] === '=') {
	            comparableVersion = version.substr(1);
	        }
	        else if (version[0] === '~') {
	            isLoose = true;
	            comparableVersion = version.substr(1);
	        }
	        return expectedResults.indexOf(Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)) > -1;
	    };
	    /**
	     * Check if the OS name equals the passed string
	     * @param {string} osName The string to compare with the OS name
	     * @returns {boolean}
	     */
	    Parser.prototype.isOS = function (osName) {
	        return this.getOSName(true) === String(osName).toLowerCase();
	    };
	    /**
	     * Check if the platform type equals the passed string
	     * @param {string} platformType The string to compare with the platform type
	     * @returns {boolean}
	     */
	    Parser.prototype.isPlatform = function (platformType) {
	        return this.getPlatformType(true) === String(platformType).toLowerCase();
	    };
	    /**
	     * Check if the engine name equals the passed string
	     * @param {string} engineName The string to compare with the engine name
	     * @returns {boolean}
	     */
	    Parser.prototype.isEngine = function (engineName) {
	        return this.getEngineName(true) === String(engineName).toLowerCase();
	    };
	    /**
	     * Is anything? Check if the browser is called "anything",
	     * the OS called "anything" or the platform called "anything"
	     * @param {String} anything
	     * @param {boolean} [includingAlias=false] The flag showing whether alias will be included into comparison
	     * @returns {Boolean}
	     */
	    Parser.prototype.is = function (anything, includingAlias) {
	        if (includingAlias === void 0) { includingAlias = false; }
	        return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
	    };
	    /**
	     * Check if any of the given values satisfies this.is(anything)
	     * @param {String[]} anythings
	     * @returns {Boolean}
	     */
	    Parser.prototype.some = function (anythings) {
	        var _this = this;
	        if (anythings === void 0) { anythings = []; }
	        return anythings.some(function (anything) { return _this.is(anything); });
	    };
	    return Parser;
	}());

	/*!
	 * Bowser - a browser detector
	 * https://github.com/lancedikson/bowser
	 * MIT License | (c) Dustin Diaz 2012-2015
	 * MIT License | (c) Denis Demchenko 2015-2019
	 */
	/**
	 * Bowser class.
	 * Keep it simple as much as it can be.
	 * It's supposed to work with collections of {@link Parser} instances
	 * rather then solve one-instance problems.
	 * All the one-instance stuff is located in Parser class.
	 *
	 * @class
	 * @classdesc Bowser is a static object, that provides an API to the Parsers
	 * @hideconstructor
	 */
	var Bowser = /** @class */ (function () {
	    function Bowser() {
	    }
	    /**
	     * Creates a {@link Parser} instance
	     *
	     * @param {String} UA UserAgent string
	     * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
	     * explicitly. Same as `skipParsing` for {@link Parser}.
	     * @returns {Parser}
	     * @throws {Error} when UA is not a String
	     *
	     * @example
	     * const parser = Bowser.getParser(window.navigator.userAgent);
	     * const result = parser.getResult();
	     */
	    Bowser.getParser = function (UA, skipParsing) {
	        if (skipParsing === void 0) { skipParsing = false; }
	        if (typeof UA !== 'string') {
	            throw new Error('UserAgent should be a string');
	        }
	        return new Parser(UA, skipParsing);
	    };
	    /**
	     * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
	     *
	     * @param UA
	     * @return {ParsedResult}
	     *
	     * @example
	     * const result = Bowser.parse(window.navigator.userAgent);
	     */
	    Bowser.parse = function (UA) {
	        return new Parser(UA).getResult();
	    };
	    Object.defineProperty(Bowser, "BROWSER_MAP", {
	        get: function () {
	            return BROWSER_MAP;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Bowser, "ENGINE_MAP", {
	        get: function () {
	            return ENGINE_MAP;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Bowser, "OS_MAP", {
	        get: function () {
	            return OS_MAP;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Bowser, "PLATFORMS_MAP", {
	        get: function () {
	            return PLATFORMS_MAP;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    return Bowser;
	}());

	/**
	 * Project Token 관리 유틸리티
	 *
	 * Mixpanel 스타일 API를 지원하기 위한 프로젝트 토큰 관리 모듈입니다.
	 * 토큰은 메모리와 localStorage에 저장되어 페이지 새로고침 후에도 유지됩니다.
	 *
	 * ## 토큰 포맷
	 * - `bs-im-{uuid-v7}` : 아임웹 내부 (모든 사이트 공유, siteCode로 구분)
	 * - `bs-ext-{uuid-v7}` : 외부 사이트 (카페24 등, 사이트별 고유 토큰)
	 *
	 * ## Provider 운영 전략
	 * - 아임웹: `bs-im-` 프리픽스, 고정 토큰 1개
	 * - 카페24/외부: `bs-ext-` 프리픽스, 사이트별 고유 토큰 발급
	 */
	// 메모리 내 프로젝트 토큰 캐시
	var projectToken = null;
	/**
	 * 토큰에서 프리픽스를 추출합니다.
	 *
	 * @param token - 프로젝트 토큰
	 * @returns 프리픽스 문자열 또는 null
	 *
	 * @example
	 * extractPrefix('bs-im-019d09a9-3c73-78ec-94f0-ea2f7af2ffa1')
	 * // 'bs-im-'
	 */
	function extractPrefix(token) {
	    for (var _i = 0, _a = PROJECT_TOKEN_CONFIG.VALID_PREFIXES; _i < _a.length; _i++) {
	        var prefix = _a[_i];
	        if (token.startsWith(prefix)) {
	            return prefix;
	        }
	    }
	    return null;
	}
	/**
	 * 토큰 포맷이 유효한지 간단히 확인합니다.
	 * 상세 에러 메시지가 필요하면 validateProjectToken()을 사용하세요.
	 *
	 * @param token - 검증할 토큰
	 * @returns 유효하면 true, 아니면 false
	 */
	function isValidTokenFormat(token) {
	    if (typeof token !== 'string') {
	        return false;
	    }
	    return PROJECT_TOKEN_CONFIG.FORMAT_REGEX.test(token);
	}
	/**
	 * 토큰 포맷을 검증하고 상세 결과를 반환합니다.
	 *
	 * @param token - 검증할 토큰
	 * @returns 검증 결과 객체 { isValid, error }
	 *
	 * @example
	 * validateProjectToken('bs-im-019d09a9-3c73-78ec-94f0-ea2f7af2ffa1')
	 * // { isValid: true, error: null }
	 *
	 * validateProjectToken('abc')
	 * // { isValid: false, error: 'Token must start with a valid prefix: bs-im-, bs-ext-' }
	 */
	function validateProjectToken(token) {
	    // 타입 검증
	    if (token === null || token === undefined) {
	        return { isValid: false, error: 'Token is null or undefined' };
	    }
	    if (typeof token !== 'string') {
	        return { isValid: false, error: "Token must be a string, got ".concat(typeof token) };
	    }
	    // 빈 문자열 검증
	    if (token.length === 0) {
	        return { isValid: false, error: 'Token is empty' };
	    }
	    // 프리픽스 검증
	    var prefix = extractPrefix(token);
	    if (!prefix) {
	        return {
	            isValid: false,
	            error: "Token must start with a valid prefix: ".concat(PROJECT_TOKEN_CONFIG.VALID_PREFIXES.join(', ')),
	        };
	    }
	    // UUID v7 본문 검증
	    var uuidPart = token.slice(prefix.length);
	    if (!PROJECT_TOKEN_CONFIG.UUID_V7_REGEX.test(uuidPart)) {
	        return {
	            isValid: false,
	            error: 'Token body must be a valid UUID v7 (e.g., 019d09a9-3c73-78ec-94f0-ea2f7af2ffa1)',
	        };
	    }
	    return { isValid: true, error: null };
	}
	/**
	 * 프로젝트 토큰을 설정합니다.
	 * 메모리와 localStorage에 저장합니다.
	 *
	 * @param token - 프로젝트 토큰 (bs-im-{uuid} 또는 bs-ext-{uuid})
	 * @param options - 설정 옵션
	 * @param options.skipValidation - 검증 건너뛰기 (내부 테스트용, 기본값: false)
	 * @returns 설정 성공 여부
	 */
	function setProjectToken(token, options) {
	    var _a, _b;
	    var skipValidation = (_a = void 0 ) !== null && _a !== void 0 ? _a : false;
	    // 기본 타입 검증 (skipValidation과 무관)
	    if (!token || typeof token !== 'string') {
	        return false;
	    }
	    // 포맷 검증 (옵션에 따라 건너뛸 수 있음)
	    if (!skipValidation) {
	        var validation = validateProjectToken(token);
	        if (!validation.isValid) {
	            logDebug('[ProjectToken] Token validation failed:', validation.error);
	            return false;
	        }
	    }
	    projectToken = token;
	    // localStorage의 기존 데이터에 projectToken 추가
	    try {
	        var existingData = (_b = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)) !== null && _b !== void 0 ? _b : {};
	        var updatedData = __assign$1(__assign$1({}, existingData), { projectToken: token });
	        setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, updatedData);
	        logDebug('[ProjectToken] Token saved to localStorage');
	    }
	    catch (error) {
	    }
	    return true;
	}
	/**
	 * 현재 설정된 프로젝트 토큰을 반환합니다.
	 * 메모리 캐시를 먼저 확인하고, 없으면 localStorage에서 복구합니다.
	 *
	 * @returns 프로젝트 토큰 또는 null
	 */
	function getProjectToken() {
	    // 메모리 캐시 확인
	    if (projectToken) {
	        return projectToken;
	    }
	    // localStorage에서 복구 시도
	    try {
	        var storedData = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	        if (storedData === null || storedData === void 0 ? void 0 : storedData.projectToken) {
	            projectToken = storedData.projectToken;
	            logDebug('[ProjectToken] Token restored from localStorage');
	            return projectToken;
	        }
	    }
	    catch (error) {
	    }
	    return null;
	}

	// Rollup replace 플러그인이 빌드 시 이 값을 치환합니다
	// 주의: process.env.ALB_ENDPOINT를 직접 사용해야 치환됨
	var BUILD_TIME_ALB_ENDPOINT = "https://behavior-tracking-event-gateway.imweb.me/api/v1/event";
	/** 아임웹 내부 토큰 prefix */
	var INTERNAL_TOKEN_PREFIX = 'bs-im-';
	function resolveAlbEndpoint() {
	    var projectToken = getProjectToken();
	    // projectToken 모드: Internal 또는 External 엔드포인트
	    if (projectToken) {
	        return resolveProjectTokenEndpoint(projectToken);
	    }
	    // [기존] Legacy 모드: 변경 없음
	    // 빌드 시 주입된 값 우선 사용
	    {
	        return BUILD_TIME_ALB_ENDPOINT;
	    }
	}
	/**
	 * projectToken prefix로 Internal/External 엔드포인트 결정
	 * - bs-im-* → Internal (아임웹 내부)
	 * - 그 외 → External (카페24 등 외부)
	 */
	function resolveProjectTokenEndpoint(token) {
	    var endpoint = token.startsWith(INTERNAL_TOKEN_PREFIX) ? INTERNAL_ALB_ENDPOINT : EXTERNAL_ALB_ENDPOINT;
	    return endpoint.PRODUCTION;
	}
	/**
	 * projectToken이 설정된 모드인지 (Internal + External 모두 포함)
	 * eventType 없이 eventName만 사용하는 모드
	 */
	function isProjectTokenMode() {
	    return getProjectToken() !== null;
	}
	/**
	 * Internal 모드: projectToken이 아임웹 내부 토큰 (bs-im-*)
	 * SDK_JWT는 서버에서 siteCode/unitCode 방어 검증용으로만 사용
	 */
	function isInternalMode() {
	    var token = getProjectToken();
	    return token !== null && token.startsWith(INTERNAL_TOKEN_PREFIX);
	}
	/**
	 * External 모드: projectToken이 외부 사이트용 (bs-im-* 이 아닌 토큰)
	 */
	function isExternalMode() {
	    return isProjectTokenMode() && !isInternalMode();
	}
	/**
	 * Legacy 엔드포인트 반환
	 * Internal 모드에서 init 자동 이벤트(페이지뷰, UTM)를 레거시로 보낼 때 사용
	 */
	function getLegacyEndpoint() {
	    {
	        return BUILD_TIME_ALB_ENDPOINT;
	    }
	}

	var BUILD_TIME_SDK_VERSION = "1.9.1";
	function getRuntimeBrowserInfo() {
	    try {
	        var browserInfo = Bowser.getParser(navigator.userAgent).getResult();
	        return {
	            platform: browserInfo.platform.type || '',
	            os: browserInfo.os.name || '',
	            browserName: browserInfo.browser.name || '',
	            browserVersion: browserInfo.browser.version || '',
	            language: navigator.language || '',
	        };
	    }
	    catch (error) {
	        return {
	            platform: '',
	            os: '',
	            browserName: '',
	            browserVersion: '',
	            language: '',
	        };
	    }
	}
	function buildImwebRequestHeaders(userInfo) {
	    var runtimeBrowserInfo = getRuntimeBrowserInfo();
	    return {
	        'Content-Type': 'application/json',
	        'imweb-device-id': (userInfo === null || userInfo === void 0 ? void 0 : userInfo.deviceId) || '',
	        'imweb-platform': runtimeBrowserInfo.platform,
	        'imweb-os': runtimeBrowserInfo.os,
	        'imweb-browser-name': runtimeBrowserInfo.browserName,
	        'imweb-browser-version': runtimeBrowserInfo.browserVersion,
	        'imweb-language': runtimeBrowserInfo.language,
	        'imweb-sdk-version': BUILD_TIME_SDK_VERSION,
	    };
	}

	// beforeSend 콜백 저장 (Mixpanel/Amplitude 스타일)
	var _beforeSendCallback = null;
	/**
	 * 현재 등록된 beforeSend 콜백을 반환합니다.
	 */
	function getBeforeSendCallback() {
	    return _beforeSendCallback;
	}
	/**
	 * beforeSend 콜백을 설정합니다.
	 */
	function setBeforeSendCallback(callback) {
	    _beforeSendCallback = callback;
	}

	/**
	 * 실패한 이벤트를 localStorage에 저장하는 이벤트 큐
	 * 네트워크 오류 발생 시 이벤트를 보존하고, 다음 전송 성공 시 함께 전송합니다.
	 */
	// 이벤트 큐 localStorage 키
	var EVENT_QUEUE_KEY = '__bs_event_queue';
	// 최대 큐 크기 (메모리/스토리지 한계 고려)
	var MAX_QUEUE_SIZE = 100;
	// 큐에 저장된 이벤트의 최대 보관 시간 (24시간)
	var MAX_EVENT_AGE_MS = 24 * 60 * 60 * 1000;
	function getSafeLocalStorage() {
	    if (typeof window === 'undefined') {
	        return null;
	    }
	    try {
	        return window.localStorage;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	/**
	 * localStorage에서 이벤트 큐를 읽어옵니다.
	 */
	function getEventQueue() {
	    var storage = getSafeLocalStorage();
	    if (!storage) {
	        return [];
	    }
	    try {
	        var stored = storage.getItem(EVENT_QUEUE_KEY);
	        if (!stored) {
	            return [];
	        }
	        var queue = JSON.parse(stored);
	        return Array.isArray(queue) ? queue : [];
	    }
	    catch (error) {
	        return [];
	    }
	}
	/**
	 * 이벤트 큐를 localStorage에 저장합니다.
	 */
	function saveEventQueue(queue) {
	    var storage = getSafeLocalStorage();
	    if (!storage) {
	        return;
	    }
	    try {
	        storage.setItem(EVENT_QUEUE_KEY, JSON.stringify(queue));
	    }
	    catch (error) {
	        // 스토리지 용량 초과 시 오래된 이벤트 삭제 후 재시도
	        if ((error === null || error === void 0 ? void 0 : error.name) === 'QuotaExceededError') {
	            var trimmedQueue = queue.slice(-Math.floor(MAX_QUEUE_SIZE / 2));
	            try {
	                storage.setItem(EVENT_QUEUE_KEY, JSON.stringify(trimmedQueue));
	            }
	            catch (_a) {
	                // 그래도 실패하면 큐 초기화
	                clearQueue();
	            }
	        }
	    }
	}
	/**
	 * 실패한 이벤트를 큐에 추가합니다.
	 * @param event - 전송 실패한 이벤트
	 * @param endpointOverride - 최초 전송 시 사용한 endpointOverride (재전송 시 보존). 없으면 저장하지 않음
	 * @returns 큐에 추가된 경우 true
	 */
	function enqueueEvent(event, endpointOverride) {
	    var queue = getEventQueue();
	    // 큐 크기 제한
	    if (queue.length >= MAX_QUEUE_SIZE) {
	        queue.shift();
	    }
	    var entry = {
	        event: event,
	        timestamp: new Date().toISOString(),
	        retryCount: 0,
	    };
	    // additive: 값이 있을 때만 필드 추가 (구 엔트리와 동일한 형태 유지)
	    if (endpointOverride) {
	        entry.endpointOverride = endpointOverride;
	    }
	    queue.push(entry);
	    saveEventQueue(queue);
	    logDebug('[EventQueue] ✅ 이벤트 큐에 추가됨, 현재 큐 크기:', queue.length);
	    return true;
	}
	/**
	 * 큐에서 이벤트를 꺼냅니다 (FIFO).
	 * @param count - 꺼낼 이벤트 수 (기본: 모든 이벤트)
	 * @returns 큐에서 꺼낸 이벤트 목록
	 */
	function dequeueEvents(count) {
	    var queue = getEventQueue();
	    // 만료된 이벤트 필터링
	    var now = Date.now();
	    var validQueue = queue.filter(function (entry) {
	        var age = now - new Date(entry.timestamp).getTime();
	        return age < MAX_EVENT_AGE_MS;
	    });
	    // 만료된 이벤트가 있으면 큐 업데이트
	    if (validQueue.length !== queue.length) {
	        logDebug('[EventQueue] ⚠️ 만료된 이벤트 제거:', queue.length - validQueue.length);
	    }
	    var dequeueCount = count ;
	    var dequeued = validQueue.splice(0, dequeueCount);
	    saveEventQueue(validQueue);
	    logDebug('[EventQueue] 📤 이벤트 꺼냄:', dequeued.length, '개, 남은 큐 크기:', validQueue.length);
	    return dequeued;
	}
	/**
	 * 큐의 현재 크기를 반환합니다.
	 */
	function getQueueLength() {
	    return getEventQueue().length;
	}
	/**
	 * 큐를 완전히 비웁니다.
	 */
	function clearQueue() {
	    var storage = getSafeLocalStorage();
	    if (!storage) {
	        return;
	    }
	    try {
	        storage.removeItem(EVENT_QUEUE_KEY);
	        logDebug('[EventQueue] 🗑️ 큐 초기화됨');
	    }
	    catch (error) {
	    }
	}

	/**
	 * 이벤트 히스토리 관리
	 * 디버깅 목적으로 최근 전송된 이벤트를 메모리에 보관합니다.
	 */
	// 최대 보관 이벤트 수
	var MAX_EVENT_HISTORY = 10;
	// 이벤트 히스토리 (메모리에만 저장)
	var eventHistory = [];
	/**
	 * 이벤트를 히스토리에 기록합니다.
	 * @param event - 기록할 이벤트
	 */
	function recordEvent(event) {
	    eventHistory.push(event);
	    // 최대 개수 초과 시 오래된 이벤트 제거
	    if (eventHistory.length > MAX_EVENT_HISTORY) {
	        eventHistory = eventHistory.slice(-MAX_EVENT_HISTORY);
	    }
	    logDebug('[EventHistory] 이벤트 기록됨, 현재 히스토리 크기:', eventHistory.length);
	}
	/**
	 * 최근 이벤트 히스토리를 반환합니다.
	 * @returns 최근 전송된 이벤트 목록 (최대 10개)
	 */
	function getEventHistory() {
	    return __spreadArray$1([], eventHistory, true);
	}
	/**
	 * 이벤트 히스토리를 초기화합니다.
	 */
	function clearEventHistory() {
	    eventHistory = [];
	}

	// 큐 플러시 동시 실행 방지 플래그
	var isFlushingQueue = false;
	/**
	 * 재시도 설정 (Exponential Backoff)
	 * - maxRetries: 최대 재시도 횟수
	 * - baseDelayMs: 첫 재시도 대기 시간 (ms)
	 * - maxDelayMs: 최대 대기 시간 (ms)
	 * - jitterRatio: 지연 시간 랜덤 분산 비율
	 */
	var RETRY_CONFIG = {
	    maxRetries: 3,
	    baseDelayMs: 1000,
	    maxDelayMs: 30000,
	    jitterRatio: 0.2,
	};
	/**
	 * Exponential backoff 지연 시간 계산
	 */
	function calculateBackoffDelay(retryCount) {
	    var delay = RETRY_CONFIG.baseDelayMs * Math.pow(2, retryCount);
	    return Math.min(delay, RETRY_CONFIG.maxDelayMs);
	}
	function isTestEnvironment() {
	    var _a;
	    try {
	        return ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) === 'test';
	    }
	    catch (_b) {
	        return false;
	    }
	}
	/**
	 * Jitter를 적용한 재시도 지연 시간 계산
	 * thundering herd 방지를 위해 ±jitterRatio 범위 내 랜덤 분산
	 */
	function calculateRetryDelay(retryCount) {
	    var baseDelay = calculateBackoffDelay(retryCount);
	    if (isTestEnvironment() || RETRY_CONFIG.jitterRatio <= 0) {
	        return baseDelay;
	    }
	    var jitter = baseDelay * RETRY_CONFIG.jitterRatio;
	    var min = Math.max(0, baseDelay - jitter);
	    var max = baseDelay + jitter;
	    return Math.round(min + Math.random() * (max - min));
	}
	/**
	 * 지정된 시간만큼 대기
	 */
	function delay(ms) {
	    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
	}
	function requeueBatchFrom(batch, startIndex) {
	    for (var i = startIndex; i < batch.length; i++) {
	        // 재큐잉 시에도 endpointOverride를 보존 (Internal 모드 Legacy 엔드포인트 유지)
	        enqueueEvent(batch[i].event, batch[i].endpointOverride);
	    }
	}
	/**
	 * 큐에 저장된 이벤트를 전송 시도합니다.
	 * 성공하면 큐에서 제거, 실패하면 재큐잉
	 * 큐가 빌 때까지 5개씩 처리합니다 (완전 드레인).
	 *
	 * 주의: 내부 전송 함수는 실패 시 'failed'를 반환하고 throw하지 않습니다.
	 * 따라서 반환값을 검사하여 실패를 감지합니다.
	 */
	function flushEventQueue() {
	    return __awaiter(this, void 0, void 0, function () {
	        var queueLength, batch, i, entry, result;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    // 동시 실행 방지
	                    if (isFlushingQueue) {
	                        return [2 /*return*/];
	                    }
	                    queueLength = getQueueLength();
	                    if (queueLength === 0) {
	                        return [2 /*return*/];
	                    }
	                    isFlushingQueue = true;
	                    _a.label = 1;
	                case 1:
	                    _a.trys.push([1, , 10, 11]);
	                    _a.label = 2;
	                case 2:
	                    if (!(queueLength > 0)) return [3 /*break*/, 9];
	                    batch = dequeueEvents(5);
	                    if (batch.length === 0)
	                        return [3 /*break*/, 9];
	                    i = 0;
	                    _a.label = 3;
	                case 3:
	                    if (!(i < batch.length)) return [3 /*break*/, 8];
	                    entry = batch[i];
	                    _a.label = 4;
	                case 4:
	                    _a.trys.push([4, 6, , 7]);
	                    return [4 /*yield*/, sendDataToAPIWithResult(entry.event, {
	                            disableRetry: true,
	                            disableQueue: true,
	                            _isFromQueue: true,
	                            endpointOverride: entry.endpointOverride,
	                        })];
	                case 5:
	                    result = _a.sent();
	                    if (result !== 'success') {
	                        requeueBatchFrom(batch, i);
	                        logDebug('[EventQueue] ⚠️ 전송 실패, 남은 배치 재큐잉:', batch.length - i);
	                        return [2 /*return*/];
	                    }
	                    logDebug('[EventQueue] ✅ 큐 이벤트 전송 성공:', entry.event.eventId);
	                    return [3 /*break*/, 7];
	                case 6:
	                    _a.sent();
	                    // 예외적 오류 (JSON.stringify 실패 등)
	                    requeueBatchFrom(batch, i);
	                    return [2 /*return*/];
	                case 7:
	                    i++;
	                    return [3 /*break*/, 3];
	                case 8:
	                    queueLength = getQueueLength();
	                    return [3 /*break*/, 2];
	                case 9:
	                    return [3 /*break*/, 11];
	                case 10:
	                    isFlushingQueue = false;
	                    return [7 /*endfinally*/];
	                case 11: return [2 /*return*/];
	            }
	        });
	    });
	}
	function sendDataToAPIWithResult(data_1) {
	    return __awaiter(this, arguments, void 0, function (data, options) {
	        var userInfo, ALB_ENDPOINT, brandscopeSdkVersion, projectToken, enrichedData, commonSessionId, customSessionId, beforeSendCallback, modifiedData, canUseBeacon, ok, requestInit, maxRetries, retryCount, response, isRetryable, retryDelay, retryDelay;
	        var _a, _b;
	        if (options === void 0) { options = {}; }
	        return __generator(this, function (_c) {
	            switch (_c.label) {
	                case 0:
	                    logDebug('[sendDataToAPI] 호출됨, eventType:', data.eventType);
	                    userInfo = (_a = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO)) !== null && _a !== void 0 ? _a : getCookie(COOKIE_NAMES.USER_INFO);
	                    if (!userInfo) {
	                        return [2 /*return*/, 'failed'];
	                    }
	                    logDebug('[sendDataToAPI] ✅ userInfo 존재:', userInfo.deviceId);
	                    ALB_ENDPOINT = options.endpointOverride || resolveAlbEndpoint();
	                    // 엔드포인트가 없으면 (플레이그라운드 등) 전송을 건너뛴다
	                    if (!ALB_ENDPOINT) {
	                        return [2 /*return*/, 'failed'];
	                    }
	                    brandscopeSdkVersion = "1.9.1";
	                    projectToken = (_b = data.projectToken) !== null && _b !== void 0 ? _b : getProjectToken();
	                    if (options._isFromQueue) {
	                        // 큐에서 꺼낸 이벤트는 원본 세션 ID 보존 (덮어쓰지 않음)
	                        // 이벤트 발생 시점의 세션을 유지하여 세션 분석 왜곡 방지
	                        enrichedData = __assign$1(__assign$1({}, data), { sdkVersion: brandscopeSdkVersion, projectToken: projectToken });
	                        logDebug('[sendDataToAPI] 큐 이벤트 - 원본 세션 보존:', data.commonSessionId, data.customSessionId);
	                    }
	                    else {
	                        commonSessionId = refreshCommonSession();
	                        customSessionId = refreshCustomSession();
	                        enrichedData = __assign$1(__assign$1({}, data), { commonSessionId: commonSessionId, customSessionId: customSessionId, sdkVersion: brandscopeSdkVersion, projectToken: projectToken });
	                        logDebug('[sendDataToAPI] commonSessionId:', commonSessionId, 'customSessionId:', customSessionId, 'sdkVersion:', brandscopeSdkVersion, 'projectToken:', projectToken ? projectToken.substring(0, 10) + '...' : null);
	                    }
	                    beforeSendCallback = options._isFromQueue ? null : getBeforeSendCallback();
	                    if (beforeSendCallback) {
	                        try {
	                            modifiedData = beforeSendCallback(enrichedData);
	                            if (modifiedData === null) {
	                                logDebug('[sendDataToAPI] ⏭️ beforeSend가 null 반환 - 전송 취소');
	                                return [2 /*return*/, 'cancelled'];
	                            }
	                            enrichedData = modifiedData;
	                            logDebug('[sendDataToAPI] ✅ beforeSend 콜백 적용됨');
	                        }
	                        catch (error) {
	                            // 오류 발생 시에도 원본 데이터로 전송 계속
	                        }
	                    }
	                    canUseBeacon = typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function';
	                    if (canUseBeacon) {
	                        try {
	                            ok = navigator.sendBeacon(ALB_ENDPOINT, new Blob([JSON.stringify(enrichedData)], { type: 'application/json' }));
	                            if (ok) {
	                                logDebug('[sendDataToAPI] ✅ sendBeacon 전송 성공');
	                                // 이벤트 히스토리에 기록
	                                recordEvent(enrichedData);
	                                // 전송 성공 시 큐에 있는 이벤트도 처리 시도 (재귀 방지)
	                                if (!options._isFromQueue && !options.disableQueue) {
	                                    flushEventQueue();
	                                }
	                                return [2 /*return*/, 'success'];
	                            }
	                        }
	                        catch (error) {
	                        }
	                    }
	                    requestInit = {
	                        method: 'POST',
	                        headers: buildImwebRequestHeaders(userInfo),
	                        body: JSON.stringify(enrichedData),
	                        keepalive: options.keepalive || false,
	                    };
	                    maxRetries = options.disableRetry ? 0 : RETRY_CONFIG.maxRetries;
	                    retryCount = 0;
	                    _c.label = 1;
	                case 1:
	                    if (!(retryCount <= maxRetries)) return [3 /*break*/, 10];
	                    _c.label = 2;
	                case 2:
	                    _c.trys.push([2, 6, , 9]);
	                    return [4 /*yield*/, fetch(ALB_ENDPOINT, requestInit)
	                        // 성공적인 응답 (2xx)
	                    ];
	                case 3:
	                    response = _c.sent();
	                    // 성공적인 응답 (2xx)
	                    if (response.ok) {
	                        logDebug('[sendDataToAPI] ✅ API 응답:', response.status, response.statusText);
	                        // 이벤트 히스토리에 기록
	                        recordEvent(enrichedData);
	                        // 전송 성공 시 큐에 있는 이벤트도 처리 시도 (재귀 방지)
	                        if (!options._isFromQueue && !options.disableQueue) {
	                            flushEventQueue();
	                        }
	                        return [2 /*return*/, 'success'];
	                    }
	                    isRetryable = response.status >= 500 || response.status === 429;
	                    if (!(isRetryable && retryCount < maxRetries)) return [3 /*break*/, 5];
	                    retryDelay = calculateRetryDelay(retryCount);
	                    logDebug("[sendDataToAPI] \u26A0\uFE0F \uC7AC\uC2DC\uB3C4 \uB300\uAE30 (".concat(retryCount + 1, "/").concat(maxRetries, "), ").concat(retryDelay, "ms \uD6C4 \uC7AC\uC2DC\uB3C4, status:"), response.status);
	                    return [4 /*yield*/, delay(retryDelay)];
	                case 4:
	                    _c.sent();
	                    return [3 /*break*/, 9];
	                case 5:
	                    // 재시도 불가능한 오류 (4xx 클라이언트 오류 등)
	                    logDebug('[sendDataToAPI] ❌ API 응답 오류 (재시도 불가):', response.status, response.statusText);
	                    return [2 /*return*/, 'failed'];
	                case 6:
	                    _c.sent();
	                    if (!(retryCount < maxRetries)) return [3 /*break*/, 8];
	                    retryDelay = calculateRetryDelay(retryCount);
	                    return [4 /*yield*/, delay(retryDelay)];
	                case 7:
	                    _c.sent();
	                    return [3 /*break*/, 9];
	                case 8: return [3 /*break*/, 9];
	                case 9:
	                    retryCount++;
	                    return [3 /*break*/, 1];
	                case 10:
	                    // 큐에서 꺼낸 이벤트가 아니고 큐가 활성화되어 있으면 저장
	                    // endpointOverride를 함께 저장해 재전송(flush) 시 동일 엔드포인트를 유지
	                    if (!options._isFromQueue && !options.disableQueue) {
	                        enqueueEvent(enrichedData, options.endpointOverride);
	                    }
	                    return [2 /*return*/, 'failed'];
	            }
	        });
	    });
	}
	function sendDataToAPI(data_1) {
	    return __awaiter(this, arguments, void 0, function (data, options) {
	        var result;
	        if (options === void 0) { options = {}; }
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, sendDataToAPIWithResult(data, options)];
	                case 1:
	                    result = _a.sent();
	                    return [2 /*return*/, result === 'success' ? undefined : null];
	            }
	        });
	    });
	}

	function extractPath(url) {
	    try {
	        // URL이 비어있거나 undefined인 경우 처리
	        if (!(url === null || url === void 0 ? void 0 : url.trim())) {
	            return null;
	        }
	        // URL 객체 생성을 위해 프로토콜이 없는 경우 추가
	        var normalizedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : "https://".concat(url);
	        var urlObject = new URL(normalizedUrl);
	        // 최소한의 유효한 도메인 구조 확인 (예: example.com)
	        var hostParts = urlObject.hostname.split('.');
	        if (hostParts.length < 2 || !hostParts.every(function (part) { return part.length > 0; })) {
	            return null;
	        }
	        return urlObject.pathname;
	    }
	    catch (_error) {
	        return null;
	    }
	}

	function normalizeBase64Url(input) {
	    var normalized = input.replace(/-/g, '+').replace(/_/g, '/');
	    var padding = normalized.length % 4;
	    if (padding === 2)
	        return "".concat(normalized, "==");
	    if (padding === 3)
	        return "".concat(normalized, "=");
	    if (padding === 1)
	        return "".concat(normalized, "===");
	    return normalized;
	}
	function decodeBase64Url(input) {
	    var normalized = normalizeBase64Url(input);
	    try {
	        if (typeof atob === 'function') {
	            return atob(normalized);
	        }
	    }
	    catch (_a) {
	        // fall through
	    }
	    try {
	        if (typeof Buffer !== 'undefined') {
	            return Buffer.from(normalized, 'base64').toString('utf-8');
	        }
	    }
	    catch (_b) {
	        return null;
	    }
	    return null;
	}
	function decodeSdkJwtPayload(token) {
	    if (!token)
	        return null;
	    var trimmed = token.trim();
	    if (!trimmed)
	        return null;
	    var raw = trimmed.startsWith('Bearer ') ? trimmed.slice(7) : trimmed;
	    var parts = raw.split('.');
	    if (parts.length < 2)
	        return null;
	    var decoded = decodeBase64Url(parts[1]);
	    if (!decoded)
	        return null;
	    try {
	        var payload = JSON.parse(decoded);
	        return payload && typeof payload === 'object' ? payload : null;
	    }
	    catch (_a) {
	        return null;
	    }
	}
	function toNonEmptyString(value) {
	    if (typeof value !== 'string')
	        return null;
	    var trimmed = value.trim();
	    return trimmed.length > 0 ? trimmed : null;
	}
	function extractSiteUnitFromSdkJwt(token) {
	    var _a, _b;
	    var payload = decodeSdkJwtPayload(token);
	    if (!payload) {
	        return { siteCode: null, unitCode: null };
	    }
	    var siteCode = toNonEmptyString((_a = payload.siteCode) !== null && _a !== void 0 ? _a : payload.site_code);
	    var unitCode = toNonEmptyString((_b = payload.unitCode) !== null && _b !== void 0 ? _b : payload.unit_code);
	    return { siteCode: siteCode, unitCode: unitCode };
	}

	/**
	 * localStorage에서 super properties를 읽어옵니다.
	 */
	function getSuperProperties() {
	    /* istanbul ignore next -- @preserve SSR guard: window is always defined in jsdom */
	    if (typeof window === 'undefined' || !window.localStorage) {
	        return {};
	    }
	    try {
	        var stored = window.localStorage.getItem(LOCAL_STORAGE_KEYS.SUPER_PROPERTIES);
	        if (!stored) {
	            return {};
	        }
	        var parsed = JSON.parse(stored);
	        return typeof parsed === 'object' && parsed !== null ? parsed : {};
	    }
	    catch (error) {
	        return {};
	    }
	}
	/**
	 * super properties를 localStorage에 저장합니다.
	 */
	function saveSuperProperties(props) {
	    /* istanbul ignore next -- @preserve SSR guard: window is always defined in jsdom */
	    if (typeof window === 'undefined' || !window.localStorage) {
	        return;
	    }
	    try {
	        window.localStorage.setItem(LOCAL_STORAGE_KEYS.SUPER_PROPERTIES, JSON.stringify(props));
	        logDebug('[SuperProperties] ✅ 저장됨:', Object.keys(props));
	    }
	    catch (error) {
	    }
	}
	/**
	 * Super properties를 설정합니다. (기존 값 덮어쓰기)
	 * @param properties - 설정할 속성들
	 */
	function register(properties) {
	    var current = getSuperProperties();
	    var updated = __assign$1(__assign$1({}, current), properties);
	    saveSuperProperties(updated);
	}
	/**
	 * Super properties를 설정합니다. (기존 값이 없을 때만)
	 * Mixpanel의 registerOnce()와 동일한 동작
	 * @param properties - 설정할 속성들
	 * @param defaultValue - 기존 값이 이 값과 같을 때만 덮어쓰기 (선택)
	 */
	function registerOnce(properties, defaultValue) {
	    var current = getSuperProperties();
	    var updated = __assign$1({}, current);
	    for (var _i = 0, _a = Object.entries(properties); _i < _a.length; _i++) {
	        var _b = _a[_i], key = _b[0], value = _b[1];
	        // 키가 없거나 defaultValue와 같을 때만 설정
	        if (!(key in current) || current[key] === defaultValue) {
	            updated[key] = value;
	        }
	    }
	    saveSuperProperties(updated);
	}
	/**
	 * 특정 super property를 제거합니다.
	 * @param propertyName - 제거할 속성 이름
	 */
	function unregister(propertyName) {
	    var current = getSuperProperties();
	    if (propertyName in current) {
	        delete current[propertyName];
	        saveSuperProperties(current);
	    }
	}
	/**
	 * 모든 super properties를 초기화합니다.
	 */
	function clearSuperProperties() {
	    /* istanbul ignore next -- @preserve SSR guard: window is always defined in jsdom */
	    if (typeof window === 'undefined' || !window.localStorage) {
	        return;
	    }
	    try {
	        window.localStorage.removeItem(LOCAL_STORAGE_KEYS.SUPER_PROPERTIES);
	        logDebug('[SuperProperties] 🗑️ 초기화됨');
	    }
	    catch (error) {
	    }
	}

	/**
	 * 기본 Rage Click 설정
	 */
	var DEFAULT_RAGE_CLICK_CONFIG = {
	    enabled: true,
	    clickThreshold: 3,
	    timeWindowMs: 1000,
	    maxDistancePx: 30,
	};
	/**
	 * Rage Click Detector
	 * 사용자가 짧은 시간 내에 같은 위치를 여러 번 클릭하는 행동을 감지합니다.
	 * UX 문제 발견에 유용한 autotrack 기능입니다.
	 */
	var RageClickDetector = /** @class */ (function () {
	    function RageClickDetector(config) {
	        if (config === void 0) { config = {}; }
	        this.clicks = [];
	        this.callback = null;
	        this.isRunning = false;
	        this.boundClickHandler = null;
	        this.config = __assign$1(__assign$1({}, DEFAULT_RAGE_CLICK_CONFIG), config);
	        logDebug('[RageClick] Detector 생성됨, config:', this.config);
	    }
	    /**
	     * Rage Click 감지 콜백을 설정합니다.
	     */
	    RageClickDetector.prototype.onRageClick = function (callback) {
	        this.callback = callback;
	    };
	    /**
	     * Rage Click 감지를 시작합니다.
	     */
	    RageClickDetector.prototype.start = function () {
	        if (this.isRunning) {
	            return;
	        }
	        if (typeof window === 'undefined' || typeof document === 'undefined') {
	            return;
	        }
	        if (!this.config.enabled) {
	            return;
	        }
	        this.boundClickHandler = this.handleClick.bind(this);
	        document.addEventListener('click', this.boundClickHandler, true);
	        this.isRunning = true;
	    };
	    /**
	     * Rage Click 감지를 중지합니다.
	     */
	    RageClickDetector.prototype.stop = function () {
	        if (!this.isRunning || !this.boundClickHandler) {
	            return;
	        }
	        document.removeEventListener('click', this.boundClickHandler, true);
	        this.boundClickHandler = null;
	        this.isRunning = false;
	        this.clicks = [];
	    };
	    /**
	     * 현재 실행 상태를 반환합니다.
	     */
	    RageClickDetector.prototype.isActive = function () {
	        return this.isRunning;
	    };
	    /**
	     * 클릭 이벤트 핸들러
	     */
	    RageClickDetector.prototype.handleClick = function (event) {
	        var _this = this;
	        var now = Date.now();
	        var click = {
	            x: event.clientX,
	            y: event.clientY,
	            timestamp: now,
	            target: event.target,
	        };
	        // 오래된 클릭 제거
	        this.clicks = this.clicks.filter(function (c) { return now - c.timestamp < _this.config.timeWindowMs; });
	        // 새 클릭 추가
	        this.clicks.push(click);
	        // Rage click 검사
	        var nearbyClicks = this.clicks.filter(function (c) {
	            var distance = Math.sqrt(Math.pow(c.x - click.x, 2) + Math.pow(c.y - click.y, 2));
	            return distance <= _this.config.maxDistancePx;
	        });
	        if (nearbyClicks.length >= this.config.clickThreshold) {
	            this.triggerRageClick(nearbyClicks, event);
	            // 중복 트리거 방지를 위해 클릭 기록 초기화
	            this.clicks = [];
	        }
	    };
	    /**
	     * Rage Click 이벤트 발생
	     */
	    RageClickDetector.prototype.triggerRageClick = function (clicks, lastEvent) {
	        var _a;
	        var element = lastEvent.target instanceof Element ? lastEvent.target : null;
	        var rageClickEvent = {
	            clickCount: clicks.length,
	            x: lastEvent.clientX,
	            y: lastEvent.clientY,
	            element: element
	                ? {
	                    tagName: element.tagName.toLowerCase(),
	                    id: element.id || '',
	                    className: typeof element.className === 'string' ? element.className : '',
	                    textContent: ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.slice(0, 100)) || null,
	                }
	                : null,
	            pageUrl: window.location.href,
	        };
	        if (this.callback) {
	            try {
	                this.callback(rageClickEvent);
	            }
	            catch (error) {
	            }
	        }
	        // CustomEvent 발행 (다른 SDK나 분석 도구에서 사용 가능)
	        if (typeof CustomEvent === 'function') {
	            window.dispatchEvent(new CustomEvent('brandscope:rage-click', {
	                detail: rageClickEvent,
	            }));
	        }
	    };
	    return RageClickDetector;
	}());
	// 싱글톤 인스턴스 (필요 시 사용)
	var defaultDetector = null;
	/**
	 * 기본 Rage Click Detector를 반환합니다.
	 */
	function getRageClickDetector() {
	    if (!defaultDetector) {
	        defaultDetector = new RageClickDetector();
	    }
	    return defaultDetector;
	}
	/**
	 * 기본 Rage Click Detector를 설정과 함께 초기화합니다.
	 */
	function initRageClickDetector(config) {
	    if (config === void 0) { config = {}; }
	    if (defaultDetector) {
	        defaultDetector.stop();
	    }
	    defaultDetector = new RageClickDetector(config);
	    return defaultDetector;
	}

	/**
	 * sessionStorage에서 timed events 맵을 가져옵니다.
	 */
	function getTimedEvents() {
	    var _a;
	    return (_a = getSessionStorage(SESSION_STORAGE_KEYS.TIMED_EVENTS)) !== null && _a !== void 0 ? _a : {};
	}
	/**
	 * sessionStorage에 timed events 맵을 저장합니다.
	 */
	function setTimedEvents(events) {
	    setSessionStorage(SESSION_STORAGE_KEYS.TIMED_EVENTS, events);
	}
	/**
	 * 이벤트 타이머를 시작합니다.
	 * 이후 동일한 eventName으로 track()을 호출하면 duration(초)이 자동으로 포함됩니다.
	 *
	 * @param eventName - 타이머를 시작할 이벤트 이름
	 */
	function startTimeEvent(eventName) {
	    if (!eventName || typeof eventName !== 'string') {
	        return;
	    }
	    var events = getTimedEvents();
	    events[eventName] = Date.now();
	    setTimedEvents(events);
	}
	/**
	 * 이벤트 타이머의 경과 시간(초)을 반환하고 타이머를 제거합니다.
	 * 타이머가 없으면 null을 반환합니다.
	 *
	 * @param eventName - 경과 시간을 조회할 이벤트 이름
	 * @returns 경과 시간(초, 소수점 1자리) 또는 null
	 */
	function consumeTimeEvent(eventName) {
	    if (!eventName || typeof eventName !== 'string') {
	        return null;
	    }
	    var events = getTimedEvents();
	    var startTime = events[eventName];
	    if (startTime === undefined) {
	        return null;
	    }
	    delete events[eventName];
	    setTimedEvents(events);
	    var durationMs = Date.now() - startTime;
	    var durationSec = Math.round(durationMs / 100) / 10; // 소수점 1자리
	    return durationSec;
	}
	/**
	 * 모든 타이머를 초기화합니다.
	 */
	function clearTimedEvents() {
	    setTimedEvents({});
	}

	/**
	 * Super properties와 사용자 properties를 병합합니다.
	 * Super properties는 모든 이벤트에 자동으로 포함됩니다.
	 * @param userProps - 사용자가 제공한 properties (super보다 우선)
	 * @param extraProps - 추가 속성 ($duration 등, 가장 낮은 우선순위)
	 */
	function mergeWithSuperProperties(userProps, extraProps) {
	    if (userProps === void 0) { userProps = {}; }
	    if (extraProps === void 0) { extraProps = {}; }
	    var superProps = getSuperProperties();
	    var merged = __assign$1(__assign$1(__assign$1({}, extraProps), superProps), userProps); // extraProps < super < user 순서
	    return JSON.stringify(merged);
	}
	/**
	 * SDK 환경 정보를 콘솔에 출력합니다.
	 * 개발 환경에서 자동으로 호출됩니다.
	 */
	function logSDKInfo() {
	    var _a, _b;
	    var styles = {
	        header: 'background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
	        label: 'color: #64748b; font-weight: bold;',
	        value: 'color: #0ea5e9;',
	        warning: 'color: #f59e0b; font-weight: bold;',
	    };
	    /* eslint-disable no-console */
	    console.log('%c🔬 BrandScope SDK Debug Info', styles.header);
	    console.log('');
	    console.log('%c📦 SDK Version:%c ' + "1.9.1", styles.label, styles.value);
	    console.log('%c🌍 Environment:%c ' + "production", styles.label, styles.value);
	    console.log('%c🔗 API Endpoint:%c ' + "https://behavior-tracking-event-gateway.imweb.me/api/v1/event", styles.label, styles.value);
	    console.log('%c🕐 Build Time:%c ' + "2026-07-21T17:30:58+09:00", styles.label, styles.value);
	    console.log('%c🐛 Dev Mode:%c ' + ('Disabled'), styles.label, styles.value);
	    console.log('');
	    // 브라우저 환경 정보
	    if (typeof window !== 'undefined') {
	        console.log('%c🖥️ Browser Environment', styles.header);
	        console.log('');
	        console.log('%cUser Agent:%c ' + navigator.userAgent, styles.label, styles.value);
	        console.log('%cCookies Enabled:%c ' + navigator.cookieEnabled, styles.label, styles.value);
	        console.log('%cLanguage:%c ' + navigator.language, styles.label, styles.value);
	        console.log('%cCurrent URL:%c ' + window.location.href, styles.label, styles.value);
	        console.log('%cReferrer:%c ' + (document.referrer || '(none)'), styles.label, styles.value);
	        console.log('');
	        // 글로벌 변수 상태
	        console.log('%c⚙️ Global Variables', styles.header);
	        console.log('');
	        if (isExternalMode()) {
	            console.log('%cMode:%c External (projectToken)', styles.label, styles.value);
	            console.log('%cSITE_CODE:%c (external mode)', styles.label, styles.warning);
	            console.log('%cUNIT_CODE:%c (external mode)', styles.label, styles.warning);
	            console.log('%cSDK_JWT:%c (external mode)', styles.label, styles.warning);
	        }
	        else if (isInternalMode()) {
	            var _c = extractSiteUnitFromSdkJwt((_a = window.SDK_JWT) !== null && _a !== void 0 ? _a : null), decodedSiteCode = _c.siteCode, decodedUnitCode = _c.unitCode;
	            console.log('%cMode:%c Internal (projectToken + SDK_JWT)', styles.label, styles.value);
	            console.log('%cSITE_CODE:%c ' + (decodedSiteCode || '(not set)'), styles.label, decodedSiteCode ? styles.value : styles.warning);
	            console.log('%cUNIT_CODE:%c ' + (decodedUnitCode || '(not set)'), styles.label, decodedUnitCode ? styles.value : styles.warning);
	            console.log('%cSDK_JWT:%c (set)', styles.label, styles.value);
	        }
	        else {
	            var _d = extractSiteUnitFromSdkJwt((_b = window.SDK_JWT) !== null && _b !== void 0 ? _b : null), decodedSiteCode = _d.siteCode, decodedUnitCode = _d.unitCode;
	            console.log('%cSITE_CODE:%c ' + (decodedSiteCode || '(not set)'), styles.label, decodedSiteCode ? styles.value : styles.warning);
	            console.log('%cUNIT_CODE:%c ' + (decodedUnitCode || '(not set)'), styles.label, decodedUnitCode ? styles.value : styles.warning);
	            console.log('%cSDK_JWT:%c ' + (window.SDK_JWT ? '(set)' : '(not set)'), styles.label, window.SDK_JWT ? styles.value : styles.warning);
	        }
	        console.log('');
	    }
	    /* eslint-enable no-console */
	}
	function toPersistentStorageData(data) {
	    var _a, _b, _c;
	    return {
	        deviceId: data.deviceId,
	        deviceIdCreatedAt: (_a = data.deviceIdCreatedAt) !== null && _a !== void 0 ? _a : null,
	        siteCode: (_b = data.siteCode) !== null && _b !== void 0 ? _b : null,
	        unitCode: (_c = data.unitCode) !== null && _c !== void 0 ? _c : null,
	    };
	}
	function toSessionStorageData(data) {
	    data.deviceId; data.deviceIdCreatedAt; data.siteCode; data.unitCode; var session = __rest(data, ["deviceId", "deviceIdCreatedAt", "siteCode", "unitCode"]);
	    var defaultSessionData = {
	        platform: null,
	        browserSessionId: null,
	        sdkJwt: null,
	        referrer: null,
	        initialReferrer: null,
	        initialReferrerDomain: null,
	        utmSource: null,
	        utmMedium: null,
	        utmCampaign: null,
	        utmTerm: null,
	        utmContent: null,
	        utmLandingUrl: null,
	        utmUpdatedTime: null,
	        updatedAt: null,
	        commonSessionId: null,
	        commonSessionUpdatedAt: null,
	        customSessionId: null,
	        customSessionUpdatedAt: null,
	    };
	    return __assign$1(__assign$1({}, defaultSessionData), session);
	}
	function toSnakeCaseKey(key) {
	    return key.replace(/[A-Z]/g, function (letter) { return "_".concat(letter.toLowerCase()); });
	}
	function buildSnakeCaseSessionData(data) {
	    var result = {};
	    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
	        var _b = _a[_i], key = _b[0], value = _b[1];
	        var snakeKey = toSnakeCaseKey(key);
	        if (snakeKey === key) {
	            continue;
	        }
	        result[snakeKey] = value !== null && value !== void 0 ? value : null;
	    }
	    return result;
	}
	var stopStorageFocusSync = null;
	var sdkInitState = 'idle';
	var sdkInitPromise = null;
	function ensureStorageFocusSyncStarted() {
	    if (stopStorageFocusSync) {
	        return stopStorageFocusSync;
	    }
	    /* istanbul ignore next -- @preserve SSR guard: window is always defined in jsdom */
	    if (typeof window === 'undefined') {
	        return null;
	    }
	    // 포커스 복귀 시점에 스토리지 값을 재동기화합니다.
	    var handler = function () {
	        try {
	            syncStorageData('focus');
	        }
	        catch (error) {
	        }
	    };
	    window.addEventListener('focus', handler);
	    stopStorageFocusSync = function () { return window.removeEventListener('focus', handler); };
	    return stopStorageFocusSync;
	}
	/**
	 * SDK 초기화 완료 시점을 알리기 위한 커스텀 이벤트를 발행합니다.
	 * 브라우저 환경이 아니거나 CustomEvent를 지원하지 않으면 발행하지 않습니다.
	 * 주의: 해당함수가 생성하는 CustomEvent는 해당 SDK를 활용할 제품에서 addEventListener 하고있습니다.
	 */
	function dispatchSdkInitEvent() {
	    if (typeof window === 'undefined')
	        return;
	    if (typeof window.dispatchEvent !== 'function')
	        return;
	    if (typeof CustomEvent !== 'function')
	        return;
	    // SDK 초기화 완료를 외부에서 감지할 수 있도록 커스텀 이벤트를 발행합니다.
	    window.dispatchEvent(new CustomEvent('brandscope-sdk-init'));
	}
	function appendStorageSyncHistory(entry) {
	    var _a;
	    var stored = (_a = getSessionStorage(SESSION_STORAGE_KEYS.USER_INFO_HISTORY)) !== null && _a !== void 0 ? _a : [];
	    var history = Array.isArray(stored) ? stored : [];
	    var next = __spreadArray$1(__spreadArray$1([], history, true), [entry], false).slice(-20);
	    setSessionStorage(SESSION_STORAGE_KEYS.USER_INFO_HISTORY, next);
	}
	// 로컬/세션 스토리지 데이터를 최신 상태로 맞추고 히스토리를 남깁니다.
	function syncStorageData(reason) {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
	    if (reason === void 0) { reason = 'init'; }
	    upgradeCookieSecurity(COOKIE_NAMES.USER_INFO);
	    var browserInfo = Bowser.getParser(navigator.userAgent).getResult();
	    var currentUrl = window.location.href;
	    var cookiesEnabled = navigator.cookieEnabled;
	    var utmParams = parseUTMParams();
	    var browserData = {
	        platform: nullifyEmptyValue(browserInfo.platform.type),
	        os: nullifyEmptyValue(browserInfo.os.name),
	        language: nullifyEmptyValue(navigator.language),
	        browserName: nullifyEmptyValue(browserInfo.browser.name),
	        browserVersion: nullifyEmptyValue(browserInfo.browser.version),
	        userAgent: nullifyEmptyValue(navigator.userAgent),
	        path: extractPath(currentUrl),
	    };
	    var persistentSource = (_a = (cookiesEnabled ? getCookie(COOKIE_NAMES.USER_INFO) : null)) !== null && _a !== void 0 ? _a : getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	    var persistentCandidate = persistentSource ? toPersistentStorageData(persistentSource) : null;
	    var existingPersistentData = (persistentCandidate === null || persistentCandidate === void 0 ? void 0 : persistentCandidate.deviceId) ? persistentCandidate : null;
	    var existingSessionData = (_b = getSessionStorage(SESSION_STORAGE_KEYS.USER_INFO)) !== null && _b !== void 0 ? _b : null;
	    // sessionStorage에 살아있는(non-null) utmSource가 있는지. UTM 복원의 원자성 게이트로 사용한다.
	    var sessionHasUtmSource = !!(existingSessionData && existingSessionData.utmSource);
	    // cookie/localStorage 원본에서 세션 관련 필드를 별도 보존
	    // 새 탭/브라우저 재시작 시 sessionStorage가 비어있어도 세션이 유실되지 않도록 함
	    //
	    // [UTM 유실 방지] UTM도 세션 필드와 동일한 손실 경로를 가진다:
	    // toPersistentStorageData()는 cookie 원본에서 4개 필드(deviceId 등)만 추출하므로 UTM을 버린다.
	    // merge에서 cookie 원본이 유입되는 통로는 (a) preservedSessionFields (b) existingPersistentData 뿐이라,
	    // sessionStorage가 비어있으면(새 탭/인앱→외부 브라우저 컨텍스트 전환 등) cookie에 남아있던 UTM이
	    // 아무 통로로도 복원되지 못하고, 이후 mergedCookieData가 UTM=null로 cookie를 덮어써 버린다.
	    // 그 결과 PHP 서버가 __bs_imweb 쿠키를 직접 읽는 구매이벤트 경로까지 UTM이 유실된다.
	    //
	    // ⚠️ 원자성(atomicity): UTM은 하나의 귀인 터치포인트라 반드시 그룹 단위로 복원해야 한다.
	    // sessionStorage에 살아있는 utmSource가 있으면(=최신 유입) 그 그룹이 이겨야 하므로 cookie UTM을
	    // 아예 복원하지 않는다. 필드별로 복원하면 sessionStorage(source=A, medium=null) + cookie(medium=B)가
	    // 섞여 존재한 적 없는 A/B 귀인이 만들어진다. utmUpdatedTime은 7일 만료 계산에 필요하므로 함께 복원.
	    var preservedSessionFields = persistentSource
	        ? __assign$1({ commonSessionId: (_c = persistentSource.commonSessionId) !== null && _c !== void 0 ? _c : null, commonSessionUpdatedAt: (_d = persistentSource.commonSessionUpdatedAt) !== null && _d !== void 0 ? _d : null, customSessionId: (_e = persistentSource.customSessionId) !== null && _e !== void 0 ? _e : null, customSessionUpdatedAt: (_f = persistentSource.customSessionUpdatedAt) !== null && _f !== void 0 ? _f : null, 
	            // [initialReferrer 유실 방지] initialReferrer도 UTM과 동일한 손실 경로를 가진다:
	            // sessionStorage가 비면 Referrer 리졸버의 oldReferrer가 undefined→현재 document.referrer로
	            // 대체되어(리다이렉트 복귀 시 @direct 등) 원래 진입 referrer가 유실되고, 그 값이 다시 쿠키에
	            // 써져 PHP 구매이벤트의 referrer 귀인까지 유실된다. 리졸버가 oldReferrer/updatedAt로 2시간
	            // 만료를 평가하므로 둘을 함께 복원한다(2시간 초과 시엔 정상적으로 재계산됨).
	            // initialReferrerDomain은 리졸버가 initialReferrer에서 파생하므로 복원 불필요.
	            // 단일 필드라 UTM 그룹과 달리 게이트 불필요(merge 우선순위상 sessionStorage 값이 있으면 우선).
	            initialReferrer: (_g = persistentSource.initialReferrer) !== null && _g !== void 0 ? _g : null, updatedAt: (_h = persistentSource.updatedAt) !== null && _h !== void 0 ? _h : null }, (sessionHasUtmSource
	            ? {}
	            : {
	                utmSource: (_j = persistentSource.utmSource) !== null && _j !== void 0 ? _j : null,
	                utmMedium: (_k = persistentSource.utmMedium) !== null && _k !== void 0 ? _k : null,
	                utmCampaign: (_l = persistentSource.utmCampaign) !== null && _l !== void 0 ? _l : null,
	                utmTerm: (_m = persistentSource.utmTerm) !== null && _m !== void 0 ? _m : null,
	                utmContent: (_o = persistentSource.utmContent) !== null && _o !== void 0 ? _o : null,
	                utmLandingUrl: (_p = persistentSource.utmLandingUrl) !== null && _p !== void 0 ? _p : null,
	                utmUpdatedTime: (_q = persistentSource.utmUpdatedTime) !== null && _q !== void 0 ? _q : null,
	            })) : null;
	    // sessionStorage에서 null이 아닌 세션 필드만 추출 (stale null이 preserved 값을 덮어쓰지 않도록)
	    var sessionSessionFields = existingSessionData && typeof existingSessionData === 'object'
	        ? Object.fromEntries(Object.entries(existingSessionData).filter(function (_a) {
	            var v = _a[1];
	            return v != null;
	        }))
	        : null;
	    // merge 순서: preservedSessionFields(base) → persistent → sessionStorage(non-null만 우선)
	    // sessionStorage에 유효한(non-null) 값이 있으면 우선하고, null/비어있으면 cookie 원본에서 보존한 값 사용
	    var existingData = existingPersistentData || existingSessionData || preservedSessionFields
	        ? __assign$1(__assign$1(__assign$1({}, (preservedSessionFields !== null && preservedSessionFields !== void 0 ? preservedSessionFields : {})), (existingPersistentData !== null && existingPersistentData !== void 0 ? existingPersistentData : {})), (sessionSessionFields !== null && sessionSessionFields !== void 0 ? sessionSessionFields : {})) : null;
	    // External 모드(외부 사이트)에서는 SDK_JWT를 건너뛰고 siteCode/unitCode를 null로 설정
	    // Internal 모드(아임웹 내부 스쿼드)와 Legacy 모드에서는 JWT에서 추출
	    var resolvedSdkJwt;
	    var decodedSiteCode;
	    var decodedUnitCode;
	    if (isExternalMode()) {
	        resolvedSdkJwt = null;
	        decodedSiteCode = null;
	        decodedUnitCode = null;
	    }
	    else {
	        resolvedSdkJwt =
	            (_t = (_s = (typeof window !== 'undefined' ? (_r = window.SDK_JWT) !== null && _r !== void 0 ? _r : null : null)) !== null && _s !== void 0 ? _s : existingData === null || existingData === void 0 ? void 0 : existingData.sdkJwt) !== null && _t !== void 0 ? _t : null;
	        var decoded = extractSiteUnitFromSdkJwt(resolvedSdkJwt);
	        decodedSiteCode = decoded.siteCode;
	        decodedUnitCode = decoded.unitCode;
	    }
	    // 브라우저 탭/세션 단위 ID는 세션스토리지에 유지하며, 없으면 생성합니다.
	    var storedBrowserSessionId = getSessionStorage(SESSION_STORAGE_KEYS.BROWSER_SESSION_ID);
	    var normalizedStoredBrowserSessionId = typeof storedBrowserSessionId === 'string' && storedBrowserSessionId.length > 0 ? storedBrowserSessionId : null;
	    var fallbackBrowserSessionId = typeof (existingData === null || existingData === void 0 ? void 0 : existingData.browserSessionId) === 'string' && existingData.browserSessionId.length > 0
	        ? existingData.browserSessionId
	        : null;
	    var browserSessionId = (_u = normalizedStoredBrowserSessionId !== null && normalizedStoredBrowserSessionId !== void 0 ? normalizedStoredBrowserSessionId : fallbackBrowserSessionId) !== null && _u !== void 0 ? _u : generateEventId();
	    if (!normalizedStoredBrowserSessionId) {
	        setSessionStorage(SESSION_STORAGE_KEYS.BROWSER_SESSION_ID, browserSessionId);
	    }
	    var updatedData;
	    if (existingData) {
	        var parsedData = JSON.parse(JSON.stringify(existingData));
	        parsedData.browserSessionId = browserSessionId;
	        parsedData.siteCode = decodedSiteCode;
	        parsedData.unitCode = decodedUnitCode;
	        // [ANA-46] deviceId 관련 로직만 유지
	        var shouldUpdateDeviceId = !parsedData.deviceIdCreatedAt || new Date(parsedData.deviceIdCreatedAt) < new Date('2025-02-15T18:30:00');
	        if (shouldUpdateDeviceId) {
	            var newDeviceId = generateDeviceId();
	            parsedData.deviceId = newDeviceId;
	            parsedData.deviceIdCreatedAt = '2025-02-15T18:30:00';
	        }
	        // UTM 업데이트 로직은 그대로 유지
	        var utmUpdatedData = updateDataWithUTM(parsedData, utmParams);
	        updatedData = __assign$1(__assign$1({}, utmUpdatedData), { platform: browserData.platform });
	    }
	    else {
	        var deviceId = generateDeviceId();
	        var newAgent = {
	            deviceId: deviceId,
	            deviceIdCreatedAt: '2025-02-15T18:30:00', // 새로 생성할 때도 deviceIdCreatedAt 추가
	            siteCode: decodedSiteCode,
	            unitCode: decodedUnitCode,
	            initialReferrer: '@direct',
	            initialReferrerDomain: '@direct',
	            utmSource: null,
	            utmContent: null,
	            utmMedium: null,
	            utmCampaign: null,
	            utmTerm: null,
	            utmUpdatedTime: null,
	            utmLandingUrl: null,
	            platform: browserData.platform,
	            browserSessionId: browserSessionId,
	        };
	        updatedData = updateDataWithUTM(newAgent, utmParams);
	    }
	    var currentReferrer = getReferrer();
	    var referrerResolver = new Referrer({
	        hostname: location.hostname,
	        oldReferrer: (_v = existingData === null || existingData === void 0 ? void 0 : existingData.initialReferrer) !== null && _v !== void 0 ? _v : undefined,
	        updatedAt: (existingData === null || existingData === void 0 ? void 0 : existingData.updatedAt) || undefined,
	    });
	    var storageData = __assign$1(__assign$1({}, updatedData), { browserSessionId: (_w = updatedData.browserSessionId) !== null && _w !== void 0 ? _w : browserSessionId, updatedAt: new Date().toISOString(), referrer: currentReferrer, initialReferrer: referrerResolver.getInitialReferrer(), initialReferrerDomain: referrerResolver.getInitialReferrerDomain(), sdkJwt: resolvedSdkJwt !== null && resolvedSdkJwt !== void 0 ? resolvedSdkJwt : null });
	    var persistentStorageData = toPersistentStorageData(storageData);
	    var sessionStorageData = toSessionStorageData(storageData);
	    // PHP 서버에서 참조할 수 있도록 영속/세션 데이터를 합쳐 쿠키에 저장합니다.(browserSessionId 포함)
	    // 세션 데이터는 스네이크 케이스 키도 함께 포함합니다.
	    var sessionStorageSnakeData = buildSnakeCaseSessionData(sessionStorageData);
	    var mergedCookieData = __assign$1(__assign$1(__assign$1({}, persistentStorageData), sessionStorageData), sessionStorageSnakeData);
	    if (cookiesEnabled) {
	        setCookie(COOKIE_NAMES.USER_INFO, mergedCookieData);
	    }
	    // localStorage에 persistent 데이터 + 세션 관련 필드도 함께 저장
	    // Cookie 실패 시 (Safari ITP, 크기 초과 등) localStorage가 fallback으로 동작하도록
	    // landingUrl은 setLandingUrl()이 localStorage에 직접 관리하므로, 기존 값을 보존
	    var existingLocal = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	    setLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO, __assign$1(__assign$1({}, persistentStorageData), { commonSessionId: (_x = sessionStorageData.commonSessionId) !== null && _x !== void 0 ? _x : null, commonSessionUpdatedAt: (_y = sessionStorageData.commonSessionUpdatedAt) !== null && _y !== void 0 ? _y : null, customSessionId: (_z = sessionStorageData.customSessionId) !== null && _z !== void 0 ? _z : null, customSessionUpdatedAt: (_0 = sessionStorageData.customSessionUpdatedAt) !== null && _0 !== void 0 ? _0 : null, landingUrl: (_1 = existingLocal === null || existingLocal === void 0 ? void 0 : existingLocal.landingUrl) !== null && _1 !== void 0 ? _1 : null }));
	    setSessionStorage(SESSION_STORAGE_KEYS.USER_INFO, sessionStorageData);
	    // 동기화 이력을 세션 스토리지에 보관합니다.
	    appendStorageSyncHistory({
	        reason: reason,
	        timestamp: new Date().toISOString(),
	        deviceId: storageData.deviceId,
	        siteCode: (_2 = storageData.siteCode) !== null && _2 !== void 0 ? _2 : null,
	        unitCode: (_3 = storageData.unitCode) !== null && _3 !== void 0 ? _3 : null,
	        referrer: (_4 = storageData.referrer) !== null && _4 !== void 0 ? _4 : null,
	        initialReferrer: (_5 = storageData.initialReferrer) !== null && _5 !== void 0 ? _5 : null,
	        initialReferrerDomain: (_6 = storageData.initialReferrerDomain) !== null && _6 !== void 0 ? _6 : null,
	        utmSource: (_7 = storageData.utmSource) !== null && _7 !== void 0 ? _7 : null,
	        utmMedium: (_8 = storageData.utmMedium) !== null && _8 !== void 0 ? _8 : null,
	        utmCampaign: (_9 = storageData.utmCampaign) !== null && _9 !== void 0 ? _9 : null,
	        utmTerm: (_10 = storageData.utmTerm) !== null && _10 !== void 0 ? _10 : null,
	        utmContent: (_11 = storageData.utmContent) !== null && _11 !== void 0 ? _11 : null,
	        utmLandingUrl: (_12 = storageData.utmLandingUrl) !== null && _12 !== void 0 ? _12 : null,
	        utmUpdatedTime: (_13 = storageData.utmUpdatedTime) !== null && _13 !== void 0 ? _13 : null,
	    });
	    return { storageData: storageData, browserData: browserData, currentUrl: currentUrl };
	}
	/**
	 * 사용자 식별 함수(로그인 했을 경우)
	 * @param memberCode 멤버코드
	 * @returns None
	 */
	function identify(_memberCode) {
	    return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            return [2 /*return*/];
	        });
	    });
	}
	function sessionResetByLogout() {
	    return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            return [2 /*return*/];
	        });
	    });
	}
	/**
	 * BrandScope 시작점인 함수입니다.
	 * @returns
	 */
	function initialize() {
	    return __awaiter(this, void 0, void 0, function () {
	        var screen, _a, storageData, browserData, currentUrl, isNewCommonSession, landingUrl, now, basePayload;
	        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
	        return __generator(this, function (_q) {
	            screen = getScreenResolution();
	            _a = syncStorageData('init'), storageData = _a.storageData, browserData = _a.browserData, currentUrl = _a.currentUrl;
	            isNewCommonSession = !getCurrentCommonSessionId();
	            landingUrl = getLandingUrl();
	            if (isNewCommonSession || !landingUrl) {
	                landingUrl = currentUrl !== null && currentUrl !== void 0 ? currentUrl : null;
	                if (landingUrl) {
	                    setLandingUrl(landingUrl);
	                }
	            }
	            now = new Date();
	            basePayload = {
	                // storageData
	                deviceId: storageData.deviceId,
	                siteCode: (_b = storageData.siteCode) !== null && _b !== void 0 ? _b : null,
	                unitCode: (_c = storageData.unitCode) !== null && _c !== void 0 ? _c : null,
	                utmSource: (_d = storageData.utmSource) !== null && _d !== void 0 ? _d : null,
	                utmMedium: (_e = storageData.utmMedium) !== null && _e !== void 0 ? _e : null,
	                utmCampaign: (_f = storageData.utmCampaign) !== null && _f !== void 0 ? _f : null,
	                utmContent: (_g = storageData.utmContent) !== null && _g !== void 0 ? _g : null,
	                utmTerm: (_h = storageData.utmTerm) !== null && _h !== void 0 ? _h : null,
	                utmLandingUrl: (_j = storageData.utmLandingUrl) !== null && _j !== void 0 ? _j : null,
	                utmUpdatedTime: (_k = storageData.utmUpdatedTime) !== null && _k !== void 0 ? _k : null,
	                initialReferrer: (_l = storageData.initialReferrer) !== null && _l !== void 0 ? _l : '@direct',
	                initialReferrerDomain: (_m = storageData.initialReferrerDomain) !== null && _m !== void 0 ? _m : '@direct',
	                // browserData 런타임에 수집한 브라우저 데이터
	                platform: browserData.platform,
	                os: browserData.os,
	                language: browserData.language,
	                browserName: browserData.browserName,
	                browserVersion: browserData.browserVersion,
	                userAgent: browserData.userAgent,
	                path: browserData.path,
	                screenWidth: nullifyEmptyValue(screen[0]),
	                screenHeight: nullifyEmptyValue(screen[1]),
	                previousURL: nullifyEmptyValue(getReferrer()),
	                currentUrl: nullifyEmptyValue(currentUrl),
	                clientTimestamp: now.toISOString(),
	                eventType: distExports.EventCode.PageView,
	                trigger: 'BRAND_SCOPE',
	                sdkJwt: (_o = storageData.sdkJwt) !== null && _o !== void 0 ? _o : null,
	                projectToken: (_p = getProjectToken()) !== null && _p !== void 0 ? _p : null,
	                landingUrl: landingUrl,
	            };
	            ensureStorageFocusSyncStarted();
	            return [2 /*return*/, basePayload];
	        });
	    });
	}
	// 로컬스토리지에서 데이터를 얻어온 온 후 맵핑하는 함수
	function getImwebClientInfo() {
	    return __awaiter(this, void 0, void 0, function () {
	        var userInfo, browserInfo, result;
	        return __generator(this, function (_a) {
	            userInfo = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	            if (!userInfo)
	                return [2 /*return*/, null
	                    // 런타임에 브라우저 정보 수집
	                ];
	            browserInfo = Bowser.getParser(navigator.userAgent).getResult();
	            result = {
	                'imweb-device-id': userInfo.deviceId || null,
	                'imweb-platform': nullifyEmptyValue(browserInfo.platform.type),
	                'imweb-os': nullifyEmptyValue(browserInfo.os.name),
	                'imweb-browser-name': nullifyEmptyValue(browserInfo.browser.name),
	                'imweb-browser-version': nullifyEmptyValue(browserInfo.browser.version),
	                'imweb-language': nullifyEmptyValue(navigator.language),
	                'imweb-sdk-version': "1.9.1",
	            };
	            return [2 /*return*/, result];
	        });
	    });
	}
	// page_view 함수
	function trackPageView(userData_1) {
	    return __awaiter(this, arguments, void 0, function (userData, props) {
	        var sanitizedUserData, now, _a, userProperties, restProps, pageViewData, legacyEndpoint;
	        if (props === void 0) { props = {}; }
	        return __generator(this, function (_b) {
	            sanitizedUserData = sanitizeValue(userData);
	            now = new Date();
	            _a = props, userProperties = _a.properties, restProps = __rest(_a, ["properties"]);
	            pageViewData = __assign$1(__assign$1(__assign$1({ eventId: generateEventId() }, sanitizedUserData), { clientTimestamp: now.toISOString(), eventType: distExports.EventCode.PageView, properties: mergeWithSuperProperties(userProperties) }), restProps);
	            if (isInternalMode()) {
	                legacyEndpoint = getLegacyEndpoint();
	                if (legacyEndpoint) {
	                    sendDataToAPI(pageViewData, { endpointOverride: legacyEndpoint });
	                }
	            }
	            else {
	                sendDataToAPI(pageViewData);
	            }
	            return [2 /*return*/, pageViewData];
	        });
	    });
	}
	var BrandScope = {
	    /**
	     * Cross-SDK용: commonSession 갱신 후 세션 정보 반환
	     * 다른 SDK (analytics-sdk, crm-onsite-sdk)에서 이벤트 전송 전 호출
	     *
	     * @example
	     * ```typescript
	     * // analytics-sdk에서 사용
	     * if (window.BrandScope?.refreshCommonSession) {
	     *   const { sessionId, isNew } = window.BrandScope.refreshCommonSession()
	     *   eventPayload.commonSessionId = sessionId
	     * }
	     * ```
	     */
	    refreshCommonSession: function () {
	        var previous = getCurrentCommonSessionId();
	        var sessionId = refreshCommonSession();
	        return {
	            sessionId: sessionId,
	            isNew: previous !== sessionId,
	        };
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    refresh_common_session: function () {
	        return this.refreshCommonSession();
	    },
	    /**
	     * 현재 commonSessionId 조회 (타이머 리셋 없음)
	     * 세션 상태만 확인하고 싶을 때 사용
	     *
	     * @returns 유효한 세션 ID 또는 만료/없음 시 null
	     */
	    getCommonSessionId: function () {
	        return getCurrentCommonSessionId();
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    get_common_session_id: function () {
	        return this.getCommonSessionId();
	    },
	    /**
	     * 커스텀 세션 갱신 후 세션 정보 반환
	     * commonSessionId와 달리 타임아웃을 사용자가 설정할 수 있습니다.
	     *
	     * @example
	     * ```typescript
	     * const { sessionId, isNew } = BrandScope.refreshCustomSession()
	     * ```
	     */
	    refreshCustomSession: function () {
	        var previous = getCurrentCustomSessionId();
	        var sessionId = refreshCustomSession();
	        return {
	            sessionId: sessionId,
	            isNew: previous !== sessionId,
	        };
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    refresh_custom_session: function () {
	        return this.refreshCustomSession();
	    },
	    /**
	     * 현재 customSessionId 조회 (타이머 리셋 없음)
	     * 세션 상태만 확인하고 싶을 때 사용
	     *
	     * @returns 유효한 세션 ID 또는 만료/없음 시 null
	     */
	    getCustomSessionId: function () {
	        return getCurrentCustomSessionId();
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    get_custom_session_id: function () {
	        return this.getCustomSessionId();
	    },
	    /**
	     * 커스텀 세션 타임아웃을 설정합니다.
	     * commonSessionId는 30분 고정이며, customSessionId에만 적용됩니다.
	     *
	     * @param minutes 타임아웃 시간 (분)
	     * @example
	     * ```typescript
	     * BrandScope.setSessionTimeout(120) // 2시간으로 변경
	     * ```
	     */
	    setSessionTimeout: function (minutes) {
	        setCustomSessionTimeout(minutes);
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    set_session_timeout: function (minutes) {
	        this.setSessionTimeout(minutes);
	    },
	    /**
	     * 현재 설정된 커스텀 세션 타임아웃을 반환합니다.
	     * @returns 타임아웃 시간 (분)
	     */
	    getSessionTimeout: function () {
	        return getCustomSessionTimeout();
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    get_session_timeout: function () {
	        return this.getSessionTimeout();
	    },
	    setDebug: function (value) {
	    },
	    /**
	     * SDK 환경 정보를 콘솔에 출력합니다.
	     * 디버깅 시 수동으로 호출하여 SDK 상태를 확인할 수 있습니다.
	     */
	    showDebugInfo: function () {
	        logSDKInfo();
	    },
	    /**
	     * SDK 버전 정보를 반환합니다.
	     */
	    getVersion: function () {
	        return "1.9.1";
	    },
	    /**
	     * SDK 초기화 상태를 반환합니다.
	     * @returns {boolean} SDK가 초기화되었으면 true
	     */
	    isInitialized: function () {
	        return sdkInitState === 'initialized';
	    },
	    /**
	     * 현재 SDK 환경 정보를 객체로 반환합니다.
	     */
	    getSDKInfo: function () {
	        return {
	            version: "1.9.1",
	            environment: "production",
	            apiEndpoint: "https://behavior-tracking-event-gateway.imweb.me/api/v1/event",
	            buildTime: "2026-07-21T17:30:58+09:00",
	            isDev: false,
	        };
	    },
	    /**
	     * 현재 저장소 데이터를 반환합니다. (디버깅용)
	     * @returns cookie, localStorage, sessionStorage 데이터
	     */
	    getStorageData: function () {
	        var cookiesEnabled = typeof navigator !== 'undefined' && navigator.cookieEnabled;
	        var cookieData = cookiesEnabled ? getCookie(COOKIE_NAMES.USER_INFO) : null;
	        var localData = getLocalStorage(LOCAL_STORAGE_KEYS.USER_INFO);
	        var sessionData = getSessionStorage(SESSION_STORAGE_KEYS.USER_INFO);
	        return {
	            cookie: cookieData,
	            local: localData,
	            session: sessionData,
	        };
	    },
	    /**
	     * 최근 전송된 이벤트 히스토리를 반환합니다. (디버깅용)
	     * @returns 최근 전송된 이벤트 목록 (최대 10개)
	     */
	    getEventHistory: function () {
	        return getEventHistory();
	    },
	    /**
	     * 이벤트 히스토리를 초기화합니다. (디버깅용)
	     */
	    clearEventHistory: function () {
	        clearEventHistory();
	    },
	    /**
	     * Super properties를 설정합니다.
	     * 설정된 속성은 모든 이벤트에 자동으로 포함됩니다.
	     * 기존에 같은 이름의 속성이 있으면 덮어씁니다.
	     *
	     * @example
	     * ```typescript
	     * BrandScope.register({ plan: 'premium', userType: 'business' })
	     * ```
	     */
	    register: function (properties) {
	        register(properties);
	    },
	    /**
	     * Super properties를 설정합니다. (기존 값이 없을 때만)
	     * Mixpanel의 registerOnce()와 동일한 동작입니다.
	     *
	     * @param properties - 설정할 속성들
	     * @param defaultValue - 기존 값이 이 값과 같을 때만 덮어쓰기 (선택)
	     *
	     * @example
	     * ```typescript
	     * // 처음 방문자에게만 설정
	     * BrandScope.registerOnce({ firstVisitDate: new Date().toISOString() })
	     *
	     * // undefined일 때만 덮어쓰기
	     * BrandScope.registerOnce({ campaign: 'summer-sale' }, undefined)
	     * ```
	     */
	    registerOnce: function (properties, defaultValue) {
	        registerOnce(properties, defaultValue);
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    register_once: function (properties, defaultValue) {
	        this.registerOnce(properties, defaultValue);
	    },
	    /**
	     * 특정 super property를 제거합니다.
	     * @param propertyName - 제거할 속성 이름
	     */
	    unregister: function (propertyName) {
	        unregister(propertyName);
	    },
	    /**
	     * 현재 설정된 모든 super properties를 반환합니다.
	     */
	    getSuperProperties: function () {
	        return getSuperProperties();
	    },
	    /**
	     * 모든 super properties를 초기화합니다.
	     */
	    clearSuperProperties: function () {
	        clearSuperProperties();
	    },
	    /**
	     * 이벤트 소요시간 측정을 시작합니다.
	     * 이후 동일한 eventName으로 track()을 호출하면 duration(초)이 properties에 자동으로 포함됩니다.
	     * 타이머는 sessionStorage에 저장되므로 페이지 이동(MPA) 시에도 유지됩니다.
	     *
	     * @param eventName - 타이머를 시작할 이벤트 이름
	     * @example
	     * ```typescript
	     * BrandScope.time_event('view_page_shopview')
	     * // ... 사용자가 상품 페이지를 탐색 ...
	     * BrandScope.track('view_page_shopview', { product_id: 'PROD-001' })
	     * // → properties에 { duration: 45.2, product_id: 'PROD-001' } 포함
	     * ```
	     */
	    time_event: function (eventName) {
	        startTimeEvent(eventName);
	    },
	    /**
	     * camelCase 호환용 alias
	     */
	    timeEvent: function (eventName) {
	        this.time_event(eventName);
	    },
	    /**
	     * 모든 이벤트 타이머를 초기화합니다.
	     */
	    clearTimedEvents: function () {
	        clearTimedEvents();
	    },
	    /**
	     * Rage Click 감지를 시작합니다.
	     * @param config - 커스텀 설정 (선택)
	     */
	    startRageClickDetection: function (config) {
	        var _this = this;
	        var detector = config ? initRageClickDetector(config) : getRageClickDetector();
	        detector.onRageClick(function (event) {
	            // Rage Click 이벤트를 track으로 전송
	            _this.track({
	                eventType: 'Click', // 또는 별도 이벤트 코드 사용 가능
	                props: {
	                    properties: {
	                        rageClick: true,
	                        clickCount: event.clickCount,
	                        element: event.element,
	                        x: event.x,
	                        y: event.y,
	                    },
	                },
	            });
	        });
	        detector.start();
	    },
	    /**
	     * Rage Click 감지를 중지합니다.
	     */
	    stopRageClickDetection: function () {
	        getRageClickDetector().stop();
	    },
	    /**
	     * Rage Click Detector 인스턴스를 반환합니다.
	     * 커스텀 콜백 설정 등에 사용할 수 있습니다.
	     */
	    getRageClickDetector: function () {
	        return getRageClickDetector();
	    },
	    init: function () {
	        return __awaiter(this, arguments, void 0, function (options) {
	            var error_1;
	            var _this = this;
	            if (options === void 0) { options = {}; }
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.setDebug(options.debug || false);
	                        // 중복 init() 호출 방지
	                        if (sdkInitState === 'initialized') {
	                            return [2 /*return*/];
	                        }
	                        if (sdkInitState === 'initializing' && sdkInitPromise) {
	                            return [2 /*return*/, sdkInitPromise];
	                        }
	                        sdkInitState = 'initializing';
	                        sdkInitPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
	                            var success, rageConfig, userData;
	                            var _a;
	                            return __generator(this, function (_b) {
	                                switch (_b.label) {
	                                    case 0:
	                                        // Mixpanel 스타일 프로젝트 토큰 등록
	                                        if (options.projectToken) {
	                                            // 토큰 포맷 경고 (유효하지 않아도 등록은 시도)
	                                            if (!isValidTokenFormat(options.projectToken)) ;
	                                            success = setProjectToken(options.projectToken);
	                                            if (success) {
	                                                logDebug('Project token registered:', options.projectToken.substring(0, 10) + '...');
	                                            }
	                                        }
	                                        // 커스텀 세션 타임아웃 설정
	                                        if (options.sessionTimeoutMinutes !== undefined && options.sessionTimeoutMinutes > 0) {
	                                            setCustomSessionTimeout(options.sessionTimeoutMinutes);
	                                            logDebug('Custom session timeout set to:', options.sessionTimeoutMinutes);
	                                        }
	                                        // beforeSend 콜백 등록
	                                        if (options.beforeSend) {
	                                            setBeforeSendCallback(options.beforeSend);
	                                        }
	                                        // Rage Click 감지 설정
	                                        if ((_a = options.autocapture) === null || _a === void 0 ? void 0 : _a.rageClicks) {
	                                            rageConfig = typeof options.autocapture.rageClicks === 'object'
	                                                ? options.autocapture.rageClicks
	                                                : {};
	                                            this.startRageClickDetection(rageConfig);
	                                        }
	                                        return [4 /*yield*/, initialize()];
	                                    case 1:
	                                        userData = _b.sent();
	                                        this.handleUtmInflow(userData);
	                                        if (!isExternalMode()) return [3 /*break*/, 3];
	                                        // External (카페24): eventName 기반
	                                        return [4 /*yield*/, this._trackCustomEvent('view_page_custom', options.props || {})];
	                                    case 2:
	                                        // External (카페24): eventName 기반
	                                        _b.sent();
	                                        return [3 /*break*/, 5];
	                                    case 3: 
	                                    // Legacy + Internal: 기존 Legacy 페이지뷰 (eventType 기반)
	                                    // Internal 모드에서도 init 자동 이벤트는 레거시로 전송
	                                    // Internal 전용 이벤트는 track()으로 직접 호출 시에만 /event/internal로
	                                    return [4 /*yield*/, trackPageView(userData, options.props)];
	                                    case 4:
	                                        // Legacy + Internal: 기존 Legacy 페이지뷰 (eventType 기반)
	                                        // Internal 모드에서도 init 자동 이벤트는 레거시로 전송
	                                        // Internal 전용 이벤트는 track()으로 직접 호출 시에만 /event/internal로
	                                        _b.sent();
	                                        _b.label = 5;
	                                    case 5:
	                                        dispatchSdkInitEvent();
	                                        return [2 /*return*/];
	                                }
	                            });
	                        }); })();
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, 3, , 4]);
	                        return [4 /*yield*/, sdkInitPromise];
	                    case 2:
	                        _a.sent();
	                        sdkInitState = 'initialized';
	                        return [3 /*break*/, 4];
	                    case 3:
	                        error_1 = _a.sent();
	                        sdkInitState = 'idle';
	                        sdkInitPromise = null;
	                        throw error_1;
	                    case 4: return [2 /*return*/];
	                }
	            });
	        });
	    },
	    handleUtmInflow: function (userData) {
	        var utmParams = parseUTMParams();
	        // UTM 파라미터 존재 여부 체크 추가
	        var hasUtmParams = Object.keys(utmParams).some(function (key) { return utmParams[key]; });
	        // UTM 유입 이벤트 발행 조건 체크
	        var previousUrl = getReferrer();
	        // 호스트네임만 비교
	        var isSameDomain = (function () {
	            try {
	                return new URL(previousUrl).hostname === window.location.hostname;
	            }
	            catch (_a) {
	                return false;
	            }
	        })();
	        var currentPathAndQuery = getPathAndQueryWithoutUTM(window.location.href);
	        // 현재 경로와 저장된 UTM 랜딩 URL의 경로가 정확히 일치하는지 확인
	        var isPathMatch = currentPathAndQuery === userData.utmLandingUrl;
	        // UTM 유입 조건:
	        // 1. 다른 도메인에서 왔으며(직접 도메인도 포함)
	        // 2. 현재 경로가 UTM 랜딩 URL과 일치
	        // 3. 현재 URL에 UTM 파라미터가 있어야 함
	        var isUtmInflow = !isSameDomain && isPathMatch && hasUtmParams;
	        if (isUtmInflow) {
	            if (isExternalMode()) {
	                // External (카페24): eventName 기반
	                this._trackCustomEvent('visit_site_utm', {});
	            }
	            else {
	                // Legacy + Internal: 기존 EventCode 기반으로 Legacy 엔드포인트에 전송
	                var sanitizedFinalData = sanitizeValue(userData);
	                var now = new Date();
	                var utmInflowData = __assign$1(__assign$1({ eventId: generateEventId() }, sanitizedFinalData), { clientTimestamp: now.toISOString(), eventType: distExports.EventCode.UtmInflow, properties: '{}' });
	                if (isInternalMode()) {
	                    var legacyEndpoint = getLegacyEndpoint();
	                    if (legacyEndpoint) {
	                        sendDataToAPI(utmInflowData, { endpointOverride: legacyEndpoint });
	                    }
	                    else {
	                        sendDataToAPI(utmInflowData);
	                    }
	                }
	                else {
	                    sendDataToAPI(utmInflowData);
	                }
	            }
	        }
	    },
	    /**
	     * 사용자 식별 함수(로그인)
	     * @param memberCode 아임웹 멤버코드
	     * @returns
	     */
	    identify: function (memberCode) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, identify()];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    },
	    /**
	     * 이벤트 추적 함수 (Mixpanel 스타일 오버로드 지원)
	     *
	     * @example
	     * // Mixpanel 스타일 (새로운 API)
	     * BrandScope.track('view_page_shopview', { component_position: 'shop_view' })
	     * BrandScope.track('click_button_payment', { payment_button_type: 'naverpay' })
	     *
	     * @example
	     * // 기존 API (하위 호환성 유지)
	     * BrandScope.track({ eventType: 'PageView', props: { ... } })
	     */
	    track: function (eventNameOrOptions, properties) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                if (typeof eventNameOrOptions === 'string') {
	                    // Mixpanel 스타일 API: track(eventName, properties)
	                    return [2 /*return*/, this._trackCustomEvent(eventNameOrOptions, properties || {})];
	                }
	                else {
	                    // 기존 API: track({ eventType, props })
	                    return [2 /*return*/, this._trackLegacy(eventNameOrOptions)];
	                }
	            });
	        });
	    },
	    /**
	     * Mixpanel 스타일 커스텀 이벤트 추적 (내부 메서드)
	     * @param eventName - 커스텀 이벤트 이름 (예: 'view_page_shopview', 'click_button_payment')
	     * @param properties - 이벤트 속성
	     */
	    _trackCustomEvent: function (eventName, properties) {
	        return __awaiter(this, void 0, void 0, function () {
	            var userData, sanitizedUserData, now, projectToken, durationProps, duration, mergedProperties, trackData, trackData;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, initialize()];
	                    case 1:
	                        userData = _a.sent();
	                        sanitizedUserData = sanitizeValue(userData);
	                        now = new Date();
	                        projectToken = getProjectToken();
	                        durationProps = {};
	                        duration = consumeTimeEvent(eventName);
	                        if (duration !== null) {
	                            durationProps.duration = duration;
	                        }
	                        mergedProperties = mergeWithSuperProperties(properties, durationProps);
	                        if (isProjectTokenMode()) {
	                            trackData = __assign$1(__assign$1({ eventId: generateEventId() }, sanitizedUserData), { clientTimestamp: now.toISOString(), eventName: eventName, properties: mergedProperties, projectToken: projectToken });
	                            delete trackData.eventType;
	                            sendDataToAPI(trackData);
	                        }
	                        else {
	                            trackData = __assign$1(__assign$1({ eventId: generateEventId() }, sanitizedUserData), { clientTimestamp: now.toISOString(), eventName: eventName, properties: mergedProperties, projectToken: projectToken });
	                            // view_page_* -> PageView, view_component_* -> PageView, 그 외 -> Click
	                            if (eventName.startsWith('view_page_') || eventName.startsWith('view_component_')) {
	                                trackData.eventType = distExports.EventCode.PageView;
	                            }
	                            else {
	                                trackData.eventType = distExports.EventCode.Click;
	                            }
	                            sendDataToAPI(trackData);
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    },
	    /**
	     * 기존 API 이벤트 추적 (내부 메서드, 하위 호환성)
	     * @param options - { eventType, props }
	     */
	    _trackLegacy: function (_a) {
	        return __awaiter(this, arguments, void 0, function (_b) {
	            var userData, sanitizedUserData, eventCode, now, projectToken, _c, userProperties, restProps, trackData, legacyEndpoint;
	            var eventType = _b.eventType, props = _b.props;
	            return __generator(this, function (_d) {
	                switch (_d.label) {
	                    case 0: return [4 /*yield*/, initialize()];
	                    case 1:
	                        userData = _d.sent();
	                        sanitizedUserData = sanitizeValue(userData);
	                        eventCode = getEventCodeBook(eventType);
	                        now = new Date();
	                        projectToken = getProjectToken();
	                        _c = props, userProperties = _c.properties, restProps = __rest(_c, ["properties"]);
	                        trackData = __assign$1(__assign$1(__assign$1({ eventId: generateEventId() }, sanitizedUserData), { clientTimestamp: now.toISOString(), eventType: eventCode, properties: mergeWithSuperProperties(userProperties), projectToken: projectToken }), restProps);
	                        if (isInternalMode()) {
	                            legacyEndpoint = getLegacyEndpoint();
	                            if (legacyEndpoint) {
	                                sendDataToAPI(trackData, { endpointOverride: legacyEndpoint });
	                            }
	                            else {
	                                sendDataToAPI(trackData);
	                            }
	                        }
	                        else {
	                            sendDataToAPI(trackData);
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    },
	    getImwebClientInfo: function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, getImwebClientInfo()];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    },
	    sessionResetByLogout: function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, sessionResetByLogout()];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    },
	    /**
	     * @deprecated snake_case 호환용 alias
	     */
	    session_reset_by_logout: function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.sessionResetByLogout()];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    },
	};
	(function (windowObj) {
	    var queue = 
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    windowObj.BrandScope && Array.isArray(windowObj.BrandScope.q)
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        ? windowObj.BrandScope.q
	        : [];
	    windowObj.BrandScope = BrandScope;
	    // Cross-SDK 통신: 다른 SDK에서 세션 갱신 요청 시 응답
	    // analytics-sdk, crm-onsite-sdk에서 'brandscope:session-activity' 이벤트 발행 시
	    // 세션을 갱신하고 'brandscope:session-response' 이벤트로 결과 반환
	    if (typeof windowObj !== 'undefined' && 'addEventListener' in windowObj) {
	        windowObj.addEventListener(CROSS_SDK_EVENTS.SESSION_ACTIVITY, function () {
	            try {
	                var result = BrandScope.refreshCommonSession();
	                if (typeof CustomEvent === 'function' && typeof windowObj.dispatchEvent === 'function') {
	                    windowObj.dispatchEvent(new CustomEvent(CROSS_SDK_EVENTS.SESSION_RESPONSE, {
	                        detail: result,
	                    }));
	                }
	            }
	            catch (error) {
	            }
	        });
	    }
	    (function processQueue() {
	        return __awaiter(this, void 0, void 0, function () {
	            var _i, queue_1, item, method, args;
	            var _a;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        _i = 0, queue_1 = queue;
	                        _b.label = 1;
	                    case 1:
	                        if (!(_i < queue_1.length)) return [3 /*break*/, 4];
	                        item = queue_1[_i];
	                        if (!Array.isArray(item)) return [3 /*break*/, 3];
	                        method = item[0], args = item.slice(1);
	                        if (!(typeof BrandScope[method] === 'function')) return [3 /*break*/, 3];
	                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                        return [4 /*yield*/, (_a = BrandScope)[method].apply(_a, args)];
	                    case 2:
	                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                        _b.sent();
	                        _b.label = 3;
	                    case 3:
	                        _i++;
	                        return [3 /*break*/, 1];
	                    case 4: return [2 /*return*/];
	                }
	            });
	        });
	    })();
	})(typeof window !== 'undefined' ? window : global);

	// The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
	/** Not documented, out of Semantic Versioning, usage is at your own risk */
	// export { getScreenFrame } from './sources/screen_frame'

	exports.default = BrandScope;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
