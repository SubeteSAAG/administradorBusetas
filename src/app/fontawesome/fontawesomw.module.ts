import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FONTAWESOME_ICONS } from '@fontawes/fontawesomw';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class CustomFontAwesomeModule {
  constructor(library: FaIconLibrary) {
    // Registrar los iconos en la biblioteca
    for (const icon of Object.values(FONTAWESOME_ICONS)) {
      library.addIcons(icon);
    }
  }
}