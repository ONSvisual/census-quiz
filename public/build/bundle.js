
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
            update: noop,
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
            this.$destroy = noop;
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

    function identity$1(x) {
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

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$1,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
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
        return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
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

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
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
      var scale = transform(identity$1, identity$1),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$1, identity$1)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
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
    	//data: 'https://bothness.github.io/geo-data/csv/census2011_lad2020.csv'
    	data: './data/census-data-2011.csv'
    };

    // Slider Questions:

    // - travel percentage train
    // - Percentage people economically inactive
    // - Change in unemployed people
    // - Male/female split
    // - Percentage people black
    // - Percentage of people white


    // Higher lower/Sort questions

    // - Population
    // - Median age
    // - Population Density
    // - number of unemployed people
    // - Number of students
    // - Percentage of people white


    // Still to do
    // Age

    // Health?

    // Should one of the comparisons be the average?

    // additional question parameters: legendUnit, questionGroup

    // added - customMin, customMax, customStartPos

    const questions = [
    	{
    		type: 'slider',
    		key: 'population_change',
    		label: 'population percentage change',
    		unit: '%',
    		text: 'By what percentage has the population of {place} increased or decreased between the 2011 and 2021 censuses?',
    		linkText: 'Learn more about population estimates',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
    		formatVal: 1
    	},
    	{
    		type: 'sort',
    		key: "population",
    		text: "Sort these local authorities in order of population, highest to lowest:",
    		unit: " people"
    	},
    	{
    		type: 'higher_lower',
    		key: 'population',
    		label: 'population change from 2001',
    		unit: '%',
    		text: 'Has the population in {place} grown more or less than average since 2001?'
    	},
    	{
    		type: 'slider',
    		key: 'tenure_owned',
    		label: 'proportion of people who own their home',
    		//does this include people who have paid off their mortgage? or do they come under "rent free"?
    		unit: '%',
    		text: 'What percentage of people in {place} own their own home?',
    		linkText: 'Learn more about dwellings and households by tenure',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
    	},
    	{
    		type: 'slider',
    		key: 'tenure_rented_private',
    		//is this obvious what is meant? 
    		label: 'proportion of people who rent privately',
    		unit: '%',
    		text: 'What percentage of people in {place} rent their home privately?',
    		linkText: 'Learn more about dwellings and households by tenure',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
    	},
    	{
    		type: 'slider',
    		key: 'tenure_owned',
    		//is this obvious what is meant? 
    		label: 'proportion of people who rent privately',
    		unit: '%',
    		text: 'What percentage of people in {place} rent their home privately?',
    		linkText: 'Learn more about dwellings and households by tenure',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
    	},
    	{
    		type: 'slider',
    		key: 'tenure_owned_change',
    		label: 'change in proportion of people who own their home',
    		unit: '%',
    		text: 'How has the percentage of people who own their own homes in {place} changed?',
    		linkText: 'Learn more about dwellings and households by tenure',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
    	},
    	{
    		type: 'slider',
    		key: 'density',
    		label: 'population density (people per hectare)',
    		unit: ' people',
    		text: 'What is the population density of {place} in people per hectare?',
    		// WHAT IS A HECTARE? give in a better comparison? football pitches?
    		scale: sqrt
    	},
    	// {
    	// 	type: 'slider',
    	// 	key: 'travel_perc_change_home',
    	// 	// is this what I think it is?
    	// 	label: 'change in percentage of people who work from home',
    	// 	unit: '%',
    	// 	text: 'How has the percentage of people who work from home in {place} changed in the last 10 years?',
    	// },
    	{
    		type: 'slider',
    		key: 'travel_car_van_change',
    		label: 'change in percentage of people who travel to work by car or van',
    		unit: '%',
    		text: 'How has the percentage of people who travel to work by car or van from {place} changed in the last 10 years?',
    		// from or in? In implies that they work in {place} but may not live there
    	},
    	{
    		type: 'slider',
    		key: 'travel_bicycle_change',
    		label: 'change in percentage of people who travel to work by bicycle',
    		unit: '%',
    		text: 'How has the percentage of people who travel to work by bicycle from {place} changed in the last 10 years?',
    		// from or in? In implies that they work in {place} but may not live there
    	},
    	{
    		type: 'higher_lower',
    		key: "population",
    		label: "number of people",
    		unit: " people",
    		text: "Are there more people living in {place} or {neighbour}?"
    	},
    	{
    		type: 'slider',
    		key: 'population',
    		label: 'number of people',
    		unit: ' people',
    		text: 'How many people live in {place}?',
    		linkText: 'Learn more about population estimates',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
    		minVal: 0,
    		maxVal: 1100000,
    		startVal: 500000,
    		formatVal: -3
    	},
    	// {
    	// 	type: 'slider',
    	// 	key: 'population_male',
    	// 	label: 'proportion of people who are male',
    	// 	unit: '%',
    	// 	text: 'What percentage of people in {place} are male?',
    	// 	//could also do: What is the percentage point difference between men and women in {place}? (negative indicates more women than men - should probably better label the axis)
    	// 	linkText: 'Learn more about households by tenure',
    	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020',
    	// 	formatVal: 1
    	// },

    	{
    		type: 'slider',
    		key: 'agemed',
    		label: 'average (median) age',
    		unit: ' years',
    		text: 'What is the average (median) age of people in {place}?',
    		linkText: 'Learn more about the median age of people across England and Wales',
    		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates'
    	},

    	{
    		type: 'slider',
    		key: 'age10yr_0-9',
    		label: 'percentage of people aged under 10',
    		unit: '%',
    		text: 'What percentage of people in {place} are aged under 10?'
    	},
    	{
    		type: 'slider',
    		key: 'age10yr_80plus',
    		label: 'percentage of people aged 80 or over',
    		unit: '%',
    		text: 'What percentage of people in {place} are aged 80 years or over?',
    		formatVal: 1
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

    function getBreaks(vals, count = 5) {
    	let breaks = [vals[0]];
    	let len = vals.length;
    	for (let i = 1; i <= count; i ++) {
    		breaks.push(vals[Math.floor(len * (i / count))]);
    	}
    	return breaks;
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

    function shuffle(array, random = Math.random) {
    	return array
    	.map(value => ({ value, sort: random() }))
    	.sort((a, b) => a.sort - b.sort)
    	.map(({ value }) => value);
    }

    /* src/ui/Icon.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/ui/Icon.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let path_d_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*paths*/ ctx[4][/*type*/ ctx[0]]);
    			add_location(path, file$5, 39, 2, 2923);
    			attr_dev(svg, "class", "icon svelte-nk8itm");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill-rule", "evenodd");
    			attr_dev(svg, "clip-rule", "evenodd");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "style", /*style*/ ctx[3]);
    			toggle_class(svg, "margin", /*margin*/ ctx[2]);
    			toggle_class(svg, "noclick", !/*clickable*/ ctx[1]);
    			add_location(svg, file$5, 29, 0, 2739);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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

    function instance$5($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
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
    			id: create_fragment$5.name
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

    /* src/ui/Tooltip.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/ui/Tooltip.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let style_transform = `translateX(${/*x*/ ctx[2] - /*xPos*/ ctx[6]}px)`;
    	let div1_resize_listener;
    	let style_top = `${/*y*/ ctx[3]}px`;
    	let style_left = `${/*xPos*/ ctx[6]}px`;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "caret svelte-1pmog3c");
    			toggle_class(div0, "caret-bottom", /*pos*/ ctx[4] == 'bottom');
    			toggle_class(div0, "caret-top", /*pos*/ ctx[4] == 'top');
    			set_style(div0, "transform", style_transform, false);
    			add_location(div0, file$4, 18, 2, 495);
    			attr_dev(div1, "class", "tooltip svelte-1pmog3c");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[9].call(div1));
    			toggle_class(div1, "tooltip-top", /*pos*/ ctx[4] == "top");
    			set_style(div1, "top", style_top, false);
    			set_style(div1, "left", style_left, false);
    			set_style(div1, "--bgcolor", /*bgcolor*/ ctx[5], false);
    			add_location(div1, file$4, 16, 0, 341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[9].bind(div1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (dirty & /*pos*/ 16) {
    				toggle_class(div0, "caret-bottom", /*pos*/ ctx[4] == 'bottom');
    			}

    			if (dirty & /*pos*/ 16) {
    				toggle_class(div0, "caret-top", /*pos*/ ctx[4] == 'top');
    			}

    			if (dirty & /*x, xPos*/ 68 && style_transform !== (style_transform = `translateX(${/*x*/ ctx[2] - /*xPos*/ ctx[6]}px)`)) {
    				set_style(div0, "transform", style_transform, false);
    			}

    			if (dirty & /*pos*/ 16) {
    				toggle_class(div1, "tooltip-top", /*pos*/ ctx[4] == "top");
    			}

    			if (dirty & /*y*/ 8 && style_top !== (style_top = `${/*y*/ ctx[3]}px`)) {
    				set_style(div1, "top", style_top, false);
    			}

    			if (dirty & /*xPos*/ 64 && style_left !== (style_left = `${/*xPos*/ ctx[6]}px`)) {
    				set_style(div1, "left", style_left, false);
    			}

    			if (dirty & /*bgcolor*/ 32) {
    				set_style(div1, "--bgcolor", /*bgcolor*/ ctx[5], false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			div1_resize_listener();
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
    	let xPos;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, []);
    	let { title } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { width } = $$props;
    	let { pos = "bottom" } = $$props;
    	let { xPad = 4 } = $$props;
    	let { bgcolor = null } = $$props;
    	let { w } = $$props;
    	const writable_props = ['title', 'x', 'y', 'width', 'pos', 'xPad', 'bgcolor', 'w'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	function div1_elementresize_handler() {
    		w = this.clientWidth;
    		$$invalidate(0, w);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('width' in $$props) $$invalidate(7, width = $$props.width);
    		if ('pos' in $$props) $$invalidate(4, pos = $$props.pos);
    		if ('xPad' in $$props) $$invalidate(8, xPad = $$props.xPad);
    		if ('bgcolor' in $$props) $$invalidate(5, bgcolor = $$props.bgcolor);
    		if ('w' in $$props) $$invalidate(0, w = $$props.w);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		title,
    		x,
    		y,
    		width,
    		pos,
    		xPad,
    		bgcolor,
    		w,
    		xPos
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('width' in $$props) $$invalidate(7, width = $$props.width);
    		if ('pos' in $$props) $$invalidate(4, pos = $$props.pos);
    		if ('xPad' in $$props) $$invalidate(8, xPad = $$props.xPad);
    		if ('bgcolor' in $$props) $$invalidate(5, bgcolor = $$props.bgcolor);
    		if ('w' in $$props) $$invalidate(0, w = $$props.w);
    		if ('xPos' in $$props) $$invalidate(6, xPos = $$props.xPos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*w, x, width, xPad*/ 389) {
    			$$invalidate(6, xPos = w && x + w / 2 > width - xPad
    			? width - w / 2 - xPad
    			: w && x - w / 2 < 0 + xPad ? w / 2 + xPad : x);
    		}
    	};

    	return [w, title, x, y, pos, bgcolor, xPos, width, xPad, div1_elementresize_handler];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			title: 1,
    			x: 2,
    			y: 3,
    			width: 7,
    			pos: 4,
    			xPad: 8,
    			bgcolor: 5,
    			w: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'title'");
    		}

    		if (/*x*/ ctx[2] === undefined && !('x' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[3] === undefined && !('y' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'y'");
    		}

    		if (/*width*/ ctx[7] === undefined && !('width' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'width'");
    		}

    		if (/*w*/ ctx[0] === undefined && !('w' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'w'");
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

    	get xPad() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPad(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgcolor() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgcolor(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get w() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set w(value) {
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

    		let bgcolor = element.dataset.tooltipBgcolor;
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
    				pos: top ? "top" : "bottom",
    				bgcolor: bgcolor
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

    /* src/ui/Thumb.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/ui/Thumb.svelte";

    function create_fragment$3(ctx) {
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
    			attr_dev(div0, "class", "thumb-content svelte-18gmkck");
    			toggle_class(div0, "active", /*active*/ ctx[1]);
    			add_location(div0, file$3, 15, 2, 432);
    			attr_dev(div1, "class", "thumb svelte-18gmkck");
    			attr_dev(div1, "style", div1_style_value = `left: ${/*pos*/ ctx[0] * 100}%;`);
    			add_location(div1, file$3, 8, 0, 187);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { pos: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thumb",
    			options,
    			id: create_fragment$3.name
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

    /* src/ui/Slider.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/ui/Slider.svelte";
    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
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
    			add_location(input, file$2, 66, 2, 1783);
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
    			add_location(div, file$2, 70, 2, 1882);
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
    	let style_left = `${/*pos*/ ctx[14][0] * 100}%`;
    	let t1;
    	let if_block_anchor;
    	let each_value_1 = /*data*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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
    			attr_dev(div, "data-tooltip-pos", "top");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$2, 78, 1, 2203);
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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, labelKey, format, valueKey, unit, min, max*/ 11576) {
    				each_value_1 = /*data*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
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
    function create_each_block_1$1(ctx) {
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
    			attr_dev(div, "data-tooltip-pos", "bottom");
    			attr_dev(div, "data-tooltip-bgcolor", "gray");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$2, 76, 1, 1998);
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
    		id: create_each_block_1$1.name,
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
    			if (dirty[0] & /*data, idKey, selected, valueKey, min, max*/ 5912) {
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
    	let style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "point selected svelte-11uhgxx");
    			attr_dev(div, "data-tooltip-pos", "top");
    			set_style(div, "left", style_left, false);
    			add_location(div, file$2, 81, 1, 2352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data, idKey, selected, valueKey, min, max*/ 5912 && style_left !== (style_left = `${100 * (/*d*/ ctx[32][/*valueKey*/ ctx[10]] - /*min*/ ctx[3]) / (/*max*/ ctx[4] - /*min*/ ctx[3])}%`)) {
    				set_style(div, "left", style_left, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    			add_location(div, file$2, 89, 8, 2617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
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
    			add_location(div, file$2, 97, 10, 2813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
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

    function create_fragment$2(ctx) {
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
    			add_location(input, file$2, 64, 0, 1713);
    			attr_dev(div, "class", "track svelte-11uhgxx");
    			add_location(div, file$2, 68, 0, 1845);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function checkPos(pos) {
    	return [Math.min(...pos), Math.max(...pos)];
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    			instance$2,
    			create_fragment$2,
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
    			id: create_fragment$2.name
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

    /* src/ui/SliderWrapper.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src/ui/SliderWrapper.svelte";

    // (33:1) {:else}
    function create_else_block$1(ctx) {
    	let tooltip0;
    	let updating_w;
    	let t;
    	let tooltip1;
    	let updating_w_1;
    	let current;

    	function tooltip0_w_binding(value) {
    		/*tooltip0_w_binding*/ ctx[11](value);
    	}

    	let tooltip0_props = {
    		x: /*x_guess*/ ctx[9],
    		y: -7,
    		width: /*w*/ ctx[4],
    		xPad: -7,
    		bgcolor: "#206095",
    		title: "Your guess " + /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].val) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit,
    		pos: "top"
    	};

    	if (/*w_guess*/ ctx[6] !== void 0) {
    		tooltip0_props.w = /*w_guess*/ ctx[6];
    	}

    	tooltip0 = new Tooltip({ props: tooltip0_props, $$inline: true });
    	binding_callbacks.push(() => bind(tooltip0, 'w', tooltip0_w_binding));

    	function tooltip1_w_binding(value) {
    		/*tooltip1_w_binding*/ ctx[13](value);
    	}

    	let tooltip1_props = {
    		x: /*x_actual*/ ctx[8],
    		y: Math.abs(/*x_actual*/ ctx[8] - /*x_guess*/ ctx[9]) < (/*w_guess*/ ctx[6] + /*w_actual*/ ctx[7]) / 2 + 20
    		? -40
    		: -7,
    		width: /*w*/ ctx[4],
    		xPad: -7,
    		title: "Actual " + /*f*/ ctx[10](/*data*/ ctx[2].find(/*func*/ ctx[12])[/*answers*/ ctx[0][/*qNum*/ ctx[1]].key]) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit,
    		pos: "top"
    	};

    	if (/*w_actual*/ ctx[7] !== void 0) {
    		tooltip1_props.w = /*w_actual*/ ctx[7];
    	}

    	tooltip1 = new Tooltip({ props: tooltip1_props, $$inline: true });
    	binding_callbacks.push(() => bind(tooltip1, 'w', tooltip1_w_binding));

    	const block = {
    		c: function create() {
    			create_component(tooltip0.$$.fragment);
    			t = space();
    			create_component(tooltip1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tooltip1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip0_changes = {};
    			if (dirty & /*x_guess*/ 512) tooltip0_changes.x = /*x_guess*/ ctx[9];
    			if (dirty & /*w*/ 16) tooltip0_changes.width = /*w*/ ctx[4];
    			if (dirty & /*f, answers, qNum*/ 1027) tooltip0_changes.title = "Your guess " + /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].val) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit;

    			if (!updating_w && dirty & /*w_guess*/ 64) {
    				updating_w = true;
    				tooltip0_changes.w = /*w_guess*/ ctx[6];
    				add_flush_callback(() => updating_w = false);
    			}

    			tooltip0.$set(tooltip0_changes);
    			const tooltip1_changes = {};
    			if (dirty & /*x_actual*/ 256) tooltip1_changes.x = /*x_actual*/ ctx[8];

    			if (dirty & /*x_actual, x_guess, w_guess, w_actual*/ 960) tooltip1_changes.y = Math.abs(/*x_actual*/ ctx[8] - /*x_guess*/ ctx[9]) < (/*w_guess*/ ctx[6] + /*w_actual*/ ctx[7]) / 2 + 20
    			? -40
    			: -7;

    			if (dirty & /*w*/ 16) tooltip1_changes.width = /*w*/ ctx[4];
    			if (dirty & /*f, data, place, answers, qNum*/ 1039) tooltip1_changes.title = "Actual " + /*f*/ ctx[10](/*data*/ ctx[2].find(/*func*/ ctx[12])[/*answers*/ ctx[0][/*qNum*/ ctx[1]].key]) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit;

    			if (!updating_w_1 && dirty & /*w_actual*/ 128) {
    				updating_w_1 = true;
    				tooltip1_changes.w = /*w_actual*/ ctx[7];
    				add_flush_callback(() => updating_w_1 = false);
    			}

    			tooltip1.$set(tooltip1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip0.$$.fragment, local);
    			transition_in(tooltip1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip0.$$.fragment, local);
    			transition_out(tooltip1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tooltip1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(33:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:1) {#if !answers[qNum].set}
    function create_if_block$1(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				x: (/*answers*/ ctx[0][/*qNum*/ ctx[1]].val - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) / (/*answers*/ ctx[0][/*qNum*/ ctx[1]].max - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) * /*w*/ ctx[4],
    				y: -7,
    				width: /*w*/ ctx[4],
    				xPad: -7,
    				title: "" + (/*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].val) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit),
    				pos: "top",
    				bgcolor: "#206095"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*answers, qNum, w*/ 19) tooltip_changes.x = (/*answers*/ ctx[0][/*qNum*/ ctx[1]].val - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) / (/*answers*/ ctx[0][/*qNum*/ ctx[1]].max - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) * /*w*/ ctx[4];
    			if (dirty & /*w*/ 16) tooltip_changes.width = /*w*/ ctx[4];
    			if (dirty & /*f, answers, qNum*/ 1027) tooltip_changes.title = "" + (/*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].val) + /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit);
    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(28:1) {#if !answers[qNum].set}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div0;
    	let t1_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].min) + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].max) + "";
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let t6_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].avg) + "";
    	let t6;
    	let t7;
    	let slider;
    	let updating_value;
    	let div3_resize_listener;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*answers*/ ctx[0][/*qNum*/ ctx[1]].set) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function slider_value_binding(value) {
    		/*slider_value_binding*/ ctx[14](value);
    	}

    	let slider_props = {
    		min: /*answers*/ ctx[0][/*qNum*/ ctx[1]].min,
    		max: /*answers*/ ctx[0][/*qNum*/ ctx[1]].max,
    		data: /*data*/ ctx[2],
    		selected: /*place*/ ctx[3].code,
    		valueKey: /*answers*/ ctx[0][/*qNum*/ ctx[1]].key,
    		disabled: /*answers*/ ctx[0][/*qNum*/ ctx[1]].set,
    		unit: /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit,
    		format: /*f*/ ctx[10],
    		dp: /*dp*/ ctx[5]
    	};

    	if (/*answers*/ ctx[0][/*qNum*/ ctx[1]].val !== void 0) {
    		slider_props.value = /*answers*/ ctx[0][/*qNum*/ ctx[1]].val;
    	}

    	slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, 'value', slider_value_binding));

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if_block.c();
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
    			attr_dev(div0, "class", "range-tick range-tick-left svelte-1nm6we");
    			set_style(div0, "left", "0");
    			add_location(div0, file$1, 38, 4, 1399);
    			attr_dev(div1, "class", "range-tick range-tick-right svelte-1nm6we");
    			set_style(div1, "left", "100%");
    			add_location(div1, file$1, 41, 4, 1500);
    			attr_dev(div2, "class", "range-tick avg-line svelte-1nm6we");
    			set_style(div2, "left", (/*answers*/ ctx[0][/*qNum*/ ctx[1]].avg - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) / (/*answers*/ ctx[0][/*qNum*/ ctx[1]].max - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) * 100 + "%");
    			add_location(div2, file$1, 44, 4, 1605);
    			attr_dev(div3, "class", "range-container svelte-1nm6we");
    			add_render_callback(() => /*div3_elementresize_handler*/ ctx[15].call(div3));
    			add_location(div3, file$1, 26, 0, 668);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			if_blocks[current_block_type_index].m(div3, null);
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
    			div3_resize_listener = add_resize_listener(div3, /*div3_elementresize_handler*/ ctx[15].bind(div3));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

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
    				if_block.m(div3, t0);
    			}

    			if ((!current || dirty & /*f, answers, qNum*/ 1027) && t1_value !== (t1_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].min) + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*f, answers, qNum*/ 1027) && t3_value !== (t3_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].max) + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*f, answers, qNum*/ 1027) && t6_value !== (t6_value = /*f*/ ctx[10](/*answers*/ ctx[0][/*qNum*/ ctx[1]].avg) + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*answers, qNum*/ 3) {
    				set_style(div2, "left", (/*answers*/ ctx[0][/*qNum*/ ctx[1]].avg - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) / (/*answers*/ ctx[0][/*qNum*/ ctx[1]].max - /*answers*/ ctx[0][/*qNum*/ ctx[1]].min) * 100 + "%");
    			}

    			const slider_changes = {};
    			if (dirty & /*answers, qNum*/ 3) slider_changes.min = /*answers*/ ctx[0][/*qNum*/ ctx[1]].min;
    			if (dirty & /*answers, qNum*/ 3) slider_changes.max = /*answers*/ ctx[0][/*qNum*/ ctx[1]].max;
    			if (dirty & /*data*/ 4) slider_changes.data = /*data*/ ctx[2];
    			if (dirty & /*place*/ 8) slider_changes.selected = /*place*/ ctx[3].code;
    			if (dirty & /*answers, qNum*/ 3) slider_changes.valueKey = /*answers*/ ctx[0][/*qNum*/ ctx[1]].key;
    			if (dirty & /*answers, qNum*/ 3) slider_changes.disabled = /*answers*/ ctx[0][/*qNum*/ ctx[1]].set;
    			if (dirty & /*answers, qNum*/ 3) slider_changes.unit = /*answers*/ ctx[0][/*qNum*/ ctx[1]].unit;
    			if (dirty & /*f*/ 1024) slider_changes.format = /*f*/ ctx[10];
    			if (dirty & /*dp*/ 32) slider_changes.dp = /*dp*/ ctx[5];

    			if (!updating_value && dirty & /*answers, qNum*/ 3) {
    				updating_value = true;
    				slider_changes.value = /*answers*/ ctx[0][/*qNum*/ ctx[1]].val;
    				add_flush_callback(() => updating_value = false);
    			}

    			slider.$set(slider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(slider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(slider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			destroy_component(slider);
    			div3_resize_listener();
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
    	let dp;
    	let f;
    	let x_guess;
    	let x_actual;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderWrapper', slots, []);
    	let { answers } = $$props;
    	let { qNum } = $$props;
    	let { data } = $$props;
    	let { place } = $$props;
    	let w;
    	let w_guess;
    	let w_actual;
    	console.log("answers log");
    	console.log(x_actual);
    	const writable_props = ['answers', 'qNum', 'data', 'place'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SliderWrapper> was created with unknown prop '${key}'`);
    	});

    	function tooltip0_w_binding(value) {
    		w_guess = value;
    		$$invalidate(6, w_guess);
    	}

    	const func = d => d.code == place.code;

    	function tooltip1_w_binding(value) {
    		w_actual = value;
    		$$invalidate(7, w_actual);
    	}

    	function slider_value_binding(value) {
    		if ($$self.$$.not_equal(answers[qNum].val, value)) {
    			answers[qNum].val = value;
    			$$invalidate(0, answers);
    		}
    	}

    	function div3_elementresize_handler() {
    		w = this.clientWidth;
    		$$invalidate(4, w);
    	}

    	$$self.$$set = $$props => {
    		if ('answers' in $$props) $$invalidate(0, answers = $$props.answers);
    		if ('qNum' in $$props) $$invalidate(1, qNum = $$props.qNum);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('place' in $$props) $$invalidate(3, place = $$props.place);
    	};

    	$$self.$capture_state = () => ({
    		format,
    		Slider,
    		Tooltip,
    		answers,
    		qNum,
    		data,
    		place,
    		w,
    		w_guess,
    		w_actual,
    		x_actual,
    		x_guess,
    		dp,
    		f
    	});

    	$$self.$inject_state = $$props => {
    		if ('answers' in $$props) $$invalidate(0, answers = $$props.answers);
    		if ('qNum' in $$props) $$invalidate(1, qNum = $$props.qNum);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('place' in $$props) $$invalidate(3, place = $$props.place);
    		if ('w' in $$props) $$invalidate(4, w = $$props.w);
    		if ('w_guess' in $$props) $$invalidate(6, w_guess = $$props.w_guess);
    		if ('w_actual' in $$props) $$invalidate(7, w_actual = $$props.w_actual);
    		if ('x_actual' in $$props) $$invalidate(8, x_actual = $$props.x_actual);
    		if ('x_guess' in $$props) $$invalidate(9, x_guess = $$props.x_guess);
    		if ('dp' in $$props) $$invalidate(5, dp = $$props.dp);
    		if ('f' in $$props) $$invalidate(10, f = $$props.f);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*answers, qNum*/ 3) {
    			$$invalidate(5, dp = answers[qNum].formatVal ? answers[qNum].formatVal : 0);
    		}

    		if ($$self.$$.dirty & /*dp*/ 32) {
    			$$invalidate(10, f = format(dp));
    		}

    		if ($$self.$$.dirty & /*answers, qNum, w*/ 19) {
    			$$invalidate(9, x_guess = (answers[qNum].val - answers[qNum].min) / (answers[qNum].max - answers[qNum].min) * w);
    		}

    		if ($$self.$$.dirty & /*data, place, answers, qNum, w*/ 31) {
    			$$invalidate(8, x_actual = (data.find(d => d.code == place.code)[answers[qNum].key] - answers[qNum].min) / (answers[qNum].max - answers[qNum].min) * w);
    		}
    	};

    	return [
    		answers,
    		qNum,
    		data,
    		place,
    		w,
    		dp,
    		w_guess,
    		w_actual,
    		x_actual,
    		x_guess,
    		f,
    		tooltip0_w_binding,
    		func,
    		tooltip1_w_binding,
    		slider_value_binding,
    		div3_elementresize_handler
    	];
    }

    class SliderWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { answers: 0, qNum: 1, data: 2, place: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderWrapper",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*answers*/ ctx[0] === undefined && !('answers' in props)) {
    			console_1$1.warn("<SliderWrapper> was created without expected prop 'answers'");
    		}

    		if (/*qNum*/ ctx[1] === undefined && !('qNum' in props)) {
    			console_1$1.warn("<SliderWrapper> was created without expected prop 'qNum'");
    		}

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console_1$1.warn("<SliderWrapper> was created without expected prop 'data'");
    		}

    		if (/*place*/ ctx[3] === undefined && !('place' in props)) {
    			console_1$1.warn("<SliderWrapper> was created without expected prop 'place'");
    		}
    	}

    	get answers() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answers(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get qNum() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set qNum(value) {
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

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (286:1) {#if place}
    function create_if_block(ctx) {
    	let header;
    	let button0;
    	let h1;
    	let t1;
    	let nav;
    	let button1;
    	let icon;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				type: /*fullscreen*/ ctx[8] ? "full_exit" : "full"
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_1, create_if_block_2, create_if_block_16];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*screen*/ ctx[4] === "start") return 0;
    		if (/*screen*/ ctx[4] === "question") return 1;
    		if (/*screen*/ ctx[4] === "results") return 2;
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
    			h1.textContent = "Census quiz";
    			t1 = space();
    			nav = element("nav");
    			button1 = element("button");
    			create_component(icon.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h1, "class", "svelte-1tavbne");
    			add_location(h1, file, 290, 27, 7102);
    			attr_dev(button0, "class", "btn-link btn-title svelte-1tavbne");
    			attr_dev(button0, "title", "Return to menu");
    			add_location(button0, file, 287, 3, 7009);
    			attr_dev(button1, "title", "Full screen mode");
    			attr_dev(button1, "class", "svelte-1tavbne");
    			add_location(button1, file, 293, 4, 7149);
    			attr_dev(nav, "class", "svelte-1tavbne");
    			add_location(nav, file, 292, 3, 7139);
    			attr_dev(header, "class", "svelte-1tavbne");
    			add_location(header, file, 286, 2, 6997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, button0);
    			append_dev(button0, h1);
    			append_dev(header, t1);
    			append_dev(header, nav);
    			append_dev(nav, button1);
    			mount_component(icon, button1, null);
    			insert_dev(target, t2, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[19], false, false, false),
    					listen_dev(button1, "click", /*toggleFullscreen*/ ctx[18], false, false, false),
    					action_destroyer(tooltip.call(null, button1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty[0] & /*fullscreen*/ 256) icon_changes.type = /*fullscreen*/ ctx[8] ? "full_exit" : "full";
    			icon.$set(icon_changes);
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
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(icon);
    			if (detaching) detach_dev(t2);

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
    		source: "(286:1) {#if place}",
    		ctx
    	});

    	return block;
    }

    // (541:33) 
    function create_if_block_16(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let t4;
    	let t5_value = /*answers*/ ctx[2].length + "";
    	let t5;
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*resultsArray*/ ctx[6].map(func_1).join("") + "";
    	let t8;
    	let t9;
    	let button0;
    	let t10;
    	let button1;
    	let mounted;
    	let dispose;

    	function select_block_type_8(ctx, dirty) {
    		if (/*copied*/ ctx[7]) return create_if_block_17;
    		return create_else_block_6;
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
    			t3 = text(/*score*/ ctx[3]);
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
    			attr_dev(h2, "class", "svelte-1tavbne");
    			add_location(h2, file, 542, 4, 13769);
    			add_location(p0, file, 544, 4, 13789);
    			add_location(p1, file, 546, 4, 13845);
    			attr_dev(button0, "class", "svelte-1tavbne");
    			add_location(button0, file, 548, 4, 13910);
    			attr_dev(button1, "class", "svelte-1tavbne");
    			add_location(button1, file, 560, 4, 14104);
    			attr_dev(div, "id", "game-container");
    			attr_dev(div, "class", "svelte-1tavbne");
    			add_location(div, file, 541, 3, 13739);
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
    							if (is_function(/*copyResults*/ ctx[16](/*resultsArray*/ ctx[6].map(click_handler_8).join("")))) /*copyResults*/ ctx[16](/*resultsArray*/ ctx[6].map(click_handler_8).join("")).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button1, "click", /*reset*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*score*/ 8) set_data_dev(t3, /*score*/ ctx[3]);
    			if (dirty[0] & /*answers*/ 4 && t5_value !== (t5_value = /*answers*/ ctx[2].length + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*resultsArray*/ 64 && t8_value !== (t8_value = /*resultsArray*/ ctx[6].map(func_1).join("") + "")) set_data_dev(t8, t8_value);

    			if (current_block_type !== (current_block_type = select_block_type_8(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(541:33) ",
    		ctx
    	});

    	return block;
    }

    // (346:34) 
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let span;
    	let t0;
    	let t1_value = /*qNum*/ ctx[5] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = /*answers*/ ctx[2].length + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let t6_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].text.replace("{place}", /*place*/ ctx[1].name).replace("{neighbour}", /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour.name) + "";
    	let t6;
    	let t7;
    	let div3;
    	let section;
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t8;
    	let current;
    	const if_block_creators = [create_if_block_5, create_if_block_9, create_if_block_13, create_else_block_5];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].type === "slider") return 0;
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].type === "higher_lower") return 1;
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].type === "sort") return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_7(ctx, dirty) {
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].set && /*qNum*/ ctx[5] + 1 < /*answers*/ ctx[2].length) return create_if_block_3;
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].set) return create_if_block_4;
    	}

    	let current_block_type = select_block_type_7(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			span = element("span");
    			t0 = text("Question ");
    			t1 = text(t1_value);
    			t2 = text(" of ");
    			t3 = text(t3_value);
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			section = element("section");
    			div2 = element("div");
    			if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			add_location(br, file, 351, 7, 8552);
    			attr_dev(span, "class", "text-lrg svelte-1tavbne");
    			add_location(span, file, 349, 6, 8474);
    			attr_dev(h2, "class", "svelte-1tavbne");
    			add_location(h2, file, 348, 5, 8463);
    			attr_dev(div0, "class", "svelte-1tavbne");
    			add_location(div0, file, 347, 4, 8452);
    			attr_dev(div1, "id", "q-container");
    			attr_dev(div1, "class", "svelte-1tavbne");
    			add_location(div1, file, 346, 3, 8425);
    			attr_dev(div2, "class", "svelte-1tavbne");
    			add_location(div2, file, 364, 5, 8827);
    			attr_dev(section, "class", "columns svelte-1tavbne");
    			add_location(section, file, 363, 4, 8796);
    			attr_dev(div3, "id", "game-container");
    			attr_dev(div3, "class", "svelte-1tavbne");
    			add_location(div3, file, 362, 3, 8766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, br);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, section);
    			append_dev(section, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t8);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*qNum*/ 32) && t1_value !== (t1_value = /*qNum*/ ctx[5] + 1 + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*answers*/ 4) && t3_value !== (t3_value = /*answers*/ ctx[2].length + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[0] & /*answers, qNum, place*/ 38) && t6_value !== (t6_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].text.replace("{place}", /*place*/ ctx[1].name).replace("{neighbour}", /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour.name) + "")) set_data_dev(t6, t6_value);
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
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, t8);
    			}

    			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();

    			if (if_block1) {
    				if_block1.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(346:34) ",
    		ctx
    	});

    	return block;
    }

    // (302:2) {#if screen === "start"}
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let span;
    	let t1;
    	let div3;
    	let section;
    	let div2;
    	let p0;
    	let t3;
    	let p1;
    	let t7;
    	let p2;
    	let t9;
    	let hr;
    	let t10;
    	let p3;
    	let t11;
    	let select;
    	let t12;
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
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			span = element("span");
    			span.textContent = "How well do you know your area?";
    			t1 = space();
    			div3 = element("div");
    			section = element("section");
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "Census data can help us to better understand the\n\t\t\t\t\t\t\tarea we live in.";
    			t3 = space();
    			p1 = element("p");

    			p1.textContent = `Answer these ${/*numberOfQuestions*/ ctx[9]} questions 
							to test your knowledge of your local authority area,
							and find out how it compares to the rest England and Wales.`;

    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "This demonstrator currently uses 2011 census data";
    			t9 = space();
    			hr = element("hr");
    			t10 = space();
    			p3 = element("p");
    			t11 = text("Choose an area\n\t\t\t\t\t\t\t");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			button = element("button");
    			button.textContent = "Start quiz";
    			attr_dev(span, "class", "text-lrg svelte-1tavbne");
    			add_location(span, file, 305, 6, 7408);
    			attr_dev(h2, "class", "svelte-1tavbne");
    			add_location(h2, file, 304, 5, 7397);
    			attr_dev(div0, "class", "svelte-1tavbne");
    			add_location(div0, file, 303, 4, 7386);
    			attr_dev(div1, "id", "q-container");
    			attr_dev(div1, "class", "svelte-1tavbne");
    			add_location(div1, file, 302, 3, 7359);
    			attr_dev(p0, "class", "text-big");
    			set_style(p0, "margin-top", "5px");
    			add_location(p0, file, 314, 6, 7593);
    			attr_dev(p1, "class", "text-big");
    			add_location(p1, file, 318, 6, 7735);
    			add_location(p2, file, 324, 6, 7952);
    			attr_dev(hr, "class", "svelte-1tavbne");
    			add_location(hr, file, 326, 6, 8016);
    			if (/*place*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[20].call(select));
    			add_location(select, file, 330, 7, 8088);
    			set_style(p3, "margin-top", "20px");
    			add_location(p3, file, 328, 6, 8030);
    			attr_dev(button, "class", "btn-menu btn-primary mb-5 svelte-1tavbne");
    			add_location(button, file, 337, 6, 8238);
    			attr_dev(div2, "class", "svelte-1tavbne");
    			add_location(div2, file, 313, 5, 7581);
    			attr_dev(section, "class", "columns svelte-1tavbne");
    			add_location(section, file, 312, 4, 7550);
    			attr_dev(div3, "id", "game-container");
    			attr_dev(div3, "class", "svelte-1tavbne");
    			add_location(div3, file, 311, 3, 7520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, section);
    			append_dev(section, div2);
    			append_dev(div2, p0);
    			append_dev(div2, t3);
    			append_dev(div2, p1);
    			append_dev(div2, t7);
    			append_dev(div2, p2);
    			append_dev(div2, t9);
    			append_dev(div2, hr);
    			append_dev(div2, t10);
    			append_dev(div2, p3);
    			append_dev(p3, t11);
    			append_dev(p3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*place*/ ctx[1]);
    			append_dev(div2, t12);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[20]),
    					listen_dev(button, "click", /*startQuiz*/ ctx[17], false, false, false)
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(302:2) {#if screen === \\\"start\\\"}",
    		ctx
    	});

    	return block;
    }

    // (556:5) {:else}
    function create_else_block_6(ctx) {
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
    		id: create_else_block_6.name,
    		type: "else",
    		source: "(556:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (554:5) {#if copied}
    function create_if_block_17(ctx) {
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
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(554:5) {#if copied}",
    		ctx
    	});

    	return block;
    }

    // (526:6) {:else}
    function create_else_block_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Error: Unknown Question Type";
    			add_location(div, file, 526, 7, 13336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(526:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (478:46) 
    function create_if_block_13(ctx) {
    	let table;
    	let tbody;
    	let t;
    	let if_block_anchor;
    	let current;
    	let each_value_2 = /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function select_block_type_5(ctx, dirty) {
    		if (!/*answers*/ ctx[2][/*qNum*/ ctx[5]].set) return create_if_block_14;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_5(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(tbody, file, 479, 8, 11802);
    			attr_dev(table, "class", "sort svelte-1tavbne");
    			add_location(table, file, 478, 7, 11773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*answers, qNum, sortNeighbours*/ 8228) {
    				each_value_2 = /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

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
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(478:46) ",
    		ctx
    	});

    	return block;
    }

    // (415:54) 
    function create_if_block_9(ctx) {
    	let div;
    	let t0;
    	let button0;
    	let t1;
    	let button0_disabled_value;
    	let t2;
    	let button1;
    	let t3;
    	let button1_disabled_value;
    	let t4;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*answers*/ ctx[2][/*qNum*/ ctx[5]].set && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			button0 = element("button");
    			t1 = text("Higher");
    			t2 = space();
    			button1 = element("button");
    			t3 = text("Lower");
    			t4 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file, 415, 7, 10074);
    			button0.disabled = button0_disabled_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].set;
    			attr_dev(button0, "class", "svelte-1tavbne");
    			toggle_class(button0, "correct", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "higher" && /*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			toggle_class(button0, "incorrect", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "higher" && !/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			add_location(button0, file, 417, 7, 10090);
    			button1.disabled = button1_disabled_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].set;
    			attr_dev(button1, "class", "svelte-1tavbne");
    			toggle_class(button1, "correct", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "lower" && /*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			toggle_class(button1, "incorrect", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "lower" && !/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			add_location(button1, file, 425, 7, 10403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t3);
    			insert_dev(target, t4, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[23], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*answers, qNum*/ 36 && button0_disabled_value !== (button0_disabled_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].set)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*answers, qNum*/ 36) {
    				toggle_class(button0, "correct", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "higher" && /*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			}

    			if (dirty[0] & /*answers, qNum*/ 36) {
    				toggle_class(button0, "incorrect", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "higher" && !/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			}

    			if (dirty[0] & /*answers, qNum*/ 36 && button1_disabled_value !== (button1_disabled_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].set)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*answers, qNum*/ 36) {
    				toggle_class(button1, "correct", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "lower" && /*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			}

    			if (dirty[0] & /*answers, qNum*/ 36) {
    				toggle_class(button1, "incorrect", /*answers*/ ctx[2][/*qNum*/ ctx[5]].val == "lower" && !/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct);
    			}

    			if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].set) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_10(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t4);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(415:54) ",
    		ctx
    	});

    	return block;
    }

    // (368:6) {#if answers[qNum].type === "slider"}
    function create_if_block_5(ctx) {
    	let sliderwrapper;
    	let updating_answers;
    	let t;
    	let if_block_anchor;
    	let current;

    	function sliderwrapper_answers_binding(value) {
    		/*sliderwrapper_answers_binding*/ ctx[21](value);
    	}

    	let sliderwrapper_props = {
    		qNum: /*qNum*/ ctx[5],
    		data: /*data*/ ctx[0],
    		place: /*place*/ ctx[1]
    	};

    	if (/*answers*/ ctx[2] !== void 0) {
    		sliderwrapper_props.answers = /*answers*/ ctx[2];
    	}

    	sliderwrapper = new SliderWrapper({
    			props: sliderwrapper_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(sliderwrapper, 'answers', sliderwrapper_answers_binding));

    	function select_block_type_2(ctx, dirty) {
    		if (!/*answers*/ ctx[2][/*qNum*/ ctx[5]].set) return create_if_block_6;
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
    			if (dirty[0] & /*qNum*/ 32) sliderwrapper_changes.qNum = /*qNum*/ ctx[5];
    			if (dirty[0] & /*data*/ 1) sliderwrapper_changes.data = /*data*/ ctx[0];
    			if (dirty[0] & /*place*/ 2) sliderwrapper_changes.place = /*place*/ ctx[1];

    			if (!updating_answers && dirty[0] & /*answers*/ 4) {
    				updating_answers = true;
    				sliderwrapper_changes.answers = /*answers*/ ctx[2];
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
    		source: "(368:6) {#if answers[qNum].type === \\\"slider\\\"}",
    		ctx
    	});

    	return block;
    }

    // (481:9) {#each answers[qNum].neighbours as neighbour, i}
    function create_each_block_2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*i*/ ctx[41] + 1 + "";
    	let t0;
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*neighbour*/ ctx[39].name + "";
    	let t3;
    	let t4;
    	let td2;
    	let button0;
    	let icon0;
    	let button0_disabled_value;
    	let button0_title_value;
    	let t5;
    	let button1;
    	let icon1;
    	let button1_disabled_value;
    	let button1_title_value;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { type: "chevron", rotation: 90 },
    			$$inline: true
    		});

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[25](/*i*/ ctx[41]);
    	}

    	icon1 = new Icon({
    			props: { type: "chevron", rotation: -90 },
    			$$inline: true
    		});

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[26](/*i*/ ctx[41]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = text(".");
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t5 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t6 = space();
    			attr_dev(td0, "class", "svelte-1tavbne");
    			add_location(td0, file, 482, 10, 11892);
    			attr_dev(td1, "class", "svelte-1tavbne");
    			add_location(td1, file, 483, 10, 11920);
    			button0.disabled = button0_disabled_value = /*i*/ ctx[41] == 0 || /*answers*/ ctx[2][/*qNum*/ ctx[5]].set;
    			attr_dev(button0, "title", button0_title_value = "Move " + /*neighbour*/ ctx[39].name + " up");
    			attr_dev(button0, "class", "svelte-1tavbne");
    			add_location(button0, file, 485, 11, 11972);
    			button1.disabled = button1_disabled_value = /*i*/ ctx[41] == /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours.length - 1 || /*answers*/ ctx[2][/*qNum*/ ctx[5]].set;
    			attr_dev(button1, "title", button1_title_value = "Move " + /*neighbour*/ ctx[39].name + " down");
    			attr_dev(button1, "class", "svelte-1tavbne");
    			add_location(button1, file, 488, 11, 12179);
    			attr_dev(td2, "class", "svelte-1tavbne");
    			add_location(td2, file, 484, 10, 11956);
    			attr_dev(tr, "class", "svelte-1tavbne");
    			add_location(tr, file, 481, 9, 11877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, button0);
    			mount_component(icon0, button0, null);
    			append_dev(td2, t5);
    			append_dev(td2, button1);
    			mount_component(icon1, button1, null);
    			append_dev(tr, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_4, false, false, false),
    					listen_dev(button1, "click", click_handler_5, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*answers, qNum*/ 36) && t3_value !== (t3_value = /*neighbour*/ ctx[39].name + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty[0] & /*answers, qNum*/ 36 && button0_disabled_value !== (button0_disabled_value = /*i*/ ctx[41] == 0 || /*answers*/ ctx[2][/*qNum*/ ctx[5]].set)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty[0] & /*answers, qNum*/ 36 && button0_title_value !== (button0_title_value = "Move " + /*neighbour*/ ctx[39].name + " up")) {
    				attr_dev(button0, "title", button0_title_value);
    			}

    			if (!current || dirty[0] & /*answers, qNum*/ 36 && button1_disabled_value !== (button1_disabled_value = /*i*/ ctx[41] == /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours.length - 1 || /*answers*/ ctx[2][/*qNum*/ ctx[5]].set)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty[0] & /*answers, qNum*/ 36 && button1_title_value !== (button1_title_value = "Move " + /*neighbour*/ ctx[39].name + " down")) {
    				attr_dev(button1, "title", button1_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(481:9) {#each answers[qNum].neighbours as neighbour, i}",
    		ctx
    	});

    	return block;
    }

    // (502:7) {:else}
    function create_else_block_3(ctx) {
    	let p;
    	let strong;
    	let t0;
    	let t1;
    	let table;
    	let tbody;

    	function select_block_type_6(ctx, dirty) {
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct) return create_if_block_15;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_6(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = [.../*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours].sort(/*func*/ ctx[28]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong = element("strong");
    			if_block.c();
    			t0 = text("\n\t\t\t\t\t\t\t\t\tThe correct order of the areas is:");
    			t1 = space();
    			table = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(strong, file, 503, 9, 12645);
    			add_location(p, file, 502, 8, 12632);
    			add_location(tbody, file, 514, 9, 12886);
    			attr_dev(table, "class", "sort svelte-1tavbne");
    			add_location(table, file, 513, 8, 12856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, strong);
    			if_block.m(strong, null);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_6(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(strong, null);
    				}
    			}

    			if (dirty[0] & /*answers, qNum*/ 36) {
    				each_value_1 = [.../*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbours].sort(/*func*/ ctx[28]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(502:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (498:7) {#if !answers[qNum].set}
    function create_if_block_14(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Submit";
    			attr_dev(button, "class", "svelte-1tavbne");
    			add_location(button, file, 498, 8, 12533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(498:7) {#if !answers[qNum].set}",
    		ctx
    	});

    	return block;
    }

    // (507:10) {:else}
    function create_else_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Bad luck!");
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
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(507:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (505:10) {#if answers[qNum].correct}
    function create_if_block_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Good answer!");
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
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(505:10) {#if answers[qNum].correct}",
    		ctx
    	});

    	return block;
    }

    // (516:10) {#each [...answers[qNum].neighbours].sort((a, b) => b[answers[qNum].key] - a[answers[qNum].key]) as neighbour, i}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*i*/ ctx[41] + 1 + "";
    	let t0;
    	let t1;
    	let t2;
    	let td1;
    	let t3_value = /*neighbour*/ ctx[39].name + "";
    	let t3;
    	let t4;
    	let td2;

    	let t5_value = format(/*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    	? /*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    	: 0)(/*neighbour*/ ctx[39][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "";

    	let t5;
    	let t6_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = text(".");
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			t5 = text(t5_value);
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "svelte-1tavbne");
    			add_location(td0, file, 517, 11, 13044);
    			attr_dev(td1, "class", "svelte-1tavbne");
    			add_location(td1, file, 518, 11, 13073);
    			attr_dev(td2, "class", "svelte-1tavbne");
    			add_location(td2, file, 519, 11, 13110);
    			attr_dev(tr, "class", "svelte-1tavbne");
    			add_location(tr, file, 516, 10, 13028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, t5);
    			append_dev(td2, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*answers, qNum*/ 36 && t3_value !== (t3_value = /*neighbour*/ ctx[39].name + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*answers, qNum*/ 36 && t5_value !== (t5_value = format(/*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    			? /*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    			: 0)(/*neighbour*/ ctx[39][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "")) set_data_dev(t5, t5_value);

    			if (dirty[0] & /*answers, qNum*/ 36 && t6_value !== (t6_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(516:10) {#each [...answers[qNum].neighbours].sort((a, b) => b[answers[qNum].key] - a[answers[qNum].key]) as neighbour, i}",
    		ctx
    	});

    	return block;
    }

    // (435:7) {#if answers[qNum].set}
    function create_if_block_10(ctx) {
    	let p;
    	let strong0;
    	let t0;
    	let t1_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].label + "";
    	let t1;
    	let t2;
    	let t3_value = /*place*/ ctx[1].name + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] + "";
    	let t5;
    	let t6;
    	let t7_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "";
    	let t7;
    	let t8;
    	let strong2;
    	let t9_value = higherLower(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] - /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour[/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "";
    	let t9;
    	let t10;
    	let t11_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour[/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] + "";
    	let t11;
    	let t12_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "";
    	let t12;
    	let t13;
    	let t14;
    	let if_block1_anchor;

    	function select_block_type_4(ctx, dirty) {
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct) return create_if_block_12;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong0 = element("strong");
    			if_block0.c();
    			t0 = text("\n\t\t\t\t\t\t\t\t\tThe ");
    			t1 = text(t1_value);
    			t2 = text(" in ");
    			t3 = text(t3_value);
    			t4 = text("\n\t\t\t\t\t\t\t\t\twas\n\t\t\t\t\t\t\t\t\t");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(", which was\n\t\t\t\t\t\t\t\t\t");
    			strong2 = element("strong");
    			t9 = text(t9_value);
    			t10 = text("\n\t\t\t\t\t\t\t\t\tthan the average (median) of ");
    			t11 = text(t11_value);
    			t12 = text(t12_value);
    			t13 = text(" across all local\n\t\t\t\t\t\t\t\t\tauthorities.");
    			t14 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(strong0, file, 436, 9, 10758);
    			add_location(strong1, file, 445, 9, 10973);
    			add_location(strong2, file, 449, 9, 11089);
    			add_location(p, file, 435, 8, 10745);
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
    			insert_dev(target, t14, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_4(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(strong0, null);
    				}
    			}

    			if (dirty[0] & /*answers, qNum*/ 36 && t1_value !== (t1_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].label + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*place*/ 2 && t3_value !== (t3_value = /*place*/ ctx[1].name + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*place, answers, qNum*/ 38 && t5_value !== (t5_value = /*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*answers, qNum*/ 36 && t7_value !== (t7_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*place, answers, qNum*/ 38 && t9_value !== (t9_value = higherLower(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] - /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour[/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "")) set_data_dev(t9, t9_value);
    			if (dirty[0] & /*answers, qNum*/ 36 && t11_value !== (t11_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].neighbour[/*answers*/ ctx[2][/*qNum*/ ctx[5]].key] + "")) set_data_dev(t11, t11_value);
    			if (dirty[0] & /*answers, qNum*/ 36 && t12_value !== (t12_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "")) set_data_dev(t12, t12_value);

    			if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block0.d();
    			if (detaching) detach_dev(t14);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(435:7) {#if answers[qNum].set}",
    		ctx
    	});

    	return block;
    }

    // (440:10) {:else}
    function create_else_block_2(ctx) {
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
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(440:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (438:10) {#if answers[qNum].correct}
    function create_if_block_12(ctx) {
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
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(438:10) {#if answers[qNum].correct}",
    		ctx
    	});

    	return block;
    }

    // (466:8) {#if answers[qNum].linkText}
    function create_if_block_11(ctx) {
    	let p;
    	let a;
    	let t_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkURL);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1tavbne");
    			add_location(a, file, 467, 10, 11532);
    			add_location(p, file, 466, 9, 11518);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*answers, qNum*/ 36 && t_value !== (t_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*answers, qNum*/ 36 && a_href_value !== (a_href_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkURL)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(466:8) {#if answers[qNum].linkText}",
    		ctx
    	});

    	return block;
    }

    // (381:7) {:else}
    function create_else_block(ctx) {
    	let p;
    	let strong0;
    	let t0;
    	let t1_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].label + "";
    	let t1;
    	let t2;
    	let t3_value = /*place*/ ctx[1].name + "";
    	let t3;
    	let t4;
    	let strong1;

    	let t5_value = format(/*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    	? /*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    	: 0)(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "";

    	let t5;
    	let t6;
    	let t7_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "";
    	let t7;
    	let t8;
    	let t9_value = adjectify(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key + "_quintile"]) + "";
    	let t9;
    	let t10;
    	let t11;
    	let if_block1_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].correct) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong0 = element("strong");
    			if_block0.c();
    			t0 = text("\n\t\t\t\t\t\t\t\t\tThe ");
    			t1 = text(t1_value);
    			t2 = text(" in ");
    			t3 = text(t3_value);
    			t4 = text("\n\t\t\t\t\t\t\t\t\tis\n\t\t\t\t\t\t\t\t\t");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(", which is ");
    			t9 = text(t9_value);
    			t10 = text(" average compared with other local authorities.");
    			t11 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(strong0, file, 382, 9, 9210);
    			add_location(strong1, file, 391, 9, 9427);
    			add_location(p, file, 381, 8, 9197);
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
    			insert_dev(target, if_block1_anchor, anchor);
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

    			if (dirty[0] & /*answers, qNum*/ 36 && t1_value !== (t1_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].label + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*place*/ 2 && t3_value !== (t3_value = /*place*/ ctx[1].name + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*answers, qNum, place*/ 38 && t5_value !== (t5_value = format(/*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    			? /*answers*/ ctx[2][/*qNum*/ ctx[5]].formatVal
    			: 0)(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key]) + "")) set_data_dev(t5, t5_value);

    			if (dirty[0] & /*answers, qNum*/ 36 && t7_value !== (t7_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].unit + "")) set_data_dev(t7, t7_value);
    			if (dirty[0] & /*place, answers, qNum*/ 38 && t9_value !== (t9_value = adjectify(/*place*/ ctx[1][/*answers*/ ctx[2][/*qNum*/ ctx[5]].key + "_quintile"]) + "")) set_data_dev(t9, t9_value);

    			if (/*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if_block0.d();
    			if (detaching) detach_dev(t11);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(381:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (376:7) {#if !answers[qNum].set}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Submit";
    			attr_dev(button, "class", "svelte-1tavbne");
    			add_location(button, file, 376, 8, 9086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[22], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
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
    		source: "(376:7) {#if !answers[qNum].set}",
    		ctx
    	});

    	return block;
    }

    // (386:10) {:else}
    function create_else_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Bad luck!");
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(386:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (384:10) {#if answers[qNum].correct}
    function create_if_block_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Good answer!");
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(384:10) {#if answers[qNum].correct}",
    		ctx
    	});

    	return block;
    }

    // (403:8) {#if answers[qNum].linkText}
    function create_if_block_7(ctx) {
    	let p;
    	let a;
    	let t_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkURL);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1tavbne");
    			add_location(a, file, 404, 10, 9825);
    			add_location(p, file, 403, 9, 9811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*answers, qNum*/ 36 && t_value !== (t_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkText + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*answers, qNum*/ 36 && a_href_value !== (a_href_value = /*answers*/ ctx[2][/*qNum*/ ctx[5]].linkURL)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(403:8) {#if answers[qNum].linkText}",
    		ctx
    	});

    	return block;
    }

    // (533:34) 
    function create_if_block_4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "View results";
    			attr_dev(button, "class", "svelte-1tavbne");
    			add_location(button, file, 533, 7, 13568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_7*/ ctx[29], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(533:34) ",
    		ctx
    	});

    	return block;
    }

    // (529:6) {#if answers[qNum].set && qNum + 1 < answers.length}
    function create_if_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next question";
    			attr_dev(button, "class", "svelte-1tavbne");
    			add_location(button, file, 529, 7, 13454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*nextQuestion*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(529:6) {#if answers[qNum].set && qNum + 1 < answers.length}",
    		ctx
    	});

    	return block;
    }

    // (332:8) {#each data as d}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*d*/ ctx[36].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*d*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file, 332, 9, 8151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1 && t_value !== (t_value = /*d*/ ctx[36].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*data*/ 1 && option_value_value !== (option_value_value = /*d*/ ctx[36])) {
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
    		source: "(332:8) {#each data as d}",
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
    			attr_dev(main, "class", "svelte-1tavbne");
    			add_location(main, file, 284, 0, 6975);
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

    const func_1 = d => d ? "✅" : "🟥";
    const click_handler_8 = d => d ? "✅" : "🟥";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let theme = "light";
    	setContext("theme", theme);

    	// STATE
    	let data;

    	let lookup;
    	let place; // Selected row of data
    	let numberOfQuestions = 8;
    	let answers = [];
    	let score = 0;
    	let complete = false;
    	let screen = "start";
    	let qNum = 0;
    	let resultsArray = [];
    	let copied = false;
    	let fullscreen = false;

    	function guess(i, correct) {
    		$$invalidate(2, answers[i].correct = correct, answers);
    		$$invalidate(2, answers[i].set = true, answers);
    		$$invalidate(3, score += answers[i].correct ? 1 : 0);
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
    		let index = vals.indexOf(place[answers[i].key]);

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
    		let neighbour = answers[i].neighbour;
    		let key = answers[i].key;
    		let correct = hl == "higher" && place[key] >= neighbour[key] || hl == "lower" && place[key] <= neighbour[key];
    		$$invalidate(2, answers[i].val = hl, answers);
    		guess(i, correct);
    	}

    	function guessSort(i) {
    		let arr = answers[i].neighbours;
    		let key = answers[i].key;
    		let sorted = [...arr].sort((a, b) => b[key] - a[key]);
    		let check = arr.map((d, i) => d[key] == sorted[i][key]);
    		console.log(arr, sorted, check);
    		guess(i, !check.includes(false));
    	}

    	function sortNeighbours(i, array_ind, change) {
    		let arr = [...answers[i].neighbours];
    		let new_ind = array_ind + change;
    		arr.splice(array_ind, 1);
    		arr.splice(new_ind, 0, answers[i].neighbours[array_ind]);
    		$$invalidate(2, answers[i].neighbours = arr, answers);
    	}

    	function reset() {
    		answers.forEach((a, i) => {
    			$$invalidate(2, answers[i].set = false, answers);
    			$$invalidate(3, score = 0);
    		});

    		$$invalidate(4, screen = "start");
    		$$invalidate(5, qNum = 0);
    		$$invalidate(6, resultsArray = []);
    		console.log(place);
    	}

    	function nextQuestion() {
    		$$invalidate(5, qNum++, qNum);
    	} // console.log(answers);

    	function copyResults(results) {
    		$$invalidate(7, copied = true);

    		setTimeout(
    			async () => {
    				$$invalidate(7, copied = false);
    			},
    			1000
    		);

    		var copyString = "I scored " + score + " out of " + answers.length + " in the ONS 'How Well Do You Know Your Area' quiz for " + place.name + ". " + results;

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
    		let lkp = {};

    		json.forEach(d => {
    			questions.forEach((q, i) => {
    				let val = d[q.key];
    				let vals = json.map(d => d[q.key]).sort((a, b) => a[q.key] - b[q.key]);
    				let breaks = getBreaks(vals);
    				let avg = vals[Math.floor(vals.length / 2)];
    				d[q.key + "_group"] = val > avg ? "higher" : val < avg ? "lower" : "median";
    				d[q.key + "_quintile"] = getQuantile(d[q.key], breaks).toString();
    			});

    			lkp[d.code] = d;
    		});

    		$$invalidate(0, data = json);
    		lookup = lkp;
    	}); // let code = window.location.hash.replace("#"," ")
    	// place = data.find(d => d.code == code)

    	function startQuiz() {
    		let ans = [];

    		shuffle(questions).slice(0, numberOfQuestions).forEach(q => {
    			let f = q.formatVal ? format(q.formatVal) : format(0);
    			let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
    			let vals = sorted.map(d => d[q.key]);
    			let len = vals.length;

    			let val = q.type == "higher_lower"
    			? null
    			: q.startVal != undefined
    				? q.startVal
    				: +f(vals[Math.floor(len / 2)]);

    			let neighboursRand = shuffle(neighbours[place.code].filter(n => data.map(d => d.code).includes(n))).slice(0, 2).map(d => lookup[d]);

    			let obj = {
    				...q,
    				neighbour: sorted[Math.floor(len / 2)],
    				neighbours: shuffle([...neighboursRand, place]),
    				vals,
    				breaks: getBreaks(vals),
    				min: q.minVal != undefined ? q.minVal : Math.floor(vals[0]),
    				max: q.maxVal != undefined
    				? q.maxVal
    				: Math.ceil(vals[len - 1]),
    				avg: vals[Math.floor(len / 2)],
    				val,
    				set: false
    			};

    			ans.push(obj);
    		});

    		$$invalidate(2, answers = ans);
    		console.log(answers);
    		$$invalidate(4, screen = "question");
    	}

    	function updateHash(place) {
    		// window.location.hash = '#' + place.code;
    		history.replaceState(undefined, undefined, "#" + place.code);

    		console.log(place);
    		console.log(data);
    	} // neighbourList = neighbours[place.code][0];
    	// neighbourList.map((n) => ({ ...n, code: "False" }));

    	// neighbourList.forEach((n, i) => {
    	// console.log(n);
    	// neighbourListFull[i] = 'test'
    	// });
    	// console.log(neighbourListFull)
    	function updateNeighbours(place) {
    		answers.forEach(a => {
    			let neighboursRand = shuffle(neighbours[place.code].filter(n => data.map(d => d.code).includes(n))).slice(0, 2).map(d => lookup[d]);
    			a.neighbours = shuffle([...neighboursRand, place]);
    		});

    		$$invalidate(2, answers);
    	}

    	function toggleFullscreen() {
    		if (!fullscreen) {
    			document.body.requestFullscreen();
    			$$invalidate(8, fullscreen = true);
    		} else {
    			document.exitFullscreen();
    			$$invalidate(8, fullscreen = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => reset;

    	function select_change_handler() {
    		place = select_value(this);
    		$$invalidate(1, place);
    		$$invalidate(0, data);
    	}

    	function sliderwrapper_answers_binding(value) {
    		answers = value;
    		$$invalidate(2, answers);
    	}

    	const click_handler_1 = () => guessPercent(qNum);
    	const click_handler_2 = () => guessHigherLower(qNum, "higher");
    	const click_handler_3 = () => guessHigherLower(qNum, "lower");
    	const click_handler_4 = i => sortNeighbours(qNum, i, -1);
    	const click_handler_5 = i => sortNeighbours(qNum, i, 1);
    	const click_handler_6 = () => guessSort(qNum);
    	const func = (a, b) => b[answers[qNum].key] - a[answers[qNum].key];
    	const click_handler_7 = () => $$invalidate(4, screen = "results");

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		themes,
    		urls,
    		questions,
    		colors,
    		getData,
    		getBreaks,
    		getQuantile,
    		adjectify,
    		distinct,
    		format,
    		higherLower,
    		shuffle,
    		tooltip,
    		Icon,
    		SliderWrapper,
    		neighbours,
    		theme,
    		data,
    		lookup,
    		place,
    		numberOfQuestions,
    		answers,
    		score,
    		complete,
    		screen,
    		qNum,
    		resultsArray,
    		copied,
    		fullscreen,
    		guess,
    		guessPercent,
    		guessHigherLower,
    		guessSort,
    		sortNeighbours,
    		reset,
    		nextQuestion,
    		copyResults,
    		copyResultsFallback,
    		startQuiz,
    		updateHash,
    		updateNeighbours,
    		toggleFullscreen
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) theme = $$props.theme;
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('lookup' in $$props) lookup = $$props.lookup;
    		if ('place' in $$props) $$invalidate(1, place = $$props.place);
    		if ('numberOfQuestions' in $$props) $$invalidate(9, numberOfQuestions = $$props.numberOfQuestions);
    		if ('answers' in $$props) $$invalidate(2, answers = $$props.answers);
    		if ('score' in $$props) $$invalidate(3, score = $$props.score);
    		if ('complete' in $$props) complete = $$props.complete;
    		if ('screen' in $$props) $$invalidate(4, screen = $$props.screen);
    		if ('qNum' in $$props) $$invalidate(5, qNum = $$props.qNum);
    		if ('resultsArray' in $$props) $$invalidate(6, resultsArray = $$props.resultsArray);
    		if ('copied' in $$props) $$invalidate(7, copied = $$props.copied);
    		if ('fullscreen' in $$props) $$invalidate(8, fullscreen = $$props.fullscreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, place*/ 3) {
    			// $:data&&readHash()
    			data && updateHash(place);
    		}

    		if ($$self.$$.dirty[0] & /*place*/ 2) {
    			updateNeighbours(place);
    		}
    	};

    	return [
    		data,
    		place,
    		answers,
    		score,
    		screen,
    		qNum,
    		resultsArray,
    		copied,
    		fullscreen,
    		numberOfQuestions,
    		guessPercent,
    		guessHigherLower,
    		guessSort,
    		sortNeighbours,
    		reset,
    		nextQuestion,
    		copyResults,
    		startQuiz,
    		toggleFullscreen,
    		click_handler,
    		select_change_handler,
    		sliderwrapper_answers_binding,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		func,
    		click_handler_7
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
