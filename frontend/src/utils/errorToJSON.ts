/* istanbul ignore file */

export function errorToJSON(): void;
export function errorToJSON(error: Error): string;
export function errorToJSON(error?: Error): string | void {
  if (!("toJSON" in Error.prototype))
    Object.defineProperty(Error.prototype, "toJSON", {
      value: function () {
        const errorRecord: Record<string, unknown> = {};
        Object.getOwnPropertyNames(this).forEach(function (key) {
          errorRecord[key] = this[key];
        }, this);

        return errorRecord;
      },
      configurable: true,
      writable: true
    });

  if (error) {
    return JSON.stringify(error);
  }
}
