import { Injectable, OnDestroy } from '@angular/core';
import { SubSink } from './sub-sink';

/**
* Una clase que cancela automáticamente la suscripción de todos los observables cuando el objeto se destruye
**/

@Injectable()
export class UnsubscribeOnDestroyAdapter implements OnDestroy {

  /**
  * El objeto receptor de suscripción que almacena todas las suscripciones.
  **/
  subs = new SubSink();

  
  /**
  * Cancela todas las suscripciones cuando el componente/objeto se destruye
  **/
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
