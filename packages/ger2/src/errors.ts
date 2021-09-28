export class NamespaceDoestNotExist extends Error {
  constructor() {
    super();
    this.name = "NamespaceDoestNotExist";
    this.message = "namespace does not exist";
    (Error as any).captureStackTrace(this, NamespaceDoestNotExist);
  }
}
