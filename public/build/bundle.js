
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function descending(a, b) {
      return a == null || b == null ? NaN
        : b < a ? -1
        : b > a ? 1
        : b >= a ? 0
        : NaN;
    }

    function bisector(f) {
      let compare1, compare2, delta;

      // If an accessor is specified, promote it to a comparator. In this case we
      // can test whether the search value is (self-) comparable. We can’t do this
      // for a comparator (except for specific, known comparators) because we can’t
      // tell if the comparator is symmetric, and an asymmetric comparator can’t be
      // used to test whether a single value is comparable.
      if (f.length !== 2) {
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
        delta = (d, x) => f(d) - x;
      } else {
        compare1 = f === ascending || f === descending ? f : zero$1;
        compare2 = f;
        delta = f;
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function zero$1() {
      return 0;
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
    class Adder {
      constructor() {
        this._partials = new Float64Array(32);
        this._n = 0;
      }
      add(x) {
        const p = this._partials;
        let i = 0;
        for (let j = 0; j < this._n && j < 32; j++) {
          const y = p[j],
            hi = x + y,
            lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
          if (lo) p[i++] = lo;
          x = hi;
        }
        p[i] = x;
        this._n = i + 1;
        return this;
      }
      valueOf() {
        const p = this._partials;
        let n = this._n, x, y, lo, hi = 0;
        if (n > 0) {
          hi = p[--n];
          while (n > 0) {
            x = hi;
            y = p[--n];
            hi = x + y;
            lo = y - (hi - x);
            if (lo) break;
          }
          if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
            y = lo * 2;
            x = hi + y;
            if (y == x - hi) hi = x;
          }
        }
        return hi;
      }
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function* flatten(arrays) {
      for (const array of arrays) {
        yield* array;
      }
    }

    function merge(arrays) {
      return Array.from(flatten(arrays));
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$2(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer$1() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$2) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$2, rescale()) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format$1;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format$1 = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format$1(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$2, identity$2),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$2, identity$2)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow() {
      var scale = powish(transformer$1());

      scale.copy = function() {
        return copy(scale, pow()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt$1() {
      return pow.apply(null, arguments).exponent(0.5);
    }

    const themes = {
      'light': {
        'text': '#222',
        'muted': '#707070',
        'pale': '#f0f0f0',
        'background': '#fff'
      },
      'dark': {
        'text': '#fff',
        'muted': '#bbb',
        'pale': '#333',
        'background': '#222'
      },
    	'lightblue': {
    		'text': '#206095',
        'muted': '#707070',
        'pale': '#f0f0f0',
    		'background': 'rgb(188, 207, 222)'
    	},
    	'darkblue': {
        'text': '#fff',
        'muted': '#bbb',
        'pale': '#333',
        'background': '#206095'
    	}
    };

    const colors = ['#ca0020cc','#f4a582cc','#cccccc','#92c5decc','#0571b0cc'];

    let urls = {
    	data: 'https://bothness.github.io/geo-data/csv/census2011_lad2020.csv'
    };

    const questions = [
    	{
    		type: 'slider',
    		key: 'population_value_change_all',
    		label: 'population percentage change',
    		unit: '%',
    		text: 'How has the population in {place} changed in the last 10 years?',
    		linkText: 'Learn more about population estimates here',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
    		formatVal: 1
    	},
    	{
    		type: 'higher_lower',
    		key: 'population_value_change_all',
    		label: 'population change from 2001',
    		unit: '%',
    		text: 'Has the population in {place} grown more or less than {neighbour} since 2001?'
    	},
    	{
    		type: 'higher_lower',
    		key: "population_value_2011_all",
    		label: "number of people",
    		unit: " people",
    		text: "Is the population in {place} higher or lower than {neighbour}?"
    	},
    	{
    		type: 'slider',
    		key: 'population_value_2011_all',
    		label: 'number of people',
    		unit: ' people',
    		text: 'What is overall population of {place}? (should this be a "rank" or replaced with the people per hectare?)',
    		linkText: 'Learn more about population estimates here',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
    		minVal: 0,
    		maxVal: 1100000,
    		startVal: 500000,
    		formatVal: -3
    	},
    	{
    		type: 'slider',
    		key: 'population_perc_2011_male',
    		label: 'proportion of people who are male',
    		unit: '%',
    		text: 'What percentage of the population in {place} are Male?',
    		//could also do: What is the percentage point difference between men and women in {place}? (negative indicates more women than men - should probably better label the axis)
    		linkText: 'Learn more about households by tenure here',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020',
    		formatVal: 1
    	},
    	{
    		type: 'slider',
    		key: 'tenure_perc_2011_owned',
    		label: 'proportion of people who own their home',
    		unit: '%',
    		text: 'What percentage of people in {place} own their own home? (this could also be phrased in terms of renting, should maybe explain the other categories? could include follow up question of how has this changed in the last 10 years?)',
    		linkText: 'Learn more about dwellings and households by tenure here',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
    	},
    	{
    		type: 'slider',
    		key: 'agemed_value_2011_all',
    		label: 'average (median) age',
    		unit: ' years',
    		text: 'What is the average (median) age of people in {place}?',
    		linkText: 'Learn more about the median age of people across England and Wales here',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates'
    	},
    	{
    		type: 'slider',
    		key: 'density_value_2011_all',
    		label: 'population density (people per hectare)',
    		unit: ' people',
    		text: 'What is the population density of {place} in people per hectare?',
    		scale: sqrt$1
    	},
    	{
    		type: 'slider',
    		key: 'age10yr_perc_2001_0-9',
    		label: 'proportion of people aged under 10',
    		unit: '%',
    		text: 'What proportion of people in {place} are aged under 10?'
    	},
    	{
    		type: 'slider',
    		key: 'age10yr_perc_2001_70plus',
    		label: 'proportion of people aged over 70',
    		unit: '%',
    		text: 'What proportion of people in {place} are aged 70 or over?'
    	}
    ];

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsv(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsv(",");

    var csvParse = csv.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    async function getData(url) {
    	let res = await fetch(url);
    	let str = await res.text();
    	let data = csvParse(str, autoType);
    	return data;
    }

    function getQuantile(value, breaks) {
    	let brk = 0;
    	for (let i = 0; i < (breaks.length - 1); i ++) {
    		if (value >= breaks[i]) brk = i;
    	}
    	return brk;
    }

    function distinct(d, i, arr) {
    	return arr.indexOf(d) ==  i;
    }

    function adjectify(quintile) {
    	let quin = +quintile;
    	if (quin == 0) {
    		return 'much lower than';
    	} else if (quin == 1) {
    		return 'slightly lower than';
    	} else if (quin == 2) {
    		return 'around the';
    	} else if (quin == 3) {
    		return 'slightly higher than';
    	} else {
    		return 'much higher than';
    	}
    }

    const format = (dp) => (val) => {
    	let multiplier = Math.pow(10, dp);
    	let rounded = Math.round(val * multiplier) / multiplier;
    	return rounded.toLocaleString(undefined, {
      minimumFractionDigits: dp > 0 ? dp : 0,
      maximumFractionDigits: dp > 0 ? dp : 0
    });
    };

    function higherLower(val, text = ["higher than", "lower than", "the same as"]) {
    	if (val > 0) {
    		return text[0]
    	} else if (val < 0) {
    		return text[1]
    	} else {
    		return text[2]
    	}
    }

    /* src/Filler.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/Filler.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "middle svelte-1odf9sx");
    			toggle_class(div, "center", /*center*/ ctx[1]);
    			toggle_class(div, "col-medium", !/*wide*/ ctx[2]);
    			toggle_class(div, "col-wide", /*wide*/ ctx[2]);
    			toggle_class(div, "height-full", !/*short*/ ctx[3]);
    			toggle_class(div, "short", /*short*/ ctx[3]);
    			add_location(div, file$7, 19, 1, 399);
    			set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			attr_dev(section, "class", "svelte-1odf9sx");
    			add_location(section, file$7, 18, 0, 299);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*center*/ 2) {
    				toggle_class(div, "center", /*center*/ ctx[1]);
    			}

    			if (dirty & /*wide*/ 4) {
    				toggle_class(div, "col-medium", !/*wide*/ ctx[2]);
    			}

    			if (dirty & /*wide*/ 4) {
    				toggle_class(div, "col-wide", /*wide*/ ctx[2]);
    			}

    			if (dirty & /*short*/ 8) {
    				toggle_class(div, "height-full", !/*short*/ ctx[3]);
    			}

    			if (dirty & /*short*/ 8) {
    				toggle_class(div, "short", /*short*/ ctx[3]);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "color", themes[/*theme*/ ctx[0]]['text']);
    			}

    			if (!current || dirty & /*theme*/ 1) {
    				set_style(section, "background-color", themes[/*theme*/ ctx[0]]['background']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filler', slots, ['default']);
    	let { theme = getContext('theme') } = $$props;
    	let { center = true } = $$props;
    	let { wide = false } = $$props;
    	let { short = false } = $$props;
    	const writable_props = ['theme', 'center', 'wide', 'short'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filler> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('wide' in $$props) $$invalidate(2, wide = $$props.wide);
    		if ('short' in $$props) $$invalidate(3, short = $$props.short);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		themes,
    		getContext,
    		theme,
    		center,
    		wide,
    		short
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('center' in $$props) $$invalidate(1, center = $$props.center);
    		if ('wide' in $$props) $$invalidate(2, wide = $$props.wide);
    		if ('short' in $$props) $$invalidate(3, short = $$props.short);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, center, wide, short, $$scope, slots];
    }

    class Filler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { theme: 0, center: 1, wide: 2, short: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filler",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get theme() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wide() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wide(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get short() {
    		throw new Error("<Filler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set short(value) {
    		throw new Error("<Filler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/Icon.svelte generated by Svelte v3.48.0 */

    const file$6 = "src/ui/Icon.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path;
    	let path_d_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*paths*/ ctx[4][/*type*/ ctx[0]]);
    			add_location(path, file$6, 39, 2, 2923);
    			attr_dev(svg, "class", "icon svelte-nk8itm");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "style", /*style*/ ctx[3]);
    			toggle_class(svg, "margin", /*margin*/ ctx[2]);
    			toggle_class(svg, "noclick", !/*clickable*/ ctx[1]);
    			add_location(svg, file$6, 29, 0, 2739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type*/ 1 && path_d_value !== (path_d_value = /*paths*/ ctx[4][/*type*/ ctx[0]])) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(svg, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*margin*/ 4) {
    				toggle_class(svg, "margin", /*margin*/ ctx[2]);
    			}

    			if (dirty & /*clickable*/ 2) {
    				toggle_class(svg, "noclick", !/*clickable*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { type = "compass" } = $$props;
    	let { rotation = 0 } = $$props;
    	let { position = "inline" } = $$props;
    	let { clickable = false } = $$props;
    	let { margin = false } = $$props;

    	const paths = {
    		compass: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-10 1H8v-2h4V8l4 4-4 4v-3z",
    		info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z",
    		chart: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z",
    		share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
    		chevron: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
    		full: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
    		full_exit: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z",
    		shuffle: "M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    		replay: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z",
    		save: "M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67 2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z",
    		tick: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    		cross: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
    		arrow: "M5,13h11.2l-2.9,2.9c-0.4,0.4-0.4,1,0,1.4s1,0.4,1.4,0l4.6-4.6c0.4-0.4,0.4-1,0-1.4l-4.6-4.6c-0.4-0.4-1-0.4-1.4,0c0,0,0,0,0,0c-0.4,0.4-0.4,1,0,1.4l2.9,2.9H5c-0.6,0-1,0.4-1,1S4.4,13,5,13z",
    		plus: "M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z",
    		minus: "M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"
    	};

    	let style = `transform: translate(0, 15%) scale(1.5) rotate(${-rotation}deg);`;
    	if (["left", "right"].includes(position)) style += ` position: absolute; ${position}: 10px;`;
    	const writable_props = ['type', 'rotation', 'position', 'clickable', 'margin'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('rotation' in $$props) $$invalidate(5, rotation = $$props.rotation);
    		if ('position' in $$props) $$invalidate(6, position = $$props.position);
    		if ('clickable' in $$props) $$invalidate(1, clickable = $$props.clickable);
    		if ('margin' in $$props) $$invalidate(2, margin = $$props.margin);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		rotation,
    		position,
    		clickable,
    		margin,
    		paths,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('rotation' in $$props) $$invalidate(5, rotation = $$props.rotation);
    		if ('position' in $$props) $$invalidate(6, position = $$props.position);
    		if ('clickable' in $$props) $$invalidate(1, clickable = $$props.clickable);
    		if ('margin' in $$props) $$invalidate(2, margin = $$props.margin);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, clickable, margin, style, paths, rotation, position];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			type: 0,
    			rotation: 5,
    			position: 6,
    			clickable: 1,
    			margin: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get type() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clickable() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clickable(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get margin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set margin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Tooltip.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/Tooltip.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let style_transform = `translateX(${/*w*/ ctx[4] / /*x*/ ctx[1] + (/*x*/ ctx[1] - /*xPos*/ ctx[5])}px)`;
    	let div1_resize_listener;
    	let style_top = `${/*y*/ ctx[2]}px`;
    	let style_left = `${/*xPos*/ ctx[5]}px`;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "caret svelte-wmcn1s");
    			toggle_class(div0, "caret-bottom", /*pos*/ ctx[3] == 'bottom');
    			toggle_class(div0, "caret-top", /*pos*/ ctx[3] == 'top');
    			set_style(div0, "transform", style_transform, false);
    			add_location(div0, file$5, 16, 2, 395);
    			attr_dev(div1, "class", "tooltip svelte-wmcn1s");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[7].call(div1));
    			toggle_class(div1, "tooltip-top", /*pos*/ ctx[3] == "top");
    			set_style(div1, "top", style_top, false);
    			set_style(div1, "left", style_left, false);
    			add_location(div1, file$5, 14, 0, 267);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[7].bind(div1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*pos*/ 8) {
    				toggle_class(div0, "caret-bottom", /*pos*/ ctx[3] == 'bottom');
    			}

    			if (dirty & /*pos*/ 8) {
    				toggle_class(div0, "caret-top", /*pos*/ ctx[3] == 'top');
    			}

    			if (dirty & /*w, x, xPos*/ 50 && style_transform !== (style_transform = `translateX(${/*w*/ ctx[4] / /*x*/ ctx[1] + (/*x*/ ctx[1] - /*xPos*/ ctx[5])}px)`)) {
    				set_style(div0, "transform", style_transform, false);
    			}

    			if (dirty & /*pos*/ 8) {
    				toggle_class(div1, "tooltip-top", /*pos*/ ctx[3] == "top");
    			}

    			if (dirty & /*y*/ 4 && style_top !== (style_top = `${/*y*/ ctx[2]}px`)) {
    				set_style(div1, "top", style_top, false);
    			}

    			if (dirty & /*xPos*/ 32 && style_left !== (style_left = `${/*xPos*/ ctx[5]}px`)) {
    				set_style(div1, "left", style_left, false);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const xPad = 4;

    function instance$5($$self, $$props, $$invalidate) {
    	let xPos;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, []);
    	let { title } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { width } = $$props;
    	let { pos = "bottom" } = $$props;
    	let w;
    	const writable_props = ['title', 'x', 'y', 'width', 'pos'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	function div1_elementresize_handler() {
    		w = this.clientWidth;
    		$$invalidate(4, w);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('pos' in $$props) $$invalidate(3, pos = $$props.pos);
    	};

    	$$self.$capture_state = () => ({ title, x, y, width, pos, w, xPad, xPos });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('width' in $$props) $$invalidate(6, width = $$props.width);
    		if ('pos' in $$props) $$invalidate(3, pos = $$props.pos);
    		if ('w' in $$props) $$invalidate(4, w = $$props.w);
    		if ('xPos' in $$props) $$invalidate(5, xPos = $$props.xPos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*w, x, width*/ 82) {
    			$$invalidate(5, xPos = w && x + w / 2 > width - xPad
    			? width - w / 2 - xPad
    			: w && x - w / 2 < 0 + xPad ? w / 2 + xPad : x);
    		}
    	};

    	return [title, x, y, pos, w, xPos, width, div1_elementresize_handler];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0, x: 1, y: 2, width: 6, pos: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'title'");
    		}

    		if (/*x*/ ctx[1] === undefined && !('x' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !('y' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'y'");
    		}

    		if (/*width*/ ctx[6] === undefined && !('width' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'width'");
    		}
    	}

    	get title() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pos() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const tooltip = (element) => {
    	let title;
    	let tooltipComponent;
    	
    	function mouseOver(event) {
    		// NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
    		// remember to set it back on `mouseleave`
    		title = element.getAttribute('title');
    		element.removeAttribute('title');

    		let tooltip_pos = element.dataset.tooltipPos;
    		let top = tooltip_pos && tooltip_pos == "top" ? true : false;
        let body = document.body.getBoundingClientRect();
    		let pos = element.getBoundingClientRect();
    		let y = top ? pos.top : pos.bottom;
    		let x = (pos.left + pos.right) / 2;

    		tooltipComponent = new Tooltip({
    			props: {
    				title: title,
    				x: x,
    				y: y,
    				width: body.width,
    				pos: top ? "top" : "bottom"
    			},
    			target: document.body,
    		});
    	}
    	function mouseOut() {
    		tooltipComponent.$destroy();
    		// NOTE: restore the `title` attribute
    		element.setAttribute('title', title);
    	}
    	
    	element.addEventListener('mouseover', mouseOver);
      	element.addEventListener('mouseout', mouseOut);
    	
    	return {
    		destroy() {
    			if (tooltipComponent) tooltipComponent.$destroy();
    			element.removeEventListener('mouseover', mouseOver);
    			element.removeEventListener('mouseout', mouseOut);
    		}
    	}
    };

    function handle(node) {
      const onDown = getOnDown(node);

      node.addEventListener("touchstart", onDown);
      node.addEventListener("mousedown", onDown);
      return {
        destroy() {
          node.removeEventListener("touchstart", onDown);
          node.removeEventListener("mousedown", onDown);
        }
      };
    }

    function getOnDown(node) {
      const onMove = getOnMove(node);

      return function (e) {
        e.preventDefault();
        node.dispatchEvent(new CustomEvent("dragstart"));

        const moveevent = "touches" in e ? "touchmove" : "mousemove";
        const upevent = "touches" in e ? "touchend" : "mouseup";

        document.addEventListener(moveevent, onMove);
        document.addEventListener(upevent, onUp);

        function onUp(e) {
          e.stopPropagation();

          document.removeEventListener(moveevent, onMove);
          document.removeEventListener(upevent, onUp);

          node.dispatchEvent(new CustomEvent("dragend"));
        }  };
    }

    function getOnMove(node) {
      const track = node.parentNode;

      return function (e) {
        const { left, width } = track.getBoundingClientRect();
        const clickOffset = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clickPos = Math.min(Math.max((clickOffset - left) / width, 0), 1) || 0;
        node.dispatchEvent(new CustomEvent("drag", { detail: clickPos }));
      };
    }

    /* src/Thumb.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/Thumb.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let div1_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "thumb-content svelte-5my1ts");
    			toggle_class(div0, "active", /*active*/ ctx[1]);
    			add_location(div0, file$4, 15, 2, 432);
    			attr_dev(div1, "class", "thumb svelte-5my1ts");
    			attr_dev(div1, "style", div1_style_value = `left: ${/*pos*/ ctx[0] * 100}%;`);
    			add_location(div1, file$4, 8, 0, 187);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(handle.call(null, div1)),
    					listen_dev(div1, "dragstart", /*dragstart_handler*/ ctx[5], false, false, false),
    					listen_dev(div1, "drag", /*drag_handler*/ ctx[6], false, false, false),
    					listen_dev(div1, "dragend", /*dragend_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*active*/ 2) {
    				toggle_class(div0, "active", /*active*/ ctx[1]);
    			}

    			if (!current || dirty & /*pos*/ 1 && div1_style_value !== (div1_style_value = `left: ${/*pos*/ ctx[0] * 100}%;`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Thumb', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let active;
    	let { pos } = $$props;
    	const writable_props = ['pos'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thumb> was created with unknown prop '${key}'`);
    	});

    	const dragstart_handler = () => ($$invalidate(1, active = true), dispatch('active', true));
    	const drag_handler = ({ detail: v }) => $$invalidate(0, pos = v);
    	const dragend_handler = () => ($$invalidate(1, active = false), dispatch('active', false));

    	$$self.$$set = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		handle,
    		dispatch,
    		pos,
    		active
    	});

    	$$self.$inject_state = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		pos,
    		active,
    		dispatch,
    		$$scope,
    		slots,
    		dragstart_handler,
    		drag_handler,
    		dragend_handler
    	];
    }

    class Thumb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { pos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thumb",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pos*/ ctx[0] === undefined && !('pos' in props)) {
    			console.warn("<Thumb> was created without expected prop 'pos'");
    		}
    	}

    	get pos() {
    		throw new Error("<Thumb>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<Thumb>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Slider.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/Slider.svelte";
    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (66:0) {#if range}
    function create_if_block_5$1(ctx) {
    	let input;
    	let input_value_value;
    	let input_name_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*value*/ ctx[0][1];
    			attr_dev(input, "name", input_name_value = /*name*/ ctx[1][1]);
    			attr_dev(input, "class", "svelte-11uhgxx");
    			add_location(input, file$3, 66, 2, 1783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input_value_value !== (input_value_value = /*value*/ ctx[0][1]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty[0] & /*name*/ 2 && input_name_value !== (input_name_value = /*name*/ ctx[1][1])) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(66:0) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (70:1) {#if showBar}
    function create_if_block_4$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "progress svelte-11uhgxx");
    			attr_dev(div, "style", /*progress*/ ctx[16]);
    			add_location(div, file$3, 70, 2, 1882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*progress*/ 65536) {
    				attr_dev(div, "style", /*progress*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(70:1) {#if showBar}",
    		ctx
    	});

    	return block;
    }

    // (75:1) {#if disabled && Array.isArray(data)}
    function create_if_block_2$1(ctx) {
    	let t0;
    	let div;
    	let div_title_value;
    	let style_left = `${/*pos*/ ctx[14][0] * 100}%`;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*data*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*selected*/ ctx[9] && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "point guess svelte-11uhgxx");
    			attr_dev(div, "title", div_title_value = "Your guess " + /*format*/ ctx[5](/*value*/ ctx[0]) + /*unit*/ ctx[13]);
    			attr_dev(div, "data-tooltip-pos", "top");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$3, 78, 1, 2172);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(tooltip.call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, labelKey, format, valueKey, unit, min, max*/ 11576) {
    				each_value_1 = /*data*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*format, value, unit*/ 8225 && div_title_value !== (div_title_value = "Your guess " + /*format*/ ctx[5](/*value*/ ctx[0]) + /*unit*/ ctx[13])) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (dirty[0] & /*pos*/ 16384 && style_left !== (style_left = `${/*pos*/ ctx[14][0] * 100}%`)) {
    				set_style(div, "left", style_left, false);
    			}

    			if (/*selected*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(75:1) {#if disabled && Array.isArray(data)}",
    		ctx
    	});

    	return block;
    }

    // (76:1) {#each data as d}
    function create_each_block_1(ctx) {
    	let div;
    	let div_title_value;
    	let style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "point svelte-11uhgxx");
    			attr_dev(div, "title", div_title_value = "" + (/*d*/ ctx[32][/*labelKey*/ ctx[11]] + " " + /*format*/ ctx[5](/*d*/ ctx[32][/*valueKey*/ ctx[10]]) + /*unit*/ ctx[13]));
    			attr_dev(div, "data-tooltip-pos", "top");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$3, 76, 1, 1998);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(tooltip.call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, labelKey, format, valueKey, unit*/ 11552 && div_title_value !== (div_title_value = "" + (/*d*/ ctx[32][/*labelKey*/ ctx[11]] + " " + /*format*/ ctx[5](/*d*/ ctx[32][/*valueKey*/ ctx[10]]) + /*unit*/ ctx[13]))) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (dirty[0] & /*data, valueKey, min, max*/ 1304 && style_left !== (style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`)) {
    				set_style(div, "left", style_left, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(76:1) {#each data as d}",
    		ctx
    	});

    	return block;
    }

    // (80:1) {#if selected}
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let each_value = [/*data*/ ctx[8].find(/*func*/ ctx[21])];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 1; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, idKey, selected, labelKey, format, valueKey, unit, min, max*/ 16184) {
    				each_value = [/*data*/ ctx[8].find(/*func*/ ctx[21])];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 1; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 1; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(80:1) {#if selected}",
    		ctx
    	});

    	return block;
    }

    // (81:1) {#each [data.find(d => d[idKey] == selected)] as d}
    function create_each_block$1(ctx) {
    	let div;
    	let div_title_value;
    	let style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "point selected svelte-11uhgxx");
    			attr_dev(div, "title", div_title_value = "" + (/*d*/ ctx[32][/*labelKey*/ ctx[11]] + " " + /*format*/ ctx[5](/*d*/ ctx[32][/*valueKey*/ ctx[10]]) + /*unit*/ ctx[13]));
    			attr_dev(div, "data-tooltip-pos", "top");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$3, 81, 1, 2374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(tooltip.call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, idKey, selected, labelKey, format, valueKey, unit*/ 16160 && div_title_value !== (div_title_value = "" + (/*d*/ ctx[32][/*labelKey*/ ctx[11]] + " " + /*format*/ ctx[5](/*d*/ ctx[32][/*valueKey*/ ctx[10]]) + /*unit*/ ctx[13]))) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (dirty[0] & /*data, idKey, selected, valueKey, min, max*/ 5912 && style_left !== (style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`)) {
    				set_style(div, "left", style_left, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(81:1) {#each [data.find(d => d[idKey] == selected)] as d}",
    		ctx
    	});

    	return block;
    }

    // (86:1) {#if !disabled}
    function create_if_block$2(ctx) {
    	let thumb;
    	let updating_pos;
    	let t;
    	let if_block_anchor;
    	let current;

    	function thumb_pos_binding(value) {
    		/*thumb_pos_binding*/ ctx[22](value);
    	}

    	let thumb_props = {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*pos*/ ctx[14][0] !== void 0) {
    		thumb_props.pos = /*pos*/ ctx[14][0];
    	}

    	thumb = new Thumb({ props: thumb_props, $$inline: true });
    	binding_callbacks.push(() => bind(thumb, 'pos', thumb_pos_binding));
    	thumb.$on("active", /*active_handler*/ ctx[23]);
    	let if_block = /*range*/ ctx[2] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(thumb.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(thumb, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const thumb_changes = {};

    			if (dirty[0] & /*$$scope*/ 67108864) {
    				thumb_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_pos && dirty[0] & /*pos*/ 16384) {
    				updating_pos = true;
    				thumb_changes.pos = /*pos*/ ctx[14][0];
    				add_flush_callback(() => updating_pos = false);
    			}

    			thumb.$set(thumb_changes);

    			if (/*range*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*range*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thumb.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thumb.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thumb, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(86:1) {#if !disabled}",
    		ctx
    	});

    	return block;
    }

    // (89:12)          
    function fallback_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "thumb svelte-11uhgxx");
    			add_location(div, file$3, 89, 8, 2701);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(89:12)          ",
    		ctx
    	});

    	return block;
    }

    // (88:22)        
    function fallback_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[26], null);
    	const default_slot_or_fallback = default_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[26], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(88:22)        ",
    		ctx
    	});

    	return block;
    }

    // (87:2) <Thumb bind:pos={pos[0]} on:active={({ detail: v }) => active = v}>
    function create_default_slot_1(ctx) {
    	let current;
    	const left_slot_template = /*#slots*/ ctx[20].left;
    	const left_slot = create_slot(left_slot_template, ctx, /*$$scope*/ ctx[26], get_left_slot_context);
    	const left_slot_or_fallback = left_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (left_slot_or_fallback) left_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (left_slot_or_fallback) {
    				left_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (left_slot) {
    				if (left_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						left_slot,
    						left_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(left_slot_template, /*$$scope*/ ctx[26], dirty, get_left_slot_changes),
    						get_left_slot_context
    					);
    				}
    			} else {
    				if (left_slot_or_fallback && left_slot_or_fallback.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					left_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (left_slot_or_fallback) left_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(87:2) <Thumb bind:pos={pos[0]} on:active={({ detail: v }) => active = v}>",
    		ctx
    	});

    	return block;
    }

    // (94:2) {#if range}
    function create_if_block_1$1(ctx) {
    	let thumb;
    	let updating_pos;
    	let current;

    	function thumb_pos_binding_1(value) {
    		/*thumb_pos_binding_1*/ ctx[24](value);
    	}

    	let thumb_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*pos*/ ctx[14][1] !== void 0) {
    		thumb_props.pos = /*pos*/ ctx[14][1];
    	}

    	thumb = new Thumb({ props: thumb_props, $$inline: true });
    	binding_callbacks.push(() => bind(thumb, 'pos', thumb_pos_binding_1));
    	thumb.$on("active", /*active_handler_1*/ ctx[25]);

    	const block = {
    		c: function create() {
    			create_component(thumb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(thumb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const thumb_changes = {};

    			if (dirty[0] & /*$$scope*/ 67108864) {
    				thumb_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_pos && dirty[0] & /*pos*/ 16384) {
    				updating_pos = true;
    				thumb_changes.pos = /*pos*/ ctx[14][1];
    				add_flush_callback(() => updating_pos = false);
    			}

    			thumb.$set(thumb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thumb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thumb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(thumb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(94:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (97:14)            
    function fallback_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "thumb svelte-11uhgxx");
    			add_location(div, file$3, 97, 10, 2897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(97:14)            ",
    		ctx
    	});

    	return block;
    }

    // (96:25)          
    function fallback_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[26], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[26], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(96:25)          ",
    		ctx
    	});

    	return block;
    }

    // (95:4) <Thumb bind:pos={pos[1]} on:active={({ detail: v }) => active = v}>
    function create_default_slot(ctx) {
    	let current;
    	const right_slot_template = /*#slots*/ ctx[20].right;
    	const right_slot = create_slot(right_slot_template, ctx, /*$$scope*/ ctx[26], get_right_slot_context);
    	const right_slot_or_fallback = right_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (right_slot_or_fallback) right_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (right_slot_or_fallback) {
    				right_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (right_slot) {
    				if (right_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					update_slot_base(
    						right_slot,
    						right_slot_template,
    						ctx,
    						/*$$scope*/ ctx[26],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
    						: get_slot_changes(right_slot_template, /*$$scope*/ ctx[26], dirty, get_right_slot_changes),
    						get_right_slot_context
    					);
    				}
    			} else {
    				if (right_slot_or_fallback && right_slot_or_fallback.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
    					right_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(right_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(right_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (right_slot_or_fallback) right_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(95:4) <Thumb bind:pos={pos[1]} on:active={({ detail: v }) => active = v}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let input;
    	let input_value_value;
    	let input_name_value;
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let show_if = /*disabled*/ ctx[6] && Array.isArray(/*data*/ ctx[8]);
    	let t3;
    	let current;
    	let if_block0 = /*range*/ ctx[2] && create_if_block_5$1(ctx);
    	let if_block1 = /*showBar*/ ctx[7] && create_if_block_4$1(ctx);
    	let if_block2 = show_if && create_if_block_2$1(ctx);
    	let if_block3 = !/*disabled*/ ctx[6] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*value*/ ctx[0][0];
    			attr_dev(input, "name", input_name_value = /*name*/ ctx[1][0]);
    			attr_dev(input, "class", "svelte-11uhgxx");
    			add_location(input, file$3, 64, 0, 1713);
    			attr_dev(div, "class", "track svelte-11uhgxx");
    			add_location(div, file$3, 68, 0, 1845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t3);
    			if (if_block3) if_block3.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*value*/ 1 && input_value_value !== (input_value_value = /*value*/ ctx[0][0]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (!current || dirty[0] & /*name*/ 2 && input_name_value !== (input_name_value = /*name*/ ctx[1][0])) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (/*range*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*showBar*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*disabled, data*/ 320) show_if = /*disabled*/ ctx[6] && Array.isArray(/*data*/ ctx[8]);

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!/*disabled*/ ctx[6]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*disabled*/ 64) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function checkPos(pos) {
    	return [Math.min(...pos), Math.max(...pos)];
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let _step;
    	let progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, ['default','left','right']);
    	const dispatch = createEventDispatcher();
    	let { name = [] } = $$props;
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { format = d => d } = $$props;
    	let { dp = null } = $$props;
    	let { step = null } = $$props;
    	let { value = [min, max] } = $$props;
    	let { order = false } = $$props;
    	let { disabled = false } = $$props;
    	let { showBar = false } = $$props;
    	let { data = null } = $$props;
    	let { selected = null } = $$props;
    	let { valueKey = "value" } = $$props;
    	let { labelKey = "name" } = $$props;
    	let { idKey = "code" } = $$props;
    	let { unit = "" } = $$props;
    	let pos;
    	let active = false;

    	function setValue(pos) {
    		const offset = min % _step;
    		const width = max - min;
    		let newvalue = pos.map(v => min + v * width).map(v => Math.round((v - offset) / _step) * _step + offset);
    		$$invalidate(0, value = Array.isArray(value) ? newvalue : newvalue[0]);
    		dispatch("input", value);
    	}

    	function setPos(value) {
    		$$invalidate(14, pos = Array.isArray(value)
    		? value.map(v => Math.min(Math.max(v, min), max)).map(v => (v - min) / (max - min))
    		: [(value - min) / (max - min), 0]);
    	}

    	function clamp() {
    		setPos(value);
    		setValue(pos);
    	}

    	const writable_props = [
    		'name',
    		'range',
    		'min',
    		'max',
    		'format',
    		'dp',
    		'step',
    		'value',
    		'order',
    		'disabled',
    		'showBar',
    		'data',
    		'selected',
    		'valueKey',
    		'labelKey',
    		'idKey',
    		'unit'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	const func = d => d[idKey] == selected;

    	function thumb_pos_binding(value) {
    		if ($$self.$$.not_equal(pos[0], value)) {
    			pos[0] = value;
    			((($$invalidate(14, pos), $$invalidate(2, range)), $$invalidate(19, order)), $$invalidate(15, active));
    		}
    	}

    	const active_handler = ({ detail: v }) => $$invalidate(15, active = v);

    	function thumb_pos_binding_1(value) {
    		if ($$self.$$.not_equal(pos[1], value)) {
    			pos[1] = value;
    			((($$invalidate(14, pos), $$invalidate(2, range)), $$invalidate(19, order)), $$invalidate(15, active));
    		}
    	}

    	const active_handler_1 = ({ detail: v }) => $$invalidate(15, active = v);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('range' in $$props) $$invalidate(2, range = $$props.range);
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('format' in $$props) $$invalidate(5, format = $$props.format);
    		if ('dp' in $$props) $$invalidate(17, dp = $$props.dp);
    		if ('step' in $$props) $$invalidate(18, step = $$props.step);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('order' in $$props) $$invalidate(19, order = $$props.order);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('showBar' in $$props) $$invalidate(7, showBar = $$props.showBar);
    		if ('data' in $$props) $$invalidate(8, data = $$props.data);
    		if ('selected' in $$props) $$invalidate(9, selected = $$props.selected);
    		if ('valueKey' in $$props) $$invalidate(10, valueKey = $$props.valueKey);
    		if ('labelKey' in $$props) $$invalidate(11, labelKey = $$props.labelKey);
    		if ('idKey' in $$props) $$invalidate(12, idKey = $$props.idKey);
    		if ('unit' in $$props) $$invalidate(13, unit = $$props.unit);
    		if ('$$scope' in $$props) $$invalidate(26, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tooltip,
    		Thumb,
    		dispatch,
    		name,
    		range,
    		min,
    		max,
    		format,
    		dp,
    		step,
    		value,
    		order,
    		disabled,
    		showBar,
    		data,
    		selected,
    		valueKey,
    		labelKey,
    		idKey,
    		unit,
    		pos,
    		active,
    		setValue,
    		setPos,
    		checkPos,
    		clamp,
    		_step,
    		progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('range' in $$props) $$invalidate(2, range = $$props.range);
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('format' in $$props) $$invalidate(5, format = $$props.format);
    		if ('dp' in $$props) $$invalidate(17, dp = $$props.dp);
    		if ('step' in $$props) $$invalidate(18, step = $$props.step);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('order' in $$props) $$invalidate(19, order = $$props.order);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('showBar' in $$props) $$invalidate(7, showBar = $$props.showBar);
    		if ('data' in $$props) $$invalidate(8, data = $$props.data);
    		if ('selected' in $$props) $$invalidate(9, selected = $$props.selected);
    		if ('valueKey' in $$props) $$invalidate(10, valueKey = $$props.valueKey);
    		if ('labelKey' in $$props) $$invalidate(11, labelKey = $$props.labelKey);
    		if ('idKey' in $$props) $$invalidate(12, idKey = $$props.idKey);
    		if ('unit' in $$props) $$invalidate(13, unit = $$props.unit);
    		if ('pos' in $$props) $$invalidate(14, pos = $$props.pos);
    		if ('active' in $$props) $$invalidate(15, active = $$props.active);
    		if ('_step' in $$props) _step = $$props._step;
    		if ('progress' in $$props) $$invalidate(16, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*step, dp*/ 393216) {
    			_step = step ? step : dp != undefined ? Math.pow(10, -dp) : 1;
    		}

    		if ($$self.$$.dirty[0] & /*range, order, active, pos*/ 573444) {
    			if (range && order && active) $$invalidate(14, pos = checkPos(pos));
    		}

    		if ($$self.$$.dirty[0] & /*active, pos*/ 49152) {
    			if (active) setValue(pos);
    		}

    		if ($$self.$$.dirty[0] & /*active, value*/ 32769) {
    			if (!active) setPos(value);
    		}

    		if ($$self.$$.dirty[0] & /*min, max*/ 24) {
    			(clamp());
    		}

    		if ($$self.$$.dirty[0] & /*range, pos*/ 16388) {
    			$$invalidate(16, progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], range ? pos[1] : pos[0]) * 100}%;
  `);
    		}
    	};

    	return [
    		value,
    		name,
    		range,
    		min,
    		max,
    		format,
    		disabled,
    		showBar,
    		data,
    		selected,
    		valueKey,
    		labelKey,
    		idKey,
    		unit,
    		pos,
    		active,
    		progress,
    		dp,
    		step,
    		order,
    		slots,
    		func,
    		thumb_pos_binding,
    		active_handler,
    		thumb_pos_binding_1,
    		active_handler_1,
    		$$scope
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				name: 1,
    				range: 2,
    				min: 3,
    				max: 4,
    				format: 5,
    				dp: 17,
    				step: 18,
    				value: 0,
    				order: 19,
    				disabled: 6,
    				showBar: 7,
    				data: 8,
    				selected: 9,
    				valueKey: 10,
    				labelKey: 11,
    				idKey: 12,
    				unit: 13
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get name() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get range() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set range(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dp() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dp(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get order() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showBar() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showBar(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueKey() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueKey(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelKey() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelKey(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idKey() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idKey(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SliderWrapper.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/SliderWrapper.svelte";

    // (15:4) {#if !answers[questionNum].set}
    function create_if_block$1(ctx) {
    	let output;
    	let t0_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].val) + "";
    	let t0;
    	let t1_value = /*questions*/ ctx[1][/*questionNum*/ ctx[2]].unit + "";
    	let t1;

    	const block = {
    		c: function create() {
    			output = element("output");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			attr_dev(output, "class", "range-value svelte-18h44ss");
    			set_style(output, "left", (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].val - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) / (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) * 100 + "%");
    			add_location(output, file$2, 15, 6, 395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, output, anchor);
    			append_dev(output, t0);
    			append_dev(output, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*f, answers, questionNum*/ 37 && t0_value !== (t0_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].val) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*questions, questionNum*/ 6 && t1_value !== (t1_value = /*questions*/ ctx[1][/*questionNum*/ ctx[2]].unit + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*answers, questionNum*/ 5) {
    				set_style(output, "left", (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].val - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) / (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) * 100 + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(output);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(15:4) {#if !answers[questionNum].set}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let t0;
    	let div0;
    	let t1_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max) + "";
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let t6_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].avg) + "";
    	let t6;
    	let t7;
    	let slider;
    	let updating_value;
    	let current;
    	let if_block = !/*answers*/ ctx[0][/*questionNum*/ ctx[2]].set && create_if_block$1(ctx);

    	function slider_value_binding(value) {
    		/*slider_value_binding*/ ctx[6](value);
    	}

    	let slider_props = {
    		min: /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min,
    		max: /*answers*/ ctx[0][/*questionNum*/ ctx[2]].max,
    		data: /*data*/ ctx[3],
    		selected: /*place*/ ctx[4].code,
    		valueKey: /*questions*/ ctx[1][/*questionNum*/ ctx[2]].key,
    		disabled: /*answers*/ ctx[0][/*questionNum*/ ctx[2]].set,
    		unit: /*questions*/ ctx[1][/*questionNum*/ ctx[2]].unit,
    		format: /*f*/ ctx[5],
    		dp: /*questions*/ ctx[1][/*questionNum*/ ctx[2]].formatVal
    	};

    	if (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].val !== void 0) {
    		slider_props.value = /*answers*/ ctx[0][/*questionNum*/ ctx[2]].val;
    	}

    	slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, 'value', slider_value_binding));

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			t5 = text("Average ");
    			t6 = text(t6_value);
    			t7 = space();
    			create_component(slider.$$.fragment);
    			attr_dev(div0, "class", "range-tick range-tick-left svelte-18h44ss");
    			set_style(div0, "left", "0");
    			add_location(div0, file$2, 24, 4, 703);
    			attr_dev(div1, "class", "range-tick range-tick-right svelte-18h44ss");
    			set_style(div1, "left", "100%");
    			add_location(div1, file$2, 27, 4, 811);
    			attr_dev(div2, "class", "range-tick avg-line svelte-18h44ss");
    			set_style(div2, "left", (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].avg - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) / (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) * 100 + "%");
    			add_location(div2, file$2, 30, 4, 923);
    			attr_dev(div3, "class", "range-container svelte-18h44ss");
    			add_location(div3, file$2, 13, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div3, t7);
    			mount_component(slider, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*answers*/ ctx[0][/*questionNum*/ ctx[2]].set) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div3, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*f, answers, questionNum*/ 37) && t1_value !== (t1_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*f, answers, questionNum*/ 37) && t3_value !== (t3_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max) + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*f, answers, questionNum*/ 37) && t6_value !== (t6_value = /*f*/ ctx[5](/*answers*/ ctx[0][/*questionNum*/ ctx[2]].avg) + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*answers, questionNum*/ 5) {
    				set_style(div2, "left", (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].avg - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) / (/*answers*/ ctx[0][/*questionNum*/ ctx[2]].max - /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min) * 100 + "%");
    			}

    			const slider_changes = {};
    			if (dirty & /*answers, questionNum*/ 5) slider_changes.min = /*answers*/ ctx[0][/*questionNum*/ ctx[2]].min;
    			if (dirty & /*answers, questionNum*/ 5) slider_changes.max = /*answers*/ ctx[0][/*questionNum*/ ctx[2]].max;
    			if (dirty & /*data*/ 8) slider_changes.data = /*data*/ ctx[3];
    			if (dirty & /*place*/ 16) slider_changes.selected = /*place*/ ctx[4].code;
    			if (dirty & /*questions, questionNum*/ 6) slider_changes.valueKey = /*questions*/ ctx[1][/*questionNum*/ ctx[2]].key;
    			if (dirty & /*answers, questionNum*/ 5) slider_changes.disabled = /*answers*/ ctx[0][/*questionNum*/ ctx[2]].set;
    			if (dirty & /*questions, questionNum*/ 6) slider_changes.unit = /*questions*/ ctx[1][/*questionNum*/ ctx[2]].unit;
    			if (dirty & /*f*/ 32) slider_changes.format = /*f*/ ctx[5];
    			if (dirty & /*questions, questionNum*/ 6) slider_changes.dp = /*questions*/ ctx[1][/*questionNum*/ ctx[2]].formatVal;

    			if (!updating_value && dirty & /*answers, questionNum*/ 5) {
    				updating_value = true;
    				slider_changes.value = /*answers*/ ctx[0][/*questionNum*/ ctx[2]].val;
    				add_flush_callback(() => updating_value = false);
    			}

    			slider.$set(slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			destroy_component(slider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let f;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderWrapper', slots, []);
    	let { answers } = $$props;
    	let { questions } = $$props;
    	let { questionNum } = $$props;
    	let { data } = $$props;
    	let { place } = $$props;
    	const writable_props = ['answers', 'questions', 'questionNum', 'data', 'place'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SliderWrapper> was created with unknown prop '${key}'`);
    	});

    	function slider_value_binding(value) {
    		if ($$self.$$.not_equal(answers[questionNum].val, value)) {
    			answers[questionNum].val = value;
    			$$invalidate(0, answers);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('answers' in $$props) $$invalidate(0, answers = $$props.answers);
    		if ('questions' in $$props) $$invalidate(1, questions = $$props.questions);
    		if ('questionNum' in $$props) $$invalidate(2, questionNum = $$props.questionNum);
    		if ('data' in $$props) $$invalidate(3, data = $$props.data);
    		if ('place' in $$props) $$invalidate(4, place = $$props.place);
    	};

    	$$self.$capture_state = () => ({
    		format,
    		Slider,
    		answers,
    		questions,
    		questionNum,
    		data,
    		place,
    		f
    	});

    	$$self.$inject_state = $$props => {
    		if ('answers' in $$props) $$invalidate(0, answers = $$props.answers);
    		if ('questions' in $$props) $$invalidate(1, questions = $$props.questions);
    		if ('questionNum' in $$props) $$invalidate(2, questionNum = $$props.questionNum);
    		if ('data' in $$props) $$invalidate(3, data = $$props.data);
    		if ('place' in $$props) $$invalidate(4, place = $$props.place);
    		if ('f' in $$props) $$invalidate(5, f = $$props.f);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*questions, questionNum*/ 6) {
    			$$invalidate(5, f = questions[questionNum].formatVal
    			? format(questions[questionNum].formatVal)
    			: format(0));
    		}
    	};

    	return [answers, questions, questionNum, data, place, f, slider_value_binding];
    }

    class SliderWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			answers: 0,
    			questions: 1,
    			questionNum: 2,
    			data: 3,
    			place: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderWrapper",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*answers*/ ctx[0] === undefined && !('answers' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'answers'");
    		}

    		if (/*questions*/ ctx[1] === undefined && !('questions' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'questions'");
    		}

    		if (/*questionNum*/ ctx[2] === undefined && !('questionNum' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'questionNum'");
    		}

    		if (/*data*/ ctx[3] === undefined && !('data' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'data'");
    		}

    		if (/*place*/ ctx[4] === undefined && !('place' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'place'");
    		}
    	}

    	get answers() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answers(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get questions() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questions(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get questionNum() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionNum(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get place() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set place(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var epsilon = 1e-6;
    var epsilon2 = 1e-12;
    var pi = Math.PI;
    var halfPi = pi / 2;
    var quarterPi = pi / 4;
    var tau = pi * 2;

    var degrees = 180 / pi;
    var radians = pi / 180;

    var abs = Math.abs;
    var atan = Math.atan;
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var sin = Math.sin;
    var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
    var sqrt = Math.sqrt;

    function acos(x) {
      return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
    }

    function asin(x) {
      return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
    }

    function noop() {}

    function streamGeometry(geometry, stream) {
      if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
        streamGeometryType[geometry.type](geometry, stream);
      }
    }

    var streamObjectType = {
      Feature: function(object, stream) {
        streamGeometry(object.geometry, stream);
      },
      FeatureCollection: function(object, stream) {
        var features = object.features, i = -1, n = features.length;
        while (++i < n) streamGeometry(features[i].geometry, stream);
      }
    };

    var streamGeometryType = {
      Sphere: function(object, stream) {
        stream.sphere();
      },
      Point: function(object, stream) {
        object = object.coordinates;
        stream.point(object[0], object[1], object[2]);
      },
      MultiPoint: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
      },
      LineString: function(object, stream) {
        streamLine(object.coordinates, stream, 0);
      },
      MultiLineString: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) streamLine(coordinates[i], stream, 0);
      },
      Polygon: function(object, stream) {
        streamPolygon(object.coordinates, stream);
      },
      MultiPolygon: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) streamPolygon(coordinates[i], stream);
      },
      GeometryCollection: function(object, stream) {
        var geometries = object.geometries, i = -1, n = geometries.length;
        while (++i < n) streamGeometry(geometries[i], stream);
      }
    };

    function streamLine(coordinates, stream, closed) {
      var i = -1, n = coordinates.length - closed, coordinate;
      stream.lineStart();
      while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
      stream.lineEnd();
    }

    function streamPolygon(coordinates, stream) {
      var i = -1, n = coordinates.length;
      stream.polygonStart();
      while (++i < n) streamLine(coordinates[i], stream, 1);
      stream.polygonEnd();
    }

    function geoStream(object, stream) {
      if (object && streamObjectType.hasOwnProperty(object.type)) {
        streamObjectType[object.type](object, stream);
      } else {
        streamGeometry(object, stream);
      }
    }

    function spherical(cartesian) {
      return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
    }

    function cartesian(spherical) {
      var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
      return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
    }

    function cartesianDot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function cartesianCross(a, b) {
      return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    }

    // TODO return a
    function cartesianAddInPlace(a, b) {
      a[0] += b[0], a[1] += b[1], a[2] += b[2];
    }

    function cartesianScale(vector, k) {
      return [vector[0] * k, vector[1] * k, vector[2] * k];
    }

    // TODO return d
    function cartesianNormalizeInPlace(d) {
      var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
      d[0] /= l, d[1] /= l, d[2] /= l;
    }

    function compose(a, b) {

      function compose(x, y) {
        return x = a(x, y), b(x[0], x[1]);
      }

      if (a.invert && b.invert) compose.invert = function(x, y) {
        return x = b.invert(x, y), x && a.invert(x[0], x[1]);
      };

      return compose;
    }

    function rotationIdentity(lambda, phi) {
      return [abs(lambda) > pi ? lambda + Math.round(-lambda / tau) * tau : lambda, phi];
    }

    rotationIdentity.invert = rotationIdentity;

    function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
      return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
        : rotationLambda(deltaLambda))
        : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
        : rotationIdentity);
    }

    function forwardRotationLambda(deltaLambda) {
      return function(lambda, phi) {
        return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
      };
    }

    function rotationLambda(deltaLambda) {
      var rotation = forwardRotationLambda(deltaLambda);
      rotation.invert = forwardRotationLambda(-deltaLambda);
      return rotation;
    }

    function rotationPhiGamma(deltaPhi, deltaGamma) {
      var cosDeltaPhi = cos(deltaPhi),
          sinDeltaPhi = sin(deltaPhi),
          cosDeltaGamma = cos(deltaGamma),
          sinDeltaGamma = sin(deltaGamma);

      function rotation(lambda, phi) {
        var cosPhi = cos(phi),
            x = cos(lambda) * cosPhi,
            y = sin(lambda) * cosPhi,
            z = sin(phi),
            k = z * cosDeltaPhi + x * sinDeltaPhi;
        return [
          atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
          asin(k * cosDeltaGamma + y * sinDeltaGamma)
        ];
      }

      rotation.invert = function(lambda, phi) {
        var cosPhi = cos(phi),
            x = cos(lambda) * cosPhi,
            y = sin(lambda) * cosPhi,
            z = sin(phi),
            k = z * cosDeltaGamma - y * sinDeltaGamma;
        return [
          atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
          asin(k * cosDeltaPhi - x * sinDeltaPhi)
        ];
      };

      return rotation;
    }

    // Generates a circle centered at [0°, 0°], with a given radius and precision.
    function circleStream(stream, radius, delta, direction, t0, t1) {
      if (!delta) return;
      var cosRadius = cos(radius),
          sinRadius = sin(radius),
          step = direction * delta;
      if (t0 == null) {
        t0 = radius + direction * tau;
        t1 = radius - step / 2;
      } else {
        t0 = circleRadius(cosRadius, t0);
        t1 = circleRadius(cosRadius, t1);
        if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
      }
      for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
        point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
        stream.point(point[0], point[1]);
      }
    }

    // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
    function circleRadius(cosRadius, point) {
      point = cartesian(point), point[0] -= cosRadius;
      cartesianNormalizeInPlace(point);
      var radius = acos(-point[1]);
      return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
    }

    function clipBuffer() {
      var lines = [],
          line;
      return {
        point: function(x, y, m) {
          line.push([x, y, m]);
        },
        lineStart: function() {
          lines.push(line = []);
        },
        lineEnd: noop,
        rejoin: function() {
          if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
        },
        result: function() {
          var result = lines;
          lines = [];
          line = null;
          return result;
        }
      };
    }

    function pointEqual(a, b) {
      return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
    }

    function Intersection(point, points, other, entry) {
      this.x = point;
      this.z = points;
      this.o = other; // another intersection
      this.e = entry; // is an entry?
      this.v = false; // visited
      this.n = this.p = null; // next & previous
    }

    // A generalized polygon clipping algorithm: given a polygon that has been cut
    // into its visible line segments, and rejoins the segments by interpolating
    // along the clip edge.
    function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
      var subject = [],
          clip = [],
          i,
          n;

      segments.forEach(function(segment) {
        if ((n = segment.length - 1) <= 0) return;
        var n, p0 = segment[0], p1 = segment[n], x;

        if (pointEqual(p0, p1)) {
          if (!p0[2] && !p1[2]) {
            stream.lineStart();
            for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
            stream.lineEnd();
            return;
          }
          // handle degenerate cases by moving the point
          p1[0] += 2 * epsilon;
        }

        subject.push(x = new Intersection(p0, segment, null, true));
        clip.push(x.o = new Intersection(p0, null, x, false));
        subject.push(x = new Intersection(p1, segment, null, false));
        clip.push(x.o = new Intersection(p1, null, x, true));
      });

      if (!subject.length) return;

      clip.sort(compareIntersection);
      link(subject);
      link(clip);

      for (i = 0, n = clip.length; i < n; ++i) {
        clip[i].e = startInside = !startInside;
      }

      var start = subject[0],
          points,
          point;

      while (1) {
        // Find first unvisited intersection.
        var current = start,
            isSubject = true;
        while (current.v) if ((current = current.n) === start) return;
        points = current.z;
        stream.lineStart();
        do {
          current.v = current.o.v = true;
          if (current.e) {
            if (isSubject) {
              for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
            } else {
              interpolate(current.x, current.n.x, 1, stream);
            }
            current = current.n;
          } else {
            if (isSubject) {
              points = current.p.z;
              for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
            } else {
              interpolate(current.x, current.p.x, -1, stream);
            }
            current = current.p;
          }
          current = current.o;
          points = current.z;
          isSubject = !isSubject;
        } while (!current.v);
        stream.lineEnd();
      }
    }

    function link(array) {
      if (!(n = array.length)) return;
      var n,
          i = 0,
          a = array[0],
          b;
      while (++i < n) {
        a.n = b = array[i];
        b.p = a;
        a = b;
      }
      a.n = b = array[0];
      b.p = a;
    }

    function longitude(point) {
      return abs(point[0]) <= pi ? point[0] : sign(point[0]) * ((abs(point[0]) + pi) % tau - pi);
    }

    function polygonContains(polygon, point) {
      var lambda = longitude(point),
          phi = point[1],
          sinPhi = sin(phi),
          normal = [sin(lambda), -cos(lambda), 0],
          angle = 0,
          winding = 0;

      var sum = new Adder();

      if (sinPhi === 1) phi = halfPi + epsilon;
      else if (sinPhi === -1) phi = -halfPi - epsilon;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        if (!(m = (ring = polygon[i]).length)) continue;
        var ring,
            m,
            point0 = ring[m - 1],
            lambda0 = longitude(point0),
            phi0 = point0[1] / 2 + quarterPi,
            sinPhi0 = sin(phi0),
            cosPhi0 = cos(phi0);

        for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
          var point1 = ring[j],
              lambda1 = longitude(point1),
              phi1 = point1[1] / 2 + quarterPi,
              sinPhi1 = sin(phi1),
              cosPhi1 = cos(phi1),
              delta = lambda1 - lambda0,
              sign = delta >= 0 ? 1 : -1,
              absDelta = sign * delta,
              antimeridian = absDelta > pi,
              k = sinPhi0 * sinPhi1;

          sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
          angle += antimeridian ? delta + sign * tau : delta;

          // Are the longitudes either side of the point’s meridian (lambda),
          // and are the latitudes smaller than the parallel (phi)?
          if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
            var arc = cartesianCross(cartesian(point0), cartesian(point1));
            cartesianNormalizeInPlace(arc);
            var intersection = cartesianCross(normal, arc);
            cartesianNormalizeInPlace(intersection);
            var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
            if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
              winding += antimeridian ^ delta >= 0 ? 1 : -1;
            }
          }
        }
      }

      // First, determine whether the South pole is inside or outside:
      //
      // It is inside if:
      // * the polygon winds around it in a clockwise direction.
      // * the polygon does not (cumulatively) wind around it, but has a negative
      //   (counter-clockwise) area.
      //
      // Second, count the (signed) number of times a segment crosses a lambda
      // from the point to the South pole.  If it is zero, then the point is the
      // same side as the South pole.

      return (angle < -epsilon || angle < epsilon && sum < -epsilon2) ^ (winding & 1);
    }

    function clip(pointVisible, clipLine, interpolate, start) {
      return function(sink) {
        var line = clipLine(sink),
            ringBuffer = clipBuffer(),
            ringSink = clipLine(ringBuffer),
            polygonStarted = false,
            polygon,
            segments,
            ring;

        var clip = {
          point: point,
          lineStart: lineStart,
          lineEnd: lineEnd,
          polygonStart: function() {
            clip.point = pointRing;
            clip.lineStart = ringStart;
            clip.lineEnd = ringEnd;
            segments = [];
            polygon = [];
          },
          polygonEnd: function() {
            clip.point = point;
            clip.lineStart = lineStart;
            clip.lineEnd = lineEnd;
            segments = merge(segments);
            var startInside = polygonContains(polygon, start);
            if (segments.length) {
              if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
              clipRejoin(segments, compareIntersection, startInside, interpolate, sink);
            } else if (startInside) {
              if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
              sink.lineStart();
              interpolate(null, null, 1, sink);
              sink.lineEnd();
            }
            if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
            segments = polygon = null;
          },
          sphere: function() {
            sink.polygonStart();
            sink.lineStart();
            interpolate(null, null, 1, sink);
            sink.lineEnd();
            sink.polygonEnd();
          }
        };

        function point(lambda, phi) {
          if (pointVisible(lambda, phi)) sink.point(lambda, phi);
        }

        function pointLine(lambda, phi) {
          line.point(lambda, phi);
        }

        function lineStart() {
          clip.point = pointLine;
          line.lineStart();
        }

        function lineEnd() {
          clip.point = point;
          line.lineEnd();
        }

        function pointRing(lambda, phi) {
          ring.push([lambda, phi]);
          ringSink.point(lambda, phi);
        }

        function ringStart() {
          ringSink.lineStart();
          ring = [];
        }

        function ringEnd() {
          pointRing(ring[0][0], ring[0][1]);
          ringSink.lineEnd();

          var clean = ringSink.clean(),
              ringSegments = ringBuffer.result(),
              i, n = ringSegments.length, m,
              segment,
              point;

          ring.pop();
          polygon.push(ring);
          ring = null;

          if (!n) return;

          // No intersections.
          if (clean & 1) {
            segment = ringSegments[0];
            if ((m = segment.length - 1) > 0) {
              if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
              sink.lineStart();
              for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
              sink.lineEnd();
            }
            return;
          }

          // Rejoin connected segments.
          // TODO reuse ringBuffer.rejoin()?
          if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

          segments.push(ringSegments.filter(validSegment));
        }

        return clip;
      };
    }

    function validSegment(segment) {
      return segment.length > 1;
    }

    // Intersections are sorted along the clip edge. For both antimeridian cutting
    // and circle clipping, the same comparison is used.
    function compareIntersection(a, b) {
      return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
           - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
    }

    var clipAntimeridian = clip(
      function() { return true; },
      clipAntimeridianLine,
      clipAntimeridianInterpolate,
      [-pi, -halfPi]
    );

    // Takes a line and cuts into visible segments. Return values: 0 - there were
    // intersections or the line was empty; 1 - no intersections; 2 - there were
    // intersections, and the first and last segments should be rejoined.
    function clipAntimeridianLine(stream) {
      var lambda0 = NaN,
          phi0 = NaN,
          sign0 = NaN,
          clean; // no intersections

      return {
        lineStart: function() {
          stream.lineStart();
          clean = 1;
        },
        point: function(lambda1, phi1) {
          var sign1 = lambda1 > 0 ? pi : -pi,
              delta = abs(lambda1 - lambda0);
          if (abs(delta - pi) < epsilon) { // line crosses a pole
            stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
            stream.point(sign0, phi0);
            stream.lineEnd();
            stream.lineStart();
            stream.point(sign1, phi0);
            stream.point(lambda1, phi0);
            clean = 0;
          } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
            if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
            if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
            phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
            stream.point(sign0, phi0);
            stream.lineEnd();
            stream.lineStart();
            stream.point(sign1, phi0);
            clean = 0;
          }
          stream.point(lambda0 = lambda1, phi0 = phi1);
          sign0 = sign1;
        },
        lineEnd: function() {
          stream.lineEnd();
          lambda0 = phi0 = NaN;
        },
        clean: function() {
          return 2 - clean; // if intersections, rejoin first and last segments
        }
      };
    }

    function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
      var cosPhi0,
          cosPhi1,
          sinLambda0Lambda1 = sin(lambda0 - lambda1);
      return abs(sinLambda0Lambda1) > epsilon
          ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
              - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
              / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
          : (phi0 + phi1) / 2;
    }

    function clipAntimeridianInterpolate(from, to, direction, stream) {
      var phi;
      if (from == null) {
        phi = direction * halfPi;
        stream.point(-pi, phi);
        stream.point(0, phi);
        stream.point(pi, phi);
        stream.point(pi, 0);
        stream.point(pi, -phi);
        stream.point(0, -phi);
        stream.point(-pi, -phi);
        stream.point(-pi, 0);
        stream.point(-pi, phi);
      } else if (abs(from[0] - to[0]) > epsilon) {
        var lambda = from[0] < to[0] ? pi : -pi;
        phi = direction * lambda / 2;
        stream.point(-lambda, phi);
        stream.point(0, phi);
        stream.point(lambda, phi);
      } else {
        stream.point(to[0], to[1]);
      }
    }

    function clipCircle(radius) {
      var cr = cos(radius),
          delta = 6 * radians,
          smallRadius = cr > 0,
          notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

      function interpolate(from, to, direction, stream) {
        circleStream(stream, radius, delta, direction, from, to);
      }

      function visible(lambda, phi) {
        return cos(lambda) * cos(phi) > cr;
      }

      // Takes a line and cuts into visible segments. Return values used for polygon
      // clipping: 0 - there were intersections or the line was empty; 1 - no
      // intersections 2 - there were intersections, and the first and last segments
      // should be rejoined.
      function clipLine(stream) {
        var point0, // previous point
            c0, // code for previous point
            v0, // visibility of previous point
            v00, // visibility of first point
            clean; // no intersections
        return {
          lineStart: function() {
            v00 = v0 = false;
            clean = 1;
          },
          point: function(lambda, phi) {
            var point1 = [lambda, phi],
                point2,
                v = visible(lambda, phi),
                c = smallRadius
                  ? v ? 0 : code(lambda, phi)
                  : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
            if (!point0 && (v00 = v0 = v)) stream.lineStart();
            if (v !== v0) {
              point2 = intersect(point0, point1);
              if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2))
                point1[2] = 1;
            }
            if (v !== v0) {
              clean = 0;
              if (v) {
                // outside going in
                stream.lineStart();
                point2 = intersect(point1, point0);
                stream.point(point2[0], point2[1]);
              } else {
                // inside going out
                point2 = intersect(point0, point1);
                stream.point(point2[0], point2[1], 2);
                stream.lineEnd();
              }
              point0 = point2;
            } else if (notHemisphere && point0 && smallRadius ^ v) {
              var t;
              // If the codes for two points are different, or are both zero,
              // and there this segment intersects with the small circle.
              if (!(c & c0) && (t = intersect(point1, point0, true))) {
                clean = 0;
                if (smallRadius) {
                  stream.lineStart();
                  stream.point(t[0][0], t[0][1]);
                  stream.point(t[1][0], t[1][1]);
                  stream.lineEnd();
                } else {
                  stream.point(t[1][0], t[1][1]);
                  stream.lineEnd();
                  stream.lineStart();
                  stream.point(t[0][0], t[0][1], 3);
                }
              }
            }
            if (v && (!point0 || !pointEqual(point0, point1))) {
              stream.point(point1[0], point1[1]);
            }
            point0 = point1, v0 = v, c0 = c;
          },
          lineEnd: function() {
            if (v0) stream.lineEnd();
            point0 = null;
          },
          // Rejoin first and last segments if there were intersections and the first
          // and last points were visible.
          clean: function() {
            return clean | ((v00 && v0) << 1);
          }
        };
      }

      // Intersects the great circle between a and b with the clip circle.
      function intersect(a, b, two) {
        var pa = cartesian(a),
            pb = cartesian(b);

        // We have two planes, n1.p = d1 and n2.p = d2.
        // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
        var n1 = [1, 0, 0], // normal
            n2 = cartesianCross(pa, pb),
            n2n2 = cartesianDot(n2, n2),
            n1n2 = n2[0], // cartesianDot(n1, n2),
            determinant = n2n2 - n1n2 * n1n2;

        // Two polar points.
        if (!determinant) return !two && a;

        var c1 =  cr * n2n2 / determinant,
            c2 = -cr * n1n2 / determinant,
            n1xn2 = cartesianCross(n1, n2),
            A = cartesianScale(n1, c1),
            B = cartesianScale(n2, c2);
        cartesianAddInPlace(A, B);

        // Solve |p(t)|^2 = 1.
        var u = n1xn2,
            w = cartesianDot(A, u),
            uu = cartesianDot(u, u),
            t2 = w * w - uu * (cartesianDot(A, A) - 1);

        if (t2 < 0) return;

        var t = sqrt(t2),
            q = cartesianScale(u, (-w - t) / uu);
        cartesianAddInPlace(q, A);
        q = spherical(q);

        if (!two) return q;

        // Two intersection points.
        var lambda0 = a[0],
            lambda1 = b[0],
            phi0 = a[1],
            phi1 = b[1],
            z;

        if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

        var delta = lambda1 - lambda0,
            polar = abs(delta - pi) < epsilon,
            meridian = polar || delta < epsilon;

        if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

        // Check that the first point is between a and b.
        if (meridian
            ? polar
              ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
              : phi0 <= q[1] && q[1] <= phi1
            : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
          var q1 = cartesianScale(u, (-w + t) / uu);
          cartesianAddInPlace(q1, A);
          return [q, spherical(q1)];
        }
      }

      // Generates a 4-bit vector representing the location of a point relative to
      // the small circle's bounding box.
      function code(lambda, phi) {
        var r = smallRadius ? radius : pi - radius,
            code = 0;
        if (lambda < -r) code |= 1; // left
        else if (lambda > r) code |= 2; // right
        if (phi < -r) code |= 4; // below
        else if (phi > r) code |= 8; // above
        return code;
      }

      return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
    }

    function clipLine(a, b, x0, y0, x1, y1) {
      var ax = a[0],
          ay = a[1],
          bx = b[0],
          by = b[1],
          t0 = 0,
          t1 = 1,
          dx = bx - ax,
          dy = by - ay,
          r;

      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }

      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }

      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }

      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }

      if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
      if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
      return true;
    }

    var clipMax = 1e9, clipMin = -clipMax;

    // TODO Use d3-polygon’s polygonContains here for the ring check?
    // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

    function clipRectangle(x0, y0, x1, y1) {

      function visible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }

      function interpolate(from, to, direction, stream) {
        var a = 0, a1 = 0;
        if (from == null
            || (a = corner(from, direction)) !== (a1 = corner(to, direction))
            || comparePoint(from, to) < 0 ^ direction > 0) {
          do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          stream.point(to[0], to[1]);
        }
      }

      function corner(p, direction) {
        return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
            : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
            : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
            : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
      }

      function compareIntersection(a, b) {
        return comparePoint(a.x, b.x);
      }

      function comparePoint(a, b) {
        var ca = corner(a, 1),
            cb = corner(b, 1);
        return ca !== cb ? ca - cb
            : ca === 0 ? b[1] - a[1]
            : ca === 1 ? a[0] - b[0]
            : ca === 2 ? a[1] - b[1]
            : b[0] - a[0];
      }

      return function(stream) {
        var activeStream = stream,
            bufferStream = clipBuffer(),
            segments,
            polygon,
            ring,
            x__, y__, v__, // first point
            x_, y_, v_, // previous point
            first,
            clean;

        var clipStream = {
          point: point,
          lineStart: lineStart,
          lineEnd: lineEnd,
          polygonStart: polygonStart,
          polygonEnd: polygonEnd
        };

        function point(x, y) {
          if (visible(x, y)) activeStream.point(x, y);
        }

        function polygonInside() {
          var winding = 0;

          for (var i = 0, n = polygon.length; i < n; ++i) {
            for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
              a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
              if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
              else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
            }
          }

          return winding;
        }

        // Buffer geometry within a polygon and then clip it en masse.
        function polygonStart() {
          activeStream = bufferStream, segments = [], polygon = [], clean = true;
        }

        function polygonEnd() {
          var startInside = polygonInside(),
              cleanInside = clean && startInside,
              visible = (segments = merge(segments)).length;
          if (cleanInside || visible) {
            stream.polygonStart();
            if (cleanInside) {
              stream.lineStart();
              interpolate(null, null, 1, stream);
              stream.lineEnd();
            }
            if (visible) {
              clipRejoin(segments, compareIntersection, startInside, interpolate, stream);
            }
            stream.polygonEnd();
          }
          activeStream = stream, segments = polygon = ring = null;
        }

        function lineStart() {
          clipStream.point = linePoint;
          if (polygon) polygon.push(ring = []);
          first = true;
          v_ = false;
          x_ = y_ = NaN;
        }

        // TODO rather than special-case polygons, simply handle them separately.
        // Ideally, coincident intersection points should be jittered to avoid
        // clipping issues.
        function lineEnd() {
          if (segments) {
            linePoint(x__, y__);
            if (v__ && v_) bufferStream.rejoin();
            segments.push(bufferStream.result());
          }
          clipStream.point = point;
          if (v_) activeStream.lineEnd();
        }

        function linePoint(x, y) {
          var v = visible(x, y);
          if (polygon) ring.push([x, y]);
          if (first) {
            x__ = x, y__ = y, v__ = v;
            first = false;
            if (v) {
              activeStream.lineStart();
              activeStream.point(x, y);
            }
          } else {
            if (v && v_) activeStream.point(x, y);
            else {
              var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
                  b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
              if (clipLine(a, b, x0, y0, x1, y1)) {
                if (!v_) {
                  activeStream.lineStart();
                  activeStream.point(a[0], a[1]);
                }
                activeStream.point(b[0], b[1]);
                if (!v) activeStream.lineEnd();
                clean = false;
              } else if (v) {
                activeStream.lineStart();
                activeStream.point(x, y);
                clean = false;
              }
            }
          }
          x_ = x, y_ = y, v_ = v;
        }

        return clipStream;
      };
    }

    var identity = x => x;

    var areaSum = new Adder(),
        areaRingSum = new Adder(),
        x00$2,
        y00$2,
        x0$3,
        y0$3;

    var areaStream = {
      point: noop,
      lineStart: noop,
      lineEnd: noop,
      polygonStart: function() {
        areaStream.lineStart = areaRingStart;
        areaStream.lineEnd = areaRingEnd;
      },
      polygonEnd: function() {
        areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop;
        areaSum.add(abs(areaRingSum));
        areaRingSum = new Adder();
      },
      result: function() {
        var area = areaSum / 2;
        areaSum = new Adder();
        return area;
      }
    };

    function areaRingStart() {
      areaStream.point = areaPointFirst;
    }

    function areaPointFirst(x, y) {
      areaStream.point = areaPoint;
      x00$2 = x0$3 = x, y00$2 = y0$3 = y;
    }

    function areaPoint(x, y) {
      areaRingSum.add(y0$3 * x - x0$3 * y);
      x0$3 = x, y0$3 = y;
    }

    function areaRingEnd() {
      areaPoint(x00$2, y00$2);
    }

    var pathArea = areaStream;

    var x0$2 = Infinity,
        y0$2 = x0$2,
        x1 = -x0$2,
        y1 = x1;

    var boundsStream = {
      point: boundsPoint,
      lineStart: noop,
      lineEnd: noop,
      polygonStart: noop,
      polygonEnd: noop,
      result: function() {
        var bounds = [[x0$2, y0$2], [x1, y1]];
        x1 = y1 = -(y0$2 = x0$2 = Infinity);
        return bounds;
      }
    };

    function boundsPoint(x, y) {
      if (x < x0$2) x0$2 = x;
      if (x > x1) x1 = x;
      if (y < y0$2) y0$2 = y;
      if (y > y1) y1 = y;
    }

    var boundsStream$1 = boundsStream;

    // TODO Enforce positive area for exterior, negative area for interior?

    var X0 = 0,
        Y0 = 0,
        Z0 = 0,
        X1 = 0,
        Y1 = 0,
        Z1 = 0,
        X2 = 0,
        Y2 = 0,
        Z2 = 0,
        x00$1,
        y00$1,
        x0$1,
        y0$1;

    var centroidStream = {
      point: centroidPoint,
      lineStart: centroidLineStart,
      lineEnd: centroidLineEnd,
      polygonStart: function() {
        centroidStream.lineStart = centroidRingStart;
        centroidStream.lineEnd = centroidRingEnd;
      },
      polygonEnd: function() {
        centroidStream.point = centroidPoint;
        centroidStream.lineStart = centroidLineStart;
        centroidStream.lineEnd = centroidLineEnd;
      },
      result: function() {
        var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
            : Z1 ? [X1 / Z1, Y1 / Z1]
            : Z0 ? [X0 / Z0, Y0 / Z0]
            : [NaN, NaN];
        X0 = Y0 = Z0 =
        X1 = Y1 = Z1 =
        X2 = Y2 = Z2 = 0;
        return centroid;
      }
    };

    function centroidPoint(x, y) {
      X0 += x;
      Y0 += y;
      ++Z0;
    }

    function centroidLineStart() {
      centroidStream.point = centroidPointFirstLine;
    }

    function centroidPointFirstLine(x, y) {
      centroidStream.point = centroidPointLine;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    function centroidPointLine(x, y) {
      var dx = x - x0$1, dy = y - y0$1, z = sqrt(dx * dx + dy * dy);
      X1 += z * (x0$1 + x) / 2;
      Y1 += z * (y0$1 + y) / 2;
      Z1 += z;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    function centroidLineEnd() {
      centroidStream.point = centroidPoint;
    }

    function centroidRingStart() {
      centroidStream.point = centroidPointFirstRing;
    }

    function centroidRingEnd() {
      centroidPointRing(x00$1, y00$1);
    }

    function centroidPointFirstRing(x, y) {
      centroidStream.point = centroidPointRing;
      centroidPoint(x00$1 = x0$1 = x, y00$1 = y0$1 = y);
    }

    function centroidPointRing(x, y) {
      var dx = x - x0$1,
          dy = y - y0$1,
          z = sqrt(dx * dx + dy * dy);

      X1 += z * (x0$1 + x) / 2;
      Y1 += z * (y0$1 + y) / 2;
      Z1 += z;

      z = y0$1 * x - x0$1 * y;
      X2 += z * (x0$1 + x);
      Y2 += z * (y0$1 + y);
      Z2 += z * 3;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    var pathCentroid = centroidStream;

    function PathContext(context) {
      this._context = context;
    }

    PathContext.prototype = {
      _radius: 4.5,
      pointRadius: function(_) {
        return this._radius = _, this;
      },
      polygonStart: function() {
        this._line = 0;
      },
      polygonEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line === 0) this._context.closePath();
        this._point = NaN;
      },
      point: function(x, y) {
        switch (this._point) {
          case 0: {
            this._context.moveTo(x, y);
            this._point = 1;
            break;
          }
          case 1: {
            this._context.lineTo(x, y);
            break;
          }
          default: {
            this._context.moveTo(x + this._radius, y);
            this._context.arc(x, y, this._radius, 0, tau);
            break;
          }
        }
      },
      result: noop
    };

    var lengthSum = new Adder(),
        lengthRing,
        x00,
        y00,
        x0,
        y0;

    var lengthStream = {
      point: noop,
      lineStart: function() {
        lengthStream.point = lengthPointFirst;
      },
      lineEnd: function() {
        if (lengthRing) lengthPoint(x00, y00);
        lengthStream.point = noop;
      },
      polygonStart: function() {
        lengthRing = true;
      },
      polygonEnd: function() {
        lengthRing = null;
      },
      result: function() {
        var length = +lengthSum;
        lengthSum = new Adder();
        return length;
      }
    };

    function lengthPointFirst(x, y) {
      lengthStream.point = lengthPoint;
      x00 = x0 = x, y00 = y0 = y;
    }

    function lengthPoint(x, y) {
      x0 -= x, y0 -= y;
      lengthSum.add(sqrt(x0 * x0 + y0 * y0));
      x0 = x, y0 = y;
    }

    var pathMeasure = lengthStream;

    function PathString() {
      this._string = [];
    }

    PathString.prototype = {
      _radius: 4.5,
      _circle: circle(4.5),
      pointRadius: function(_) {
        if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
        return this;
      },
      polygonStart: function() {
        this._line = 0;
      },
      polygonEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line === 0) this._string.push("Z");
        this._point = NaN;
      },
      point: function(x, y) {
        switch (this._point) {
          case 0: {
            this._string.push("M", x, ",", y);
            this._point = 1;
            break;
          }
          case 1: {
            this._string.push("L", x, ",", y);
            break;
          }
          default: {
            if (this._circle == null) this._circle = circle(this._radius);
            this._string.push("M", x, ",", y, this._circle);
            break;
          }
        }
      },
      result: function() {
        if (this._string.length) {
          var result = this._string.join("");
          this._string = [];
          return result;
        } else {
          return null;
        }
      }
    };

    function circle(radius) {
      return "m0," + radius
          + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
          + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
          + "z";
    }

    function geoPath(projection, context) {
      var pointRadius = 4.5,
          projectionStream,
          contextStream;

      function path(object) {
        if (object) {
          if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
          geoStream(object, projectionStream(contextStream));
        }
        return contextStream.result();
      }

      path.area = function(object) {
        geoStream(object, projectionStream(pathArea));
        return pathArea.result();
      };

      path.measure = function(object) {
        geoStream(object, projectionStream(pathMeasure));
        return pathMeasure.result();
      };

      path.bounds = function(object) {
        geoStream(object, projectionStream(boundsStream$1));
        return boundsStream$1.result();
      };

      path.centroid = function(object) {
        geoStream(object, projectionStream(pathCentroid));
        return pathCentroid.result();
      };

      path.projection = function(_) {
        return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
      };

      path.context = function(_) {
        if (!arguments.length) return context;
        contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
        if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
        return path;
      };

      path.pointRadius = function(_) {
        if (!arguments.length) return pointRadius;
        pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
        return path;
      };

      return path.projection(projection).context(context);
    }

    function transformer(methods) {
      return function(stream) {
        var s = new TransformStream;
        for (var key in methods) s[key] = methods[key];
        s.stream = stream;
        return s;
      };
    }

    function TransformStream() {}

    TransformStream.prototype = {
      constructor: TransformStream,
      point: function(x, y) { this.stream.point(x, y); },
      sphere: function() { this.stream.sphere(); },
      lineStart: function() { this.stream.lineStart(); },
      lineEnd: function() { this.stream.lineEnd(); },
      polygonStart: function() { this.stream.polygonStart(); },
      polygonEnd: function() { this.stream.polygonEnd(); }
    };

    function fit(projection, fitBounds, object) {
      var clip = projection.clipExtent && projection.clipExtent();
      projection.scale(150).translate([0, 0]);
      if (clip != null) projection.clipExtent(null);
      geoStream(object, projection.stream(boundsStream$1));
      fitBounds(boundsStream$1.result());
      if (clip != null) projection.clipExtent(clip);
      return projection;
    }

    function fitExtent(projection, extent, object) {
      return fit(projection, function(b) {
        var w = extent[1][0] - extent[0][0],
            h = extent[1][1] - extent[0][1],
            k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
            x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
            y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
        projection.scale(150 * k).translate([x, y]);
      }, object);
    }

    function fitSize(projection, size, object) {
      return fitExtent(projection, [[0, 0], size], object);
    }

    function fitWidth(projection, width, object) {
      return fit(projection, function(b) {
        var w = +width,
            k = w / (b[1][0] - b[0][0]),
            x = (w - k * (b[1][0] + b[0][0])) / 2,
            y = -k * b[0][1];
        projection.scale(150 * k).translate([x, y]);
      }, object);
    }

    function fitHeight(projection, height, object) {
      return fit(projection, function(b) {
        var h = +height,
            k = h / (b[1][1] - b[0][1]),
            x = -k * b[0][0],
            y = (h - k * (b[1][1] + b[0][1])) / 2;
        projection.scale(150 * k).translate([x, y]);
      }, object);
    }

    var maxDepth = 16, // maximum depth of subdivision
        cosMinDistance = cos(30 * radians); // cos(minimum angular distance)

    function resample(project, delta2) {
      return +delta2 ? resample$1(project, delta2) : resampleNone(project);
    }

    function resampleNone(project) {
      return transformer({
        point: function(x, y) {
          x = project(x, y);
          this.stream.point(x[0], x[1]);
        }
      });
    }

    function resample$1(project, delta2) {

      function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
        var dx = x1 - x0,
            dy = y1 - y0,
            d2 = dx * dx + dy * dy;
        if (d2 > 4 * delta2 && depth--) {
          var a = a0 + a1,
              b = b0 + b1,
              c = c0 + c1,
              m = sqrt(a * a + b * b + c * c),
              phi2 = asin(c /= m),
              lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
              p = project(lambda2, phi2),
              x2 = p[0],
              y2 = p[1],
              dx2 = x2 - x0,
              dy2 = y2 - y0,
              dz = dy * dx2 - dx * dy2;
          if (dz * dz / d2 > delta2 // perpendicular projected distance
              || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
              || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
            resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
            stream.point(x2, y2);
            resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
          }
        }
      }
      return function(stream) {
        var lambda00, x00, y00, a00, b00, c00, // first point
            lambda0, x0, y0, a0, b0, c0; // previous point

        var resampleStream = {
          point: point,
          lineStart: lineStart,
          lineEnd: lineEnd,
          polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
          polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
        };

        function point(x, y) {
          x = project(x, y);
          stream.point(x[0], x[1]);
        }

        function lineStart() {
          x0 = NaN;
          resampleStream.point = linePoint;
          stream.lineStart();
        }

        function linePoint(lambda, phi) {
          var c = cartesian([lambda, phi]), p = project(lambda, phi);
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
          stream.point(x0, y0);
        }

        function lineEnd() {
          resampleStream.point = point;
          stream.lineEnd();
        }

        function ringStart() {
          lineStart();
          resampleStream.point = ringPoint;
          resampleStream.lineEnd = ringEnd;
        }

        function ringPoint(lambda, phi) {
          linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
          resampleStream.point = linePoint;
        }

        function ringEnd() {
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
          resampleStream.lineEnd = lineEnd;
          lineEnd();
        }

        return resampleStream;
      };
    }

    var transformRadians = transformer({
      point: function(x, y) {
        this.stream.point(x * radians, y * radians);
      }
    });

    function transformRotate(rotate) {
      return transformer({
        point: function(x, y) {
          var r = rotate(x, y);
          return this.stream.point(r[0], r[1]);
        }
      });
    }

    function scaleTranslate(k, dx, dy, sx, sy) {
      function transform(x, y) {
        x *= sx; y *= sy;
        return [dx + k * x, dy - k * y];
      }
      transform.invert = function(x, y) {
        return [(x - dx) / k * sx, (dy - y) / k * sy];
      };
      return transform;
    }

    function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
      if (!alpha) return scaleTranslate(k, dx, dy, sx, sy);
      var cosAlpha = cos(alpha),
          sinAlpha = sin(alpha),
          a = cosAlpha * k,
          b = sinAlpha * k,
          ai = cosAlpha / k,
          bi = sinAlpha / k,
          ci = (sinAlpha * dy - cosAlpha * dx) / k,
          fi = (sinAlpha * dx + cosAlpha * dy) / k;
      function transform(x, y) {
        x *= sx; y *= sy;
        return [a * x - b * y + dx, dy - b * x - a * y];
      }
      transform.invert = function(x, y) {
        return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
      };
      return transform;
    }

    function projectionMutator(projectAt) {
      var project,
          k = 150, // scale
          x = 480, y = 250, // translate
          lambda = 0, phi = 0, // center
          deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
          alpha = 0, // post-rotate angle
          sx = 1, // reflectX
          sy = 1, // reflectX
          theta = null, preclip = clipAntimeridian, // pre-clip angle
          x0 = null, y0, x1, y1, postclip = identity, // post-clip extent
          delta2 = 0.5, // precision
          projectResample,
          projectTransform,
          projectRotateTransform,
          cache,
          cacheStream;

      function projection(point) {
        return projectRotateTransform(point[0] * radians, point[1] * radians);
      }

      function invert(point) {
        point = projectRotateTransform.invert(point[0], point[1]);
        return point && [point[0] * degrees, point[1] * degrees];
      }

      projection.stream = function(stream) {
        return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
      };

      projection.preclip = function(_) {
        return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
      };

      projection.postclip = function(_) {
        return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
      };

      projection.clipAngle = function(_) {
        return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
      };

      projection.clipExtent = function(_) {
        return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
      };

      projection.scale = function(_) {
        return arguments.length ? (k = +_, recenter()) : k;
      };

      projection.translate = function(_) {
        return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
      };

      projection.center = function(_) {
        return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
      };

      projection.rotate = function(_) {
        return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
      };

      projection.angle = function(_) {
        return arguments.length ? (alpha = _ % 360 * radians, recenter()) : alpha * degrees;
      };

      projection.reflectX = function(_) {
        return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
      };

      projection.reflectY = function(_) {
        return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
      };

      projection.precision = function(_) {
        return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
      };

      projection.fitExtent = function(extent, object) {
        return fitExtent(projection, extent, object);
      };

      projection.fitSize = function(size, object) {
        return fitSize(projection, size, object);
      };

      projection.fitWidth = function(width, object) {
        return fitWidth(projection, width, object);
      };

      projection.fitHeight = function(height, object) {
        return fitHeight(projection, height, object);
      };

      function recenter() {
        var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
            transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
        rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
        projectTransform = compose(project, transform);
        projectRotateTransform = compose(rotate, projectTransform);
        projectResample = resample(projectTransform, delta2);
        return reset();
      }

      function reset() {
        cache = cacheStream = null;
        return projection;
      }

      return function() {
        project = projectAt.apply(this, arguments);
        projection.invert = project.invert && invert;
        return recenter();
      };
    }

    function conicProjection(projectAt) {
      var phi0 = 0,
          phi1 = pi / 3,
          m = projectionMutator(projectAt),
          p = m(phi0, phi1);

      p.parallels = function(_) {
        return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
      };

      return p;
    }

    function cylindricalEqualAreaRaw(phi0) {
      var cosPhi0 = cos(phi0);

      function forward(lambda, phi) {
        return [lambda * cosPhi0, sin(phi) / cosPhi0];
      }

      forward.invert = function(x, y) {
        return [x / cosPhi0, asin(y * cosPhi0)];
      };

      return forward;
    }

    function conicEqualAreaRaw(y0, y1) {
      var sy0 = sin(y0), n = (sy0 + sin(y1)) / 2;

      // Are the parallels symmetrical around the Equator?
      if (abs(n) < epsilon) return cylindricalEqualAreaRaw(y0);

      var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;

      function project(x, y) {
        var r = sqrt(c - 2 * n * sin(y)) / n;
        return [r * sin(x *= n), r0 - r * cos(x)];
      }

      project.invert = function(x, y) {
        var r0y = r0 - y,
            l = atan2(x, abs(r0y)) * sign(r0y);
        if (r0y * n < 0)
          l -= pi * sign(x) * sign(r0y);
        return [l / n, asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
      };

      return project;
    }

    function conicEqualArea() {
      return conicProjection(conicEqualAreaRaw)
          .scale(155.424)
          .center([0, 33.6442]);
    }

    function geoAlbers() {
      return conicEqualArea()
          .parallels([29.5, 45.5])
          .scale(1070)
          .translate([480, 250])
          .rotate([96, 0])
          .center([-0.6, 38.7]);
    }

    /**
     * @module helpers
     */
    /**
     * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
     *
     * @memberof helpers
     * @type {number}
     */
    var earthRadius = 6371008.8;
    /**
     * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
     *
     * @memberof helpers
     * @type {Object}
     */
    var factors = {
        centimeters: earthRadius * 100,
        centimetres: earthRadius * 100,
        degrees: earthRadius / 111325,
        feet: earthRadius * 3.28084,
        inches: earthRadius * 39.37,
        kilometers: earthRadius / 1000,
        kilometres: earthRadius / 1000,
        meters: earthRadius,
        metres: earthRadius,
        miles: earthRadius / 1609.344,
        millimeters: earthRadius * 1000,
        millimetres: earthRadius * 1000,
        nauticalmiles: earthRadius / 1852,
        radians: 1,
        yards: earthRadius * 1.0936,
    };
    /**
     * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
     * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
     *
     * @name radiansToLength
     * @param {number} radians in radians across the sphere
     * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
     * meters, kilometres, kilometers.
     * @returns {number} distance
     */
    function radiansToLength(radians, units) {
        if (units === void 0) { units = "kilometers"; }
        var factor = factors[units];
        if (!factor) {
            throw new Error(units + " units is invalid");
        }
        return radians * factor;
    }
    /**
     * Converts an angle in degrees to radians
     *
     * @name degreesToRadians
     * @param {number} degrees angle between 0 and 360 degrees
     * @returns {number} angle in radians
     */
    function degreesToRadians(degrees) {
        var radians = degrees % 360;
        return (radians * Math.PI) / 180;
    }

    /**
     * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
     *
     * @name getCoord
     * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
     * @returns {Array<number>} coordinates
     * @example
     * var pt = turf.point([10, 10]);
     *
     * var coord = turf.getCoord(pt);
     * //= [10, 10]
     */
    function getCoord(coord) {
        if (!coord) {
            throw new Error("coord is required");
        }
        if (!Array.isArray(coord)) {
            if (coord.type === "Feature" &&
                coord.geometry !== null &&
                coord.geometry.type === "Point") {
                return coord.geometry.coordinates;
            }
            if (coord.type === "Point") {
                return coord.coordinates;
            }
        }
        if (Array.isArray(coord) &&
            coord.length >= 2 &&
            !Array.isArray(coord[0]) &&
            !Array.isArray(coord[1])) {
            return coord;
        }
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
    }

    //http://en.wikipedia.org/wiki/Haversine_formula
    //http://www.movable-type.co.uk/scripts/latlong.html
    /**
     * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
     * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
     *
     * @name distance
     * @param {Coord | Point} from origin point or coordinate
     * @param {Coord | Point} to destination point or coordinate
     * @param {Object} [options={}] Optional parameters
     * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
     * @returns {number} distance between the two points
     * @example
     * var from = turf.point([-75.343, 39.984]);
     * var to = turf.point([-75.534, 39.123]);
     * var options = {units: 'miles'};
     *
     * var distance = turf.distance(from, to, options);
     *
     * //addToMap
     * var addToMap = [from, to];
     * from.properties.distance = distance;
     * to.properties.distance = distance;
     */
    function distance(from, to, options) {
        if (options === void 0) { options = {}; }
        var coordinates1 = getCoord(from);
        var coordinates2 = getCoord(to);
        var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
        var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
        var lat1 = degreesToRadians(coordinates1[1]);
        var lat2 = degreesToRadians(coordinates2[1]);
        var a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
    }

    var type = "MultiPolygon";
    var coordinates = [
    	[
    		[
    			[
    				0.946,
    				51.775
    			],
    			[
    				0.9,
    				51.78
    			],
    			[
    				0.895,
    				51.766
    			],
    			[
    				0.848,
    				51.74
    			],
    			[
    				0.777,
    				51.744
    			],
    			[
    				0.711,
    				51.714
    			],
    			[
    				0.796,
    				51.708
    			],
    			[
    				0.82,
    				51.721
    			],
    			[
    				0.869,
    				51.722
    			],
    			[
    				0.894,
    				51.743
    			],
    			[
    				0.931,
    				51.746
    			],
    			[
    				0.951,
    				51.731
    			],
    			[
    				0.935,
    				51.633
    			],
    			[
    				0.866,
    				51.616
    			],
    			[
    				0.866,
    				51.599
    			],
    			[
    				0.82,
    				51.599
    			],
    			[
    				0.806,
    				51.586
    			],
    			[
    				0.818,
    				51.562
    			],
    			[
    				0.851,
    				51.556
    			],
    			[
    				0.783,
    				51.521
    			],
    			[
    				0.643,
    				51.541
    			],
    			[
    				0.637,
    				51.522
    			],
    			[
    				0.573,
    				51.508
    			],
    			[
    				0.541,
    				51.513
    			],
    			[
    				0.508,
    				51.505
    			],
    			[
    				0.456,
    				51.507
    			],
    			[
    				0.43,
    				51.459
    			],
    			[
    				0.474,
    				51.485
    			],
    			[
    				0.546,
    				51.487
    			],
    			[
    				0.615,
    				51.475
    			],
    			[
    				0.66,
    				51.478
    			],
    			[
    				0.7,
    				51.473
    			],
    			[
    				0.72,
    				51.46
    			],
    			[
    				0.71,
    				51.435
    			],
    			[
    				0.678,
    				51.433
    			],
    			[
    				0.672,
    				51.448
    			],
    			[
    				0.636,
    				51.446
    			],
    			[
    				0.611,
    				51.417
    			],
    			[
    				0.535,
    				51.413
    			],
    			[
    				0.561,
    				51.395
    			],
    			[
    				0.612,
    				51.379
    			],
    			[
    				0.648,
    				51.398
    			],
    			[
    				0.67,
    				51.373
    			],
    			[
    				0.687,
    				51.392
    			],
    			[
    				0.726,
    				51.399
    			],
    			[
    				0.764,
    				51.382
    			],
    			[
    				0.767,
    				51.363
    			],
    			[
    				0.866,
    				51.356
    			],
    			[
    				0.904,
    				51.343
    			],
    			[
    				1.006,
    				51.349
    			],
    			[
    				1.033,
    				51.366
    			],
    			[
    				1.224,
    				51.379
    			],
    			[
    				1.315,
    				51.38
    			],
    			[
    				1.393,
    				51.393
    			],
    			[
    				1.442,
    				51.387
    			],
    			[
    				1.446,
    				51.358
    			],
    			[
    				1.425,
    				51.326
    			],
    			[
    				1.377,
    				51.33
    			],
    			[
    				1.371,
    				51.312
    			],
    			[
    				1.404,
    				51.226
    			],
    			[
    				1.399,
    				51.162
    			],
    			[
    				1.38,
    				51.142
    			],
    			[
    				1.319,
    				51.124
    			],
    			[
    				1.298,
    				51.112
    			],
    			[
    				1.221,
    				51.098
    			],
    			[
    				1.195,
    				51.076
    			],
    			[
    				1.074,
    				51.063
    			],
    			[
    				0.997,
    				51.025
    			],
    			[
    				0.964,
    				50.969
    			],
    			[
    				0.978,
    				50.913
    			],
    			[
    				0.772,
    				50.931
    			],
    			[
    				0.732,
    				50.915
    			],
    			[
    				0.659,
    				50.87
    			],
    			[
    				0.532,
    				50.847
    			],
    			[
    				0.377,
    				50.82
    			],
    			[
    				0.339,
    				50.799
    			],
    			[
    				0.26,
    				50.738
    			],
    			[
    				0.21,
    				50.738
    			],
    			[
    				0.149,
    				50.759
    			],
    			[
    				0.122,
    				50.758
    			],
    			[
    				0.068,
    				50.782
    			],
    			[
    				0.058,
    				50.776
    			],
    			[
    				-0.092,
    				50.811
    			],
    			[
    				-0.216,
    				50.828
    			],
    			[
    				-0.278,
    				50.827
    			],
    			[
    				-0.436,
    				50.803
    			],
    			[
    				-0.568,
    				50.798
    			],
    			[
    				-0.702,
    				50.778
    			],
    			[
    				-0.752,
    				50.758
    			],
    			[
    				-0.788,
    				50.723
    			],
    			[
    				-0.843,
    				50.754
    			],
    			[
    				-0.905,
    				50.782
    			],
    			[
    				-0.869,
    				50.814
    			],
    			[
    				-0.892,
    				50.819
    			],
    			[
    				-0.895,
    				50.839
    			],
    			[
    				-0.933,
    				50.846
    			],
    			[
    				-1.02,
    				50.843
    			],
    			[
    				-1.044,
    				50.832
    			],
    			[
    				-1.044,
    				50.791
    			],
    			[
    				-1.088,
    				50.778
    			],
    			[
    				-1.109,
    				50.791
    			],
    			[
    				-1.09,
    				50.81
    			],
    			[
    				-1.118,
    				50.844
    			],
    			[
    				-1.15,
    				50.827
    			],
    			[
    				-1.113,
    				50.789
    			],
    			[
    				-1.142,
    				50.774
    			],
    			[
    				-1.19,
    				50.79
    			],
    			[
    				-1.214,
    				50.809
    			],
    			[
    				-1.308,
    				50.843
    			],
    			[
    				-1.311,
    				50.849
    			],
    			[
    				-1.383,
    				50.89
    			],
    			[
    				-1.422,
    				50.895
    			],
    			[
    				-1.377,
    				50.854
    			],
    			[
    				-1.335,
    				50.838
    			],
    			[
    				-1.326,
    				50.817
    			],
    			[
    				-1.353,
    				50.784
    			],
    			[
    				-1.503,
    				50.754
    			],
    			[
    				-1.535,
    				50.764
    			],
    			[
    				-1.531,
    				50.737
    			],
    			[
    				-1.58,
    				50.718
    			],
    			[
    				-1.641,
    				50.732
    			],
    			[
    				-1.692,
    				50.737
    			],
    			[
    				-1.725,
    				50.734
    			],
    			[
    				-1.763,
    				50.719
    			],
    			[
    				-1.818,
    				50.721
    			],
    			[
    				-1.885,
    				50.713
    			],
    			[
    				-1.934,
    				50.699
    			],
    			[
    				-1.958,
    				50.716
    			],
    			[
    				-1.987,
    				50.708
    			],
    			[
    				-2.039,
    				50.718
    			],
    			[
    				-2.011,
    				50.683
    			],
    			[
    				-1.941,
    				50.641
    			],
    			[
    				-1.957,
    				50.594
    			],
    			[
    				-2.026,
    				50.589
    			],
    			[
    				-2.111,
    				50.599
    			],
    			[
    				-2.198,
    				50.623
    			],
    			[
    				-2.239,
    				50.616
    			],
    			[
    				-2.324,
    				50.625
    			],
    			[
    				-2.339,
    				50.632
    			],
    			[
    				-2.426,
    				50.635
    			],
    			[
    				-2.441,
    				50.61
    			],
    			[
    				-2.47,
    				50.584
    			],
    			[
    				-2.46,
    				50.571
    			],
    			[
    				-2.428,
    				50.566
    			],
    			[
    				-2.419,
    				50.546
    			],
    			[
    				-2.45,
    				50.519
    			],
    			[
    				-2.449,
    				50.56
    			],
    			[
    				-2.53,
    				50.611
    			],
    			[
    				-2.627,
    				50.66
    			],
    			[
    				-2.762,
    				50.711
    			],
    			[
    				-2.91,
    				50.734
    			],
    			[
    				-2.953,
    				50.716
    			],
    			[
    				-3.027,
    				50.699
    			],
    			[
    				-3.083,
    				50.701
    			],
    			[
    				-3.096,
    				50.685
    			],
    			[
    				-3.192,
    				50.685
    			],
    			[
    				-3.258,
    				50.673
    			],
    			[
    				-3.301,
    				50.632
    			],
    			[
    				-3.351,
    				50.619
    			],
    			[
    				-3.362,
    				50.607
    			],
    			[
    				-3.424,
    				50.617
    			],
    			[
    				-3.416,
    				50.63
    			],
    			[
    				-3.461,
    				50.696
    			],
    			[
    				-3.47,
    				50.682
    			],
    			[
    				-3.444,
    				50.602
    			],
    			[
    				-3.467,
    				50.578
    			],
    			[
    				-3.469,
    				50.563
    			],
    			[
    				-3.494,
    				50.544
    			],
    			[
    				-3.509,
    				50.517
    			],
    			[
    				-3.515,
    				50.482
    			],
    			[
    				-3.481,
    				50.464
    			],
    			[
    				-3.516,
    				50.454
    			],
    			[
    				-3.539,
    				50.461
    			],
    			[
    				-3.559,
    				50.426
    			],
    			[
    				-3.556,
    				50.408
    			],
    			[
    				-3.528,
    				50.405
    			],
    			[
    				-3.503,
    				50.389
    			],
    			[
    				-3.518,
    				50.347
    			],
    			[
    				-3.572,
    				50.326
    			],
    			[
    				-3.612,
    				50.319
    			],
    			[
    				-3.642,
    				50.291
    			],
    			[
    				-3.659,
    				50.238
    			],
    			[
    				-3.721,
    				50.202
    			],
    			[
    				-3.773,
    				50.224
    			],
    			[
    				-3.787,
    				50.211
    			],
    			[
    				-3.82,
    				50.216
    			],
    			[
    				-3.868,
    				50.239
    			],
    			[
    				-3.858,
    				50.261
    			],
    			[
    				-3.91,
    				50.294
    			],
    			[
    				-3.944,
    				50.296
    			],
    			[
    				-3.956,
    				50.308
    			],
    			[
    				-4.119,
    				50.319
    			],
    			[
    				-4.131,
    				50.359
    			],
    			[
    				-4.181,
    				50.377
    			],
    			[
    				-4.197,
    				50.36
    			],
    			[
    				-4.169,
    				50.347
    			],
    			[
    				-4.201,
    				50.333
    			],
    			[
    				-4.229,
    				50.334
    			],
    			[
    				-4.308,
    				50.361
    			],
    			[
    				-4.437,
    				50.361
    			],
    			[
    				-4.473,
    				50.333
    			],
    			[
    				-4.498,
    				50.337
    			],
    			[
    				-4.539,
    				50.324
    			],
    			[
    				-4.578,
    				50.333
    			],
    			[
    				-4.685,
    				50.32
    			],
    			[
    				-4.695,
    				50.348
    			],
    			[
    				-4.757,
    				50.331
    			],
    			[
    				-4.764,
    				50.301
    			],
    			[
    				-4.781,
    				50.29
    			],
    			[
    				-4.786,
    				50.245
    			],
    			[
    				-4.798,
    				50.23
    			],
    			[
    				-4.863,
    				50.236
    			],
    			[
    				-4.919,
    				50.196
    			],
    			[
    				-4.956,
    				50.203
    			],
    			[
    				-4.996,
    				50.162
    			],
    			[
    				-5.027,
    				50.158
    			],
    			[
    				-5.036,
    				50.21
    			],
    			[
    				-5.061,
    				50.192
    			],
    			[
    				-5.048,
    				50.172
    			],
    			[
    				-5.092,
    				50.126
    			],
    			[
    				-5.082,
    				50.11
    			],
    			[
    				-5.106,
    				50.094
    			],
    			[
    				-5.076,
    				50.086
    			],
    			[
    				-5.058,
    				50.053
    			],
    			[
    				-5.069,
    				50.035
    			],
    			[
    				-5.122,
    				50.009
    			],
    			[
    				-5.166,
    				50.004
    			],
    			[
    				-5.209,
    				49.959
    			],
    			[
    				-5.268,
    				50.005
    			],
    			[
    				-5.256,
    				50.022
    			],
    			[
    				-5.281,
    				50.043
    			],
    			[
    				-5.28,
    				50.057
    			],
    			[
    				-5.316,
    				50.085
    			],
    			[
    				-5.363,
    				50.089
    			],
    			[
    				-5.392,
    				50.104
    			],
    			[
    				-5.43,
    				50.105
    			],
    			[
    				-5.484,
    				50.128
    			],
    			[
    				-5.53,
    				50.124
    			],
    			[
    				-5.549,
    				50.107
    			],
    			[
    				-5.533,
    				50.089
    			],
    			[
    				-5.542,
    				50.071
    			],
    			[
    				-5.577,
    				50.052
    			],
    			[
    				-5.619,
    				50.051
    			],
    			[
    				-5.675,
    				50.036
    			],
    			[
    				-5.714,
    				50.064
    			],
    			[
    				-5.689,
    				50.09
    			],
    			[
    				-5.71,
    				50.127
    			],
    			[
    				-5.673,
    				50.166
    			],
    			[
    				-5.629,
    				50.168
    			],
    			[
    				-5.539,
    				50.216
    			],
    			[
    				-5.477,
    				50.218
    			],
    			[
    				-5.469,
    				50.2
    			],
    			[
    				-5.434,
    				50.192
    			],
    			[
    				-5.368,
    				50.236
    			],
    			[
    				-5.328,
    				50.243
    			],
    			[
    				-5.303,
    				50.262
    			],
    			[
    				-5.243,
    				50.287
    			],
    			[
    				-5.234,
    				50.318
    			],
    			[
    				-5.201,
    				50.321
    			],
    			[
    				-5.181,
    				50.34
    			],
    			[
    				-5.154,
    				50.346
    			],
    			[
    				-5.136,
    				50.401
    			],
    			[
    				-5.084,
    				50.415
    			],
    			[
    				-5.042,
    				50.444
    			],
    			[
    				-5.024,
    				50.539
    			],
    			[
    				-4.984,
    				50.542
    			],
    			[
    				-4.87,
    				50.595
    			],
    			[
    				-4.832,
    				50.592
    			],
    			[
    				-4.796,
    				50.598
    			],
    			[
    				-4.77,
    				50.622
    			],
    			[
    				-4.759,
    				50.653
    			],
    			[
    				-4.764,
    				50.67
    			],
    			[
    				-4.68,
    				50.696
    			],
    			[
    				-4.655,
    				50.716
    			],
    			[
    				-4.654,
    				50.74
    			],
    			[
    				-4.563,
    				50.781
    			],
    			[
    				-4.556,
    				50.837
    			],
    			[
    				-4.57,
    				50.904
    			],
    			[
    				-4.546,
    				50.928
    			],
    			[
    				-4.533,
    				50.965
    			],
    			[
    				-4.526,
    				51.022
    			],
    			[
    				-4.425,
    				51.014
    			],
    			[
    				-4.391,
    				50.995
    			],
    			[
    				-4.343,
    				50.989
    			],
    			[
    				-4.301,
    				50.999
    			],
    			[
    				-4.258,
    				51.038
    			],
    			[
    				-4.19,
    				51.065
    			],
    			[
    				-4.215,
    				51.075
    			],
    			[
    				-4.223,
    				51.118
    			],
    			[
    				-4.239,
    				51.133
    			],
    			[
    				-4.217,
    				51.15
    			],
    			[
    				-4.212,
    				51.19
    			],
    			[
    				-4.088,
    				51.218
    			],
    			[
    				-4.039,
    				51.207
    			],
    			[
    				-4.028,
    				51.216
    			],
    			[
    				-3.958,
    				51.219
    			],
    			[
    				-3.926,
    				51.232
    			],
    			[
    				-3.892,
    				51.224
    			],
    			[
    				-3.853,
    				51.235
    			],
    			[
    				-3.814,
    				51.231
    			],
    			[
    				-3.787,
    				51.246
    			],
    			[
    				-3.77,
    				51.238
    			],
    			[
    				-3.633,
    				51.224
    			],
    			[
    				-3.62,
    				51.217
    			],
    			[
    				-3.579,
    				51.232
    			],
    			[
    				-3.543,
    				51.232
    			],
    			[
    				-3.496,
    				51.224
    			],
    			[
    				-3.47,
    				51.208
    			],
    			[
    				-3.448,
    				51.209
    			],
    			[
    				-3.402,
    				51.182
    			],
    			[
    				-3.277,
    				51.18
    			],
    			[
    				-3.153,
    				51.209
    			],
    			[
    				-3.126,
    				51.211
    			],
    			[
    				-3.076,
    				51.201
    			],
    			[
    				-2.998,
    				51.225
    			],
    			[
    				-3.022,
    				51.266
    			],
    			[
    				-3.011,
    				51.321
    			],
    			[
    				-2.994,
    				51.321
    			],
    			[
    				-2.963,
    				51.383
    			],
    			[
    				-2.917,
    				51.396
    			],
    			[
    				-2.887,
    				51.413
    			],
    			[
    				-2.851,
    				51.455
    			],
    			[
    				-2.774,
    				51.495
    			],
    			[
    				-2.733,
    				51.493
    			],
    			[
    				-2.674,
    				51.544
    			],
    			[
    				-2.663,
    				51.574
    			],
    			[
    				-2.628,
    				51.606
    			],
    			[
    				-2.659,
    				51.616
    			],
    			[
    				-2.696,
    				51.603
    			],
    			[
    				-2.713,
    				51.582
    			],
    			[
    				-2.758,
    				51.578
    			],
    			[
    				-2.822,
    				51.554
    			],
    			[
    				-2.905,
    				51.532
    			],
    			[
    				-2.995,
    				51.537
    			],
    			[
    				-3.083,
    				51.502
    			],
    			[
    				-3.114,
    				51.493
    			],
    			[
    				-3.164,
    				51.446
    			],
    			[
    				-3.17,
    				51.406
    			],
    			[
    				-3.224,
    				51.404
    			],
    			[
    				-3.269,
    				51.388
    			],
    			[
    				-3.31,
    				51.393
    			],
    			[
    				-3.378,
    				51.381
    			],
    			[
    				-3.415,
    				51.388
    			],
    			[
    				-3.559,
    				51.401
    			],
    			[
    				-3.597,
    				51.441
    			],
    			[
    				-3.663,
    				51.481
    			],
    			[
    				-3.679,
    				51.473
    			],
    			[
    				-3.721,
    				51.48
    			],
    			[
    				-3.749,
    				51.504
    			],
    			[
    				-3.763,
    				51.538
    			],
    			[
    				-3.799,
    				51.573
    			],
    			[
    				-3.851,
    				51.614
    			],
    			[
    				-3.885,
    				51.618
    			],
    			[
    				-3.925,
    				51.607
    			],
    			[
    				-3.958,
    				51.612
    			],
    			[
    				-3.994,
    				51.599
    			],
    			[
    				-4,
    				51.58
    			],
    			[
    				-3.981,
    				51.565
    			],
    			[
    				-4.064,
    				51.557
    			],
    			[
    				-4.111,
    				51.57
    			],
    			[
    				-4.157,
    				51.562
    			],
    			[
    				-4.153,
    				51.543
    			],
    			[
    				-4.195,
    				51.548
    			],
    			[
    				-4.213,
    				51.538
    			],
    			[
    				-4.279,
    				51.562
    			],
    			[
    				-4.309,
    				51.61
    			],
    			[
    				-4.28,
    				51.616
    			],
    			[
    				-4.243,
    				51.649
    			],
    			[
    				-4.222,
    				51.636
    			],
    			[
    				-4.164,
    				51.627
    			],
    			[
    				-4.116,
    				51.645
    			],
    			[
    				-4.147,
    				51.655
    			],
    			[
    				-4.197,
    				51.684
    			],
    			[
    				-4.277,
    				51.668
    			],
    			[
    				-4.32,
    				51.676
    			],
    			[
    				-4.383,
    				51.727
    			],
    			[
    				-4.376,
    				51.754
    			],
    			[
    				-4.463,
    				51.732
    			],
    			[
    				-4.559,
    				51.742
    			],
    			[
    				-4.676,
    				51.727
    			],
    			[
    				-4.697,
    				51.713
    			],
    			[
    				-4.68,
    				51.697
    			],
    			[
    				-4.693,
    				51.672
    			],
    			[
    				-4.714,
    				51.659
    			],
    			[
    				-4.757,
    				51.654
    			],
    			[
    				-4.781,
    				51.635
    			],
    			[
    				-4.813,
    				51.645
    			],
    			[
    				-4.861,
    				51.647
    			],
    			[
    				-4.948,
    				51.597
    			],
    			[
    				-4.975,
    				51.61
    			],
    			[
    				-5.008,
    				51.609
    			],
    			[
    				-5.059,
    				51.621
    			],
    			[
    				-5.05,
    				51.64
    			],
    			[
    				-5.065,
    				51.663
    			],
    			[
    				-5.123,
    				51.671
    			],
    			[
    				-5.105,
    				51.692
    			],
    			[
    				-5.074,
    				51.678
    			],
    			[
    				-5.046,
    				51.694
    			],
    			[
    				-4.984,
    				51.686
    			],
    			[
    				-4.985,
    				51.699
    			],
    			[
    				-5.035,
    				51.711
    			],
    			[
    				-5.078,
    				51.707
    			],
    			[
    				-5.105,
    				51.724
    			],
    			[
    				-5.161,
    				51.715
    			],
    			[
    				-5.157,
    				51.688
    			],
    			[
    				-5.188,
    				51.69
    			],
    			[
    				-5.187,
    				51.709
    			],
    			[
    				-5.215,
    				51.724
    			],
    			[
    				-5.203,
    				51.756
    			],
    			[
    				-5.16,
    				51.772
    			],
    			[
    				-5.108,
    				51.774
    			],
    			[
    				-5.103,
    				51.81
    			],
    			[
    				-5.123,
    				51.852
    			],
    			[
    				-5.138,
    				51.864
    			],
    			[
    				-5.182,
    				51.861
    			],
    			[
    				-5.246,
    				51.874
    			],
    			[
    				-5.302,
    				51.865
    			],
    			[
    				-5.316,
    				51.885
    			],
    			[
    				-5.305,
    				51.908
    			],
    			[
    				-5.259,
    				51.915
    			],
    			[
    				-5.21,
    				51.932
    			],
    			[
    				-5.196,
    				51.951
    			],
    			[
    				-5.154,
    				51.948
    			],
    			[
    				-5.143,
    				51.962
    			],
    			[
    				-5.085,
    				51.968
    			],
    			[
    				-5.072,
    				52.005
    			],
    			[
    				-5.075,
    				52.031
    			],
    			[
    				-5.021,
    				52.02
    			],
    			[
    				-4.992,
    				52.026
    			],
    			[
    				-4.97,
    				51.997
    			],
    			[
    				-4.92,
    				52.01
    			],
    			[
    				-4.91,
    				52.035
    			],
    			[
    				-4.879,
    				52.019
    			],
    			[
    				-4.841,
    				52.025
    			],
    			[
    				-4.831,
    				52.052
    			],
    			[
    				-4.791,
    				52.059
    			],
    			[
    				-4.759,
    				52.077
    			],
    			[
    				-4.732,
    				52.118
    			],
    			[
    				-4.688,
    				52.104
    			],
    			[
    				-4.686,
    				52.13
    			],
    			[
    				-4.642,
    				52.138
    			],
    			[
    				-4.519,
    				52.135
    			],
    			[
    				-4.46,
    				52.167
    			],
    			[
    				-4.445,
    				52.17
    			],
    			[
    				-4.378,
    				52.216
    			],
    			[
    				-4.325,
    				52.214
    			],
    			[
    				-4.208,
    				52.264
    			],
    			[
    				-4.14,
    				52.323
    			],
    			[
    				-4.09,
    				52.398
    			],
    			[
    				-4.086,
    				52.427
    			],
    			[
    				-4.07,
    				52.465
    			],
    			[
    				-4.052,
    				52.481
    			],
    			[
    				-4.054,
    				52.534
    			],
    			[
    				-4.014,
    				52.527
    			],
    			[
    				-3.984,
    				52.536
    			],
    			[
    				-3.96,
    				52.561
    			],
    			[
    				-4.064,
    				52.541
    			],
    			[
    				-4.126,
    				52.607
    			],
    			[
    				-4.095,
    				52.668
    			],
    			[
    				-4.057,
    				52.687
    			],
    			[
    				-4.059,
    				52.718
    			],
    			[
    				-4.15,
    				52.808
    			],
    			[
    				-4.119,
    				52.848
    			],
    			[
    				-4.148,
    				52.896
    			],
    			[
    				-4.103,
    				52.909
    			],
    			[
    				-4.129,
    				52.922
    			],
    			[
    				-4.152,
    				52.906
    			],
    			[
    				-4.219,
    				52.919
    			],
    			[
    				-4.261,
    				52.911
    			],
    			[
    				-4.316,
    				52.909
    			],
    			[
    				-4.327,
    				52.892
    			],
    			[
    				-4.38,
    				52.896
    			],
    			[
    				-4.457,
    				52.871
    			],
    			[
    				-4.47,
    				52.848
    			],
    			[
    				-4.496,
    				52.833
    			],
    			[
    				-4.498,
    				52.811
    			],
    			[
    				-4.515,
    				52.793
    			],
    			[
    				-4.601,
    				52.825
    			],
    			[
    				-4.644,
    				52.8
    			],
    			[
    				-4.688,
    				52.794
    			],
    			[
    				-4.721,
    				52.803
    			],
    			[
    				-4.732,
    				52.782
    			],
    			[
    				-4.767,
    				52.797
    			],
    			[
    				-4.722,
    				52.837
    			],
    			[
    				-4.726,
    				52.854
    			],
    			[
    				-4.696,
    				52.859
    			],
    			[
    				-4.669,
    				52.88
    			],
    			[
    				-4.65,
    				52.906
    			],
    			[
    				-4.57,
    				52.939
    			],
    			[
    				-4.52,
    				52.94
    			],
    			[
    				-4.472,
    				52.967
    			],
    			[
    				-4.437,
    				52.998
    			],
    			[
    				-4.41,
    				52.998
    			],
    			[
    				-4.354,
    				53.033
    			],
    			[
    				-4.337,
    				53.059
    			],
    			[
    				-4.338,
    				53.081
    			],
    			[
    				-4.319,
    				53.093
    			],
    			[
    				-4.312,
    				53.127
    			],
    			[
    				-4.283,
    				53.14
    			],
    			[
    				-4.212,
    				53.183
    			],
    			[
    				-4.199,
    				53.21
    			],
    			[
    				-4.123,
    				53.237
    			],
    			[
    				-4.086,
    				53.226
    			],
    			[
    				-4.007,
    				53.247
    			],
    			[
    				-3.983,
    				53.26
    			],
    			[
    				-3.846,
    				53.294
    			],
    			[
    				-3.845,
    				53.319
    			],
    			[
    				-3.775,
    				53.328
    			],
    			[
    				-3.706,
    				53.294
    			],
    			[
    				-3.606,
    				53.291
    			],
    			[
    				-3.481,
    				53.328
    			],
    			[
    				-3.363,
    				53.352
    			],
    			[
    				-3.31,
    				53.356
    			],
    			[
    				-3.304,
    				53.335
    			],
    			[
    				-3.203,
    				53.294
    			],
    			[
    				-3.135,
    				53.254
    			],
    			[
    				-3.094,
    				53.244
    			],
    			[
    				-3.078,
    				53.256
    			],
    			[
    				-3.09,
    				53.26
    			],
    			[
    				-3.095,
    				53.263
    			],
    			[
    				-3.122,
    				53.323
    			],
    			[
    				-3.186,
    				53.364
    			],
    			[
    				-3.2,
    				53.388
    			],
    			[
    				-3.041,
    				53.443
    			],
    			[
    				-3.003,
    				53.375
    			],
    			[
    				-2.929,
    				53.308
    			],
    			[
    				-2.9,
    				53.297
    			],
    			[
    				-2.856,
    				53.292
    			],
    			[
    				-2.816,
    				53.306
    			],
    			[
    				-2.789,
    				53.295
    			],
    			[
    				-2.753,
    				53.315
    			],
    			[
    				-2.827,
    				53.332
    			],
    			[
    				-2.878,
    				53.334
    			],
    			[
    				-2.975,
    				53.379
    			],
    			[
    				-3.002,
    				53.41
    			],
    			[
    				-3.009,
    				53.438
    			],
    			[
    				-3.041,
    				53.466
    			],
    			[
    				-3.072,
    				53.522
    			],
    			[
    				-3.1,
    				53.54
    			],
    			[
    				-3.104,
    				53.559
    			],
    			[
    				-3.043,
    				53.636
    			],
    			[
    				-2.938,
    				53.725
    			],
    			[
    				-3.039,
    				53.747
    			],
    			[
    				-3.057,
    				53.777
    			],
    			[
    				-3.048,
    				53.876
    			],
    			[
    				-3.05,
    				53.92
    			],
    			[
    				-2.999,
    				53.929
    			],
    			[
    				-2.924,
    				53.951
    			],
    			[
    				-2.905,
    				53.939
    			],
    			[
    				-2.862,
    				53.965
    			],
    			[
    				-2.898,
    				53.991
    			],
    			[
    				-2.906,
    				54.04
    			],
    			[
    				-2.882,
    				54.072
    			],
    			[
    				-2.826,
    				54.088
    			],
    			[
    				-2.82,
    				54.123
    			],
    			[
    				-2.836,
    				54.151
    			],
    			[
    				-2.864,
    				54.157
    			],
    			[
    				-2.864,
    				54.192
    			],
    			[
    				-2.905,
    				54.195
    			],
    			[
    				-2.935,
    				54.167
    			],
    			[
    				-2.932,
    				54.151
    			],
    			[
    				-3.014,
    				54.132
    			],
    			[
    				-3.002,
    				54.167
    			],
    			[
    				-3.039,
    				54.197
    			],
    			[
    				-3.063,
    				54.186
    			],
    			[
    				-3.061,
    				54.162
    			],
    			[
    				-3.106,
    				54.119
    			],
    			[
    				-3.172,
    				54.082
    			],
    			[
    				-3.194,
    				54.104
    			],
    			[
    				-3.22,
    				54.09
    			],
    			[
    				-3.242,
    				54.109
    			],
    			[
    				-3.237,
    				54.155
    			],
    			[
    				-3.257,
    				54.167
    			],
    			[
    				-3.217,
    				54.178
    			],
    			[
    				-3.213,
    				54.207
    			],
    			[
    				-3.198,
    				54.229
    			],
    			[
    				-3.21,
    				54.254
    			],
    			[
    				-3.288,
    				54.197
    			],
    			[
    				-3.322,
    				54.191
    			],
    			[
    				-3.394,
    				54.254
    			],
    			[
    				-3.421,
    				54.284
    			],
    			[
    				-3.414,
    				54.358
    			],
    			[
    				-3.435,
    				54.343
    			],
    			[
    				-3.51,
    				54.416
    			],
    			[
    				-3.639,
    				54.512
    			],
    			[
    				-3.59,
    				54.55
    			],
    			[
    				-3.566,
    				54.612
    			],
    			[
    				-3.572,
    				54.651
    			],
    			[
    				-3.519,
    				54.693
    			],
    			[
    				-3.507,
    				54.718
    			],
    			[
    				-3.439,
    				54.756
    			],
    			[
    				-3.438,
    				54.802
    			],
    			[
    				-3.4,
    				54.868
    			],
    			[
    				-3.378,
    				54.884
    			],
    			[
    				-3.34,
    				54.896
    			],
    			[
    				-3.302,
    				54.885
    			],
    			[
    				-3.275,
    				54.903
    			],
    			[
    				-3.313,
    				54.919
    			],
    			[
    				-3.285,
    				54.942
    			],
    			[
    				-3.204,
    				54.954
    			],
    			[
    				-3.13,
    				54.934
    			],
    			[
    				-3.131,
    				54.948
    			],
    			[
    				-3.104,
    				54.971
    			],
    			[
    				-3.076,
    				54.968
    			],
    			[
    				-3.054,
    				54.99
    			],
    			[
    				-3.092,
    				54.976
    			],
    			[
    				-3.114,
    				54.977
    			],
    			[
    				-3.149,
    				54.964
    			],
    			[
    				-3.205,
    				54.978
    			],
    			[
    				-3.269,
    				54.966
    			],
    			[
    				-3.331,
    				54.98
    			],
    			[
    				-3.371,
    				54.971
    			],
    			[
    				-3.408,
    				54.974
    			],
    			[
    				-3.437,
    				54.989
    			],
    			[
    				-3.476,
    				54.967
    			],
    			[
    				-3.522,
    				54.965
    			],
    			[
    				-3.576,
    				54.979
    			],
    			[
    				-3.59,
    				54.926
    			],
    			[
    				-3.563,
    				54.907
    			],
    			[
    				-3.595,
    				54.884
    			],
    			[
    				-3.595,
    				54.873
    			],
    			[
    				-3.727,
    				54.881
    			],
    			[
    				-3.76,
    				54.858
    			],
    			[
    				-3.788,
    				54.853
    			],
    			[
    				-3.856,
    				54.865
    			],
    			[
    				-3.864,
    				54.846
    			],
    			[
    				-3.831,
    				54.821
    			],
    			[
    				-3.984,
    				54.769
    			],
    			[
    				-4.045,
    				54.77
    			],
    			[
    				-4.064,
    				54.784
    			],
    			[
    				-4.046,
    				54.815
    			],
    			[
    				-4.064,
    				54.833
    			],
    			[
    				-4.091,
    				54.814
    			],
    			[
    				-4.09,
    				54.774
    			],
    			[
    				-4.16,
    				54.78
    			],
    			[
    				-4.18,
    				54.809
    			],
    			[
    				-4.209,
    				54.814
    			],
    			[
    				-4.228,
    				54.864
    			],
    			[
    				-4.257,
    				54.837
    			],
    			[
    				-4.307,
    				54.845
    			],
    			[
    				-4.363,
    				54.863
    			],
    			[
    				-4.405,
    				54.898
    			],
    			[
    				-4.421,
    				54.887
    			],
    			[
    				-4.412,
    				54.828
    			],
    			[
    				-4.354,
    				54.813
    			],
    			[
    				-4.341,
    				54.799
    			],
    			[
    				-4.36,
    				54.778
    			],
    			[
    				-4.367,
    				54.723
    			],
    			[
    				-4.35,
    				54.709
    			],
    			[
    				-4.393,
    				54.677
    			],
    			[
    				-4.484,
    				54.7
    			],
    			[
    				-4.572,
    				54.738
    			],
    			[
    				-4.601,
    				54.777
    			],
    			[
    				-4.672,
    				54.8
    			],
    			[
    				-4.709,
    				54.824
    			],
    			[
    				-4.777,
    				54.832
    			],
    			[
    				-4.818,
    				54.867
    			],
    			[
    				-4.936,
    				54.833
    			],
    			[
    				-4.961,
    				54.804
    			],
    			[
    				-4.917,
    				54.743
    			],
    			[
    				-4.906,
    				54.701
    			],
    			[
    				-4.867,
    				54.682
    			],
    			[
    				-4.884,
    				54.654
    			],
    			[
    				-4.922,
    				54.643
    			],
    			[
    				-4.965,
    				54.664
    			],
    			[
    				-4.973,
    				54.69
    			],
    			[
    				-4.948,
    				54.7
    			],
    			[
    				-4.992,
    				54.735
    			],
    			[
    				-5.011,
    				54.783
    			],
    			[
    				-5.042,
    				54.792
    			],
    			[
    				-5.054,
    				54.81
    			],
    			[
    				-5.138,
    				54.851
    			],
    			[
    				-5.185,
    				54.915
    			],
    			[
    				-5.179,
    				54.987
    			],
    			[
    				-5.157,
    				55.009
    			],
    			[
    				-5.1,
    				55.018
    			],
    			[
    				-5.061,
    				54.968
    			],
    			[
    				-5.075,
    				54.964
    			],
    			[
    				-5.062,
    				54.925
    			],
    			[
    				-5.03,
    				54.906
    			],
    			[
    				-4.997,
    				54.912
    			],
    			[
    				-4.996,
    				54.936
    			],
    			[
    				-5.06,
    				55.026
    			],
    			[
    				-5.052,
    				55.051
    			],
    			[
    				-5.006,
    				55.094
    			],
    			[
    				-4.992,
    				55.143
    			],
    			[
    				-4.941,
    				55.164
    			],
    			[
    				-4.911,
    				55.198
    			],
    			[
    				-4.86,
    				55.227
    			],
    			[
    				-4.836,
    				55.283
    			],
    			[
    				-4.845,
    				55.325
    			],
    			[
    				-4.775,
    				55.36
    			],
    			[
    				-4.77,
    				55.401
    			],
    			[
    				-4.754,
    				55.416
    			],
    			[
    				-4.713,
    				55.433
    			],
    			[
    				-4.648,
    				55.437
    			],
    			[
    				-4.646,
    				55.47
    			],
    			[
    				-4.62,
    				55.498
    			],
    			[
    				-4.631,
    				55.518
    			],
    			[
    				-4.663,
    				55.542
    			],
    			[
    				-4.658,
    				55.57
    			],
    			[
    				-4.698,
    				55.606
    			],
    			[
    				-4.756,
    				55.631
    			],
    			[
    				-4.816,
    				55.648
    			],
    			[
    				-4.863,
    				55.684
    			],
    			[
    				-4.905,
    				55.699
    			],
    			[
    				-4.903,
    				55.722
    			],
    			[
    				-4.873,
    				55.73
    			],
    			[
    				-4.857,
    				55.747
    			],
    			[
    				-4.855,
    				55.774
    			],
    			[
    				-4.888,
    				55.819
    			],
    			[
    				-4.889,
    				55.875
    			],
    			[
    				-4.896,
    				55.894
    			],
    			[
    				-4.879,
    				55.943
    			],
    			[
    				-4.818,
    				55.963
    			],
    			[
    				-4.765,
    				55.958
    			],
    			[
    				-4.671,
    				55.933
    			],
    			[
    				-4.563,
    				55.935
    			],
    			[
    				-4.666,
    				55.958
    			],
    			[
    				-4.701,
    				55.993
    			],
    			[
    				-4.788,
    				56.015
    			],
    			[
    				-4.831,
    				56.08
    			],
    			[
    				-4.837,
    				56.05
    			],
    			[
    				-4.793,
    				56.001
    			],
    			[
    				-4.841,
    				55.987
    			],
    			[
    				-4.86,
    				56.006
    			],
    			[
    				-4.879,
    				56.054
    			],
    			[
    				-4.832,
    				56.124
    			],
    			[
    				-4.914,
    				56.051
    			],
    			[
    				-4.898,
    				55.984
    			],
    			[
    				-4.961,
    				56.005
    			],
    			[
    				-4.961,
    				55.99
    			],
    			[
    				-4.909,
    				55.967
    			],
    			[
    				-4.934,
    				55.943
    			],
    			[
    				-4.979,
    				55.862
    			],
    			[
    				-5.045,
    				55.871
    			],
    			[
    				-5.068,
    				55.952
    			],
    			[
    				-5.082,
    				55.938
    			],
    			[
    				-5.077,
    				55.898
    			],
    			[
    				-5.112,
    				55.902
    			],
    			[
    				-5.179,
    				55.933
    			],
    			[
    				-5.203,
    				55.926
    			],
    			[
    				-5.242,
    				55.894
    			],
    			[
    				-5.209,
    				55.856
    			],
    			[
    				-5.204,
    				55.828
    			],
    			[
    				-5.253,
    				55.847
    			],
    			[
    				-5.313,
    				55.857
    			],
    			[
    				-5.314,
    				55.878
    			],
    			[
    				-5.352,
    				55.898
    			],
    			[
    				-5.327,
    				55.956
    			],
    			[
    				-5.346,
    				55.971
    			],
    			[
    				-5.339,
    				55.997
    			],
    			[
    				-5.302,
    				56.024
    			],
    			[
    				-5.284,
    				56.055
    			],
    			[
    				-5.21,
    				56.105
    			],
    			[
    				-5.203,
    				56.129
    			],
    			[
    				-5.101,
    				56.157
    			],
    			[
    				-5.083,
    				56.167
    			],
    			[
    				-5.04,
    				56.234
    			],
    			[
    				-5.054,
    				56.246
    			],
    			[
    				-5.104,
    				56.202
    			],
    			[
    				-5.117,
    				56.171
    			],
    			[
    				-5.146,
    				56.157
    			],
    			[
    				-5.193,
    				56.149
    			],
    			[
    				-5.236,
    				56.128
    			],
    			[
    				-5.257,
    				56.097
    			],
    			[
    				-5.282,
    				56.089
    			],
    			[
    				-5.295,
    				56.07
    			],
    			[
    				-5.341,
    				56.051
    			],
    			[
    				-5.358,
    				56.025
    			],
    			[
    				-5.407,
    				56.001
    			],
    			[
    				-5.446,
    				56.021
    			],
    			[
    				-5.451,
    				55.972
    			],
    			[
    				-5.429,
    				55.947
    			],
    			[
    				-5.419,
    				55.897
    			],
    			[
    				-5.396,
    				55.871
    			],
    			[
    				-5.34,
    				55.827
    			],
    			[
    				-5.315,
    				55.783
    			],
    			[
    				-5.394,
    				55.752
    			],
    			[
    				-5.451,
    				55.707
    			],
    			[
    				-5.449,
    				55.688
    			],
    			[
    				-5.484,
    				55.643
    			],
    			[
    				-5.47,
    				55.582
    			],
    			[
    				-5.493,
    				55.571
    			],
    			[
    				-5.49,
    				55.53
    			],
    			[
    				-5.504,
    				55.527
    			],
    			[
    				-5.51,
    				55.488
    			],
    			[
    				-5.546,
    				55.466
    			],
    			[
    				-5.552,
    				55.418
    			],
    			[
    				-5.526,
    				55.392
    			],
    			[
    				-5.52,
    				55.361
    			],
    			[
    				-5.562,
    				55.324
    			],
    			[
    				-5.604,
    				55.308
    			],
    			[
    				-5.686,
    				55.309
    			],
    			[
    				-5.72,
    				55.293
    			],
    			[
    				-5.755,
    				55.29
    			],
    			[
    				-5.802,
    				55.303
    			],
    			[
    				-5.796,
    				55.391
    			],
    			[
    				-5.722,
    				55.427
    			],
    			[
    				-5.715,
    				55.447
    			],
    			[
    				-5.714,
    				55.521
    			],
    			[
    				-5.704,
    				55.533
    			],
    			[
    				-5.716,
    				55.574
    			],
    			[
    				-5.693,
    				55.587
    			],
    			[
    				-5.663,
    				55.668
    			],
    			[
    				-5.677,
    				55.682
    			],
    			[
    				-5.62,
    				55.71
    			],
    			[
    				-5.57,
    				55.767
    			],
    			[
    				-5.553,
    				55.767
    			],
    			[
    				-5.482,
    				55.805
    			],
    			[
    				-5.607,
    				55.774
    			],
    			[
    				-5.664,
    				55.799
    			],
    			[
    				-5.665,
    				55.832
    			],
    			[
    				-5.634,
    				55.881
    			],
    			[
    				-5.598,
    				55.915
    			],
    			[
    				-5.609,
    				55.929
    			],
    			[
    				-5.678,
    				55.887
    			],
    			[
    				-5.688,
    				55.911
    			],
    			[
    				-5.64,
    				55.99
    			],
    			[
    				-5.715,
    				55.949
    			],
    			[
    				-5.657,
    				56.023
    			],
    			[
    				-5.636,
    				56.029
    			],
    			[
    				-5.633,
    				56.053
    			],
    			[
    				-5.585,
    				56.092
    			],
    			[
    				-5.501,
    				56.186
    			],
    			[
    				-5.533,
    				56.181
    			],
    			[
    				-5.591,
    				56.152
    			],
    			[
    				-5.602,
    				56.162
    			],
    			[
    				-5.541,
    				56.218
    			],
    			[
    				-5.566,
    				56.237
    			],
    			[
    				-5.481,
    				56.257
    			],
    			[
    				-5.562,
    				56.261
    			],
    			[
    				-5.596,
    				56.25
    			],
    			[
    				-5.578,
    				56.333
    			],
    			[
    				-5.538,
    				56.36
    			],
    			[
    				-5.514,
    				56.396
    			],
    			[
    				-5.473,
    				56.413
    			],
    			[
    				-5.484,
    				56.436
    			],
    			[
    				-5.436,
    				56.447
    			],
    			[
    				-5.35,
    				56.46
    			],
    			[
    				-5.269,
    				56.451
    			],
    			[
    				-5.235,
    				56.437
    			],
    			[
    				-5.19,
    				56.449
    			],
    			[
    				-5.129,
    				56.493
    			],
    			[
    				-5.156,
    				56.501
    			],
    			[
    				-5.184,
    				56.461
    			],
    			[
    				-5.23,
    				56.447
    			],
    			[
    				-5.257,
    				56.464
    			],
    			[
    				-5.288,
    				56.46
    			],
    			[
    				-5.347,
    				56.472
    			],
    			[
    				-5.367,
    				56.459
    			],
    			[
    				-5.407,
    				56.459
    			],
    			[
    				-5.405,
    				56.484
    			],
    			[
    				-5.427,
    				56.496
    			],
    			[
    				-5.432,
    				56.522
    			],
    			[
    				-5.383,
    				56.524
    			],
    			[
    				-5.408,
    				56.561
    			],
    			[
    				-5.369,
    				56.566
    			],
    			[
    				-5.384,
    				56.582
    			],
    			[
    				-5.296,
    				56.639
    			],
    			[
    				-5.317,
    				56.653
    			],
    			[
    				-5.273,
    				56.67
    			],
    			[
    				-5.252,
    				56.666
    			],
    			[
    				-5.224,
    				56.686
    			],
    			[
    				-5.247,
    				56.703
    			],
    			[
    				-5.229,
    				56.729
    			],
    			[
    				-5.102,
    				56.827
    			],
    			[
    				-5.192,
    				56.855
    			],
    			[
    				-5.329,
    				56.858
    			],
    			[
    				-5.321,
    				56.851
    			],
    			[
    				-5.254,
    				56.843
    			],
    			[
    				-5.18,
    				56.847
    			],
    			[
    				-5.127,
    				56.822
    			],
    			[
    				-5.234,
    				56.756
    			],
    			[
    				-5.257,
    				56.732
    			],
    			[
    				-5.243,
    				56.72
    			],
    			[
    				-5.288,
    				56.71
    			],
    			[
    				-5.361,
    				56.683
    			],
    			[
    				-5.356,
    				56.676
    			],
    			[
    				-5.399,
    				56.647
    			],
    			[
    				-5.434,
    				56.643
    			],
    			[
    				-5.488,
    				56.61
    			],
    			[
    				-5.552,
    				56.551
    			],
    			[
    				-5.573,
    				56.539
    			],
    			[
    				-5.684,
    				56.497
    			],
    			[
    				-5.695,
    				56.512
    			],
    			[
    				-5.771,
    				56.533
    			],
    			[
    				-5.905,
    				56.551
    			],
    			[
    				-5.96,
    				56.582
    			],
    			[
    				-5.978,
    				56.61
    			],
    			[
    				-6.001,
    				56.62
    			],
    			[
    				-6.004,
    				56.649
    			],
    			[
    				-5.906,
    				56.658
    			],
    			[
    				-5.877,
    				56.654
    			],
    			[
    				-5.819,
    				56.667
    			],
    			[
    				-5.747,
    				56.702
    			],
    			[
    				-5.779,
    				56.706
    			],
    			[
    				-5.835,
    				56.675
    			],
    			[
    				-5.861,
    				56.681
    			],
    			[
    				-5.926,
    				56.676
    			],
    			[
    				-5.946,
    				56.689
    			],
    			[
    				-6.03,
    				56.68
    			],
    			[
    				-6.052,
    				56.693
    			],
    			[
    				-6.142,
    				56.683
    			],
    			[
    				-6.188,
    				56.688
    			],
    			[
    				-6.218,
    				56.703
    			],
    			[
    				-6.227,
    				56.726
    			],
    			[
    				-6.186,
    				56.755
    			],
    			[
    				-6.168,
    				56.752
    			],
    			[
    				-6.118,
    				56.766
    			],
    			[
    				-6.065,
    				56.759
    			],
    			[
    				-6.05,
    				56.767
    			],
    			[
    				-5.982,
    				56.769
    			],
    			[
    				-5.965,
    				56.784
    			],
    			[
    				-5.909,
    				56.75
    			],
    			[
    				-5.862,
    				56.778
    			],
    			[
    				-5.804,
    				56.784
    			],
    			[
    				-5.795,
    				56.795
    			],
    			[
    				-5.865,
    				56.811
    			],
    			[
    				-5.858,
    				56.83
    			],
    			[
    				-5.814,
    				56.832
    			],
    			[
    				-5.757,
    				56.848
    			],
    			[
    				-5.789,
    				56.86
    			],
    			[
    				-5.738,
    				56.896
    			],
    			[
    				-5.864,
    				56.884
    			],
    			[
    				-5.887,
    				56.874
    			],
    			[
    				-5.918,
    				56.883
    			],
    			[
    				-5.86,
    				56.948
    			],
    			[
    				-5.824,
    				57.009
    			],
    			[
    				-5.727,
    				57.018
    			],
    			[
    				-5.709,
    				56.991
    			],
    			[
    				-5.635,
    				56.97
    			],
    			[
    				-5.613,
    				56.984
    			],
    			[
    				-5.661,
    				56.994
    			],
    			[
    				-5.708,
    				57.041
    			],
    			[
    				-5.744,
    				57.031
    			],
    			[
    				-5.762,
    				57.051
    			],
    			[
    				-5.797,
    				57.066
    			],
    			[
    				-5.725,
    				57.101
    			],
    			[
    				-5.722,
    				57.118
    			],
    			[
    				-5.654,
    				57.127
    			],
    			[
    				-5.592,
    				57.119
    			],
    			[
    				-5.567,
    				57.096
    			],
    			[
    				-5.52,
    				57.081
    			],
    			[
    				-5.51,
    				57.098
    			],
    			[
    				-5.553,
    				57.113
    			],
    			[
    				-5.562,
    				57.134
    			],
    			[
    				-5.611,
    				57.146
    			],
    			[
    				-5.661,
    				57.143
    			],
    			[
    				-5.689,
    				57.173
    			],
    			[
    				-5.632,
    				57.2
    			],
    			[
    				-5.624,
    				57.22
    			],
    			[
    				-5.656,
    				57.228
    			],
    			[
    				-5.637,
    				57.25
    			],
    			[
    				-5.584,
    				57.256
    			],
    			[
    				-5.531,
    				57.271
    			],
    			[
    				-5.477,
    				57.233
    			],
    			[
    				-5.427,
    				57.213
    			],
    			[
    				-5.415,
    				57.23
    			],
    			[
    				-5.451,
    				57.237
    			],
    			[
    				-5.514,
    				57.278
    			],
    			[
    				-5.558,
    				57.284
    			],
    			[
    				-5.592,
    				57.271
    			],
    			[
    				-5.648,
    				57.287
    			],
    			[
    				-5.718,
    				57.284
    			],
    			[
    				-5.729,
    				57.297
    			],
    			[
    				-5.686,
    				57.341
    			],
    			[
    				-5.65,
    				57.334
    			],
    			[
    				-5.534,
    				57.353
    			],
    			[
    				-5.457,
    				57.391
    			],
    			[
    				-5.474,
    				57.409
    			],
    			[
    				-5.556,
    				57.358
    			],
    			[
    				-5.602,
    				57.355
    			],
    			[
    				-5.634,
    				57.38
    			],
    			[
    				-5.689,
    				57.379
    			],
    			[
    				-5.738,
    				57.354
    			],
    			[
    				-5.788,
    				57.346
    			],
    			[
    				-5.819,
    				57.389
    			],
    			[
    				-5.823,
    				57.416
    			],
    			[
    				-5.806,
    				57.439
    			],
    			[
    				-5.854,
    				57.443
    			],
    			[
    				-5.873,
    				57.474
    			],
    			[
    				-5.836,
    				57.579
    			],
    			[
    				-5.812,
    				57.586
    			],
    			[
    				-5.768,
    				57.559
    			],
    			[
    				-5.743,
    				57.554
    			],
    			[
    				-5.65,
    				57.511
    			],
    			[
    				-5.623,
    				57.532
    			],
    			[
    				-5.562,
    				57.539
    			],
    			[
    				-5.534,
    				57.552
    			],
    			[
    				-5.634,
    				57.556
    			],
    			[
    				-5.666,
    				57.546
    			],
    			[
    				-5.686,
    				57.577
    			],
    			[
    				-5.728,
    				57.586
    			],
    			[
    				-5.733,
    				57.607
    			],
    			[
    				-5.756,
    				57.624
    			],
    			[
    				-5.8,
    				57.641
    			],
    			[
    				-5.789,
    				57.697
    			],
    			[
    				-5.694,
    				57.712
    			],
    			[
    				-5.696,
    				57.73
    			],
    			[
    				-5.76,
    				57.731
    			],
    			[
    				-5.813,
    				57.75
    			],
    			[
    				-5.801,
    				57.793
    			],
    			[
    				-5.814,
    				57.858
    			],
    			[
    				-5.761,
    				57.87
    			],
    			[
    				-5.683,
    				57.865
    			],
    			[
    				-5.693,
    				57.844
    			],
    			[
    				-5.661,
    				57.823
    			],
    			[
    				-5.669,
    				57.8
    			],
    			[
    				-5.623,
    				57.768
    			],
    			[
    				-5.605,
    				57.787
    			],
    			[
    				-5.582,
    				57.836
    			],
    			[
    				-5.605,
    				57.851
    			],
    			[
    				-5.643,
    				57.856
    			],
    			[
    				-5.656,
    				57.889
    			],
    			[
    				-5.618,
    				57.924
    			],
    			[
    				-5.561,
    				57.918
    			],
    			[
    				-5.54,
    				57.87
    			],
    			[
    				-5.468,
    				57.853
    			],
    			[
    				-5.442,
    				57.87
    			],
    			[
    				-5.422,
    				57.909
    			],
    			[
    				-5.347,
    				57.885
    			],
    			[
    				-5.325,
    				57.866
    			],
    			[
    				-5.232,
    				57.847
    			],
    			[
    				-5.248,
    				57.867
    			],
    			[
    				-5.311,
    				57.879
    			],
    			[
    				-5.34,
    				57.907
    			],
    			[
    				-5.394,
    				57.912
    			],
    			[
    				-5.404,
    				57.931
    			],
    			[
    				-5.362,
    				57.938
    			],
    			[
    				-5.33,
    				57.914
    			],
    			[
    				-5.297,
    				57.91
    			],
    			[
    				-5.24,
    				57.918
    			],
    			[
    				-5.151,
    				57.876
    			],
    			[
    				-5.152,
    				57.896
    			],
    			[
    				-5.224,
    				57.925
    			],
    			[
    				-5.179,
    				57.941
    			],
    			[
    				-5.192,
    				57.958
    			],
    			[
    				-5.226,
    				57.958
    			],
    			[
    				-5.246,
    				57.971
    			],
    			[
    				-5.311,
    				57.979
    			],
    			[
    				-5.307,
    				57.988
    			],
    			[
    				-5.362,
    				58.028
    			],
    			[
    				-5.42,
    				58.033
    			],
    			[
    				-5.413,
    				58.053
    			],
    			[
    				-5.444,
    				58.062
    			],
    			[
    				-5.446,
    				58.098
    			],
    			[
    				-5.427,
    				58.106
    			],
    			[
    				-5.353,
    				58.075
    			],
    			[
    				-5.301,
    				58.064
    			],
    			[
    				-5.282,
    				58.074
    			],
    			[
    				-5.279,
    				58.115
    			],
    			[
    				-5.362,
    				58.218
    			],
    			[
    				-5.404,
    				58.236
    			],
    			[
    				-5.368,
    				58.251
    			],
    			[
    				-5.32,
    				58.24
    			],
    			[
    				-5.31,
    				58.224
    			],
    			[
    				-5.243,
    				58.25
    			],
    			[
    				-5.204,
    				58.247
    			],
    			[
    				-5.165,
    				58.258
    			],
    			[
    				-5.122,
    				58.259
    			],
    			[
    				-5.109,
    				58.27
    			],
    			[
    				-5.056,
    				58.247
    			],
    			[
    				-5.047,
    				58.257
    			],
    			[
    				-5.109,
    				58.275
    			],
    			[
    				-5.121,
    				58.294
    			],
    			[
    				-5.147,
    				58.302
    			],
    			[
    				-5.127,
    				58.32
    			],
    			[
    				-5.175,
    				58.346
    			],
    			[
    				-5.176,
    				58.362
    			],
    			[
    				-5.116,
    				58.396
    			],
    			[
    				-5.116,
    				58.428
    			],
    			[
    				-5.084,
    				58.438
    			],
    			[
    				-5.077,
    				58.457
    			],
    			[
    				-5.102,
    				58.483
    			],
    			[
    				-5.126,
    				58.489
    			],
    			[
    				-5.113,
    				58.522
    			],
    			[
    				-5.091,
    				58.537
    			],
    			[
    				-5.051,
    				58.541
    			],
    			[
    				-5.017,
    				58.576
    			],
    			[
    				-5.007,
    				58.626
    			],
    			[
    				-4.946,
    				58.609
    			],
    			[
    				-4.936,
    				58.617
    			],
    			[
    				-4.876,
    				58.615
    			],
    			[
    				-4.825,
    				58.597
    			],
    			[
    				-4.797,
    				58.576
    			],
    			[
    				-4.742,
    				58.584
    			],
    			[
    				-4.734,
    				58.566
    			],
    			[
    				-4.676,
    				58.549
    			],
    			[
    				-4.654,
    				58.551
    			],
    			[
    				-4.725,
    				58.465
    			],
    			[
    				-4.664,
    				58.483
    			],
    			[
    				-4.67,
    				58.498
    			],
    			[
    				-4.644,
    				58.519
    			],
    			[
    				-4.595,
    				58.534
    			],
    			[
    				-4.599,
    				58.564
    			],
    			[
    				-4.585,
    				58.578
    			],
    			[
    				-4.509,
    				58.577
    			],
    			[
    				-4.424,
    				58.55
    			],
    			[
    				-4.431,
    				58.53
    			],
    			[
    				-4.409,
    				58.522
    			],
    			[
    				-4.455,
    				58.496
    			],
    			[
    				-4.421,
    				58.493
    			],
    			[
    				-4.383,
    				58.51
    			],
    			[
    				-4.352,
    				58.537
    			],
    			[
    				-4.305,
    				58.543
    			],
    			[
    				-4.263,
    				58.526
    			],
    			[
    				-4.213,
    				58.53
    			],
    			[
    				-4.176,
    				58.541
    			],
    			[
    				-4.153,
    				58.563
    			],
    			[
    				-4.126,
    				58.569
    			],
    			[
    				-4.094,
    				58.557
    			],
    			[
    				-4.047,
    				58.572
    			],
    			[
    				-4.005,
    				58.564
    			],
    			[
    				-3.957,
    				58.574
    			],
    			[
    				-3.907,
    				58.563
    			],
    			[
    				-3.859,
    				58.563
    			],
    			[
    				-3.801,
    				58.574
    			],
    			[
    				-3.778,
    				58.567
    			],
    			[
    				-3.719,
    				58.597
    			],
    			[
    				-3.631,
    				58.615
    			],
    			[
    				-3.536,
    				58.623
    			],
    			[
    				-3.552,
    				58.608
    			],
    			[
    				-3.525,
    				58.597
    			],
    			[
    				-3.46,
    				58.612
    			],
    			[
    				-3.371,
    				58.594
    			],
    			[
    				-3.349,
    				58.619
    			],
    			[
    				-3.413,
    				58.641
    			],
    			[
    				-3.404,
    				58.661
    			],
    			[
    				-3.377,
    				58.672
    			],
    			[
    				-3.344,
    				58.647
    			],
    			[
    				-3.31,
    				58.643
    			],
    			[
    				-3.277,
    				58.653
    			],
    			[
    				-3.227,
    				58.65
    			],
    			[
    				-3.19,
    				58.66
    			],
    			[
    				-3.158,
    				58.637
    			],
    			[
    				-3.1,
    				58.647
    			],
    			[
    				-3.025,
    				58.644
    			],
    			[
    				-3.043,
    				58.598
    			],
    			[
    				-3.068,
    				58.564
    			],
    			[
    				-3.126,
    				58.527
    			],
    			[
    				-3.135,
    				58.501
    			],
    			[
    				-3.104,
    				58.474
    			],
    			[
    				-3.049,
    				58.476
    			],
    			[
    				-3.06,
    				58.442
    			],
    			[
    				-3.091,
    				58.412
    			],
    			[
    				-3.108,
    				58.371
    			],
    			[
    				-3.221,
    				58.305
    			],
    			[
    				-3.291,
    				58.298
    			],
    			[
    				-3.297,
    				58.289
    			],
    			[
    				-3.381,
    				58.27
    			],
    			[
    				-3.428,
    				58.247
    			],
    			[
    				-3.51,
    				58.171
    			],
    			[
    				-3.658,
    				58.113
    			],
    			[
    				-3.745,
    				58.068
    			],
    			[
    				-3.804,
    				58.057
    			],
    			[
    				-3.833,
    				58.039
    			],
    			[
    				-3.848,
    				58.007
    			],
    			[
    				-3.872,
    				57.996
    			],
    			[
    				-3.983,
    				57.97
    			],
    			[
    				-4.004,
    				57.935
    			],
    			[
    				-3.992,
    				57.903
    			],
    			[
    				-4.013,
    				57.891
    			],
    			[
    				-4.011,
    				57.859
    			],
    			[
    				-4.073,
    				57.867
    			],
    			[
    				-4.112,
    				57.849
    			],
    			[
    				-4.175,
    				57.868
    			],
    			[
    				-4.232,
    				57.875
    			],
    			[
    				-4.3,
    				57.862
    			],
    			[
    				-4.297,
    				57.852
    			],
    			[
    				-4.194,
    				57.863
    			],
    			[
    				-4.164,
    				57.834
    			],
    			[
    				-4.119,
    				57.829
    			],
    			[
    				-4.099,
    				57.837
    			],
    			[
    				-4.044,
    				57.814
    			],
    			[
    				-3.961,
    				57.846
    			],
    			[
    				-3.894,
    				57.825
    			],
    			[
    				-3.859,
    				57.825
    			],
    			[
    				-3.828,
    				57.835
    			],
    			[
    				-3.813,
    				57.86
    			],
    			[
    				-3.772,
    				57.867
    			],
    			[
    				-3.793,
    				57.837
    			],
    			[
    				-3.916,
    				57.753
    			],
    			[
    				-3.975,
    				57.695
    			],
    			[
    				-4.036,
    				57.695
    			],
    			[
    				-4.008,
    				57.73
    			],
    			[
    				-4.073,
    				57.732
    			],
    			[
    				-4.168,
    				57.685
    			],
    			[
    				-4.207,
    				57.693
    			],
    			[
    				-4.239,
    				57.68
    			],
    			[
    				-4.289,
    				57.681
    			],
    			[
    				-4.305,
    				57.657
    			],
    			[
    				-4.338,
    				57.65
    			],
    			[
    				-4.381,
    				57.622
    			],
    			[
    				-4.403,
    				57.594
    			],
    			[
    				-4.232,
    				57.668
    			],
    			[
    				-4.166,
    				57.676
    			],
    			[
    				-4.165,
    				57.657
    			],
    			[
    				-4.086,
    				57.665
    			],
    			[
    				-4.036,
    				57.684
    			],
    			[
    				-3.995,
    				57.677
    			],
    			[
    				-4.102,
    				57.608
    			],
    			[
    				-4.133,
    				57.578
    			],
    			[
    				-4.174,
    				57.566
    			],
    			[
    				-4.234,
    				57.501
    			],
    			[
    				-4.383,
    				57.512
    			],
    			[
    				-4.396,
    				57.499
    			],
    			[
    				-4.349,
    				57.487
    			],
    			[
    				-4.289,
    				57.481
    			],
    			[
    				-4.222,
    				57.496
    			],
    			[
    				-4.192,
    				57.484
    			],
    			[
    				-4.113,
    				57.516
    			],
    			[
    				-4.102,
    				57.535
    			],
    			[
    				-4.041,
    				57.56
    			],
    			[
    				-4.058,
    				57.591
    			],
    			[
    				-4.008,
    				57.6
    			],
    			[
    				-3.931,
    				57.586
    			],
    			[
    				-3.87,
    				57.59
    			],
    			[
    				-3.722,
    				57.651
    			],
    			[
    				-3.644,
    				57.663
    			],
    			[
    				-3.528,
    				57.664
    			],
    			[
    				-3.497,
    				57.679
    			],
    			[
    				-3.498,
    				57.704
    			],
    			[
    				-3.46,
    				57.704
    			],
    			[
    				-3.342,
    				57.725
    			],
    			[
    				-3.279,
    				57.719
    			],
    			[
    				-3.176,
    				57.689
    			],
    			[
    				-3.027,
    				57.664
    			],
    			[
    				-2.934,
    				57.687
    			],
    			[
    				-2.88,
    				57.705
    			],
    			[
    				-2.848,
    				57.706
    			],
    			[
    				-2.828,
    				57.693
    			],
    			[
    				-2.791,
    				57.7
    			],
    			[
    				-2.74,
    				57.682
    			],
    			[
    				-2.714,
    				57.693
    			],
    			[
    				-2.684,
    				57.683
    			],
    			[
    				-2.584,
    				57.678
    			],
    			[
    				-2.511,
    				57.666
    			],
    			[
    				-2.497,
    				57.673
    			],
    			[
    				-2.396,
    				57.668
    			],
    			[
    				-2.298,
    				57.696
    			],
    			[
    				-2.263,
    				57.679
    			],
    			[
    				-2.212,
    				57.68
    			],
    			[
    				-2.192,
    				57.671
    			],
    			[
    				-2.118,
    				57.701
    			],
    			[
    				-2.042,
    				57.692
    			],
    			[
    				-2.004,
    				57.699
    			],
    			[
    				-1.995,
    				57.681
    			],
    			[
    				-1.929,
    				57.676
    			],
    			[
    				-1.891,
    				57.634
    			],
    			[
    				-1.826,
    				57.615
    			],
    			[
    				-1.826,
    				57.568
    			],
    			[
    				-1.804,
    				57.556
    			],
    			[
    				-1.805,
    				57.529
    			],
    			[
    				-1.791,
    				57.502
    			],
    			[
    				-1.796,
    				57.485
    			],
    			[
    				-1.776,
    				57.473
    			],
    			[
    				-1.801,
    				57.454
    			],
    			[
    				-1.832,
    				57.415
    			],
    			[
    				-1.861,
    				57.407
    			],
    			[
    				-1.859,
    				57.39
    			],
    			[
    				-1.91,
    				57.366
    			],
    			[
    				-1.987,
    				57.31
    			],
    			[
    				-2.061,
    				57.212
    			],
    			[
    				-2.077,
    				57.178
    			],
    			[
    				-2.078,
    				57.141
    			],
    			[
    				-2.047,
    				57.14
    			],
    			[
    				-2.092,
    				57.068
    			],
    			[
    				-2.161,
    				57.018
    			],
    			[
    				-2.177,
    				56.98
    			],
    			[
    				-2.209,
    				56.968
    			],
    			[
    				-2.197,
    				56.909
    			],
    			[
    				-2.23,
    				56.867
    			],
    			[
    				-2.269,
    				56.845
    			],
    			[
    				-2.325,
    				56.796
    			],
    			[
    				-2.376,
    				56.774
    			],
    			[
    				-2.401,
    				56.774
    			],
    			[
    				-2.424,
    				56.755
    			],
    			[
    				-2.452,
    				56.705
    			],
    			[
    				-2.445,
    				56.684
    			],
    			[
    				-2.484,
    				56.672
    			],
    			[
    				-2.511,
    				56.652
    			],
    			[
    				-2.502,
    				56.63
    			],
    			[
    				-2.48,
    				56.621
    			],
    			[
    				-2.537,
    				56.567
    			],
    			[
    				-2.606,
    				56.55
    			],
    			[
    				-2.637,
    				56.527
    			],
    			[
    				-2.716,
    				56.495
    			],
    			[
    				-2.733,
    				56.466
    			],
    			[
    				-2.795,
    				56.481
    			],
    			[
    				-2.87,
    				56.462
    			],
    			[
    				-2.89,
    				56.468
    			],
    			[
    				-2.939,
    				56.465
    			],
    			[
    				-3.003,
    				56.451
    			],
    			[
    				-3.052,
    				56.458
    			],
    			[
    				-3.127,
    				56.431
    			],
    			[
    				-3.229,
    				56.368
    			],
    			[
    				-3.226,
    				56.355
    			],
    			[
    				-3.04,
    				56.416
    			],
    			[
    				-2.99,
    				56.421
    			],
    			[
    				-2.921,
    				56.452
    			],
    			[
    				-2.878,
    				56.45
    			],
    			[
    				-2.855,
    				56.439
    			],
    			[
    				-2.803,
    				56.438
    			],
    			[
    				-2.815,
    				56.389
    			],
    			[
    				-2.864,
    				56.364
    			],
    			[
    				-2.778,
    				56.333
    			],
    			[
    				-2.66,
    				56.318
    			],
    			[
    				-2.63,
    				56.293
    			],
    			[
    				-2.589,
    				56.28
    			],
    			[
    				-2.692,
    				56.221
    			],
    			[
    				-2.782,
    				56.201
    			],
    			[
    				-2.812,
    				56.184
    			],
    			[
    				-2.869,
    				56.187
    			],
    			[
    				-2.89,
    				56.206
    			],
    			[
    				-2.943,
    				56.214
    			],
    			[
    				-3.046,
    				56.168
    			],
    			[
    				-3.107,
    				56.131
    			],
    			[
    				-3.151,
    				56.117
    			],
    			[
    				-3.174,
    				56.063
    			],
    			[
    				-3.217,
    				56.064
    			],
    			[
    				-3.295,
    				56.053
    			],
    			[
    				-3.322,
    				56.034
    			],
    			[
    				-3.388,
    				56.023
    			],
    			[
    				-3.439,
    				56.024
    			],
    			[
    				-3.522,
    				56.042
    			],
    			[
    				-3.55,
    				56.042
    			],
    			[
    				-3.575,
    				56.059
    			],
    			[
    				-3.686,
    				56.048
    			],
    			[
    				-3.74,
    				56.077
    			],
    			[
    				-3.723,
    				56.025
    			],
    			[
    				-3.682,
    				56.036
    			],
    			[
    				-3.671,
    				56.016
    			],
    			[
    				-3.597,
    				56.021
    			],
    			[
    				-3.516,
    				56.002
    			],
    			[
    				-3.39,
    				55.99
    			],
    			[
    				-3.352,
    				56.002
    			],
    			[
    				-3.304,
    				55.975
    			],
    			[
    				-3.182,
    				55.991
    			],
    			[
    				-3.116,
    				55.957
    			],
    			[
    				-3.078,
    				55.947
    			],
    			[
    				-3.01,
    				55.953
    			],
    			[
    				-2.964,
    				55.971
    			],
    			[
    				-2.915,
    				55.975
    			],
    			[
    				-2.886,
    				55.995
    			],
    			[
    				-2.891,
    				56.01
    			],
    			[
    				-2.864,
    				56.023
    			],
    			[
    				-2.816,
    				56.062
    			],
    			[
    				-2.757,
    				56.059
    			],
    			[
    				-2.661,
    				56.059
    			],
    			[
    				-2.62,
    				56.048
    			],
    			[
    				-2.614,
    				56.033
    			],
    			[
    				-2.584,
    				56.021
    			],
    			[
    				-2.599,
    				55.998
    			],
    			[
    				-2.512,
    				56.006
    			],
    			[
    				-2.445,
    				55.988
    			],
    			[
    				-2.394,
    				55.957
    			],
    			[
    				-2.33,
    				55.93
    			],
    			[
    				-2.259,
    				55.924
    			],
    			[
    				-2.224,
    				55.933
    			],
    			[
    				-2.175,
    				55.916
    			],
    			[
    				-2.138,
    				55.917
    			],
    			[
    				-2.134,
    				55.892
    			],
    			[
    				-2.077,
    				55.873
    			],
    			[
    				-2.07,
    				55.843
    			],
    			[
    				-2.035,
    				55.811
    			],
    			[
    				-1.961,
    				55.733
    			],
    			[
    				-1.884,
    				55.695
    			],
    			[
    				-1.87,
    				55.666
    			],
    			[
    				-1.841,
    				55.643
    			],
    			[
    				-1.813,
    				55.634
    			],
    			[
    				-1.784,
    				55.644
    			],
    			[
    				-1.765,
    				55.626
    			],
    			[
    				-1.723,
    				55.617
    			],
    			[
    				-1.639,
    				55.578
    			],
    			[
    				-1.619,
    				55.552
    			],
    			[
    				-1.638,
    				55.541
    			],
    			[
    				-1.611,
    				55.522
    			],
    			[
    				-1.614,
    				55.498
    			],
    			[
    				-1.591,
    				55.492
    			],
    			[
    				-1.593,
    				55.44
    			],
    			[
    				-1.575,
    				55.43
    			],
    			[
    				-1.58,
    				55.407
    			],
    			[
    				-1.608,
    				55.384
    			],
    			[
    				-1.587,
    				55.344
    			],
    			[
    				-1.549,
    				55.322
    			],
    			[
    				-1.573,
    				55.275
    			],
    			[
    				-1.499,
    				55.186
    			],
    			[
    				-1.525,
    				55.163
    			],
    			[
    				-1.497,
    				55.124
    			],
    			[
    				-1.498,
    				55.108
    			],
    			[
    				-1.465,
    				55.078
    			],
    			[
    				-1.421,
    				55.02
    			],
    			[
    				-1.426,
    				55.007
    			],
    			[
    				-1.357,
    				54.965
    			],
    			[
    				-1.366,
    				54.926
    			],
    			[
    				-1.347,
    				54.861
    			],
    			[
    				-1.329,
    				54.838
    			],
    			[
    				-1.301,
    				54.77
    			],
    			[
    				-1.242,
    				54.723
    			],
    			[
    				-1.178,
    				54.699
    			],
    			[
    				-1.199,
    				54.681
    			],
    			[
    				-1.155,
    				54.628
    			],
    			[
    				-1.119,
    				54.629
    			],
    			[
    				-1.054,
    				54.617
    			],
    			[
    				-1,
    				54.593
    			],
    			[
    				-0.936,
    				54.588
    			],
    			[
    				-0.896,
    				54.571
    			],
    			[
    				-0.853,
    				54.572
    			],
    			[
    				-0.767,
    				54.55
    			],
    			[
    				-0.745,
    				54.529
    			],
    			[
    				-0.708,
    				54.532
    			],
    			[
    				-0.673,
    				54.513
    			],
    			[
    				-0.67,
    				54.501
    			],
    			[
    				-0.611,
    				54.494
    			],
    			[
    				-0.574,
    				54.481
    			],
    			[
    				-0.521,
    				54.446
    			],
    			[
    				-0.525,
    				54.418
    			],
    			[
    				-0.464,
    				54.389
    			],
    			[
    				-0.433,
    				54.34
    			],
    			[
    				-0.417,
    				54.332
    			],
    			[
    				-0.397,
    				54.275
    			],
    			[
    				-0.369,
    				54.249
    			],
    			[
    				-0.259,
    				54.216
    			],
    			[
    				-0.282,
    				54.212
    			],
    			[
    				-0.278,
    				54.187
    			],
    			[
    				-0.213,
    				54.158
    			],
    			[
    				-0.103,
    				54.131
    			],
    			[
    				-0.076,
    				54.116
    			],
    			[
    				-0.105,
    				54.104
    			],
    			[
    				-0.167,
    				54.099
    			],
    			[
    				-0.198,
    				54.078
    			],
    			[
    				-0.213,
    				54.054
    			],
    			[
    				-0.213,
    				54.008
    			],
    			[
    				-0.155,
    				53.902
    			],
    			[
    				-0.042,
    				53.793
    			],
    			[
    				0.117,
    				53.662
    			],
    			[
    				0.142,
    				53.612
    			],
    			[
    				0.081,
    				53.641
    			],
    			[
    				0.034,
    				53.649
    			],
    			[
    				-0.054,
    				53.629
    			],
    			[
    				-0.104,
    				53.635
    			],
    			[
    				-0.227,
    				53.709
    			],
    			[
    				-0.244,
    				53.731
    			],
    			[
    				-0.287,
    				53.743
    			],
    			[
    				-0.333,
    				53.738
    			],
    			[
    				-0.419,
    				53.72
    			],
    			[
    				-0.543,
    				53.708
    			],
    			[
    				-0.583,
    				53.727
    			],
    			[
    				-0.63,
    				53.734
    			],
    			[
    				-0.672,
    				53.722
    			],
    			[
    				-0.694,
    				53.695
    			],
    			[
    				-0.611,
    				53.715
    			],
    			[
    				-0.586,
    				53.693
    			],
    			[
    				-0.524,
    				53.677
    			],
    			[
    				-0.47,
    				53.698
    			],
    			[
    				-0.393,
    				53.697
    			],
    			[
    				-0.294,
    				53.714
    			],
    			[
    				-0.204,
    				53.638
    			],
    			[
    				-0.093,
    				53.581
    			],
    			[
    				-0.061,
    				53.582
    			],
    			[
    				0.017,
    				53.525
    			],
    			[
    				0.088,
    				53.515
    			],
    			[
    				0.08,
    				53.503
    			],
    			[
    				0.113,
    				53.487
    			],
    			[
    				0.157,
    				53.479
    			],
    			[
    				0.191,
    				53.449
    			],
    			[
    				0.188,
    				53.438
    			],
    			[
    				0.228,
    				53.406
    			],
    			[
    				0.242,
    				53.373
    			],
    			[
    				0.321,
    				53.267
    			],
    			[
    				0.356,
    				53.192
    			],
    			[
    				0.34,
    				53.097
    			],
    			[
    				0.313,
    				53.089
    			],
    			[
    				0.241,
    				53.047
    			],
    			[
    				0.2,
    				53.033
    			],
    			[
    				0.151,
    				53.008
    			],
    			[
    				0.079,
    				52.934
    			],
    			[
    				0.065,
    				52.905
    			],
    			[
    				0.176,
    				52.874
    			],
    			[
    				0.217,
    				52.821
    			],
    			[
    				0.269,
    				52.816
    			],
    			[
    				0.332,
    				52.818
    			],
    			[
    				0.357,
    				52.812
    			],
    			[
    				0.445,
    				52.853
    			],
    			[
    				0.446,
    				52.874
    			],
    			[
    				0.491,
    				52.948
    			],
    			[
    				0.542,
    				52.976
    			],
    			[
    				0.618,
    				52.974
    			],
    			[
    				0.695,
    				52.978
    			],
    			[
    				0.737,
    				52.964
    			],
    			[
    				0.781,
    				52.977
    			],
    			[
    				0.852,
    				52.973
    			],
    			[
    				0.851,
    				52.958
    			],
    			[
    				0.935,
    				52.959
    			],
    			[
    				1.036,
    				52.967
    			],
    			[
    				1.125,
    				52.951
    			],
    			[
    				1.301,
    				52.933
    			],
    			[
    				1.429,
    				52.884
    			],
    			[
    				1.587,
    				52.802
    			],
    			[
    				1.675,
    				52.743
    			],
    			[
    				1.698,
    				52.724
    			],
    			[
    				1.737,
    				52.647
    			],
    			[
    				1.74,
    				52.573
    			],
    			[
    				1.732,
    				52.565
    			],
    			[
    				1.74,
    				52.532
    			],
    			[
    				1.764,
    				52.482
    			],
    			[
    				1.734,
    				52.447
    			],
    			[
    				1.728,
    				52.4
    			],
    			[
    				1.675,
    				52.313
    			],
    			[
    				1.65,
    				52.3
    			],
    			[
    				1.633,
    				52.276
    			],
    			[
    				1.623,
    				52.187
    			],
    			[
    				1.58,
    				52.091
    			],
    			[
    				1.501,
    				52.071
    			],
    			[
    				1.463,
    				52.047
    			],
    			[
    				1.43,
    				52.005
    			],
    			[
    				1.345,
    				51.957
    			],
    			[
    				1.316,
    				51.951
    			],
    			[
    				1.243,
    				51.961
    			],
    			[
    				1.22,
    				51.953
    			],
    			[
    				1.187,
    				51.956
    			],
    			[
    				1.164,
    				51.971
    			],
    			[
    				1.13,
    				51.954
    			],
    			[
    				1.187,
    				51.941
    			],
    			[
    				1.246,
    				51.949
    			],
    			[
    				1.285,
    				51.937
    			],
    			[
    				1.199,
    				51.885
    			],
    			[
    				1.237,
    				51.862
    			],
    			[
    				1.275,
    				51.851
    			],
    			[
    				1.215,
    				51.811
    			],
    			[
    				1.132,
    				51.777
    			],
    			[
    				1.043,
    				51.77
    			],
    			[
    				1.026,
    				51.805
    			],
    			[
    				0.994,
    				51.816
    			],
    			[
    				0.951,
    				51.808
    			],
    			[
    				0.968,
    				51.809
    			],
    			[
    				0.997,
    				51.791
    			],
    			[
    				0.946,
    				51.775
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.963,
    				58.203
    			],
    			[
    				-6.933,
    				58.186
    			],
    			[
    				-6.893,
    				58.187
    			],
    			[
    				-6.829,
    				58.204
    			],
    			[
    				-6.759,
    				58.187
    			],
    			[
    				-6.735,
    				58.198
    			],
    			[
    				-6.772,
    				58.235
    			],
    			[
    				-6.809,
    				58.253
    			],
    			[
    				-6.825,
    				58.281
    			],
    			[
    				-6.758,
    				58.307
    			],
    			[
    				-6.706,
    				58.336
    			],
    			[
    				-6.689,
    				58.331
    			],
    			[
    				-6.653,
    				58.353
    			],
    			[
    				-6.62,
    				58.346
    			],
    			[
    				-6.582,
    				58.364
    			],
    			[
    				-6.547,
    				58.365
    			],
    			[
    				-6.519,
    				58.397
    			],
    			[
    				-6.497,
    				58.398
    			],
    			[
    				-6.436,
    				58.435
    			],
    			[
    				-6.355,
    				58.459
    			],
    			[
    				-6.333,
    				58.479
    			],
    			[
    				-6.308,
    				58.477
    			],
    			[
    				-6.271,
    				58.499
    			],
    			[
    				-6.262,
    				58.516
    			],
    			[
    				-6.223,
    				58.501
    			],
    			[
    				-6.227,
    				58.489
    			],
    			[
    				-6.181,
    				58.467
    			],
    			[
    				-6.196,
    				58.447
    			],
    			[
    				-6.167,
    				58.43
    			],
    			[
    				-6.219,
    				58.368
    			],
    			[
    				-6.194,
    				58.34
    			],
    			[
    				-6.277,
    				58.294
    			],
    			[
    				-6.281,
    				58.27
    			],
    			[
    				-6.319,
    				58.27
    			],
    			[
    				-6.319,
    				58.244
    			],
    			[
    				-6.335,
    				58.222
    			],
    			[
    				-6.285,
    				58.207
    			],
    			[
    				-6.225,
    				58.227
    			],
    			[
    				-6.203,
    				58.247
    			],
    			[
    				-6.136,
    				58.259
    			],
    			[
    				-6.165,
    				58.229
    			],
    			[
    				-6.154,
    				58.221
    			],
    			[
    				-6.207,
    				58.189
    			],
    			[
    				-6.248,
    				58.18
    			],
    			[
    				-6.29,
    				58.206
    			],
    			[
    				-6.388,
    				58.18
    			],
    			[
    				-6.367,
    				58.153
    			],
    			[
    				-6.37,
    				58.131
    			],
    			[
    				-6.429,
    				58.126
    			],
    			[
    				-6.473,
    				58.089
    			],
    			[
    				-6.4,
    				58.111
    			],
    			[
    				-6.397,
    				58.084
    			],
    			[
    				-6.369,
    				58.076
    			],
    			[
    				-6.374,
    				58.049
    			],
    			[
    				-6.358,
    				58.039
    			],
    			[
    				-6.389,
    				58
    			],
    			[
    				-6.46,
    				58.02
    			],
    			[
    				-6.475,
    				58.001
    			],
    			[
    				-6.451,
    				57.989
    			],
    			[
    				-6.472,
    				57.938
    			],
    			[
    				-6.502,
    				57.94
    			],
    			[
    				-6.54,
    				57.917
    			],
    			[
    				-6.651,
    				57.918
    			],
    			[
    				-6.702,
    				57.96
    			],
    			[
    				-6.712,
    				58.011
    			],
    			[
    				-6.738,
    				57.99
    			],
    			[
    				-6.722,
    				57.962
    			],
    			[
    				-6.674,
    				57.917
    			],
    			[
    				-6.665,
    				57.882
    			],
    			[
    				-6.744,
    				57.886
    			],
    			[
    				-6.773,
    				57.9
    			],
    			[
    				-6.803,
    				57.898
    			],
    			[
    				-6.804,
    				57.867
    			],
    			[
    				-6.774,
    				57.868
    			],
    			[
    				-6.737,
    				57.827
    			],
    			[
    				-6.798,
    				57.834
    			],
    			[
    				-6.807,
    				57.816
    			],
    			[
    				-6.834,
    				57.815
    			],
    			[
    				-6.883,
    				57.796
    			],
    			[
    				-6.873,
    				57.774
    			],
    			[
    				-6.937,
    				57.758
    			],
    			[
    				-6.945,
    				57.739
    			],
    			[
    				-7.009,
    				57.754
    			],
    			[
    				-7.054,
    				57.778
    			],
    			[
    				-7.084,
    				57.807
    			],
    			[
    				-7.12,
    				57.817
    			],
    			[
    				-7.134,
    				57.837
    			],
    			[
    				-7.082,
    				57.83
    			],
    			[
    				-7.076,
    				57.809
    			],
    			[
    				-6.998,
    				57.846
    			],
    			[
    				-6.984,
    				57.863
    			],
    			[
    				-6.939,
    				57.872
    			],
    			[
    				-6.96,
    				57.887
    			],
    			[
    				-6.949,
    				57.905
    			],
    			[
    				-6.918,
    				57.911
    			],
    			[
    				-6.875,
    				57.9
    			],
    			[
    				-6.864,
    				57.923
    			],
    			[
    				-6.944,
    				57.951
    			],
    			[
    				-7.023,
    				57.952
    			],
    			[
    				-7.08,
    				57.967
    			],
    			[
    				-7.092,
    				58
    			],
    			[
    				-7.056,
    				58.009
    			],
    			[
    				-7.02,
    				58.033
    			],
    			[
    				-7.062,
    				58.041
    			],
    			[
    				-7.07,
    				58.067
    			],
    			[
    				-7.102,
    				58.073
    			],
    			[
    				-7.11,
    				58.11
    			],
    			[
    				-7.135,
    				58.123
    			],
    			[
    				-7.089,
    				58.164
    			],
    			[
    				-7.104,
    				58.183
    			],
    			[
    				-7.065,
    				58.197
    			],
    			[
    				-7.049,
    				58.233
    			],
    			[
    				-6.995,
    				58.233
    			],
    			[
    				-6.963,
    				58.203
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.353,
    				57.708
    			],
    			[
    				-6.251,
    				57.674
    			],
    			[
    				-6.235,
    				57.637
    			],
    			[
    				-6.191,
    				57.633
    			],
    			[
    				-6.151,
    				57.587
    			],
    			[
    				-6.139,
    				57.547
    			],
    			[
    				-6.148,
    				57.5
    			],
    			[
    				-6.137,
    				57.474
    			],
    			[
    				-6.146,
    				57.43
    			],
    			[
    				-6.181,
    				57.413
    			],
    			[
    				-6.14,
    				57.406
    			],
    			[
    				-6.126,
    				57.39
    			],
    			[
    				-6.146,
    				57.371
    			],
    			[
    				-6.107,
    				57.335
    			],
    			[
    				-6.104,
    				57.319
    			],
    			[
    				-6.057,
    				57.314
    			],
    			[
    				-6.042,
    				57.293
    			],
    			[
    				-5.994,
    				57.27
    			],
    			[
    				-5.864,
    				57.242
    			],
    			[
    				-5.754,
    				57.275
    			],
    			[
    				-5.667,
    				57.265
    			],
    			[
    				-5.648,
    				57.255
    			],
    			[
    				-5.667,
    				57.235
    			],
    			[
    				-5.669,
    				57.209
    			],
    			[
    				-5.781,
    				57.167
    			],
    			[
    				-5.8,
    				57.174
    			],
    			[
    				-5.804,
    				57.121
    			],
    			[
    				-5.853,
    				57.112
    			],
    			[
    				-5.902,
    				57.064
    			],
    			[
    				-5.94,
    				57.038
    			],
    			[
    				-6.002,
    				57.02
    			],
    			[
    				-6.036,
    				57.053
    			],
    			[
    				-6.008,
    				57.09
    			],
    			[
    				-5.998,
    				57.124
    			],
    			[
    				-5.94,
    				57.147
    			],
    			[
    				-5.901,
    				57.172
    			],
    			[
    				-5.935,
    				57.176
    			],
    			[
    				-5.992,
    				57.169
    			],
    			[
    				-6.003,
    				57.2
    			],
    			[
    				-6.05,
    				57.176
    			],
    			[
    				-6.084,
    				57.127
    			],
    			[
    				-6.113,
    				57.137
    			],
    			[
    				-6.102,
    				57.17
    			],
    			[
    				-6.168,
    				57.199
    			],
    			[
    				-6.174,
    				57.175
    			],
    			[
    				-6.21,
    				57.178
    			],
    			[
    				-6.322,
    				57.16
    			],
    			[
    				-6.287,
    				57.186
    			],
    			[
    				-6.294,
    				57.205
    			],
    			[
    				-6.335,
    				57.187
    			],
    			[
    				-6.371,
    				57.205
    			],
    			[
    				-6.382,
    				57.226
    			],
    			[
    				-6.405,
    				57.232
    			],
    			[
    				-6.451,
    				57.262
    			],
    			[
    				-6.459,
    				57.286
    			],
    			[
    				-6.483,
    				57.311
    			],
    			[
    				-6.433,
    				57.325
    			],
    			[
    				-6.43,
    				57.34
    			],
    			[
    				-6.368,
    				57.314
    			],
    			[
    				-6.355,
    				57.324
    			],
    			[
    				-6.403,
    				57.34
    			],
    			[
    				-6.446,
    				57.347
    			],
    			[
    				-6.48,
    				57.367
    			],
    			[
    				-6.483,
    				57.396
    			],
    			[
    				-6.542,
    				57.397
    			],
    			[
    				-6.573,
    				57.389
    			],
    			[
    				-6.564,
    				57.339
    			],
    			[
    				-6.582,
    				57.333
    			],
    			[
    				-6.625,
    				57.351
    			],
    			[
    				-6.719,
    				57.372
    			],
    			[
    				-6.743,
    				57.418
    			],
    			[
    				-6.767,
    				57.429
    			],
    			[
    				-6.78,
    				57.458
    			],
    			[
    				-6.743,
    				57.465
    			],
    			[
    				-6.748,
    				57.5
    			],
    			[
    				-6.717,
    				57.514
    			],
    			[
    				-6.64,
    				57.443
    			],
    			[
    				-6.604,
    				57.446
    			],
    			[
    				-6.637,
    				57.503
    			],
    			[
    				-6.561,
    				57.508
    			],
    			[
    				-6.642,
    				57.552
    			],
    			[
    				-6.635,
    				57.609
    			],
    			[
    				-6.583,
    				57.588
    			],
    			[
    				-6.565,
    				57.548
    			],
    			[
    				-6.504,
    				57.534
    			],
    			[
    				-6.462,
    				57.5
    			],
    			[
    				-6.453,
    				57.481
    			],
    			[
    				-6.4,
    				57.509
    			],
    			[
    				-6.365,
    				57.515
    			],
    			[
    				-6.367,
    				57.531
    			],
    			[
    				-6.395,
    				57.557
    			],
    			[
    				-6.394,
    				57.613
    			],
    			[
    				-6.428,
    				57.642
    			],
    			[
    				-6.354,
    				57.671
    			],
    			[
    				-6.342,
    				57.685
    			],
    			[
    				-6.353,
    				57.708
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.382,
    				60.376
    			],
    			[
    				-1.392,
    				60.352
    			],
    			[
    				-1.432,
    				60.345
    			],
    			[
    				-1.463,
    				60.356
    			],
    			[
    				-1.449,
    				60.387
    			],
    			[
    				-1.428,
    				60.39
    			],
    			[
    				-1.39,
    				60.378
    			],
    			[
    				-1.405,
    				60.384
    			],
    			[
    				-1.416,
    				60.405
    			],
    			[
    				-1.453,
    				60.416
    			],
    			[
    				-1.449,
    				60.444
    			],
    			[
    				-1.465,
    				60.452
    			],
    			[
    				-1.457,
    				60.49
    			],
    			[
    				-1.537,
    				60.479
    			],
    			[
    				-1.554,
    				60.491
    			],
    			[
    				-1.613,
    				60.474
    			],
    			[
    				-1.633,
    				60.487
    			],
    			[
    				-1.611,
    				60.509
    			],
    			[
    				-1.566,
    				60.515
    			],
    			[
    				-1.567,
    				60.538
    			],
    			[
    				-1.533,
    				60.556
    			],
    			[
    				-1.518,
    				60.532
    			],
    			[
    				-1.435,
    				60.574
    			],
    			[
    				-1.444,
    				60.589
    			],
    			[
    				-1.421,
    				60.615
    			],
    			[
    				-1.375,
    				60.606
    			],
    			[
    				-1.35,
    				60.61
    			],
    			[
    				-1.309,
    				60.638
    			],
    			[
    				-1.304,
    				60.595
    			],
    			[
    				-1.319,
    				60.583
    			],
    			[
    				-1.315,
    				60.541
    			],
    			[
    				-1.367,
    				60.526
    			],
    			[
    				-1.324,
    				60.511
    			],
    			[
    				-1.311,
    				60.482
    			],
    			[
    				-1.331,
    				60.478
    			],
    			[
    				-1.34,
    				60.451
    			],
    			[
    				-1.277,
    				60.448
    			],
    			[
    				-1.304,
    				60.468
    			],
    			[
    				-1.262,
    				60.476
    			],
    			[
    				-1.229,
    				60.495
    			],
    			[
    				-1.167,
    				60.442
    			],
    			[
    				-1.194,
    				60.42
    			],
    			[
    				-1.151,
    				60.403
    			],
    			[
    				-1.11,
    				60.415
    			],
    			[
    				-1.071,
    				60.446
    			],
    			[
    				-1.048,
    				60.44
    			],
    			[
    				-1.108,
    				60.394
    			],
    			[
    				-1.075,
    				60.388
    			],
    			[
    				-1.075,
    				60.357
    			],
    			[
    				-1.118,
    				60.345
    			],
    			[
    				-1.184,
    				60.35
    			],
    			[
    				-1.134,
    				60.323
    			],
    			[
    				-1.117,
    				60.303
    			],
    			[
    				-1.16,
    				60.281
    			],
    			[
    				-1.144,
    				60.26
    			],
    			[
    				-1.185,
    				60.232
    			],
    			[
    				-1.145,
    				60.189
    			],
    			[
    				-1.163,
    				60.166
    			],
    			[
    				-1.175,
    				60.119
    			],
    			[
    				-1.199,
    				60.107
    			],
    			[
    				-1.217,
    				60.074
    			],
    			[
    				-1.204,
    				60.048
    			],
    			[
    				-1.233,
    				60.033
    			],
    			[
    				-1.221,
    				59.995
    			],
    			[
    				-1.234,
    				59.981
    			],
    			[
    				-1.277,
    				59.99
    			],
    			[
    				-1.256,
    				59.957
    			],
    			[
    				-1.27,
    				59.933
    			],
    			[
    				-1.278,
    				59.853
    			],
    			[
    				-1.319,
    				59.898
    			],
    			[
    				-1.382,
    				59.889
    			],
    			[
    				-1.392,
    				59.913
    			],
    			[
    				-1.364,
    				59.92
    			],
    			[
    				-1.364,
    				59.946
    			],
    			[
    				-1.329,
    				59.948
    			],
    			[
    				-1.332,
    				59.969
    			],
    			[
    				-1.361,
    				59.969
    			],
    			[
    				-1.347,
    				59.999
    			],
    			[
    				-1.317,
    				60.013
    			],
    			[
    				-1.294,
    				60.071
    			],
    			[
    				-1.272,
    				60.098
    			],
    			[
    				-1.271,
    				60.134
    			],
    			[
    				-1.306,
    				60.133
    			],
    			[
    				-1.283,
    				60.196
    			],
    			[
    				-1.328,
    				60.164
    			],
    			[
    				-1.292,
    				60.254
    			],
    			[
    				-1.348,
    				60.201
    			],
    			[
    				-1.369,
    				60.235
    			],
    			[
    				-1.357,
    				60.246
    			],
    			[
    				-1.412,
    				60.255
    			],
    			[
    				-1.369,
    				60.21
    			],
    			[
    				-1.394,
    				60.2
    			],
    			[
    				-1.401,
    				60.179
    			],
    			[
    				-1.47,
    				60.16
    			],
    			[
    				-1.511,
    				60.165
    			],
    			[
    				-1.512,
    				60.183
    			],
    			[
    				-1.543,
    				60.204
    			],
    			[
    				-1.504,
    				60.209
    			],
    			[
    				-1.515,
    				60.229
    			],
    			[
    				-1.551,
    				60.221
    			],
    			[
    				-1.612,
    				60.22
    			],
    			[
    				-1.69,
    				60.235
    			],
    			[
    				-1.703,
    				60.255
    			],
    			[
    				-1.68,
    				60.277
    			],
    			[
    				-1.701,
    				60.29
    			],
    			[
    				-1.671,
    				60.304
    			],
    			[
    				-1.601,
    				60.307
    			],
    			[
    				-1.57,
    				60.295
    			],
    			[
    				-1.505,
    				60.32
    			],
    			[
    				-1.488,
    				60.307
    			],
    			[
    				-1.427,
    				60.329
    			],
    			[
    				-1.388,
    				60.314
    			],
    			[
    				-1.34,
    				60.36
    			],
    			[
    				-1.382,
    				60.376
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.113,
    				56.644
    			],
    			[
    				-6.067,
    				56.639
    			],
    			[
    				-6.07,
    				56.621
    			],
    			[
    				-6.033,
    				56.61
    			],
    			[
    				-5.989,
    				56.58
    			],
    			[
    				-5.951,
    				56.518
    			],
    			[
    				-5.864,
    				56.522
    			],
    			[
    				-5.825,
    				56.506
    			],
    			[
    				-5.797,
    				56.515
    			],
    			[
    				-5.768,
    				56.489
    			],
    			[
    				-5.712,
    				56.474
    			],
    			[
    				-5.662,
    				56.448
    			],
    			[
    				-5.653,
    				56.416
    			],
    			[
    				-5.695,
    				56.371
    			],
    			[
    				-5.746,
    				56.342
    			],
    			[
    				-5.834,
    				56.311
    			],
    			[
    				-5.889,
    				56.322
    			],
    			[
    				-5.846,
    				56.346
    			],
    			[
    				-5.877,
    				56.356
    			],
    			[
    				-5.934,
    				56.322
    			],
    			[
    				-5.987,
    				56.323
    			],
    			[
    				-6.044,
    				56.293
    			],
    			[
    				-6.079,
    				56.302
    			],
    			[
    				-6.127,
    				56.297
    			],
    			[
    				-6.143,
    				56.284
    			],
    			[
    				-6.199,
    				56.292
    			],
    			[
    				-6.245,
    				56.289
    			],
    			[
    				-6.27,
    				56.274
    			],
    			[
    				-6.32,
    				56.27
    			],
    			[
    				-6.35,
    				56.285
    			],
    			[
    				-6.347,
    				56.306
    			],
    			[
    				-6.377,
    				56.309
    			],
    			[
    				-6.351,
    				56.347
    			],
    			[
    				-6.295,
    				56.344
    			],
    			[
    				-6.267,
    				56.324
    			],
    			[
    				-6.249,
    				56.343
    			],
    			[
    				-6.19,
    				56.332
    			],
    			[
    				-6.103,
    				56.342
    			],
    			[
    				-6.071,
    				56.357
    			],
    			[
    				-6.019,
    				56.365
    			],
    			[
    				-6.003,
    				56.378
    			],
    			[
    				-6.023,
    				56.395
    			],
    			[
    				-6.059,
    				56.376
    			],
    			[
    				-6.106,
    				56.367
    			],
    			[
    				-6.195,
    				56.359
    			],
    			[
    				-6.206,
    				56.385
    			],
    			[
    				-6.151,
    				56.413
    			],
    			[
    				-6.125,
    				56.449
    			],
    			[
    				-6.055,
    				56.451
    			],
    			[
    				-5.997,
    				56.483
    			],
    			[
    				-6.036,
    				56.488
    			],
    			[
    				-6.123,
    				56.473
    			],
    			[
    				-6.149,
    				56.5
    			],
    			[
    				-6.225,
    				56.529
    			],
    			[
    				-6.287,
    				56.524
    			],
    			[
    				-6.341,
    				56.537
    			],
    			[
    				-6.334,
    				56.554
    			],
    			[
    				-6.305,
    				56.558
    			],
    			[
    				-6.324,
    				56.606
    			],
    			[
    				-6.275,
    				56.603
    			],
    			[
    				-6.227,
    				56.633
    			],
    			[
    				-6.166,
    				56.642
    			],
    			[
    				-6.129,
    				56.656
    			],
    			[
    				-6.113,
    				56.644
    			]
    		]
    	],
    	[
    		[
    			[
    				-4.409,
    				53.424
    			],
    			[
    				-4.368,
    				53.424
    			],
    			[
    				-4.293,
    				53.411
    			],
    			[
    				-4.269,
    				53.391
    			],
    			[
    				-4.265,
    				53.361
    			],
    			[
    				-4.23,
    				53.358
    			],
    			[
    				-4.234,
    				53.341
    			],
    			[
    				-4.204,
    				53.314
    			],
    			[
    				-4.204,
    				53.292
    			],
    			[
    				-4.143,
    				53.305
    			],
    			[
    				-4.12,
    				53.319
    			],
    			[
    				-4.04,
    				53.311
    			],
    			[
    				-4.072,
    				53.291
    			],
    			[
    				-4.099,
    				53.257
    			],
    			[
    				-4.203,
    				53.216
    			],
    			[
    				-4.219,
    				53.186
    			],
    			[
    				-4.305,
    				53.147
    			],
    			[
    				-4.329,
    				53.127
    			],
    			[
    				-4.399,
    				53.145
    			],
    			[
    				-4.42,
    				53.162
    			],
    			[
    				-4.387,
    				53.17
    			],
    			[
    				-4.386,
    				53.191
    			],
    			[
    				-4.443,
    				53.155
    			],
    			[
    				-4.467,
    				53.182
    			],
    			[
    				-4.504,
    				53.187
    			],
    			[
    				-4.497,
    				53.207
    			],
    			[
    				-4.522,
    				53.232
    			],
    			[
    				-4.557,
    				53.246
    			],
    			[
    				-4.597,
    				53.24
    			],
    			[
    				-4.652,
    				53.288
    			],
    			[
    				-4.697,
    				53.307
    			],
    			[
    				-4.681,
    				53.324
    			],
    			[
    				-4.631,
    				53.308
    			],
    			[
    				-4.588,
    				53.302
    			],
    			[
    				-4.562,
    				53.317
    			],
    			[
    				-4.571,
    				53.338
    			],
    			[
    				-4.555,
    				53.374
    			],
    			[
    				-4.574,
    				53.404
    			],
    			[
    				-4.492,
    				53.411
    			],
    			[
    				-4.478,
    				53.422
    			],
    			[
    				-4.425,
    				53.43
    			],
    			[
    				-4.409,
    				53.424
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.903,
    				58.843
    			],
    			[
    				-2.963,
    				58.85
    			],
    			[
    				-2.896,
    				58.891
    			],
    			[
    				-2.933,
    				58.903
    			],
    			[
    				-2.973,
    				58.94
    			],
    			[
    				-2.984,
    				58.963
    			],
    			[
    				-3.027,
    				58.941
    			],
    			[
    				-3.08,
    				58.93
    			],
    			[
    				-3.113,
    				58.931
    			],
    			[
    				-3.198,
    				58.913
    			],
    			[
    				-3.228,
    				58.935
    			],
    			[
    				-3.23,
    				58.966
    			],
    			[
    				-3.3,
    				58.95
    			],
    			[
    				-3.356,
    				58.965
    			],
    			[
    				-3.366,
    				59.015
    			],
    			[
    				-3.348,
    				59.038
    			],
    			[
    				-3.347,
    				59.098
    			],
    			[
    				-3.312,
    				59.136
    			],
    			[
    				-3.228,
    				59.153
    			],
    			[
    				-3.198,
    				59.154
    			],
    			[
    				-3.095,
    				59.118
    			],
    			[
    				-3.063,
    				59.096
    			],
    			[
    				-3.004,
    				59.072
    			],
    			[
    				-3.012,
    				59.039
    			],
    			[
    				-3.053,
    				59.036
    			],
    			[
    				-3.111,
    				59.005
    			],
    			[
    				-3.053,
    				58.994
    			],
    			[
    				-3.04,
    				59.009
    			],
    			[
    				-3.007,
    				59.01
    			],
    			[
    				-2.96,
    				58.985
    			],
    			[
    				-2.928,
    				59.006
    			],
    			[
    				-2.907,
    				59.004
    			],
    			[
    				-2.919,
    				58.965
    			],
    			[
    				-2.887,
    				58.96
    			],
    			[
    				-2.856,
    				58.986
    			],
    			[
    				-2.792,
    				58.965
    			],
    			[
    				-2.848,
    				58.958
    			],
    			[
    				-2.828,
    				58.938
    			],
    			[
    				-2.708,
    				58.973
    			],
    			[
    				-2.719,
    				58.937
    			],
    			[
    				-2.786,
    				58.915
    			],
    			[
    				-2.83,
    				58.875
    			],
    			[
    				-2.884,
    				58.9
    			],
    			[
    				-2.889,
    				58.855
    			],
    			[
    				-2.906,
    				58.84
    			],
    			[
    				-2.896,
    				58.819
    			],
    			[
    				-2.931,
    				58.794
    			],
    			[
    				-2.94,
    				58.767
    			],
    			[
    				-2.91,
    				58.754
    			],
    			[
    				-2.924,
    				58.733
    			],
    			[
    				-2.961,
    				58.73
    			],
    			[
    				-2.992,
    				58.754
    			],
    			[
    				-2.979,
    				58.786
    			],
    			[
    				-2.999,
    				58.8
    			],
    			[
    				-2.958,
    				58.826
    			],
    			[
    				-2.903,
    				58.843
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.125,
    				55.933
    			],
    			[
    				-6.132,
    				55.89
    			],
    			[
    				-6.108,
    				55.853
    			],
    			[
    				-6.104,
    				55.813
    			],
    			[
    				-6.084,
    				55.783
    			],
    			[
    				-6.047,
    				55.764
    			],
    			[
    				-6.053,
    				55.742
    			],
    			[
    				-6.032,
    				55.726
    			],
    			[
    				-6.04,
    				55.71
    			],
    			[
    				-6.031,
    				55.684
    			],
    			[
    				-6.073,
    				55.663
    			],
    			[
    				-6.086,
    				55.649
    			],
    			[
    				-6.149,
    				55.626
    			],
    			[
    				-6.166,
    				55.631
    			],
    			[
    				-6.211,
    				55.62
    			],
    			[
    				-6.24,
    				55.593
    			],
    			[
    				-6.268,
    				55.579
    			],
    			[
    				-6.339,
    				55.591
    			],
    			[
    				-6.333,
    				55.62
    			],
    			[
    				-6.304,
    				55.649
    			],
    			[
    				-6.259,
    				55.658
    			],
    			[
    				-6.287,
    				55.702
    			],
    			[
    				-6.331,
    				55.742
    			],
    			[
    				-6.262,
    				55.764
    			],
    			[
    				-6.26,
    				55.784
    			],
    			[
    				-6.347,
    				55.784
    			],
    			[
    				-6.372,
    				55.745
    			],
    			[
    				-6.415,
    				55.706
    			],
    			[
    				-6.488,
    				55.671
    			],
    			[
    				-6.526,
    				55.693
    			],
    			[
    				-6.499,
    				55.706
    			],
    			[
    				-6.498,
    				55.736
    			],
    			[
    				-6.471,
    				55.756
    			],
    			[
    				-6.457,
    				55.783
    			],
    			[
    				-6.487,
    				55.793
    			],
    			[
    				-6.457,
    				55.809
    			],
    			[
    				-6.465,
    				55.828
    			],
    			[
    				-6.455,
    				55.852
    			],
    			[
    				-6.392,
    				55.858
    			],
    			[
    				-6.328,
    				55.892
    			],
    			[
    				-6.346,
    				55.835
    			],
    			[
    				-6.328,
    				55.834
    			],
    			[
    				-6.305,
    				55.867
    			],
    			[
    				-6.215,
    				55.913
    			],
    			[
    				-6.197,
    				55.927
    			],
    			[
    				-6.125,
    				55.933
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.267,
    				55.721
    			],
    			[
    				-5.201,
    				55.702
    			],
    			[
    				-5.161,
    				55.679
    			],
    			[
    				-5.128,
    				55.61
    			],
    			[
    				-5.16,
    				55.584
    			],
    			[
    				-5.109,
    				55.572
    			],
    			[
    				-5.083,
    				55.553
    			],
    			[
    				-5.129,
    				55.531
    			],
    			[
    				-5.079,
    				55.51
    			],
    			[
    				-5.095,
    				55.492
    			],
    			[
    				-5.084,
    				55.455
    			],
    			[
    				-5.112,
    				55.44
    			],
    			[
    				-5.138,
    				55.444
    			],
    			[
    				-5.196,
    				55.434
    			],
    			[
    				-5.251,
    				55.439
    			],
    			[
    				-5.313,
    				55.465
    			],
    			[
    				-5.327,
    				55.498
    			],
    			[
    				-5.355,
    				55.507
    			],
    			[
    				-5.338,
    				55.55
    			],
    			[
    				-5.395,
    				55.611
    			],
    			[
    				-5.395,
    				55.627
    			],
    			[
    				-5.365,
    				55.678
    			],
    			[
    				-5.328,
    				55.689
    			],
    			[
    				-5.316,
    				55.706
    			],
    			[
    				-5.267,
    				55.721
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.709,
    				56.15
    			],
    			[
    				-5.687,
    				56.129
    			],
    			[
    				-5.688,
    				56.111
    			],
    			[
    				-5.777,
    				56.017
    			],
    			[
    				-5.793,
    				56.013
    			],
    			[
    				-5.82,
    				55.973
    			],
    			[
    				-5.836,
    				55.971
    			],
    			[
    				-5.845,
    				55.94
    			],
    			[
    				-5.897,
    				55.89
    			],
    			[
    				-5.902,
    				55.867
    			],
    			[
    				-5.937,
    				55.867
    			],
    			[
    				-5.951,
    				55.835
    			],
    			[
    				-5.94,
    				55.826
    			],
    			[
    				-5.964,
    				55.793
    			],
    			[
    				-6.036,
    				55.796
    			],
    			[
    				-6.065,
    				55.806
    			],
    			[
    				-6.087,
    				55.831
    			],
    			[
    				-6.097,
    				55.872
    			],
    			[
    				-6.087,
    				55.9
    			],
    			[
    				-6.027,
    				55.947
    			],
    			[
    				-5.94,
    				55.96
    			],
    			[
    				-5.994,
    				55.976
    			],
    			[
    				-6.001,
    				55.989
    			],
    			[
    				-5.95,
    				56.038
    			],
    			[
    				-5.882,
    				56.07
    			],
    			[
    				-5.821,
    				56.09
    			],
    			[
    				-5.709,
    				56.15
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.291,
    				57.651
    			],
    			[
    				-7.243,
    				57.672
    			],
    			[
    				-7.224,
    				57.689
    			],
    			[
    				-7.194,
    				57.69
    			],
    			[
    				-7.156,
    				57.677
    			],
    			[
    				-7.164,
    				57.659
    			],
    			[
    				-7.063,
    				57.64
    			],
    			[
    				-7.1,
    				57.608
    			],
    			[
    				-7.165,
    				57.644
    			],
    			[
    				-7.201,
    				57.619
    			],
    			[
    				-7.153,
    				57.613
    			],
    			[
    				-7.182,
    				57.593
    			],
    			[
    				-7.151,
    				57.586
    			],
    			[
    				-7.102,
    				57.594
    			],
    			[
    				-7.135,
    				57.554
    			],
    			[
    				-7.147,
    				57.516
    			],
    			[
    				-7.222,
    				57.508
    			],
    			[
    				-7.206,
    				57.476
    			],
    			[
    				-7.246,
    				57.479
    			],
    			[
    				-7.27,
    				57.493
    			],
    			[
    				-7.292,
    				57.491
    			],
    			[
    				-7.326,
    				57.509
    			],
    			[
    				-7.358,
    				57.502
    			],
    			[
    				-7.437,
    				57.569
    			],
    			[
    				-7.483,
    				57.568
    			],
    			[
    				-7.52,
    				57.605
    			],
    			[
    				-7.504,
    				57.639
    			],
    			[
    				-7.476,
    				57.661
    			],
    			[
    				-7.449,
    				57.663
    			],
    			[
    				-7.383,
    				57.631
    			],
    			[
    				-7.376,
    				57.659
    			],
    			[
    				-7.291,
    				57.651
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.303,
    				50.765
    			],
    			[
    				-1.275,
    				50.765
    			],
    			[
    				-1.216,
    				50.735
    			],
    			[
    				-1.155,
    				50.733
    			],
    			[
    				-1.109,
    				50.721
    			],
    			[
    				-1.103,
    				50.7
    			],
    			[
    				-1.07,
    				50.688
    			],
    			[
    				-1.098,
    				50.665
    			],
    			[
    				-1.132,
    				50.662
    			],
    			[
    				-1.16,
    				50.649
    			],
    			[
    				-1.185,
    				50.597
    			],
    			[
    				-1.3,
    				50.575
    			],
    			[
    				-1.389,
    				50.627
    			],
    			[
    				-1.448,
    				50.644
    			],
    			[
    				-1.484,
    				50.667
    			],
    			[
    				-1.586,
    				50.663
    			],
    			[
    				-1.548,
    				50.678
    			],
    			[
    				-1.522,
    				50.707
    			],
    			[
    				-1.47,
    				50.71
    			],
    			[
    				-1.429,
    				50.726
    			],
    			[
    				-1.408,
    				50.725
    			],
    			[
    				-1.353,
    				50.739
    			],
    			[
    				-1.316,
    				50.765
    			],
    			[
    				-1.303,
    				50.765
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.329,
    				57.395
    			],
    			[
    				-7.297,
    				57.387
    			],
    			[
    				-7.3,
    				57.372
    			],
    			[
    				-7.244,
    				57.354
    			],
    			[
    				-7.27,
    				57.345
    			],
    			[
    				-7.272,
    				57.323
    			],
    			[
    				-7.228,
    				57.324
    			],
    			[
    				-7.227,
    				57.282
    			],
    			[
    				-7.253,
    				57.26
    			],
    			[
    				-7.243,
    				57.249
    			],
    			[
    				-7.268,
    				57.224
    			],
    			[
    				-7.265,
    				57.192
    			],
    			[
    				-7.245,
    				57.164
    			],
    			[
    				-7.273,
    				57.151
    			],
    			[
    				-7.328,
    				57.158
    			],
    			[
    				-7.334,
    				57.136
    			],
    			[
    				-7.285,
    				57.143
    			],
    			[
    				-7.246,
    				57.136
    			],
    			[
    				-7.212,
    				57.117
    			],
    			[
    				-7.234,
    				57.104
    			],
    			[
    				-7.302,
    				57.111
    			],
    			[
    				-7.373,
    				57.104
    			],
    			[
    				-7.392,
    				57.114
    			],
    			[
    				-7.412,
    				57.15
    			],
    			[
    				-7.424,
    				57.218
    			],
    			[
    				-7.435,
    				57.237
    			],
    			[
    				-7.421,
    				57.289
    			],
    			[
    				-7.397,
    				57.302
    			],
    			[
    				-7.412,
    				57.387
    			],
    			[
    				-7.34,
    				57.403
    			],
    			[
    				-7.329,
    				57.395
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.007,
    				60.723
    			],
    			[
    				-1.008,
    				60.701
    			],
    			[
    				-0.989,
    				60.655
    			],
    			[
    				-0.998,
    				60.633
    			],
    			[
    				-1.046,
    				60.601
    			],
    			[
    				-1.003,
    				60.58
    			],
    			[
    				-1.037,
    				60.502
    			],
    			[
    				-1.069,
    				60.49
    			],
    			[
    				-1.117,
    				60.51
    			],
    			[
    				-1.141,
    				60.489
    			],
    			[
    				-1.168,
    				60.499
    			],
    			[
    				-1.19,
    				60.546
    			],
    			[
    				-1.181,
    				60.572
    			],
    			[
    				-1.203,
    				60.607
    			],
    			[
    				-1.189,
    				60.635
    			],
    			[
    				-1.126,
    				60.693
    			],
    			[
    				-1.119,
    				60.719
    			],
    			[
    				-1.073,
    				60.731
    			],
    			[
    				-1.007,
    				60.723
    			]
    		]
    	],
    	[
    		[
    			[
    				-3.259,
    				58.787
    			],
    			[
    				-3.236,
    				58.783
    			],
    			[
    				-3.209,
    				58.8
    			],
    			[
    				-3.153,
    				58.807
    			],
    			[
    				-3.154,
    				58.787
    			],
    			[
    				-3.188,
    				58.777
    			],
    			[
    				-3.25,
    				58.782
    			],
    			[
    				-3.297,
    				58.778
    			],
    			[
    				-3.322,
    				58.796
    			],
    			[
    				-3.328,
    				58.818
    			],
    			[
    				-3.37,
    				58.837
    			],
    			[
    				-3.379,
    				58.868
    			],
    			[
    				-3.434,
    				58.874
    			],
    			[
    				-3.403,
    				58.922
    			],
    			[
    				-3.353,
    				58.932
    			],
    			[
    				-3.327,
    				58.928
    			],
    			[
    				-3.302,
    				58.906
    			],
    			[
    				-3.213,
    				58.878
    			],
    			[
    				-3.198,
    				58.853
    			],
    			[
    				-3.204,
    				58.805
    			],
    			[
    				-3.246,
    				58.801
    			],
    			[
    				-3.259,
    				58.787
    			]
    		]
    	],
    	[
    		[
    			[
    				-0.874,
    				60.806
    			],
    			[
    				-0.84,
    				60.839
    			],
    			[
    				-0.778,
    				60.829
    			],
    			[
    				-0.804,
    				60.81
    			],
    			[
    				-0.777,
    				60.797
    			],
    			[
    				-0.781,
    				60.78
    			],
    			[
    				-0.836,
    				60.787
    			],
    			[
    				-0.803,
    				60.759
    			],
    			[
    				-0.871,
    				60.702
    			],
    			[
    				-0.833,
    				60.684
    			],
    			[
    				-0.857,
    				60.674
    			],
    			[
    				-0.913,
    				60.69
    			],
    			[
    				-0.947,
    				60.673
    			],
    			[
    				-0.984,
    				60.719
    			],
    			[
    				-0.939,
    				60.751
    			],
    			[
    				-0.932,
    				60.782
    			],
    			[
    				-0.955,
    				60.791
    			],
    			[
    				-0.895,
    				60.83
    			],
    			[
    				-0.874,
    				60.806
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.062,
    				55.859
    			],
    			[
    				-5.059,
    				55.839
    			],
    			[
    				-5.025,
    				55.843
    			],
    			[
    				-5.022,
    				55.809
    			],
    			[
    				-5.001,
    				55.77
    			],
    			[
    				-5.032,
    				55.757
    			],
    			[
    				-5.004,
    				55.731
    			],
    			[
    				-5.029,
    				55.722
    			],
    			[
    				-5.054,
    				55.733
    			],
    			[
    				-5.061,
    				55.759
    			],
    			[
    				-5.094,
    				55.778
    			],
    			[
    				-5.12,
    				55.772
    			],
    			[
    				-5.127,
    				55.81
    			],
    			[
    				-5.143,
    				55.813
    			],
    			[
    				-5.129,
    				55.845
    			],
    			[
    				-5.169,
    				55.852
    			],
    			[
    				-5.212,
    				55.885
    			],
    			[
    				-5.221,
    				55.901
    			],
    			[
    				-5.181,
    				55.925
    			],
    			[
    				-5.161,
    				55.922
    			],
    			[
    				-5.113,
    				55.892
    			],
    			[
    				-5.078,
    				55.881
    			],
    			[
    				-5.062,
    				55.859
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.33,
    				57.06
    			],
    			[
    				-6.26,
    				57.037
    			],
    			[
    				-6.238,
    				57.005
    			],
    			[
    				-6.257,
    				56.967
    			],
    			[
    				-6.311,
    				56.935
    			],
    			[
    				-6.37,
    				56.952
    			],
    			[
    				-6.376,
    				56.973
    			],
    			[
    				-6.46,
    				57.007
    			],
    			[
    				-6.41,
    				57.029
    			],
    			[
    				-6.398,
    				57.043
    			],
    			[
    				-6.33,
    				57.06
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.727,
    				56.541
    			],
    			[
    				-6.726,
    				56.527
    			],
    			[
    				-6.805,
    				56.524
    			],
    			[
    				-6.795,
    				56.506
    			],
    			[
    				-6.812,
    				56.489
    			],
    			[
    				-6.867,
    				56.491
    			],
    			[
    				-6.895,
    				56.474
    			],
    			[
    				-6.894,
    				56.445
    			],
    			[
    				-6.933,
    				56.443
    			],
    			[
    				-6.943,
    				56.457
    			],
    			[
    				-6.98,
    				56.452
    			],
    			[
    				-6.975,
    				56.518
    			],
    			[
    				-6.932,
    				56.531
    			],
    			[
    				-6.873,
    				56.519
    			],
    			[
    				-6.818,
    				56.543
    			],
    			[
    				-6.779,
    				56.537
    			],
    			[
    				-6.754,
    				56.556
    			],
    			[
    				-6.727,
    				56.541
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.266,
    				57.467
    			],
    			[
    				-7.235,
    				57.461
    			],
    			[
    				-7.25,
    				57.44
    			],
    			[
    				-7.216,
    				57.436
    			],
    			[
    				-7.206,
    				57.416
    			],
    			[
    				-7.268,
    				57.408
    			],
    			[
    				-7.306,
    				57.396
    			],
    			[
    				-7.344,
    				57.422
    			],
    			[
    				-7.393,
    				57.424
    			],
    			[
    				-7.41,
    				57.47
    			],
    			[
    				-7.379,
    				57.475
    			],
    			[
    				-7.368,
    				57.492
    			],
    			[
    				-7.337,
    				57.497
    			],
    			[
    				-7.309,
    				57.479
    			],
    			[
    				-7.266,
    				57.467
    			]
    		]
    	],
    	[
    		[
    			[
    				0.902,
    				51.417
    			],
    			[
    				0.95,
    				51.372
    			],
    			[
    				0.897,
    				51.354
    			],
    			[
    				0.806,
    				51.372
    			],
    			[
    				0.766,
    				51.37
    			],
    			[
    				0.764,
    				51.388
    			],
    			[
    				0.733,
    				51.4
    			],
    			[
    				0.75,
    				51.446
    			],
    			[
    				0.825,
    				51.426
    			],
    			[
    				0.902,
    				51.417
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.453,
    				56.688
    			],
    			[
    				-6.453,
    				56.675
    			],
    			[
    				-6.506,
    				56.617
    			],
    			[
    				-6.554,
    				56.595
    			],
    			[
    				-6.6,
    				56.586
    			],
    			[
    				-6.656,
    				56.594
    			],
    			[
    				-6.612,
    				56.638
    			],
    			[
    				-6.547,
    				56.66
    			],
    			[
    				-6.495,
    				56.691
    			],
    			[
    				-6.453,
    				56.688
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.978,
    				57.495
    			],
    			[
    				-5.983,
    				57.48
    			],
    			[
    				-6.032,
    				57.429
    			],
    			[
    				-6.019,
    				57.389
    			],
    			[
    				-5.993,
    				57.358
    			],
    			[
    				-6.021,
    				57.333
    			],
    			[
    				-6.05,
    				57.328
    			],
    			[
    				-6.088,
    				57.351
    			],
    			[
    				-6.074,
    				57.38
    			],
    			[
    				-6.085,
    				57.421
    			],
    			[
    				-6.057,
    				57.46
    			],
    			[
    				-6.018,
    				57.455
    			],
    			[
    				-6.02,
    				57.48
    			],
    			[
    				-5.978,
    				57.495
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.429,
    				57.012
    			],
    			[
    				-7.379,
    				56.99
    			],
    			[
    				-7.423,
    				56.976
    			],
    			[
    				-7.436,
    				56.949
    			],
    			[
    				-7.531,
    				56.948
    			],
    			[
    				-7.555,
    				56.968
    			],
    			[
    				-7.519,
    				56.974
    			],
    			[
    				-7.515,
    				56.999
    			],
    			[
    				-7.458,
    				57.023
    			],
    			[
    				-7.45,
    				57.058
    			],
    			[
    				-7.42,
    				57.042
    			],
    			[
    				-7.446,
    				57.02
    			],
    			[
    				-7.429,
    				57.012
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.954,
    				59.333
    			],
    			[
    				-2.957,
    				59.308
    			],
    			[
    				-2.883,
    				59.286
    			],
    			[
    				-2.838,
    				59.248
    			],
    			[
    				-2.891,
    				59.255
    			],
    			[
    				-2.912,
    				59.277
    			],
    			[
    				-2.983,
    				59.259
    			],
    			[
    				-3.025,
    				59.278
    			],
    			[
    				-3.034,
    				59.323
    			],
    			[
    				-2.98,
    				59.336
    			],
    			[
    				-2.954,
    				59.333
    			]
    		]
    	],
    	[
    		[
    			[
    				-3.033,
    				59.179
    			],
    			[
    				-2.953,
    				59.18
    			],
    			[
    				-2.979,
    				59.163
    			],
    			[
    				-2.966,
    				59.135
    			],
    			[
    				-3.04,
    				59.127
    			],
    			[
    				-3.093,
    				59.146
    			],
    			[
    				-3.118,
    				59.173
    			],
    			[
    				-3.074,
    				59.199
    			],
    			[
    				-3.033,
    				59.179
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.133,
    				56.121
    			],
    			[
    				-6.167,
    				56.079
    			],
    			[
    				-6.197,
    				56.062
    			],
    			[
    				-6.186,
    				56.043
    			],
    			[
    				-6.221,
    				56.029
    			],
    			[
    				-6.237,
    				56.007
    			],
    			[
    				-6.27,
    				56.023
    			],
    			[
    				-6.25,
    				56.034
    			],
    			[
    				-6.258,
    				56.066
    			],
    			[
    				-6.248,
    				56.083
    			],
    			[
    				-6.148,
    				56.133
    			],
    			[
    				-6.133,
    				56.121
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.628,
    				59.16
    			],
    			[
    				-2.596,
    				59.116
    			],
    			[
    				-2.553,
    				59.111
    			],
    			[
    				-2.527,
    				59.093
    			],
    			[
    				-2.538,
    				59.076
    			],
    			[
    				-2.606,
    				59.072
    			],
    			[
    				-2.605,
    				59.097
    			],
    			[
    				-2.658,
    				59.1
    			],
    			[
    				-2.651,
    				59.076
    			],
    			[
    				-2.687,
    				59.078
    			],
    			[
    				-2.67,
    				59.109
    			],
    			[
    				-2.62,
    				59.118
    			],
    			[
    				-2.654,
    				59.152
    			],
    			[
    				-2.628,
    				59.16
    			]
    		]
    	],
    	[
    		[
    			[
    				-0.832,
    				60.628
    			],
    			[
    				-0.809,
    				60.599
    			],
    			[
    				-0.771,
    				60.592
    			],
    			[
    				-0.801,
    				60.568
    			],
    			[
    				-0.831,
    				60.588
    			],
    			[
    				-0.897,
    				60.587
    			],
    			[
    				-0.948,
    				60.61
    			],
    			[
    				-0.936,
    				60.631
    			],
    			[
    				-0.898,
    				60.62
    			],
    			[
    				-0.866,
    				60.633
    			],
    			[
    				-0.832,
    				60.628
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.408,
    				59.285
    			],
    			[
    				-2.479,
    				59.277
    			],
    			[
    				-2.525,
    				59.238
    			],
    			[
    				-2.57,
    				59.245
    			],
    			[
    				-2.637,
    				59.235
    			],
    			[
    				-2.602,
    				59.261
    			],
    			[
    				-2.605,
    				59.29
    			],
    			[
    				-2.558,
    				59.306
    			],
    			[
    				-2.529,
    				59.303
    			],
    			[
    				-2.583,
    				59.264
    			],
    			[
    				-2.544,
    				59.26
    			],
    			[
    				-2.486,
    				59.288
    			],
    			[
    				-2.408,
    				59.285
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.081,
    				60.188
    			],
    			[
    				-1.072,
    				60.158
    			],
    			[
    				-1.045,
    				60.166
    			],
    			[
    				-1.073,
    				60.103
    			],
    			[
    				-1.122,
    				60.12
    			],
    			[
    				-1.113,
    				60.149
    			],
    			[
    				-1.148,
    				60.173
    			],
    			[
    				-1.13,
    				60.184
    			],
    			[
    				-1.081,
    				60.188
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.112,
    				56.925
    			],
    			[
    				-6.116,
    				56.889
    			],
    			[
    				-6.163,
    				56.872
    			],
    			[
    				-6.207,
    				56.888
    			],
    			[
    				-6.208,
    				56.905
    			],
    			[
    				-6.159,
    				56.915
    			],
    			[
    				-6.162,
    				56.936
    			],
    			[
    				-6.139,
    				56.944
    			],
    			[
    				-6.112,
    				56.925
    			]
    		]
    	],
    	[
    		[
    			[
    				0.885,
    				51.569
    			],
    			[
    				0.866,
    				51.559
    			],
    			[
    				0.826,
    				51.565
    			],
    			[
    				0.867,
    				51.595
    			],
    			[
    				0.874,
    				51.614
    			],
    			[
    				0.957,
    				51.621
    			],
    			[
    				0.93,
    				51.592
    			],
    			[
    				0.885,
    				51.569
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.802,
    				59.081
    			],
    			[
    				-2.824,
    				59.047
    			],
    			[
    				-2.806,
    				59.029
    			],
    			[
    				-2.825,
    				59.019
    			],
    			[
    				-2.901,
    				59.036
    			],
    			[
    				-2.892,
    				59.063
    			],
    			[
    				-2.862,
    				59.053
    			],
    			[
    				-2.84,
    				59.077
    			],
    			[
    				-2.802,
    				59.081
    			]
    		]
    	],
    	[
    		[
    			[
    				-0.914,
    				60.377
    			],
    			[
    				-0.979,
    				60.331
    			],
    			[
    				-1.038,
    				60.335
    			],
    			[
    				-1.003,
    				60.369
    			],
    			[
    				-0.963,
    				60.383
    			],
    			[
    				-0.914,
    				60.377
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.929,
    				57.281
    			],
    			[
    				-5.98,
    				57.274
    			],
    			[
    				-6.022,
    				57.306
    			],
    			[
    				-5.988,
    				57.324
    			],
    			[
    				-5.926,
    				57.308
    			],
    			[
    				-5.929,
    				57.281
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.849,
    				58.256
    			],
    			[
    				-6.798,
    				58.22
    			],
    			[
    				-6.804,
    				58.207
    			],
    			[
    				-6.867,
    				58.208
    			],
    			[
    				-6.889,
    				58.26
    			],
    			[
    				-6.849,
    				58.256
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.431,
    				56.56
    			],
    			[
    				-5.507,
    				56.498
    			],
    			[
    				-5.576,
    				56.476
    			],
    			[
    				-5.571,
    				56.498
    			],
    			[
    				-5.522,
    				56.513
    			],
    			[
    				-5.468,
    				56.549
    			],
    			[
    				-5.431,
    				56.56
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.766,
    				59.192
    			],
    			[
    				-2.757,
    				59.159
    			],
    			[
    				-2.794,
    				59.16
    			],
    			[
    				-2.816,
    				59.172
    			],
    			[
    				-2.78,
    				59.19
    			],
    			[
    				-2.79,
    				59.236
    			],
    			[
    				-2.737,
    				59.219
    			],
    			[
    				-2.766,
    				59.192
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.489,
    				56.421
    			],
    			[
    				-5.552,
    				56.373
    			],
    			[
    				-5.589,
    				56.38
    			],
    			[
    				-5.563,
    				56.408
    			],
    			[
    				-5.489,
    				56.421
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.672,
    				56.168
    			],
    			[
    				-5.701,
    				56.16
    			],
    			[
    				-5.744,
    				56.162
    			],
    			[
    				-5.74,
    				56.181
    			],
    			[
    				-5.69,
    				56.201
    			],
    			[
    				-5.672,
    				56.168
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.146,
    				57.727
    			],
    			[
    				-7.183,
    				57.703
    			],
    			[
    				-7.228,
    				57.707
    			],
    			[
    				-7.2,
    				57.735
    			],
    			[
    				-7.165,
    				57.739
    			],
    			[
    				-7.146,
    				57.727
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.989,
    				57.907
    			],
    			[
    				-7.014,
    				57.881
    			],
    			[
    				-7.054,
    				57.882
    			],
    			[
    				-7.041,
    				57.912
    			],
    			[
    				-7.008,
    				57.922
    			],
    			[
    				-6.989,
    				57.907
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.586,
    				56.32
    			],
    			[
    				-5.599,
    				56.28
    			],
    			[
    				-5.654,
    				56.298
    			],
    			[
    				-5.619,
    				56.322
    			],
    			[
    				-5.586,
    				56.32
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.049,
    				60.128
    			],
    			[
    				-2.064,
    				60.11
    			],
    			[
    				-2.112,
    				60.146
    			],
    			[
    				-2.052,
    				60.157
    			],
    			[
    				-2.049,
    				60.128
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.226,
    				56.499
    			],
    			[
    				-6.179,
    				56.482
    			],
    			[
    				-6.242,
    				56.466
    			],
    			[
    				-6.269,
    				56.478
    			],
    			[
    				-6.226,
    				56.499
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.967,
    				57.58
    			],
    			[
    				-5.954,
    				57.569
    			],
    			[
    				-5.978,
    				57.515
    			],
    			[
    				-6.001,
    				57.543
    			],
    			[
    				-5.976,
    				57.55
    			],
    			[
    				-5.989,
    				57.569
    			],
    			[
    				-5.967,
    				57.58
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.731,
    				55.711
    			],
    			[
    				-5.734,
    				55.659
    			],
    			[
    				-5.774,
    				55.677
    			],
    			[
    				-5.746,
    				55.709
    			],
    			[
    				-5.731,
    				55.711
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.633,
    				56.198
    			],
    			[
    				-5.666,
    				56.219
    			],
    			[
    				-5.633,
    				56.255
    			],
    			[
    				-5.618,
    				56.248
    			],
    			[
    				-5.634,
    				56.219
    			],
    			[
    				-5.633,
    				56.198
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.719,
    				60.346
    			],
    			[
    				-1.669,
    				60.342
    			],
    			[
    				-1.704,
    				60.315
    			],
    			[
    				-1.739,
    				60.337
    			],
    			[
    				-1.719,
    				60.346
    			]
    		]
    	],
    	[
    		[
    			[
    				-6.183,
    				57.163
    			],
    			[
    				-6.232,
    				57.132
    			],
    			[
    				-6.256,
    				57.15
    			],
    			[
    				-6.206,
    				57.166
    			],
    			[
    				-6.183,
    				57.163
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.105,
    				58.017
    			],
    			[
    				-7.153,
    				58.009
    			],
    			[
    				-7.17,
    				58.027
    			],
    			[
    				-7.133,
    				58.038
    			],
    			[
    				-7.105,
    				58.017
    			]
    		]
    	],
    	[
    		[
    			[
    				-5.809,
    				56.794
    			],
    			[
    				-5.851,
    				56.786
    			],
    			[
    				-5.887,
    				56.792
    			],
    			[
    				-5.877,
    				56.811
    			],
    			[
    				-5.809,
    				56.794
    			]
    		]
    	],
    	[
    		[
    			[
    				-4.894,
    				55.766
    			],
    			[
    				-4.93,
    				55.752
    			],
    			[
    				-4.93,
    				55.785
    			],
    			[
    				-4.905,
    				55.793
    			],
    			[
    				-4.894,
    				55.766
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.2,
    				57.773
    			],
    			[
    				-7.241,
    				57.76
    			],
    			[
    				-7.266,
    				57.774
    			],
    			[
    				-7.23,
    				57.785
    			],
    			[
    				-7.2,
    				57.773
    			]
    		]
    	],
    	[
    		[
    			[
    				-1.597,
    				59.54
    			],
    			[
    				-1.644,
    				59.526
    			],
    			[
    				-1.64,
    				59.552
    			],
    			[
    				-1.597,
    				59.54
    			]
    		]
    	],
    	[
    		[
    			[
    				-2.384,
    				59.392
    			],
    			[
    				-2.411,
    				59.368
    			],
    			[
    				-2.432,
    				59.386
    			],
    			[
    				-2.384,
    				59.392
    			]
    		]
    	],
    	[
    		[
    			[
    				-7.622,
    				56.803
    			],
    			[
    				-7.659,
    				56.822
    			],
    			[
    				-7.624,
    				56.829
    			],
    			[
    				-7.622,
    				56.803
    			]
    		]
    	]
    ];
    var gb = {
    	type: type,
    	coordinates: coordinates
    };

    /* src/Map.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src/Map.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let svg;
    	let path;
    	let path_d_value;
    	let svg_viewBox_value;
    	let div_resize_listener;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = geoPath().projection(/*projection*/ ctx[2])(gb));
    			attr_dev(path, "class", "border svelte-lstzf1");
    			add_location(path, file$1, 19, 8, 596);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1]);
    			add_location(svg, file$1, 18, 6, 503);
    			attr_dev(div, "class", "map-container svelte-lstzf1");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[4].call(div));
    			add_location(div, file$1, 17, 2, 444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[4].bind(div));

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projection*/ 4 && path_d_value !== (path_d_value = geoPath().projection(/*projection*/ ctx[2])(gb))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*width, height*/ 3 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			div_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let height;
    	let projection;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	let width = 400;
    	console.log(distance([0, 0], [1, 1], "km"));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => console.log(e);

    	function div_elementresize_handler() {
    		width = this.clientWidth;
    		$$invalidate(0, width);
    	}

    	$$self.$capture_state = () => ({
    		geoAlbers,
    		geoPath,
    		distance,
    		gb,
    		width,
    		height,
    		projection
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('projection' in $$props) $$invalidate(2, projection = $$props.projection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(1, height = width * 2);
    		}

    		if ($$self.$$.dirty & /*width, height*/ 3) {
    			$$invalidate(2, projection = geoAlbers().center([0, 55.4]).rotate([2.8, 0]).parallels([50, 60]).scale(10 * width).translate([width / 2, height / 2]));
    		}
    	};

    	return [width, height, projection, click_handler, div_elementresize_handler];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var E06000001 = [
    	"E06000004",
    	"E06000047",
    	"E06000003",
    	"E06000002",
    	"E06000005",
    	"E08000024"
    ];
    var E06000002 = [
    	"E06000004",
    	"E06000003",
    	"E07000164",
    	"E06000001",
    	"E06000047",
    	"E07000168"
    ];
    var E06000003 = [
    	"E07000168",
    	"E06000002",
    	"E07000164",
    	"E06000004",
    	"E06000001",
    	"E06000047"
    ];
    var E06000004 = [
    	"E07000164",
    	"E06000001",
    	"E06000005",
    	"E06000002",
    	"E06000047",
    	"E06000003"
    ];
    var E06000005 = [
    	"E06000047",
    	"E07000166",
    	"E06000004",
    	"E07000164",
    	"E06000001",
    	"E06000002"
    ];
    var E06000006 = [
    	"E06000050",
    	"E06000007",
    	"E08000011",
    	"E08000013",
    	"E08000012",
    	"E06000049"
    ];
    var E06000007 = [
    	"E08000013",
    	"E06000006",
    	"E06000049",
    	"E08000010",
    	"E08000009",
    	"E06000050"
    ];
    var E06000008 = [
    	"E07000118",
    	"E08000001",
    	"E07000120",
    	"E07000124",
    	"E07000125",
    	"E08000002"
    ];
    var E06000009 = [
    	"E07000119",
    	"E07000128",
    	"E07000127",
    	"E07000126",
    	"E07000121",
    	"E08000014"
    ];
    var E06000010 = [
    	"E06000011",
    	"E06000013",
    	"E06000012",
    	"E07000142",
    	"E07000137",
    	"E07000167"
    ];
    var E06000011 = [
    	"E07000167",
    	"E07000169",
    	"E06000013",
    	"E06000010",
    	"E07000168",
    	"E06000014"
    ];
    var E06000012 = [
    	"E07000142",
    	"E07000137",
    	"E06000013",
    	"E06000011",
    	"E06000010",
    	"E07000139"
    ];
    var E06000013 = [
    	"E07000142",
    	"E06000011",
    	"E08000017",
    	"E07000171",
    	"E06000012",
    	"E06000010"
    ];
    var E06000014 = [
    	"E07000169",
    	"E07000167",
    	"E07000164",
    	"E06000011",
    	"E07000165",
    	"E08000035"
    ];
    var E06000015 = [
    	"E07000039",
    	"E07000036",
    	"E07000032",
    	"E07000035",
    	"E07000172",
    	"E07000134"
    ];
    var E06000016 = [
    	"E07000130",
    	"E07000129",
    	"E07000135",
    	"E07000131",
    	"E07000133",
    	"E07000134"
    ];
    var E06000017 = [
    	"E07000141",
    	"E06000061",
    	"E07000133",
    	"E07000131",
    	"E06000031",
    	"E07000011"
    ];
    var E06000018 = [
    	"E07000172",
    	"E07000176",
    	"E07000173",
    	"E07000170",
    	"E07000175",
    	"E07000036"
    ];
    var E06000019 = [
    	"E07000235",
    	"W06000023",
    	"E07000080",
    	"E06000051",
    	"W06000021",
    	"E07000083"
    ];
    var E06000020 = [
    	"E06000051",
    	"E07000197",
    	"E07000196",
    	"E07000195",
    	"E08000031",
    	"W06000006"
    ];
    var E06000021 = [
    	"E07000198",
    	"E07000195",
    	"E07000197",
    	"E06000051",
    	"E07000193",
    	"E06000050"
    ];
    var E06000022 = [
    	"E07000187",
    	"E06000024",
    	"E06000025",
    	"E06000054",
    	"E06000023",
    	"E07000188"
    ];
    var E06000023 = [
    	"E06000024",
    	"E06000025",
    	"E06000022",
    	"W06000021",
    	"W06000015",
    	"W06000022"
    ];
    var E06000024 = [
    	"E06000023",
    	"E06000022",
    	"E07000188",
    	"E07000187",
    	"E06000025",
    	"W06000022"
    ];
    var E06000025 = [
    	"E07000082",
    	"E06000023",
    	"E06000054",
    	"E06000022",
    	"E07000080",
    	"W06000021"
    ];
    var E06000026 = [
    	"E07000044",
    	"E06000052",
    	"E07000047",
    	"E07000045",
    	"E07000046",
    	"E06000027"
    ];
    var E06000027 = [
    	"E07000044",
    	"E07000045",
    	"E07000047",
    	"E07000040",
    	"E07000041",
    	"E07000046"
    ];
    var E06000030 = [
    	"E06000054",
    	"E07000180",
    	"E07000079",
    	"E06000037",
    	"E07000181",
    	"E07000082"
    ];
    var E06000031 = [
    	"E07000141",
    	"E07000011",
    	"E07000010",
    	"E07000140",
    	"E06000061",
    	"E06000017"
    ];
    var E06000032 = [
    	"E06000056",
    	"E07000099",
    	"E07000096",
    	"E07000240",
    	"E07000241",
    	"E07000243"
    ];
    var E06000033 = [
    	"E07000075",
    	"E07000069",
    	"E06000035",
    	"E07000070",
    	"E07000066",
    	"E06000034"
    ];
    var E06000034 = [
    	"E09000016",
    	"E07000066",
    	"E07000109",
    	"E06000035",
    	"E07000107",
    	"E07000068"
    ];
    var E06000035 = [
    	"E07000113",
    	"E07000109",
    	"E07000115",
    	"E07000069",
    	"E06000034",
    	"E07000110"
    ];
    var E06000036 = [
    	"E06000040",
    	"E06000041",
    	"E07000214",
    	"E07000089",
    	"E07000209",
    	"E06000039"
    ];
    var E06000037 = [
    	"E07000084",
    	"E07000180",
    	"E06000054",
    	"E07000179",
    	"E06000038",
    	"E06000041"
    ];
    var E06000038 = [
    	"E07000179",
    	"E06000041",
    	"E06000037",
    	"E07000084",
    	"E07000089",
    	"E06000036"
    ];
    var E06000039 = [
    	"E06000060",
    	"E06000040",
    	"E09000017",
    	"E07000213",
    	"E06000036",
    	"E07000212"
    ];
    var E06000040 = [
    	"E06000036",
    	"E06000060",
    	"E06000041",
    	"E06000039",
    	"E07000212",
    	"E07000214"
    ];
    var E06000041 = [
    	"E06000040",
    	"E07000179",
    	"E07000089",
    	"E06000038",
    	"E06000036",
    	"E06000037"
    ];
    var E06000042 = [
    	"E06000062",
    	"E06000060",
    	"E06000056",
    	"E06000055",
    	"E06000061",
    	"E07000011"
    ];
    var E06000043 = [
    	"E07000063",
    	"E07000228",
    	"E07000223",
    	"E07000227",
    	"E07000065",
    	"E07000229"
    ];
    var E06000044 = [
    	"E07000090",
    	"E07000088",
    	"E07000087",
    	"E07000094",
    	"E06000046",
    	"E07000085"
    ];
    var E06000045 = [
    	"E07000086",
    	"E07000093",
    	"E07000091",
    	"E07000087",
    	"E06000054",
    	"E07000094"
    ];
    var E06000046 = [
    	"E07000091",
    	"E06000044",
    	"E07000088",
    	"E07000087",
    	"E07000086",
    	"E07000090"
    ];
    var E06000047 = [
    	"E06000057",
    	"E07000166",
    	"E07000030",
    	"E06000005",
    	"E08000024",
    	"E08000037"
    ];
    var E06000049 = [
    	"E06000050",
    	"E06000051",
    	"E08000007",
    	"E07000198",
    	"E07000195",
    	"E07000037"
    ];
    var E06000050 = [
    	"E06000049",
    	"W06000006",
    	"W06000005",
    	"E06000006",
    	"E08000015",
    	"E08000012"
    ];
    var E06000051 = [
    	"W06000023",
    	"E06000020",
    	"E06000019",
    	"W06000006",
    	"E07000196",
    	"E06000049"
    ];
    var E06000052 = [
    	"E07000046",
    	"E07000047",
    	"E06000026",
    	"E07000044",
    	"E07000043",
    	"E07000045"
    ];
    var E06000053 = [
    	"E06000052",
    	"E07000046",
    	"E07000047",
    	"E07000044",
    	"E06000026",
    	"E07000043"
    ];
    var E06000054 = [
    	"E07000093",
    	"E07000079",
    	"E06000030",
    	"E06000059",
    	"E07000091",
    	"E06000037"
    ];
    var E06000055 = [
    	"E06000056",
    	"E07000011",
    	"E06000061",
    	"E06000042",
    	"E06000060",
    	"E07000099"
    ];
    var E06000056 = [
    	"E07000099",
    	"E06000055",
    	"E06000032",
    	"E06000060",
    	"E06000042",
    	"E07000096"
    ];
    var E06000057 = [
    	"S12000026",
    	"E07000028",
    	"E06000047",
    	"E07000030",
    	"E08000021",
    	"E08000022"
    ];
    var E06000058 = [
    	"E06000059",
    	"E07000091",
    	"E06000046",
    	"E07000093",
    	"E06000045",
    	"E07000189"
    ];
    var E06000059 = [
    	"E07000189",
    	"E06000058",
    	"E07000091",
    	"E06000054",
    	"E07000040",
    	"E07000187"
    ];
    var E06000060 = [
    	"E07000179",
    	"E07000096",
    	"E07000177",
    	"E06000062",
    	"E06000056",
    	"E06000040"
    ];
    var E06000061 = [
    	"E07000011",
    	"E06000062",
    	"E06000017",
    	"E07000131",
    	"E06000055",
    	"E06000031"
    ];
    var E06000062 = [
    	"E07000177",
    	"E06000061",
    	"E07000131",
    	"E06000042",
    	"E06000060",
    	"E07000220"
    ];
    var E07000008 = [
    	"E07000012",
    	"E07000011",
    	"E07000009",
    	"E07000077",
    	"E07000099",
    	"E06000056"
    ];
    var E07000009 = [
    	"E07000245",
    	"E07000012",
    	"E07000010",
    	"E07000146",
    	"E07000011",
    	"E07000008"
    ];
    var E07000010 = [
    	"E07000146",
    	"E07000011",
    	"E07000009",
    	"E06000031",
    	"E07000140",
    	"E07000141"
    ];
    var E07000011 = [
    	"E07000012",
    	"E06000061",
    	"E06000055",
    	"E07000010",
    	"E06000031",
    	"E06000056"
    ];
    var E07000012 = [
    	"E07000011",
    	"E07000009",
    	"E07000077",
    	"E07000008",
    	"E07000099",
    	"E06000056"
    ];
    var E07000026 = [
    	"E07000030",
    	"E07000029",
    	"E07000028",
    	"E07000031",
    	"S12000006",
    	"E06000057"
    ];
    var E07000027 = [
    	"E07000031",
    	"E07000029",
    	"E07000128",
    	"E07000121",
    	"E07000030",
    	"E06000009"
    ];
    var E07000028 = [
    	"E06000057",
    	"S12000006",
    	"E07000030",
    	"E07000026",
    	"S12000026",
    	"E06000047"
    ];
    var E07000029 = [
    	"E07000031",
    	"E07000026",
    	"E07000027",
    	"E07000030",
    	"E07000121",
    	"E07000028"
    ];
    var E07000030 = [
    	"E07000031",
    	"E07000026",
    	"E06000047",
    	"E07000028",
    	"E06000057",
    	"E07000166"
    ];
    var E07000031 = [
    	"E07000030",
    	"E07000121",
    	"E07000029",
    	"E07000027",
    	"E07000026",
    	"E07000163"
    ];
    var E07000032 = [
    	"E07000035",
    	"E07000036",
    	"E07000038",
    	"E06000015",
    	"E07000039",
    	"E07000172"
    ];
    var E07000033 = [
    	"E07000038",
    	"E07000170",
    	"E07000171",
    	"E07000174",
    	"E08000018",
    	"E07000034"
    ];
    var E07000034 = [
    	"E07000038",
    	"E07000033",
    	"E08000018",
    	"E08000019",
    	"E07000174",
    	"E07000170"
    ];
    var E07000035 = [
    	"E07000037",
    	"E07000032",
    	"E07000193",
    	"E07000038",
    	"E07000198",
    	"E07000039"
    ];
    var E07000036 = [
    	"E07000032",
    	"E07000172",
    	"E06000015",
    	"E07000039",
    	"E07000134",
    	"E07000176"
    ];
    var E07000037 = [
    	"E07000035",
    	"E06000049",
    	"E08000019",
    	"E08000008",
    	"E08000007",
    	"E07000198"
    ];
    var E07000038 = [
    	"E07000034",
    	"E08000019",
    	"E07000035",
    	"E07000033",
    	"E07000032",
    	"E08000018"
    ];
    var E07000039 = [
    	"E07000134",
    	"E07000193",
    	"E06000015",
    	"E07000035",
    	"E07000194",
    	"E07000036"
    ];
    var E07000040 = [
    	"E07000042",
    	"E06000059",
    	"E07000041",
    	"E07000189",
    	"E07000246",
    	"E07000045"
    ];
    var E07000041 = [
    	"E07000040",
    	"E07000045",
    	"E07000043",
    	"E07000044",
    	"E06000027",
    	"E07000047"
    ];
    var E07000042 = [
    	"E07000040",
    	"E07000246",
    	"E07000043",
    	"E07000047",
    	"E07000045",
    	"E07000046"
    ];
    var E07000043 = [
    	"E07000046",
    	"E07000042",
    	"E07000246",
    	"E06000052",
    	"E07000047",
    	"E07000040"
    ];
    var E07000044 = [
    	"E07000045",
    	"E07000047",
    	"E06000026",
    	"E06000027",
    	"E06000052",
    	"E07000046"
    ];
    var E07000045 = [
    	"E07000044",
    	"E07000047",
    	"E07000042",
    	"E07000041",
    	"E06000027",
    	"E07000040"
    ];
    var E07000046 = [
    	"E07000047",
    	"E06000052",
    	"E07000043",
    	"E07000042",
    	"E07000246",
    	"E07000045"
    ];
    var E07000047 = [
    	"E07000046",
    	"E06000052",
    	"E07000044",
    	"E07000042",
    	"E07000045",
    	"E06000026"
    ];
    var E07000061 = [
    	"E07000065",
    	"E07000064",
    	"E07000063",
    	"E07000062",
    	"E07000228",
    	"E06000043"
    ];
    var E07000062 = [
    	"E07000064",
    	"E07000105",
    	"E07000112",
    	"E07000116",
    	"E07000065",
    	"E07000061"
    ];
    var E07000063 = [
    	"E07000065",
    	"E07000228",
    	"E06000043",
    	"E07000227",
    	"E07000223",
    	"E07000061"
    ];
    var E07000064 = [
    	"E07000065",
    	"E07000116",
    	"E07000062",
    	"E07000105",
    	"E07000112",
    	"E07000061"
    ];
    var E07000065 = [
    	"E07000064",
    	"E07000063",
    	"E07000116",
    	"E07000228",
    	"E07000061",
    	"E07000111"
    ];
    var E07000066 = [
    	"E07000070",
    	"E06000034",
    	"E07000068",
    	"E07000069",
    	"E07000075",
    	"E07000072"
    ];
    var E07000067 = [
    	"E07000077",
    	"E07000071",
    	"E07000245",
    	"E07000200",
    	"E07000074",
    	"E07000070"
    ];
    var E07000068 = [
    	"E07000072",
    	"E09000016",
    	"E07000070",
    	"E07000066",
    	"E06000034",
    	"E09000002"
    ];
    var E07000069 = [
    	"E06000033",
    	"E06000035",
    	"E07000066",
    	"E07000075",
    	"E06000034",
    	"E07000074"
    ];
    var E07000070 = [
    	"E07000077",
    	"E07000066",
    	"E07000067",
    	"E07000074",
    	"E07000068",
    	"E07000075"
    ];
    var E07000071 = [
    	"E07000067",
    	"E07000076",
    	"E07000200",
    	"E07000074",
    	"E07000070",
    	"E07000245"
    ];
    var E07000072 = [
    	"E07000068",
    	"E07000077",
    	"E07000073",
    	"E09000026",
    	"E07000095",
    	"E07000242"
    ];
    var E07000073 = [
    	"E07000072",
    	"E07000242",
    	"E07000077",
    	"E07000095",
    	"E07000068",
    	"E07000099"
    ];
    var E07000074 = [
    	"E07000071",
    	"E07000075",
    	"E07000067",
    	"E07000070",
    	"E07000076",
    	"E07000069"
    ];
    var E07000075 = [
    	"E07000074",
    	"E06000033",
    	"E07000070",
    	"E07000069",
    	"E07000066",
    	"E06000035"
    ];
    var E07000076 = [
    	"E07000071",
    	"E07000200",
    	"E07000244",
    	"E07000074",
    	"E07000202",
    	"E07000245"
    ];
    var E07000077 = [
    	"E07000012",
    	"E07000067",
    	"E07000070",
    	"E07000242",
    	"E07000072",
    	"E07000099"
    ];
    var E07000078 = [
    	"E07000083",
    	"E07000079",
    	"E07000082",
    	"E07000081",
    	"E07000235",
    	"E07000221"
    ];
    var E07000079 = [
    	"E06000054",
    	"E07000082",
    	"E07000083",
    	"E07000181",
    	"E07000221",
    	"E07000238"
    ];
    var E07000080 = [
    	"E06000019",
    	"E07000082",
    	"W06000021",
    	"E07000083",
    	"E06000025",
    	"E07000235"
    ];
    var E07000081 = [
    	"E07000083",
    	"E07000082",
    	"E07000078",
    	"E06000019",
    	"E07000235",
    	"E07000238"
    ];
    var E07000082 = [
    	"E07000079",
    	"E07000080",
    	"E06000025",
    	"E07000081",
    	"E07000083",
    	"E06000054"
    ];
    var E07000083 = [
    	"E07000079",
    	"E07000238",
    	"E07000078",
    	"E07000080",
    	"E07000235",
    	"E07000081"
    ];
    var E07000084 = [
    	"E06000037",
    	"E07000093",
    	"E07000094",
    	"E07000089",
    	"E07000085",
    	"E06000041"
    ];
    var E07000085 = [
    	"E07000094",
    	"E07000225",
    	"E07000216",
    	"E07000084",
    	"E07000089",
    	"E07000090"
    ];
    var E07000086 = [
    	"E07000094",
    	"E06000045",
    	"E07000093",
    	"E07000087",
    	"E07000091",
    	"E06000054"
    ];
    var E07000087 = [
    	"E07000094",
    	"E06000044",
    	"E07000086",
    	"E07000088",
    	"E07000085",
    	"E06000045"
    ];
    var E07000088 = [
    	"E06000044",
    	"E07000087",
    	"E07000085",
    	"E06000046",
    	"E07000086",
    	"E07000090"
    ];
    var E07000089 = [
    	"E07000084",
    	"E06000041",
    	"E07000085",
    	"E07000092",
    	"E06000036",
    	"E07000216"
    ];
    var E07000090 = [
    	"E07000085",
    	"E07000225",
    	"E06000044",
    	"E07000094",
    	"E07000088",
    	"E07000087"
    ];
    var E07000091 = [
    	"E06000059",
    	"E06000054",
    	"E06000058",
    	"E07000093",
    	"E06000045",
    	"E07000086"
    ];
    var E07000092 = [
    	"E07000089",
    	"E07000209",
    	"E07000214",
    	"E07000216",
    	"E07000085",
    	"E06000036"
    ];
    var E07000093 = [
    	"E06000054",
    	"E07000094",
    	"E07000084",
    	"E07000091",
    	"E06000045",
    	"E07000086"
    ];
    var E07000094 = [
    	"E07000085",
    	"E07000093",
    	"E07000086",
    	"E07000084",
    	"E07000087",
    	"E07000090"
    ];
    var E07000095 = [
    	"E07000242",
    	"E07000072",
    	"E09000010",
    	"E07000241",
    	"E07000073",
    	"E07000098"
    ];
    var E07000096 = [
    	"E06000060",
    	"E06000056",
    	"E07000240",
    	"E07000102",
    	"E06000032",
    	"E07000103"
    ];
    var E07000098 = [
    	"E07000240",
    	"E09000003",
    	"E07000241",
    	"E07000103",
    	"E09000015",
    	"E09000010"
    ];
    var E07000099 = [
    	"E06000056",
    	"E07000242",
    	"E07000012",
    	"E07000241",
    	"E07000243",
    	"E07000240"
    ];
    var E07000102 = [
    	"E07000103",
    	"E07000096",
    	"E06000060",
    	"E09000017",
    	"E07000240",
    	"E09000015"
    ];
    var E07000103 = [
    	"E07000102",
    	"E07000098",
    	"E07000240",
    	"E07000096",
    	"E09000015",
    	"E09000017"
    ];
    var E07000105 = [
    	"E07000112",
    	"E07000116",
    	"E07000110",
    	"E07000113",
    	"E07000064",
    	"E07000106"
    ];
    var E07000106 = [
    	"E07000108",
    	"E07000113",
    	"E07000112",
    	"E07000105",
    	"E07000114",
    	"E07000110"
    ];
    var E07000107 = [
    	"E07000111",
    	"E09000004",
    	"E07000109",
    	"E06000034",
    	"E09000006",
    	"E07000115"
    ];
    var E07000108 = [
    	"E07000106",
    	"E07000112",
    	"E07000114",
    	"E07000113",
    	"E07000105",
    	"E07000064"
    ];
    var E07000109 = [
    	"E06000035",
    	"E06000034",
    	"E07000107",
    	"E07000115",
    	"E07000111",
    	"E07000110"
    ];
    var E07000110 = [
    	"E07000116",
    	"E07000113",
    	"E07000115",
    	"E07000105",
    	"E06000035",
    	"E07000109"
    ];
    var E07000111 = [
    	"E07000115",
    	"E09000006",
    	"E07000107",
    	"E07000215",
    	"E07000116",
    	"E07000065"
    ];
    var E07000112 = [
    	"E07000105",
    	"E07000108",
    	"E07000106",
    	"E07000064",
    	"E07000110",
    	"E07000113"
    ];
    var E07000113 = [
    	"E07000110",
    	"E07000105",
    	"E06000035",
    	"E07000106",
    	"E07000112",
    	"E06000033"
    ];
    var E07000114 = [
    	"E07000108",
    	"E07000106",
    	"E07000112",
    	"E07000105",
    	"E07000075",
    	"E07000113"
    ];
    var E07000115 = [
    	"E07000111",
    	"E07000110",
    	"E07000116",
    	"E06000035",
    	"E07000109",
    	"E07000107"
    ];
    var E07000116 = [
    	"E07000065",
    	"E07000110",
    	"E07000105",
    	"E07000064",
    	"E07000115",
    	"E07000111"
    ];
    var E07000117 = [
    	"E07000122",
    	"E07000125",
    	"E08000033",
    	"E07000120",
    	"E07000124",
    	"E06000008"
    ];
    var E07000118 = [
    	"E07000126",
    	"E07000127",
    	"E06000008",
    	"E08000001",
    	"E08000010",
    	"E07000123"
    ];
    var E07000119 = [
    	"E07000128",
    	"E07000127",
    	"E06000009",
    	"E07000123",
    	"E07000126",
    	"E07000118"
    ];
    var E07000120 = [
    	"E07000124",
    	"E07000125",
    	"E06000008",
    	"E07000117",
    	"E07000122",
    	"E07000118"
    ];
    var E07000121 = [
    	"E07000031",
    	"E07000128",
    	"E07000163",
    	"E07000124",
    	"E07000123",
    	"E07000119"
    ];
    var E07000122 = [
    	"E07000124",
    	"E07000117",
    	"E07000163",
    	"E08000033",
    	"E08000032",
    	"E07000120"
    ];
    var E07000123 = [
    	"E07000128",
    	"E07000126",
    	"E07000124",
    	"E07000119",
    	"E07000127",
    	"E06000008"
    ];
    var E07000124 = [
    	"E07000163",
    	"E07000122",
    	"E07000121",
    	"E07000123",
    	"E07000120",
    	"E07000128"
    ];
    var E07000125 = [
    	"E08000005",
    	"E07000117",
    	"E08000002",
    	"E07000120",
    	"E06000008",
    	"E08000033"
    ];
    var E07000126 = [
    	"E07000118",
    	"E07000123",
    	"E07000124",
    	"E07000127",
    	"E07000119",
    	"E06000008"
    ];
    var E07000127 = [
    	"E08000014",
    	"E07000118",
    	"E07000119",
    	"E08000010",
    	"E08000013",
    	"E07000126"
    ];
    var E07000128 = [
    	"E07000121",
    	"E07000119",
    	"E07000123",
    	"E06000009",
    	"E07000124",
    	"E07000126"
    ];
    var E07000129 = [
    	"E07000132",
    	"E07000131",
    	"E06000016",
    	"E07000135",
    	"E07000220",
    	"E07000130"
    ];
    var E07000130 = [
    	"E07000176",
    	"E07000134",
    	"E07000133",
    	"E06000016",
    	"E07000132",
    	"E07000131"
    ];
    var E07000131 = [
    	"E06000062",
    	"E06000061",
    	"E07000129",
    	"E06000017",
    	"E07000133",
    	"E07000220"
    ];
    var E07000132 = [
    	"E07000129",
    	"E07000134",
    	"E07000218",
    	"E07000130",
    	"E07000220",
    	"E07000219"
    ];
    var E07000133 = [
    	"E07000176",
    	"E06000017",
    	"E07000141",
    	"E07000130",
    	"E07000131",
    	"E07000175"
    ];
    var E07000134 = [
    	"E07000039",
    	"E07000132",
    	"E07000130",
    	"E07000176",
    	"E07000036",
    	"E07000218"
    ];
    var E07000135 = [
    	"E07000129",
    	"E07000131",
    	"E06000016",
    	"E07000133",
    	"E07000220",
    	"E07000132"
    ];
    var E07000136 = [
    	"E07000137",
    	"E07000140",
    	"E07000139",
    	"E07000146",
    	"E07000141",
    	"E07000142"
    ];
    var E07000137 = [
    	"E07000142",
    	"E07000136",
    	"E06000012",
    	"E07000139",
    	"E07000141",
    	"E06000013"
    ];
    var E07000138 = [
    	"E07000139",
    	"E07000142",
    	"E07000175",
    	"E07000171",
    	"E07000141",
    	"E07000136"
    ];
    var E07000139 = [
    	"E07000141",
    	"E07000175",
    	"E07000142",
    	"E07000138",
    	"E07000136",
    	"E07000137"
    ];
    var E07000140 = [
    	"E07000136",
    	"E07000141",
    	"E07000146",
    	"E07000010",
    	"E06000031",
    	"E07000139"
    ];
    var E07000141 = [
    	"E07000139",
    	"E06000017",
    	"E07000140",
    	"E06000031",
    	"E07000133",
    	"E07000175"
    ];
    var E07000142 = [
    	"E06000013",
    	"E07000137",
    	"E06000012",
    	"E07000171",
    	"E07000139",
    	"E07000138"
    ];
    var E07000143 = [
    	"E07000149",
    	"E07000146",
    	"E07000245",
    	"E07000147",
    	"E07000144",
    	"E07000203"
    ];
    var E07000144 = [
    	"E07000147",
    	"E07000148",
    	"E07000149",
    	"E07000145",
    	"E07000143",
    	"E07000244"
    ];
    var E07000145 = [
    	"E07000144",
    	"E07000147",
    	"E07000244",
    	"E07000149",
    	"E07000148",
    	"E07000203"
    ];
    var E07000146 = [
    	"E07000143",
    	"E07000010",
    	"E07000147",
    	"E07000140",
    	"E07000009",
    	"E07000245"
    ];
    var E07000147 = [
    	"E07000144",
    	"E07000146",
    	"E07000143",
    	"E07000145",
    	"E07000148",
    	"E07000149"
    ];
    var E07000148 = [
    	"E07000144",
    	"E07000149",
    	"E07000244",
    	"E07000145",
    	"E07000143",
    	"E07000203"
    ];
    var E07000149 = [
    	"E07000143",
    	"E07000244",
    	"E07000148",
    	"E07000144",
    	"E07000203",
    	"E07000145"
    ];
    var E07000163 = [
    	"E07000165",
    	"E07000124",
    	"E07000166",
    	"E07000121",
    	"E08000032",
    	"E07000122"
    ];
    var E07000164 = [
    	"E07000167",
    	"E07000165",
    	"E07000166",
    	"E06000004",
    	"E07000168",
    	"E06000014"
    ];
    var E07000165 = [
    	"E07000164",
    	"E08000035",
    	"E07000163",
    	"E07000166",
    	"E08000032",
    	"E07000169"
    ];
    var E07000166 = [
    	"E06000047",
    	"E07000164",
    	"E06000005",
    	"E07000163",
    	"E07000165",
    	"E07000030"
    ];
    var E07000167 = [
    	"E07000168",
    	"E07000164",
    	"E06000011",
    	"E06000014",
    	"E07000165",
    	"E07000169"
    ];
    var E07000168 = [
    	"E07000167",
    	"E06000003",
    	"E06000011",
    	"E07000164",
    	"E06000004",
    	"E06000002"
    ];
    var E07000169 = [
    	"E06000011",
    	"E08000035",
    	"E06000014",
    	"E08000036",
    	"E08000017",
    	"E07000165"
    ];
    var E07000170 = [
    	"E07000033",
    	"E07000173",
    	"E07000172",
    	"E07000174",
    	"E07000032",
    	"E06000018"
    ];
    var E07000171 = [
    	"E07000175",
    	"E07000142",
    	"E08000017",
    	"E08000018",
    	"E06000013",
    	"E07000033"
    ];
    var E07000172 = [
    	"E06000018",
    	"E07000036",
    	"E07000170",
    	"E07000032",
    	"E07000176",
    	"E07000173"
    ];
    var E07000173 = [
    	"E07000175",
    	"E07000170",
    	"E06000018",
    	"E07000176",
    	"E07000172",
    	"E07000033"
    ];
    var E07000174 = [
    	"E07000175",
    	"E07000033",
    	"E07000171",
    	"E07000170",
    	"E07000173",
    	"E07000034"
    ];
    var E07000175 = [
    	"E07000171",
    	"E07000139",
    	"E07000173",
    	"E07000176",
    	"E07000174",
    	"E07000141"
    ];
    var E07000176 = [
    	"E07000133",
    	"E07000130",
    	"E07000175",
    	"E06000018",
    	"E07000173",
    	"E07000134"
    ];
    var E07000177 = [
    	"E06000062",
    	"E06000060",
    	"E07000181",
    	"E07000221",
    	"E07000179",
    	"E07000178"
    ];
    var E07000178 = [
    	"E07000179",
    	"E07000180",
    	"E07000177",
    	"E07000181",
    	"E06000054",
    	"E07000221"
    ];
    var E07000179 = [
    	"E06000060",
    	"E07000180",
    	"E06000037",
    	"E07000178",
    	"E07000177",
    	"E06000038"
    ];
    var E07000180 = [
    	"E07000179",
    	"E07000181",
    	"E06000037",
    	"E06000030",
    	"E07000178",
    	"E07000079"
    ];
    var E07000181 = [
    	"E07000177",
    	"E07000079",
    	"E07000180",
    	"E07000221",
    	"E07000178",
    	"E06000054"
    ];
    var E07000187 = [
    	"E07000189",
    	"E07000188",
    	"E06000022",
    	"E06000054",
    	"E06000024",
    	"E06000023"
    ];
    var E07000188 = [
    	"E07000246",
    	"E07000187",
    	"E06000024",
    	"E07000189",
    	"E06000059",
    	"E06000022"
    ];
    var E07000189 = [
    	"E06000059",
    	"E07000187",
    	"E07000246",
    	"E07000040",
    	"E06000054",
    	"E07000188"
    ];
    var E07000192 = [
    	"E07000194",
    	"E07000196",
    	"E07000197",
    	"E08000030",
    	"E07000193",
    	"E08000031"
    ];
    var E07000193 = [
    	"E07000198",
    	"E07000039",
    	"E07000035",
    	"E07000194",
    	"E07000197",
    	"E07000192"
    ];
    var E07000194 = [
    	"E07000193",
    	"E07000192",
    	"E07000199",
    	"E08000030",
    	"E07000218",
    	"E07000039"
    ];
    var E07000195 = [
    	"E06000051",
    	"E06000049",
    	"E07000197",
    	"E06000021",
    	"E07000198",
    	"E06000050"
    ];
    var E07000196 = [
    	"E06000051",
    	"E07000197",
    	"E08000031",
    	"E08000027",
    	"E07000192",
    	"E07000239"
    ];
    var E07000197 = [
    	"E07000196",
    	"E07000195",
    	"E07000193",
    	"E06000020",
    	"E06000021",
    	"E07000198"
    ];
    var E07000198 = [
    	"E07000193",
    	"E06000049",
    	"E07000035",
    	"E06000021",
    	"E07000197",
    	"E07000037"
    ];
    var E07000199 = [
    	"E07000194",
    	"E07000218",
    	"E08000025",
    	"E07000134",
    	"E07000039",
    	"E07000219"
    ];
    var E07000200 = [
    	"E07000203",
    	"E07000245",
    	"E07000067",
    	"E07000071",
    	"E07000076",
    	"E07000244"
    ];
    var E07000202 = [
    	"E07000244",
    	"E07000200",
    	"E07000203",
    	"E07000071",
    	"E07000245",
    	"E07000076"
    ];
    var E07000203 = [
    	"E07000244",
    	"E07000245",
    	"E07000200",
    	"E07000149",
    	"E07000202",
    	"E07000143"
    ];
    var E07000207 = [
    	"E07000209",
    	"E07000213",
    	"E07000210",
    	"E09000021",
    	"E07000212",
    	"E09000027"
    ];
    var E07000208 = [
    	"E09000021",
    	"E07000211",
    	"E09000029",
    	"E07000210",
    	"E09000024",
    	"E07000207"
    ];
    var E07000209 = [
    	"E07000216",
    	"E07000217",
    	"E07000210",
    	"E07000207",
    	"E07000214",
    	"E07000092"
    ];
    var E07000210 = [
    	"E07000211",
    	"E07000209",
    	"E07000227",
    	"E07000226",
    	"E07000207",
    	"E07000216"
    ];
    var E07000211 = [
    	"E07000210",
    	"E07000215",
    	"E09000029",
    	"E07000208",
    	"E09000008",
    	"E07000226"
    ];
    var E07000212 = [
    	"E06000040",
    	"E07000213",
    	"E07000214",
    	"E07000217",
    	"E07000207",
    	"E09000018"
    ];
    var E07000213 = [
    	"E07000212",
    	"E09000018",
    	"E07000207",
    	"E06000040",
    	"E09000017",
    	"E09000027"
    ];
    var E07000214 = [
    	"E07000217",
    	"E06000036",
    	"E07000209",
    	"E07000212",
    	"E07000092",
    	"E06000040"
    ];
    var E07000215 = [
    	"E07000111",
    	"E07000211",
    	"E09000008",
    	"E07000228",
    	"E09000006",
    	"E07000226"
    ];
    var E07000216 = [
    	"E07000209",
    	"E07000225",
    	"E07000085",
    	"E07000227",
    	"E07000210",
    	"E07000092"
    ];
    var E07000217 = [
    	"E07000209",
    	"E07000214",
    	"E07000212",
    	"E07000207",
    	"E06000036",
    	"E07000213"
    ];
    var E07000218 = [
    	"E07000219",
    	"E07000132",
    	"E08000029",
    	"E08000025",
    	"E07000194",
    	"E07000199"
    ];
    var E07000219 = [
    	"E07000218",
    	"E07000220",
    	"E08000026",
    	"E07000132",
    	"E08000029",
    	"E07000129"
    ];
    var E07000220 = [
    	"E06000062",
    	"E07000221",
    	"E07000219",
    	"E07000222",
    	"E08000026",
    	"E07000131"
    ];
    var E07000221 = [
    	"E07000222",
    	"E07000238",
    	"E07000177",
    	"E07000079",
    	"E07000220",
    	"E06000062"
    ];
    var E07000222 = [
    	"E07000221",
    	"E08000029",
    	"E08000026",
    	"E07000220",
    	"E08000025",
    	"E07000238"
    ];
    var E07000223 = [
    	"E07000227",
    	"E07000229",
    	"E06000043",
    	"E07000224",
    	"E07000228",
    	"E07000063"
    ];
    var E07000224 = [
    	"E07000225",
    	"E07000227",
    	"E07000229",
    	"E07000223",
    	"E07000085",
    	"E07000228"
    ];
    var E07000225 = [
    	"E07000227",
    	"E07000224",
    	"E07000085",
    	"E07000216",
    	"E07000090",
    	"E06000044"
    ];
    var E07000226 = [
    	"E07000227",
    	"E07000228",
    	"E07000210",
    	"E07000211",
    	"E07000215",
    	"E07000065"
    ];
    var E07000227 = [
    	"E07000225",
    	"E07000228",
    	"E07000224",
    	"E07000210",
    	"E07000226",
    	"E07000223"
    ];
    var E07000228 = [
    	"E07000227",
    	"E07000065",
    	"E07000063",
    	"E07000215",
    	"E06000043",
    	"E07000226"
    ];
    var E07000229 = [
    	"E07000224",
    	"E07000223",
    	"E06000043",
    	"E07000228",
    	"E07000227",
    	"E07000225"
    ];
    var E07000234 = [
    	"E08000025",
    	"E07000238",
    	"E08000027",
    	"E07000236",
    	"E07000239",
    	"E07000221"
    ];
    var E07000235 = [
    	"E06000019",
    	"E07000238",
    	"E06000051",
    	"E07000239",
    	"E07000083",
    	"E07000237"
    ];
    var E07000236 = [
    	"E07000234",
    	"E07000238",
    	"E07000221",
    	"E08000029",
    	"E07000239",
    	"E08000025"
    ];
    var E07000237 = [
    	"E07000235",
    	"E07000238",
    	"E07000234",
    	"E07000079",
    	"E06000051",
    	"E07000236"
    ];
    var E07000238 = [
    	"E07000083",
    	"E07000221",
    	"E07000235",
    	"E07000239",
    	"E07000234",
    	"E07000079"
    ];
    var E07000239 = [
    	"E07000235",
    	"E06000051",
    	"E07000238",
    	"E07000196",
    	"E07000234",
    	"E06000019"
    ];
    var E07000240 = [
    	"E07000098",
    	"E07000241",
    	"E07000096",
    	"E07000102",
    	"E06000056",
    	"E07000099"
    ];
    var E07000241 = [
    	"E07000242",
    	"E07000099",
    	"E07000240",
    	"E07000098",
    	"E07000095",
    	"E09000010"
    ];
    var E07000242 = [
    	"E07000099",
    	"E07000077",
    	"E07000241",
    	"E07000095",
    	"E07000243",
    	"E07000072"
    ];
    var E07000243 = [
    	"E07000099",
    	"E07000242",
    	"E07000240",
    	"E07000241",
    	"E06000032",
    	"E06000056"
    ];
    var E07000244 = [
    	"E07000203",
    	"E07000149",
    	"E07000202",
    	"E07000145",
    	"E07000200",
    	"E07000143"
    ];
    var E07000245 = [
    	"E07000009",
    	"E07000143",
    	"E07000203",
    	"E07000200",
    	"E07000067",
    	"E07000012"
    ];
    var E07000246 = [
    	"E07000188",
    	"E07000042",
    	"E07000043",
    	"E07000189",
    	"E07000040",
    	"E06000059"
    ];
    var E08000001 = [
    	"E08000010",
    	"E08000002",
    	"E06000008",
    	"E07000118",
    	"E08000006",
    	"E07000125"
    ];
    var E08000002 = [
    	"E08000001",
    	"E08000005",
    	"E07000125",
    	"E08000006",
    	"E08000003",
    	"E06000008"
    ];
    var E08000003 = [
    	"E08000009",
    	"E08000007",
    	"E06000049",
    	"E08000004",
    	"E08000002",
    	"E08000006"
    ];
    var E08000004 = [
    	"E08000005",
    	"E08000008",
    	"E08000034",
    	"E08000003",
    	"E07000037",
    	"E08000033"
    ];
    var E08000005 = [
    	"E07000125",
    	"E08000004",
    	"E08000033",
    	"E08000002",
    	"E08000003",
    	"E08000008"
    ];
    var E08000006 = [
    	"E08000009",
    	"E08000010",
    	"E08000001",
    	"E08000002",
    	"E08000003",
    	"E06000007"
    ];
    var E08000007 = [
    	"E06000049",
    	"E08000003",
    	"E08000008",
    	"E07000037",
    	"E08000006",
    	"E08000009"
    ];
    var E08000008 = [
    	"E08000004",
    	"E08000007",
    	"E07000037",
    	"E08000003",
    	"E08000034",
    	"E08000005"
    ];
    var E08000009 = [
    	"E08000003",
    	"E08000006",
    	"E06000049",
    	"E06000007",
    	"E08000010",
    	"E08000007"
    ];
    var E08000010 = [
    	"E08000001",
    	"E08000013",
    	"E08000006",
    	"E07000127",
    	"E06000007",
    	"E07000118"
    ];
    var E08000011 = [
    	"E08000012",
    	"E08000013",
    	"E06000006",
    	"E07000127",
    	"E08000014",
    	"E08000015"
    ];
    var E08000012 = [
    	"E08000011",
    	"E08000015",
    	"E08000014",
    	"E06000050",
    	"E06000006",
    	"W06000005"
    ];
    var E08000013 = [
    	"E06000007",
    	"E08000010",
    	"E08000011",
    	"E07000127",
    	"E06000006",
    	"E08000012"
    ];
    var E08000014 = [
    	"E07000127",
    	"E08000012",
    	"E08000011",
    	"E08000015",
    	"E07000118",
    	"E08000013"
    ];
    var E08000015 = [
    	"E06000050",
    	"E08000012",
    	"W06000005",
    	"E08000014",
    	"W06000004",
    	"E08000011"
    ];
    var E08000016 = [
    	"E08000019",
    	"E08000034",
    	"E08000036",
    	"E08000018",
    	"E08000017",
    	"E07000037"
    ];
    var E08000017 = [
    	"E08000018",
    	"E07000171",
    	"E06000013",
    	"E07000169",
    	"E08000036",
    	"E06000011"
    ];
    var E08000018 = [
    	"E08000017",
    	"E08000019",
    	"E07000171",
    	"E08000016",
    	"E07000033",
    	"E07000038"
    ];
    var E08000019 = [
    	"E08000016",
    	"E07000038",
    	"E08000018",
    	"E07000037",
    	"E07000035",
    	"E07000034"
    ];
    var E08000021 = [
    	"E06000057",
    	"E08000037",
    	"E08000022",
    	"E08000023",
    	"E08000024",
    	"E06000047"
    ];
    var E08000022 = [
    	"E08000021",
    	"E06000057",
    	"E08000023",
    	"E08000037",
    	"E08000024",
    	"E06000047"
    ];
    var E08000023 = [
    	"E08000024",
    	"E08000022",
    	"E08000037",
    	"E08000021",
    	"E06000047",
    	"E06000057"
    ];
    var E08000024 = [
    	"E06000047",
    	"E08000023",
    	"E08000037",
    	"E08000021",
    	"E06000057",
    	"E08000022"
    ];
    var E08000025 = [
    	"E08000029",
    	"E07000234",
    	"E08000028",
    	"E07000218",
    	"E07000194",
    	"E08000030"
    ];
    var E08000026 = [
    	"E07000222",
    	"E07000220",
    	"E08000029",
    	"E07000219",
    	"E07000218",
    	"E07000132"
    ];
    var E08000027 = [
    	"E08000028",
    	"E07000234",
    	"E07000196",
    	"E08000031",
    	"E08000025",
    	"E07000239"
    ];
    var E08000028 = [
    	"E08000027",
    	"E08000025",
    	"E08000030",
    	"E08000031",
    	"E07000194",
    	"E08000029"
    ];
    var E08000029 = [
    	"E08000025",
    	"E07000222",
    	"E07000218",
    	"E08000026",
    	"E07000221",
    	"E07000234"
    ];
    var E08000030 = [
    	"E07000194",
    	"E08000028",
    	"E08000031",
    	"E07000196",
    	"E07000192",
    	"E08000025"
    ];
    var E08000031 = [
    	"E07000196",
    	"E08000030",
    	"E08000027",
    	"E08000028",
    	"E08000025",
    	"E07000192"
    ];
    var E08000032 = [
    	"E08000035",
    	"E08000033",
    	"E07000163",
    	"E07000165",
    	"E08000034",
    	"E07000122"
    ];
    var E08000033 = [
    	"E08000034",
    	"E08000032",
    	"E08000005",
    	"E07000117",
    	"E07000125",
    	"E07000122"
    ];
    var E08000034 = [
    	"E08000033",
    	"E08000016",
    	"E08000036",
    	"E08000035",
    	"E08000004",
    	"E08000032"
    ];
    var E08000035 = [
    	"E07000165",
    	"E08000032",
    	"E07000169",
    	"E08000036",
    	"E08000034",
    	"E08000033"
    ];
    var E08000036 = [
    	"E08000035",
    	"E08000016",
    	"E07000169",
    	"E08000034",
    	"E08000017",
    	"E08000018"
    ];
    var E08000037 = [
    	"E06000047",
    	"E08000021",
    	"E06000057",
    	"E08000024",
    	"E08000023",
    	"E08000022"
    ];
    var E09000001 = [
    	"E09000028",
    	"E09000019",
    	"E09000030",
    	"E09000007",
    	"E09000033",
    	"E09000012"
    ];
    var E09000002 = [
    	"E09000016",
    	"E09000026",
    	"E09000025",
    	"E09000004",
    	"E09000011",
    	"E07000068"
    ];
    var E09000003 = [
    	"E07000098",
    	"E09000010",
    	"E09000005",
    	"E09000014",
    	"E09000007",
    	"E09000015"
    ];
    var E09000004 = [
    	"E09000011",
    	"E07000107",
    	"E09000006",
    	"E09000016",
    	"E09000002",
    	"E06000034"
    ];
    var E09000005 = [
    	"E09000009",
    	"E09000015",
    	"E09000003",
    	"E09000033",
    	"E09000007",
    	"E09000013"
    ];
    var E09000006 = [
    	"E07000111",
    	"E09000023",
    	"E09000008",
    	"E07000215",
    	"E09000004",
    	"E09000011"
    ];
    var E09000007 = [
    	"E09000033",
    	"E09000019",
    	"E09000003",
    	"E09000014",
    	"E09000005",
    	"E09000001"
    ];
    var E09000008 = [
    	"E07000215",
    	"E09000006",
    	"E09000029",
    	"E07000211",
    	"E09000022",
    	"E09000024"
    ];
    var E09000009 = [
    	"E09000018",
    	"E09000017",
    	"E09000005",
    	"E09000013",
    	"E09000015",
    	"E09000003"
    ];
    var E09000010 = [
    	"E09000003",
    	"E09000014",
    	"E07000095",
    	"E07000241",
    	"E09000031",
    	"E07000072"
    ];
    var E09000011 = [
    	"E09000023",
    	"E09000004",
    	"E09000025",
    	"E09000006",
    	"E09000030",
    	"E09000002"
    ];
    var E09000012 = [
    	"E09000019",
    	"E09000030",
    	"E09000031",
    	"E09000014",
    	"E09000025",
    	"E09000001"
    ];
    var E09000013 = [
    	"E09000020",
    	"E09000032",
    	"E09000009",
    	"E09000027",
    	"E09000018",
    	"E09000005"
    ];
    var E09000014 = [
    	"E09000010",
    	"E09000003",
    	"E09000012",
    	"E09000019",
    	"E09000031",
    	"E09000007"
    ];
    var E09000015 = [
    	"E09000005",
    	"E09000017",
    	"E07000098",
    	"E09000003",
    	"E09000009",
    	"E07000102"
    ];
    var E09000016 = [
    	"E06000034",
    	"E07000068",
    	"E09000002",
    	"E07000072",
    	"E09000004",
    	"E09000026"
    ];
    var E09000017 = [
    	"E06000060",
    	"E09000009",
    	"E07000102",
    	"E09000018",
    	"E09000015",
    	"E07000213"
    ];
    var E09000018 = [
    	"E09000027",
    	"E09000009",
    	"E07000213",
    	"E09000017",
    	"E09000013",
    	"E09000021"
    ];
    var E09000019 = [
    	"E09000012",
    	"E09000007",
    	"E09000014",
    	"E09000001",
    	"E09000033",
    	"E09000003"
    ];
    var E09000020 = [
    	"E09000033",
    	"E09000013",
    	"E09000032",
    	"E09000005",
    	"E09000007",
    	"E09000027"
    ];
    var E09000021 = [
    	"E09000027",
    	"E07000207",
    	"E07000208",
    	"E09000024",
    	"E07000210",
    	"E09000029"
    ];
    var E09000022 = [
    	"E09000028",
    	"E09000032",
    	"E09000008",
    	"E09000024",
    	"E09000033",
    	"E09000001"
    ];
    var E09000023 = [
    	"E09000006",
    	"E09000011",
    	"E09000028",
    	"E09000030",
    	"E09000008",
    	"E07000111"
    ];
    var E09000024 = [
    	"E09000032",
    	"E09000029",
    	"E09000021",
    	"E09000008",
    	"E09000022",
    	"E09000027"
    ];
    var E09000025 = [
    	"E09000011",
    	"E09000026",
    	"E09000030",
    	"E09000002",
    	"E09000031",
    	"E09000012"
    ];
    var E09000026 = [
    	"E07000072",
    	"E09000002",
    	"E09000031",
    	"E09000025",
    	"E09000016",
    	"E09000010"
    ];
    var E09000027 = [
    	"E09000018",
    	"E09000021",
    	"E09000032",
    	"E07000207",
    	"E09000013",
    	"E07000213"
    ];
    var E09000028 = [
    	"E09000022",
    	"E09000023",
    	"E09000030",
    	"E09000001",
    	"E09000006",
    	"E09000033"
    ];
    var E09000029 = [
    	"E09000008",
    	"E09000024",
    	"E07000211",
    	"E07000208",
    	"E09000021",
    	"E07000210"
    ];
    var E09000030 = [
    	"E09000012",
    	"E09000025",
    	"E09000028",
    	"E09000011",
    	"E09000001",
    	"E09000023"
    ];
    var E09000031 = [
    	"E09000026",
    	"E09000012",
    	"E07000072",
    	"E09000010",
    	"E09000025",
    	"E09000014"
    ];
    var E09000032 = [
    	"E09000024",
    	"E09000022",
    	"E09000027",
    	"E09000013",
    	"E09000020",
    	"E09000033"
    ];
    var E09000033 = [
    	"E09000020",
    	"E09000007",
    	"E09000005",
    	"E09000022",
    	"E09000032",
    	"E09000001"
    ];
    var N09000001 = [
    	"N09000008",
    	"N09000007",
    	"N09000009",
    	"N09000003",
    	"N09000002",
    	"E07000062"
    ];
    var N09000002 = [
    	"N09000010",
    	"N09000009",
    	"N09000007",
    	"N09000001",
    	"W06000001",
    	"W06000002"
    ];
    var N09000003 = [
    	"N09000007",
    	"N09000001",
    	"N09000011",
    	"E07000062",
    	"E07000029"
    ];
    var N09000004 = [
    	"N09000008",
    	"N09000009",
    	"N09000005",
    	"E07000062"
    ];
    var N09000005 = [
    	"N09000006",
    	"N09000004",
    	"N09000009",
    	"E07000108"
    ];
    var N09000006 = [
    	"N09000009",
    	"N09000005",
    	"E07000108",
    	"W06000001",
    	"W06000002"
    ];
    var N09000007 = [
    	"N09000002",
    	"N09000003",
    	"N09000001",
    	"N09000010",
    	"N09000011",
    	"W06000001"
    ];
    var N09000008 = [
    	"N09000001",
    	"N09000004",
    	"N09000009",
    	"E07000062"
    ];
    var N09000009 = [
    	"N09000006",
    	"N09000002",
    	"N09000004",
    	"N09000001",
    	"N09000008",
    	"N09000005"
    ];
    var N09000010 = [
    	"N09000002",
    	"N09000011",
    	"N09000007",
    	"W06000001",
    	"W06000002",
    	"E07000029"
    ];
    var N09000011 = [
    	"N09000010",
    	"N09000007",
    	"N09000003",
    	"E07000029",
    	"E07000026",
    	"W06000001"
    ];
    var S12000005 = [
    	"S12000048",
    	"S12000030",
    	"S12000047",
    	"S12000014",
    	"E06000053"
    ];
    var S12000006 = [
    	"S12000026",
    	"S12000028",
    	"S12000008",
    	"S12000029",
    	"E07000028",
    	"E07000026"
    ];
    var S12000008 = [
    	"S12000028",
    	"S12000006",
    	"S12000029",
    	"S12000021",
    	"S12000011",
    	"E06000053"
    ];
    var S12000010 = [
    	"S12000026",
    	"S12000019",
    	"S12000036",
    	"E06000057"
    ];
    var S12000011 = [
    	"S12000008",
    	"S12000049",
    	"S12000029",
    	"S12000038",
    	"S12000021",
    	"E06000053"
    ];
    var S12000013 = [
    	"E07000062"
    ];
    var S12000014 = [
    	"S12000040",
    	"S12000050",
    	"S12000030",
    	"S12000005",
    	"E06000053"
    ];
    var S12000017 = [
    	"S12000048",
    	"S12000020",
    	"S12000035",
    	"S12000034",
    	"E06000053"
    ];
    var S12000018 = [
    	"S12000038",
    	"S12000021",
    	"S12000035",
    	"S12000039",
    	"E06000053"
    ];
    var S12000019 = [
    	"S12000026",
    	"S12000036",
    	"S12000010",
    	"E06000057",
    	"E07000028"
    ];
    var S12000020 = [
    	"S12000034",
    	"S12000017",
    	"E06000053"
    ];
    var S12000021 = [
    	"S12000008",
    	"S12000038",
    	"S12000018",
    	"S12000028",
    	"S12000011",
    	"E07000062"
    ];
    var S12000023 = [
    	"E06000053"
    ];
    var S12000026 = [
    	"E06000057",
    	"S12000006",
    	"S12000019",
    	"S12000010",
    	"S12000029",
    	"E07000028"
    ];
    var S12000027 = [
    	"E06000053"
    ];
    var S12000028 = [
    	"S12000008",
    	"S12000006",
    	"S12000021",
    	"E07000062",
    	"E07000026"
    ];
    var S12000029 = [
    	"S12000006",
    	"S12000008",
    	"S12000026",
    	"S12000050",
    	"S12000049",
    	"S12000040"
    ];
    var S12000030 = [
    	"S12000048",
    	"S12000035",
    	"S12000045",
    	"S12000039",
    	"S12000014",
    	"S12000005"
    ];
    var S12000033 = [
    	"S12000034",
    	"E06000057"
    ];
    var S12000034 = [
    	"S12000020",
    	"S12000041",
    	"S12000033",
    	"S12000048",
    	"S12000017",
    	"E06000057"
    ];
    var S12000035 = [
    	"S12000017",
    	"S12000030",
    	"S12000048",
    	"S12000039",
    	"S12000018",
    	"E07000062"
    ];
    var S12000036 = [
    	"S12000040",
    	"S12000019",
    	"S12000010",
    	"S12000026",
    	"E06000057"
    ];
    var S12000038 = [
    	"S12000021",
    	"S12000018",
    	"S12000011",
    	"S12000039",
    	"S12000049",
    	"E06000053"
    ];
    var S12000039 = [
    	"S12000030",
    	"S12000035",
    	"S12000038",
    	"S12000045",
    	"S12000049",
    	"S12000018"
    ];
    var S12000040 = [
    	"S12000014",
    	"S12000036",
    	"S12000050",
    	"S12000029",
    	"S12000026",
    	"E06000057"
    ];
    var S12000041 = [
    	"S12000034",
    	"S12000048",
    	"S12000042",
    	"E06000057"
    ];
    var S12000042 = [
    	"S12000041",
    	"S12000048",
    	"E06000057"
    ];
    var S12000045 = [
    	"S12000030",
    	"S12000050",
    	"S12000049",
    	"S12000039",
    	"E06000053"
    ];
    var S12000047 = [
    	"S12000048",
    	"S12000005",
    	"E06000057"
    ];
    var S12000048 = [
    	"S12000030",
    	"S12000017",
    	"S12000041",
    	"S12000047",
    	"S12000034",
    	"S12000005"
    ];
    var S12000049 = [
    	"S12000029",
    	"S12000045",
    	"S12000011",
    	"S12000050",
    	"S12000038",
    	"S12000039"
    ];
    var S12000050 = [
    	"S12000029",
    	"S12000014",
    	"S12000045",
    	"S12000040",
    	"S12000049",
    	"S12000030"
    ];
    var W06000001 = [
    	"W06000003",
    	"W06000002",
    	"W06000004",
    	"W06000023",
    	"W06000005",
    	"W06000006"
    ];
    var W06000002 = [
    	"W06000003",
    	"W06000023",
    	"W06000004",
    	"W06000008",
    	"W06000001",
    	"W06000006"
    ];
    var W06000003 = [
    	"W06000002",
    	"W06000004",
    	"W06000001",
    	"W06000005",
    	"W06000006",
    	"W06000023"
    ];
    var W06000004 = [
    	"W06000003",
    	"W06000005",
    	"W06000006",
    	"W06000002",
    	"W06000023",
    	"E06000051"
    ];
    var W06000005 = [
    	"W06000004",
    	"E06000050",
    	"W06000006",
    	"E08000015",
    	"E08000012",
    	"W06000002"
    ];
    var W06000006 = [
    	"E06000051",
    	"E06000050",
    	"W06000004",
    	"W06000023",
    	"W06000005",
    	"E06000049"
    ];
    var W06000008 = [
    	"W06000010",
    	"W06000023",
    	"W06000009",
    	"W06000002",
    	"W06000012",
    	"W06000011"
    ];
    var W06000009 = [
    	"W06000010",
    	"W06000008",
    	"W06000011",
    	"W06000012",
    	"W06000023",
    	"E07000046"
    ];
    var W06000010 = [
    	"W06000008",
    	"W06000009",
    	"W06000023",
    	"W06000011",
    	"W06000012",
    	"W06000013"
    ];
    var W06000011 = [
    	"W06000010",
    	"W06000012",
    	"W06000023",
    	"W06000013",
    	"W06000009",
    	"W06000014"
    ];
    var W06000012 = [
    	"W06000013",
    	"W06000011",
    	"W06000023",
    	"W06000010",
    	"W06000016",
    	"W06000014"
    ];
    var W06000013 = [
    	"W06000012",
    	"W06000016",
    	"W06000014",
    	"W06000010",
    	"W06000024",
    	"W06000011"
    ];
    var W06000014 = [
    	"W06000015",
    	"W06000013",
    	"W06000016",
    	"W06000018",
    	"W06000012",
    	"E07000188"
    ];
    var W06000015 = [
    	"W06000014",
    	"W06000016",
    	"W06000018",
    	"W06000022",
    	"E06000023",
    	"W06000021"
    ];
    var W06000016 = [
    	"W06000024",
    	"W06000013",
    	"W06000023",
    	"W06000014",
    	"W06000015",
    	"W06000018"
    ];
    var W06000018 = [
    	"W06000019",
    	"W06000024",
    	"W06000022",
    	"W06000016",
    	"W06000020",
    	"W06000015"
    ];
    var W06000019 = [
    	"W06000018",
    	"W06000023",
    	"W06000020",
    	"W06000021",
    	"E06000019",
    	"W06000016"
    ];
    var W06000020 = [
    	"W06000021",
    	"W06000022",
    	"W06000018",
    	"W06000019",
    	"W06000023",
    	"W06000015"
    ];
    var W06000021 = [
    	"E06000019",
    	"W06000020",
    	"W06000022",
    	"E07000080",
    	"W06000023",
    	"W06000019"
    ];
    var W06000022 = [
    	"W06000021",
    	"W06000018",
    	"W06000020",
    	"W06000015",
    	"E06000023",
    	"E06000024"
    ];
    var W06000023 = [
    	"E06000051",
    	"W06000008",
    	"E06000019",
    	"W06000002",
    	"W06000010",
    	"W06000012"
    ];
    var W06000024 = [
    	"W06000016",
    	"W06000018",
    	"W06000023",
    	"W06000019",
    	"W06000013",
    	"W06000012"
    ];
    var neighbours = {
    	E06000001: E06000001,
    	E06000002: E06000002,
    	E06000003: E06000003,
    	E06000004: E06000004,
    	E06000005: E06000005,
    	E06000006: E06000006,
    	E06000007: E06000007,
    	E06000008: E06000008,
    	E06000009: E06000009,
    	E06000010: E06000010,
    	E06000011: E06000011,
    	E06000012: E06000012,
    	E06000013: E06000013,
    	E06000014: E06000014,
    	E06000015: E06000015,
    	E06000016: E06000016,
    	E06000017: E06000017,
    	E06000018: E06000018,
    	E06000019: E06000019,
    	E06000020: E06000020,
    	E06000021: E06000021,
    	E06000022: E06000022,
    	E06000023: E06000023,
    	E06000024: E06000024,
    	E06000025: E06000025,
    	E06000026: E06000026,
    	E06000027: E06000027,
    	E06000030: E06000030,
    	E06000031: E06000031,
    	E06000032: E06000032,
    	E06000033: E06000033,
    	E06000034: E06000034,
    	E06000035: E06000035,
    	E06000036: E06000036,
    	E06000037: E06000037,
    	E06000038: E06000038,
    	E06000039: E06000039,
    	E06000040: E06000040,
    	E06000041: E06000041,
    	E06000042: E06000042,
    	E06000043: E06000043,
    	E06000044: E06000044,
    	E06000045: E06000045,
    	E06000046: E06000046,
    	E06000047: E06000047,
    	E06000049: E06000049,
    	E06000050: E06000050,
    	E06000051: E06000051,
    	E06000052: E06000052,
    	E06000053: E06000053,
    	E06000054: E06000054,
    	E06000055: E06000055,
    	E06000056: E06000056,
    	E06000057: E06000057,
    	E06000058: E06000058,
    	E06000059: E06000059,
    	E06000060: E06000060,
    	E06000061: E06000061,
    	E06000062: E06000062,
    	E07000008: E07000008,
    	E07000009: E07000009,
    	E07000010: E07000010,
    	E07000011: E07000011,
    	E07000012: E07000012,
    	E07000026: E07000026,
    	E07000027: E07000027,
    	E07000028: E07000028,
    	E07000029: E07000029,
    	E07000030: E07000030,
    	E07000031: E07000031,
    	E07000032: E07000032,
    	E07000033: E07000033,
    	E07000034: E07000034,
    	E07000035: E07000035,
    	E07000036: E07000036,
    	E07000037: E07000037,
    	E07000038: E07000038,
    	E07000039: E07000039,
    	E07000040: E07000040,
    	E07000041: E07000041,
    	E07000042: E07000042,
    	E07000043: E07000043,
    	E07000044: E07000044,
    	E07000045: E07000045,
    	E07000046: E07000046,
    	E07000047: E07000047,
    	E07000061: E07000061,
    	E07000062: E07000062,
    	E07000063: E07000063,
    	E07000064: E07000064,
    	E07000065: E07000065,
    	E07000066: E07000066,
    	E07000067: E07000067,
    	E07000068: E07000068,
    	E07000069: E07000069,
    	E07000070: E07000070,
    	E07000071: E07000071,
    	E07000072: E07000072,
    	E07000073: E07000073,
    	E07000074: E07000074,
    	E07000075: E07000075,
    	E07000076: E07000076,
    	E07000077: E07000077,
    	E07000078: E07000078,
    	E07000079: E07000079,
    	E07000080: E07000080,
    	E07000081: E07000081,
    	E07000082: E07000082,
    	E07000083: E07000083,
    	E07000084: E07000084,
    	E07000085: E07000085,
    	E07000086: E07000086,
    	E07000087: E07000087,
    	E07000088: E07000088,
    	E07000089: E07000089,
    	E07000090: E07000090,
    	E07000091: E07000091,
    	E07000092: E07000092,
    	E07000093: E07000093,
    	E07000094: E07000094,
    	E07000095: E07000095,
    	E07000096: E07000096,
    	E07000098: E07000098,
    	E07000099: E07000099,
    	E07000102: E07000102,
    	E07000103: E07000103,
    	E07000105: E07000105,
    	E07000106: E07000106,
    	E07000107: E07000107,
    	E07000108: E07000108,
    	E07000109: E07000109,
    	E07000110: E07000110,
    	E07000111: E07000111,
    	E07000112: E07000112,
    	E07000113: E07000113,
    	E07000114: E07000114,
    	E07000115: E07000115,
    	E07000116: E07000116,
    	E07000117: E07000117,
    	E07000118: E07000118,
    	E07000119: E07000119,
    	E07000120: E07000120,
    	E07000121: E07000121,
    	E07000122: E07000122,
    	E07000123: E07000123,
    	E07000124: E07000124,
    	E07000125: E07000125,
    	E07000126: E07000126,
    	E07000127: E07000127,
    	E07000128: E07000128,
    	E07000129: E07000129,
    	E07000130: E07000130,
    	E07000131: E07000131,
    	E07000132: E07000132,
    	E07000133: E07000133,
    	E07000134: E07000134,
    	E07000135: E07000135,
    	E07000136: E07000136,
    	E07000137: E07000137,
    	E07000138: E07000138,
    	E07000139: E07000139,
    	E07000140: E07000140,
    	E07000141: E07000141,
    	E07000142: E07000142,
    	E07000143: E07000143,
    	E07000144: E07000144,
    	E07000145: E07000145,
    	E07000146: E07000146,
    	E07000147: E07000147,
    	E07000148: E07000148,
    	E07000149: E07000149,
    	E07000163: E07000163,
    	E07000164: E07000164,
    	E07000165: E07000165,
    	E07000166: E07000166,
    	E07000167: E07000167,
    	E07000168: E07000168,
    	E07000169: E07000169,
    	E07000170: E07000170,
    	E07000171: E07000171,
    	E07000172: E07000172,
    	E07000173: E07000173,
    	E07000174: E07000174,
    	E07000175: E07000175,
    	E07000176: E07000176,
    	E07000177: E07000177,
    	E07000178: E07000178,
    	E07000179: E07000179,
    	E07000180: E07000180,
    	E07000181: E07000181,
    	E07000187: E07000187,
    	E07000188: E07000188,
    	E07000189: E07000189,
    	E07000192: E07000192,
    	E07000193: E07000193,
    	E07000194: E07000194,
    	E07000195: E07000195,
    	E07000196: E07000196,
    	E07000197: E07000197,
    	E07000198: E07000198,
    	E07000199: E07000199,
    	E07000200: E07000200,
    	E07000202: E07000202,
    	E07000203: E07000203,
    	E07000207: E07000207,
    	E07000208: E07000208,
    	E07000209: E07000209,
    	E07000210: E07000210,
    	E07000211: E07000211,
    	E07000212: E07000212,
    	E07000213: E07000213,
    	E07000214: E07000214,
    	E07000215: E07000215,
    	E07000216: E07000216,
    	E07000217: E07000217,
    	E07000218: E07000218,
    	E07000219: E07000219,
    	E07000220: E07000220,
    	E07000221: E07000221,
    	E07000222: E07000222,
    	E07000223: E07000223,
    	E07000224: E07000224,
    	E07000225: E07000225,
    	E07000226: E07000226,
    	E07000227: E07000227,
    	E07000228: E07000228,
    	E07000229: E07000229,
    	E07000234: E07000234,
    	E07000235: E07000235,
    	E07000236: E07000236,
    	E07000237: E07000237,
    	E07000238: E07000238,
    	E07000239: E07000239,
    	E07000240: E07000240,
    	E07000241: E07000241,
    	E07000242: E07000242,
    	E07000243: E07000243,
    	E07000244: E07000244,
    	E07000245: E07000245,
    	E07000246: E07000246,
    	E08000001: E08000001,
    	E08000002: E08000002,
    	E08000003: E08000003,
    	E08000004: E08000004,
    	E08000005: E08000005,
    	E08000006: E08000006,
    	E08000007: E08000007,
    	E08000008: E08000008,
    	E08000009: E08000009,
    	E08000010: E08000010,
    	E08000011: E08000011,
    	E08000012: E08000012,
    	E08000013: E08000013,
    	E08000014: E08000014,
    	E08000015: E08000015,
    	E08000016: E08000016,
    	E08000017: E08000017,
    	E08000018: E08000018,
    	E08000019: E08000019,
    	E08000021: E08000021,
    	E08000022: E08000022,
    	E08000023: E08000023,
    	E08000024: E08000024,
    	E08000025: E08000025,
    	E08000026: E08000026,
    	E08000027: E08000027,
    	E08000028: E08000028,
    	E08000029: E08000029,
    	E08000030: E08000030,
    	E08000031: E08000031,
    	E08000032: E08000032,
    	E08000033: E08000033,
    	E08000034: E08000034,
    	E08000035: E08000035,
    	E08000036: E08000036,
    	E08000037: E08000037,
    	E09000001: E09000001,
    	E09000002: E09000002,
    	E09000003: E09000003,
    	E09000004: E09000004,
    	E09000005: E09000005,
    	E09000006: E09000006,
    	E09000007: E09000007,
    	E09000008: E09000008,
    	E09000009: E09000009,
    	E09000010: E09000010,
    	E09000011: E09000011,
    	E09000012: E09000012,
    	E09000013: E09000013,
    	E09000014: E09000014,
    	E09000015: E09000015,
    	E09000016: E09000016,
    	E09000017: E09000017,
    	E09000018: E09000018,
    	E09000019: E09000019,
    	E09000020: E09000020,
    	E09000021: E09000021,
    	E09000022: E09000022,
    	E09000023: E09000023,
    	E09000024: E09000024,
    	E09000025: E09000025,
    	E09000026: E09000026,
    	E09000027: E09000027,
    	E09000028: E09000028,
    	E09000029: E09000029,
    	E09000030: E09000030,
    	E09000031: E09000031,
    	E09000032: E09000032,
    	E09000033: E09000033,
    	N09000001: N09000001,
    	N09000002: N09000002,
    	N09000003: N09000003,
    	N09000004: N09000004,
    	N09000005: N09000005,
    	N09000006: N09000006,
    	N09000007: N09000007,
    	N09000008: N09000008,
    	N09000009: N09000009,
    	N09000010: N09000010,
    	N09000011: N09000011,
    	S12000005: S12000005,
    	S12000006: S12000006,
    	S12000008: S12000008,
    	S12000010: S12000010,
    	S12000011: S12000011,
    	S12000013: S12000013,
    	S12000014: S12000014,
    	S12000017: S12000017,
    	S12000018: S12000018,
    	S12000019: S12000019,
    	S12000020: S12000020,
    	S12000021: S12000021,
    	S12000023: S12000023,
    	S12000026: S12000026,
    	S12000027: S12000027,
    	S12000028: S12000028,
    	S12000029: S12000029,
    	S12000030: S12000030,
    	S12000033: S12000033,
    	S12000034: S12000034,
    	S12000035: S12000035,
    	S12000036: S12000036,
    	S12000038: S12000038,
    	S12000039: S12000039,
    	S12000040: S12000040,
    	S12000041: S12000041,
    	S12000042: S12000042,
    	S12000045: S12000045,
    	S12000047: S12000047,
    	S12000048: S12000048,
    	S12000049: S12000049,
    	S12000050: S12000050,
    	W06000001: W06000001,
    	W06000002: W06000002,
    	W06000003: W06000003,
    	W06000004: W06000004,
    	W06000005: W06000005,
    	W06000006: W06000006,
    	W06000008: W06000008,
    	W06000009: W06000009,
    	W06000010: W06000010,
    	W06000011: W06000011,
    	W06000012: W06000012,
    	W06000013: W06000013,
    	W06000014: W06000014,
    	W06000015: W06000015,
    	W06000016: W06000016,
    	W06000018: W06000018,
    	W06000019: W06000019,
    	W06000020: W06000020,
    	W06000021: W06000021,
    	W06000022: W06000022,
    	W06000023: W06000023,
    	W06000024: W06000024
    };

    /* src/App.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (248:2) {#if place}
    function create_if_block(ctx) {
    	let header;
    	let button0;
    	let h1;
    	let t1;
    	let nav;
    	let button1;
    	let icon0;
    	let t2;
    	let button2;
    	let icon1;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	icon0 = new Icon({ props: { type: "info" }, $$inline: true });
    	icon1 = new Icon({ props: { type: "chart" }, $$inline: true });

    	const if_block_creators = [
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_15
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*screen*/ ctx[5] === "start") return 0;
    		if (/*screen*/ ctx[5] === "intro") return 1;
    		if (/*screen*/ ctx[5] === "questionMap") return 2;
    		if (/*screen*/ ctx[5] === "question") return 3;
    		if (/*screen*/ ctx[5] === "results") return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			button0 = element("button");
    			h1 = element("h1");
    			h1.textContent = "How well do you know your area?";
    			t1 = space();
    			nav = element("nav");
    			button1 = element("button");
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			button2 = element("button");
    			create_component(icon1.$$.fragment);
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "svelte-iu46a3");
    			add_location(h1, file, 252, 31, 6303);
    			attr_dev(button0, "class", "btn-link btn-title svelte-iu46a3");
    			attr_dev(button0, "title", "Return to menu");
    			add_location(button0, file, 249, 6, 6198);
    			attr_dev(button1, "title", "About the game");
    			attr_dev(button1, "class", "svelte-iu46a3");
    			add_location(button1, file, 256, 8, 6408);
    			attr_dev(button2, "title", "View score history");
    			attr_dev(button2, "class", "svelte-iu46a3");
    			add_location(button2, file, 259, 8, 6533);
    			attr_dev(nav, "class", "svelte-iu46a3");
    			add_location(nav, file, 255, 6, 6394);
    			attr_dev(header, "class", "svelte-iu46a3");
    			add_location(header, file, 248, 4, 6183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, button0);
    			append_dev(button0, h1);
    			append_dev(header, t1);
    			append_dev(header, nav);
    			append_dev(nav, button1);
    			mount_component(icon0, button1, null);
    			append_dev(nav, t2);
    			append_dev(nav, button2);
    			mount_component(icon1, button2, null);
    			insert_dev(target, t3, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			if (detaching) detach_dev(t3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(248:2) {#if place}",
    		ctx
    	});

    	return block;
    }

    // (420:35) 
    function create_if_block_15(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let t4;
    	let t5_value = questions.length + "";
    	let t5;
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*resultsArray*/ ctx[7].map(func).join("") + "";
    	let t8;
    	let t9;
    	let button0;
    	let t10;
    	let button1;
    	let mounted;
    	let dispose;

    	function select_block_type_8(ctx, dirty) {
    		if (/*tooltip*/ ctx[8]) return create_if_block_16;
    		return create_else_block_7;
    	}

    	let current_block_type = select_block_type_8(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Score";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("You scored ");
    			t3 = text(/*score*/ ctx[4]);
    			t4 = text(" out of ");
    			t5 = text(t5_value);
    			t6 = text("!");
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			button0 = element("button");
    			if_block.c();
    			t10 = space();
    			button1 = element("button");
    			button1.textContent = "Restart";
    			attr_dev(h2, "class", "svelte-iu46a3");
    			add_location(h2, file, 421, 8, 12432);
    			add_location(p0, file, 423, 8, 12456);
    			add_location(p1, file, 425, 8, 12518);
    			attr_dev(button0, "class", "svelte-iu46a3");
    			add_location(button0, file, 427, 8, 12586);
    			attr_dev(button1, "class", "svelte-iu46a3");
    			add_location(button1, file, 439, 8, 12835);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-iu46a3");
    			add_location(div, file, 420, 6, 12398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(div, t7);
    			append_dev(div, p1);
    			append_dev(p1, t8);
    			append_dev(div, t9);
    			append_dev(div, button0);
    			if_block.m(button0, null);
    			append_dev(div, t10);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*copyResults*/ ctx[13](/*resultsArray*/ ctx[7].map(click_handler_10).join("")))) /*copyResults*/ ctx[13](/*resultsArray*/ ctx[7].map(click_handler_10).join("")).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button1, "click", /*reset*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*score*/ 16) set_data_dev(t3, /*score*/ ctx[4]);
    			if (dirty[0] & /*resultsArray*/ 128 && t8_value !== (t8_value = /*resultsArray*/ ctx[7].map(func).join("") + "")) set_data_dev(t8, t8_value);

    			if (current_block_type !== (current_block_type = select_block_type_8(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button0, null);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(420:35) ",
    		ctx
    	});

    	return block;
    }

    // (325:36) 
    function create_if_block_4(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1_value = /*questionNum*/ ctx[6] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = questions.length + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let t6_value = questions[/*questionNum*/ ctx[6]].text.replace("{place}", /*place*/ ctx[1].name).replace("{neighbour}", /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour].name) + "";
    	let t6;
    	let t7;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_5, create_if_block_10, create_else_block_6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (questions[/*questionNum*/ ctx[6]].type === "slider") return 0;
    		if (questions[/*questionNum*/ ctx[6]].type === "higher_lower") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Q.");
    			t1 = text(t1_value);
    			t2 = text(" of ");
    			t3 = text(t3_value);
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			if_block.c();
    			add_location(br, file, 327, 52, 9051);
    			attr_dev(h2, "class", "svelte-iu46a3");
    			add_location(h2, file, 326, 8, 8994);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-iu46a3");
    			add_location(div, file, 325, 6, 8960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			append_dev(h2, br);
    			append_dev(h2, t5);
    			append_dev(h2, t6);
    			append_dev(div, t7);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*questionNum*/ 64) && t1_value !== (t1_value = /*questionNum*/ ctx[6] + 1 + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*questionNum, place, lookup, answers*/ 78) && t6_value !== (t6_value = questions[/*questionNum*/ ctx[6]].text.replace("{place}", /*place*/ ctx[1].name).replace("{neighbour}", /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour].name) + "")) set_data_dev(t6, t6_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(325:36) ",
    		ctx
    	});

    	return block;
    }

    // (318:39) 
    function create_if_block_3(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1_value = /*place*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let t3;
    	let map;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Question 1. Where is ");
    			t1 = text(t1_value);
    			t2 = text("?");
    			t3 = text("\n        NOT CURRENTLY WORKING - Just go to next question\n        ");
    			create_component(map.$$.fragment);
    			t4 = space();
    			button = element("button");
    			button.textContent = "Next Question";
    			attr_dev(h2, "class", "svelte-iu46a3");
    			add_location(h2, file, 319, 8, 8709);
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 322, 8, 8834);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-iu46a3");
    			add_location(div, file, 318, 6, 8675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(div, t3);
    			mount_component(map, div, null);
    			append_dev(div, t4);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*place*/ 2) && t1_value !== (t1_value = /*place*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(map);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(318:39) ",
    		ctx
    	});

    	return block;
    }

    // (306:33) 
    function create_if_block_2(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Census data can help us to better understand the places where we live.";
    			t1 = space();
    			p1 = element("p");

    			p1.textContent = `Answer the ${questions.length} questions below to test your knowledge of
          your local authority area, and find out how it compares to the rest of
          the country.`;

    			t5 = space();
    			button = element("button");
    			button.textContent = "Back";
    			attr_dev(p0, "class", "text-big");
    			add_location(p0, file, 307, 8, 8207);
    			attr_dev(p1, "class", "text-big");
    			add_location(p1, file, 310, 8, 8330);
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 315, 8, 8558);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-iu46a3");
    			add_location(div, file, 306, 6, 8173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t5);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(306:33) ",
    		ctx
    	});

    	return block;
    }

    // (264:4) {#if screen === "start"}
    function create_if_block_1(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let hr;
    	let t8;
    	let p3;
    	let t9;
    	let select;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Census data can help us to better understand the places where we live.";
    			t1 = space();
    			p1 = element("p");

    			p1.textContent = `Answer the ${questions.length} questions in this quiz to test your knowledge
          of your local authority area, and find out how it compares to the rest
          of the country.`;

    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "This demonstrator currently uses 2011 census data";
    			t7 = space();
    			hr = element("hr");
    			t8 = space();
    			p3 = element("p");
    			t9 = text("Choose an area\n          ");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			button = element("button");
    			button.textContent = "Continue";
    			attr_dev(p0, "class", "text-big");
    			set_style(p0, "margin-top", "5px");
    			add_location(p0, file, 265, 8, 6806);
    			attr_dev(p1, "class", "text-big");
    			add_location(p1, file, 268, 8, 6953);
    			add_location(p2, file, 274, 8, 7189);
    			attr_dev(hr, "class", "svelte-iu46a3");
    			add_location(hr, file, 276, 8, 7255);
    			if (/*place*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[16].call(select));
    			add_location(select, file, 280, 10, 7335);
    			set_style(p3, "margin-top", "20px");
    			add_location(p3, file, 278, 8, 7271);
    			attr_dev(button, "class", "btn-menu btn-primary mb-5 svelte-iu46a3");
    			add_location(button, file, 297, 8, 7757);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-iu46a3");
    			add_location(div, file, 264, 6, 6772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t5);
    			append_dev(div, p2);
    			append_dev(div, t7);
    			append_dev(div, hr);
    			append_dev(div, t8);
    			append_dev(div, p3);
    			append_dev(p3, t9);
    			append_dev(p3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*place*/ ctx[1]);
    			append_dev(div, t10);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[16]),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*place, data*/ 3) {
    				select_option(select, /*place*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(264:4) {#if screen === \\\"start\\\"}",
    		ctx
    	});

    	return block;
    }

    // (435:10) {:else}
    function create_else_block_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Share");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_7.name,
    		type: "else",
    		source: "(435:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (433:10) {#if tooltip}
    function create_if_block_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Copied!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(433:10) {#if tooltip}",
    		ctx
    	});

    	return block;
    }

    // (415:2) {:else}
    function create_else_block_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Error: Unknown Question Type";
    			add_location(div, file, 415, 3, 12294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_6.name,
    		type: "else",
    		source: "(415:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (375:65) 
    function create_if_block_10(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;

    	function select_block_type_5(ctx, dirty) {
    		if (!/*answers*/ ctx[3][/*questionNum*/ ctx[6]].set) return create_if_block_11;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_5(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file, 375, 3, 10749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(375:65) ",
    		ctx
    	});

    	return block;
    }

    // (335:8) {#if questions[questionNum].type === "slider"}
    function create_if_block_5(ctx) {
    	let sliderwrapper;
    	let updating_answers;
    	let t;
    	let if_block_anchor;
    	let current;

    	function sliderwrapper_answers_binding(value) {
    		/*sliderwrapper_answers_binding*/ ctx[20](value);
    	}

    	let sliderwrapper_props = {
    		questions,
    		questionNum: /*questionNum*/ ctx[6],
    		data: /*data*/ ctx[0],
    		place: /*place*/ ctx[1]
    	};

    	if (/*answers*/ ctx[3] !== void 0) {
    		sliderwrapper_props.answers = /*answers*/ ctx[3];
    	}

    	sliderwrapper = new SliderWrapper({
    			props: sliderwrapper_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(sliderwrapper, 'answers', sliderwrapper_answers_binding));

    	function select_block_type_2(ctx, dirty) {
    		if (!/*answers*/ ctx[3][/*questionNum*/ ctx[6]].set) return create_if_block_6;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			create_component(sliderwrapper.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(sliderwrapper, target, anchor);
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sliderwrapper_changes = {};
    			if (dirty[0] & /*questionNum*/ 64) sliderwrapper_changes.questionNum = /*questionNum*/ ctx[6];
    			if (dirty[0] & /*data*/ 1) sliderwrapper_changes.data = /*data*/ ctx[0];
    			if (dirty[0] & /*place*/ 2) sliderwrapper_changes.place = /*place*/ ctx[1];

    			if (!updating_answers && dirty[0] & /*answers*/ 8) {
    				updating_answers = true;
    				sliderwrapper_changes.answers = /*answers*/ ctx[3];
    				add_flush_callback(() => updating_answers = false);
    			}

    			sliderwrapper.$set(sliderwrapper_changes);

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sliderwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sliderwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sliderwrapper, detaching);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(335:8) {#if questions[questionNum].type === \\\"slider\\\"}",
    		ctx
    	});

    	return block;
    }

    // (382:3) {:else}
    function create_else_block_3(ctx) {
    	let p;
    	let strong0;
    	let t0;
    	let t1_value = questions[/*questionNum*/ ctx[6]].label + "";
    	let t1;
    	let t2;
    	let t3_value = /*place*/ ctx[1].name + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] + "";
    	let t5;
    	let t6;
    	let t7_value = questions[/*questionNum*/ ctx[6]].unit + "";
    	let t7;
    	let t8;
    	let strong2;
    	let t9_value = higherLower(/*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] - /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour][questions[/*questionNum*/ ctx[6]].key]) + "";
    	let t9;
    	let t10;
    	let t11_value = /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour].name + "";
    	let t11;
    	let t12;
    	let t13_value = /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour][questions[/*questionNum*/ ctx[6]].key] + "";
    	let t13;
    	let t14_value = questions[/*questionNum*/ ctx[6]].unit + "";
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let if_block2_anchor;

    	function select_block_type_6(ctx, dirty) {
    		if (/*answers*/ ctx[3][/*questionNum*/ ctx[6]].correct) return create_if_block_14;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type_6(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = questions[/*questionNum*/ ctx[6]].linkText && create_if_block_13(ctx);

    	function select_block_type_7(ctx, dirty) {
    		if (/*questionNum*/ ctx[6] + 1 < questions.length) return create_if_block_12;
    		return create_else_block_4;
    	}

    	let current_block_type_1 = select_block_type_7(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong0 = element("strong");
    			if_block0.c();
    			t0 = text("\n              The ");
    			t1 = text(t1_value);
    			t2 = text(" in ");
    			t3 = text(t3_value);
    			t4 = text(" was\n              ");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(", which was ");
    			strong2 = element("strong");
    			t9 = text(t9_value);
    			t10 = text(" than ");
    			t11 = text(t11_value);
    			t12 = text(" (");
    			t13 = text(t13_value);
    			t14 = text(t14_value);
    			t15 = text(").");
    			t16 = space();
    			if (if_block1) if_block1.c();
    			t17 = space();
    			if_block2.c();
    			if_block2_anchor = empty();
    			add_location(strong0, file, 383, 14, 11014);
    			add_location(strong1, file, 391, 14, 11283);
    			add_location(strong2, file, 394, 27, 11425);
    			add_location(p, file, 382, 12, 10996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, strong0);
    			if_block0.m(strong0, null);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, strong1);
    			append_dev(strong1, t5);
    			append_dev(strong1, t6);
    			append_dev(strong1, t7);
    			append_dev(p, t8);
    			append_dev(p, strong2);
    			append_dev(strong2, t9);
    			append_dev(p, t10);
    			append_dev(p, t11);
    			append_dev(p, t12);
    			append_dev(p, t13);
    			append_dev(p, t14);
    			append_dev(p, t15);
    			insert_dev(target, t16, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t17, anchor);
    			if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_6(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(strong0, null);
    				}
    			}

    			if (dirty[0] & /*questionNum*/ 64 && t1_value !== (t1_value = questions[/*questionNum*/ ctx[6]].label + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*place*/ 2 && t3_value !== (t3_value = /*place*/ ctx[1].name + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*place, questionNum*/ 66 && t5_value !== (t5_value = /*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*questionNum*/ 64 && t7_value !== (t7_value = questions[/*questionNum*/ ctx[6]].unit + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*place, questionNum, lookup, answers*/ 78 && t9_value !== (t9_value = higherLower(/*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] - /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour][questions[/*questionNum*/ ctx[6]].key]) + "")) set_data_dev(t9, t9_value);
    			if (dirty[0] & /*lookup, answers, questionNum*/ 76 && t11_value !== (t11_value = /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour].name + "")) set_data_dev(t11, t11_value);
    			if (dirty[0] & /*lookup, answers, questionNum*/ 76 && t13_value !== (t13_value = /*lookup*/ ctx[2][/*answers*/ ctx[3][/*questionNum*/ ctx[6]].neighbour][questions[/*questionNum*/ ctx[6]].key] + "")) set_data_dev(t13, t13_value);
    			if (dirty[0] & /*questionNum*/ 64 && t14_value !== (t14_value = questions[/*questionNum*/ ctx[6]].unit + "")) set_data_dev(t14, t14_value);

    			if (questions[/*questionNum*/ ctx[6]].linkText) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_13(ctx);
    					if_block1.c();
    					if_block1.m(t17.parentNode, t17);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_7(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block0.d();
    			if (detaching) detach_dev(t16);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t17);
    			if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(382:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (378:3) {#if !answers[questionNum].set}
    function create_if_block_11(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Higher";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Lower";
    			attr_dev(button0, "class", "svelte-iu46a3");
    			add_location(button0, file, 378, 12, 10809);
    			attr_dev(button1, "class", "svelte-iu46a3");
    			add_location(button1, file, 379, 3, 10893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_7*/ ctx[23], false, false, false),
    					listen_dev(button1, "click", /*click_handler_8*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(378:3) {#if !answers[questionNum].set}",
    		ctx
    	});

    	return block;
    }

    // (387:16) {:else}
    function create_else_block_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Incorrect.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(387:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (385:16) {#if answers[questionNum].correct}
    function create_if_block_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Correct.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(385:16) {#if answers[questionNum].correct}",
    		ctx
    	});

    	return block;
    }

    // (400:12) {#if questions[questionNum].linkText}
    function create_if_block_13(ctx) {
    	let p;
    	let a;
    	let t_value = questions[/*questionNum*/ ctx[6]].linkText + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = questions[/*questionNum*/ ctx[6]].linkURL);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-iu46a3");
    			add_location(a, file, 401, 16, 11846);
    			add_location(p, file, 400, 14, 11826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questionNum*/ 64 && t_value !== (t_value = questions[/*questionNum*/ ctx[6]].linkText + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*questionNum*/ 64 && a_href_value !== (a_href_value = questions[/*questionNum*/ ctx[6]].linkURL)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(400:12) {#if questions[questionNum].linkText}",
    		ctx
    	});

    	return block;
    }

    // (410:12) {:else}
    function create_else_block_4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "View Results";
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 410, 14, 12171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_9*/ ctx[25], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(410:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (408:12) {#if questionNum + 1 < questions.length}
    function create_if_block_12(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next Question";
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 408, 14, 12082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextQuestion*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(408:12) {#if questionNum + 1 < questions.length}",
    		ctx
    	});

    	return block;
    }

    // (342:10) {:else}
    function create_else_block(ctx) {
    	let p;
    	let strong0;
    	let t0;
    	let t1_value = questions[/*questionNum*/ ctx[6]].label + "";
    	let t1;
    	let t2;
    	let t3_value = /*place*/ ctx[1].name + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] + "";
    	let t5;
    	let t6;
    	let t7_value = questions[/*questionNum*/ ctx[6]].unit + "";
    	let t7;
    	let t8;
    	let t9_value = adjectify(/*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key + "_quintile"]) + "";
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let if_block2_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*answers*/ ctx[3][/*questionNum*/ ctx[6]].correct) return create_if_block_9;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = questions[/*questionNum*/ ctx[6]].linkText && create_if_block_8(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*questionNum*/ ctx[6] + 1 < questions.length) return create_if_block_7;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_4(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong0 = element("strong");
    			if_block0.c();
    			t0 = text("\n              The ");
    			t1 = text(t1_value);
    			t2 = text(" in ");
    			t3 = text(t3_value);
    			t4 = text(" is\n              ");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(", which is ");
    			t9 = text(t9_value);
    			t10 = text(" average compared to other local authorities.");
    			t11 = space();
    			if (if_block1) if_block1.c();
    			t12 = space();
    			if_block2.c();
    			if_block2_anchor = empty();
    			add_location(strong0, file, 343, 14, 9584);
    			add_location(strong1, file, 351, 14, 9857);
    			add_location(p, file, 342, 12, 9566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, strong0);
    			if_block0.m(strong0, null);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, strong1);
    			append_dev(strong1, t5);
    			append_dev(strong1, t6);
    			append_dev(strong1, t7);
    			append_dev(p, t8);
    			append_dev(p, t9);
    			append_dev(p, t10);
    			insert_dev(target, t11, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t12, anchor);
    			if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(strong0, null);
    				}
    			}

    			if (dirty[0] & /*questionNum*/ 64 && t1_value !== (t1_value = questions[/*questionNum*/ ctx[6]].label + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*place*/ 2 && t3_value !== (t3_value = /*place*/ ctx[1].name + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*place, questionNum*/ 66 && t5_value !== (t5_value = /*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key] + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*questionNum*/ 64 && t7_value !== (t7_value = questions[/*questionNum*/ ctx[6]].unit + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*place, questionNum*/ 66 && t9_value !== (t9_value = adjectify(/*place*/ ctx[1][questions[/*questionNum*/ ctx[6]].key + "_quintile"]) + "")) set_data_dev(t9, t9_value);

    			if (questions[/*questionNum*/ ctx[6]].linkText) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(t12.parentNode, t12);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block0.d();
    			if (detaching) detach_dev(t11);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t12);
    			if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(342:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (340:10) {#if !answers[questionNum].set}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Guess";
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 340, 12, 9470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(340:10) {#if !answers[questionNum].set}",
    		ctx
    	});

    	return block;
    }

    // (347:16) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Not quite...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(347:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (345:16) {#if answers[questionNum].correct}
    function create_if_block_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Good guess!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(345:16) {#if answers[questionNum].correct}",
    		ctx
    	});

    	return block;
    }

    // (360:12) {#if questions[questionNum].linkText}
    function create_if_block_8(ctx) {
    	let p;
    	let a;
    	let t_value = questions[/*questionNum*/ ctx[6]].linkText + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = questions[/*questionNum*/ ctx[6]].linkURL);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-iu46a3");
    			add_location(a, file, 361, 16, 10238);
    			add_location(p, file, 360, 14, 10218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questionNum*/ 64 && t_value !== (t_value = questions[/*questionNum*/ ctx[6]].linkText + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*questionNum*/ 64 && a_href_value !== (a_href_value = questions[/*questionNum*/ ctx[6]].linkURL)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(360:12) {#if questions[questionNum].linkText}",
    		ctx
    	});

    	return block;
    }

    // (370:12) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "View Results";
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 370, 14, 10563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[22], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(370:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (368:12) {#if questionNum + 1 < questions.length}
    function create_if_block_7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next Question";
    			attr_dev(button, "class", "svelte-iu46a3");
    			add_location(button, file, 368, 14, 10474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextQuestion*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(368:12) {#if questionNum + 1 < questions.length}",
    		ctx
    	});

    	return block;
    }

    // (282:12) {#each data as d}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*d*/ ctx[32].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*d*/ ctx[32];
    			option.value = option.__value;
    			add_location(option, file, 282, 14, 7407);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1 && t_value !== (t_value = /*d*/ ctx[32].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*data*/ 1 && option_value_value !== (option_value_value = /*d*/ ctx[32])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(282:12) {#each data as d}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let main;
    	let current;
    	let if_block = /*place*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			main = element("main");
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-iu46a3");
    			add_location(main, file, 246, 0, 6158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*place*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*place*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function copyResultsFallback(text) {
    	var textArea = document.createElement("textarea");
    	textArea.value = text;

    	// Avoid scrolling to bottom
    	textArea.style.top = "0";

    	textArea.style.left = "0";
    	textArea.style.position = "fixed";
    	document.body.appendChild(textArea);
    	textArea.focus();
    	textArea.select();

    	try {
    		var successful = document.execCommand("copy");
    		var msg = successful ? "successful" : "unsuccessful";
    		console.log("Fallback: Copying text command was " + msg);
    		console.log(copyString);
    	} catch(err) {
    		console.error("Fallback: Oops, unable to copy", err);
    	}

    	document.body.removeChild(textArea);
    }

    const func = d => d ? "✅" : "❌";
    const click_handler_10 = d => d ? "✅" : "❌";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let theme = "light";
    	setContext("theme", theme);

    	// STATE
    	let data;

    	let lookup;
    	let place; // Selected row of data
    	let answers = [];
    	let score = 0;
    	let complete = false;
    	let screen = "start";
    	let questionNum = 0;
    	let resultsArray = [];
    	let tooltip = false;
    	let neighbourList;
    	let neighbourListFull;

    	function guess(i, correct) {
    		$$invalidate(3, answers[i].correct = correct, answers);
    		$$invalidate(3, answers[i].set = true, answers);
    		$$invalidate(4, score += answers[i].correct ? 1 : 0);
    		let comp = true;

    		answers.forEach(a => {
    			if (!a.set) comp = false;
    		});

    		complete = comp;
    		resultsArray.push(answers[i].correct);
    	}

    	function guessPercent(i) {
    		let vals = answers[i].vals;
    		let len = vals.length;
    		let plusminus = Math.round(0.15 * len); // Equivalent to +/- 15 percentiles
    		let index = vals.indexOf(place[questions[i].key]);

    		let max = index + plusminus >= len
    		? vals[len - 1]
    		: vals[index + plusminus];

    		let min = index - plusminus < 0
    		? vals[0]
    		: vals[index - plusminus];

    		let correct = answers[i].val >= min && answers[i].val <= max;
    		guess(i, correct);
    	}

    	function guessHigherLower(i, hl) {
    		let neighbour = lookup[answers[i].neighbour];
    		let key = questions[i].key;
    		let correct = hl == "higher" && place[key] >= neighbour[key] || hl == "lower" && place[key] <= neighbour[key];
    		guess(i, correct);
    	}

    	function reset() {
    		answers.forEach((a, i) => {
    			$$invalidate(3, answers[i].set = false, answers);
    			$$invalidate(4, score = 0);
    		});

    		$$invalidate(5, screen = "start");
    		$$invalidate(6, questionNum = 0);
    		$$invalidate(7, resultsArray = []);
    		console.log(place);
    	}

    	function nextQuestion() {
    		$$invalidate(6, questionNum++, questionNum);
    	} // console.log(answers);

    	function copyResults(results) {
    		$$invalidate(8, tooltip = true);

    		setTimeout(
    			async () => {
    				$$invalidate(8, tooltip = false);
    			},
    			400
    		);

    		var copyString = "I scored " + score + " out of " + questions.length + " in the ONS 'How Well Do You Know Your Area' quiz for " + place.name + ". " + results;

    		if (!navigator.clipboard) {
    			copyResultsFallback(copyString);
    			return;
    		}

    		navigator.clipboard.writeText(copyString).then(
    			function () {
    				console.log("Async: Copying to clipboard was successful!");
    				console.log(copyString);
    			},
    			function (err) {
    				console.error("Async: Could not copy text: ", err);
    			}
    		);
    	}

    	getData(urls.data).then(json => {
    		let hash = window.location.hash.replace("#", "");
    		$$invalidate(1, place = json.find(e => e.code == hash));

    		$$invalidate(1, place = place
    		? place
    		: json[Math.floor(Math.random() * json.length)]);

    		json.sort((a, b) => a.name.localeCompare(b.name));
    		let ans = [];

    		questions.forEach(q => {
    			let f = q.formatVal ? format(q.formatVal) : format(0);
    			let vals = json.map(d => d[q.key]).sort((a, b) => a - b);
    			let len = vals.length;
    			let randomNeighbour = neighbours[place.code][Math.floor(Math.random() * neighbours[place.code].length)];

    			let obj = {
    				neighbour: randomNeighbour,
    				vals,
    				breaks: [
    					vals[0],
    					vals[Math.floor(len * 0.2)],
    					vals[Math.floor(len * 0.4)],
    					vals[Math.floor(len * 0.6)],
    					vals[Math.floor(len * 0.8)],
    					vals[len - 1]
    				],
    				min: q.minVal != undefined ? q.minVal : Math.floor(vals[0]),
    				max: q.maxVal != undefined
    				? q.maxVal
    				: Math.ceil(vals[len - 1]),
    				avg: vals[Math.floor(len / 2)],
    				// val: (Math.floor(vals[0]) + Math.ceil(vals[len - 1])) / 2,
    				val: q.startVal != undefined
    				? q.startVal
    				: +f(vals[Math.floor(len / 2)]),
    				set: false
    			};

    			ans.push(obj);
    		});

    		$$invalidate(3, answers = ans);
    		console.log(answers);
    		let lkp = {};

    		json.forEach(d => {
    			questions.forEach((q, i) => {
    				let val = d[q.key];
    				let avg = answers[i].avg;
    				d[q.key + "_group"] = val > avg ? "higher" : val < avg ? "lower" : "median";
    				d[q.key + "_quintile"] = getQuantile(d[q.key], answers[i].breaks).toString();
    			});

    			lkp[d.code] = d;
    		});

    		$$invalidate(0, data = json);
    		$$invalidate(2, lookup = lkp);
    	}); // let code = window.location.hash.replace("#"," ")
    	// place = data.find(d => d.code == code)

    	function updateHash(place) {
    		// window.location.hash = '#' + place.code;
    		history.replaceState(undefined, undefined, "#" + place.code);

    		console.log(place);
    		console.log(data);
    	} // neighbourList = neighbours[place.code][0];
    	// neighbourList.map((n) => ({ ...n, code: "False" }));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => reset;
    	const click_handler_1 = () => $$invalidate(5, screen = "intro");

    	function select_change_handler() {
    		place = select_value(this);
    		$$invalidate(1, place);
    		$$invalidate(0, data);
    	}

    	const click_handler_2 = () => $$invalidate(5, screen = "question");
    	const click_handler_3 = () => $$invalidate(5, screen = "start");
    	const click_handler_4 = () => $$invalidate(5, screen = "question");

    	function sliderwrapper_answers_binding(value) {
    		answers = value;
    		$$invalidate(3, answers);
    	}

    	const click_handler_5 = () => guessPercent(questionNum);
    	const click_handler_6 = () => $$invalidate(5, screen = "results");
    	const click_handler_7 = () => guessHigherLower(questionNum, "higher");
    	const click_handler_8 = () => guessHigherLower(questionNum, "lower");
    	const click_handler_9 = () => $$invalidate(5, screen = "results");

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		themes,
    		urls,
    		questions,
    		colors,
    		getData,
    		getQuantile,
    		adjectify,
    		distinct,
    		format,
    		higherLower,
    		Filler,
    		Icon,
    		SliderWrapper,
    		Map: Map$1,
    		neighbours,
    		theme,
    		data,
    		lookup,
    		place,
    		answers,
    		score,
    		complete,
    		screen,
    		questionNum,
    		resultsArray,
    		tooltip,
    		neighbourList,
    		neighbourListFull,
    		guess,
    		guessPercent,
    		guessHigherLower,
    		reset,
    		nextQuestion,
    		copyResults,
    		copyResultsFallback,
    		updateHash
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) theme = $$props.theme;
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('lookup' in $$props) $$invalidate(2, lookup = $$props.lookup);
    		if ('place' in $$props) $$invalidate(1, place = $$props.place);
    		if ('answers' in $$props) $$invalidate(3, answers = $$props.answers);
    		if ('score' in $$props) $$invalidate(4, score = $$props.score);
    		if ('complete' in $$props) complete = $$props.complete;
    		if ('screen' in $$props) $$invalidate(5, screen = $$props.screen);
    		if ('questionNum' in $$props) $$invalidate(6, questionNum = $$props.questionNum);
    		if ('resultsArray' in $$props) $$invalidate(7, resultsArray = $$props.resultsArray);
    		if ('tooltip' in $$props) $$invalidate(8, tooltip = $$props.tooltip);
    		if ('neighbourList' in $$props) neighbourList = $$props.neighbourList;
    		if ('neighbourListFull' in $$props) neighbourListFull = $$props.neighbourListFull;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, place*/ 3) {
    			// neighbourList.forEach((n, i) => {
    			// console.log(n);
    			// neighbourListFull[i] = 'test'
    			// });
    			// console.log(neighbourListFull)
    			// $:data&&readHash()
    			data && updateHash(place);
    		}
    	};

    	return [
    		data,
    		place,
    		lookup,
    		answers,
    		score,
    		screen,
    		questionNum,
    		resultsArray,
    		tooltip,
    		guessPercent,
    		guessHigherLower,
    		reset,
    		nextQuestion,
    		copyResults,
    		click_handler,
    		click_handler_1,
    		select_change_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		sliderwrapper_answers_binding,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
