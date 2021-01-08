/* istanbul ignore file */

export const errorToJSON = (error?: Error): void | string => {
  if (!("toJSON" in Error.prototype))
    Object.defineProperty(Error.prototype, "toJSON", {
      value: function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const alt: any = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
          alt[key] = this[key];
        }, this);

        return alt;
      },
      configurable: true,
      writable: true
    });

  if (error) {
    return JSON.stringify(error);
  }
};
