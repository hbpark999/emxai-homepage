/**
 * analytics-sdk v1.0.15 - Copyright (c) imweb, Inc, 2026 (https://imweb.me)
 * Built at: 2026-06-25T16:35:47+09:00
 * All rights reserved.
 *
 * This software and associated documentation files (the "Software") are the proprietary property of imweb, Inc.
 * The Software may only be used by imweb, Inc. and its authorized affiliates.
 * Any unauthorized use, reproduction, or distribution of the Software or any portion of it is strictly prohibited.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.analytics_sdk = {}));
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

	/**
	 * 디버그 로그 출력
	 * console.log는 로컬 모드에서만 허용합니다.
	 */
	function logDebug() {
	}

	//** Generate a random event id UUID */
	function generateEventId() {
	    var eventId = uuidv7().replace(/-/g, '');
	    return eventId;
	}

	var BRANDSCOPE_COOKIE_NAMES = {
	    USER_INFO: '__bs_imweb',
	};
	var BRANDSCOPE_LOCAL_STORAGE_KEYS = {
	    USER_INFO: '__bs_imweb',
	};
	var BRANDSCOPE_SESSION_STORAGE_KEYS = {
	    USER_INFO: '__bs_imweb_session',
	};
	var ANALYTICS_SESSION_STORAGE_KEYS = {
	    EVENT_BUS_STACK: '__a7s_event_bus_stack',
	    LIFECYCLE_EVENT_SESSION: '__a7s_lifecycle_event_session',
	    LIFECYCLE_EVENT_PENDING_NAVIGATION: '__a7s_lifecycle_event_pending_navigation',
	};

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
	                // eslint-disable-next-line no-console
	                console.error('Error parsing cookie:', error);
	                return null;
	            }
	        }
	    }
	    return null; // 쿠키를 찾지 못한 경우
	}

	var payloadMappers = [];
	/**
	 * event-bus payload mapper를 등록합니다.
	 * - mapper가 `undefined`를 반환하면 다음 mapper로 넘어갑니다.
	 */
	function registerEventBusPayloadMapper(mapper) {
	    payloadMappers.push(mapper);
	}
	function getEventBusPayloadMappers() {
	    return payloadMappers.slice();
	}
	/**
	 * 이벤트의 `timestamp`(number)를 ISO 문자열로 변환합니다.
	 * - event_bus에서 이 값은 "클라이언트 시간(clientTimestamp)"의 기준값으로 사용됩니다.
	 * - timestamp가 falsy면 현재 시간을 사용합니다.
	 */
	function resolveClientTimestampIso(event) {
	    var createdAt = new Date(event.timestamp || Date.now());
	    return createdAt.toISOString();
	}
	/**
	 * 문자열 값을 trim 후, 비어 있으면 `null`로 정규화합니다.
	 */
	function nullifyEmptyString(value) {
	    if (typeof value !== 'string')
	        return null;
	    var trimmed = value.trim();
	    return trimmed.length > 0 ? trimmed : null;
	}
	/**
	 * 공통 클라이언트 필드(clientTimestamp/currentUrl/previousUrl)를 해석합니다.
	 * - 우선순위: payload 값 → 브라우저 값(window/document) → `null`
	 * - clientTimestamp는 `event.common.clientTimestamp`가 있으면 우선 사용합니다.
	 */
	function resolveEventBusClientCommonFields(event, clientTimestampIso) {
	    var _a, _b, _c, _d;
	    var resolvedTimestamp = clientTimestampIso !== null && clientTimestampIso !== void 0 ? clientTimestampIso : resolveClientTimestampIso(event);
	    var payload = event.payload && typeof event.payload === 'object' ? event.payload : null;
	    var currentUrl = (_a = nullifyEmptyString(payload === null || payload === void 0 ? void 0 : payload.currentUrl)) !== null && _a !== void 0 ? _a : (typeof window !== 'undefined' ? nullifyEmptyString(window.location.href) : null);
	    var previousUrl = (_b = nullifyEmptyString(payload === null || payload === void 0 ? void 0 : payload.previousUrl)) !== null && _b !== void 0 ? _b : (typeof document !== 'undefined' ? nullifyEmptyString(document.referrer) : null);
	    return {
	        clientTimestamp: (_d = (_c = event.common) === null || _c === void 0 ? void 0 : _c.clientTimestamp) !== null && _d !== void 0 ? _d : resolvedTimestamp,
	        currentUrl: currentUrl,
	        previousUrl: previousUrl,
	    };
	}
	/**
	 * 저장소 분리 정책을 고려해 사용자 정보를 병합합니다.
	 * - 고정값(deviceId/deviceIdCreatedAt/siteCode/unitCode)은 localStorage(`__bs_imweb`)에 저장됩니다.
	 * - 세션성 값(utm/initialReferrer/platform 등)은 cookie/sessionStorage(`__bs_imweb_session`)에서 보강합니다.
	 * - 레거시 환경(localStorage에 전체 데이터)도 허용합니다.
	 */
	function getMergedStoredUserInfo() {
	    if (typeof window === 'undefined')
	        return null;
	    try {
	        var cookie = typeof document !== 'undefined'
	            ? getCookie(BRANDSCOPE_COOKIE_NAMES.USER_INFO)
	            : null;
	        var safeParse = function (raw) {
	            if (!raw)
	                return null;
	            try {
	                var parsed = JSON.parse(raw);
	                return parsed && typeof parsed === 'object' ? parsed : null;
	            }
	            catch (_a) {
	                return null;
	            }
	        };
	        var persistent = safeParse(window.localStorage.getItem(BRANDSCOPE_LOCAL_STORAGE_KEYS.USER_INFO));
	        var session = safeParse(window.sessionStorage.getItem(BRANDSCOPE_SESSION_STORAGE_KEYS.USER_INFO));
	        if (!cookie && !persistent && !session)
	            return null;
	        return __assign$1(__assign$1(__assign$1({}, (cookie !== null && cookie !== void 0 ? cookie : {})), (persistent !== null && persistent !== void 0 ? persistent : {})), (session !== null && session !== void 0 ? session : {}));
	    }
	    catch (_a) {
	        return null;
	    }
	}

	var LIFECYCLE_EVENT_TYPE = {
	    LIFECYCLE_START: distExports.EventCode.LifecycleEventSessionStart,
	    SCROLL_BOTTOM: distExports.EventCode.LifecycleEventScrollBottom,
	    SCROLL_TOP: distExports.EventCode.LifecycleEventScrollTop,
	};
	var LIFECYCLE_SIGNAL_EVENT_NAME = {
	    VISIBILITYCHANGE_VISIBLE: distExports.EventCode.LifecycleEventVisibilitychangeVisible,
	    VISIBILITYCHANGE_HIDDEN: distExports.EventCode.LifecycleEventVisibilitychangeHidden,
	    PAGEHIDE: distExports.EventCode.LifecycleEventPageHide,
	    BEFOREUNLOAD: distExports.EventCode.LifecycleEventBeforunload,
	    SESSION_TIMEOUT: distExports.EventCode.LifecycleEventSessionTimeout,
	    LIFECYCLE_END: distExports.EventCode.LifecycleEventSessionEnd,
	};
	var LIFECYCLE_EVENT_NAME = __assign$1(__assign$1(__assign$1({}, LIFECYCLE_EVENT_TYPE), LIFECYCLE_SIGNAL_EVENT_NAME), { CLICK_SEEMORE: distExports.EventCode.LifecycleEventSeemoreClick });

	function asRecord(payload) {
	    if (!payload || typeof payload !== 'object')
	        return null;
	    return payload;
	}
	function resolveLifecycleEventName(type, payload) {
	    if (type === 'scroll_event') {
	        var data = asRecord(payload);
	        var eventName = data === null || data === void 0 ? void 0 : data.eventName;
	        if (eventName === LIFECYCLE_EVENT_TYPE.LIFECYCLE_START) {
	            return LIFECYCLE_EVENT_TYPE.LIFECYCLE_START;
	        }
	        if (eventName === LIFECYCLE_EVENT_TYPE.SCROLL_TOP || eventName === LIFECYCLE_EVENT_TYPE.SCROLL_BOTTOM) {
	            return eventName;
	        }
	        var eventType = data === null || data === void 0 ? void 0 : data.eventType;
	        if (eventType === LIFECYCLE_EVENT_TYPE.LIFECYCLE_START) {
	            return LIFECYCLE_EVENT_TYPE.LIFECYCLE_START;
	        }
	        if (eventType === LIFECYCLE_EVENT_TYPE.SCROLL_TOP || eventType === LIFECYCLE_EVENT_TYPE.SCROLL_BOTTOM) {
	            return eventType;
	        }
	        return null;
	    }
	    if (type === 'lifecycle_signal') {
	        var data = asRecord(payload);
	        var name_1 = data === null || data === void 0 ? void 0 : data.eventName;
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_VISIBLE) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_VISIBLE;
	        }
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_HIDDEN) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_HIDDEN;
	        }
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE;
	        }
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.BEFOREUNLOAD) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.BEFOREUNLOAD;
	        }
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT;
	        }
	        if (name_1 === LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END) {
	            return LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END;
	        }
	        return null;
	    }
	    if (type === 'lifecycle_end') {
	        var data = asRecord(payload);
	        var eventName = data === null || data === void 0 ? void 0 : data.eventName;
	        if (eventName === LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT)
	            return LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT;
	        if (eventName === LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE)
	            return LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE;
	        if (eventName === LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END)
	            return LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END;
	        var reason = data === null || data === void 0 ? void 0 : data.lifecycleEndReason;
	        if (reason === 'timeout')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT;
	        if (reason === 'pagehide')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE;
	        if (reason === 'navigate')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END;
	        return null;
	    }
	    if (type === 'prod_detail_seemore')
	        return LIFECYCLE_EVENT_NAME.CLICK_SEEMORE;
	    return null;
	}

	function mapLifecycleEventPayload(event, context) {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
	    if (event.type !== 'scroll_event' &&
	        event.type !== 'lifecycle_signal' &&
	        event.type !== 'lifecycle_end' &&
	        event.type !== 'prod_detail_seemore') {
	        return undefined;
	    }
	    var storedUser = getMergedStoredUserInfo();
	    var common = (_a = event.common) !== null && _a !== void 0 ? _a : {};
	    var clientCommon = context.client;
	    var payload = event.payload;
	    var eventName = resolveLifecycleEventName(event.type, payload);
	    if (!eventName)
	        return { payload: event.payload };
	    return {
	        payload: {
	            analyticsSdkInfo: JSON.stringify({
	                version: (_b = common.analyticsSdkVersion) !== null && _b !== void 0 ? _b : null,
	                name: (_c = common.analyticsSdkName) !== null && _c !== void 0 ? _c : null,
	            }),
	            siteCode: (_d = common.siteCode) !== null && _d !== void 0 ? _d : null,
	            unitCode: (_e = common.unitCode) !== null && _e !== void 0 ? _e : null,
	            deviceId: (_f = common.deviceId) !== null && _f !== void 0 ? _f : null,
	            clientTimestamp: clientCommon.clientTimestamp,
	            platform: (_h = (_g = common.platform) !== null && _g !== void 0 ? _g : storedUser === null || storedUser === void 0 ? void 0 : storedUser.platform) !== null && _h !== void 0 ? _h : null,
	            sdkJwt: (_j = common.sdkJwt) !== null && _j !== void 0 ? _j : null,
	            referrer: (_l = (_k = common.referrer) !== null && _k !== void 0 ? _k : storedUser === null || storedUser === void 0 ? void 0 : storedUser.referrer) !== null && _l !== void 0 ? _l : null,
	            initialReferrer: (_o = (_m = common.initialReferrer) !== null && _m !== void 0 ? _m : storedUser === null || storedUser === void 0 ? void 0 : storedUser.initialReferrer) !== null && _o !== void 0 ? _o : null,
	            initialReferrerDomain: (_q = (_p = common.initialReferrerDomain) !== null && _p !== void 0 ? _p : storedUser === null || storedUser === void 0 ? void 0 : storedUser.initialReferrerDomain) !== null && _q !== void 0 ? _q : null,
	            utmLandingUrl: (_s = (_r = common.utmLandingUrl) !== null && _r !== void 0 ? _r : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmLandingUrl) !== null && _s !== void 0 ? _s : null,
	            utmCampaign: (_u = (_t = common.utmCampaign) !== null && _t !== void 0 ? _t : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmCampaign) !== null && _u !== void 0 ? _u : null,
	            utmContent: (_w = (_v = common.utmContent) !== null && _v !== void 0 ? _v : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmContent) !== null && _w !== void 0 ? _w : null,
	            utmMedium: (_y = (_x = common.utmMedium) !== null && _x !== void 0 ? _x : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmMedium) !== null && _y !== void 0 ? _y : null,
	            utmSource: (_0 = (_z = common.utmSource) !== null && _z !== void 0 ? _z : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmSource) !== null && _0 !== void 0 ? _0 : null,
	            utmTerm: (_2 = (_1 = common.utmTerm) !== null && _1 !== void 0 ? _1 : storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmTerm) !== null && _2 !== void 0 ? _2 : null,
	            //
	            eventType: distExports.EventCode.LifecycleEvent,
	            appSessionId: (_3 = payload.appSessionId) !== null && _3 !== void 0 ? _3 : null,
	            appSessionKey: (_4 = payload.appSessionKey) !== null && _4 !== void 0 ? _4 : null,
	            eventName: eventName,
	            previousEventDiffMs: context.previousEventDiffMs,
	            previousEventType: (_5 = payload.previousEventType) !== null && _5 !== void 0 ? _5 : null,
	            scrollTop: (_6 = payload.scrollTop) !== null && _6 !== void 0 ? _6 : null,
	            viewportWidth: (_7 = payload.viewportWidth) !== null && _7 !== void 0 ? _7 : null,
	            viewportHeight: (_8 = payload.viewportHeight) !== null && _8 !== void 0 ? _8 : null,
	            documentHeight: (_9 = payload.documentHeight) !== null && _9 !== void 0 ? _9 : null,
	            productCode: (_10 = payload.productCode) !== null && _10 !== void 0 ? _10 : null,
	            currentUrl: clientCommon.currentUrl,
	            previousUrl: clientCommon.previousUrl,
	            productDescriptionFold: (_12 = (_11 = payload.productDescriptionFold) !== null && _11 !== void 0 ? _11 : payload.product_description_fold) !== null && _12 !== void 0 ? _12 : null,
	            productDetailHeight: (_13 = payload.productDetailHeight) !== null && _13 !== void 0 ? _13 : null,
	            productDetailFoldHeight: (_14 = payload.productDetailFoldHeight) !== null && _14 !== void 0 ? _14 : null,
	            seemoreButtonPosition: (_15 = payload.seemoreButtonPosition) !== null && _15 !== void 0 ? _15 : null,
	            element: (_16 = payload.element) !== null && _16 !== void 0 ? _16 : null,
	        },
	    };
	}
	registerEventBusPayloadMapper(mapLifecycleEventPayload);

	function mapLifecycleOrderEventPayload(event, context) {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
	    if (event.type !== 'lifecycle_event_order')
	        return undefined;
	    var common = (_a = event.common) !== null && _a !== void 0 ? _a : {};
	    var clientCommon = context.client;
	    var payload = event.payload;
	    return {
	        payload: {
	            siteCode: (_b = common.siteCode) !== null && _b !== void 0 ? _b : null,
	            unitCode: (_c = common.unitCode) !== null && _c !== void 0 ? _c : null,
	            deviceId: (_d = common.deviceId) !== null && _d !== void 0 ? _d : null,
	            platform: (_e = common.platform) !== null && _e !== void 0 ? _e : null,
	            clientTimestamp: clientCommon.clientTimestamp,
	            sdkJwt: (_f = common.sdkJwt) !== null && _f !== void 0 ? _f : null,
	            referrer: (_g = common.referrer) !== null && _g !== void 0 ? _g : null,
	            initialReferrer: (_h = common.initialReferrer) !== null && _h !== void 0 ? _h : null,
	            initialReferrerDomain: (_j = common.initialReferrerDomain) !== null && _j !== void 0 ? _j : null,
	            utmLandingUrl: (_k = common.utmLandingUrl) !== null && _k !== void 0 ? _k : null,
	            utmCampaign: (_l = common.utmCampaign) !== null && _l !== void 0 ? _l : null,
	            utmContent: (_m = common.utmContent) !== null && _m !== void 0 ? _m : null,
	            utmMedium: (_o = common.utmMedium) !== null && _o !== void 0 ? _o : null,
	            utmSource: (_p = common.utmSource) !== null && _p !== void 0 ? _p : null,
	            utmTerm: (_q = common.utmTerm) !== null && _q !== void 0 ? _q : null,
	            //
	            eventType: distExports.EventCode.LifecycleOrder,
	            appSessionId: (_r = payload.appSessionId) !== null && _r !== void 0 ? _r : null,
	            appSessionKey: (_s = payload.appSessionKey) !== null && _s !== void 0 ? _s : null,
	            orderCode: (_u = (_t = payload.orderCode) !== null && _t !== void 0 ? _t : payload.order_code) !== null && _u !== void 0 ? _u : null,
	            productCode: (_v = payload.productCode) !== null && _v !== void 0 ? _v : null,
	            viewportWidth: (_w = payload.viewportWidth) !== null && _w !== void 0 ? _w : null,
	            currentUrl: clientCommon.currentUrl,
	            previousUrl: clientCommon.previousUrl,
	        },
	    };
	}
	registerEventBusPayloadMapper(mapLifecycleOrderEventPayload);

	function mapDataLayerEventPayload(event) {
	    var _a;
	    if (event.type !== 'data_layer')
	        return undefined;
	    return {
	        payload: {
	            eventType: 'datalayer',
	            data: (_a = event.payload) !== null && _a !== void 0 ? _a : null,
	        },
	    };
	}
	registerEventBusPayloadMapper(mapDataLayerEventPayload);

	// Rollup replace 플러그인이 빌드 시 이 값을 치환합니다
	// 주의: process.env.ALB_ENDPOINT를 직접 사용해야 치환됨
	var BUILD_TIME_ALB_ENDPOINT = "https://behavior-tracking-event-gateway.imweb.me/api/v1/event";
	function resolveAlbEndpoint() {
	    // 빌드 시 주입된 값 우선 사용
	    {
	        return BUILD_TIME_ALB_ENDPOINT;
	    }
	}

	function resolveDeployStrategy() {
	    var _a;
	    if (typeof window === 'undefined')
	        return null;
	    return (_a = window.DeployStrategy) !== null && _a !== void 0 ? _a : null;
	}
	function isDeployStrategyInitialized(strategy) {
	    return typeof (strategy === null || strategy === void 0 ? void 0 : strategy.syncTime) === 'number' && strategy.syncTime > 0;
	}

	function getLocalStorage(key) {
	    var item = window.localStorage.getItem(key);
	    return item ? JSON.parse(item) : null;
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
	            var version = Utils.getFirstMatch(/google-extended\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            var version = Utils.getFirstMatch(/google-notebooklm\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            var version = Utils.getFirstMatch(/google-pinpoint\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            var version = Utils.getFirstMatch(/applebot-extended\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            var version = Utils.getFirstMatch(/(?:claudebot|claude-web|claude-searchbot|anthropic-ai|anthropic-claude)\/(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            var version = Utils.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)*)/i, ua) ||
	                Utils.getFirstMatch(commonVersionIdentifier, ua);
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
	            /bot(?:[\s\-_/;@()]|$)/i,
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
	                Utils.getFirstMatch(/([a-z0-9\-_]+)[\s\-_/](\d+(\.\d+)*)/i, ua);
	            if (botName && botName.length > 1) {
	                browser.name = "".concat(botName.charAt(0).toUpperCase() + botName.slice(1), "Bot");
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
	            /bot(?:[\s\-_/;@()]|$)/i,
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

	var BUILD_TIME_SDK_VERSION$1 = "1.0.15";
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
	        console.error('error #%d', error);
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
	        'imweb-sdk-version': BUILD_TIME_SDK_VERSION$1,
	    };
	}

	function sanitizeValue(value) {
	    if (value === null || value === undefined) {
	        return null;
	    }
	    if (typeof value === 'string') {
	        return (value
	            // 백슬래시 제거
	            .replace(/\\/g, '')
	            // 제어문자 제거 (쿠키 헤더에 문제를 일으킬 수 있는 문자들)
	            // biome-ignore lint/suspicious/noControlCharactersInRegex: 쿠키 헤더 정규화를 위해 제어문자 범위를 명시적으로 제거합니다.
	            .replace(/[\x00-\x1F\x7F]/g, ''));
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
	 * `sessionStorage`에서 값을 가져옵니다.
	 * - 값이 없으면 `null`을 반환합니다.
	 * - 저장 형식은 JSON 문자열을 가정합니다.
	 */
	function getSessionStorage(key) {
	    var item = window.sessionStorage.getItem(key);
	    return item ? JSON.parse(item) : null;
	}

	var EVENT_BUS_STACK_STORAGE_KEY = ANALYTICS_SESSION_STORAGE_KEYS.EVENT_BUS_STACK;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	var IS_DEV_FLAG = false === 'true';
	var BUILD_TIME_SDK_NAME = "analytics-sdk";
	var BUILD_TIME_SDK_VERSION = "1.0.15";
	var EVENT_BUS_FEATURE_KEY = 'ANA-353';
	var eventBusStackMemory = [];
	var eventBusFeatureEnabled = null;
	var eventBusFeaturePromise = null;
	var lifecycleEventFeatureEnabled = null;
	function resolveEventBusFeatureFlag(strategy) {
	    var resolvedStrategy = strategy !== null && strategy !== void 0 ? strategy : resolveDeployStrategy();
	    var hasDeployStrategy = Boolean(resolvedStrategy) &&
	        isDeployStrategyInitialized(resolvedStrategy) &&
	        typeof resolvedStrategy.isFeatureEnabled === 'function';
	    if (!hasDeployStrategy) {
	        return Promise.resolve(IS_DEV_FLAG);
	    }
	    if (eventBusFeatureEnabled !== null) {
	        return Promise.resolve(eventBusFeatureEnabled);
	    }
	    if (eventBusFeaturePromise) {
	        return eventBusFeaturePromise;
	    }
	    eventBusFeaturePromise = Promise.resolve(resolvedStrategy.isFeatureEnabled(EVENT_BUS_FEATURE_KEY))
	        .then(function (enabled) {
	        var normalized = Boolean(enabled);
	        eventBusFeatureEnabled = normalized;
	        lifecycleEventFeatureEnabled = normalized;
	        return normalized;
	    })
	        .catch(function () {
	        eventBusFeatureEnabled = false;
	        lifecycleEventFeatureEnabled = false;
	        return false;
	    })
	        .finally(function () {
	        eventBusFeaturePromise = null;
	    });
	    return eventBusFeaturePromise;
	}
	function ensureEventBusFeatureFlagsReady(strategy) {
	    return resolveEventBusFeatureFlag(strategy);
	}
	function primeEventBusFeatureFlag(strategy) {
	    void resolveEventBusFeatureFlag(strategy);
	}
	function isEventBusEnabled() {
	    var strategy = resolveDeployStrategy();
	    var hasDeployStrategy = Boolean(strategy) &&
	        isDeployStrategyInitialized(strategy) &&
	        typeof strategy.isFeatureEnabled === 'function';
	    if (hasDeployStrategy) {
	        var resolvedStrategy = strategy;
	        if (eventBusFeatureEnabled !== null)
	            return eventBusFeatureEnabled;
	        primeEventBusFeatureFlag(resolvedStrategy);
	        return eventBusFeatureEnabled === true;
	    }
	    return IS_DEV_FLAG;
	}
	function isEventBusEnabledForDebug() {
	    return isEventBusEnabled();
	}
	var LIFECYCLE_EVENT_TYPES = new Set([
	    'scroll_event',
	    'lifecycle_signal',
	    'lifecycle_end',
	    'lifecycle_event_order',
	    'prod_detail_seemore',
	]);
	function primeLifecycleEventFeatureFlag(strategy) {
	    void resolveEventBusFeatureFlag(strategy);
	}
	function shouldAllowLifecycleEvent(type) {
	    if (!LIFECYCLE_EVENT_TYPES.has(type))
	        return true;
	    if (lifecycleEventFeatureEnabled !== null)
	        return lifecycleEventFeatureEnabled;
	    var strategy = resolveDeployStrategy();
	    if (!strategy)
	        return true;
	    if (!isDeployStrategyInitialized(strategy) || typeof strategy.isFeatureEnabled !== 'function') {
	        return false;
	    }
	    primeLifecycleEventFeatureFlag(strategy);
	    return lifecycleEventFeatureEnabled === true;
	}
	var config = {
	    stackEnabled: true,
	    http: { enabled: false, console: false, endpoint: null },
	};
	/**
	 * 이벤트 버스 전역 설정을 부분 업데이트합니다.
	 * - 전달하지 않은 필드는 기존 값을 유지합니다.
	 */
	function configureEventBus(partial) {
	    if (!isEventBusEnabled())
	        return;
	    if (partial.stackEnabled !== undefined) {
	        config.stackEnabled = partial.stackEnabled;
	    }
	    if (partial.http) {
	        config.http = __assign$1(__assign$1({}, config.http), partial.http);
	    }
	}
	/**
	 * sessionStorage 값 또는 런타임 스택을 읽어 정규화합니다.
	 * - 스키마가 맞지 않는 항목은 필터링합니다.
	 */
	function readEventBusStack() {
	    if (typeof window === 'undefined')
	        return [];
	    var stored = getSessionStorage(EVENT_BUS_STACK_STORAGE_KEY);
	    var source = Array.isArray(stored) ? stored : eventBusStackMemory;
	    if (!Array.isArray(source))
	        return [];
	    var normalized = [];
	    for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
	        var item = source_1[_i];
	        if (!item || typeof item !== 'object')
	            continue;
	        var record = item;
	        var type = record.type;
	        if (type !== 'scroll_event' &&
	            type !== 'lifecycle_signal' &&
	            type !== 'lifecycle_end' &&
	            type !== 'lifecycle_event_order' &&
	            type !== 'prod_detail_seemore' &&
	            type !== 'data_layer') {
	            continue;
	        }
	        if (typeof record.timestamp !== 'number')
	            continue;
	        var previousEventDiffMs = record.previousEventDiffMs;
	        if (!(previousEventDiffMs === undefined ||
	            previousEventDiffMs === null ||
	            (typeof previousEventDiffMs === 'number' && Number.isFinite(previousEventDiffMs)))) {
	            continue;
	        }
	        normalized.push({
	            type: type,
	            timestamp: record.timestamp,
	            previousEventDiffMs: previousEventDiffMs,
	            data: record.data,
	        });
	    }
	    return normalized;
	}
	function writeEventBusStack(stack) {
	    if (typeof window === 'undefined')
	        return;
	    var sanitized = sanitizeValue(stack);
	    window.sessionStorage.setItem(EVENT_BUS_STACK_STORAGE_KEY, JSON.stringify(sanitized));
	    eventBusStackMemory = stack;
	}
	/**
	 * 직전 이벤트와의 시간차(ms)를 계산합니다.
	 * - 음수(diff<0)인 경우는 비정상으로 보고 `null`을 반환합니다.
	 */
	function resolvePreviousEventDiffMs(stack, timestamp) {
	    if (stack.length === 0)
	        return null;
	    var record = stack[stack.length - 1];
	    var diff = timestamp - record.timestamp;
	    return diff >= 0 ? diff : null;
	}
	/**
	 * 이벤트 payload에 공통/파생 필드를 주입합니다.
	 * - payload가 객체가 아니면 무시합니다.
	 * - 기본값은 "이미 존재하는 키는 덮어쓰지 않음"입니다.
	 */
	function resolveClientCommonFields(event, clientTimestampIso) {
	    return resolveEventBusClientCommonFields(event, clientTimestampIso);
	}
	/**
	 * 현재 문서 referrer를 안전하게 해석합니다.
	 */
	function resolveReferrer() {
	    return typeof document !== 'undefined' ? nullifyEmptyString(document.referrer) : null;
	}
	/**
	 * 현재 이벤트 스택 스냅샷을 반환합니다.
	 * - 스택이 비어 있으면 빈 배열을 반환합니다.
	 */
	function getEventBusStackSnapshots() {
	    var stack = readEventBusStack();
	    return stack.map(function (record) { return ({ type: record.type, timestamp: record.timestamp, payload: record.data }); });
	}
	/**
	 * 이벤트를 HTTP로 전송합니다.
	 * - 가능하면 `navigator.sendBeacon`을 사용하고 실패 시 `fetch`로 fallback 합니다.
	 * - 네트워크/브라우저 API 실패는 내부에서 로깅하고 삼킵니다.
	 */
	function sendViaHttp(endpoint, payload) {
	    return __awaiter(this, void 0, void 0, function () {
	        var body, canUseBeacon, ok, userInfo;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    body = JSON.stringify(payload);
	                    canUseBeacon = typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function';
	                    _a.label = 1;
	                case 1:
	                    _a.trys.push([1, 3, , 4]);
	                    if (canUseBeacon) {
	                        try {
	                            ok = navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
	                            if (ok)
	                                return [2 /*return*/];
	                        }
	                        catch (error) {
	                        }
	                    }
	                    userInfo = getLocalStorage(BRANDSCOPE_LOCAL_STORAGE_KEYS.USER_INFO);
	                    return [4 /*yield*/, fetch(endpoint, {
	                            method: 'POST',
	                            headers: buildImwebRequestHeaders(userInfo),
	                            body: body,
	                            keepalive: true,
	                        })];
	                case 2:
	                    _a.sent();
	                    return [3 /*break*/, 4];
	                case 3:
	                    _a.sent();
	                    return [3 /*break*/, 4];
	                case 4: return [2 /*return*/];
	            }
	        });
	    });
	}
	/**
	 * 단일 프로세스 내에서 동작하는 인메모리 pub/sub 버스입니다.
	 * - 구독 핸들러는 동기/비동기 모두 허용합니다.
	 * - 핸들러 예외는 내부에서 캐치하고, 다른 핸들러 실행은 계속 진행합니다.
	 */
	var EventBus = /** @class */ (function () {
	    function EventBus() {
	        this.handlers = [];
	    }
	    /**
	     * 이벤트 핸들러를 구독합니다.
	     * @returns 구독 해제 함수(unsubscribe)
	     */
	    EventBus.prototype.subscribe = function (handler) {
	        var _this = this;
	        this.handlers.push(handler);
	        return function () {
	            _this.handlers = _this.handlers.filter(function (h) { return h !== handler; });
	        };
	    };
	    /**
	     * 이벤트를 발행합니다.
	     * - 등록된 모든 핸들러에게 순차적으로 전달합니다.
	     * - 비동기 핸들러는 fire-and-forget 형태로 실행합니다.
	     */
	    EventBus.prototype.publish = function (event) {
	        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
	            var handler = _a[_i];
	            try {
	                var result = handler(event);
	                if (result && typeof result.then === 'function') {
	                    void result;
	                }
	            }
	            catch (error) {
	            }
	        }
	    };
	    return EventBus;
	}());
	/**
	 * 전역 이벤트 버스 인스턴스입니다.
	 * - SDK 내부 기본 핸들러(스택 누적/HTTP 전송)가 이미 구독되어 있습니다.
	 */
	var bsEventBus = new EventBus();
	/**
	 * SDK 내부 이벤트를 event-gateway 전송 스키마로 변환합니다.
	 * - mapper가 `undefined`를 반환하면 다음 mapper로 넘어갑니다.
	 * - 매핑이 없으면 payload 원본을 반환합니다.
	 */
	function resolveEventGatewayPayload(event) {
	    var _a;
	    var context = (_a = event.context) !== null && _a !== void 0 ? _a : {
	        client: resolveEventBusClientCommonFields(event),
	        previousEventDiffMs: null,
	    };
	    for (var _i = 0, _b = getEventBusPayloadMappers(); _i < _b.length; _i++) {
	        var mapper = _b[_i];
	        try {
	            var mapped = mapper(event, context);
	            if (mapped !== undefined)
	                return applyCommonSessionIdToPayload(mapped.payload, event.common);
	        }
	        catch (error) {
	        }
	    }
	    return applyCommonSessionIdToPayload(event.payload, event.common);
	}
	function resolveCommonSessionId(result) {
	    if (typeof result === 'string')
	        return result;
	    if (!result || typeof result !== 'object')
	        return null;
	    return nullifyEmptyString(result.sessionId);
	}
	function applyResolvedCommonSessionId(event, result) {
	    var _a, _b;
	    var commonSessionId = resolveCommonSessionId(result);
	    if (!commonSessionId)
	        return;
	    if ((_a = event.common) === null || _a === void 0 ? void 0 : _a.commonSessionId)
	        return;
	    event.common = __assign$1(__assign$1({}, ((_b = event.common) !== null && _b !== void 0 ? _b : {})), { commonSessionId: commonSessionId });
	}
	function applyCommonSessionIdToPayload(payload, common) {
	    var commonSessionId = common === null || common === void 0 ? void 0 : common.commonSessionId;
	    if (!commonSessionId)
	        return payload;
	    if (!payload || typeof payload !== 'object' || Array.isArray(payload))
	        return payload;
	    var payloadRecord = payload;
	    if (payloadRecord.commonSessionId !== undefined)
	        return payload;
	    return __assign$1(__assign$1({}, payloadRecord), { commonSessionId: commonSessionId });
	}
	/**
	 * BrandScope common session refresh sidecar를 direct-call로 수행합니다.
	 * - 동기 반환값(string 또는 { sessionId })만 현재 publish tick의 common/payload 계산에 즉시 반영됩니다.
	 * - Promise 반환값은 non-blocking으로 후속 `event.common` 갱신만 시도하며, 이미 계산된 same-tick payload/stack/http 반영은 보장하지 않습니다.
	 * - 오류/거부는 fail-open으로 삼키고 기존 발행 흐름을 유지합니다.
	 */
	function refreshDirectCommonSession(event) {
	    var _a;
	    if (typeof window === 'undefined')
	        return;
	    var refreshCommonSession = (_a = window.BrandScope) === null || _a === void 0 ? void 0 : _a.refreshCommonSession;
	    if (typeof refreshCommonSession !== 'function')
	        return;
	    try {
	        var result = refreshCommonSession();
	        if (result && typeof result.then === 'function') {
	            void Promise.resolve(result)
	                .then(function (resolved) {
	                applyResolvedCommonSessionId(event, resolved);
	            })
	                .catch(function () { return undefined; });
	            return;
	        }
	        applyResolvedCommonSessionId(event, result);
	    }
	    catch (_b) {
	        return;
	    }
	}
	function resolveEventPayloadContext(event, clientTimestampIso) {
	    var client = resolveClientCommonFields(event, clientTimestampIso);
	    var previousEventDiffMs = resolvePreviousEventDiffMs(readEventBusStack(), event.timestamp);
	    return { client: client, previousEventDiffMs: previousEventDiffMs };
	}
	/**
	 * 공통 클라이언트 필드를 event에 주입합니다.
	 * - common: `clientTimestamp`를 일관되게 반영합니다.
	 */
	function applyCommonClientFields(event, clientTimestampIso) {
	    var _a;
	    var clientCommon = resolveClientCommonFields(event, clientTimestampIso);
	    event.common = __assign$1(__assign$1({}, ((_a = event.common) !== null && _a !== void 0 ? _a : {})), { clientTimestamp: clientCommon.clientTimestamp });
	}
	/**
	 * 저장소 분리 정책을 고려해 사용자 정보를 병합합니다.
	 * - 고정값(deviceId/deviceIdCreatedAt/siteCode/unitCode)은 localStorage(`__bs_imweb`)에 저장됩니다.
	 * - 그 외 값(utm/initialReferrer/platform 등)은 sessionStorage(`__bs_imweb_session`)에 저장됩니다.
	 * - 레거시 환경(localStorage에 전체 데이터)도 허용합니다.
	 */
	// 기본 핸들러: 런타임 스택 누적(append-only)
	bsEventBus.subscribe(function (event) {
	    var _a, _b;
	    if (!isEventBusEnabled())
	        return;
	    if (!config.stackEnabled)
	        return;
	    var stack = readEventBusStack();
	    var previousEventDiffMs = (_b = (_a = event.context) === null || _a === void 0 ? void 0 : _a.previousEventDiffMs) !== null && _b !== void 0 ? _b : null;
	    var resolvedPayload = resolveEventGatewayPayload(event);
	    var nextStack = __spreadArray$1(__spreadArray$1([], stack, true), [
	        {
	            type: event.type,
	            timestamp: event.timestamp,
	            previousEventDiffMs: previousEventDiffMs,
	            data: resolvedPayload,
	        },
	    ], false);
	    writeEventBusStack(nextStack);
	});
	// 기본 핸들러: HTTP 전송(전역 설정 + 이벤트 allowSend)
	bsEventBus.subscribe(function (event) { return __awaiter(void 0, void 0, void 0, function () {
	    var endpoint;
	    var _a, _b;
	    return __generator(this, function (_c) {
	        switch (_c.label) {
	            case 0:
	                if (!isEventBusEnabled())
	                    return [2 /*return*/];
	                if (((_b = (_a = event.meta) === null || _a === void 0 ? void 0 : _a.http) === null || _b === void 0 ? void 0 : _b.allowSend) === false)
	                    return [2 /*return*/];
	                if (config.http.console) {
	                    logDebug('[event-bus] console', resolveEventGatewayPayload(event));
	                }
	                endpoint = resolveAlbEndpoint();
	                if (!config.http.enabled || !endpoint)
	                    return [2 /*return*/];
	                return [4 /*yield*/, sendViaHttp(endpoint, resolveEventGatewayPayload(event))];
	            case 1:
	                _c.sent();
	                return [2 /*return*/];
	        }
	    });
	}); });
	// 데이터 레이어 이벤트 디버그 로그는 http.console 설정에 따라 제어합니다.
	bsEventBus.subscribe(function (event) {
	    if (!isEventBusEnabled())
	        return;
	    if (event.type !== 'data_layer')
	        return;
	    if (!config.http.console)
	        return;
	    logDebug('[event-bus][data-layer]', resolveEventGatewayPayload(event));
	});
	/**
	 * 이벤트 공통 컨텍스트(common)를 구성합니다.
	 * - 시간(clientTimestamp 포함), 사용자 식별/사이트 정보 등을 주입합니다.
	 */
	function buildEventCommon(event) {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
	    if (typeof window === 'undefined') {
	        return {
	            clientTimestamp: resolveClientTimestampIso(event),
	            deviceId: null,
	            siteCode: null,
	            unitCode: null,
	            platform: null,
	            analyticsSdkName: nullifyEmptyString(BUILD_TIME_SDK_NAME),
	            analyticsSdkVersion: nullifyEmptyString(BUILD_TIME_SDK_VERSION),
	            referrer: null,
	            initialReferrer: null,
	            initialReferrerDomain: null,
	            utmLandingUrl: null,
	            utmCampaign: null,
	            utmContent: null,
	            utmMedium: null,
	            utmSource: null,
	            utmTerm: null,
	        };
	    }
	    try {
	        var storedUser = getMergedStoredUserInfo();
	        var clientTimestampIso = resolveClientTimestampIso(event);
	        var sdkJwt = (_c = (_b = (typeof window !== 'undefined' ? ((_a = window.SDK_JWT) !== null && _a !== void 0 ? _a : null) : null)) !== null && _b !== void 0 ? _b : storedUser === null || storedUser === void 0 ? void 0 : storedUser.sdkJwt) !== null && _c !== void 0 ? _c : null;
	        var _p = extractSiteUnitFromSdkJwt(sdkJwt), siteCode = _p.siteCode, unitCode = _p.unitCode;
	        return {
	            clientTimestamp: clientTimestampIso,
	            deviceId: (_d = storedUser === null || storedUser === void 0 ? void 0 : storedUser.deviceId) !== null && _d !== void 0 ? _d : null,
	            siteCode: siteCode,
	            unitCode: unitCode,
	            platform: (_e = storedUser === null || storedUser === void 0 ? void 0 : storedUser.platform) !== null && _e !== void 0 ? _e : null,
	            analyticsSdkName: nullifyEmptyString(BUILD_TIME_SDK_NAME),
	            analyticsSdkVersion: nullifyEmptyString(BUILD_TIME_SDK_VERSION),
	            sdkJwt: sdkJwt,
	            referrer: resolveReferrer(),
	            initialReferrer: (_f = storedUser === null || storedUser === void 0 ? void 0 : storedUser.initialReferrer) !== null && _f !== void 0 ? _f : null,
	            initialReferrerDomain: (_g = storedUser === null || storedUser === void 0 ? void 0 : storedUser.initialReferrerDomain) !== null && _g !== void 0 ? _g : null,
	            utmLandingUrl: (_h = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmLandingUrl) !== null && _h !== void 0 ? _h : null,
	            utmCampaign: (_j = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmCampaign) !== null && _j !== void 0 ? _j : null,
	            utmContent: (_k = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmContent) !== null && _k !== void 0 ? _k : null,
	            utmMedium: (_l = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmMedium) !== null && _l !== void 0 ? _l : null,
	            utmSource: (_m = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmSource) !== null && _m !== void 0 ? _m : null,
	            utmTerm: (_o = storedUser === null || storedUser === void 0 ? void 0 : storedUser.utmTerm) !== null && _o !== void 0 ? _o : null,
	        };
	    }
	    catch (_q) {
	        return {
	            clientTimestamp: resolveClientTimestampIso(event),
	            deviceId: null,
	            siteCode: null,
	            unitCode: null,
	            platform: null,
	            analyticsSdkName: nullifyEmptyString(BUILD_TIME_SDK_NAME),
	            analyticsSdkVersion: nullifyEmptyString(BUILD_TIME_SDK_VERSION),
	            referrer: null,
	            initialReferrer: null,
	            initialReferrerDomain: null,
	            utmLandingUrl: null,
	            utmCampaign: null,
	            utmContent: null,
	            utmMedium: null,
	            utmSource: null,
	            utmTerm: null,
	        };
	    }
	}
	/**
	 * BrandScope 이벤트를 발행합니다.
	 * - 내부적으로 전역 `bsEventBus`로 전달됩니다.
	 * - common session sidecar는 gate 통과 뒤 direct-call로 수행되며, 동기 성공 경로만 현재 발행 payload에 반영됩니다.
	 * - Promise 성공값은 non-blocking 후속 갱신 대상일 뿐, same-tick payload 반영 계약은 아닙니다.
	 */
	function publishBsEvent(event) {
	    var _a, _b;
	    if (!isEventBusEnabled())
	        return null;
	    if (!shouldAllowLifecycleEvent(event.type))
	        return null;
	    var common = buildEventCommon(event);
	    var normalizedEvent = __assign$1(__assign$1({}, event), { common: __assign$1(__assign$1({}, ((_a = event.common) !== null && _a !== void 0 ? _a : {})), common) });
	    refreshDirectCommonSession(normalizedEvent);
	    var clientTimestampIso = (_b = common.clientTimestamp) !== null && _b !== void 0 ? _b : resolveClientTimestampIso(event);
	    normalizedEvent.context = resolveEventPayloadContext(normalizedEvent, clientTimestampIso);
	    applyCommonClientFields(normalizedEvent, clientTimestampIso);
	    bsEventBus.publish(normalizedEvent);
	    return normalizedEvent;
	}

	var _a, _b, _c, _d;
	var STORE_SCOPES = ['global', 'session', 'page', 'event'];
	var DEFAULT_SCOPE = 'global';
	var DEFAULT_NAMESPACE = 'shared';
	var store = {
	    global: (_a = {}, _a[DEFAULT_NAMESPACE] = {}, _a),
	    session: (_b = {}, _b[DEFAULT_NAMESPACE] = {}, _b),
	    page: (_c = {}, _c[DEFAULT_NAMESPACE] = {}, _c),
	    event: (_d = {}, _d[DEFAULT_NAMESPACE] = {}, _d),
	};
	var pushQueue = [];
	var isQueueProcessing = false;
	function isPlainObject(value) {
	    if (!value || typeof value !== 'object')
	        return false;
	    if (Array.isArray(value))
	        return false;
	    return Object.prototype.toString.call(value) === '[object Object]';
	}
	function cloneValue(value) {
	    if (Array.isArray(value)) {
	        return __spreadArray$1([], value, true);
	    }
	    if (isPlainObject(value)) {
	        return __assign$1({}, value);
	    }
	    return value;
	}
	function setByPath(target, path, value) {
	    if (!path)
	        return;
	    var keys = path.split('.').filter(Boolean);
	    if (keys.length === 0)
	        return;
	    var cursor = target;
	    for (var i = 0; i < keys.length - 1; i += 1) {
	        var key = keys[i];
	        var next = cursor[key];
	        if (!isPlainObject(next)) {
	            cursor[key] = {};
	        }
	        cursor = cursor[key];
	    }
	    var lastKey = keys[keys.length - 1];
	    if (value === null) {
	        delete cursor[lastKey];
	    }
	    else {
	        cursor[lastKey] = value;
	    }
	}
	function getByPath(source, path) {
	    if (!path)
	        return undefined;
	    var keys = path.split('.').filter(Boolean);
	    if (keys.length === 0)
	        return undefined;
	    var cursor = source;
	    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
	        var key = keys_1[_i];
	        if (!isPlainObject(cursor) && !Array.isArray(cursor))
	            return undefined;
	        cursor = cursor[key];
	    }
	    return cursor;
	}
	function mergeInto(base, source) {
	    if (!source)
	        return;
	    for (var _i = 0, _a = Object.entries(source); _i < _a.length; _i++) {
	        var _b = _a[_i], key = _b[0], value = _b[1];
	        if (value === undefined)
	            continue;
	        if (value === null) {
	            delete base[key];
	            continue;
	        }
	        base[key] = cloneValue(value);
	    }
	}
	function resolveNamespaceStore(scope, namespace) {
	    if (!store[scope][namespace]) {
	        store[scope][namespace] = {};
	    }
	    return store[scope][namespace];
	}
	function buildSnapshot(options) {
	    var _a;
	    var namespace = (_a = options === null || options === void 0 ? void 0 : options.namespace) !== null && _a !== void 0 ? _a : DEFAULT_NAMESPACE;
	    var includeShared = (options === null || options === void 0 ? void 0 : options.includeShared) !== false;
	    var snapshot = {};
	    if (includeShared) {
	        mergeInto(snapshot, store.global[DEFAULT_NAMESPACE]);
	        mergeInto(snapshot, store.session[DEFAULT_NAMESPACE]);
	        mergeInto(snapshot, store.page[DEFAULT_NAMESPACE]);
	        mergeInto(snapshot, store.event[DEFAULT_NAMESPACE]);
	    }
	    mergeInto(snapshot, store.global[namespace]);
	    mergeInto(snapshot, store.session[namespace]);
	    mergeInto(snapshot, store.page[namespace]);
	    mergeInto(snapshot, store.event[namespace]);
	    if (options === null || options === void 0 ? void 0 : options.eventPayload) {
	        mergeInto(snapshot, options.eventPayload);
	    }
	    return snapshot;
	}
	function enqueuePush(payload, namespace, includeShared) {
	    var timestamp = Date.now();
	    pushQueue.push({ payload: payload, timestamp: timestamp, namespace: namespace, includeShared: includeShared });
	    if (isQueueProcessing)
	        return;
	    isQueueProcessing = true;
	    Promise.resolve().then(processQueue);
	}
	function processQueue() {
	    while (pushQueue.length > 0) {
	        var item = pushQueue.shift();
	        if (!item)
	            continue;
	        var snapshot = buildSnapshot({
	            namespace: item.namespace,
	            includeShared: item.includeShared,
	            eventPayload: item.payload,
	        });
	        publishBsEvent({
	            type: 'data_layer',
	            sessionId: null,
	            timestamp: item.timestamp,
	            payload: snapshot,
	        });
	        resolveNamespaceStore('event', item.namespace);
	        store.event[item.namespace] = {};
	    }
	    isQueueProcessing = false;
	}
	var dataLayer = {
	    set: function (key, value, options) {
	        var _a, _b;
	        if (options === void 0) { options = {}; }
	        var scope = (_a = options.scope) !== null && _a !== void 0 ? _a : DEFAULT_SCOPE;
	        var namespace = (_b = options.namespace) !== null && _b !== void 0 ? _b : DEFAULT_NAMESPACE;
	        if (!STORE_SCOPES.includes(scope)) {
	            return;
	        }
	        var scopeStore = resolveNamespaceStore(scope, namespace);
	        setByPath(scopeStore, key, value);
	    },
	    get: function (key, options) {
	        var snapshot = buildSnapshot({ namespace: options === null || options === void 0 ? void 0 : options.namespace, includeShared: options === null || options === void 0 ? void 0 : options.includeShared });
	        return getByPath(snapshot, key);
	    },
	    clear: function (scope, options) {
	        var _a;
	        var namespace = (_a = options === null || options === void 0 ? void 0 : options.namespace) !== null && _a !== void 0 ? _a : DEFAULT_NAMESPACE;
	        if (!scope) {
	            store.global[namespace] = {};
	            store.session[namespace] = {};
	            store.page[namespace] = {};
	            store.event[namespace] = {};
	            return;
	        }
	        if (!STORE_SCOPES.includes(scope)) {
	            return;
	        }
	        store[scope][namespace] = {};
	    },
	    push: function (eventObject, options) {
	        var _a;
	        if (!isPlainObject(eventObject)) {
	            return;
	        }
	        var namespace = (_a = options === null || options === void 0 ? void 0 : options.namespace) !== null && _a !== void 0 ? _a : DEFAULT_NAMESPACE;
	        var includeShared = (options === null || options === void 0 ? void 0 : options.includeShared) !== false;
	        enqueuePush(eventObject, namespace, includeShared);
	    },
	    snapshot: function (options) {
	        return buildSnapshot({ namespace: options === null || options === void 0 ? void 0 : options.namespace, includeShared: options === null || options === void 0 ? void 0 : options.includeShared });
	    },
	    createContext: function (options) {
	        var _a, _b;
	        var namespace = (_a = options === null || options === void 0 ? void 0 : options.namespace) !== null && _a !== void 0 ? _a : "ctx_".concat(generateEventId());
	        var includeShared = (_b = options === null || options === void 0 ? void 0 : options.includeShared) !== null && _b !== void 0 ? _b : false;
	        return {
	            namespace: namespace,
	            set: function (key, value, setOptions) {
	                if (setOptions === void 0) { setOptions = {}; }
	                return dataLayer.set(key, value, __assign$1(__assign$1({}, setOptions), { namespace: namespace }));
	            },
	            get: function (key) { return dataLayer.get(key, { namespace: namespace, includeShared: includeShared }); },
	            clear: function (scope) { return dataLayer.clear(scope, { namespace: namespace }); },
	            push: function (eventObject) { return dataLayer.push(eventObject, { namespace: namespace, includeShared: includeShared }); },
	            snapshot: function () { return dataLayer.snapshot({ namespace: namespace, includeShared: includeShared }); },
	        };
	    },
	};

	var APP_SESSION_KEY = {
	    LIFECYCLE_EVENT: 'lifecycle-event',
	};

	/**
	 * 상품상세 "더보기(접힘)" 상태를 계산합니다.
	 *
	 * 소스 페이지 구현 기준:
	 * - 접힘 옵션 비활성: `#prod_detail_body`에 `seemore_detail` 클래스가 없으면 `null`
	 * - 펼침 상태:
	 *   - `active`: SITE_SHOP_DETAIL.showSeeMoreButton()
	 *   - `in`: bootstrap collapse.in
	 *   - `hide_seemore`: 접기 비활성(항상 전체 노출)
	 */
	function getDetailFoldYn() {
	    if (typeof document === 'undefined')
	        return null;
	    var body = document.querySelector('[id="prod_detail_body"]');
	    if (!body)
	        return null;
	    var hasSeemore = body.classList.contains('seemore_detail');
	    if (!hasSeemore)
	        return null;
	    var expanded = body.classList.contains('active') || body.classList.contains('in') || body.classList.contains('hide_seemore');
	    return expanded ? 'Y' : 'N';
	}

	var LIFECYCLE_EVENT_SESSION_STORAGE_KEY = ANALYTICS_SESSION_STORAGE_KEYS.LIFECYCLE_EVENT_SESSION;
	var LIFECYCLE_EVENT_PENDING_NAVIGATION_KEY = ANALYTICS_SESSION_STORAGE_KEYS.LIFECYCLE_EVENT_PENDING_NAVIGATION;
	/**
	 * 사용자 행동 세션 타임아웃(30분).
	 * - 마지막 활동(스크롤/visibilitychange/pagehide 등) 이후 30분이 지나면 세션이 만료됩니다.
	 */
	var LIFECYCLE_EVENT_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
	var sessionTimeoutTimer = null;
	var sessionDebugTickerTimer = null;
	function readSessionStorage(key) {
	    var item = window.sessionStorage.getItem(key);
	    return item ? JSON.parse(item) : null;
	}
	function writeSessionStorage(key, value) {
	    var sanitizedValue = sanitizeValue(value);
	    window.sessionStorage.setItem(key, JSON.stringify(sanitizedValue));
	}
	function writePendingNavigation(pending) {
	    writeSessionStorage(LIFECYCLE_EVENT_PENDING_NAVIGATION_KEY, pending);
	}
	function readPendingNavigation() {
	    var stored = readSessionStorage(LIFECYCLE_EVENT_PENDING_NAVIGATION_KEY);
	    if (!stored)
	        return null;
	    if (typeof stored.sessionId !== 'string')
	        return null;
	    if (!(stored.previousUrl === null || typeof stored.previousUrl === 'string'))
	        return null;
	    if (typeof stored.endedAt !== 'number')
	        return null;
	    return stored;
	}
	/**
	 * 저장소에서 현재 세션을 읽어옵니다.
	 * - 만료(`expiresAt <= now`)된 세션은 `timeout`으로 종료 처리하고 `null` 반환합니다(데이터는 삭제하지 않음).
	 * - 스키마가 깨진 데이터는 `null`로 처리합니다.
	 *
	 * @param now 기준 시간(ms). 테스트/제어 목적
	 */
	function readSession(now) {
	    if (now === void 0) { now = Date.now(); }
	    var stored = readSessionStorage(LIFECYCLE_EVENT_SESSION_STORAGE_KEY);
	    if (!stored)
	        return null;
	    var rawCurrentPageUrl = stored.currentPageUrl;
	    var rawCurrentPagePath = stored.currentPagePath;
	    var rawCurrentPageProductIdx = stored.currentPageProductIdx;
	    var rawCurrentPageProductCode = stored.currentPageProductCode;
	    // 과거 스키마(pageKey/pageUrl) 호환
	    var legacyPageKey = stored.pageKey;
	    var legacyPageUrl = stored.pageUrl;
	    var currentPageUrl = rawCurrentPageUrl === undefined ? (typeof legacyPageUrl === 'string' ? legacyPageUrl : null) : rawCurrentPageUrl;
	    var currentPagePath = rawCurrentPagePath === undefined ? null : rawCurrentPagePath;
	    var currentPageProductIdx = rawCurrentPageProductIdx === undefined ? null : rawCurrentPageProductIdx;
	    var currentPageProductCode = rawCurrentPageProductCode === undefined ? null : rawCurrentPageProductCode;
	    var rawProductDetailHeight = stored.productDetailHeight;
	    var rawProductDetailFoldHeight = stored
	        .productDetailFoldHeight;
	    var productDetailHeight = typeof rawProductDetailHeight === 'number' ? rawProductDetailHeight : null;
	    var productDetailFoldHeight = typeof rawProductDetailFoldHeight === 'number' ? rawProductDetailFoldHeight : null;
	    var normalizedProductIdx = currentPageProductIdx === undefined ? null : currentPageProductIdx;
	    var normalizedProductCode = currentPageProductCode === undefined ? null : currentPageProductCode;
	    if (normalizedProductIdx === null && normalizedProductCode === null && typeof legacyPageKey === 'string') {
	        var trimmed = legacyPageKey.trim();
	        if (trimmed.startsWith('idx:'))
	            normalizedProductIdx = trimmed.slice(4);
	        if (trimmed.startsWith('code:'))
	            normalizedProductCode = trimmed.slice(5);
	    }
	    var createdAt = stored.createdAt;
	    var endedAt = stored.endedAt;
	    var endReason = stored.endReason;
	    if (typeof stored.sessionId !== 'string' ||
	        stored.source !== 'scroll' ||
	        typeof (createdAt === undefined ? stored.lastActivityAt : createdAt) !== 'number' ||
	        typeof stored.lastActivityAt !== 'number' ||
	        typeof stored.expiresAt !== 'number' ||
	        !(endedAt === undefined ||
	            endedAt === null ||
	            (typeof endedAt === 'number' && Number.isFinite(endedAt) && endedAt >= 0)) ||
	        !(endReason === undefined ||
	            endReason === null ||
	            endReason === 'timeout' ||
	            endReason === 'pagehide' ||
	            endReason === 'navigate') ||
	        !(currentPageUrl === null || typeof currentPageUrl === 'string') ||
	        !(currentPagePath === null || typeof currentPagePath === 'string') ||
	        !(normalizedProductIdx === null || typeof normalizedProductIdx === 'string') ||
	        !(normalizedProductCode === null || typeof normalizedProductCode === 'string') ||
	        !(productDetailHeight === null || typeof productDetailHeight === 'number') ||
	        !(productDetailFoldHeight === null || typeof productDetailFoldHeight === 'number')) {
	        return null;
	    }
	    var normalizedSession = __assign$1(__assign$1({}, stored), { createdAt: typeof createdAt === 'number' ? createdAt : stored.lastActivityAt, endedAt: endedAt === undefined ? null : endedAt, endReason: endReason === undefined ? null : endReason, currentPageUrl: currentPageUrl, currentPagePath: currentPagePath, currentPageProductIdx: normalizedProductIdx, currentPageProductCode: normalizedProductCode, productDetailHeight: productDetailHeight, productDetailFoldHeight: productDetailFoldHeight });
	    if (normalizedSession.endedAt !== null) {
	        return null;
	    }
	    if (normalizedSession.expiresAt <= now) {
	        endSession(normalizedSession, 'timeout', now);
	        return null;
	    }
	    return normalizedSession;
	}
	/**
	 * 세션을 sessionStorage에 기록합니다.
	 */
	function writeSession(session) {
	    writeSessionStorage(LIFECYCLE_EVENT_SESSION_STORAGE_KEY, session);
	}
	function measureViewportSnapshot() {
	    var _a, _b;
	    if (typeof window === 'undefined' || typeof document === 'undefined') {
	        return { scrollTop: 0, documentHeight: 0, viewportWidth: 0, viewportHeight: 0 };
	    }
	    var viewportWidth = window.innerWidth || 0;
	    var viewportHeight = window.innerHeight || 0;
	    var scrollTop = window.scrollY || window.pageYOffset || 0;
	    var documentHeight = Math.max(((_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.scrollHeight) || 0, ((_b = document.body) === null || _b === void 0 ? void 0 : _b.scrollHeight) || 0, viewportHeight);
	    var roundedScrollTop = Math.round(scrollTop);
	    return { scrollTop: roundedScrollTop, documentHeight: documentHeight, viewportWidth: viewportWidth, viewportHeight: viewportHeight };
	}
	function getPreviousLifecycleEventType(appSessionId) {
	    var snapshots = getEventBusStackSnapshots();
	    for (var i = snapshots.length - 1; i >= 0; i -= 1) {
	        var snapshot = snapshots[i];
	        if (snapshot.payload && typeof snapshot.payload === 'object') {
	            var payload = snapshot.payload;
	            if (payload.appSessionId !== appSessionId) {
	                continue;
	            }
	        }
	        else {
	            continue;
	        }
	        var eventName = resolveLifecycleEventName(snapshot.type, snapshot.payload);
	        if (eventName)
	            return eventName;
	    }
	    return null;
	}
	function endSession(session, reason, endedAt, navigation, options) {
	    var _a, _b, _c, _d, _e;
	    if (endedAt === void 0) { endedAt = Date.now(); }
	    if (navigation === void 0) { navigation = null; }
	    if (options === void 0) { options = {}; }
	    if (sessionTimeoutTimer !== null) {
	        globalThis.clearTimeout(sessionTimeoutTimer);
	        sessionTimeoutTimer = null;
	    }
	    var ended = __assign$1(__assign$1({}, session), { endedAt: endedAt, endReason: reason });
	    writeSession(ended);
	    logDebug('[lifecycle-event-session-ended]', { sessionId: session.sessionId, source: session.source});
	    if (options.markPendingNavigation) {
	        writePendingNavigation({
	            sessionId: session.sessionId,
	            previousUrl: (_a = session.currentPageUrl) !== null && _a !== void 0 ? _a : null,
	            endedAt: endedAt,
	        });
	    }
	    if (options.suppressPublish) {
	        return;
	    }
	    var metrics = measureViewportSnapshot();
	    var previousEventType = getPreviousLifecycleEventType(session.sessionId);
	    var eventName = (function () {
	        if (reason === 'timeout')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.SESSION_TIMEOUT;
	        if (reason === 'pagehide')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE;
	        if (reason === 'navigate')
	            return LIFECYCLE_SIGNAL_EVENT_NAME.LIFECYCLE_END;
	        return LIFECYCLE_SIGNAL_EVENT_NAME.PAGEHIDE;
	    })();
	    var payload = {
	        eventName: eventName,
	        appSessionId: session.sessionId,
	        appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT,
	        productCode: (_b = session.currentPageProductCode) !== null && _b !== void 0 ? _b : null,
	        previousEventType: previousEventType,
	        previousUrl: (_c = navigation === null || navigation === void 0 ? void 0 : navigation.previousUrl) !== null && _c !== void 0 ? _c : null,
	        scrollTop: metrics.scrollTop,
	        documentHeight: metrics.documentHeight,
	        viewportWidth: metrics.viewportWidth,
	        viewportHeight: metrics.viewportHeight,
	        productDescriptionFold: getDetailFoldYn(),
	        productDetailHeight: (_d = session.productDetailHeight) !== null && _d !== void 0 ? _d : null,
	        productDetailFoldHeight: (_e = session.productDetailFoldHeight) !== null && _e !== void 0 ? _e : null,
	        seemoreButtonPosition: null,
	    };
	    publishBsEvent({
	        type: 'lifecycle_end',
	        sessionId: session.sessionId,
	        timestamp: endedAt,
	        payload: __assign$1(__assign$1({}, payload), { lifecycleEndReason: reason }),
	        meta: { http: { allowSend: true } },
	    });
	}
	function endActiveScrollSession(reason, endedAt, options) {
	    if (endedAt === void 0) { endedAt = Date.now(); }
	    if (options === void 0) { options = {}; }
	    var session = readSession(endedAt);
	    if (!session)
	        return null;
	    if (session.source !== 'scroll')
	        return null;
	    endSession(session, reason, endedAt, null, options);
	    return session;
	}
	function forceTimeoutActiveScrollSession(now) {
	    if (now === void 0) { now = Date.now(); }
	    return endActiveScrollSession('timeout', now);
	}
	/**
	 * MPA 환경에서 "이전 페이지 → 현재 페이지" 이동을 이용해 세션을 종료/연결 정보를 기록합니다.
	 * - 이전 페이지 URL(`previousUrl`)이 세션의 `currentPageUrl`과 일치할 때만 처리합니다.
	 * - 이미 종료된 세션이거나, referrer가 불명확(`@direct` 등)한 경우는 건너뜁니다.
	 */
	function recordMpaNavigation(previousUrl, currentUrl, now) {
	    var _a;
	    if (now === void 0) { now = Date.now(); }
	    if (!previousUrl || !currentUrl)
	        return;
	    if (previousUrl === '@direct')
	        return;
	    var pendingNavigation = readPendingNavigation();
	    var stored = getSessionStorage(LIFECYCLE_EVENT_SESSION_STORAGE_KEY);
	    if (!stored)
	        return;
	    var endedAt = stored.endedAt;
	    var hasEnded = endedAt !== undefined && endedAt !== null;
	    if (hasEnded) {
	        if (!pendingNavigation)
	            return;
	        if (pendingNavigation.sessionId !== stored.sessionId) {
	            writePendingNavigation(null);
	            return;
	        }
	        if (pendingNavigation.previousUrl !== previousUrl)
	            return;
	    }
	    var active = (_a = readSession(now)) !== null && _a !== void 0 ? _a : stored;
	    if (active.currentPageUrl !== previousUrl)
	        return;
	    writePendingNavigation(null);
	    endSession(active, 'navigate', now, { previousUrl: previousUrl});
	}
	/**
	 * 세션 만료 시점에 맞춰 타임아웃 콜백을 예약합니다.
	 * - 기존 예약이 있으면 갱신합니다.
	 * - 콜백 실행 시점에 세션이 바뀌었거나 연장된 경우는 아무 것도 하지 않습니다.
	 */
	function scheduleTimeout(sessionId, expiresAt) {
	    if (sessionTimeoutTimer !== null) {
	        globalThis.clearTimeout(sessionTimeoutTimer);
	    }
	    var delay = Math.max(0, expiresAt - Date.now());
	    sessionTimeoutTimer = globalThis.setTimeout(function () {
	        sessionTimeoutTimer = null;
	        var now = Date.now();
	        var current = readSession(now);
	        if (!current)
	            return;
	        if (current.sessionId !== sessionId)
	            return;
	        if (current.expiresAt > now)
	            return;
	        logDebug('[lifecycle-event-session-timeout]', { sessionId: current.sessionId, source: current.source});
	        endSession(current, 'timeout', now);
	    }, delay);
	}
	/**
	 * 디버깅용 ticker를 시작합니다.
	 * - 활성 세션이 있는 동안만 주기적으로 `remainingMs` 등을 로그로 출력합니다.
	 * - 세션이 없거나 만료되면 자동으로 ticker를 중지합니다.
	 */
	function startSessionDebugTicker(intervalMs) {
	    if (sessionDebugTickerTimer !== null) {
	        return;
	    }
	    sessionDebugTickerTimer = globalThis.setInterval(function () {
	        var now = Date.now();
	        var session = getActiveScrollSession(now);
	        if (!session) {
	            globalThis.clearInterval(sessionDebugTickerTimer);
	            sessionDebugTickerTimer = null;
	            return;
	        }
	        Math.max(0, session.expiresAt - now);
	        logDebug('[lifecycle-event-session-tick]', {
	            sessionId: session.sessionId,
	            source: session.source,
	            lastActivityAt: session.lastActivityAt,
	            expiresAt: session.expiresAt});
	    }, intervalMs);
	}
	/**
	 * 디버깅용 ticker를 중지합니다.
	 */
	function stopSessionDebugTicker() {
	    if (sessionDebugTickerTimer === null)
	        return;
	    globalThis.clearInterval(sessionDebugTickerTimer);
	    sessionDebugTickerTimer = null;
	}
	/**
	 * 기존 세션을 활동으로 갱신합니다.
	 * - `lastActivityAt`, `expiresAt`를 업데이트합니다.
	 * - 만료 타이머를 재예약합니다.
	 */
	function touch(session, activityType, now) {
	    if (now === void 0) { now = Date.now(); }
	    var next = __assign$1(__assign$1({}, session), { lastActivityAt: now, expiresAt: now + LIFECYCLE_EVENT_SESSION_TIMEOUT_MS });
	    writeSession(next);
	    scheduleTimeout(next.sessionId, next.expiresAt);
	    logDebug('[lifecycle-event-session-touch]', { sessionId: next.sessionId, source: next.source});
	    return next;
	}
	/**
	 * 현재 탭에서 활성(만료되지 않은) 스크롤 세션을 반환합니다.
	 * - 없으면 `null`
	 */
	function getActiveScrollSession(now) {
	    if (now === void 0) { now = Date.now(); }
	    var session = readSession(now);
	    if (!session)
	        return null;
	    if (session.source !== 'scroll')
	        return null;
	    return session;
	}
	/**
	 * 스크롤 세션을 보장합니다.
	 * - 세션이 없으면 생성합니다(세션 생성 원천은 `scroll`로 고정).
	 * - 세션이 있으면 활동으로 갱신합니다.
	 *
	 * @param activityType 디버깅/분석용 활동 타입 문자열
	 * @param now 기준 시간(ms). 테스트/제어 목적
	 */
	function ensureScrollSession(activityType, now, context) {
	    if (now === void 0) { now = Date.now(); }
	    if (context === void 0) { context = {
	        currentPageUrl: null,
	        currentPagePath: null,
	        currentPageProductIdx: null,
	        currentPageProductCode: null,
	        productDetailHeight: null,
	        productDetailFoldHeight: null,
	    }; }
	    var existing = getActiveScrollSession(now);
	    if (existing) {
	        var hasCurrentProduct = Boolean(existing.currentPageProductIdx || existing.currentPageProductCode);
	        var hasNextProduct = Boolean(context.currentPageProductIdx || context.currentPageProductCode);
	        if (!hasCurrentProduct && hasNextProduct) {
	            // 세션 시작 시점에 상품 정보를 못 얻은 경우를 대비해, 이후 얻은 값을 보강한다.
	            writeSession(__assign$1(__assign$1({}, existing), { currentPageUrl: context.currentPageUrl || existing.currentPageUrl, currentPagePath: context.currentPagePath || existing.currentPagePath, currentPageProductIdx: context.currentPageProductIdx, currentPageProductCode: context.currentPageProductCode, productDetailHeight: context.productDetailHeight, productDetailFoldHeight: context.productDetailFoldHeight }));
	        }
	        if ((existing.productDetailHeight === null && context.productDetailHeight !== null) ||
	            (existing.productDetailFoldHeight === null && context.productDetailFoldHeight !== null)) {
	            writeSession(__assign$1(__assign$1({}, existing), { productDetailHeight: context.productDetailHeight, productDetailFoldHeight: context.productDetailFoldHeight }));
	        }
	        var activeAfterDecision = getActiveScrollSession(now);
	        return { session: touch(activeAfterDecision || existing, activityType, now), isNew: false };
	    }
	    var created = {
	        sessionId: generateEventId(),
	        source: 'scroll',
	        createdAt: now,
	        lastActivityAt: now,
	        expiresAt: now + LIFECYCLE_EVENT_SESSION_TIMEOUT_MS,
	        endedAt: null,
	        endReason: null,
	        currentPageUrl: context.currentPageUrl,
	        currentPagePath: context.currentPagePath,
	        currentPageProductIdx: context.currentPageProductIdx,
	        currentPageProductCode: context.currentPageProductCode,
	        productDetailHeight: context.productDetailHeight,
	        productDetailFoldHeight: context.productDetailFoldHeight,
	    };
	    writeSession(created);
	    scheduleTimeout(created.sessionId, created.expiresAt);
	    logDebug('[lifecycle-event-session-created]', {
	        sessionId: created.sessionId,
	        source: created.source});
	    return { session: created, isNew: true };
	}
	/**
	 * 활성 스크롤 세션이 있을 때만 활동으로 갱신합니다.
	 * - 세션이 없으면 새로 만들지 않습니다(요구사항: 세션은 스크롤로만 생성).
	 *
	 * @returns 갱신된 세션 또는 `null`
	 */
	function touchActiveScrollSession(activityType, now) {
	    if (now === void 0) { now = Date.now(); }
	    var existing = getActiveScrollSession(now);
	    if (!existing)
	        return null;
	    return touch(existing, activityType, now);
	}
	/**
	 * unload 대안 이벤트 리스너를 등록합니다(탭 단위).
	 * - `visibilitychange`, `pagehide`는 세션이 있을 때만 "활동"으로 보고 세션을 연장합니다.
	 * - `beforeunload`는 신뢰도가 낮으므로 옵션으로만 활성화합니다.
	 * - `enableDebugTicker`가 켜져 있으면 주기적으로 남은 만료 시간을 로그로 출력합니다.
	 *
	 * @returns cleanup 함수(리스너/타이머 해제)
	 */
	function startLifecycleEventSessionListeners(options) {
	    var _a;
	    if (options === void 0) { options = {}; }
	    if (typeof window === 'undefined' || typeof document === 'undefined') {
	        return function () { return undefined; };
	    }
	    var publishSignalIfSessionExists = function (eventName, extra) {
	        var _a, _b, _c;
	        var active = getActiveScrollSession();
	        if (!active)
	            return;
	        var metrics = measureViewportSnapshot();
	        var productDescriptionFold = getDetailFoldYn();
	        var previousEventType = getPreviousLifecycleEventType(active.sessionId);
	        publishBsEvent({
	            type: 'lifecycle_signal',
	            sessionId: active.sessionId,
	            timestamp: Date.now(),
	            payload: __assign$1({ eventName: eventName, appSessionId: active.sessionId, appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT, productCode: (_a = active.currentPageProductCode) !== null && _a !== void 0 ? _a : null, previousEventType: previousEventType, scrollTop: metrics.scrollTop, documentHeight: metrics.documentHeight, viewportWidth: metrics.viewportWidth, viewportHeight: metrics.viewportHeight, productDescriptionFold: productDescriptionFold, productDetailHeight: (_b = active.productDetailHeight) !== null && _b !== void 0 ? _b : null, productDetailFoldHeight: (_c = active.productDetailFoldHeight) !== null && _c !== void 0 ? _c : null, seemoreButtonPosition: null }, ({})),
	            meta: { http: { allowSend: true } },
	        });
	    };
	    var onVisibilityChange = function () {
	        var visibilityState = document.visibilityState;
	        var touched = touchActiveScrollSession("visibilitychange:".concat(visibilityState));
	        if (touched) {
	            var eventName = visibilityState === 'visible'
	                ? LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_VISIBLE
	                : LIFECYCLE_SIGNAL_EVENT_NAME.VISIBILITYCHANGE_HIDDEN;
	            publishSignalIfSessionExists(eventName);
	        }
	    };
	    var onPageHide = function (event) {
	        touchActiveScrollSession("pagehide:".concat(event.persisted ? 'bfcache' : 'normal'));
	        logDebug('[lifecycle-event-session] pagehide', { persisted: event.persisted});
	    };
	    var onBeforeUnload = function () {
	        var touched = touchActiveScrollSession('beforeunload');
	        if (touched) {
	            publishSignalIfSessionExists(LIFECYCLE_SIGNAL_EVENT_NAME.BEFOREUNLOAD);
	        }
	    };
	    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });
	    window.addEventListener('pagehide', onPageHide, { passive: true });
	    if (options.enableBeforeUnload) {
	        window.addEventListener('beforeunload', onBeforeUnload, { passive: true });
	    }
	    if (options.enableDebugTicker) {
	        startSessionDebugTicker((_a = options.debugTickerIntervalMs) !== null && _a !== void 0 ? _a : 1000);
	    }
	    return function () {
	        document.removeEventListener('visibilitychange', onVisibilityChange);
	        window.removeEventListener('pagehide', onPageHide);
	        if (options.enableBeforeUnload) {
	            window.removeEventListener('beforeunload', onBeforeUnload);
	        }
	        stopSessionDebugTicker();
	        if (sessionTimeoutTimer !== null) {
	            globalThis.clearTimeout(sessionTimeoutTimer);
	            sessionTimeoutTimer = null;
	        }
	    };
	}

	var DEFAULT_DEBOUNCE_MS = 250;
	var DEFAULT_DELTA_THRESHOLD = 50;
	var WIDGET_SELECTOR = '[doz_type="widget"]';
	var SEE_MORE_BUTTON_SELECTORS = [
	    '[onclick*="SITE_SHOP_DETAIL.showSeeMoreButton"]',
	    '[onclick*="SITE_SHOP_DETAIL.hideSeeMoreButton"]',
	    '[data-role="show-seemore"]',
	    '[data-role="hide-seemore"]',
	];
	function extractDataset(element) {
	    var data = {};
	    for (var _i = 0, _a = Object.entries(element.dataset); _i < _a.length; _i++) {
	        var _b = _a[_i], key = _b[0], value = _b[1];
	        if (value === undefined)
	            continue;
	        data[key] = value;
	    }
	    return data;
	}
	function buildWidgetSnapshot(element) {
	    var child = element.firstElementChild;
	    if (!child)
	        return null;
	    var attributes = {};
	    var dozType = element.getAttribute('doz_type');
	    if (dozType) {
	        attributes.doz_type = dozType;
	    }
	    if (element.id) {
	        attributes.id = element.id;
	    }
	    return {
	        widget: {
	            tagName: element.tagName,
	            attributes: attributes,
	        },
	        child: {
	            tagName: child.tagName,
	            className: child.className || '',
	            data: extractDataset(child),
	        },
	    };
	}
	function isElementVisible(element) {
	    var rect = element.getBoundingClientRect();
	    var viewportHeight = window.innerHeight || 0;
	    var viewportWidth = window.innerWidth || 0;
	    return rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth;
	}
	function resolveVisibleWidgetPayload(visibleWidgets) {
	    var widgets = Array.from(document.querySelectorAll(WIDGET_SELECTOR));
	    var snapshots = widgets
	        .filter(function (widget) { return visibleWidgets.has(widget) || isElementVisible(widget); })
	        .map(function (widget) { return buildWidgetSnapshot(widget); })
	        .filter(function (snapshot) { return Boolean(snapshot); });
	    if (snapshots.length === 0)
	        return null;
	    return JSON.stringify(snapshots);
	}
	function resolveSeemoreButtonElement() {
	    for (var _i = 0, SEE_MORE_BUTTON_SELECTORS_1 = SEE_MORE_BUTTON_SELECTORS; _i < SEE_MORE_BUTTON_SELECTORS_1.length; _i++) {
	        var selector = SEE_MORE_BUTTON_SELECTORS_1[_i];
	        var element = document.querySelector(selector);
	        if (element)
	            return element;
	    }
	    return null;
	}
	function resolveSeemoreButtonPosition(scrollTop) {
	    if (typeof document === 'undefined')
	        return null;
	    var element = resolveSeemoreButtonElement();
	    if (!element)
	        return null;
	    var rect = element.getBoundingClientRect();
	    var foldButtonDocTop = rect.top + (window.scrollY || window.pageYOffset || 0);
	    var viewportBottom = scrollTop + (window.innerHeight || 0);
	    if (viewportBottom < foldButtonDocTop)
	        return 'below';
	    if (viewportBottom > foldButtonDocTop)
	        return 'above';
	    return 'equal';
	}
	/**
	 * 현재 페이지의 스냅샷을 반환합니다.
	 * - 스크롤 세션 컨텍스트(상품 코드 등)로 사용됩니다.
	 * - 상품 상세가 아니면 product 관련 값은 `null`로 반환합니다.
	 */
	function getCurrentPageSnapshot() {
	    var _a, _b;
	    if (typeof window === 'undefined') {
	        return {
	            currentPageUrl: null,
	            currentPagePath: null,
	            currentPageProductIdx: null,
	            currentPageProductCode: null,
	            productDetailHeight: null,
	            productDetailFoldHeight: null,
	        };
	    }
	    var shopDetailPage = window.IMWEB_SHOP_DETAIL_PAGE;
	    var product = shopDetailPage === null || shopDetailPage === void 0 ? void 0 : shopDetailPage.product;
	    var detail = shopDetailPage === null || shopDetailPage === void 0 ? void 0 : shopDetailPage.detail;
	    var currentPageUrl = ((_a = window.location) === null || _a === void 0 ? void 0 : _a.href) || null;
	    var currentPagePath = ((_b = window.location) === null || _b === void 0 ? void 0 : _b.pathname) || null;
	    var currentPageProductIdx = product && product.idx !== undefined && product.idx !== null ? String(product.idx) : null;
	    var currentPageProductCode = product && product.code !== undefined && product.code !== null ? String(product.code) : null;
	    var productDetailHeight = (function () {
	        if (typeof (detail === null || detail === void 0 ? void 0 : detail.bodyHeightExpanded) === 'number')
	            return detail.bodyHeightExpanded;
	        if (typeof (detail === null || detail === void 0 ? void 0 : detail.bodyHeight) === 'number')
	            return detail.bodyHeight;
	        return null;
	    })();
	    var productDetailFoldHeight = typeof (detail === null || detail === void 0 ? void 0 : detail.bodyHeightCollapsed) === 'number' ? detail.bodyHeightCollapsed : null;
	    return {
	        currentPageUrl: currentPageUrl,
	        currentPagePath: currentPagePath,
	        currentPageProductIdx: currentPageProductIdx,
	        currentPageProductCode: currentPageProductCode,
	        productDetailHeight: productDetailHeight,
	        productDetailFoldHeight: productDetailFoldHeight,
	    };
	}
	/**
	 * 현재 뷰포트/문서 스크롤 관련 지표를 측정합니다.
	 * - `scrollTop`은 viewport 하단이 아닌, viewport 상단 기준 값입니다.
	 *
	 * @returns `{ scrollTop, documentHeight, viewportWidth, viewportHeight }`
	 */
	function measureViewportBottom() {
	    var _a, _b;
	    var viewportWidth = window.innerWidth || 0;
	    var viewportHeight = window.innerHeight || 0;
	    var scrollTop = window.scrollY || window.pageYOffset || 0;
	    var documentHeight = Math.max(((_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.scrollHeight) || 0, ((_b = document.body) === null || _b === void 0 ? void 0 : _b.scrollHeight) || 0, viewportHeight);
	    var roundedScrollTop = Math.round(scrollTop);
	    return { scrollTop: roundedScrollTop, documentHeight: documentHeight, viewportWidth: viewportWidth, viewportHeight: viewportHeight };
	}
	/**
	 * 스크롤 이벤트 페이로드를 HTTP로 전송합니다.
	 * - 가능한 경우 `sendBeacon`을 우선 사용하고, 실패 시 `fetch(keepalive: true)`로 폴백합니다.
	 *
	 * @param payload 전송할 페이로드
	 * @param endpoint 전송 엔드포인트
	 */
	/**
	 * 현재 페이지가 "상품 상세 페이지"로 보이는지 휴리스틱으로 판단합니다.
	 * - `window.IMWEB_SHOP_DETAIL_PAGE.product.idx|code` 존재 여부로 판정합니다.
	 *
	 * @returns 상품 상세로 보이면 `true`
	 */
	function isLikelyProductDetailPage() {
	    var shopDetailPage = window.IMWEB_SHOP_DETAIL_PAGE;
	    var product = shopDetailPage === null || shopDetailPage === void 0 ? void 0 : shopDetailPage.product;
	    // idx 혹은 code가 존재하면 상품 상세 페이지로 판단
	    return Boolean(product && (product.idx !== undefined || product.code !== undefined));
	}
	/**
	 * 상품 상세 페이지 중심의 스크롤 트래킹을 시작합니다.
	 * - 세션 생성 시 시작 이벤트(`lifecycle-start`)를 1회 발생시킵니다.
	 * - 스크롤이 멈춘 뒤 `debounceMs` 이후 방향에 따라 `scroll-bottom`/`scroll-top` 이벤트를 발생시킵니다.
	 * - `appSessionId`는 스크롤로 생성/갱신되는 세션 ID입니다.
	 * - 전송은 `sendEnabled` 및 ALB_ENDPOINT가 설정된 경우에만 수행합니다(기본은 콘솔 로그 중심).
	 *
	 * @param options 트래킹 옵션
	 * @returns cleanup 함수(리스너/타이머/핸들러 원복)
	 */
	function startProductDetailScrollTracking() {
	    var _this = this;
	    if (typeof window === 'undefined' || typeof document === 'undefined') {
	        return function () { return undefined; };
	    }
	    var debounceMs = DEFAULT_DEBOUNCE_MS;
	    var deltaThreshold = DEFAULT_DELTA_THRESHOLD;
	    var albEndpoint = resolveAlbEndpoint();
	    var shouldSend = Boolean(albEndpoint);
	    configureEventBus({
	        http: {
	            enabled: shouldSend,
	            endpoint: albEndpoint,
	        },
	    });
	    var lastDispatchedScrollTop = null;
	    var lastMeasuredScrollTop = null;
	    var pendingEventType = null;
	    var debounceTimer = null;
	    var visibleWidgets = new Set();
	    var widgetObserver = (function () {
	        if (!('IntersectionObserver' in window))
	            return null;
	        var observer = new IntersectionObserver(function (entries) {
	            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
	                var entry = entries_1[_i];
	                var target = entry.target;
	                if (entry.isIntersecting) {
	                    visibleWidgets.add(target);
	                }
	                else {
	                    visibleWidgets.delete(target);
	                }
	            }
	        });
	        document.querySelectorAll(WIDGET_SELECTOR).forEach(function (widget) {
	            observer.observe(widget);
	        });
	        return observer;
	    })();
	    /**
	     * 지정된 이벤트 타입으로 스크롤 이벤트를 생성/로그/전송합니다.
	     * - `scroll-bottom|scroll-top`은 세션을 생성/갱신합니다.
	     * - `lifecycle-start`는 "세션 생성 시점"의 시작 스냅샷 이벤트로 사용합니다.
	     *
	     * @param eventType 이벤트 타입
	     */
	    var dispatch = function (eventType) { return __awaiter(_this, void 0, void 0, function () {
	        var metrics, productDescriptionFold, element, delta, delta, currentPage, _a, ensuredSession, isNew, sessionId, productDetailHeight, productDetailFoldHeight, seemoreButtonPosition, timestampMs, previousEventType_1, startPayload, previousEventType, payload;
	        var _b, _c, _d, _e, _f, _g, _h;
	        return __generator(this, function (_j) {
	            metrics = measureViewportBottom();
	            productDescriptionFold = getDetailFoldYn();
	            element = resolveVisibleWidgetPayload(visibleWidgets);
	            if (eventType === LIFECYCLE_EVENT_TYPE.SCROLL_BOTTOM && lastDispatchedScrollTop !== null) {
	                delta = metrics.scrollTop - lastDispatchedScrollTop;
	                if (delta <= 0)
	                    return [2 /*return*/];
	                if (delta < deltaThreshold)
	                    return [2 /*return*/];
	            }
	            if (eventType === LIFECYCLE_EVENT_TYPE.SCROLL_TOP && lastDispatchedScrollTop !== null) {
	                delta = metrics.scrollTop - lastDispatchedScrollTop;
	                if (delta >= 0)
	                    return [2 /*return*/];
	                if (Math.abs(delta) < deltaThreshold)
	                    return [2 /*return*/];
	            }
	            lastDispatchedScrollTop = metrics.scrollTop;
	            currentPage = getCurrentPageSnapshot();
	            _a = ensureScrollSession("scroll:".concat(eventType), Date.now(), currentPage), ensuredSession = _a.session, isNew = _a.isNew;
	            sessionId = (_b = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.sessionId) !== null && _b !== void 0 ? _b : null;
	            productDetailHeight = (_d = (_c = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.productDetailHeight) !== null && _c !== void 0 ? _c : currentPage.productDetailHeight) !== null && _d !== void 0 ? _d : null;
	            productDetailFoldHeight = (_f = (_e = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.productDetailFoldHeight) !== null && _e !== void 0 ? _e : currentPage.productDetailFoldHeight) !== null && _f !== void 0 ? _f : null;
	            seemoreButtonPosition = resolveSeemoreButtonPosition(metrics.scrollTop);
	            timestampMs = Date.now();
	            if (eventType !== LIFECYCLE_EVENT_TYPE.LIFECYCLE_START && isNew) {
	                previousEventType_1 = getPreviousLifecycleEventType(sessionId);
	                startPayload = {
	                    eventType: LIFECYCLE_EVENT_TYPE.LIFECYCLE_START,
	                    appSessionId: sessionId,
	                    appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT,
	                    productCode: (_g = currentPage.currentPageProductCode) !== null && _g !== void 0 ? _g : null,
	                    previousEventType: previousEventType_1,
	                    scrollTop: metrics.scrollTop,
	                    documentHeight: metrics.documentHeight,
	                    viewportWidth: metrics.viewportWidth,
	                    viewportHeight: metrics.viewportHeight,
	                    productDescriptionFold: productDescriptionFold,
	                    productDetailHeight: productDetailHeight,
	                    productDetailFoldHeight: productDetailFoldHeight,
	                    seemoreButtonPosition: seemoreButtonPosition,
	                    element: element,
	                };
	                isEventBusEnabledForDebug();
	                publishBsEvent({
	                    type: 'scroll_event',
	                    sessionId: sessionId,
	                    timestamp: timestampMs,
	                    payload: startPayload,
	                });
	            }
	            previousEventType = getPreviousLifecycleEventType(sessionId);
	            payload = {
	                eventType: eventType,
	                appSessionId: sessionId,
	                appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT,
	                productCode: (_h = currentPage.currentPageProductCode) !== null && _h !== void 0 ? _h : null,
	                previousEventType: previousEventType,
	                scrollTop: metrics.scrollTop,
	                documentHeight: metrics.documentHeight,
	                viewportWidth: metrics.viewportWidth,
	                viewportHeight: metrics.viewportHeight,
	                productDescriptionFold: productDescriptionFold,
	                productDetailHeight: productDetailHeight,
	                productDetailFoldHeight: productDetailFoldHeight,
	                seemoreButtonPosition: seemoreButtonPosition,
	                element: element,
	            };
	            isEventBusEnabledForDebug();
	            publishBsEvent({
	                type: 'scroll_event',
	                sessionId: sessionId,
	                timestamp: timestampMs,
	                payload: payload,
	            });
	            return [2 /*return*/];
	        });
	    }); };
	    /**
	     * 페이지 이탈/리로드/탭 종료 등의 시점에 세션을 종료합니다.
	     * - 실제 전송/스택 누적은 이벤트 버스에서 `lifecycle_signal`로 처리됩니다.
	     *
	     * @param event pagehide 이벤트
	     */
	    var onPageHide = function (event) {
	        if (pendingInitialLifecycleStart) {
	            pendingInitialLifecycleStart = false;
	        }
	        endActiveScrollSession("pagehide", Date.now(), {
	            markPendingNavigation: true,
	        });
	        // reason에 persisted 정보를 담고 싶으면 navigate event로 확장 가능
	        logDebug('[scroll-tracking] pagehide 감지', { persisted: event.persisted });
	    };
	    /**
	     * 스크롤 이벤트 핸들러.
	     * - 스크롤 방향을 판단해 pending 이벤트 타입을 설정하고,
	     * - `debounceMs` 이후 실제 dispatch를 수행합니다.
	     */
	    var handleScroll = function () {
	        var metrics = measureViewportBottom();
	        if (lastMeasuredScrollTop !== null) {
	            var delta = metrics.scrollTop - lastMeasuredScrollTop;
	            if (delta > 0) {
	                pendingEventType = LIFECYCLE_EVENT_TYPE.SCROLL_BOTTOM;
	            }
	            else if (delta < 0) {
	                pendingEventType = LIFECYCLE_EVENT_TYPE.SCROLL_TOP;
	            }
	            else {
	                pendingEventType = null;
	            }
	        }
	        lastMeasuredScrollTop = metrics.scrollTop;
	        if (debounceTimer !== null) {
	            window.clearTimeout(debounceTimer);
	        }
	        debounceTimer = window.setTimeout(function () {
	            debounceTimer = null;
	            if (!pendingEventType)
	                return;
	            void dispatch(pendingEventType);
	        }, debounceMs);
	    };
	    // 첫 스크롤 이벤트에서도 방향을 판단할 수 있도록 기준값을 초기화
	    lastMeasuredScrollTop = measureViewportBottom().scrollTop;
	    // 초기 로드가 hidden/pagehide 상태일 때 lifecycle-start를 지연하기 위한 플래그
	    var pendingInitialLifecycleStart = false;
	    var tryDispatchInitialLifecycleStart = function () { return __awaiter(_this, void 0, void 0, function () {
	        var currentPage, isNew;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    if (document.visibilityState === 'hidden') {
	                        pendingInitialLifecycleStart = true;
	                        return [2 /*return*/];
	                    }
	                    currentPage = getCurrentPageSnapshot();
	                    isNew = ensureScrollSession("scroll:".concat(LIFECYCLE_EVENT_TYPE.LIFECYCLE_START), Date.now(), currentPage).isNew;
	                    if (!isNew)
	                        return [2 /*return*/];
	                    return [4 /*yield*/, dispatch(LIFECYCLE_EVENT_TYPE.LIFECYCLE_START)];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    }); };
	    var onInitialVisibilityChange = function () {
	        if (!pendingInitialLifecycleStart)
	            return;
	        if (document.visibilityState !== 'visible')
	            return;
	        pendingInitialLifecycleStart = false;
	        void tryDispatchInitialLifecycleStart();
	    };
	    // 초기 진입 시, "새 세션이 생성되는 경우에만" lifecycle-start(시작 스냅샷)을 발행합니다.
	    void tryDispatchInitialLifecycleStart();
	    window.addEventListener('scroll', handleScroll, { passive: true });
	    window.addEventListener('pagehide', onPageHide, { passive: true });
	    document.addEventListener('visibilitychange', onInitialVisibilityChange, { passive: true });
	    var onProdDetailSeeMore = function (raw) {
	        var _a, _b, _c, _d, _e, _f, _g, _h;
	        var event = raw;
	        var expanded = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.expanded;
	        if (typeof expanded !== 'boolean')
	            return;
	        var metrics = measureViewportBottom();
	        var element = resolveVisibleWidgetPayload(visibleWidgets);
	        var currentPage = getCurrentPageSnapshot();
	        var _j = ensureScrollSession('click:prod_detail_seemore', Date.now(), currentPage), ensuredSession = _j.session, isNew = _j.isNew;
	        var sessionId = (_b = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.sessionId) !== null && _b !== void 0 ? _b : null;
	        var timestampMs = Date.now();
	        var productDescriptionFold = getDetailFoldYn();
	        var productDetailHeight = (_d = (_c = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.productDetailHeight) !== null && _c !== void 0 ? _c : currentPage.productDetailHeight) !== null && _d !== void 0 ? _d : null;
	        var productDetailFoldHeight = (_f = (_e = ensuredSession === null || ensuredSession === void 0 ? void 0 : ensuredSession.productDetailFoldHeight) !== null && _e !== void 0 ? _e : currentPage.productDetailFoldHeight) !== null && _f !== void 0 ? _f : null;
	        var seemoreButtonPosition = resolveSeemoreButtonPosition(metrics.scrollTop);
	        if (isNew) {
	            var previousEventType_2 = getPreviousLifecycleEventType(sessionId);
	            var startPayload = {
	                eventType: LIFECYCLE_EVENT_TYPE.LIFECYCLE_START,
	                appSessionId: sessionId,
	                appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT,
	                productCode: (_g = currentPage.currentPageProductCode) !== null && _g !== void 0 ? _g : null,
	                previousEventType: previousEventType_2,
	                scrollTop: metrics.scrollTop,
	                documentHeight: metrics.documentHeight,
	                viewportWidth: metrics.viewportWidth,
	                viewportHeight: metrics.viewportHeight,
	                productDescriptionFold: productDescriptionFold,
	                productDetailHeight: productDetailHeight,
	                productDetailFoldHeight: productDetailFoldHeight,
	                seemoreButtonPosition: seemoreButtonPosition,
	                element: element,
	            };
	            publishBsEvent({
	                type: 'scroll_event',
	                sessionId: sessionId,
	                timestamp: timestampMs,
	                payload: startPayload,
	            });
	        }
	        var previousEventType = getPreviousLifecycleEventType(sessionId);
	        var payload = {
	            appSessionId: sessionId,
	            appSessionKey: APP_SESSION_KEY.LIFECYCLE_EVENT,
	            productCode: (_h = currentPage.currentPageProductCode) !== null && _h !== void 0 ? _h : null,
	            previousEventType: previousEventType,
	            scrollTop: metrics.scrollTop,
	            documentHeight: metrics.documentHeight,
	            viewportWidth: metrics.viewportWidth,
	            viewportHeight: metrics.viewportHeight,
	            productDescriptionFold: productDescriptionFold,
	            productDetailHeight: productDetailHeight,
	            productDetailFoldHeight: productDetailFoldHeight,
	            seemoreButtonPosition: seemoreButtonPosition,
	        };
	        publishBsEvent({
	            type: 'prod_detail_seemore',
	            sessionId: sessionId,
	            timestamp: timestampMs,
	            payload: payload,
	            meta: { http: { allowSend: true } },
	        });
	    };
	    document.addEventListener('imweb:prod_detail:seemore', onProdDetailSeeMore, { passive: true });
	    return function () {
	        window.removeEventListener('scroll', handleScroll);
	        window.removeEventListener('pagehide', onPageHide);
	        document.removeEventListener('visibilitychange', onInitialVisibilityChange);
	        document.removeEventListener('imweb:prod_detail:seemore', onProdDetailSeeMore);
	        if (widgetObserver) {
	            widgetObserver.disconnect();
	        }
	        if (debounceTimer !== null) {
	            window.clearTimeout(debounceTimer);
	        }
	    };
	}
	function startScrollBottomTracking() {
	    if (typeof window === 'undefined' || typeof document === 'undefined') {
	        return function () { return undefined; };
	    }
	    var stopTracking = null;
	    var refreshTrackingState = function () {
	        var shouldTrack = isLikelyProductDetailPage();
	        if (shouldTrack) {
	            if (!stopTracking) {
	                stopTracking = startProductDetailScrollTracking();
	            }
	            return;
	        }
	        if (stopTracking) {
	            stopTracking();
	            stopTracking = null;
	            endActiveScrollSession('navigate', Date.now());
	        }
	    };
	    refreshTrackingState();
	    var onNavigate = function () {
	        refreshTrackingState();
	    };
	    var onShopDetailPage = function (raw) {
	        var _a, _b;
	        var event = raw;
	        var product = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.product;
	        var detail = (_b = event === null || event === void 0 ? void 0 : event.detail) === null || _b === void 0 ? void 0 : _b.detail;
	        if (product || detail) {
	            var current = window.IMWEB_SHOP_DETAIL_PAGE;
	            window.IMWEB_SHOP_DETAIL_PAGE = {
	                product: product !== null && product !== void 0 ? product : current === null || current === void 0 ? void 0 : current.product,
	                detail: detail !== null && detail !== void 0 ? detail : current === null || current === void 0 ? void 0 : current.detail,
	            };
	        }
	        refreshTrackingState();
	    };
	    window.addEventListener('navigate', onNavigate);
	    window.addEventListener('imweb:navigate', onNavigate);
	    window.addEventListener('imweb:shop_detail_page', onShopDetailPage);
	    return function () {
	        window.removeEventListener('navigate', onNavigate);
	        window.removeEventListener('imweb:navigate', onNavigate);
	        window.removeEventListener('imweb:shop_detail_page', onShopDetailPage);
	        if (stopTracking) {
	            stopTracking();
	            stopTracking = null;
	        }
	    };
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

	function getReferrer() {
	    var referrer = document.referrer.trim();
	    return referrer === '' ? '@direct' : referrer;
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
	    return Number.isNaN(value) ? fallback : value;
	}

	/**
	 * 화면 해상도를 가져오는 함수
	 * @returns [width, height] 형태의 튜플. 값을 얻을 수 없는 경우 null
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
	        var dimensions = [parseDimension(s.width), parseDimension(s.height)];
	        // 너비와 높이를 내림차순으로 정렬 (일반적으로 너비가 더 큼)
	        dimensions.sort(function (a, b) {
	            if (a === null)
	                return 1;
	            if (b === null)
	                return -1;
	            return b - a;
	        });
	        return dimensions;
	    }
	    catch (error) {
	        console.error('Error getting screen resolution:', error);
	        return [null, null];
	    }
	}

	function nullifyEmptyValue(value) {
	    return value === undefined || value === '' ? null : value;
	}

	/**
	 * SDK 환경 정보를 콘솔에 출력합니다.
	 * 개발 환경에서 자동으로 호출됩니다.
	 */
	function logSDKInfo() {
	    var _a;
	    // 브라우저 환경 정보
	    if (typeof window !== 'undefined') {
	        var _b = extractSiteUnitFromSdkJwt((_a = window.SDK_JWT) !== null && _a !== void 0 ? _a : null); _b.siteCode; _b.unitCode;
	    }
	}
	var stopScrollTracking = null;
	var stopUserBehaviorSessionListeners = null;
	function ensureScrollTrackingStarted() {
	    if (stopScrollTracking) {
	        return stopScrollTracking;
	    }
	    stopScrollTracking = startScrollBottomTracking();
	    return stopScrollTracking;
	}
	function teardownScrollTracking() {
	    if (!stopScrollTracking) {
	        return;
	    }
	    stopScrollTracking();
	    stopScrollTracking = null;
	}
	function ensureUserBehaviorSessionListenersStarted(options) {
	    if (stopUserBehaviorSessionListeners) {
	        return stopUserBehaviorSessionListeners;
	    }
	    stopUserBehaviorSessionListeners = startLifecycleEventSessionListeners({
	        enableBeforeUnload: options.enableBeforeUnload,
	        enableDebugTicker: options.enableDebugTicker,
	        debugTickerIntervalMs: 1000,
	    });
	    return stopUserBehaviorSessionListeners;
	}
	function teardownUserBehaviorSessionListeners() {
	    if (!stopUserBehaviorSessionListeners) {
	        return;
	    }
	    stopUserBehaviorSessionListeners();
	    stopUserBehaviorSessionListeners = null;
	}
	function resolveStoredUserData() {
	    if (typeof window === 'undefined')
	        return null;
	    var cookiesEnabled = navigator.cookieEnabled;
	    var cookieSource = cookiesEnabled ? getCookie(BRANDSCOPE_COOKIE_NAMES.USER_INFO) : null;
	    var localStorageSource = getLocalStorage(BRANDSCOPE_LOCAL_STORAGE_KEYS.USER_INFO);
	    var sessionStorageSource = getSessionStorage(BRANDSCOPE_SESSION_STORAGE_KEYS.USER_INFO);
	    if (!cookieSource && !localStorageSource && !sessionStorageSource)
	        return null;
	    var merged = __assign$1(__assign$1(__assign$1({}, (cookieSource !== null && cookieSource !== void 0 ? cookieSource : {})), (localStorageSource !== null && localStorageSource !== void 0 ? localStorageSource : {})), (sessionStorageSource !== null && sessionStorageSource !== void 0 ? sessionStorageSource : {}));
	    var deviceId = typeof merged.deviceId === 'string' ? merged.deviceId : null;
	    return __assign$1(__assign$1({}, merged), { deviceId: deviceId });
	}
	// 스토리지 데이터를 병합한 뒤 런타임 브라우저 정보와 함께 반환합니다.
	function buildStorageSnapshot() {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
	    var browserInfo = Bowser.getParser(navigator.userAgent).getResult();
	    var currentUrl = window.location.href;
	    var browserData = {
	        platform: nullifyEmptyValue(browserInfo.platform.type),
	        os: nullifyEmptyValue(browserInfo.os.name),
	        language: nullifyEmptyValue(navigator.language),
	        browserName: nullifyEmptyValue(browserInfo.browser.name),
	        browserVersion: nullifyEmptyValue(browserInfo.browser.version),
	        userAgent: nullifyEmptyValue(navigator.userAgent),
	        path: extractPath(currentUrl),
	    };
	    var stored = resolveStoredUserData();
	    var storageData = {
	        deviceId: (_a = stored === null || stored === void 0 ? void 0 : stored.deviceId) !== null && _a !== void 0 ? _a : null,
	        deviceIdCreatedAt: (_b = stored === null || stored === void 0 ? void 0 : stored.deviceIdCreatedAt) !== null && _b !== void 0 ? _b : null,
	        siteCode: (_c = stored === null || stored === void 0 ? void 0 : stored.siteCode) !== null && _c !== void 0 ? _c : null,
	        unitCode: (_d = stored === null || stored === void 0 ? void 0 : stored.unitCode) !== null && _d !== void 0 ? _d : null,
	        referrer: (_e = stored === null || stored === void 0 ? void 0 : stored.referrer) !== null && _e !== void 0 ? _e : null,
	        initialReferrer: (_f = stored === null || stored === void 0 ? void 0 : stored.initialReferrer) !== null && _f !== void 0 ? _f : null,
	        initialReferrerDomain: (_g = stored === null || stored === void 0 ? void 0 : stored.initialReferrerDomain) !== null && _g !== void 0 ? _g : null,
	        platform: (_h = stored === null || stored === void 0 ? void 0 : stored.platform) !== null && _h !== void 0 ? _h : null,
	        sdkJwt: (_j = stored === null || stored === void 0 ? void 0 : stored.sdkJwt) !== null && _j !== void 0 ? _j : null,
	        utmLandingUrl: (_k = stored === null || stored === void 0 ? void 0 : stored.utmLandingUrl) !== null && _k !== void 0 ? _k : null,
	        utmSource: (_l = stored === null || stored === void 0 ? void 0 : stored.utmSource) !== null && _l !== void 0 ? _l : null,
	        utmMedium: (_m = stored === null || stored === void 0 ? void 0 : stored.utmMedium) !== null && _m !== void 0 ? _m : null,
	        utmCampaign: (_o = stored === null || stored === void 0 ? void 0 : stored.utmCampaign) !== null && _o !== void 0 ? _o : null,
	        utmTerm: (_p = stored === null || stored === void 0 ? void 0 : stored.utmTerm) !== null && _p !== void 0 ? _p : null,
	        utmContent: (_q = stored === null || stored === void 0 ? void 0 : stored.utmContent) !== null && _q !== void 0 ? _q : null,
	        utmUpdatedTime: (_r = stored === null || stored === void 0 ? void 0 : stored.utmUpdatedTime) !== null && _r !== void 0 ? _r : null,
	        updatedAt: (_s = stored === null || stored === void 0 ? void 0 : stored.updatedAt) !== null && _s !== void 0 ? _s : null,
	    };
	    return { storageData: storageData, browserData: browserData, currentUrl: currentUrl };
	}
	/**
	 * BrandScope 시작점인 함수입니다.
	 * @returns
	 */
	function initialize() {
	    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
	    return __awaiter(this, void 0, void 0, function () {
	        var screen, _q, storageData, browserData, currentUrl, now, basePayload;
	        return __generator(this, function (_r) {
	            screen = getScreenResolution();
	            _q = buildStorageSnapshot(), storageData = _q.storageData, browserData = _q.browserData, currentUrl = _q.currentUrl;
	            now = new Date();
	            basePayload = {
	                // storageData
	                deviceId: storageData.deviceId,
	                siteCode: (_a = storageData.siteCode) !== null && _a !== void 0 ? _a : null,
	                unitCode: (_b = storageData.unitCode) !== null && _b !== void 0 ? _b : null,
	                utmSource: (_c = storageData.utmSource) !== null && _c !== void 0 ? _c : null,
	                utmMedium: (_d = storageData.utmMedium) !== null && _d !== void 0 ? _d : null,
	                utmCampaign: (_e = storageData.utmCampaign) !== null && _e !== void 0 ? _e : null,
	                utmContent: (_f = storageData.utmContent) !== null && _f !== void 0 ? _f : null,
	                utmTerm: (_g = storageData.utmTerm) !== null && _g !== void 0 ? _g : null,
	                utmLandingUrl: (_h = storageData.utmLandingUrl) !== null && _h !== void 0 ? _h : null,
	                utmUpdatedTime: (_j = storageData.utmUpdatedTime) !== null && _j !== void 0 ? _j : null,
	                initialReferrer: (_k = storageData.initialReferrer) !== null && _k !== void 0 ? _k : '@direct',
	                initialReferrerDomain: (_l = storageData.initialReferrerDomain) !== null && _l !== void 0 ? _l : '@direct',
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
	                sdkJwt: (_m = storageData.sdkJwt) !== null && _m !== void 0 ? _m : null,
	            };
	            recordMpaNavigation((_o = basePayload.previousURL) !== null && _o !== void 0 ? _o : null, (_p = basePayload.currentUrl) !== null && _p !== void 0 ? _p : null);
	            return [2 /*return*/, basePayload];
	        });
	    });
	}
	var AnayticsSDK = {
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
	        return "1.0.15";
	    },
	    /**
	     * 현재 SDK 환경 정보를 객체로 반환합니다.
	     */
	    getSDKInfo: function () {
	        return {
	            version: "1.0.15",
	            environment: "production",
	            apiEndpoint: "https://behavior-tracking-event-gateway.imweb.me/api/v1/event",
	            buildTime: "2026-06-25T16:35:47+09:00",
	            isDev: false,
	        };
	    },
	    dataLayer: dataLayer,
	    stopScrollTracking: function () {
	        teardownScrollTracking();
	    },
	    stopUserBehaviorSession: function () {
	        teardownUserBehaviorSessionListeners();
	    },
	    forceLifecycleSessionTimeout: function () {
	        return forceTimeoutActiveScrollSession();
	    },
	    init: function (options) {
	        if (options === void 0) { options = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.setDebug(options.debug || false);
	                        return [4 /*yield*/, initialize()];
	                    case 1:
	                        _a.sent();
	                        ensureUserBehaviorSessionListenersStarted({ enableBeforeUnload: true, enableDebugTicker: Boolean(options.debug) });
	                        if (options.scrollTracking !== false) {
	                            ensureScrollTrackingStarted();
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    },
	};
	(function () {
	    if (typeof window === 'undefined') {
	        return;
	    }
	    var attachDebugGlobals = function () {
	        var globalWindow = window;
	        globalWindow.A7S_FORCE_SESSION_TIMEOUT = function () {
	            AnayticsSDK.forceLifecycleSessionTimeout();
	        };
	    };
	    attachDebugGlobals();
	    var defaultInitOptions = { scrollTracking: true };
	    var initialized = false;
	    var initRequested = false;
	    var initOptions;
	    var shopDetailReady = false;
	    var deployStrategyReady = false;
	    var eventBusFeatureReady = false;
	    var deployStrategyInitStarted = false;
	    var getShopDetailSnapshot = function () {
	        var shopDetailPage = window.IMWEB_SHOP_DETAIL_PAGE;
	        var product = shopDetailPage === null || shopDetailPage === void 0 ? void 0 : shopDetailPage.product;
	        var hasIdx = (product === null || product === void 0 ? void 0 : product.idx) !== undefined && (product === null || product === void 0 ? void 0 : product.idx) !== null;
	        var hasCode = (product === null || product === void 0 ? void 0 : product.code) !== undefined && (product === null || product === void 0 ? void 0 : product.code) !== null;
	        return { product: product, ready: Boolean(product && (hasIdx || hasCode)) };
	    };
	    var hasStoredUserInfo = function () {
	        try {
	            return Boolean(getLocalStorage(BRANDSCOPE_LOCAL_STORAGE_KEYS.USER_INFO) ||
	                getSessionStorage(BRANDSCOPE_SESSION_STORAGE_KEYS.USER_INFO));
	        }
	        catch (_a) {
	            return false;
	        }
	    };
	    var attemptInit = function () {
	        if (initialized)
	            return;
	        if (!shopDetailReady || !initRequested)
	            return;
	        if (!deployStrategyReady || !eventBusFeatureReady)
	            return;
	        initialized = true;
	        var resolvedOptions = __assign$1(__assign$1({}, defaultInitOptions), (initOptions !== null && initOptions !== void 0 ? initOptions : {}));
	        void AnayticsSDK.init(resolvedOptions);
	    };
	    var markDeployStrategyReady = function (strategy) {
	        if (deployStrategyReady)
	            return;
	        deployStrategyReady = true;
	        void ensureEventBusFeatureFlagsReady(strategy)
	            .then(function () {
	            eventBusFeatureReady = true;
	        })
	            .catch(function () {
	            eventBusFeatureReady = true;
	        })
	            .finally(function () {
	            attemptInit();
	        });
	    };
	    var startDeployStrategyCheck = function () {
	        if (deployStrategyInitStarted)
	            return;
	        deployStrategyInitStarted = true;
	        // 배포 전략이 초기화되면 SDK 초기화를 허용한다.
	        var strategy = resolveDeployStrategy();
	        if (isDeployStrategyInitialized(strategy)) {
	            markDeployStrategyReady(strategy);
	            return;
	        }
	        var onDeployStrategyInit = function (raw) {
	            var _a, _b;
	            var event = raw;
	            var initializedStrategy = (_b = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.instance) !== null && _b !== void 0 ? _b : resolveDeployStrategy();
	            if (!isDeployStrategyInitialized(initializedStrategy)) {
	                return;
	            }
	            window.removeEventListener('imweb:deploy_strategy_init', onDeployStrategyInit);
	            markDeployStrategyReady(initializedStrategy);
	        };
	        window.addEventListener('imweb:deploy_strategy_init', onDeployStrategyInit);
	    };
	    var onSdkInit = function (raw) {
	        var _a;
	        var event = raw;
	        initOptions = (_a = event.detail) !== null && _a !== void 0 ? _a : {};
	        initRequested = true;
	        attemptInit();
	    };
	    var onShopDetailPage = function (raw) {
	        var _a, _b;
	        var event = raw;
	        var product = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.product;
	        var detail = (_b = event === null || event === void 0 ? void 0 : event.detail) === null || _b === void 0 ? void 0 : _b.detail;
	        if (product || detail) {
	            var current = window.IMWEB_SHOP_DETAIL_PAGE;
	            window.IMWEB_SHOP_DETAIL_PAGE = {
	                product: product !== null && product !== void 0 ? product : current === null || current === void 0 ? void 0 : current.product,
	                detail: detail !== null && detail !== void 0 ? detail : current === null || current === void 0 ? void 0 : current.detail,
	            };
	        }
	        shopDetailReady = getShopDetailSnapshot().ready;
	        attemptInit();
	    };
	    shopDetailReady = getShopDetailSnapshot().ready;
	    initRequested = hasStoredUserInfo();
	    startDeployStrategyCheck();
	    window.addEventListener('brandscope-sdk-init', onSdkInit);
	    window.addEventListener('imweb:shop_detail_page', onShopDetailPage);
	    attemptInit();
	})();

	// The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
	/** Not documented, out of Semantic Versioning, usage is at your own risk */
	// export { getScreenFrame } from './sources/screen_frame'

	exports.default = AnayticsSDK;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
