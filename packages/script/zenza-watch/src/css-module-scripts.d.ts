/**
 * TODO: Blocked by microsoft/TypeScript#56359
 *
 * ```ts
 * declare module "*" with { type: "css" } {
 *   declare const _default: CSSStyleSheet;
 *   export default _default;
 * }
 * ```
 *
 * or
 *
 * ```ts
 * declare with { type: "css" } {
 *   declare const _default: CSSStyleSheet;
 *   export default _default;
 * }
 * ```
 */

declare module "*.css" {
  declare const _default: CSSStyleSheet;
  export default _default;
}
