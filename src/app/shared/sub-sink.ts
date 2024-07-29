import { SubscriptionLike } from 'rxjs';

/**
 * Suma de suscripciones que contiene suscripciones a Observables
 * hasta que llamas a unsubscribe en ngOnDestroy.
 */
export class SubSink {
  protected _subs: SubscriptionLike[] = [];

  /**
   * Suma de suscripciones que contiene suscripciones a Observables
   * hasta que llamas a unsubscribe en ngOnDestroy.
   *
   * @example
   * En Angular:
   * ```
   *   private subs = new SubSink();
   *   ...
   *   this.subs.sink = observable$.subscribe(
   *   this.subs.add(observable$.subscribe(...));
   *   ...
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   * ```
   */
  constructor() {
    //constructor
  }

  /**
   * Añadir suscripciones a las suscripciones rastreadas
   * @example
   *  this.subs.add(observable$.subscribe(...));
   */
  add(...subscriptions: SubscriptionLike[]) {
    this._subs = this._subs.concat(subscriptions);
  }

  /**
   * Asignar suscripción a este sink para añadirla a las suscripciones rastreadas
   * @example
   *  this.subs.sink = observable$.subscribe(...);
   */
  set sink(subscription: SubscriptionLike) {
    this._subs.push(subscription);
  }

  /**
   * Desuscribirse de todas las suscripciones en ngOnDestroy()
   * @example
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   */
  unsubscribe() {
    this._subs.forEach((sub) => sub && sub.unsubscribe());
    this._subs = [];
  }
}
