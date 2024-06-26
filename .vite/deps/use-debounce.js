import {
  require_react
} from "./chunk-SOSU2OUM.js";
import {
  __toESM
} from "./chunk-2LSFTFF7.js";

// node_modules/use-debounce/dist/index.module.js
var import_react = __toESM(require_react());
function c(u2, e2, c2) {
  var i2 = this, a2 = (0, import_react.useRef)(null), o2 = (0, import_react.useRef)(0), f2 = (0, import_react.useRef)(null), l = (0, import_react.useRef)([]), m = (0, import_react.useRef)(), v = (0, import_react.useRef)(), d = (0, import_react.useRef)(u2), p = (0, import_react.useRef)(true);
  (0, import_react.useEffect)(function() {
    d.current = u2;
  }, [u2]);
  var g = !e2 && 0 !== e2 && "undefined" != typeof window;
  if ("function" != typeof u2)
    throw new TypeError("Expected a function");
  e2 = +e2 || 0;
  var w = !!(c2 = c2 || {}).leading, s = !("trailing" in c2) || !!c2.trailing, x = "maxWait" in c2, y = x ? Math.max(+c2.maxWait || 0, e2) : null;
  (0, import_react.useEffect)(function() {
    return p.current = true, function() {
      p.current = false;
    };
  }, []);
  var h = (0, import_react.useMemo)(function() {
    var r2 = function(r3) {
      var n3 = l.current, t3 = m.current;
      return l.current = m.current = null, o2.current = r3, v.current = d.current.apply(t3, n3);
    }, n2 = function(r3, n3) {
      g && cancelAnimationFrame(f2.current), f2.current = g ? requestAnimationFrame(r3) : setTimeout(r3, n3);
    }, t2 = function(r3) {
      if (!p.current)
        return false;
      var n3 = r3 - a2.current;
      return !a2.current || n3 >= e2 || n3 < 0 || x && r3 - o2.current >= y;
    }, u3 = function(n3) {
      return f2.current = null, s && l.current ? r2(n3) : (l.current = m.current = null, v.current);
    }, c3 = function r3() {
      var c4 = Date.now();
      if (t2(c4))
        return u3(c4);
      if (p.current) {
        var i3 = e2 - (c4 - a2.current), f3 = x ? Math.min(i3, y - (c4 - o2.current)) : i3;
        n2(r3, f3);
      }
    }, h2 = function() {
      var u4 = Date.now(), d2 = t2(u4);
      if (l.current = [].slice.call(arguments), m.current = i2, a2.current = u4, d2) {
        if (!f2.current && p.current)
          return o2.current = a2.current, n2(c3, e2), w ? r2(a2.current) : v.current;
        if (x)
          return n2(c3, e2), r2(a2.current);
      }
      return f2.current || n2(c3, e2), v.current;
    };
    return h2.cancel = function() {
      f2.current && (g ? cancelAnimationFrame(f2.current) : clearTimeout(f2.current)), o2.current = 0, l.current = a2.current = m.current = f2.current = null;
    }, h2.isPending = function() {
      return !!f2.current;
    }, h2.flush = function() {
      return f2.current ? u3(Date.now()) : v.current;
    }, h2;
  }, [w, x, e2, y, s, g]);
  return h;
}
function i(r2, n2) {
  return r2 === n2;
}
function a(r2) {
  return "function" == typeof r2 ? function() {
    return r2;
  } : r2;
}
function o(n2, t2, o2) {
  var f2, l, m = o2 && o2.equalityFn || i, v = (f2 = (0, import_react.useState)(a(n2)), l = f2[1], [f2[0], (0, import_react.useCallback)(function(r2) {
    return l(a(r2));
  }, [])]), d = v[0], p = v[1], g = c((0, import_react.useCallback)(function(r2) {
    return p(r2);
  }, [p]), t2, o2), w = (0, import_react.useRef)(n2);
  return m(w.current, n2) || (g(n2), w.current = n2), [d, g];
}
function f(r2, n2, t2) {
  var u2 = void 0 === t2 ? {} : t2, e2 = u2.leading, i2 = u2.trailing;
  return c(r2, n2, { maxWait: n2, leading: void 0 === e2 || e2, trailing: void 0 === i2 || i2 });
}
export {
  o as useDebounce,
  c as useDebouncedCallback,
  f as useThrottledCallback
};
//# sourceMappingURL=use-debounce.js.map
