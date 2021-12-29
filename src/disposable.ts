export type Disposer = () => void;

export default class Disposable {
  private $_disposers: Disposer[] = [];

  protected beforeDispose(disposer: Disposer): void {
    this.$_disposers.push(disposer);
  }

  dispose(): void {
    this.$_disposers.forEach((disposer) => {
      disposer();
    });
  }
}
