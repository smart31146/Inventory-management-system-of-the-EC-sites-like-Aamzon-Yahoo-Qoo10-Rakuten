export class DocumentNotFound extends Error {
  constructor(docId: string) {
    super(`Not found error: Document ${docId} not found.`);
  }
}
